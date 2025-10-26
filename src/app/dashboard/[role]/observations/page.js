"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ObservationsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["observations"];

  return (
    <div>
      <UniversalCRUDManager
        module="observations"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add observations"
      />
    </div>
  );
}
