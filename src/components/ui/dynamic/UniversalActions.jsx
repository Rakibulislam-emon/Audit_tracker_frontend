"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { universalConfig } from "@/config/dynamicConfig";
import { useDeleteModule, useUpdateModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import UniversalForm from "./UniversalForm";

/**
 * 🎯 UNIVERSAL Actions Component
 * Purpose: Edit and Delete actions for ANY module
 *
 * @param {string} module - "users", "groups", "companies"
 * @param {object} item - Item data {_id, name, etc.}
 * @param {string} token - Auth token
 * @param {function} onSuccess - Callback after successful action
 */
export default function UniversalActions({ module, item, token, onSuccess }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { user: authUser } = useAuthStore();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateModule(
    module,
    token
  );
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteModule(
    module,
    token
  );

  // 🔐 Check permissions from config
  const config = universalConfig[module];
  const canEdit = config?.permissions?.edit?.includes(authUser.role);
  const canDelete = config?.permissions?.delete?.includes(authUser.role);

  // ✏️ Handle Edit - ANY module update korbe
  const handleEdit = (formData) => {
    console.log(`Editing ${module}:`, item._id, "with data:", formData);

    updateItem(
      {
        id: item._id,
        data: formData,
      },
      {
        onSuccess: () => {
          console.log(`${module} updated successfully`);
          setEditOpen(false);
          onSuccess?.(); // Table refresh korbe
        },
        onError: (error) => {
          console.error(`Failed to update ${module}:`, error);
        },
      }
    );
  };

  // 🗑️ Handle Delete - ANY module delete korbe
  const handleDelete = () => {
    console.log(`Deleting ${module}:`, item._id);

    deleteItem(item._id, {
      onSuccess: () => {
        console.log(`${module} deleted successfully`);
        setDeleteOpen(false);
        onSuccess?.(); // Table refresh korbe
      },
      onError: (error) => {
        console.error(`Failed to delete ${module}:`, error);
      },
    });

    // 🚫 No permissions - button show korbe na
    if (!canEdit && !canDelete) {
      return null;
    }

    return (
      <div className="flex gap-2 justify-center">
        {/* ✏️ EDIT BUTTON - For ANY module */}
        {canEdit && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit {config?.title}</DialogTitle>
              </DialogHeader>

              {/* 🎯 AUTO-FORM for Editing ANY module */}
              <UniversalForm
                module={module}
                onSubmit={handleEdit}
                isSubmitting={isUpdating}
                initialData={item} // Existing data form e show korbe
                mode="edit"
              />
            </DialogContent>
          </Dialog>
        )}

        {/* 🗑️ DELETE BUTTON - For ANY module */}
        {canDelete && (
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertContent
              module={module}
              item={item}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </AlertDialog>
        )}
      </div>
    );
  };

  /**
   * 🎯 Reusable Delete Confirmation Content
   */
  function AlertContent({ module, item, onDelete, isDeleting }) {
    const config = universalConfig[module];

    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {config?.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-semibold text-red-600">
              {item.name || item.title || "this item"}
            </span>{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              `Delete ${config?.title}`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  }
}
