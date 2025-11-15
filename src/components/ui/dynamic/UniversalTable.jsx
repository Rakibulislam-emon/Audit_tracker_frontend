"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import UniversalActions from "./UniversalActions";
import { generateUniversalColumns } from "./universalColumns";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DENSITY_CONFIG = {
  compact: { desktop: "px-3 py-1.5", tablet: "px-2 py-1" },
  comfortable: { desktop: "px-4 py-3", tablet: "px-3 py-2" },
  spacious: { desktop: "px-6 py-4", tablet: "px-4 py-3" },
};

const PRIORITY_COLORS = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

const ROW_CONDITION_BACKGROUNDS = {
  overdue: "bg-red-50 hover:bg-red-100",
  pending: "bg-yellow-50 hover:bg-yellow-100",
  attention: "bg-orange-50 hover:bg-orange-100",
  normal: "hover:bg-gray-50",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getPriorityBorder = (row, getPriorityLevel) => {
  if (!getPriorityLevel) return "border-l-transparent";
  const priority = getPriorityLevel(row);
  return PRIORITY_COLORS[priority] || "border-l-transparent";
};

const getRowBackground = (row, getRowCondition) => {
  if (!getRowCondition) return "hover:bg-gray-50";
  const condition = getRowCondition(row);
  return ROW_CONDITION_BACKGROUNDS[condition] || "hover:bg-gray-50";
};

const getSortIcon = (column) => {
  if (!column.getCanSort()) return null;

  const sortState = column.getIsSorted();
  const iconProps = { className: "w-4 h-4 text-gray-400" };

  switch (sortState) {
    case "asc":
      return <ChevronUp {...iconProps} />;
    case "desc":
      return <ChevronDown {...iconProps} />;
    default:
      return <ChevronsUpDown {...iconProps} />;
  }
};

// =============================================================================
// COMPONENT SECTIONS
// =============================================================================

const EmptyState = ({ module }) => (
  <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
    <LayoutGrid className="w-12 h-12 mx-auto text-gray-400 mb-2" />
    <p className="text-gray-600 font-medium">No {module} found</p>
    <p className="text-sm text-gray-400 mt-1">
      There are no {module} to display at the moment.
    </p>
  </div>
);

const ControlsBar = ({ dataLength, module, density, onDensityChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div className="text-sm text-gray-500">
      Showing <span className="font-medium text-gray-700">{dataLength}</span>{" "}
      {module}
    </div>

    <DensityToggle density={density} onDensityChange={onDensityChange} />
  </div>
);

const DensityToggle = ({ density, onDensityChange }) => (
  <div className="hidden sm:flex items-center gap-2">
    <span className="text-xs text-gray-500">Density:</span>
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      {["compact", "comfortable", "spacious"].map((densityOption) => (
        <button
          key={densityOption}
          onClick={() => onDensityChange(densityOption)}
          className={`px-2 sm:px-3 py-1 text-xs font-medium transition-colors ${
            density === densityOption
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {densityOption.charAt(0).toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const TableHeader = ({ headerGroup, density, isTablet = false }) => (
  <tr>
    {headerGroup.headers.map((header) => (
      <th
        key={header.id}
        className={`
          ${
            isTablet
              ? DENSITY_CONFIG[density].tablet
              : DENSITY_CONFIG[density].desktop
          }
          text-xs font-semibold text-gray-600 uppercase tracking-wider text-center whitespace-nowrap
        `}
      >
        {header.isPlaceholder ? null : (
          <div
            className={`flex items-center justify-center gap-2 ${
              header.column.getCanSort() ? "cursor-pointer select-none" : ""
            }`}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {getSortIcon(header.column)}
          </div>
        )}
      </th>
    ))}
  </tr>
);

const TableRow = ({
  row,
  density,
  isTablet = false,
  getPriorityLevel,
  getRowCondition,
}) => (
  <tr
    className={` 
      border-l-4 transition-colors duration-150 
      ${getPriorityBorder(row.original, getPriorityLevel)}
      ${getRowBackground(row.original, getRowCondition)}
    `}
  >
    {row.getVisibleCells().map((cell) => (
      <td
        key={cell.id}
        className={`
          ${
            isTablet
              ? DENSITY_CONFIG[density].tablet
              : DENSITY_CONFIG[density].desktop
          }
          whitespace-nowrap text-sm text-gray-900 text-center
        `}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);

const MobileCard = ({ row, getPriorityLevel, enableActions }) => (
  <div
    className={`
      bg-white border-l-4 ${getPriorityBorder(row.original, getPriorityLevel)}
      border border-gray-200 rounded-lg overflow-hidden
    `}
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
          row.getVisibleCells().find((cell) => cell.column.id === "actions")
            ?.column.columnDef.cell,
          row
            .getVisibleCells()
            .find((cell) => cell.column.id === "actions")
            ?.getContext()
        )}
      </div>
    )}
  </div>
);

const ScrollIndicator = () => (
  <div className="bg-blue-50 border-t border-blue-200 px-3 py-2 text-center">
    <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
      <span>←</span>
      <span>Swipe to view all columns</span>
      <span>→</span>
    </p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalTable({
  module,
  data = [],
  enableActions = true,
  onEdit,
  onDelete,
  options = {},
  getPriorityLevel = null,
  getRowCondition = null,
  moduleConfig ,
  onCustomAction,
}) {
  const [sorting, setSorting] = useState([]);
  const [density, setDensity] = useState("comfortable");

  // Generate table columns
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

              moduleConfig={moduleConfig}
              onCustomAction={onCustomAction}
            />
          ),
          enableSorting: false,
        },
      ]
    : baseColumns;

  // Initialize React Table
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  console.log("[UniversalTable] data:", data);
  // Handle empty state
  if (!data || data.length === 0) {
    return <EmptyState module={module} />;
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <ControlsBar
        dataLength={data.length}
        module={module}
        density={density}
        onDensityChange={setDensity}
      />

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Desktop View (1024px+) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeader
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                  density={density}
                />
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  density={density}
                  getPriorityLevel={getPriorityLevel}
                  getRowCondition={getRowCondition}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet View (640px - 1024px) */}
        <div className="hidden sm:block lg:hidden overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableHeader
                    key={headerGroup.id}
                    headerGroup={headerGroup}
                    density={density}
                    isTablet={true}
                  />
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    density={density}
                    isTablet={true}
                    getPriorityLevel={getPriorityLevel}
                    getRowCondition={getRowCondition}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <ScrollIndicator />
        </div>

        {/* Mobile View (< 640px) */}
        <div className="sm:hidden space-y-3 p-3">
          {table.getRowModel().rows.map((row) => (
            <MobileCard
              key={row.id}
              row={row}
              getPriorityLevel={getPriorityLevel}
              enableActions={enableActions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
