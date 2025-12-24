"use client";

import * as React from "react";
import { useModuleData } from "@/hooks/useUniversal";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

// =============================================================================
// HELPER FUNCTIONS (Safe to extract)
// =============================================================================

const getDisplayValue = (item) => {
  if (!item) return "";
  return (
    item.title ||
    item.name ||
    item.email ||
    item.questionText ||
    item.actionText ||
    `ID: ${item._id?.slice(-6) || "Unknown"}`
  );
};

const getValidationRules = (fieldConfig) => ({
  required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
});

// =============================================================================
// SMALL, SAFE SUB-COMPONENTS
// =============================================================================

const LoadingState = () => (
  <div className="flex items-center justify-center p-2">
    <Loader2 className="h-4 w-4 animate-spin mr-2" />
    Loading...
  </div>
);

const OptionItem = ({ item, isSelected, onSelect }) => (
  <CommandItem key={item._id} value={getDisplayValue(item)} onSelect={onSelect}>
    <Check
      className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
    />
    <span className="truncate">{getDisplayValue(item)}</span>
  </CommandItem>
);

// =============================================================================
// MAIN COMPONENT (Minimal changes to working structure)
// =============================================================================

export default function RelationSelect({
  fieldKey,
  fieldConfig,
  control,
  token,
  isSubmitting,
  errors,
  watch, // Access to form's watch function
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Build filters: merge custom filters from fieldConfig with search/status
  const filters = React.useMemo(() => {
    const baseFilters = { search: searchTerm, status: "active" };

    // Add custom filters from fieldConfig if they exist
    if (fieldConfig.queryFilters) {
      Object.assign(baseFilters, fieldConfig.queryFilters);
    }

    // Handle dynamic dependency-based filtering (e.g., filter users by site from auditSession)
    if (fieldConfig.dependsOn && watch) {
      const dependentFieldValue = watch(fieldConfig.dependsOn.field);

      if (dependentFieldValue && fieldConfig.dependsOn.extractSite) {
        // The dependent value should be the full audit session object or ID
        // For now, we'll use the ID to filter (backend should handle this)
        // Note: This assumes auditSession is populated with site
        baseFilters.auditSession = dependentFieldValue;
      }
    }

    return baseFilters;
  }, [searchTerm, fieldConfig.queryFilters, fieldConfig.dependsOn, watch]);

  const { data: relationData, isLoading } = useModuleData(
    fieldConfig.relation,
    token,
    filters
  );

  const options = relationData?.data || [];
  const hasError = !!errors[fieldKey];

  return (
    <Controller
      name={fieldKey}
      control={control}
      rules={getValidationRules(fieldConfig)}
      render={({ field }) => {
        const selectedItemName = React.useMemo(() => {
          if (!field.value || options.length === 0) return "";
          const item = options.find((opt) => opt._id === field.value);
          return item ? getDisplayValue(item) : "";
        }, [field.value, options]);

        // Event handler extracted but kept close to usage
        const handleOptionSelect = (item) => {
          field.onChange(item._id);
          setOpen(false);
          setSearchTerm("");
        };

        const handleInteractOutside = (e) => {
          if (e.target.closest('[data-state="open"]')) {
            e.preventDefault();
          }
        };

        return (
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground",
                  hasError && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              >
                <span className="truncate">
                  {isLoading
                    ? `Loading ${fieldConfig.relation}...`
                    : field.value && selectedItemName
                    ? selectedItemName
                    : fieldConfig.placeholder || `Select ${fieldConfig.label}`}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
              onInteractOutside={handleInteractOutside}
            >
              <Command>
                <CommandInput
                  placeholder={`Search ${fieldConfig.label}...`}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? <LoadingState /> : "No results found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((item) => (
                      <OptionItem
                        key={item._id}
                        item={item}
                        isSelected={field.value === item._id}
                        onSelect={() => handleOptionSelect(item)}
                      />
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
