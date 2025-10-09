export default function UserStatusBadge({ role, active }) {
  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    audit_manager: "bg-blue-100 text-blue-800",
    auditor: "bg-green-100 text-green-800",
    compliance_officer: "bg-orange-100 text-orange-800",
    sysadmin: "bg-red-100 text-red-800",
  };

  if (role)
    return (
      <span className={`md:px-2 px-6 flex items-center justify-center py-0.5 rounded-full text-xs ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
        {role}
      </span>
    );

  if (active !== undefined)
    return (
      <span
        className={`md:px-2 px-4 flex items-center justify-center md:my-0 my-2 py-0.5 rounded-full text-xs ${
          active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>
    );

  return null;
}
