export const universalConfig = {
  // USERS MODULE - Complete example
  users: {
    // API Configuration
    endpoint: "users",

    // UI Configuration
    title: "User Management",
    description: "Manage and monitor all user accounts",

    // FIELD DEFINITIONS - This is where the magic happens
    fields: {
      name: {
        type: "text",
        label: "Full Name",
        placeholder: "Enter user's full name",
        required: true,
        tableColumn: true, // Show in table
        filterable: true, // Allow filtering on this field
      },
      email: {
        type: "email",
        label: "Email Address",
        placeholder: "user@company.com",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      password: {
        type: "password",
        label: "Password",
        required: true,
        tableColumn: false,
        filterable: false,
        createOnly: true,
      },
      role: {
        type: "select",
        label: "Role",
        required: true,
        options: [
          "admin",
          "auditor",
          "compliance_officer",
          "audit_manager",
          "sysadmin",
        ],
        tableColumn: true,
        filterable: true,
      },
      isActive: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active", // Default value
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      // last login will show in table but not on form
      lastLogin: {
        type: "date",
        label: "Last Login",

        tableColumn: true,
        readOnly: true, // Can't edit this field
        filterable: false,
        formField: false,
      },
    },

    // FILTER CONFIGURATION - Maps UI filters to API parameters
    filters: {
      search: {
        label: "Search Users by Name or Email",
        type: "search",
        fields: ["name", "email"], // Search in these database fields
        placeholder: "Search users...",
        apiParam: "search", // Maps to ?search= in URL
      },
      role: {
        type: "select",
        options: [
          "admin",
          "auditor",
          "compliance_officer",
          "audit_manager",
          "sysadmin",
        ],
        placeholder: "All Roles",
        apiParam: "role", // Maps to ?role= in URL
      },
      status: {
        type: "select",
        options: ["active", "inactive"],
        placeholder: "All Statuses",
        apiParam: "status", // Maps to ?status= in URL
        // Note: Backend converts "active"→isActive:true, "inactive"→isActive:false
      },
    },

    // PERMISSIONS
    permissions: {
      create: ["admin", "sysadmin"],
      edit: ["admin", "sysadmin"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager"],
    },
  },
  groups: {
    // API Configuration
    endpoint: "groups",

    // UI Configuration
    title: "Group Management",
    description: "Manage and organize user groups",

    // FIELD DEFINITIONS - Database fields অনুযায়ী
    fields: {
      name: {
        type: "text",
        label: "Group Name",
        placeholder: "Enter group name",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter group description",
        required: true, // আপনার controller এ required
        tableColumn: true,
        filterable: false,
      },
      status: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      createdAt: {
        type: "date",
        label: "Created At",
        tableColumn: true,
        readOnly: true,
        filterable: false,
        formField: false,
      },
      updatedAt: {
        type: "date",
        label: "Updated At",
        tableColumn: true,
        readOnly: true,
        filterable: false,
        formField: false,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      search: {
        label: "Search Groups",
        type: "search",
        fields: ["name", "description"],
        placeholder: "Search groups...",
        apiParam: "search",
      },
      status: {
        type: "select",
        options: ["active", "inactive"],
        placeholder: "All Statuses",
        apiParam: "status",
      },
    },

    // PERMISSIONS
    permissions: {
      create: ["admin", "sysadmin"],
      edit: ["admin", "sysadmin"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager"],
    },
  },

 companies: {
    // API Configuration
    endpoint: "companies",

    // UI Configuration
    title: "Company Management",
    description: "Manage and organize companies",

    // FIELD DEFINITIONS - Database fields অনুযায়ী
    fields: {
      name: {
        type: "text",
        label: "Company Name",
        placeholder: "Enter company name",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      group: {
        type: "select",
        label: "Group",
        required: true,
        relation: "groups", // ✅ Groups থেকে data load হবে
        tableColumn: true,
        filterable: true,
      },
      sector: {
        type: "text",
        label: "Sector",
        placeholder: "Enter company sector",
        required: false,
        tableColumn: true,
        filterable: true,
      },
      address: {
        type: "textarea",
        label: "Address",
        placeholder: "Enter company address",
        required: false,
        tableColumn: true,
        filterable: false,
      },
      status: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      createdAt: {
        type: "date",
        label: "Created At",
        tableColumn: true,
        readOnly: true,
        filterable: false,
        formField: false,
      },
      updatedAt: {
        type: "date",
        label: "Updated At",
        tableColumn: true,
        readOnly: true,
        filterable: false,
        formField: false,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      search: {
        label: "Search Companies",
        type: "search",
        fields: ["name", "sector", "address"],
        placeholder: "Search companies...",
        apiParam: "search",
      },
      group: {
        type: "select",
        relation: "groups", // ✅ Groups থেকে filter options load হবে
        placeholder: "All Groups",
        apiParam: "group",
      },
      status: {
        type: "select",
        options: ["active", "inactive"],
        placeholder: "All Statuses",
        apiParam: "status",
      },
    },

    // PERMISSIONS
    permissions: {
      create: ["admin", "sysadmin"],
      edit: ["admin", "sysadmin"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager"],
    },
  },
};
