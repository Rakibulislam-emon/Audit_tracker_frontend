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
import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UniversalFilterRelationSelect from "./UniversalFilterRelationSelect";

// একটি হেল্পার ফাংশন যা URL থেকে প্রাথমিক ফিল্টার মান সেট করে
const getInitialFilters = (filterConfig) => {
  const params = useSearchParams();
  const initialFilters = {};
  if (!filterConfig) return initialFilters;

  Object.keys(filterConfig).forEach((key) => {
    initialFilters[key] = params.get(key) || ""; // 'all' বা '' ডিফল্ট
  });
  return initialFilters;
};

export default function UniversalFilters({ module, token }) {
  // ✅ 'token' prop যোগ করা হয়েছে
  const router = useRouter();
  const pathname = usePathname();
  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return null;
  }

  const filterConfig = config.filters || {};
  const filterEntries = Object.entries(filterConfig);

  // ✅ ডাইনামিক স্টেট: একটি অবজেক্ট যা সব ফিল্টার ধারণ করে
  const [filters, setFilters] = useState(getInitialFilters(filterConfig));
  const [debouncedFilters] = useDebounce(filters, 300); // 300ms ডিবাউন্স

  // ✅ ডাইনামিক useEffect: URL আপডেট করার জন্য
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

  // ডাইনামিক হ্যান্ডলার
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all"
  );

  const clearAllFilters = () => {
    const clearedFilters = {};
    Object.keys(filterConfig).forEach((key) => {
      clearedFilters[key] = ""; // সব ফিল্টার খালি করুন
    });
    setFilters(clearedFilters);
  };

  // ✅ ডাইনামিক রেন্ডার ফাংশন
  const renderFilter = (key, filter) => {
    switch (filter.type) {
      case "search":
        return (
          <div key={key} className="w-full bg- sm:w-2/5 min-w-[200px]">
            <Label
              htmlFor={key}
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              {filter.label || "Search"}
            </Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id={key}
                value={filters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                placeholder={filter.placeholder || `Search ${module}...`}
                className="w-full pl-10 pr-10"
              />
              {filters[key] && (
                <button
                  type="button"
                  onClick={() => handleFilterChange(key, "")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case "select":
        // ✅ ডাইনামিক রিলেশন (যেমন 'group')
        if (filter.relation) {
          return (
            <div key={key} className="flex-1 min-w-[150px]">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                {filter.label || key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <UniversalFilterRelationSelect
                id={key}
                token={token}
                moduleName={filter.relation} // e.g., "groups"
                placeholder={filter.placeholder || "All"}
                value={filters[key] || ""}
                onChange={(value) => handleFilterChange(key, value)}
              />
            </div>
          );
        }

        // ✅ স্ট্যাটিক সিলেক্ট (যেমন 'status')
        return (
          <div key={key} className="flex-1 min-w-[150px]">
            <Label
              htmlFor={key}
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              {filter.label || key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Select
              value={filters[key] || ""}
              onValueChange={(value) =>
                handleFilterChange(key, value === "all" ? "" : value)
              }
            >
              <SelectTrigger id={key} className="w-full">
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap md:flex-wrap lg:flex-row gap-4 items-end w-full">
        {/* ✅ ডাইনামিক লুপের মাধ্যমে সব ফিল্টার রেন্ডার করা */}
        {filterEntries.map(([key, filter]) => renderFilter(key, filter))}

        {/* Clear Button */}
        <div className="sm:w-1/5 w-full">
          <Button
            variant={hasActiveFilters ? "outline" : "ghost"}
            onClick={clearAllFilters}
            className="w-full h-10"
            size="sm"
            disabled={!hasActiveFilters}
            type="button"
          >
            {hasActiveFilters ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Clear
              </>
            ) : (
              <>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
