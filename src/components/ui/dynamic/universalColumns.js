// components/dynamic/universalColumns.js - Improved color scheme
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRelationBadgeColor(
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
            return <span className="text-gray-400 text-sm">N/A</span>;
          }

          // Handle different field types
          switch (fieldConfig.type) {
            case "select":
            const getColorClass = (value, fieldKey, module) => {
  // Centralized color palettes
  const baseColors = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    inactive: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  const roleColors = {
    admin: "bg-violet-50 text-violet-700 border border-violet-200",
    auditor: "bg-blue-50 text-blue-700 border border-blue-200",
    compliance_officer: "bg-amber-50 text-amber-700 border border-amber-200",
    audit_manager: "bg-teal-50 text-teal-700 border border-teal-200",
    sysadmin: "bg-red-50 text-red-700 border border-red-200",
    user: "bg-green-50 text-green-700 border border-green-200",
    lead: "bg-amber-50 text-amber-700 border border-amber-200",
    member: "bg-sky-50 text-sky-700 border border-sky-200",
    observer: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    specialist: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  const responseColors = {
    "yes/no": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    text: "bg-sky-50 text-sky-700 border border-sky-200",
    number: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    rating: "bg-amber-50 text-amber-700 border border-amber-200",
    dropdown: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  const programStatusColors = {
    planning: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
    completed: baseColors.active,
    "on-hold": "bg-slate-50 text-slate-700 border border-slate-200",
    cancelled: baseColors.inactive,
  };

  const workflowStatusColors = {
    planned: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border border-amber-200",
    completed: baseColors.active,
    cancelled: baseColors.inactive,
  };

  const severityColors = {
    informational: "bg-slate-50 text-slate-700 border border-slate-200",
    low: "bg-sky-50 text-sky-700 border border-sky-200",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    high: "bg-orange-50 text-orange-700 border border-orange-200",
    critical: "bg-red-50 text-red-700 border border-red-200",
  };

  const resolutionStatusColors = {
    open: baseColors.inactive,
    "in progress": "bg-amber-50 text-amber-700 border border-amber-200",
    resolved: "bg-blue-50 text-blue-700 border border-blue-200",
    "closed - verified": baseColors.active,
    "closed - risk accepted": "bg-slate-50 text-slate-700 border border-slate-200",
    closed: baseColors.active,
  };

  const riskRatingColors = {
    low: "bg-sky-50 text-sky-700 border border-sky-200",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    high: "bg-orange-50 text-orange-700 border border-orange-200",
    critical: "bg-red-50 text-red-700 border border-red-200",
  };

  const likelihoodColors = {
    rare: "bg-sky-50 text-sky-700 border border-sky-200",
    unlikely: "bg-blue-50 text-blue-700 border border-blue-200",
    possible: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    likely: "bg-orange-50 text-orange-700 border border-orange-200",
    "almost certain": "bg-red-50 text-red-700 border border-red-200",
  };
   const actionStatusColors = {
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
    Completed: "bg-green-50 text-green-700 border border-green-200",
    Verified: baseColors.active, // "bg-emerald-50 text-emerald-700..."
    Rejected: baseColors.inactive, // "bg-rose-50 text-rose-700..."
  };

  const verificationResultColors = {
    "Pending Verification": "bg-slate-50 text-slate-700 border border-slate-200",
    Effective: baseColors.active,
    Ineffective: baseColors.inactive,
    "Partially Effective": "bg-amber-50 text-amber-700 border border-amber-200",
    "Not Applicable": "bg-slate-50 text-slate-700 border border-slate-200",
  };

  // Module-specific mappings
  const moduleMappings = {
    users: { 
      isActive: baseColors, 
      role: roleColors,
      status: baseColors 
    },
    companies: { 
      status: baseColors 
    },
    groups: { 
      status: baseColors 
    },
    sites: { 
      status: baseColors 
    },
    checkTypes: { 
      status: baseColors 
    },
    rules: { 
      status: baseColors 
    },
    templates: { 
      status: baseColors 
    },
    questions: {
      status: baseColors,
      responseType: responseColors,
      severityDefault: severityColors
    },
    programs: {
      status: baseColors,
      programStatus: programStatusColors
    },
    schedules: { 
      status: baseColors 
    },
    teams: { 
      status: baseColors, 
      roleInTeam: roleColors 
    },
    auditSessions: {
      status: baseColors,
      workflowStatus: workflowStatusColors
    },
    observations: {
      status: baseColors,
      severity: severityColors,
      resolutionStatus: resolutionStatusColors
    },
    problems: {
      status: baseColors,
      impact: riskRatingColors,
      likelihood: likelihoodColors,
      riskRating: riskRatingColors,
      problemStatus: resolutionStatusColors
    },
    fixActions: {
      status: baseColors,
      actionStatus: actionStatusColors,
      verificationResult: verificationResultColors,
    },
  };

  const fieldMap = moduleMappings[module]?.[fieldKey];
  return (
    fieldMap?.[value] ||
    "bg-slate-50 text-slate-700 border border-slate-200"
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getColorClass(
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
                <div className="max-w-xs" title={value}>
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">N/A</span>
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
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">N/A</span>
              );

            default:
              return value ? (
                <div className="text-sm text-gray-900">{value}</div>
              ) : (
                <span className="text-gray-400 text-sm">N/A</span>
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

// ✅ IMPROVED: Relation Badge Colors with better visual hierarchy
const getRelationBadgeColor = (fieldKey, relationModule) => {
  const colorMap = {
    users: {
      createdBy: "bg-violet-50 text-violet-700 border border-violet-200",
      updatedBy: "bg-blue-50 text-blue-700 border border-blue-200",
      user: "bg-green-50 text-green-700 border border-green-200",
      assignedBy: "bg-violet-50 text-violet-700 border border-violet-200",
    },
    groups: {
      group: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    companies: {
      company: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    sites: {
      site: "bg-orange-50 text-orange-700 border border-orange-200",
    },
    templates: {
      template: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    },
    checkTypes: {
      checkType: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    },
    programs: {
      program: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    },
    schedules: {
      schedule: "bg-blue-50 text-blue-700 border border-blue-200",
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
    // FixActions module (future)
    fixActions: {
      fixActions: "bg-lime-50 text-lime-700 border border-lime-200",
    }
  };

  return (
    colorMap[relationModule]?.[fieldKey] ||
    "bg-slate-50 text-slate-700 border border-slate-200"
  );
};
