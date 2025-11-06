"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter, LayoutGrid, List } from "lucide-react";
import UniversalActions from "./UniversalActions";
import { generateUniversalColumns } from "./universalColumns";

/**
 * ENHANCED UNIVERSAL TABLE COMPONENT - FULLY RESPONSIVE
 *
 * Responsive breakpoints:
 * - Mobile (< 640px): Card view
 * - Tablet Portrait (640px - 1024px): Horizontal scroll table
 * - Tablet Landscape/Desktop (1024px+): Full table view
 *
 * @param {string} module - Module name: "users", "groups", "companies", "audits"
 * @param {array} data - Array of items to display
 * @param {boolean} enableActions - Show actions column
 * @param {function} onEdit - Edit handler
 * @param {function} onDelete - Delete handler
 * @param {object} options - Additional table options
 * @param {function} getPriorityLevel - Function to determine row priority (optional)
 * @param {function} getRowCondition - Function for conditional row styling (optional)
 */
export default function UniversalTable({
 
  module,
  data = [],
  enableActions = true,
  onEdit,
  onDelete,
  options = {},
  getPriorityLevel = null,
  getRowCondition = null,
}) {
  const [sorting, setSorting] = useState([]);
  const [density, setDensity] = useState("comfortable");
  
  const baseColumns = generateUniversalColumns(module);

  const columns = enableActions
    ? [
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
          enableSorting: false,
        },
      ]
    : baseColumns;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  const getPriorityColor = (row) => {
    if (!getPriorityLevel) return "border-l-transparent";
    
    const priority = getPriorityLevel(row);
    const colors = {
      critical: "border-l-red-500",
      high: "border-l-orange-500",
      medium: "border-l-yellow-500",
      low: "border-l-green-500",
    };
    return colors[priority] || "border-l-transparent";
  };

  const getRowBackground = (row) => {
    if (!getRowCondition) return "hover:bg-gray-50";
    
    const condition = getRowCondition(row);
    const backgrounds = {
      overdue: "bg-red-50 hover:bg-red-100",
      pending: "bg-yellow-50 hover:bg-yellow-100",
      attention: "bg-orange-50 hover:bg-orange-100",
      normal: "hover:bg-gray-50",
    };
    return backgrounds[condition] || "hover:bg-gray-50";
  };

  const densityPadding = {
    compact: "px-3 py-1.5",
    comfortable: "px-4 py-3",
    spacious: "px-6 py-4",
  };

  // Tablet-specific density (smaller padding)
  const tabletDensityPadding = {
    compact: "px-2 py-1",
    comfortable: "px-3 py-2",
    spacious: "px-4 py-3",
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <div className="text-gray-400 mb-2">
          <LayoutGrid className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-600 font-medium">No {module} found</p>
        <p className="text-sm text-gray-400 mt-1">
          There are no {module} to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* CONTROLS BAR - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{data.length}</span> {module}
        </div>
        
        {/* DENSITY TOGGLE - Hide on mobile, show on tablet+ */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-gray-500">Density:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {["compact", "comfortable", "spacious"].map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`px-2 sm:px-3 py-1 text-xs font-medium transition-colors ${
                  density === d
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {d.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        
        {/* DESKTOP TABLE VIEW (1024px+) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${densityPadding[density]} text-xs font-semibold text-gray-600 uppercase tracking-wider text-center`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center justify-center gap-2 ${
                            header.column.getCanSort() ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronsUpDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-l-4 transition-all duration-150 ${getPriorityColor(
                    row.original
                  )} ${getRowBackground(row.original)}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`${densityPadding[density]} whitespace-nowrap text-sm text-gray-900 text-center`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TABLET TABLE VIEW (640px - 1024px) - Horizontal Scroll */}
        <div className="hidden sm:block lg:hidden overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`${tabletDensityPadding[density]} text-xs font-semibold text-gray-600 uppercase tracking-wide text-center whitespace-nowrap`}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center justify-center gap-1 ${
                              header.column.getCanSort() ? "cursor-pointer select-none" : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === "asc" ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronsUpDown className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-l-4 transition-all duration-150 ${getPriorityColor(
                      row.original
                    )} ${getRowBackground(row.original)}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${tabletDensityPadding[density]} whitespace-nowrap text-sm text-gray-900 text-center`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Scroll Indicator for Tablet */}
          <div className="bg-blue-50 border-t border-blue-200 px-3 py-2 text-center">
            <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
              <span>←</span>
              <span>Swipe to view all columns</span>
              <span>→</span>
            </p>
          </div>
        </div>

        {/* MOBILE VIEW - Card Layout (< 640px) */}
        <div className="sm:hidden space-y-3 p-3">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={`bg-white border-l-4 ${getPriorityColor(
                row.original
              )} border-r border-t border-b border-gray-200 rounded-lg shadow-sm overflow-hidden`}
            >
              <div className="p-4 space-y-2">
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "actions") return null;

                  return (
                    <div
                      key={cell.id}
                      className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[100px]">
                        {cell.column.columnDef.header}
                      </span>
                      <span className="text-sm text-gray-900 text-right flex-1">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </div>

              {enableActions && (
                <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}