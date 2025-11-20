// src/app/dashboard/[role]/approvals/page.js - WITH SAFE PROPS

"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

// ✅ SAFE WRAPPER: Ensures all props are React-safe
const SafeUniversalCRUDManager = ({ module, token, title, description, userRole }) => {
  // Convert all props to safe strings
  const safeTitle = typeof title === 'string' ? title : String(title || 'Approval Management');
  const safeDescription = typeof description === 'string' ? description : String(description || 'Manage approval requests');
  
  console.log("🔍 SafeUniversalCRUDManager props:", {
    safeTitle,
    safeDescription,
    module,
    userRole
  });

  return (
    <UniversalCRUDManager
      module={module}
      token={token}
      title={safeTitle}
      description={safeDescription}
      userRole={userRole}
    />
  );
};

export default function ApprovalsPage() {
  const { token, user } = useAuthStore();
  const moduleName = "approvals";
  const config = universalConfig[moduleName];

  // Debug the config to find the problematic object
  console.log("🔍 ApprovalsPage Config Debug:", {
    configTitle: config?.title,
    configTitleType: typeof config?.title,
    configDescription: config?.description, 
    configDescriptionType: typeof config?.description
  });

  if (!config) {
    return (
      <div className="p-4 text-red-600">
        Error: Configuration for module &quot;{moduleName}&quot; not found.
      </div>
    );
  }

  const canView = user && config.permissions?.view?.includes(user.role);
  if (!canView) {
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
      {/* ✅ USING SAFE WRAPPER INSTEAD OF DIRECT COMPONENT */}
      <SafeUniversalCRUDManager
        module={moduleName}
        token={token}
        title={config.title}
        description={config.description}
        userRole={user?.role}
      />
    </div>
  );
}