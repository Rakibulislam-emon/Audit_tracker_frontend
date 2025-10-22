// import UserTable from "@/components/ui/userManagement/userTable/Index";
// import { getAllUsers } from "@/services/userService";
// import { getToken } from "@/utils/auth-server";
// import UsersFilters from "../../../../components/ui/userManagement/UsersTableFilters";

// // Even better - destructure after await
// const UserManagementPage = async ({ searchParams }) => {
//   const { search ,role,  status  } = await searchParams;

//   const token = await getToken();
//   const filters = { search, role, status };
//   const response = await getAllUsers(token, filters);

//   // console.log('Full response:', response);
//   // console.log('Users data:', response.data);

//   const users = response.data || [];

//   return (
//     <div className="container mx-auto">
//       <h1 className="text-3xl font-bold mb-2">User Management</h1>
//       <p className="text-gray-600 mb-6">
//         Manage and monitor all user accounts - Found {users.length} users
//       </p>

//       <UsersFilters currentFilters={filters} />

//       <UserTable users={users} token={token} />
//     </div>
//   );
// };
// export default UserManagementPage;

"use client";

import { Button } from "@/components/ui/button";
import UniversalForm from "@/components/ui/dynamic/UniversalForm";
import UniversalSearch from "@/components/ui/dynamic/UniversalSearch";
import UniversalTable from "@/components/ui/dynamic/UniversalTable";
import Modal from "@/components/ui/modal";
import { universalConfig } from "@/config/dynamicConfig";
import { useCreateModule, useModuleData } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

export default function UserManagement() {
  const { token } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useModuleData("users", token);
  const { mutate: createUser, isPending: isCreating } = useCreateModule(
    "users",
    token
  );

  const users = usersData?.data || [];
  const config = universalConfig.users; // ✅ Config থেকে data নাও

  const handleCreateUser = (formData) => {
    createUser(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        refetch();
      },
    });
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div className="p-6">
      {/* 🏷️ Dynamic Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total {config.title.toLowerCase()}: {users.length}
          </p>
        </div>
        <UniversalSearch />
        <Button onClick={() => setIsModalOpen(true)}>
          Add New {config.title.split(" ")[0]}
        </Button>
      </div>

      <UniversalTable
        module="users"
        data={users}
        token={token}
        onDataChange={refetch}
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Create New ${config.title.split(" ")[0]}`}
        >
          <UniversalForm
            module="users"
            onSubmit={handleCreateUser}
            isSubmitting={isCreating}
          />
        </Modal>
      )}
    </div>
  );
}
