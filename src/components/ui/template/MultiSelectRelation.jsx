// src/components/ui/template/MultiSelectRelation.jsx
"use client";

import { Badge } from "@/components/ui/badge";
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
import { useModuleData } from "@/hooks/useUniversal";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import * as React from "react";
import { Controller } from "react-hook-form";

// Helper function to get the correct display text for any module
const getDisplayValue = (item) => {
  if (!item) return "";
  return (
    item.title || // Program, Template, Schedule, Problem, AuditSession
    item.name || // User, Group, Company, Site, CheckType, Rule
    item.questionText || // Question, Observation
    item.actionText || // FixAction
    item.email || // User (fallback)
    `ID: ${item._id.slice(-6)}` // Fallback
  );
};

export default function MultiSelectRelation({
  fieldKey,
  fieldConfig,
  control,
  token,
  isSubmitting,
  errors,
}) {
  const [open, setOpen] = React.useState(false);


  console.log("fieldConfig from 49",fieldConfig?.relation)
  // 1. Load all options from the related module (e.g., all "questions")
  const { data: relationData, isLoading } = useModuleData(
    fieldConfig.relation, // e.g., "questions"
    token,
    {}
  );

  const options = relationData?.data || [];
  console.log('options:', options)
  const hasError = !!errors[fieldKey];

  return (
    // 2. Use Controller to connect to react-hook-form
    <Controller
      name={fieldKey} // e.g., "questions"
      control={control}
      rules={{
        required: fieldConfig.required
          ? `${fieldConfig.label} is required`
          : false,
        // You can add min/max length validation for arrays here
        // validate: value => value.length > 0 || 'At least one item is required'
      }}
      render={({ field }) => {
        // field.value will be the array of selected IDs (e.g., ['id1', 'id2'])
        const selectedIds = field.value || [];

        // Find the full "option" objects for the selected IDs
        const selectedOptions = options.filter((option) =>
          selectedIds.includes(option._id)
        );

        // 3. Popover (the dropdown container)
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={isSubmitting || isLoading}
                className={cn(
                  "w-full justify-between h-auto min-h-10 px-3 py-2 flex-wrap", // Allow badges to wrap
                  hasError ? "border-red-500" : "border-gray-300",
                  selectedIds.length === 0 ? "text-gray-500 font-normal" : ""
                )}
              >
                {/* 4. Display selected items as Badges */}
                <div className="flex gap-1.5 flex-wrap">
                  {selectedOptions.length > 0
                    ? selectedOptions.map((option) => (
                        <Badge
                          variant="secondary"
                          key={option._id}
                          className="rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          {getDisplayValue(option)}
                          <X
                            className="ml-1.5 h-3.5 w-3.5 cursor-pointer opacity-70 hover:opacity-100"
                            // 5. Handle removing an item (Deselect)
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent Popover from closing
                              const newSelectedIds = selectedIds.filter(
                                (id) => id !== option._id
                              );
                              field.onChange(newSelectedIds); // Update react-hook-form state
                            }}
                          />
                        </Badge>
                      ))
                    : // Placeholder text
                      fieldConfig.placeholder || `Select ${fieldConfig.label}`}
                </div>

                {isLoading && (
                  <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
              // This prevents the Popover from closing when an item is clicked
              onEscapeKeyDown={() => setOpen(false)}
              onPointerDownOutside={(e) => {
                // Prevent closing if clicking on the trigger
                if (e.target.closest('[role="combobox"]')) {
                  e.preventDefault();
                }
              }}
            >
              {/* 6. Searchable Command list */}
              <Command>
                <CommandInput placeholder="Search options..." />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "Loading..." : "No options found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = selectedIds.includes(option._id);
                      return (
                        <CommandItem
                          key={option._id}
                          value={getDisplayValue(option)} // Search text
                          // 7. Handle selecting an item
                          onSelect={() => {
                            if (isSelected) {
                              field.onChange(
                                selectedIds.filter((id) => id !== option._id)
                              );
                            } else {
                              field.onChange([...selectedIds, option._id]);
                            }
                            setOpen(true); // Keep popover open for multi-select
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex-1">
                            {getDisplayValue(option)}
                          </span>
                        </CommandItem>
                      );
                    })}
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
