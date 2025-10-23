"use client";

import { Button } from "@/components/ui/button";
import UniversalFilters from "@/components/ui/dynamic/UniversalFilters";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import UniversalTable from "@/components/ui/dynamic/UniversalTable";
import Modal from "@/components/ui/modal";
import { universalConfig } from "@/config/dynamicConfig";
import {
  useCreateModule,
  useDeleteModule,
  useModuleData,
  useUpdateModule,
} from "@/hooks/useUniversal";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * UNIVERSAL CRUD MANAGER
 *
 * Reusable component for ANY module (users, companies, groups, audits, etc.)
 * Handles: List, Create, Edit, Delete with modals
 *
 * @param {string} module - Module name: "users", "companies", "groups"
 * @param {string} token - Auth token
 * @param {string} title - Page title (e.g., "User Management")
 * @param {string} addButtonText - Add button text (e.g., "Add User")
 * @param {function} getPriorityLevel - Priority indicator for table (optional)
 * @param {function} getRowCondition - Row condition for table (optional)
 *
 * USAGE:
 * <UniversalCRUDManager
 *   module="users"
 *   token={token}
 *   title="User Management"
 *   addButtonText="Add User"
 * />
 */
export default function UniversalCRUDManager({
  module,
  token,
  title,
  addButtonText = "Add Item",
  getPriorityLevel = null,
  getRowCondition = null,
  isAvailable = true,
}) {

  
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters from URL
 const filters = useMemo(() => {
    const newFilters = {};
    // ২. বর্তমান মডিউলের ফিল্টার কী-গুলো নিন (e.g., ['search', 'group', 'status'])
    const filterKeys = Object.keys(universalConfig[module]?.filters || {});
    
    // ৩. প্রতিটি কী-এর জন্য URL থেকে ভ্যালু পড়ুন
    filterKeys.forEach((key) => {
      newFilters[key] = searchParams.get(key) || "";
    });
    
    return newFilters;
  }, [searchParams, module]);

  // Data fetch
  const {
    data: response,
    isLoading,
    refetch,
  } = useModuleData(module, token, filters);

  const items = response?.data || [];
  console.log("items:", items);

  // Mutations
  const { mutate: createItem } = useCreateModule(module, token);
  const { mutate: updateItem } = useUpdateModule(module, token);
  const { mutate: deleteItem } = useDeleteModule(module, token);

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Form submit handler
  const handleSubmit = (formData) => {
    if (modalType === "create") {
      createItem(formData, {
        onSuccess: () => {
          closeModal();
          // refetch();
          toast.success(`${module} created successfully!`);
        },
        onError: (error) => {
          toast.error(error.message || `Failed to create ${module}`);
        },
      });
    } else if (modalType === "edit" && selectedItem) {
      updateItem(
        { id: selectedItem._id, data: formData },
        {
          onSuccess: () => {
            closeModal();
            // refetch();
            toast.success(`${module} updated successfully!`);
          },
          onError: (error) => {
            toast.error(error.message || `Failed to update ${module}`);
          },
        }
      );
    }
  };

  // Delete handler
  const handleDelete = () => {
    if (!selectedItem) return;

    deleteItem(selectedItem._id, {
      onSuccess: () => {
        closeModal();
        // refetch();
        toast.success(`${module} deleted successfully!`);
      },
      onError: (error) => {
        toast.error(error.message || `Failed to delete ${module}`);
      },
    });
  };



  

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            {items.length} {module} found
          </p>
        </div>

        {isAvailable && (
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-grow">
              <UniversalFilters module={module} token={token} />
            </div>
            <Button onClick={() => openModal("create")} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
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
          getPriorityLevel={getPriorityLevel}
          getRowCondition={getRowCondition}
        />
      )}

      {/* Universal Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            modalType === "create"
              ? `Add ${module}`
              : modalType === "edit"
              ? `Edit ${module}`
              : `Delete ${module}`
          }
        >
          {modalType === "delete" ? (
            <DeleteConfirmation
              itemName={
                selectedItem?.name || selectedItem?.title || "this item"
              }
              onCancel={closeModal}
              onConfirm={handleDelete}
            />
          ) : (
            <UniversalForm
              module={module}
              onSubmit={handleSubmit}
              initialData={modalType === "edit" ? selectedItem : null}
              mode={modalType}
              token={token}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

// Delete Confirmation Component
function DeleteConfirmation({ itemName, onCancel, onConfirm }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Are you sure you want to delete <strong>{itemName}</strong>?
      </p>
      <p className="text-sm text-red-600">This action cannot be undone.</p>
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}
