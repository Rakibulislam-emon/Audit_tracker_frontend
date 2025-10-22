"use client";

import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { useAuthStore } from "@/stores/useAuthStore";

export default function UserManagement() {
  const { token } = useAuthStore();

  return (
    <UniversalCRUDManager
      module="users"
      token={token}
      title="User Management"
      addButtonText="Add User"
    />
  );
}