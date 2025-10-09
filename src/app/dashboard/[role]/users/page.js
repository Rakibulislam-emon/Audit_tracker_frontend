import UserTable from "@/components/ui/userManagement/userTable/Index";
import { getAllUsers } from "@/services/userService";
import { getToken } from "@/utils/auth-server";
import UsersFilters from "../../../../components/ui/userManagement/UsersTableFilters";

const UserManagementPage = async () => {
  const token = await getToken();
  const initialUsers = await getAllUsers(token);
  console.log(initialUsers);
  return (
    <div className="container mx-auto ">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-6">Manage and monitor all user accounts</p>
      <UsersFilters />
      <UserTable users={initialUsers} token={token} />
    </div>
  );
};

export default UserManagementPage;
