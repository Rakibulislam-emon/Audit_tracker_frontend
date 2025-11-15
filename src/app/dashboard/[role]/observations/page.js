// "use client";
// import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
// import { universalConfig } from "@/config/dynamicConfig";
// import { useAuthStore } from "@/stores/useAuthStore";

// export default function ObservationsManagementPage() {
//   const { token } = useAuthStore();
//   const { title, description } = universalConfig["observations"];

//   return (
//     <div>
//       <UniversalCRUDManager
//         module="observations"
//         token={token}
//         title={title}
//         desc={description}
//         addButtonText="Add observations"
//       />
//     </div>
//   );
// }


// src/app/dashboard/[role]/observations/page.js
"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function ObservationsManagementPage() {
  const { token, user } = useAuthStore();
  const moduleName = "observations";
  const config = universalConfig[moduleName];

  if (!config) {
    return (
      <div className="p-4 text-red-600">
        Error: Configuration for module &quot;{moduleName}&quot; not found.
      </div>
    );
  }
  const { title, description } = config;

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
      <UniversalCRUDManager
        module={moduleName}
        token={token}
        title={title || "Observations"}
        desc={description || "Manage all audit observations"}
        addButtonText="Add New Observation"
      />
    </div>
  );
}