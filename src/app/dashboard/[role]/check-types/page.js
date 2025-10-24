"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CheckTypeManagementPage() {
    const { token } = useAuthStore();
    const {title,description}= universalConfig["checkTypes"];
  
  return (
    <div>
      <UniversalCRUDManager
        module="checkTypes"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add Group"
      />
    </div>
  );
}
