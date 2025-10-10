"use client";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function UsersFilters({ currentFilters }) {
  const router = useRouter();
  const role = "admin"
  const timeoutRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(currentFilters.search || "");

  // Debounced search function
  const updateSearchFilter = useCallback((value) => {
    setLocalSearch(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout - 500ms delay after typing stops
    timeoutRef.current = setTimeout(() => {
      const newFilters = { ...currentFilters, search: value };
      
      // Remove empty filters
      Object.keys(newFilters).forEach(key => {
        if (!newFilters[key]) delete newFilters[key];
      });
      
      const params = new URLSearchParams(newFilters);
      router.push(`/dashboard/${role}/users?${params.toString()}`);
    }, 500); // Wait 500ms after user stops typing
  }, [currentFilters, router]);

  // Immediate update for other filters (role, status)
  const updateFilter = (key, value) => {
    const newFilters = { ...currentFilters, [key]: value };
    
    Object.keys(newFilters).forEach(key => {
      if (!newFilters[key]) delete newFilters[key];
    });
    
    const params = new URLSearchParams(newFilters);
    router.push(`/dashboard/admin/users?${params.toString()}`);
  };

  return (
    <div className="md:flex flex-wrap gap-4 mb-6">
      {/* Search Input - With Debouncing */}
      <div className="flex-grow">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          value={localSearch}
          onChange={(e) => updateSearchFilter(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Search will update after you stop typing</p>
      </div>

      {/* Role Filter - Immediate Update */}
      <div>
        <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="roleFilter"
          value={currentFilters.role || ""}
          onChange={(e) => updateFilter("role", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="audit_manager">Audit Manager</option>
          <option value="auditor">Auditor</option>
          <option value="compliance_officer">Compliance Officer</option>
          <option value="sysadmin">SysAdmin</option>
        </select>
      </div>

      {/* Status Filter - Immediate Update */}
      <div>
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="statusFilter"
          value={currentFilters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}