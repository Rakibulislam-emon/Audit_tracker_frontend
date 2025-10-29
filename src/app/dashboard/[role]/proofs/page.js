// src/app/dashboard/[role]/proofs/page.js

"use client";
import { Button } from "@/components/ui/button";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import Modal from "@/components/ui/modal"; // Modal কম্পোনেন্ট
import ProofUploadForm from "@/components/ui/proof/ProofUploadForm";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function ProofManagementPage() {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const moduleName = "proofs";
  const config = universalConfig[moduleName];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { title, description } = config;
  // Check create permission
  const canCreate = user && config.permissions?.create?.includes(user.role);

  // Filters state needed for query invalidation key
  const searchParams = useSearchParams();
  const filters = useMemo(() => {
    const newFilters = {};
    if (!config?.filters) return newFilters;
    const filterKeys = Object.keys(config.filters);
    filterKeys.forEach((key) => {
      newFilters[key] = searchParams.get(key) || "";
    });
    return newFilters;
  }, [searchParams, config]);
  // Memoized callback for successful upload to invalidate query cache
  const handleUploadSuccess = useCallback(() => {
    console.log("Upload success, invalidating proofs query.");
    // Invalidate the query cache for 'proofs' to trigger refetch
    // Ensure the queryKey matches the one used by useModuleData
    queryClient.invalidateQueries({ queryKey: [moduleName] });
    // Modal is closed by ProofUploadForm's onClose call on success
  }, [queryClient, moduleName]); // Add dependencies

  // Memoized function to close modal
  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  // Memoized function to open modal
  const openUploadModal = useCallback(() => {
    // Optional: Check permission again before opening, though button is already conditional
    if (canCreate) {
      setIsUploadModalOpen(true);
    } else {
      toast.error("You do not have permission to upload proofs.");
    }
  }, [canCreate]); // Dependency ensures it updates if canCreate changes

  // Basic check if config loaded
  if (!config) {
    return (
      <div className="p-4 text-red-600">
        Error: Configuration for module &quot;{moduleName}&quot; not found.
      </div>
    );
  }

  return (
    // Main container div
    <div className="container mx-auto p-4 md:p-16">
      {" "}
      {/* Added padding */}
      {/* UniversalCRUDManager handles List, Edit (caption/status), Delete */}
      <UniversalCRUDManager
        module={moduleName}
        token={token}
        title={title || "Proof Management"}
        description={description}
        // addButtonText prop ignored due to hasCustomCreate: true in config
        // Pass the custom upload button via customHeaderActions prop
        customHeaderActions={
          canCreate && ( // Only show if user has permission
            <Button className={"text-[12px]"} onClick={openUploadModal} size="sm">
              {" "}
              {/* Use memoized function */}
              <Upload className="mr-2 h-4 w-4" /> Upload New Proof
            </Button>
          )
        }
        // userRole={user?.role} // Pass role if needed by columns/manager
      />
      {/* Upload Modal - Rendered conditionally */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal} // Use memoized function
          title="Upload New Proof File"
          // Adjust width as needed
          className="max-w-lg" // Example: Medium width
        >
          {/* Render the upload form inside the modal */}
          <ProofUploadForm
            token={token}
            onClose={closeUploadModal} // Pass the closing function
            onUploadSuccess={handleUploadSuccess} // Pass the success callback
            // Not passing relatedEntityType/Id, so form will show relation dropdowns
          />
        </Modal>
      )}
    </div>
  );
}
