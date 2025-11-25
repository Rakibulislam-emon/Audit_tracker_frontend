"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TemplatesManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["templates"];

  return (
    <div>
      <UniversalCRUDManager
        module="templates"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add Template"
      />
    </div>
  );
}
