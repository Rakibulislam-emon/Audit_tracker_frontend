"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SchedulesManagementPage() {
  const { token } = useAuthStore();
  const { title, description } = universalConfig["schedules"];

  return (
    <div>
      <UniversalCRUDManager
        module="schedules"
        token={token}
        title={title}
        desc={description}
        addButtonText="Add schedules"
      />
    </div>
  );
}
