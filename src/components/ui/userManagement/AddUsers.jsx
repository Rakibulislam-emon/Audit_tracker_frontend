"use client";

import { useCreateUser } from "@/hooks/useUsers";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import Modal from "../modal";
import AddUserForm from "./AddUserFrom";

export default function AddUsers({ users, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createUser, isPending, error } = useCreateUser(token);

  const handleAddUser = (formData) => {
    createUser(formData, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <h3 className="text-lg font-semibold text-gray-800">
        Users ({users?.length || 0})
      </h3>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-black/80 transition-colors duration-200 w-full sm:w-auto "
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>

        {isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Add New User"
          >
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error.message || "Something went wrong."}
              </div>
            )}
            <AddUserForm onSubmit={handleAddUser} isSubmitting={isPending} />
          </Modal>
        )}
      </div>
    </div>
  );
}
