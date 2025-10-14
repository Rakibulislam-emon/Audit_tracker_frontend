"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { generateUniversalColumns } from "./universalColumns";
import { Button } from "@/components/ui/button";
import UniversalActions from "./UniversalActions";

/**
 * UNIVERSAL TABLE COMPONENT
 * 
 * Renders a responsive table for any module using TanStack Table
 * 
 * @param {string} module - Module name: "users", "groups", "companies"
 * @param {array} data - Array of items to display
 * @param {object} meta - Additional data to pass to actions (like token)
 * @param {function} actionsComponent - Custom actions component
 * @param {object} options - Additional table options (sorting, pagination)
 * 
 * USAGE:
 * <UniversalTable 
 *   module="users" 
 *   data={users} 
 *   meta={{ token }} 
 *   actionsComponent={UserActions}
 * />
 */
export default function UniversalTable({
   module,
  data = [],
  enableActions = true, 
  onEdit,
  onDelete,
  options = {}
}) {

    const baseColumns = generateUniversalColumns(module);
  
  // ✅ Add actions column automatically if enabled
  const columns = enableActions ? [
    ...baseColumns,
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <UniversalActions 
          item={info.row.original}
          module={module}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    }
  ] : baseColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...options,
  });
  // 3. SAFETY CHECK - No data
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No {module} found</p>
        <p className="text-sm text-gray-400 mt-1">
          There are no {module} to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          {/* TABLE HEADER */}
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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

          {/* TABLE BODY */}
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW - Card Layout */}
      <div className="md:hidden space-y-4 p-4">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            {/* Render each cell as a row in the card */}
            {row.getVisibleCells().map((cell) => {
              // Skip actions column in mobile main view (will show at bottom)
              if (cell.column.id === "actions") return null;
              
              return (
                <div key={cell.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-500">
                    {cell.column.columnDef.header}:
                  </span>
                  <span className="text-sm text-gray-900">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </span>
                </div>
              );
            })}
            
            {/* ACTIONS AT BOTTOM FOR MOBILE */}
            {enableActions && (
              <div className="flex justify-end space-x-2 pt-3 mt-3 border-t border-gray-100">
                {flexRender(
                  row.getVisibleCells().find(cell => cell.column.id === "actions")?.column.columnDef.cell,
                  row.getVisibleCells().find(cell => cell.column.id === "actions")?.getContext()
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}