import { universalConfig } from "@/config/dynamicConfig";

/**
 * UNIVERSAL COLUMNS GENERATOR
 *
 * Automatically generates TanStack Table columns from module configuration
 *
 * @param {string} module - Module name: "users", "groups", "companies"
 * @param {function} actionsComponent - Custom actions component (edit/delete buttons)
 * @returns {array} - Array of column definitions for TanStack Table
 *
 * USAGE:
 * const columns = generateUniversalColumns("users", UserActions);
 * const table = useReactTable({ columns, data });
 */
export const generateUniversalColumns = (module, actionsComponent = null) => {
  // 1. GET MODULE CONFIGURATION
  const config = universalConfig[module];

  // 2. SAFETY CHECK
  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return [];
  }

  const columns = [];

  // 3. LOOP THROUGH ALL FIELDS IN CONFIGURATION
  Object.entries(config.fields).forEach(([fieldKey, fieldConfig]) => {
    // 4. ONLY INCLUDE FIELDS MARKED FOR TABLE DISPLAY
    if (fieldConfig.tableColumn) {
      // 5. CREATE COLUMN DEFINITION
      const column = {
        accessorKey: fieldKey, // Data key: "name", "email", "role"
        header: fieldConfig.label, // Column header: "Full Name", "Email"

        // 6. CELL RENDERER - Transforms data for display based on field type
        cell: (info) => {
          const value = info.getValue(); // Get actual value from data

          // Handle different field types with special rendering
          switch (fieldConfig.type) {
            // SWITCH FIELDS (like isActive) - Show badge
            case "select":
              // Special handling for status field

              if (fieldKey === "isActive") {
                // Handle both boolean and string values
                const isActive = value === true || value === "active";

                return (
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                );
              }

              // Existing role handling
              const roleColors = {
                admin: "bg-purple-100 text-purple-800",
                audit_manager: "bg-blue-100 text-blue-800",
                auditor: "bg-green-100 text-green-800",
                compliance_officer: "bg-orange-100 text-orange-800",
                sysadmin: "bg-red-100 text-red-800",
              };

              return (
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      roleColors[value] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {value
                      ? value
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "N/A"}
                  </span>
                </div>
              );

            // TEXTAREA FIELDS - Truncate long text
            case "textarea":
              return value ? (
                <div
                  className="max-w-xs truncate"
                  title={value} // Show full text on hover
                >
                  {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              );

            // DATE FIELDS - Format properly
            case "date":
              return value ? (
                <div className="text-center">
                  {new Date(value).toLocaleDateString()}
                </div>
              ) : (
                <span className="text-gray-400">Never</span>
              );

            // EMAIL FIELDS - Make clickable
            case "email":
              return value ? (
                <a
                  href={`mailto:${value}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              );

            // DEFAULT - Just display value
            default:
              return value ? (
                <div>{value}</div>
              ) : (
                <span className="text-gray-400">N/A</span>
              );
          }
        },
      };

      columns.push(column);
    }
  });

  // 7. ADD ACTIONS COLUMN IF PROVIDED
  if (actionsComponent) {
    columns.push({
      id: "actions",
      header: "Actions",
      // cell: (info) => actionsComponent(info), // Use provided actions component
      cell: actionsComponent,
    });
  }

  console.log(`✅ Generated ${columns.length} columns for ${module}`);
  return columns;
};
