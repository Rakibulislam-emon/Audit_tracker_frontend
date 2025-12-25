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
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import BulkActionToolbar from "./BulkActionToolbar";
import UniversalActions from "./UniversalActions";
import { generateUniversalColumns } from "./universalColumns";
import { useAuthStore } from "@/stores/useAuthStore";

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

const MobileCard = ({ row, getPriorityLevel, enableActions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cells = row.getVisibleCells();
  const actionCell = cells.find((cell) => cell.column.id === "actions");
  // Filter out select and actions columns
  const dataCells = cells.filter(
    (cell) => cell.column.id !== "actions" && cell.column.id !== "select"
  );

  const primaryField = dataCells[0];
  const importantFields = dataCells.slice(1, 4);
  const otherFields = dataCells.slice(4);

  const getVisibleFields = (fields) => {
    return fields.filter((cell) => {
      const cellValue = flexRender(
        cell.column.columnDef.cell,
        cell.getContext()
      );
      return (
        cellValue &&
        cellValue !== "" &&
        cellValue !== null &&
        cellValue !== "N/A"
      );
    });
  };

  const visibleImportantFields = getVisibleFields(importantFields);
  const visibleOtherFields = getVisibleFields(otherFields);
  const hasMoreFields = visibleOtherFields.length > 0;

  const getPriorityBorder = (data, priorityFn) => {
    if (!priorityFn) return "border-l-border";

    const priority = priorityFn(data);
    switch (priority) {
      case "critical":
        return "border-l-destructive";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-warning";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-border";
    }
  };

  const getPriorityDotColor = (data, priorityFn) => {
    if (!priorityFn) return "bg-muted-foreground";

    const priority = priorityFn(data);
    switch (priority) {
      case "critical":
        return "bg-destructive animate-pulse";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div
      className={`
        group relative bg-card border-l-4 ${getPriorityBorder(
          row.original,
          getPriorityLevel
        )}
        border border-border rounded-lg overflow-hidden
        shadow-sm hover:shadow-md transition-all duration-300
        hover:border-primary/20
      `}
    >
      {/* Priority Indicator Dot */}
      {getPriorityLevel && (
        <div
          className={`
            absolute top-3  right-3 w-2 h-2 rounded-full z-10
            ${getPriorityDotColor(row.original, getPriorityLevel)}
          `}
        />
      )}

      {/* Card Header - Primary Field */}
      <div className="px-4 py-4  bg-gradient-to-r from-muted/20 to-transparent border-b border-border/50">
        <div className="flex  items-start justify-between gap-3">
          {/* Primary Content */}
          <div className="flex-1 min-w-0 pr-2 ">
            {primaryField && (
              <>
                <div className="text-xs  font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {primaryField.column.columnDef.header}
                </div>
                <div className="text-base font-semibold text-foreground leading-tight line-clamp-2">
                  {flexRender(
                    primaryField.column.columnDef.cell,
                    primaryField.getContext()
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {enableActions && actionCell && (
            <div className="flex-shrink-0 pt-1 ">
              {flexRender(
                actionCell.column.columnDef.cell,
                actionCell.getContext()
              )}
            </div>
          )}
        </div>
      </div>

      {/* Important Fields Section - Always Visible */}
      {visibleImportantFields.length > 0 && (
        <div className="px-4 py-1 ">
          <div className="flex flex-wrap gap-3">
            {visibleImportantFields.map((cell) => {
              const cellValue = flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              );

              return (
                <div
                  key={cell.id}
                  className="flex flex-wrap gap-4 items-center p-3 rounded-lg bg-muted/10 border border-border/30 hover:bg-muted/20 transition-colors duration-200"
                >
                  <div className="text-xs  font-medium text-muted-foreground uppercase tracking-wide">
                    {cell.column.columnDef.header} →
                  </div>
                  <div className="text-sm font-normal text-foreground break-words line-clamp-2">
                    {cellValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsible Other Fields Section */}
      {hasMoreFields && (
        <>
          {/* Expandable Content */}
          <div
            className={`
              overflow-hidden   transition-all duration-300 ease-in-out
              ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="px-4 grid grid-cols-2 pb-4 pt-2 space-y-3 border-t border-border/50">
              {visibleOtherFields.map((cell) => {
                const cellValue = flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                );

                return (
                  <div
                    key={cell.id}
                    className="flex flex-col gap-2 py-2 px-3 rounded-lg hover:bg-muted/10 transition-colors duration-200"
                  >
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {cell.column.columnDef.header}
                    </div>
                    <div className="text-sm text-foreground leading-relaxed break-words">
                      {cellValue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <div className="border-t border-border/50">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full cursor-pointer px-4 py-3 bg-muted/5 hover:bg-muted/10 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? "Collapse additional fields"
                  : `Expand ${visibleOtherFields.length} more fields`
              }
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `Show ${visibleOtherFields.length} More Field${
                      visibleOtherFields.length > 1 ? "s" : ""
                    }`}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </>
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
  enableBulkActions = true,
  onEdit,
  onDelete,
  options = {},
  getPriorityLevel = null,
  getRowCondition = null,
  moduleConfig,
  onCustomAction,
  onBulkDelete,
  onBulkExport,
  onBulkStatusChange,
  readOnly = false, // ✅ NEW: Disable all actions when true
}) {
  const [sorting, setSorting] = useState([]);
  const [density, setDensity] = useState("comfortable");
  const [rowSelection, setRowSelection] = useState({});
  const { user } = useAuthStore();

  // Override enableActions if readOnly
  const actualEnableActions = !readOnly && enableActions;
  const actualEnableBulkActions = !readOnly && enableBulkActions;

  // Memoize columns to prevent regeneration on every render
  const columns = useMemo(() => {
    const baseColumns = generateUniversalColumns(module);

    const selectionColumn = actualEnableBulkActions
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : [];

    const actionsColumn = actualEnableActions
      ? [
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
      : [];

    return [...selectionColumn, ...baseColumns, ...actionsColumn];
  }, [
    module,
    actualEnableActions,
    actualEnableBulkActions,
    onEdit,
    onDelete,
    moduleConfig,
    onCustomAction,
  ]);

  // Initialize React Table
  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: actualEnableBulkActions,
    getRowId: (row) => row._id || row.id,
    ...options,
  });

  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedItems = selectedRows.map((row) => row.original);

  console.log("[UniversalTable] data:", data);
  // Handle empty state
  if (!data || data.length === 0) {
    return <EmptyState module={module} />;
  }

  return (
    <div className="space-y-3">
      {/* Bulk Action Toolbar */}
      {actualEnableBulkActions && selectedItems.length > 0 && (
        <BulkActionToolbar
          selectedCount={selectedItems.length}
          selectedItems={selectedItems}
          onDeselectAll={() => setRowSelection({})}
          onBulkDelete={onBulkDelete}
          onBulkExport={onBulkExport}
          onBulkStatusChange={onBulkStatusChange}
          moduleConfig={moduleConfig}
          userRole={user?.role || ""}
        />
      )}

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
              enableActions={actualEnableActions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
