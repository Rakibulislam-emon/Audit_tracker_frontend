import { getAllUsers } from "@/services/userService";
import { getToken } from "@/utils/auth-server";
import UsersFilters from "../../../../components/ui/userManagement/UsersTableFilters";
import UserTables from "../../../../components/ui/userManagement/UserTables";

const UserManagementPage = async () => {
  const token = await getToken();
  const initialUsers = await getAllUsers(token);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-6">Manage and monitor all user accounts</p>
      <UsersFilters />
      <UserTables users={initialUsers} token={token}  />
    </div>
  );
};

export default UserManagementPage;