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

export default function UniversalFilters({ module }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return null;
  }

  const filterConfig = config.filters || {};

  // ✅ SIMPLE state initialization from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  // ✅ EXACT SAME useEffect as your working version
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        const filters = {};

        // ✅ ONLY add non-empty values and exclude "all" values
        if (search) filters.search = search;
        if (role && role !== "all") filters.role = role;
        if (status && status !== "all") filters.status = status;

        const params = new URLSearchParams(filters);

        // ✅ Build URL - if no filters, remove all params
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl);
      },
      search ? 500 : 0
    ); // ✅ Same debounce logic

    return () => clearTimeout(timeoutId);
  }, [search, role, status, router, pathname]);

  const hasActiveFilters = search || role !== "all" || status !== "all";

  const clearAllFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {/* Search Input */}
        {filterConfig.search && (
          <div className="w-full sm:w-2/5">
            <Label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              {filterConfig.search.label || "Search"}
            </Label>
            <div className="relative lg:w-80 lg:mr-32">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                placeholder={
                  filterConfig.search.placeholder || `Search ${module}...`
                }
                className="w-full pl-10 pr-10 md:mr-40"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Role Filter */}
        {filterConfig.role && (
          <div className="w-full">
            <Label
              htmlFor="roleFilter"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="roleFilter" className="w-full">
                <SelectValue
                  placeholder={filterConfig.role.placeholder || "All Roles"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {filterConfig.role.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status Filter */}
        {filterConfig.status && (
          <div className="w-full">
            <Label
              htmlFor="statusFilter"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="statusFilter" className="w-full">
                <SelectValue
                  placeholder={
                    filterConfig.status.placeholder || "All Statuses"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filterConfig.status.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Button */}
        <div className="w-full sm:w-1/5">
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
