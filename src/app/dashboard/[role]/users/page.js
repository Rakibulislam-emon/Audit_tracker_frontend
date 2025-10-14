// import UserTable from "@/components/ui/userManagement/userTable/Index";
// import { getAllUsers } from "@/services/userService";
// import { getToken } from "@/utils/auth-server";
// import UsersFilters from "../../../../components/ui/userManagement/UsersTableFilters";

// // Even better - destructure after await
// const UserManagementPage = async ({ searchParams }) => {
//   const { search, role, status } = await searchParams;

//   const token = await getToken();
//   const filters = { search, role, status };
//   const response = await getAllUsers(token, filters);

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

// everything is ok if something messed just comment out this page 


// this codes are for testing 

"use client"
import UniversalTable from '@/components/ui/dynamic/UniversalTable';
import { useModuleData } from '@/hooks/useUniversal';
import { useAuthStore } from '@/stores/useAuthStore';
import React from 'react'

export default function UserManagement() {
  const { token } = useAuthStore();
   const { data: users } = useModuleData("users", token);
   console.log('users:', users)
  return (
    <div>
      <UniversalTable module="users" data={users?.data || []} meta={{ token }}/>
    </div>
  )
}
