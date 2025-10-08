// src/components/admin/UsersFilters.jsx
export default function UsersFilters({ searchValue, onSearchChange, roleValue, onRoleChange, statusValue, onStatusChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Search */}
      <div className="flex-grow">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          id="search"
          value={searchValue}
          onChange={onSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Role Filter */}
      <div>
        <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="roleFilter"
          value={roleValue}
          onChange={onRoleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="audit_manager">Audit Manager</option>
          <option value="auditor">Auditor</option>
          <option value="compliance_officer">Compliance Officer</option>
          <option value="sysadmin">SysAdmin</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="statusFilter"
          value={statusValue}
          onChange={onStatusChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}
