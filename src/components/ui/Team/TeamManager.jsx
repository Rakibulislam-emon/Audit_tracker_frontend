"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus, AlertCircle } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import RelationSelect from "../dynamic/UniversalRelationSelect";
import UniversalStaticSelect from "../dynamic/UniversalStaticSelect";

// Hooks & Config
import { universalConfig } from "@/config/dynamicConfig";
import {
  useModuleData,
  useCreateModule,
  useDeleteModule,
} from "@/hooks/useUniversal";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const MODULE_NAME = "teams";
const DEFAULT_FORM_VALUES = {
  user: "",
  roleInTeam: "",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if user is already in the team
 */
const isUserAlreadyInTeam = (currentTeam, userId) => {
  return currentTeam.some((member) => member.user?._id === userId);
};

/**
 * Shows confirmation toast for removal
 */
const showRemoveConfirmation = (onConfirm) => {
  toast.warning("Are you sure you want to remove this member?", {
    action: {
      label: "Confirm",
      onClick: onConfirm,
    },
    cancel: {
      label: "Cancel",
    },
  });
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Loading state for team list
 */
const TeamLoadingState = () => (
  <div className="p-4 text-center text-gray-500">
    <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
    Loading team members...
  </div>
);

/**
 * Empty state for team list
 */
const TeamEmptyState = () => (
  <div className="p-4 text-center text-gray-500">
    <AlertCircle className="h-4 w-4 inline-block mr-2" />
    No team members assigned yet.
  </div>
);

/**
 * Individual team member row
 */
const TeamMemberRow = ({ teamMember, onRemove, isDeleting }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50">
    <div>
      <div className="font-medium">{teamMember.user?.name}</div>
      <div className="text-sm text-gray-500">
        {teamMember.user?.email}
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
        {teamMember.roleInTeam}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onRemove(teamMember._id)}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

/**
 * Add member form component
 */
const AddMemberForm = ({ 
  control, 
  errors, 
  isCreating, 
  onSubmit, 
  token 
}) => {
  const userFieldConfig = universalConfig.teams.fields.user;
  const roleFieldConfig = universalConfig.teams.fields.roleInTeam;

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white"
    >
      {/* User Select ComboBox */}
      <div className="md:col-span-1">
        <RelationSelect
          fieldKey="user"
          fieldConfig={userFieldConfig}
          control={control}
          token={token}
          errors={errors}
          isSubmitting={isCreating}
        />
      </div>

      {/* Role Select Dropdown */}
      <div className="md:col-span-1">
        <UniversalStaticSelect
          fieldKey="roleInTeam"
          fieldConfig={roleFieldConfig}
          control={control}
          errors={errors}
          isSubmitting={isCreating}
        />
      </div>

      {/* Add Button */}
      <div className="md:col-span-1">
        <Button type="submit" disabled={isCreating} className="w-full">
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          Add Member
        </Button>
      </div>
    </form>
  );
};

/**
 * Team members list component
 */
const TeamMembersList = ({ 
  currentTeam, 
  isLoadingTeam, 
  onRemoveMember, 
  isDeleting 
}) => (
  <div className="border rounded-lg bg-white overflow-hidden">
    <div className="divide-y">
      {isLoadingTeam && <TeamLoadingState />}
      
      {!isLoadingTeam && currentTeam.length === 0 && <TeamEmptyState />}
      
      {currentTeam.map((teamMember) => (
        <TeamMemberRow
          key={teamMember._id}
          teamMember={teamMember}
          onRemove={onRemoveMember}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TeamManager({ auditSessionId }) {
  // ===========================================================================
  // HOOKS & STATE
  // ===========================================================================
  
  const { token } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================
  
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    refetch,
  } = useModuleData(MODULE_NAME, token, {
    auditSession: auditSessionId,
  });

  const currentTeam = teamData?.data || [];

  // ===========================================================================
  // MUTATIONS
  // ===========================================================================
  
  const { mutate: createTeamMember, isPending: isCreating } = useCreateModule(
    MODULE_NAME,
    token
  );
  
  const { mutate: deleteTeamMember, isPending: isDeleting } = useDeleteModule(
    MODULE_NAME,
    token
  );

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  
  const handleAddMember = (formData) => {
    if (isUserAlreadyInTeam(currentTeam, formData.user)) {
      toast.error("This user is already in the team.");
      return;
    }

    createTeamMember(
      {
        ...formData,
        auditSession: auditSessionId,
      },
      {
        onSuccess: () => {
          toast.success("Team member added!");
          refetch();
          reset();
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  const handleRemoveMember = (teamDocumentId) => {
    showRemoveConfirmation(() => {
      deleteTeamMember(teamDocumentId, {
        onSuccess: () => {
          toast.success("Team member removed!");
          refetch();
        },
        onError: (error) => toast.error(error.message),
      });
    });
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  
  return (
    <div className="space-y-6">
      {/* Add Member Form */}
      <AddMemberForm
        control={control}
        errors={errors}
        isCreating={isCreating}
        onSubmit={handleSubmit(handleAddMember)}
        token={token}
      />

      {/* Team Members List */}
      <TeamMembersList
        currentTeam={currentTeam}
        isLoadingTeam={isLoadingTeam}
        onRemoveMember={handleRemoveMember}
        isDeleting={isDeleting}
      />
    </div>
  );
}