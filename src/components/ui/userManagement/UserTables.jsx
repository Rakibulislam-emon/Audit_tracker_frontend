"use client";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Spinner } from "../spinner";

export default function UserTable({ users: initialUsers, token }) {
  // Use TanStack Query with initial data from server
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsers(token, {
    initialData: initialUsers, // Set initial data from server
  });

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { token }, // Pass token to actions
  });

  if (isLoading && !users) {
    return (
      <div className="flex justify-center items-center py-8">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div> */}
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading users: {error.message}
        <button onClick={() => refetch()} className="ml-4 text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-semibold">Users ({users?.length || 0})</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border px-3 py-2 text-left whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet View (md) */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.slice(0, 4).map(
                  (
                    header // Show only first 4 columns
                  ) => (
                    <th
                      key={header.id}
                      className="border px-2 py-2 text-left whitespace-nowrap text-xs"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row
                  .getVisibleCells()
                  .slice(0, 4)
                  .map(
                    (
                      cell // Show only first 4 columns
                    ) => (
                      <td key={cell.id} className="border px-2 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (sm and below) */}
      <div className="md:hidden w-full space-y-3">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="space-y-2">
              {/* Name and Role in one line */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {row.getValue("name")}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {row.getValue("email")}
                  </p>
                </div>
                <div className="text-right">
                  {flexRender(
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "role")?.column
                      .columnDef.cell,
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "role")
                      ?.getContext()
                  )}
                </div>
              </div>

              {/* Status and Last Login */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Status:</span>
                  {flexRender(
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "isActive")?.column
                      .columnDef.cell,
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "isActive")
                      ?.getContext()
                  )}
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs">Last Login</div>
                  <div className="text-sm">
                    {flexRender(
                      row
                        .getVisibleCells()
                        .find((cell) => cell.column.id === "lastLogin")?.column
                        .columnDef.cell,
                      row
                        .getVisibleCells()
                        .find((cell) => cell.column.id === "lastLogin")
                        ?.getContext()
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  User ID: {row.original._id?.slice(-6)}
                </div>
                <div>
                  {flexRender(
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "actions")?.column
                      .columnDef.cell,
                    row
                      .getVisibleCells()
                      .find((cell) => cell.column.id === "actions")
                      ?.getContext()
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!users || users.length === 0) && (
        <div className="text-center py-8 text-gray-500">No users found</div>
      )}
    </div>
  );
}

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue() || "N/A",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue() || "N/A",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => {
      const role = info.getValue();
      const roleColors = {
        admin: "bg-purple-100 text-purple-800",
        audit_manager: "bg-blue-100 text-blue-800",
        auditor: "bg-green-100 text-green-800",
        compliance_officer: "bg-orange-100 text-orange-800",
        sysadmin: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            roleColors[role] || "bg-gray-100 text-gray-800"
          }`}
        >
          {role || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info) => {
      const isActive = info.getValue();
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: (info) => {
      const lastLogin = info.getValue();
      return lastLogin ? new Date(lastLogin).toLocaleDateString() : "Never";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const user = info.row.original;
      const { token } = info.table.options.meta;
      const { mutate: deleteUser, isLoading } = useDeleteUser(token);

      const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          deleteUser(user._id);
        }
      };

      return (
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="text-red-600 hover:text-red-900 disabled:opacity-50 text-sm"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      );
    },
  },
];
