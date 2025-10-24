"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RuleManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["rules"];

  return (
    <div>
      <UniversalCRUDManager
        module="rules"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add Rules"
      />
    </div>
  );
}
