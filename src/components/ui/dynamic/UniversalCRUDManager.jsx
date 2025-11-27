"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/button";
import UniversalFilters from "@/components/ui/dynamic/UniversalFilters";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import UniversalTable from "@/components/ui/dynamic/UniversalTable";
import Modal from "@/components/ui/modal";

// Hooks & Config
import { universalConfig } from "@/config/dynamicConfig";
import {
  useCreateModule,
  useCustomAction,
  useDeleteModule,
  useModuleData,
  useUpdateModule,
} from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG = {
  addButtonText: "Add Item",
  isAvailable: true,
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const DeleteConfirmation = ({ itemName, onCancel, onConfirm, isDeleting }) => (
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

const HeaderSection = ({
  title,
  description,
  module,
  items,
  isLoading,
  totalCount,
}) => (
  <div className="py-4 text-center mb-6">
    <h1 className="text-3xl lg:text-4xl font-bold">{title}</h1>
    {description && (
      <p className="text-gray-600 mt-1 max-w-xl mx-auto">{description}</p>
    )}
    {!isLoading && (
      <p className="text-gray-500 text-sm mt-2">
        {totalCount !== undefined
          ? `${totalCount} ${module}`
          : `${items.length} ${module} loaded`}{" "}
        found
      </p>
    )}
  </div>
);

const LoadingState = ({ module }) => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    <p className="text-gray-500 mt-4">Loading {module}...</p>
  </div>
);

const ActionButtons = ({
  canCreate,
  hasCustomCreate,
  customHeaderActions,
  addButtonText,
  onOpenCreateModal,
}) => {
  if (customHeaderActions) {
    return customHeaderActions;
  }

  if (canCreate && !hasCustomCreate) {
    return (
      <button
        onClick={onOpenCreateModal}
        className="group cursor-pointer relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Icon with animation */}
        <div className="relative z-10 p-1 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors duration-300">
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
        </div>

        {/* Button text */}
        <span className="relative z-10 text-sm font-medium tracking-wide">
          {addButtonText}
        </span>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-blue-400/50"></div>
      </button>
    );
  }

  return null;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const buildFiltersFromURL = (searchParams, config) => {
  if (!config?.filters) return {};

  const filters = {};
  Object.keys(config.filters).forEach((key) => {
    filters[key] = searchParams.get(key) || "";
  });

  return filters;
};

const buildCustomActionEndpoint = (baseUrl, config, action, item) => {
  return `${baseUrl}/${config.endpoint}${action.endpoint.replace(
    ":id",
    item._id
  )}`;
};

const showSuccessToast = (response, module, action) => {
  toast.success(response?.message || `${module} ${action} successfully!`);
};

const showErrorToast = (error, module, action) => {
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    `Failed to ${action} ${module}`;
  toast.error(errorMessage);
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalCRUDManager({
  module,
  token,
  title,
  desc,
  addButtonText = DEFAULT_CONFIG.addButtonText,
  getPriorityLevel = null,
  getRowCondition = null,
  isAvailable = DEFAULT_CONFIG.isAvailable,
  customHeaderActions = null,
}) {
  // ===========================================================================
  // STATE & HOOKS
  // ===========================================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const config = universalConfig[module];

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================

  const filters = useMemo(
    () => buildFiltersFromURL(searchParams, config),
    [searchParams, config]
  );

  const { data: response, isLoading } = useModuleData(module, token, filters);
  const items = response?.data || [];
  const totalCount = response?.count || items.length;

  console.log("🚀 ~ file: UniversalCRUDManager.jsx:236 ~ items:", items);
  // ===========================================================================
  // MUTATIONS
  // ===========================================================================

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

  const { mutate: customActionMutate } = useCustomAction(token, {
    modulesToInvalidate: ["schedules", "auditSessions"],
  });

  // ===========================================================================
  // MODAL HANDLERS
  // ===========================================================================

  const openModal = useCallback((type, item = null) => {
    console.log(`Opening modal: ${type}`, item);
    setModalType(type);
    setSelectedItem(item);
    setSubmissionError(null); // Clear error on open
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setSubmissionError(null); // Clear error on close
  }, []);

  const openCreateModal = useCallback(() => openModal("create"), [openModal]);
  const openEditModal = useCallback(
    (item) => openModal("edit", item),
    [openModal]
  );
  const openDeleteModal = useCallback(
    (item) => openModal("delete", item),
    [openModal]
  );

  // ===========================================================================
  // ACTION HANDLERS
  // ===========================================================================

  const handleSubmit = useCallback(
    (formData) => {
      const isEditMode = modalType === "edit";
      setSubmissionError(null); // Clear previous errors

      if (!isEditMode) {
        createItem(formData, {
          onSuccess: (res) => {
            closeModal();
            showSuccessToast(res, module, "created");
          },
          onError: (error) => {
            setSubmissionError(error.message || "Failed to create item");
            showErrorToast(error, module, "create");
          },
        });
      } else if (selectedItem) {
        updateItem(
          { id: selectedItem._id, data: formData },
          {
            onSuccess: (res) => {
              closeModal();
              showSuccessToast(res, module, "updated");
            },
            onError: (error) => {
              setSubmissionError(error.message || "Failed to update item");
              showErrorToast(error, module, "update");
            },
          }
        );
      }
    },
    [modalType, selectedItem, createItem, updateItem, closeModal, module]
  );

  const handleDelete = useCallback(() => {
    if (!selectedItem) return;

    deleteItem(selectedItem._id, {
      onSuccess: (res) => {
        closeModal();
        showSuccessToast(res, module, "deleted");
      },
      onError: (error) => showErrorToast(error, module, "delete"),
    });
  }, [selectedItem, deleteItem, closeModal, module]);

  const handleBulkDelete = useCallback(
    async (selectedItems) => {
      const ids = selectedItems.map((item) => item._id);
      const deletePromises = ids.map(
        (id) =>
          new Promise((resolve, reject) => {
            deleteItem(id, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            });
          })
      );
      try {
        await Promise.all(deletePromises);
        toast.success(`Successfully deleted ${ids.length} items`);
      } catch (error) {
        toast.error(`Failed to delete some items: ${error.message}`);
        throw error;
      }
    },
    [deleteItem]
  );

  const handleBulkExport = useCallback(
    (selectedItems) => {
      if (selectedItems.length === 0) return;
      const headers = Object.keys(selectedItems[0]).filter(
        (key) => !key.startsWith("_")
      );
      const csvContent = [
        headers.join(","),
        ...selectedItems.map((item) =>
          headers
            .map((header) => {
              const value = item[header];
              if (typeof value === "object" && value !== null) {
                return JSON.stringify(value).replace(/,/g, ";");
              }
              return value;
            })
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${module}_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    [module]
  );

  const handleCustomAction = useCallback(
    (action, item) => {
      const endpoint = buildCustomActionEndpoint(
        API_BASE_URL,
        config,
        action,
        item
      );

      console.log("Custom action endpoint:", endpoint);

      toast.info(
        `Are you sure you want to ${action.label} for "${
          item.title || item.name
        }"?`,
        {
          action: {
            label: "Confirm",
            onClick: () => {
              customActionMutate(
                {
                  endpoint: endpoint,
                  method: action.method,
                  body: {},
                },
                {
                  onSuccess: (res) => {
                    toast.success(
                      res?.message || "Action completed successfully!"
                    );
                    window.location.href = `/dashboard/${user.role}/auditsessions`;
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
    [config, customActionMutate]
  );

  // ===========================================================================
  // PERMISSIONS & CONFIG
  // ===========================================================================

  const canCreate = user && config?.permissions?.create?.includes(user?.role);
  const hasFilters = config?.filters && Object.keys(config.filters).length > 0;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="">
      {/* Header Section */}
      <HeaderSection
        title={title}
        description={desc}
        module={module}
        items={items}
        isLoading={isLoading}
        totalCount={totalCount}
      />

      {/* Filter and Action Section */}
      {isAvailable && (
        <div className="space-y-4 mb-6 ">
          {/* Action Button Row - Right Aligned */}
          {(canCreate && !config?.hasCustomCreate) || customHeaderActions ? (
            <div className="flex justify-end w-full">
              {customHeaderActions || (
                <ActionButtons
                  canCreate={canCreate}
                  hasCustomCreate={config?.hasCustomCreate}
                  customHeaderActions={customHeaderActions}
                  addButtonText={addButtonText}
                  onOpenCreateModal={openCreateModal}
                />
              )}
            </div>
          ) : null}

          {/* Filters - Full Width Below */}
          {hasFilters && (
            <div className="w-full">
              <UniversalFilters module={module} token={token} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingState module={module} />
      ) : (
        <UniversalTable
          module={module}
          data={items}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          token={token}
          isLoading={isLoading}
          getRowCondition={getRowCondition}
          getPriorityLevel={getPriorityLevel}
          moduleConfig={config}
          onCustomAction={handleCustomAction}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalType === "edit" ? "Edit Item" : `Create ${module}`}
        >
          {modalType === "delete" ? (
            <DeleteConfirmation
              itemName={
                selectedItem?.name || selectedItem?.title || "this item"
              }
              onCancel={closeModal}
              onConfirm={handleDelete}
              isDeleting={isDeleting}
            />
          ) : (
            <UniversalForm
              module={module}
              onSubmit={handleSubmit}
              initialData={modalType === "edit" ? selectedItem : {}}
              mode={modalType}
              token={token}
              isSubmitting={isCreating || isUpdating}
              submissionError={submissionError}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
