"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProgramsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["programs"];

  return (
    <div>
      <UniversalCRUDManager
        module="programs"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add programs"
      />
    </div>
  );
}
