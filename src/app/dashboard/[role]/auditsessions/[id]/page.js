"use client";

import {
  AlertCircle,
  Calendar,
  Factory,
  FileText,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";

// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamManager from "@/components/ui/Team/TeamManager";

// Stores & Hooks
import { useModuleDataById } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const MODULE_NAME = "auditSessions";
const TAB_VALUES = {
  TEAM: "team",
  OBSERVATIONS: "observations",
  PROBLEMS: "problems",
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Information card for displaying session details
 */
const InfoCard = ({ icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="text-gray-500">{icon}</div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
};

/**
 * Loading state component
 */
const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

/**
 * Error state component
 */
const ErrorState = ({ error }) => (
  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
    <AlertCircle className="h-5 w-5" />
    <p>Error loading audit session: {error.message}</p>
  </div>
);

/**
 * Session header with key information
 */
const SessionHeader = ({ session }) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : null;
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">
        {session.schedule?.title || "Audit Session"}
      </h1>
      <p className="text-lg text-gray-500">{session.site?.name}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <InfoCard
          icon={<Calendar className="h-4 w-4" />}
          label="Status"
          value={session.workflowStatus}
        />
        <InfoCard
          icon={<Factory className="h-4 w-4" />}
          label="Site"
          value={session.site?.name}
        />
        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          label="Template"
          value={session.template?.title}
        />
        <InfoCard
          icon={<Calendar className="h-4 w-4" />}
          label="Started On"
          value={formatDate(session.startDate)}
        />
      </div>
    </div>
  );
};

/**
 * Tab content for team management
 */
const TeamTabContent = ({ sessionId }) => (
  <TabsContent value={TAB_VALUES.TEAM} className="mt-4">
    <TeamManager auditSessionId={sessionId} />
  </TabsContent>
);

/**
 * Tab content for observations (placeholder)
 */
const ObservationsTabContent = () => (
  <TabsContent value={TAB_VALUES.OBSERVATIONS} className="mt-4">
    <p>Observation recording component will go here.</p>
  </TabsContent>
);

/**
 * Tab content for problems (placeholder)
 */
const ProblemsTabContent = () => (
  <TabsContent value={TAB_VALUES.PROBLEMS} className="mt-4">
    <p>Problem management component will go here.</p>
  </TabsContent>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AuditSessionDetailsPage() {
  // ===========================================================================
  // HOOKS & PARAMS
  // ===========================================================================

  const params = useParams();
  const { id } = params;
  const { token } = useAuthStore();

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================

  const {
    data: session,
    isLoading,
    error,
  } = useModuleDataById(MODULE_NAME, token, id);

  // ===========================================================================
  // RENDER STATES
  // ===========================================================================

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // ===========================================================================
  // MAIN RENDER
  // ===========================================================================

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Session Header */}
      <SessionHeader session={session} />

      {/* Tab Navigation */}
      <Tabs defaultValue={TAB_VALUES.TEAM} className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value={TAB_VALUES.TEAM}>Team (Step 7)</TabsTrigger>
          <TabsTrigger value={TAB_VALUES.OBSERVATIONS} disabled>
            Observations (Step 8)
          </TabsTrigger>
          <TabsTrigger value={TAB_VALUES.PROBLEMS} disabled>
            Problems (Step 9)
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TeamTabContent sessionId={session._id} />
        <ObservationsTabContent />
        <ProblemsTabContent />
      </Tabs>
    </div>
  );
}
