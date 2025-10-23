// components/dynamic/universalColumns.js - Update করুন
import { universalConfig } from "@/config/dynamicConfig";

export const generateUniversalColumns = (module) => {
  const config = universalConfig[module];

  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return [];
  }

  const columns = [];

  Object.entries(config.fields).forEach(([fieldKey, fieldConfig]) => {
    if (fieldConfig.tableColumn) {
      const column = {
        accessorKey: fieldKey,
        header: fieldConfig.label,

        cell: (info) => {
          const value = info.getValue();

          // ✅ ENHANCED RELATION FIELD HANDLING
          if (fieldConfig.relation && value) {
            // Value is the populated object from backend
            if (typeof value === "object" && value !== null) {
              return (
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationBadgeColor(
                      fieldKey,
                      fieldConfig.relation
                    )}`}
                  >
                    {getRelationDisplayValue(
                      value,
                      fieldConfig.relation,
                      fieldKey
                    )}
                  </span>
                </div>
              );
            }
            return <span className="text-gray-400">N/A</span>;
          }

          // Handle different field types
          switch (fieldConfig.type) {
            case "select":
              const getColorClass = (value, fieldKey, module) => {
                // Your existing color logic...
                const colorMaps = {
                  users: {
                    isActive: {
                      active: "bg-green-100 text-green-800",
                      inactive: "bg-red-100 text-red-800",
                    },
                    role: {
                      admin: "bg-purple-100 text-purple-800",
                      auditor: "bg-blue-100 text-blue-800",
                      compliance_officer: "bg-orange-100 text-orange-800",
                      audit_manager: "bg-green-100 text-green-800",
                      sysadmin: "bg-red-100 text-red-800",
                    },
                  },
                  companies: {
                    status: {
                      active: "bg-green-100 text-green-800",
                      inactive: "bg-red-100 text-red-800",
                    },
                  },
                  groups: {
                    status: {
                      active: "bg-green-100 text-green-800",
                      inactive: "bg-red-100 text-red-800",
                    },
                  },
                };

                return (
                  colorMaps[module]?.[fieldKey]?.[value] ||
                  "bg-gray-100 text-gray-800"
                );
              };

              let displayValue = value;
              if (fieldKey === "isActive") {
                displayValue =
                  value === true || value === "active" ? "active" : "inactive";
              }

              return (
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(
                      displayValue,
                      fieldKey,
                      module
                    )}`}
                  >
                    {displayValue
                      ? displayValue
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

            case "textarea":
              return value ? (
                <div className="max-w-xs truncate" title={value}>
                  {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              );

            case "date":
              return value ? (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(value).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Never</span>
              );

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

  console.log(`✅ Generated ${columns.length} columns for ${module}`);
  return columns;
};

// ✅ ENHANCED: Relation Display Value Function
const getRelationDisplayValue = (item, relationModule, fieldKey) => {
  switch (relationModule) {
    case "users":
      // ✅ createdBy/updatedBy এর জন্য special formatting
      if (fieldKey === "createdBy" || fieldKey === "updatedBy") {
        return `${item.name} (${item.email})`;
      }
      return item.name || item.email;

    case "companies":
      return item.name;

    case "groups":
      return item.name;

    default:
      return item.name || item.title || "Unknown";
  }
};

// ✅ NEW: Relation Badge Colors
const getRelationBadgeColor = (fieldKey, relationModule) => {
  const colorMap = {
    users: {
      createdBy: "bg-purple-100 text-purple-800",
      updatedBy: "bg-blue-100 text-blue-800",
    },
    groups: {
      group: "bg-green-100 text-green-800",
    },
    companies: {
      company: "bg-orange-100 text-orange-800",
    },
    site:{
      site:"bg-orange-100 text-orange-800"
    }
  };

  return colorMap[relationModule]?.[fieldKey] || "bg-gray-100 text-gray-800";
};
