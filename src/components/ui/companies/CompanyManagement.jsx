"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import UniversalCRUDManager from "../dynamic/UniversalCRUDManager";

export default function CompanyManagement() {
  const { token } = useAuthStore();

  return (
    <UniversalCRUDManager
      module="companies"
      token={token}
      title="Company Management"
      addButtonText="Add Company"
    />
  );
}
