// components/dynamic/universalColumns.js - Professional & Minimal
import { universalConfig } from "@/config/dynamicConfig";

// 🎨 PROFESSIONAL COLOR SYSTEM - Minimal & Clean
const COLOR_SYSTEM = {
  // 🔄 STATUS COLORS
  status: {
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-gray-50 text-gray-600 border border-gray-200",
  },

  // 👥 ROLE COLORS
  roles: {
    admin: "bg-purple-50 text-purple-700 border border-purple-200",
    auditor: "bg-blue-50 text-blue-700 border border-blue-200",
    compliance_officer: "bg-amber-50 text-amber-700 border border-amber-200",
    audit_manager: "bg-teal-50 text-teal-700 border border-teal-200",
    sysadmin: "bg-red-50 text-red-700 border border-red-200",
    user: "bg-green-50 text-green-700 border border-green-200",
    lead: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    member: "bg-sky-50 text-sky-700 border border-sky-200",
    observer: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    specialist: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  },

  // 📅 PROGRAM STATUS COLORS
  programStatus: {
    planning: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-green-50 text-green-700 border border-green-200",
    "on-hold": "bg-gray-50 text-gray-600 border border-gray-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
  },

  // ⚠️ SEVERITY COLORS
  severity: {
    informational: "bg-gray-50 text-gray-600 border border-gray-200",
    low: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    high: "bg-orange-50 text-orange-700 border border-orange-200",
    critical: "bg-red-50 text-red-700 border border-red-200",
  },

  // 🔧 RESOLUTION STATUS COLORS
  resolution: {
    open: "bg-red-50 text-red-700 border border-red-200",
    "in progress": "bg-amber-50 text-amber-700 border border-amber-200",
    resolved: "bg-blue-50 text-blue-700 border border-blue-200",
    "closed - verified": "bg-green-50 text-green-700 border border-green-200",
    "closed - risk accepted": "bg-gray-50 text-gray-600 border border-gray-200",
    closed: "bg-green-50 text-green-700 border border-green-200",
  },

  // 📊 RISK RATING COLORS
  riskRating: {
    low: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    high: "bg-orange-50 text-orange-700 border border-orange-200",
    critical: "bg-red-50 text-red-700 border border-red-200",
  },

  // 📈 ACTION STATUS COLORS
  actionStatus: {
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
    Completed: "bg-green-50 text-green-700 border border-green-200",
    Verified: "bg-green-50 text-green-700 border border-green-200",
    Rejected: "bg-red-50 text-red-700 border border-red-200",
  },

  // 🔍 VERIFICATION RESULT COLORS
  verification: {
    "Pending Verification": "bg-gray-50 text-gray-600 border border-gray-200",
    Effective: "bg-green-50 text-green-700 border border-green-200",
    Ineffective: "bg-red-50 text-red-700 border border-red-200",
    "Partially Effective": "bg-amber-50 text-amber-700 border border-amber-200",
    "Not Applicable": "bg-gray-100 text-gray-500 border border-gray-300",
  },

  // 🎛️ RESPONSE TYPE COLORS
  responseType: {
    "yes/no": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    text: "bg-sky-50 text-sky-700 border border-sky-200",
    number: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    rating: "bg-amber-50 text-amber-700 border border-amber-200",
    dropdown: "bg-violet-50 text-violet-700 border border-violet-200",
  },

  // 📋 WORKFLOW STATUS COLORS
  workflowStatus: {
    planned: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-green-50 text-green-700 border border-green-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
  },
};

// 🎯 MODULE FIELD MAPPINGS
const MODULE_MAPPINGS = {
  users: {
    isActive: COLOR_SYSTEM.status,
    role: COLOR_SYSTEM.roles,
    status: COLOR_SYSTEM.status,
  },
  companies: {
    status: COLOR_SYSTEM.status,
  },
  groups: {
    status: COLOR_SYSTEM.status,
  },
  sites: {
    status: COLOR_SYSTEM.status,
  },
  checkTypes: {
    status: COLOR_SYSTEM.status,
  },
  rules: {
    status: COLOR_SYSTEM.status,
  },
  templates: {
    status: COLOR_SYSTEM.status,
  },
  questions: {
    status: COLOR_SYSTEM.status,
    responseType: COLOR_SYSTEM.responseType,
    severityDefault: COLOR_SYSTEM.severity,
  },
  programs: {
    status: COLOR_SYSTEM.status,
    programStatus: COLOR_SYSTEM.programStatus,
  },
  schedules: {
    status: COLOR_SYSTEM.status,
  },
  teams: {
    status: COLOR_SYSTEM.status,
    roleInTeam: COLOR_SYSTEM.roles,
  },
  auditSessions: {
    status: COLOR_SYSTEM.status,
    workflowStatus: COLOR_SYSTEM.workflowStatus,
  },
  observations: {
    status: COLOR_SYSTEM.status,
    severity: COLOR_SYSTEM.severity,
    resolutionStatus: COLOR_SYSTEM.resolution,
  },
  problems: {
    status: COLOR_SYSTEM.status,
    impact: COLOR_SYSTEM.riskRating,
    likelihood: COLOR_SYSTEM.riskRating,
    riskRating: COLOR_SYSTEM.riskRating,
    problemStatus: COLOR_SYSTEM.resolution,
  },
  fixActions: {
    status: COLOR_SYSTEM.status,
    actionStatus: COLOR_SYSTEM.actionStatus,
    verificationResult: COLOR_SYSTEM.verification,
  },
};

// 🏷️ RELATION BADGE COLORS - Minimal
const RELATION_COLORS = {
  users: {
    createdBy: "bg-purple-50 text-purple-700 border border-purple-200",
    updatedBy: "bg-blue-50 text-blue-700 border border-blue-200",
    user: "bg-green-50 text-green-700 border border-green-200",
    assignedBy: "bg-violet-50 text-violet-700 border border-violet-200",
    assignedAuditors: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  groups: {
    group: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  companies: {
    company: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  sites: {
    site: "bg-orange-50 text-orange-700 border border-orange-200",
    sites: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  templates: {
    template: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  checkTypes: {
    checkType: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
  programs: {
    program: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  },
  schedules: {
    schedule: "bg-sky-50 text-sky-700 border border-sky-200",
  },
  auditSessions: {
    auditSession: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  questions: {
    question: "bg-teal-50 text-teal-700 border border-teal-200",
  },
  observations: {
    observation: "bg-pink-50 text-pink-700 border border-pink-200",
  },
  problems: {
    problem: "bg-red-50 text-red-700 border border-red-200",
  },
  fixActions: {
    fixActions: "bg-lime-50 text-lime-700 border border-lime-200",
  },
  approvals: {
    approver: "bg-blue-50 text-blue-700 border border-blue-200",
    requestedBy: "bg-green-50 text-green-700 border border-green-200",
  },
};

// Update the DEFAULT_COLOR to be theme-aware
const DEFAULT_COLOR = "bg-muted text-muted-foreground border border-border";
const HOVER_EFFECTS = "transition-colors duration-200 hover:shadow-sm";

// 🎯 HELPER FUNCTIONS
const getColorClass = (value, fieldKey, module) => {
  const fieldMap = MODULE_MAPPINGS[module]?.[fieldKey];
  const colorClass = fieldMap?.[value] || DEFAULT_COLOR;
  return `${colorClass} ${HOVER_EFFECTS}`;
};

const getRelationBadgeColor = (fieldKey, relationModule) => {
  const colorClass =
    RELATION_COLORS[relationModule]?.[fieldKey] || DEFAULT_COLOR;
  return `${colorClass} ${HOVER_EFFECTS}`;
};

const getRelationDisplayValue = (item, relationModule, fieldKey) => {
  // console.log("🔍 getRelationDisplayValue:", {
  //   relationModule,
  //   fieldKey,
  //   item,
  // });
  // ✅ Handle cases where item is an object but we need a string
  if (typeof item === "object" && item !== null) {
    // If it's a user object
    if (item.name || item.email) {
      return item.name || item.email;
    }
    // If it's a report/entity object
    if (item.title) {
      return item.title;
    }
    // Fallback to ID
    return `ID: ${item._id}`;
  }

  // ✅ FIXACTION - ALL POSSIBLE CASES
  if (
    relationModule === "fixActions" ||
    relationModule === "fixAction" ||
    relationModule === "fix-Action" ||
    fieldKey === "fixAction"
  ) {
    // console.log("✅ FixAction logic executing for:", relationModule);
    if (item.actionText && item.problem?.title) {
      return `${item.problem.title} - ${item.actionText}`;
    }
    return item.actionText || `Fix#${item._id}`;
  }

  // ✅ PROBLEMS CASE যোগ করুন
  if (relationModule === "problems" || fieldKey === "problem") {
    // console.log("✅ Problems logic executing");
    return item.title || `Problem#${item._id}`;
  }

  switch (relationModule) {
    case "users":
      if (
        fieldKey === "createdBy" ||
        fieldKey === "updatedBy" ||
        fieldKey === "assignedAuditors"
      ) {
        return `${item.name} (${item.email})`;
      }
      return item.name || item.email;

    case "companies":
      return item.name;

    case "groups":
      return item.name;

    case "sites":
      return item.name;

    case "observations":
      return `Obs#${item._id} - ${item.severity || "No Severity"}`;

    case "approvals":
      return item.title || `Approval#${item._id}`;

    default:
      // console.log("❌ DEFAULT case for:", relationModule);
      return item.name || item.title || "Unknown";
  }
};

const formatText = (text, maxLength = 50) => {
  if (!text) return null;
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// 🎨 MAIN COLUMN GENERATOR
export const generateUniversalColumns = (module) => {
  const config = universalConfig[module];

  if (!config) {
    console.error(`No configuration found for module: ${module}`);
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
          // console.log("value:", value);

          // universal fix: handle any object value safely
          if (typeof value === "object" && value !== null) {
            // For relation fields that return objects
            if (fieldConfig.relation && value) {
              const items = Array.isArray(value) ? value : [value];

              if (items.length > 0 && items[0] !== null) {
                return (
                  <div className="flex flex-wrap gap-1">
                    {items.map((item, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRelationBadgeColor(
                          fieldKey,
                          fieldConfig.relation
                        )}`}
                      >
                        {getRelationDisplayValue(
                          item,
                          fieldConfig.relation,
                          fieldKey
                        )}
                      </span>
                    ))}
                  </div>
                );
              }
              return (
                <span className="text-gray-400 text-sm">Not assigned</span>
              );
            }
            // ✅ CRITICAL FIX: Handle objects in NON-relation fields
            // This catches fields that should be relations but aren't marked as such
            const displayValue =
              value.title || value.name || value.email || `ID: ${value._id}`;
            return (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {displayValue}
              </span>
            );
          }

          // Handle relation fields
          if (fieldConfig.relation && value) {
            const items = Array.isArray(value) ? value : [value];

            if (items.length > 0 && items[0] !== null) {
              return (
                <div className="flex flex-wrap gap-1">
                  {items.map((item, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRelationBadgeColor(
                        fieldKey,
                        fieldConfig.relation
                      )}`}
                    >
                      {getRelationDisplayValue(
                        item,
                        fieldConfig.relation,
                        fieldKey
                      )}
                    </span>
                  ))}
                </div>
              );
            }
            return <span className="text-gray-400 text-sm">Not assigned</span>;
          }

          // Handle different field types
          switch (fieldConfig.type) {
            case "select":
              let displayValue = value;
              if (fieldKey === "isActive") {
                displayValue =
                  value === true || value === "active" ? "active" : "inactive";
              }

              return (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getColorClass(
                    displayValue,
                    fieldKey,
                    module
                  )}`}
                >
                  {displayValue
                    ? displayValue
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    : "Not set"}
                </span>
              );

            case "textarea":
              return value ? (
                <div className="max-w-xs" title={value}>
                  <div className="text-sm text-gray-700">
                    {formatText(value)}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No description</span>
              );

            case "date":
              return value ? (
                <div className="text-sm text-gray-700">{formatDate(value)}</div>
              ) : (
                <span className="text-gray-400 text-sm">Not scheduled</span>
              );

            case "email":
              return value ? (
                <a
                  href={`mailto:${value}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No email</span>
              );

            default:
              return value ? (
                <div className="text-sm text-gray-900">{value}</div>
              ) : (
                <span className="text-gray-400 text-sm">-</span>
              );
          }
        },
      };

      columns.push(column);
    }
  });

  console.log(`Generated ${columns.length} columns for ${module}`);
  return columns;
};
