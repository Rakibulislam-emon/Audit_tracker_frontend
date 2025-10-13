"use client";

import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { generateUniversalColumns } from "@/utils/universalColumns";
import GroupActions from "./GroupActions";
import UniversalActions from "../ui/dynamic/UniversalActions";

/**
 * 🎯 Complete Group Table with Edit/Delete Actions
 * Purpose: Displays groups data with action buttons
 * 
 * @param {array} groups - Groups data from API
 * @param {string} token - Auth token
 * @param {function} onDataChange - Callback when data changes (after edit/delete)
 */
export default function GroupTable({ groups = [], token, onDataChange }) {
  
  // 🎯 Auto-generate columns from config
  const baseColumns = generateUniversalColumns("groups");
  
  // 🆕 Add Actions column at the end
  const columns = [
    ...baseColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <UniversalActions
        module= "groups"
          group={row.original} 
          token={token}
          onSuccess={onDataChange}
        />
      ),
    }
  ];

  // 🎯 Setup react-table
  const table = useReactTable({
    data: groups,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 📊 Empty state - kono group na thakle
  if (!groups || groups.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500 text-lg">No groups found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first group to get started
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
                  className="border px-4 py-3 text-left font-semibold text-gray-700 text-sm"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 border-b transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}