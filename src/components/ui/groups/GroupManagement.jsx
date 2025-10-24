"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import UniversalCRUDManager from "../dynamic/UniversalCRUDManager";

export default function GroupManagement() {
  const { token } = useAuthStore();

  return (
    <UniversalCRUDManager
      module="groups"
      token={token}
      title="Group Management"
      addButtonText="Add Group"
      isAvailable={false}
    />
  );
}
