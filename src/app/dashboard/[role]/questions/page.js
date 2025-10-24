"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function QuestionsManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["questions"];

  return (
    <div>
      <UniversalCRUDManager
        module="questions"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add questions"
      />
    </div>
  );
}
