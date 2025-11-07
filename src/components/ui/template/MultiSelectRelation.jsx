"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModuleData } from "@/hooks/useUniversal";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import * as React from "react";
import { Controller } from "react-hook-form";

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

export default function MultiSelectRelation({
  fieldKey,
  fieldConfig,
  control,
  token,
  isSubmitting,
  errors,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: relationData, isLoading } = useModuleData(
    fieldConfig.relation,
    token,
    { search: searchTerm }
  );

  const options = relationData?.data || [];
  const hasError = !!errors[fieldKey];

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    getDisplayValue(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const selectedIds = field.value || [];
        const selectedOptions = options.filter((option) =>
          selectedIds.includes(option._id)
        );

        const handleSelect = (optionId) => {
          if (selectedIds.includes(optionId)) {
            field.onChange(selectedIds.filter((id) => id !== optionId));
          } else {
            field.onChange([...selectedIds, optionId]);
          }
        };

        const removeSelected = (optionId, e) => {
          e.stopPropagation();
          field.onChange(selectedIds.filter((id) => id !== optionId));
        };

        return (
          <div className="space-y-3">
            {/* Selected Items Display */}
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md border">
                {selectedOptions.map((option) => (
                  <div
                    key={option._id}
                    className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border text-sm"
                  >
                    <span className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {getDisplayValue(option)}{" "}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => removeSelected(option._id, e)}
                      className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                      type="button"
                      onClick={(e) => removeSelected(null, e) || field.onChange([])}
                      className=" flex justify-center items-center gap-x-1 cursor-pointer hover:text-red-500 transition-colors"
                    >
                      <span>
                        Clear All
                      </span>
                      <X className="h-4 w-4" />
                    </button>
              </div>
            )}

            {/* Custom Dropdown */}
            <div className="relative ">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "w-full justify-between",
                  hasError && "border-red-500",
                  selectedIds.length === 0 && "text-muted-foreground"
                )}
                disabled={isSubmitting}
              >
                <span>
                  {isLoading ? "Loading..." : `Select ${fieldConfig.label}...`}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>

              {isOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
                  {/* Search Input */}
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={`Search ${fieldConfig.label}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                   {
                      searchTerm && ( <div className="absolute right-4 top-4">
                      <X
                        className="h-4 w-4 cursor-pointer hover:text-red-400"
                        onClick={() => setSearchTerm("")}
                      />
                    </div>)
                   }
                  </div>

                  {/* Options List */}
                  <div className="p-1">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : filteredOptions.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No {fieldConfig.label} found.
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = selectedIds.includes(option._id);
                        return (
                          <div
                            key={option._id}
                            onClick={() => handleSelect(option._id)}
                            className={cn(
                              "flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-100",
                              isSelected && "bg-blue-50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50"
                              )}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </div>
                            <span className="flex-1 truncate">
                              {getDisplayValue(option)}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
