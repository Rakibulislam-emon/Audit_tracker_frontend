"use client";

import { Button } from "@/components/ui/button";
import { useModuleData } from "@/hooks/useUniversal";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import * as React from "react";
import { Controller } from "react-hook-form";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DEFAULT_MESSAGES = {
  loading: "Loading...",
  noResults: "No items found.",
  selectPlaceholder: "Select items...",
  clearAll: "Clear All",
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Custom hook to handle click outside detection
 */
const useClickOutside = (ref, handler) => {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extracts display value from an item object
 */
const getDisplayValue = (item) => {
  if (!item) return "";

  return (
    item.title ||
    item.name ||
    item.questionText ||
    item.actionText ||
    item.email ||
    `ID: ${item._id?.slice(-6) || "Unknown"}`
  );
};

/**
 * Extracts IDs from selected options array
 */
const getSelectedIds = (selectedOptions = []) => {
  return selectedOptions.map((opt) => opt._id);
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Displays selected items as tags
 */
const SelectedItemsDisplay = ({ selectedOptions, onRemove, onClearAll }) => {
  if (selectedOptions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
      {selectedOptions.map((option) => (
        <SelectedTag key={option?._id} option={option} onRemove={onRemove} />
      ))}
      <ClearAllButton onClearAll={onClearAll} />
    </div>
  );
};

/**
 * Individual selected item tag
 */
const SelectedTag = ({ option, onRemove }) => (
  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-sm">
    <span className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
      {getDisplayValue(option)}
    </span>
    <button
      type="button"
      onClick={(e) => onRemove(option._id, e)}
      className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);

/**
 * Clear all selected items button
 */
const ClearAllButton = ({ onClearAll }) => (
  <button
    type="button"
    onClick={onClearAll}
    className="flex justify-center items-center gap-x-1 cursor-pointer hover:text-red-500 transition-colors text-sm"
  >
    <span>{DEFAULT_MESSAGES.clearAll}</span>
    <X className="h-4 w-4" />
  </button>
);

/**
 * Search input for filtering options
 */
const SearchInput = ({ searchTerm, onSearchChange }) => (
  <div className="p-2 border-b">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

/**
 * Loading state for options
 */
const OptionsLoading = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-4 w-4 animate-spin mr-2" />
    {DEFAULT_MESSAGES.loading}
  </div>
);

/**
 * Empty state when no options are found
 */
const OptionsEmpty = ({ label }) => (
  <div className="p-4 text-center text-gray-500">
    {DEFAULT_MESSAGES.noResults}
  </div>
);

/**
 * Individual option item in the dropdown
 */
const OptionItem = ({ option, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(option)}
    className={cn(
      "flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-100",
      isSelected && "bg-blue-50"
    )}
  >
    <SelectionIndicator isSelected={isSelected} />
    <span className="flex-1 truncate">{getDisplayValue(option)}</span>
  </div>
);

/**
 * Checkbox-like selection indicator
 */
const SelectionIndicator = ({ isSelected }) => (
  <div
    className={cn(
      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
      isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
    )}
  >
    <Check
      className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
    />
  </div>
);

/**
 * Dropdown trigger button
 */
const DropdownTrigger = ({
  isOpen,
  onToggle,
  isLoading,
  selectedCount,
  label,
  hasError,
  isSubmitting,
}) => (
  <Button
    type="button"
    variant="outline"
    onClick={onToggle}
    className={cn(
      "w-full justify-between",
      hasError && "border-red-500",
      selectedCount === 0 && "text-muted-foreground"
    )}
    disabled={isSubmitting}
  >
    <span>
      {isLoading
        ? DEFAULT_MESSAGES.loading
        : `${DEFAULT_MESSAGES.selectPlaceholder}`}
    </span>
    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
);

/**
 * Dropdown content with options list
 */
const DropdownContent = ({
  isOpen,
  searchTerm,
  onSearchChange,
  isLoading,
  options,
  selectedIds,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
      <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

      <div className="p-1">
        {isLoading ? (
          <OptionsLoading />
        ) : options.length === 0 ? (
          <OptionsEmpty />
        ) : (
          options.map((option) => (
            <OptionItem
              key={option._id}
              option={option}
              isSelected={selectedIds.includes(option._id)}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MultiSelectRelation({
  fieldKey,
  fieldConfig,
  control,
  token,
  isSubmitting,
  errors,
}) {
  // ===========================================================================
  // STATE & HOOKS
  // ===========================================================================

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const dropdownRef = React.useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================

  const { data: relationData, isLoading } = useModuleData(
    fieldConfig.relation,
    token,
    { search: searchTerm }
  );

  const options = relationData?.data || [];
  const hasError = !!errors[fieldKey];

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <Controller
      name={fieldKey}
      control={control}
      rules={{
        required: fieldConfig.required
          ? `${fieldConfig.label} is required`
          : false,
      }}
      render={({ field }) => {
        const selectedOptions = field.value || [];
        const selectedIds = getSelectedIds(selectedOptions);

        // =====================================================================
        // EVENT HANDLERS
        // =====================================================================

        const handleSelect = (option) => {
          if (selectedIds.includes(option._id)) {
            // Remove option
            field.onChange(
              selectedOptions.filter((item) => item._id !== option._id)
            );
          } else {
            // Add option
            field.onChange([...selectedOptions, option]);
          }
        };

        const handleRemove = (optionId, e) => {
          e.stopPropagation();
          field.onChange(
            selectedOptions.filter((item) => item._id !== optionId)
          );
        };

        const handleClearAll = (e) => {
          e.stopPropagation();
          field.onChange([]);
        };

        const toggleDropdown = () => setIsOpen(!isOpen);
        const handleSearchChange = (value) => setSearchTerm(value);

        // =====================================================================
        // COMPONENT RENDER
        // =====================================================================

        return (
          <div className="space-y-3">
            {/* Selected Items Display */}
            <SelectedItemsDisplay
              selectedOptions={selectedOptions}
              onRemove={handleRemove}
              onClearAll={handleClearAll}
            />

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <DropdownTrigger
                isOpen={isOpen}
                onToggle={toggleDropdown}
                isLoading={isLoading}
                selectedCount={selectedOptions.length}
                label={fieldConfig.label}
                hasError={hasError}
                isSubmitting={isSubmitting}
              />

              <DropdownContent
                isOpen={isOpen}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                isLoading={isLoading}
                options={options}
                selectedIds={selectedIds}
                onSelect={handleSelect}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
