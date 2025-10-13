"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import { useUpdateModule, useDeleteModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Edit, Trash2 } from "lucide-react";
import { universalConfig } from "@/config/dynamicConfig";

/**
 * 🎯 Group Actions Component
 * Purpose: Edit and Delete actions for groups table
 * 
 * @param {object} group - Group data {_id, name, description}
 * @param {string} token - Auth token
 * @param {function} onSuccess - Callback after successful action
 */
export default function GroupActions({ group, token, onSuccess }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const { user: authUser } = useAuthStore();
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateModule("groups", token);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteModule("groups", token);

  // 🔐 Check permissions from config
  const config = universalConfig.groups;
  const canEdit = config.permissions.edit.includes(authUser.role);
  const canDelete = config.permissions.delete.includes(authUser.role);

  // ✏️ Handle Edit - Group update korbe
  const handleEdit = (formData) => {
    console.log("Editing group:", group._id, "with data:", formData);
    
    updateGroup(
      { 
        id: group._id, 
        data: formData 
      },
      {
        onSuccess: () => {
          console.log("Group updated successfully");
          setEditOpen(false);
          onSuccess?.(); // Table refresh korbe
        },
        onError: (error) => {
          console.error("Failed to update group:", error);
        }
      }
    );
  };

  // 🗑️ Handle Delete - Group delete korbe
  const handleDelete = () => {
    console.log("Deleting group:", group._id);
    
    deleteGroup(group._id, {
      onSuccess: () => {
        console.log("Group deleted successfully");
        setDeleteOpen(false);
        onSuccess?.(); // Table refresh korbe
      },
      onError: (error) => {
        console.error("Failed to delete group:", error);
      }
    });
  };

  // 🚫 No permissions - button show korbe na
  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <div className="flex gap-2 justify-center">
      
      {/* ✏️ EDIT BUTTON */}
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
              <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
            
            {/* 🎯 AUTO-FORM for Editing */}
            <UniversalForm
              module="groups"
              onSubmit={handleEdit}
              isSubmitting={isUpdating}
              initialData={group} // Existing data form e show korbe
              mode="edit"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* 🗑️ DELETE BUTTON */}
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the group 
                <span className="font-semibold text-red-600"> "{group.name}"</span>. 
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete Group"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}