"use client";
import AddUsers from "../AddUsers";
// import UsersFilters from "../UsersTableFilters";
import TableDesktop from "./TableDesktop";
import TableMobile from "./TableMobile";
import TableTablet from "./TableTablet";

export default function UserTable({ users, token }) {
  // ✅ No local state needed - server handles filtering
  
  return (
    <div>
      <AddUsers users={users} token={token} />
      
      {/* ✅ Just pass currentFilters - no onFiltersChange needed */}
      {/* <UsersFilters currentFilters={{}} /> */}
      
      <TableDesktop users={users} token={token} />
      <TableTablet users={users} token={token} />
      <TableMobile users={users} token={token} />
    </div>
  );
}