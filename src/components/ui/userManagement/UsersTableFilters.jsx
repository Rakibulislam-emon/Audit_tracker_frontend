"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "../button";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UsersFilters({ currentFilters }) {
  const [search, setSearch] = useState(currentFilters.search || "");
  const [selectedRole, setSelectedRole] = useState(currentFilters.role || "all");
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || "all");
  const router = useRouter();
  const { user } = useAuthStore();
  const role = user.role;

  // ✅ Updated URL update function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters = {};
      
      // ✅ ONLY add non-empty values and exclude "all" values
      if (search) filters.search = search;
      if (selectedRole && selectedRole !== "all") filters.role = selectedRole;
      if (selectedStatus && selectedStatus !== "all") filters.status = selectedStatus;
      
      const params = new URLSearchParams(filters);
      
      // ✅ Build URL - if no filters, remove all params
      const queryString = params.toString();
      const newUrl = queryString 
        ? `/dashboard/${role}/users?${queryString}`
        : `/dashboard/${role}/users`; // ✅ Clean URL when no filters
      
      router.push(newUrl);
    }, search ? 500 : 0); // ✅ Immediate update when clearing
    
    return () => clearTimeout(timeoutId);
  }, [search, selectedRole, selectedStatus, router, role]);

  return (
    <div className="md:flex flex-wrap gap-4 mb-6">
      {/* Search Input - Converted to shadcn Input */}
      <div className="flex-grow">
        <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1">
          Search
        </Label>
        <Input
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          {search ? "Search will update when you pause typing" : "Type to search users"}
        </p>
      </div>

      {/* Role Filter - Converted to shadcn Select */}
      <div>
        <Label htmlFor="roleFilter" className="text-sm font-medium text-gray-700 mb-1">
          Role
        </Label>
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger id="roleFilter" className="w-full">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="audit_manager">Audit Manager</SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
            <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
            <SelectItem value="sysadmin">SysAdmin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter - Converted to shadcn Select */}
      <div>
        <Label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mb-1">
          Status
        </Label>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger id="statusFilter" className="w-full">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Clear Filters Button */}
      {(search || selectedRole !== "all" || selectedStatus !== "all") && (
        <div className="flex items-center md:my-0 my-2">
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSelectedRole("all");
              setSelectedStatus("all");
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}