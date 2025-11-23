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
  ChevronRight,
  MoreVertical,
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
  critical: "border-l-red-500 dark:border-l-red-400",
  high: "border-l-orange-500 dark:border-l-orange-400",
  medium: "border-l-yellow-500 dark:border-l-yellow-400",
  low: "border-l-green-500 dark:border-l-green-400",
};

const ROW_CONDITION_BACKGROUNDS = {
  overdue:
    "bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50",
  pending:
    "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50",
  attention:
    "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
  normal: "hover:bg-gray-50 dark:hover:bg-muted/50",
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
  if (!getRowCondition) return "hover:bg-gray-50 ";
  const condition = getRowCondition(row);
  return ROW_CONDITION_BACKGROUNDS[condition] || "hover:bg-gray-50";
};

const getSortIcon = (column) => {
  if (!column.getCanSort()) return null;

  const sortState = column.getIsSorted();
  const iconProps = {
    className: "w-4 h-4 text-gray-400 dark:text-muted-foreground",
  };

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
  <div className="text-center py-12 border border-border rounded-lg bg-muted/30 dark:bg-muted/20">
    <LayoutGrid className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
    <p className="text-foreground font-medium">No {module} found</p>
    <p className="text-sm text-muted-foreground mt-1">
      There are no {module} to display at the moment.
    </p>
  </div>
);

const ControlsBar = ({ dataLength, module, density, onDensityChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div className="text-sm text-muted-foreground">
      Showing <span className="font-medium text-foreground">{dataLength}</span>{" "}
      {module}
    </div>

    <DensityToggle density={density} onDensityChange={onDensityChange} />
  </div>
);

const DensityToggle = ({ density, onDensityChange }) => (
  <div className="hidden sm:flex items-center gap-2">
    <span className="text-xs text-muted-foreground">Density:</span>
    <div className="flex border border-border rounded-lg overflow-hidden">
      {["compact", "comfortable", "spacious"].map((densityOption) => (
        <button
          key={densityOption}
          onClick={() => onDensityChange(densityOption)}
          className={`px-2 sm:px-3 py-1 text-xs font-medium transition-colors ${
            density === densityOption
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-muted"
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
          text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center whitespace-nowrap
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
          whitespace-nowrap text-sm text-foreground text-center
        `}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);

// Enhanced MobileCard with better UX
const MobileCard = ({ row, getPriorityLevel, enableActions }) => {
  const cells = row.getVisibleCells();
  const actionCell = cells.find((cell) => cell.column.id === "actions");
  const dataCells = cells.filter((cell) => cell.column.id !== "actions");

  // Separate primary and secondary fields for better hierarchy
  const primaryField = dataCells[0];
  const importantFields = dataCells.slice(1, 3); // Next 2 fields
  const otherFields = dataCells.slice(3);

  return (
    <div
      className={`
        group relative bg-card border-l-4 ${getPriorityBorder(
          row.original,
          getPriorityLevel
        )}
        border border-border rounded-xl overflow-hidden
        shadow-sm hover:shadow-lg transition-all duration-300
        hover:border-primary/30 hover:-translate-y-0.5
      `}
    >
      {/* Priority Indicator Dot */}
      {getPriorityLevel && (
        <div
          className={`
          absolute top-3 right-3 w-2 h-2 rounded-full
          ${getPriorityBorder(row.original, getPriorityLevel)
            .replace("border-l-", "bg-")
            .replace("-500", "-500")
            .replace("dark:border-l-", "")}
          ${
            getPriorityLevel(row.original) === "critical"
              ? "bg-red-500 animate-pulse"
              : ""
          }
          ${getPriorityLevel(row.original) === "high" ? "bg-orange-500" : ""}
          ${getPriorityLevel(row.original) === "medium" ? "bg-yellow-500" : ""}
          ${getPriorityLevel(row.original) === "low" ? "bg-green-500" : ""}
        `}
        />
      )}

      {/* Card Header */}
      <div className="px-4 py-4 bg-gradient-to-r from-muted/30 to-transparent border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 pr-2">
            {primaryField && (
              <>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  {primaryField.column.columnDef.header}
                </div>
                <div className="text-lg font-bold text-foreground leading-tight line-clamp-2">
                  {flexRender(
                    primaryField.column.columnDef.cell,
                    primaryField.getContext()
                  )}
                </div>
              </>
            )}
          </div>
          {enableActions && actionCell && (
            <div className="flex-shrink-0 pt-1">
              {flexRender(
                actionCell.column.columnDef.cell,
                actionCell.getContext()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Important Fields Section */}
      {importantFields.length > 0 && (
        <div className="px-4 py-3 bg-muted/10 border-b border-border/50">
          <div className="grid grid-cols-1 gap-2.5">
            {importantFields.map((cell) => {
              const cellValue = flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              );
              if (!cellValue) return null;

              return (
                <div key={cell.id} className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[90px]">
                    {cell.column.columnDef.header}:
                  </div>
                  <div className="flex-1 text-sm font-medium text-foreground">
                    {cellValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Fields Section */}
      {otherFields.length > 0 && (
        <div className="px-4 py-3 space-y-2.5">
          {otherFields.map((cell, index) => {
            const cellValue = flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            );
            if (!cellValue) return null;

            return (
              <div
                key={cell.id}
                className={`
                  flex flex-col gap-1.5 py-2 px-3 rounded-md
                  ${
                    index < otherFields.length - 1
                      ? "border-b border-border/30"
                      : ""
                  }
                  hover:bg-muted/20 transition-colors
                `}
              >
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {cell.column.columnDef.header}
                </div>
                <div className="text-sm text-foreground leading-relaxed break-words">
                  {cellValue}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Actions (if actions not in header) */}
      {enableActions && actionCell && !actionCell && (
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <div className="flex items-center justify-end gap-2">
            {flexRender(
              actionCell.column.columnDef.cell,
              actionCell.getContext()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ScrollIndicator = () => (
  <div className="bg-blue-50 dark:bg-blue-950/30 border-t border-blue-200 dark:border-blue-800/50 px-3 py-2 text-center">
    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
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
  moduleConfig,
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
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {/* Desktop View (1024px+) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeader
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                  density={density}
                />
              ))}
            </thead>
            <tbody className="bg-card divide-y divide-border">
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
              <thead className="bg-muted/50 border-b border-border">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableHeader
                    key={headerGroup.id}
                    headerGroup={headerGroup}
                    density={density}
                    isTablet={true}
                  />
                ))}
              </thead>
              <tbody className="bg-card divide-y divide-border">
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
