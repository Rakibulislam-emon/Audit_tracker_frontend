"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { universalConfig } from "@/config/dynamicConfig";
import {
  Filter,
  Search,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UniversalFilterRelationSelect from "./UniversalFilterRelationSelect";

export default function UniversalFilters({ module, token }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return null;
  }

  const filterConfig = config.filters || {};
  const filterEntries = Object.entries(filterConfig);

  // Initialize filters from URL
  const getInitialFilters = () => {
    const initialFilters = {};
    if (!filterConfig) return initialFilters;

    Object.keys(filterConfig).forEach((key) => {
      initialFilters[key] = searchParams.get(key) || "";
    });
    return initialFilters;
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default for better UX
  const [isMobile, setIsMobile] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  }, [debouncedFilters, router, pathname]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Calculate active filter count
  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "all" && value !== ""
  ).length;

  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    const clearedFilters = {};
    Object.keys(filterConfig).forEach((key) => {
      clearedFilters[key] = "";
    });
    setFilters(clearedFilters);
  };

  const isFilterActive = (key) => {
    const value = filters[key];
    return value && value !== "all" && value !== "";
  };

  // Render individual filter components
  const renderFilter = (key, filter) => {
    const isActive = isFilterActive(key);

    switch (filter.type) {
      case "search":
        return (
          <div key={key} className="w-full lg:flex-1">
            <Label
              htmlFor={key}
              className="text-sm font-medium text-foreground mb-2 block"
            >
              <span className="flex items-center gap-2">
                {filter.label || "Search"}
                {isActive && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold animate-pulse">
                    ✓
                  </span>
                )}
              </span>
            </Label>
            <div className="relative w-full">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                  isActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <Input
                id={key}
                value={filters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                placeholder={filter.placeholder || `Search ${module}...`}
                className={`w-full pl-10 pr-10 transition-all duration-300 ${
                  isActive
                    ? "border-blue-500 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                aria-label={filter.label || "Search"}
              />
              {filters[key] && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(key, "")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case "select":
        if (filter.relation) {
          return (
            <div key={key} className="w-full lg:flex-1">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-foreground mb-2 block"
              >
                <span className="flex items-center gap-2">
                  {filter.label || key.charAt(0).toUpperCase() + key.slice(1)}
                  {isActive && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold animate-pulse">
                      ✓
                    </span>
                  )}
                </span>
              </Label>
              <div
                className={`transition-all duration-300 ${
                  isActive ? "ring-2 ring-blue-200 rounded-lg" : ""
                }`}
              >
                <UniversalFilterRelationSelect
                  id={key}
                  token={token}
                  moduleName={filter.relation}
                  placeholder={filter.placeholder || "All"}
                  value={filters[key] || ""}
                  onChange={(value) => handleFilterChange(key, value)}
                />
              </div>
            </div>
          );
        }

        return (
          <div key={key} className="w-full lg:flex-1">
            <Label
              htmlFor={key}
              className="text-sm font-medium text-foreground mb-2 block"
            >
              <span className="flex items-center gap-2">
                {filter.label || key.charAt(0).toUpperCase() + key.slice(1)}
                {isActive && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold animate-pulse">
                    ✓
                  </span>
                )}
              </span>
            </Label>
            <div
              className={`transition-all duration-300 ${
                isActive ? "ring-2 ring-blue-200 rounded-lg" : ""
              }`}
            >
              <Select
                value={filters[key] || ""}
                onValueChange={(value) =>
                  handleFilterChange(key, value === "all" ? "" : value)
                }
              >
                <SelectTrigger
                  id={key}
                  className={`w-full transition-all duration-300 ${
                    isActive
                      ? "border-blue-500 bg-blue-50 text-blue-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                >
                  <SelectValue placeholder={filter.placeholder || "All"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {filter.placeholder || "All"}
                  </SelectItem>
                  {filter.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {!isExpanded ? (
        // Collapsed State - Compact Button
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {hasActiveFilters ? "Filters Applied" : "Show Filters"}
              </span>
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-500 text-white text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  className="h-8 px-3 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  type="button"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          {/* Active Filters Preview */}
          {hasActiveFilters && (
            <div className="px-4 pb-3 pt-1 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value === "all" || value === "") return null;

                  const filterConfigItem = filterConfig[key];
                  const displayValue =
                    filterConfigItem?.options?.find((opt) => opt === value) ||
                    value;

                  return (
                    <div
                      key={key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-200"
                    >
                      <span className="font-medium">
                        {filterConfigItem?.label || key}:
                      </span>
                      <span className="max-w-[100px] truncate">
                        {displayValue}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange(key, "");
                        }}
                        className="ml-0.5 text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Expanded State - Full Filter Panel
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Filters
                </h3>
              </div>

              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-blue-500 text-white text-sm font-bold transition-all duration-300 animate-in fade-in zoom-in-95 shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-9 px-4 text-sm text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm"
                  type="button"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-9 px-3 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
                type="button"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Filters
              </Button>
            </div>
          </div>

          {/* Filters Grid - Ultra Responsive */}
          <div
            className={`
            grid gap-4 transition-all duration-500 ease-in-out
            grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
          `}
          >
            {filterEntries.map(([key, filter]) => renderFilter(key, filter))}
          </div>

          {/* Empty State */}
          {!hasActiveFilters && filterEntries.length > 0 && (
            <div className="text-center py-6 sm:py-8 mt-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No active filters
                </h4>
                <p className="text-gray-500 text-sm">
                  Use the filters above to refine your search results and find
                  exactly what you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
