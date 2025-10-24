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
      // ✅ NEW: createdBy field
      createdBy: {
        type: "relation",
        label: "Created By",
        relation: "users", // ✅ User module থেকে data
        tableColumn: true,
        filterable: false,
        formField: false, // ✅ Form এ show করবে না
        readOnly: true, // ✅ Edit করা যাবে না
      },

      // ✅ NEW: updatedBy field
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users", // ✅ User module থেকে data
        tableColumn: true,
        filterable: false,
        formField: false, // ✅ Form এ show করবে না
        readOnly: true, // ✅ Edit করা যাবে না
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

  sites: {
    // API Configuration
    endpoint: "sites", // ব্যাকএন্ড রাউটের সাথে মিলবে

    // UI Configuration
    title: "Site Management",
    description: "Manage company sites and locations",

    // FIELD DEFINITIONS - Site.js মডেল অনুযায়ী
    fields: {
      name: {
        type: "text",
        label: "Site Name",
        placeholder: "Enter site name (e.g., Head Office)",
        required: true,
        tableColumn: true,
        filterable: true, // সার্চের জন্য
      },
      location: {
        type: "textarea", // লোকেশন লম্বা হতে পারে
        label: "Location / Address",
        placeholder: "Enter full address or location details",
        required: true, // মডেল অনুযায়ী required নয়
        tableColumn: true,
        filterable: true, // সার্চের জন্য
        fullWidth: true, // ফর্মে পুরো জায়গা নিতে পারে
      },
      company: {
        type: "select",
        label: "Company",
        required: true, // মডেল অনুযায়ী required
        relation: "companies", // ✅ Companies মডিউল থেকে ডেটা আসবে
        tableColumn: true,
        filterable: true, // ফিল্টারিং এর জন্য
        // dataAccessor: "company.name", // ✅ টেবিলে কোম্পানির নাম দেখানোর জন্য
      },
      status: {
        type: "select",
        label: "Status",
        required: true, // commonFields থেকে আসছে, required ধরাই ভালো
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true, // ফিল্টারিং এর জন্য
        // editOnly: true, // প্রয়োজন অনুযায়ী যোগ করুন
      },
      // commonFields থেকে আসা বাকি ফিল্ডগুলো
      createdBy: {
        type: "relation", // অথবা 'text', টাইপ এখানে মুখ্য নয়
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "createdBy.name", // ✅ টেবিলে ইউজারের নাম দেখানোর জন্য
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "updatedBy.name", // ✅ টেবিলে ইউজারের নাম দেখানোর জন্য
      },
      createdAt: {
        type: "date",
        label: "Created At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Updated At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      search: {
        type: "search",
        label: "Search Sites",
        placeholder: "Search by name or location...",
        apiParam: "search", // ব্যাকএন্ড Controller-এর req.query.search
      },
      company: {
        type: "select",
        label: "Company",
        placeholder: "All Companies",
        apiParam: "company", // ব্যাকএন্ড Controller-এর req.query.company
        relation: "companies", // ✅ Companies মডিউল থেকে অপশন লোড হবে
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status", // ব্যাকএন্ড Controller-এর req.query.status
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS (আপনার প্রয়োজন অনুযায়ী অ্যাডজাস্ট করুন)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"], // কারা তৈরি করতে পারবে
      edit: ["admin", "sysadmin", "audit_manager"], // কারা এডিট করতে পারবে
      delete: ["admin", "sysadmin"], // কারা ডিলিট করতে পারবে
      view: ["admin", "sysadmin", "audit_manager", "auditor"], // কারা দেখতে পারবে
    },
  },

  checkTypes: {
    // API Configuration
    endpoint: "checkTypes", // Ensure this matches your backend route name

    // UI Configuration
    title: "Check Type Management",
    description: "Manage categories or classifications for audit checks",

    // FIELD DEFINITIONS - Based on CheckType.js model
    fields: {
      name: {
        type: "text",
        label: "Check Type Name",
        placeholder: "Enter name (e.g., Access Control)",
        required: true,
        tableColumn: true,
        filterable: true, // For search
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter a detailed description",
        required: true, // Required in your schema
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true,
      },
      status: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true, // For filtering
      },
      // Common fields
      createdBy: {
        type: "relation",
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "createdBy.name", // To show user name
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "updatedBy.name", // To show user name
      },
      createdAt: {
        type: "date",
        label: "Created At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Updated At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      search: {
        type: "search",
        label: "Search Check Types",
        placeholder: "Search by name or description...",
        apiParam: "search", // Matches req.query.search in backend
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status", // Matches req.query.status
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS (Adjust according to your needs)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"], // Everyone can view?
    },
  },

  rules: {
    // API Configuration
    endpoint: "rules", // Ensure this matches your backend route name

    // UI Configuration
    title: "Rule Management",
    description: "Manage audit rules and guidelines",

    // FIELD DEFINITIONS - Based on Rule.js model
    fields: {
      name: {
        type: "text",
        label: "Rule Name / Title",
        placeholder: "Enter a concise rule name",
        required: true,
        tableColumn: true,
        filterable: true, // For search
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter detailed description or guideline",
        required: false, // Optional in your schema
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true,
      },
      // --- Missing CheckType Relation ---
      // If you add checkType to the model:
      // checkType: {
      //   type: "select",
      //   label: "Check Type",
      //   required: true, // Or false, depending on logic
      //   relation: "checkTypes", // Link to checkTypes module
      //   tableColumn: true,
      //   filterable: true,
        // dataAccessor: "checkType.name",
      // },
      // --- End Missing CheckType ---
      status: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true, // For filtering
      },
      // Common fields
      createdBy: {
        type: "date",
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        // dataAccessor: "updatedBy.name",
      },
      createdAt: {
        type: "date",
        label: "Created At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Updated At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      search: {
        type: "search",
        label: "Search Rules",
        placeholder: "Search by name or description...",
        apiParam: "search", // Matches req.query.search
      },
      // --- Missing CheckType Filter ---
      // If you add checkType relation:
      // checkType: {
      //   type: "select",
      //   label: "Check Type",
      //   placeholder: "All Check Types",
      //   apiParam: "checkType",
      //   relation: "checkTypes",
      // },
      // --- End Missing CheckType Filter ---
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status", // Matches req.query.status
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS (Adjust as needed)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },
};
