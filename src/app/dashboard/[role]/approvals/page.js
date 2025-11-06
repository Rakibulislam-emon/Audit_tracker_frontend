// src/app/dashboard/[role]/approvals/page.js

"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner"; // Import toast

export default function ApprovalsPage() {
  const { token, user } = useAuthStore();
  const moduleName = "approvals";
  const config = universalConfig[moduleName];

  // Note: This page implements the "Admin View" (list of all approvals)
  // A separate "My Approvals" page (using /my-approvals route) would be needed for the user inbox workflow.

  if (!config) {
    return (
      <div className="p-4 text-red-600">
        Error: Configuration for module &quot;{moduleName}&quot; not found.
      </div>
    );
  }
  const { title, description } = config;

  // Check view permission for this admin page
  const canView = user && config.permissions?.view?.includes(user.role);
  if (!canView) {
    // You can return null, a redirect, or an error message
    toast.error("Access Denied: You do not have permission to view this page.");
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* UniversalCRUDManager handles List, Edit (basic fields), Delete.
        The "Add" button is hidden by 'hasCustomCreate: true' in config.
        The complex approval/rejection logic must be handled
        on a separate, custom "My Approvals" page or a detailed view page.
      */}
      <UniversalCRUDManager
        module={moduleName}
        token={token}
        title={title || "Approval Requests"}
        description={description || "Manage all approval requests (Admin View)"}
        // No customHeaderActions needed for this admin list view
        userRole={user?.role}
      />
    </div>
  );
}
