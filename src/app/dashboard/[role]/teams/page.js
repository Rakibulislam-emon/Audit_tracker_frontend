"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TeamsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["teams"];

  return (
    <div>
      <UniversalCRUDManager
        module="teams"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add teams"
      />
    </div>
  );
}
