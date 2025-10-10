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
import { useDeleteUser } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../button";
import EditUserModal from "./EditUserModal";
import { useRouter } from "next/navigation";

export default function UserActions({ user, token }) {
  const router = useRouter();
  // get user f4rom auth
  const [open, setOpen] = useState(false);
  const { mutate: deleteUser, isLoading: deleting } = useDeleteUser(token);
  const { user: authUser } = useAuthStore();

  if (authUser._id === user._id) return null;
  if (authUser.role === user.role) return null;

  const handleDelete = () => {
    deleteUser(user._id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setOpen(false);
        router.refresh();
      },
      onError: () => toast.error("Failed to delete user"),
    });
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* ⚠️ Delete with destructive modal */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently remove{" "}
              <span className="font-semibold text-red-600">{user.name}</span>’s
              account from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✏️ Edit Button */}
      <EditUserModal user={user} token={token} />
    </motion.div>
  );
}
