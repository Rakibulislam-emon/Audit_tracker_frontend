"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SiteManagement() {
  const { token } = useAuthStore();

  return (
    <UniversalCRUDManager
      module="sites"
      token={token}
      title="Site Management"
      addButtonText="Add Site"
    />
  );
}
