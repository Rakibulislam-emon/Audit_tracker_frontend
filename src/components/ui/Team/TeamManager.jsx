"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { AlertCircle, Loader2, Trash2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RelationSelect from "../dynamic/UniversalRelationSelect";
import UniversalStaticSelect from "../dynamic/UniversalStaticSelect";

// Hooks & Config
import { universalConfig } from "@/config/dynamicConfig";
import {
  useCreateModule,
  useDeleteModule,
  useModuleData,
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

const isUserAlreadyInTeam = (currentTeam, userId) => {
  return currentTeam.some((member) => member.user?._id === userId);
};

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

const TeamLoadingState = () => (
  <div className="flex items-center justify-center p-8 text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin mr-3" />
    <span className="text-sm">Loading team members...</span>
  </div>
);

const TeamEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
    <AlertCircle className="h-8 w-8 mb-2" />
    <p className="text-sm font-medium">No team members assigned</p>
    <p className="text-xs mt-1">Add team members to get started</p>
  </div>
);

const TeamMemberRow = ({ teamMember, onRemove, isDeleting }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {teamMember.user?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {teamMember.user?.email}
          </p>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="text-xs font-medium">
        {teamMember.roleInTeam}
      </Badge>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onRemove(teamMember._id)}
        disabled={isDeleting}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </Button>
    </div>
  </div>
);

const AddMemberForm = ({ control, errors, isCreating, onSubmit, token }) => {
  const userFieldConfig = universalConfig.teams.fields.user;
  const roleFieldConfig = universalConfig.teams.fields.roleInTeam;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Add Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RelationSelect
                fieldKey="user"
                fieldConfig={userFieldConfig}
                control={control}
                token={token}
                errors={errors}
                isSubmitting={isCreating}
              />
            </div>
            <div>
              <UniversalStaticSelect
                fieldKey="roleInTeam"
                fieldConfig={roleFieldConfig}
                control={control}
                errors={errors}
                isSubmitting={isCreating}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isCreating}
            className="w-full md:w-auto"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const TeamMembersList = ({
  currentTeam,
  isLoadingTeam,
  onRemoveMember,
  isDeleting,
}) => (
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">
        Team Members ({currentTeam.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {isLoadingTeam && <TeamLoadingState />}

      {!isLoadingTeam && currentTeam.length === 0 && <TeamEmptyState />}

      {!isLoadingTeam && currentTeam.length > 0 && (
        <div className="divide-y">
          {currentTeam.map((teamMember) => (
            <TeamMemberRow
              key={teamMember._id}
              teamMember={teamMember}
              onRemove={onRemoveMember}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
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
          toast.success("Team member added successfully");
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
          toast.success("Team member removed successfully");
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
