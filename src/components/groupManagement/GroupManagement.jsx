// src/app/dashboard/[role]/groups/page.js
"use client";

import GroupTable from "@/components/groupManagement/GroupTable";
import { Button } from "@/components/ui/button";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import { useCreateModule, useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import Modal from "../ui/modal";
export default function GroupManagement() {
  const { token } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📡 Data fetching - NO filters (search/filter chai na)
  const {
    data: groupsResponse,
    isLoading,
    error,
    refetch,
  } = useModuleData("groups", token); // No filters passed

  // ✨ Data creation
  const { mutate: createGroup, isPending: isCreating } = useCreateModule(
    "groups",
    token
  );

  const groupsData = groupsResponse?.data || [];

  // 🎯 Handle new group creation
  const handleCreateGroup = (formData) => {
    console.log("Creating new group:", formData);

    createGroup(formData, {
      onSuccess: () => {
        console.log("Group created successfully");
        setIsModalOpen(false);
        refetch(); // Table refresh korbe
      },
      onError: (error) => {
        console.error("Failed to create group:", error);
      },
    });
  };

  // 🔄 Handle data changes (after edit/delete)
  const handleDataChange = () => {
    console.log("Data changed, refreshing table...");
    refetch(); // Table auto-refresh korbe
  };

  // ⏳ Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Group Management</h1>
          <Button disabled>Add New Group</Button>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading groups...</p>
          </div>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Group Management</h1>
          <Button disabled>Add New Group</Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error Loading Groups</h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <Button
            onClick={() => refetch()}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 🏷️ Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total groups:{" "}
            <span className="font-semibold">{groupsData.length}</span>
          </p>
        </div>

        {/* ➕ Create Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add New Group
        </Button>
      </div>

      {/* 📋 COMPLETE TABLE with ACTIONS */}
      <GroupTable
        groups={groupsData}
        token={token}
        onDataChange={handleDataChange}
      />

     <div className="border">
          {/* 🪟 CREATE GROUP MODAL */}
          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Create New Group"
            >
              <UniversalForm
                module="groups"
                onSubmit={handleCreateGroup}
                isSubmitting={isCreating}
                mode="create"
              />
            </Modal>
          )}
     </div>
    </div>
  );
}
