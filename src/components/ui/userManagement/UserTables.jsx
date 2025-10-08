"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useUsers,useDeleteUser } from "@/hooks/useUsers";
const columns = [
  { 
    accessorKey: "name", 
    header: "Name",
    cell: (info) => info.getValue() || 'N/A'
  },
  { 
    accessorKey: "email", 
    header: "Email",
    cell: (info) => info.getValue() || 'N/A'
  },
  { 
    accessorKey: "role", 
    header: "Role",
    cell: (info) => {
      const role = info.getValue();
      const roleColors = {
        'admin': 'bg-purple-100 text-purple-800',
        'audit_manager': 'bg-blue-100 text-blue-800', 
        'auditor': 'bg-green-100 text-green-800',
        'compliance_officer': 'bg-orange-100 text-orange-800',
        'sysadmin': 'bg-red-100 text-red-800'
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
          {role || 'N/A'}
        </span>
      );
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info) => {
      const isActive = info.getValue();
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
      return lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never';
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
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      );
    },
  },
];

export default function UserTable({ users: initialUsers, token }) {
  console.log('Initial users:', initialUsers);
  console.log('Token:', token);

  // Use TanStack Query with initial data from server
  const { data: users, isLoading, error, refetch } = useUsers(token, {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading users: {error.message}
        <button 
          onClick={() => refetch()}
          className="ml-4 text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Users ({users?.length || 0})
        </h3>
        <button
          onClick={() => refetch()}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border px-3 py-2 text-left">
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
      
      {(!users || users.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
}