"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProblemsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["problems"];

  return (
    <div>
      <UniversalCRUDManager
        module="problems"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add problems"
      />
    </div>
  );
}
