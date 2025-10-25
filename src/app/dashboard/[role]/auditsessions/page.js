"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuditSessionsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["auditSessions"];

  return (
    <div>
      <UniversalCRUDManager
        module="auditSessions"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add auditSessions"
      />
    </div>
  );
}
