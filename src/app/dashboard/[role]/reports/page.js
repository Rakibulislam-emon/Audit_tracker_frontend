// src/app/dashboard/[role]/reports/page.js

"use client";
import UniversalCRUDManager from "@/components/ui/dynamic/UniversalCRUDManager";
import { universalConfig } from "@/config/dynamicConfig";
import { useAuthStore } from "@/stores/useAuthStore";
// ✅ useMemo এবং useSearchParams ইম্পোর্ট সরানো হয়েছে (যদি searchParams অন্য কোথাও না লাগে)
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useQueryClient } from "@tanstack/react-query";
import { FilePlus2 } from "lucide-react"; // Icon for generate
import { useCallback, useState } from "react";
// ❌ useSearchParams ইম্পোর্ট সরানো হয়েছে
import ReportGenerateForm from "@/components/ui/reports/ReportGenerateForm"; // কাস্টম ফর্ম ইম্পোর্ট
import ExportButton from "@/components/ui/reports/ExportButton"; // ✅ Export button with multiple formats
import { toast } from "sonner";

export default function ReportManagementPage() {
  // --- ধাপ ১: সব হুক এবং ভেরিয়েবল (কনফিগারেশন সহ) টপ-লেভেলে কল করুন ---
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const moduleName = "reports";
  const config = universalConfig[moduleName]; // config এখানে লোড করুন

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // ✅ কাস্টম 'generate' পারমিশন চেক
  const canGenerate =
    user && config?.permissions?.generate?.includes(user.role);

  // ✅ ধাপ ২: সব useCallback হুকগুলো Early Return-এর আগে কল করুন ---

  // Callback for successful generation
  const handleGenerateSuccess = useCallback(() => {
    console.log("Report generation success, invalidating reports query.");
    // ✅ শুধু moduleName ব্যবহার করে ইনভ্যালিডেট করা হচ্ছে
    queryClient.invalidateQueries({ queryKey: [moduleName] });
    setIsGenerateModalOpen(false); // Modal বন্ধ করা
  }, [queryClient, moduleName]);

  // Modal open/close handlers
  const closeGenerateModal = useCallback(
    () => setIsGenerateModalOpen(false),
    []
  );

  const openGenerateModal = useCallback(() => {
    if (canGenerate) {
      setIsGenerateModalOpen(true);
    } else {
      toast.error("You do not have permission to generate reports.");
    }
  }, [canGenerate]);

  // --- ধাপ ৩: এখন Early Return চেক করুন ---
  if (!config) {
    return (
      <div className="p-4 text-red-600">
        {/* Error: Configuration for module "{moduleName}" not found. */}
      </div>
    );
  }

  // config এখন অবশ্যই বিদ্যমান
  const { title, description } = config;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* UniversalCRUDManager handles List, Edit, Delete */}
      <UniversalCRUDManager
        module={moduleName}
        token={token}
        title={title || "Report Management"}
        description={description}
        // "Add" বাটন দেখাবে না (hasCustomCreate: true)
        // কাস্টম "Generate Report" বাটন পাস করা
        customHeaderActions={
          canGenerate && (
            <Button onClick={openGenerateModal} size="sm">
              <FilePlus2 className="mr-2 h-4 w-4" /> Generate New Report
            </Button>
          )
        }
        // ✅ Add export button to each row
        customRowActions={(row) => (
          <ExportButton
            reportId={row._id}
            reportData={row}
            token={token}
            compact
          />
        )}
        userRole={user?.role} // Pass user role for column permissions
      />

      {/* Generate Report Modal */}
      {isGenerateModalOpen && (
        <Modal
          isOpen={isGenerateModalOpen}
          onClose={closeGenerateModal}
          title="Generate New Audit Report"
          className="max-w-md" // Smaller modal
        >
          <ReportGenerateForm
            token={token}
            onClose={closeGenerateModal}
            onGenerateSuccess={handleGenerateSuccess}
          />
        </Modal>
      )}
    </div>
  );
}
