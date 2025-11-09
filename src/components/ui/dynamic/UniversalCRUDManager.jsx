"use client";

import { Button } from "@/components/ui/button";
import UniversalFilters from "@/components/ui/dynamic/UniversalFilters";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import UniversalTable from "@/components/ui/dynamic/UniversalTable";
import Modal from "@/components/ui/modal";
import { universalConfig } from "@/config/dynamicConfig";
import {
  useCreateModule,
  useCustomAction,
  useDeleteModule,
  useModuleData,
  useUpdateModule,
} from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore"; // Auth store ইম্পোর্ট
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
// ✅ useCallback এবং useMemo ইম্পোর্ট
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
const url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UniversalCRUDManager({
  module,
  token,
  title,
  desc,
  addButtonText = "Add Item",
  getPriorityLevel = null,
  getRowCondition = null,
  isAvailable = true,
  customHeaderActions = null, // ✅ ১. customHeaderActions prop রিসিভ করুন
}) {
  const { user } = useAuthStore(); // ✅ user অবজেক্ট পান
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const searchParams = useSearchParams();
  const config = universalConfig[module];

  // Filters from URL (Dynamic)
  const filters = useMemo(() => {
    const newFilters = {};
    if (!config?.filters) return newFilters;
    const filterKeys = Object.keys(config.filters);
    filterKeys.forEach((key) => {
      newFilters[key] = searchParams.get(key) || "";
    });
    return newFilters;
  }, [searchParams, config]); // Removed 'module' dependency

  // Data fetch
  const { data: response, isLoading } = useModuleData(module, token, filters);
  const items = response?.data || [];
  const totalCount = response?.count ? response.count : 0; // Get total count

  // Mutations
  const { mutate: createItem, isPending: isCreating } = useCreateModule(
    module,
    token
  );
  const { mutate: updateItem, isPending: isUpdating } = useUpdateModule(
    module,
    token
  );
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteModule(
    module,
    token
  );

  // ✅ --- (2) NOTUN HOOK-TA BABOHAR (USE) KORUN ---
  // Eti porishkar (clean) ebong reusable
  const { mutate: customActionMutate } = useCustomAction(token, {
    // Amader action-ta "schedules" table (status change) ebong
    // "auditSessions" table (notun data) - duitakei refresh korbe.
    modulesToInvalidate: ["schedules", "auditSessions"],
  });

  // Modal handlers (Memoized)
  const openModal = useCallback((type, item = null) => {
    console.log(`Opening modal: ${type}`, item);
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Form submit handler (Memoized)
  const handleSubmit = useCallback(
    (formData) => {
      if (modalType === "create") {
        createItem(formData, {
          onSuccess: (res) => {
            closeModal();
            toast.success(res?.message || `${module} created successfully!`);
          },
          onError: (error) => {
            const errMsg =
              error.response?.data?.message ||
              error.message ||
              `Failed to create ${module}`;
            toast.error(errMsg);
          },
        });
      } else if (modalType === "edit" && selectedItem) {
        updateItem(
          { id: selectedItem._id, data: formData },
          {
            onSuccess: (res) => {
              closeModal();
              toast.success(res?.message || `${module} updated successfully!`);
            },
            onError: (error) => {
              const errMsg =
                error.response?.data?.message ||
                error.message ||
                `Failed to update ${module}`;
              toast.error(errMsg);
            },
          }
        );
      }
    },
    [modalType, selectedItem, createItem, updateItem, closeModal, module]
  );

  // Delete handler (Memoized)
  const handleDelete = useCallback(() => {
    if (!selectedItem) return;
    deleteItem(selectedItem._id, {
      onSuccess: (res) => {
        closeModal();
        toast.success(res?.message || `${module} deleted successfully!`);
      },
      onError: (error) => {
        const errMsg =
          error.response?.data?.message ||
          error.message ||
          `Failed to delete ${module}`;
        toast.error(errMsg);
      },
    });
  }, [selectedItem, deleteItem, closeModal, module]);

  const handleCustomAction = useCallback(
    (action, item) => {
      // 1. Full API endpoint-ta to-ri kori
      // Amader hook-ta '/api' prefix-shohotoi endpoint expect kore
      const endpoint = `${url}/${config.endpoint}${action.endpoint.replace(
        ":id",
        item._id
      )}`;
      console.log("endpoint:", endpoint);
      // 2. User-ke confirmation-er jonno toast dekhai
      toast.info(
        `Are you sure you want to ${action.label} for "${
          item.title || item.name
        }"?`,
        {
          action: {
            label: "Confirm",
            onClick: () => {
              // 3. "Confirm" click korle, 'customActionMutate'-ke call kori
              customActionMutate(
                {
                  endpoint: endpoint, // Full API endpoint
                  method: action.method, // "POST"
                  body: {}, // Kono data pathacchi na
                },
                {
                  // ✅ Ekhon onSuccess/onError ekhaneo deya jabe
                  onSuccess: (res) => {
                    toast.success(
                      res?.message || "Action completed successfully!"
                    );
                    // redirect
                    // window.location.href = `/dashboard/${user?.role}/auditSessions`;
                  },
                  onError: (error) => {
                    toast.error(error.message || "Action failed");
                  },
                }
              );
            },
          },
          cancel: {
            label: "Cancel",
            onClick: () => toast.dismiss(),
          },
        }
      );
    },
    [config, customActionMutate, token] // Dependencies
  );

  // Generate Columns (Memoized)
  // const columns = useMemo(() => {
  //   if (!config || !user) return [];
  //   const userRole = user.role;
  //   console.log(`Memoizing columns for role: ${userRole}`);
  //   return generateUniversalColumns(
  //     module,
  //     config.fields,
  //     openModal,
  //     openModal, // Pass memoized openModal
  //     userRole,
  //     config.permissions
  //   );
  // }, [module, config, user, openModal]);

  // Check create permission
  const canCreate = user && config?.permissions?.create?.includes(user?.role);

  return (
    <div className=" ">
      {" "}
      {/* Added padding */}
      {/* Header Section (Centered) */}
      <div className="py-4 text-center mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold ">{title}</h1>
        {desc && <p className="text-gray-600 mt-1 max-w-xl mx-auto">{desc}</p>}
        {/* Total count display */}
        {!isLoading && (
          <p className="text-gray-500 text-sm mt-2">
            {totalCount !== undefined
              ? `${totalCount} ${module}`
              : `${items.length} ${module} loaded`}{" "}
            found
          </p>
        )}
      </div>
      {/* Filter and Action Buttons Section */}
      {isAvailable && (
        <div className="flex flex-col  md:flex-row justify-between items-center gap-4 mb-6 border">
          {/* Filters */}
          <div className="w-full flex-grow  max-w-7xl">
            {config?.filters && Object.keys(config.filters).length > 0 && (
              <UniversalFilters module={module} token={token} />
            )}
          </div>

          {/* Action Button Area */}
          <div className="flex-shrink-0 w-full md:w-auto ">
            {/* ✅ ২. কাস্টম অ্যাকশন বা ডিফল্ট Add বাটন কন্ডিশনালি রেন্ডার করুন */}
            {customHeaderActions
              ? customHeaderActions // যদি customHeaderActions পাস করা হয়, সেটি দেখান
              : // নাহলে, Create পারমিশন থাকলে এবং config-এ hasCustomCreate না থাকলে ডিফল্ট বাটন দেখান
                canCreate &&
                !config?.hasCustomCreate && (
                  <Button onClick={() => openModal("create")} size="sm">
                    {" "}
                    {/* Use memoized openModal */}
                    <Plus className="h-4 w-4 mr-2" />
                    {addButtonText}
                  </Button>
                )}
          </div>
        </div>
      )}
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          {/* ... Loading Spinner ... */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading {module}...</p>
        </div>
      ) : (
        /* Table */
        <UniversalTable
          module={module}
          data={items}
          onEdit={(item) => openModal("edit", item)}
          onDelete={(item) => openModal("delete", item)}
          token={token}
          isLoading={isLoading}
          getRowCondition={getRowCondition}
          getPriorityLevel={getPriorityLevel}
          moduleConfig={config}
          onCustomAction={handleCustomAction} // Use memoized handleCustomAction
        />
      )}
      {/* Universal Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal} // Use memoized closeModal
          title={modalType === "edit" ? "Edit Item" : "Create Item"}
        >
          {modalType === "delete" ? (
            <DeleteConfirmation
              itemName={
                selectedItem?.name || selectedItem?.title || "this item"
              }
              onCancel={closeModal}
              onConfirm={handleDelete} // Use memoized handleDelete
              isDeleting={isDeleting}
            />
          ) : (
            <UniversalForm
              module={module}
              onSubmit={handleSubmit} // Use memoized handleSubmit
              initialData={modalType === "edit" ? selectedItem : {}} // Use empty object for create
              mode={modalType}
              token={token}
              isSubmitting={isCreating || isUpdating}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

// Delete Confirmation Component (Added isDeleting prop)
function DeleteConfirmation({ itemName, onCancel, onConfirm, isDeleting }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Are you sure you want to delete <strong>{itemName}</strong>?
      </p>
      <p className="text-sm text-red-600">This action cannot be undone.</p>
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
