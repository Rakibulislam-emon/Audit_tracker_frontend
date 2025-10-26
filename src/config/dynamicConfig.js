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

  templates: {
    // API Configuration
    endpoint: "templates", // Matches backend route

    // UI Configuration
    title: "Template Management",
    description: "Manage audit templates",

    // FIELD DEFINITIONS - Based on Template.js model
    fields: {
      title: {
        type: "text",
        label: "Template Title",
        placeholder: "Enter a descriptive title",
        required: true,
        tableColumn: true,
        filterable: true, // For search
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter details about the template",
        required: false,
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true,
      },
      version: {
        type: "text", // Could be number if needed
        label: "Version",
        placeholder: "e.g., 1.0",
        required: false, // Has default in schema
        tableColumn: true,
        filterable: false, // Usually not filtered
        // You might want to add validation (e.g., pattern for X.Y format)
      },
      company: {
        type: "select",
        label: "Company",
        required: true,
        relation: "companies", // Link to companies module
        tableColumn: true,
        filterable: true, // For filtering
        dataAccessor: "company.name", // Show company name in table
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
        label: "Search Templates",
        placeholder: "Search by title or description...",
        apiParam: "search", // Matches req.query.search
      },
      company: {
        type: "select",
        label: "Company",
        placeholder: "All Companies",
        apiParam: "company", // Matches req.query.company
        relation: "companies", // Load options from companies
      },
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

  questions: {
    // API Configuration
    endpoint: "questions", // Matches backend route

    // UI Configuration
    title: "Question Management",
    description: "Manage audit questions within templates",

    // FIELD DEFINITIONS - Based on Question.js model
    fields: {
      section: {
        type: "text",
        label: "Section",
        placeholder: "Enter section name (optional)",
        required: true,
        tableColumn: true,
        filterable: true, // Allow filtering/searching if needed later
      },
      questionText: {
        type: "textarea", // Questions can be long
        label: "Question Text",
        placeholder: "Enter the audit question",
        required: true,
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true, // Use full width in form
      },
      responseType: {
        type: "select",
        label: "Response Type",
        required: true,
        options: ["yes/no", "text", "number", "rating", "dropdown"], // From schema enum
        tableColumn: true,
        filterable: true, // Allow filtering by type
      },
      severityDefault: {
        type: "select", // Or select if you have predefined severities
        label: "Default Severity",
        placeholder: "e.g., High, Medium, Low (optional)",
        options: ["high", "medium", "low"],
        required: true,
        tableColumn: true,
        filterable: true,
      },
      weight: {
        type: "number",
        label: "Weight",
        placeholder: "Enter weight (0.1-10)",
        required: true, // Has default in schema
        tableColumn: true,
        filterable: false,
        // Add min/max validation if needed in frontend form
      },
      template: {
        type: "select",
        label: "Template",
        required: true,
        relation: "templates", // Link to templates module
        tableColumn: true,
        filterable: true, // Allow filtering by template
        dataAccessor: "template.title", // Show template title in table
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
        label: "Search Questions",
        placeholder: "Search by text or section...",
        apiParam: "search", // Matches req.query.search
      },
      template: {
        type: "select",
        label: "Template",
        placeholder: "All Templates",
        apiParam: "template", // Matches req.query.template
        relation: "templates", // Load options from templates
      },
      responseType: {
        // Added filter for response type
        type: "select",
        label: "Response Type",
        placeholder: "All Types",
        apiParam: "responseType", // Matches req.query.responseType
        options: ["yes/no", "text", "number", "rating", "dropdown"],
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status", // Matches req.query.status
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS (Match these with your backend roles in authorizeRoles)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },

  programs: {
    // API Configuration
    endpoint: "programs", // Matches backend route

    // UI Configuration
    title: "Program Management",
    description: "Manage audit programs and initiatives",

    // FIELD DEFINITIONS - Based on Program.js model (with company relation)
    fields: {
      name: {
        type: "text",
        label: "Program Name",
        placeholder: "Enter program name",
        required: true,
        tableColumn: true,
        filterable: true, // For search
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter program details",
        required: true,
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true,
      },
      company: {
        // Assuming company relation is added
        type: "select",
        label: "Company",
        required: true,
        relation: "companies",
        tableColumn: true,
        filterable: true, // For filtering
        dataAccessor: "company.name", // Show company name
      },
      startDate: {
        type: "date",
        label: "Start Date",
        required: true,
        tableColumn: true,
        filterable: false,
      },
      endDate: {
        type: "date",
        label: "End Date",
        required: true,
        tableColumn: true,
        filterable: false,
      },
      programStatus: {
        // Operational Status
        type: "select",
        label: "Program Status",
        required: true, // Has default, but good to set in form
        options: [
          "planning",
          "in-progress",
          "completed",
          "on-hold",
          "cancelled",
        ],
        default: "planning",
        tableColumn: true,
        filterable: true, // For filtering
      },
      // ✅ commonFields.status field configuration
      status: {
        // System Status (Active/Inactive)
        type: "select",
        label: "System Status",
        required: true, // From commonFields default
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true, // Show in table
        filterable: true, // Allow filtering
        editOnly: true, // Usually only editable
      },
      // Common fields
      createdBy: {
        type: "relation",
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
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
        label: "Search Programs",
        placeholder: "Search by name or description...",
        apiParam: "search",
      },
      company: {
        // Assuming company relation
        type: "select",
        label: "Company",
        placeholder: "All Companies",
        apiParam: "company",
        relation: "companies",
      },
      programStatus: {
        // Filter by operational status
        type: "select",
        label: "Program Status",
        placeholder: "All Program Statuses",
        apiParam: "programStatus", // Matches req.query.programStatus
        options: [
          "planning",
          "in-progress",
          "completed",
          "on-hold",
          "cancelled",
        ],
      },
      // ✅ Filter for commonFields.status
      status: {
        // Filter by system status
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status", // Matches req.query.status
        options: ["active", "inactive"],
      },
      // Date range filters could be added here if needed (requires custom UI)
    },

    // PERMISSIONS (Match backend roles)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },

  schedules: {
    // API Configuration
    endpoint: "schedules", // Matches backend route

    // UI Configuration
    title: "Schedule Management",
    description: "Manage audit schedules",

    // FIELD DEFINITIONS - Based on Schedule.js model
    fields: {
      title: {
        type: "text",
        label: "Schedule Title",
        placeholder: "Enter a title for the schedule",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      company: {
        type: "select",
        label: "Company",
        required: true,
        relation: "companies",
        tableColumn: true,
        filterable: true,
        dataAccessor: "company.name",
      },
      program: {
        // Optional program link
        type: "select",
        label: "Program (Optional)",
        required: false,
        relation: "programs",
        tableColumn: true,
        filterable: true,
        dataAccessor: "program.name", // Show program name
        placeholder: "Select Program",
      },
      startDate: {
        type: "date",
        label: "Start Date",
        required: true,
        tableColumn: true,
        filterable: false, // Usually filter by range
      },
      endDate: {
        type: "date",
        label: "End Date",
        required: true,
        tableColumn: true,
        filterable: false,
        // Add frontend validation if desired (endDate > startDate)
      },
      status: {
        // commonFields.status
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      // Common fields
      createdBy: {
        type: "relation",
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
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
        label: "Search Schedules",
        placeholder: "Search by title...",
        apiParam: "search",
      },
      company: {
        type: "select",
        label: "Company",
        placeholder: "All Companies",
        apiParam: "company",
        relation: "companies",
      },
      program: {
        type: "select",
        label: "Program",
        placeholder: "All Programs",
        apiParam: "program",
        relation: "programs", // Filter by program
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      // Date range filters require custom UI components
      // startDate: { type: 'dateRangeStart', apiParam: 'startDate', label: 'Start Date After' },
      // endDate: { type: 'dateRangeEnd', apiParam: 'endDate', label: 'End Date Before' },
    },

    // PERMISSIONS (Match backend roles)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },

  teams: {
    // API Configuration
    endpoint: "teams", // Matches backend route

    // UI Configuration
    title: "Team Assignments", // More descriptive title
    description: "Manage user assignments and roles within audit sessions",

    // FIELD DEFINITIONS - Based on Team.js model
    fields: {
      auditSession: {
        type: "select",
        label: "Audit Session",
        required: true,
        relation: "auditSessions", // Link to auditSessions module (NEEDS TO BE CREATED LATER)
        tableColumn: true,
        filterable: true, // Allow filtering by session
        dataAccessor: "auditSession.title", // Show session title in table
        placeholder: "Select Audit Session", // Placeholder for form dropdown
      },
      user: {
        type: "select",
        label: "User",
        required: true,
        relation: "users", // Link to users module
        tableColumn: true,
        filterable: true, // Allow filtering by user
        dataAccessor: "user.name", // Show user name in table
        placeholder: "Select User", // Placeholder for form dropdown
      },
      roleInTeam: {
        type: "select", // Changed to select assuming enum in schema
        label: "Role in Team",
        placeholder: "Select Role", // Placeholder for form dropdown
        required: true,
        tableColumn: true,
        filterable: true, // Allow filtering by role
        options: ["lead", "member", "observer", "specialist"], // Use the same enum values as schema
      },
      status: {
        // commonFields.status
        type: "select",
        label: "Assignment Status", // More specific label
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true, // Typically changed after creation
      },
      // Common fields (read-only in table)
      createdBy: {
        type: "relation",
        label: "Assigned By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false, // Not editable
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Last Updated By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
      },
      createdAt: {
        type: "date",
        label: "Assigned At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Last Updated At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },

    // FILTER CONFIGURATION
    filters: {
      auditSession: {
        type: "select",
        label: "Audit Session",
        placeholder: "All Sessions",
        apiParam: "auditSession", // Matches req.query.auditSession
        relation: "auditSessions", // Needs auditSessions module
      },
      user: {
        // Allow filtering assignments for a specific user
        type: "select",
        label: "User",
        placeholder: "All Users",
        apiParam: "user", // Matches req.query.user
        relation: "users",
      },
      roleInTeam: {
        // Allow filtering by role using select
        type: "select",
        label: "Role in Team",
        placeholder: "All Roles",
        apiParam: "roleInTeam", // Matches req.query.roleInTeam
        options: ["lead", "member", "observer", "specialist"], // Use enum values
      },
      status: {
        // Filter by assignment status
        type: "select",
        label: "Assignment Status",
        placeholder: "All Statuses",
        apiParam: "status", // Matches req.query.status
        options: ["active", "inactive"],
      },
      // Removed 'search' filter as specific filters are generally more useful here
    },

    // PERMISSIONS (Match roles in authorizeRoles middleware)
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin", "audit_manager"], // Allow manager to delete assignments too?
      view: ["admin", "sysadmin", "audit_manager", "auditor"], // Allow auditors to see team assignments
    },
  },

  auditSessions: {
    endpoint: "auditSessions",
    title: "Audit Session Management",
    description: "Manage ongoing and completed audit sessions",
    fields: {
      title: {
        // Optional title
        type: "text",
        label: "Session Title (Optional)",
        placeholder: "Enter optional title",
        required: false,
        tableColumn: true,
        filterable: true,
      },
      schedule: {
        type: "select",
        label: "Schedule",
        required: true,
        relation: "schedules",
        tableColumn: true,
        filterable: true,
        dataAccessor: "schedule.title",
        placeholder: "Select Schedule",
      },
      template: {
        type: "select",
        label: "Template",
        required: true,
        relation: "templates",
        tableColumn: true,
        filterable: true,
        dataAccessor: "template.title",
        placeholder: "Select Template",
      },
      site: {
        type: "select",
        label: "Site",
        required: true,
        relation: "sites",
        tableColumn: true,
        filterable: true,
        dataAccessor: "site.name",
        placeholder: "Select Site",
      },
      checkType: {
        // Optional Check Type focus
        type: "select",
        label: "Check Type (Optional)",
        required: false,
        relation: "checkTypes",
        tableColumn: true,
        filterable: true,
        dataAccessor: "checkType.name",
        placeholder: "Select Check Type",
      },
      workflowStatus: {
        // Operational status
        type: "select",
        label: "Workflow Status",
        required: true,
        options: ["planned", "in-progress", "completed", "cancelled"],
        default: "planned",
        tableColumn: true,
        filterable: true,
      },
      startDate: {
        // Actual start date
        type: "date",
        label: "Actual Start Date",
        required: false, // Not required on create maybe
        tableColumn: true,
        filterable: false,
        formField: true, // Show on form
      },
      endDate: {
        // Actual end date
        type: "date",
        label: "Actual End Date",
        required: false,
        tableColumn: true,
        filterable: false,
        formField: true, // Show on form
      },
      status: {
        // System status
        type: "select",
        label: "System Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      createdBy: {
        type: "relation",
        label: "Assigned By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false, // Not editable
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Last Updated By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
      },
      createdAt: {
        type: "date",
        label: "Assigned At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Last Updated At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },
    filters: {
      search: {
        type: "search",
        label: "Search Title",
        placeholder: "Search by title...",
        apiParam: "search",
      },
      schedule: {
        type: "select",
        label: "Schedule",
        placeholder: "All Schedules",
        apiParam: "schedule",
        relation: "schedules",
      },
      template: {
        type: "select",
        label: "Template",
        placeholder: "All Templates",
        apiParam: "template",
        relation: "templates",
      },
      site: {
        type: "select",
        label: "Site",
        placeholder: "All Sites",
        apiParam: "site",
        relation: "sites",
      },
      checkType: {
        type: "select",
        label: "Check Type",
        placeholder: "All Check Types",
        apiParam: "checkType",
        relation: "checkTypes",
      },
      workflowStatus: {
        type: "select",
        label: "Workflow Status",
        placeholder: "All Workflow Statuses",
        apiParam: "workflowStatus",
        options: ["planned", "in-progress", "completed", "cancelled"],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      // Date range filters would need custom UI components
    },
    permissions: {
      // Match backend roles
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager", "auditor"], // Auditor might update status/dates
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },

  observations: {
    endpoint: "observations",
    title: "Observations Management",
    description: "Manage audit observations and findings",
    fields: {
      auditSession: {
        type: "select",
        label: "Audit Session",
        required: true,
        relation: "auditSessions",
        tableColumn: true,
        filterable: true,
        dataAccessor: "auditSession.title",
        placeholder: "Select Audit Session",
      },
      question: {
        // Optional linked question
        type: "select",
        label: "Related Question (Optional)",
        required: false,
        relation: "questions",
        tableColumn: true,
        filterable: true,
        dataAccessor: "question.questionText", // Show question text
        placeholder: "Select Related Question",
      },
      questionText: {
        // The actual observation detail/question asked
        type: "textarea",
        label: "Observation / Question Text",
        required: true,
        tableColumn: true,
        filterable: true,
        fullWidth: true,
        placeholder: "Enter observation details or the question asked",
      },
      response: {
        type: "textarea", // Allow detailed response
        label: "Response",
        required: false,
        tableColumn: true,
        filterable: true,
        fullWidth: true,
        placeholder: "Enter the response received",
      },
      severity: {
        type: "select",
        label: "Severity",
        required: false,
        options: ["Informational", "Low", "Medium", "High", "Critical"],
        tableColumn: true,
        filterable: true,
        placeholder: "Select Severity (if applicable)",
      },
      resolutionStatus: {
        type: "select",
        label: "Resolution Status",
        required: true,
        options: [
          "Open",
          "In Progress",
          "Resolved",
          "Closed - Verified",
          "Closed - Risk Accepted",
        ],
        default: "Open",
        tableColumn: true,
        filterable: true,
      },
      problem: {
        // Link to Problem module (read-only in table)
        type: "relation",
        label: "Linked Problem",
        required: false,
        relation: "problems", // Needs problems module
        tableColumn: true,
        filterable: true, // Filter by linked problem?
        dataAccessor: "problem.problemId", // Show problem ID or title
        formField: false, // Usually linked via workflow, not direct edit
      },
      status: {
        // System Status (active/inactive)
        type: "select",
        label: "System Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      createdBy: {
        type: "relation",
        label: "Assigned By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false, // Not editable
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Last Updated By", // Changed label slightly
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
      },
      createdAt: {
        type: "date",
        label: "Assigned At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
      updatedAt: {
        type: "date",
        label: "Last Updated At", // Changed label slightly
        tableColumn: true,
        formField: false,
        readOnly: true,
      },
    },
    filters: {
      search: {
        type: "search",
        label: "Search Observations",
        placeholder: "Search text/response...",
        apiParam: "search",
      },
      auditSession: {
        type: "select",
        label: "Audit Session",
        placeholder: "All Sessions",
        apiParam: "auditSession",
        relation: "auditSessions",
      },
      question: {
        type: "select",
        label: "Question",
        placeholder: "All Questions",
        apiParam: "question",
        relation: "questions",
      },
      severity: {
        type: "select",
        label: "Severity",
        placeholder: "All Severities",
        apiParam: "severity",
        options: ["Informational", "Low", "Medium", "High", "Critical"],
      },
      resolutionStatus: {
        type: "select",
        label: "Resolution Status",
        placeholder: "All Resolution Statuses",
        apiParam: "resolutionStatus",
        options: [
          "Open",
          "In Progress",
          "Resolved",
          "Closed - Verified",
          "Closed - Risk Accepted",
        ],
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All  Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      // Filter by linked Problem? Needs 'problems' module config
      // problem: { type:'relationSelect', relation:'problems', apiParam:'problem', placeholder:'Filter by Problem...'},
    },
    permissions: {
      // Match backend roles
      create: ["admin", "sysadmin", "audit_manager", "auditor"],
      edit: ["admin", "sysadmin", "audit_manager", "auditor"], // Might need finer control later
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
  },

  problems: {
    endpoint: "problems",
    title: "Problem Management",
    description: "Manage identified audit problems and findings",
    fields: {
      title: {
        type: "text",
        label: "Problem Title",
        required: true,
        tableColumn: true,
        filterable: true,
        placeholder: "Enter a concise title for the problem",
      },
      auditSession: {
        type: "select",
        label: "Audit Session",
        required: true,
        relation: "auditSessions",
        tableColumn: true,
        filterable: true,
        dataAccessor: "auditSession.title",
        placeholder: "Select Audit Session",
      },
      observation: {
        // Optional link
        type: "select",
        label: "Originating Observation (Optional)",
        required: false,
        relation: "observations",
        tableColumn: true,
        filterable: true,
        dataAccessor: "observation._id", // Show Obs ID or maybe severity?
        placeholder: "Link Observation",
        formField: true, // Allow linking on create/edit
      },
      question: {
        // Optional link
        type: "select",
        label: "Related Question (Optional)",
        required: false,
        relation: "questions",
        tableColumn: false,
        filterable: true, // Maybe hide from main table?
        dataAccessor: "question.questionText",
        placeholder: "Link Question",
        formField: true,
      },
      description: {
        type: "textarea",
        label: "Description",
        required: true,
        tableColumn: true,
        filterable: true,
        fullWidth: true,
        placeholder: "Describe the problem in detail",
      },
      impact: {
        type: "select",
        label: "Impact",
        required: true,
        options: ["Low", "Medium", "High"],
        default: "Medium",
        tableColumn: true,
        filterable: true,
      },
      likelihood: {
        type: "select",
        label: "Likelihood",
        required: true,
        options: ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"],
        default: "Possible",
        tableColumn: true,
        filterable: true,
      },
      riskRating: {
        type: "select",
        label: "Risk Rating",
        required: true,
        options: ["Low", "Medium", "High", "Critical"],
        default: "Medium",
        tableColumn: true,
        filterable: true,
      },
      problemStatus: {
        // Operational status
        type: "select",
        label: "Problem Status",
        required: true,
        options: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open",
        tableColumn: true,
        filterable: true,
      },
      methodology: {
        type: "textarea",
        label: "Methodology (Optional)",
        required: false,
        tableColumn: false,
        filterable: false, // Hide from table maybe?
        placeholder: "How was this identified?",
      },
      fixActions: {
        // TODO: Needs multi-select/tag component for Form
        type: "text", // Placeholder type for table display
        label: "Corrective Actions",
        required: false,
        relation: "fixActions", // Link to FixAction model
        tableColumn: true,
        filterable: false, // Filtering might be complex
        // Displaying multiple requires custom cell or backend format
        dataAccessor: "fixActions", // Shows array of objects/IDs for now
        formField: false, // Hide until UI component is ready
      },
      status: {
        // System Status
        type: "select",
        label: "System Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true,
      },
      // ✅ নিশ্চিত করুন common fields যোগ করা হয়েছে
      createdBy: {
        type: "relation",
        label: "Created By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "createdBy.name",
      },
      updatedBy: {
        type: "relation",
        label: "Updated By",
        relation: "users",
        tableColumn: true,
        formField: false,
        readOnly: true,
        dataAccessor: "updatedBy.name",
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
    filters: {
      search: {
        type: "search",
        label: "Search Problems",
        placeholder: "Search title/description...",
        apiParam: "search",
      },
      auditSession: {
        type: "select",
        label: "Audit Session",
        placeholder: "All Sessions",
        apiParam: "auditSession",
        relation: "auditSessions",
      },
      // observation: { type:'relationSelect', relation:'observations', apiParam:'observation', placeholder:'Filter by Observation...'},
      // question: { type:'relationSelect', relation:'questions', apiParam:'question', placeholder:'Filter by Question...'},
      impact: {
        type: "select",
        label: "Impact",
        placeholder: "All Impacts",
        apiParam: "impact",
        options: ["Low", "Medium", "High"],
      },
      likelihood: {
        type: "select",
        label: "Likelihood",
        placeholder: "All Likelihoods",
        apiParam: "likelihood",
        options: ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"],
      },
      riskRating: {
        type: "select",
        label: "Risk Rating",
        placeholder: "All Ratings",
        apiParam: "riskRating",
        options: ["Low", "Medium", "High", "Critical"],
      },
      problemStatus: {
        type: "select",
        label: "Problem Status",
        placeholder: "All Problem Statuses",
        apiParam: "problemStatus",
        options: ["Open", "In Progress", "Resolved", "Closed"],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      // Filter by Fix Action? Needs FixAction module
      // fixAction: { type:'relationSelect', relation:'fixActions', apiParam:'fixAction', placeholder:'Filter by Fix Action...'},
    },
    permissions: {
      // Match backend roles
      create: ["admin", "sysadmin", "audit_manager", "auditor"],
      edit: ["admin", "sysadmin", "audit_manager"], // Who can edit problem details?
      delete: ["admin", "sysadmin"],
      view: [
        "admin",
        "sysadmin",
        "audit_manager",
        "auditor",
        "compliance_officer",
      ],
    },
  },
};
