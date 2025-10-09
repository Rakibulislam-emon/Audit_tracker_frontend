"use client";

import { useUsers } from "@/hooks/useUsers";
import { Spinner } from "../../spinner";
import AddUsers from "../AddUsers";
import TableDesktop from "./TableDesktop";
import TableMobile from "./TableMobile";
import TableTablet from "./TableTablet";

export default function UserTable({ users: initialUsers, token }) {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsers(token, {
    initialData: initialUsers,
  });

  if (isLoading && !users) return <Spinner center />;
  if (error)
    return (
      <div className="text-red-600">
        Error loading users: {error.message}
        <button onClick={refetch} className="underline ml-2 text-sm">
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <AddUsers users={users} token={token} />
      <TableDesktop users={users} token={token} />
      <TableTablet users={users} token={token} />
      <TableMobile users={users} token={token} />
    </div>
  );
}
