import UserTable from "@/components/ui/userManagement/userTable/Index";
import { getAllUsers } from "@/services/userService";
import { getToken } from "@/utils/auth-server";
import UsersFilters from "../../../../components/ui/userManagement/UsersTableFilters";

// Even better - destructure after await
const UserManagementPage = async ({ searchParams }) => {
  const { search ,role,  status  } = await searchParams;
  
  const token = await getToken();
  const filters = { search, role, status };
  const response = await getAllUsers(token, filters);
  
  // console.log('Full response:', response);
  // console.log('Users data:', response.data);

  const users = response.data || [];
 

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-6">
        Manage and monitor all user accounts - Found {users.length} users
      </p>

      
      <UsersFilters currentFilters={filters} />
      
      <UserTable users={users} token={token} />
    </div>
  );
};
export default UserManagementPage;