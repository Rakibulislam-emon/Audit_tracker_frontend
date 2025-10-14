"use client";

import { Button } from "@/components/ui/button";
import { useDeleteModule } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * SMART UNIVERSAL ACTIONS - Handles edit/delete for any module
 * 
 * @param {object} item - The data item
 * @param {string} module - Module name (for API calls)
 * @param {function} onEdit - Custom edit handler (optional)
 * @param {function} onDelete - Custom delete handler (optional)
 */
export default function UniversalActions({ 
  item, 
  module,
  onEdit,
  onDelete 
}) {
  const { token, user: currentUser } = useAuthStore();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteModule(module, token);

  // ✅ Don't allow users to delete/edit themselves
  const isCurrentUser = currentUser._id === item._id;
  
  // ✅ Module-specific logic can be added here
  const getItemName = () => {
    return item.name || item.title || item.email || 'this item';
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item._id, item);
    } else {
      // Default delete behavior
      deleteItem(item._id, {
        onSuccess: () => {
          toast.success(`${getItemName()} deleted successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to delete ${getItemName()}`);
          console.error('Delete error:', error);
        },
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    } else {
      // Default edit behavior - could be opening a modal
      // For now, just log and show toast
      console.log(`Edit ${module}:`, item);
      toast.info(`Edit ${getItemName()} - Add your edit logic here`);
    }
  };

  const handleView = () => {
    toast.info(`View ${getItemName()} details`);
    // Could navigate to detail page or open view modal
  };

  // ✅ Compact dropdown for mobile, buttons for desktop
  return (
    <>
      {/* DESKTOP: Buttons */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>

        {!isCurrentUser && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>

      {/* MOBILE: Dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {!isCurrentUser && (
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}