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
      ruleCode: {
        type: "text",
        label: "Rule Code",
        placeholder: "e.g., SAF-001",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      checkType: {
        type: "select",
        label: "Category (Check Type)",
        required: true,
        relation: "checkTypes", // Links to 'checkTypes' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "checkType.name", // Display checkType name
        placeholder: "Select a Check Type",
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

      checkType: {
        type: "select",
        label: "Check Type",
        placeholder: "All Check Types",
        apiParam: "checkType", // Matches req.query.checkType
        relation: "checkTypes", // Load options from checkTypes
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
    title: "Question Bank", // Title changed to reflect it's a collection
    description:
      "Manage all individual audit questions, linked to rules and check types",

    // FIELD DEFINITIONS - Based on Question.js model
    fields: {
      // section: {
      //   type: "text",
      //   label: "Section",
      //   placeholder: "Enter section name (e.g., Fire Safety)",
      //   required: true,
      //   tableColumn: true,
      //   filterable: true, // Allow filtering/searching if needed later
      // },
      questionText: {
        type: "textarea", // Questions can be long
        label: "Question Text",
        placeholder: "Enter the audit question",
        required: true,
        tableColumn: true,
        filterable: true, // For search
        fullWidth: true, // Use full width in form
      },
      rule: {
        type: "select",
        label: "Rule",
        required: false, // Optional
        relation: "rules", // Links to 'rules' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "rule.name", // Display rule name/description
        placeholder: "Select a Rule (Optional)",
      },

      checkType: {
        type: "select",
        label: "Check Type",
        required: false, // Optional
        relation: "checkTypes", // Links to 'checkTypes' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "checkType.name", // Display checkType name
        placeholder: "Select a Check Type (Optional)",
      },
      responseType: {
        type: "select",
        label: "Response Type",
        required: true,
        options: ["yes/no", "text", "number"], // From schema enum
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
      rule: {
        type: "select",
        label: "Rule",
        placeholder: "All Rules",
        apiParam: "rule",
        relation: "rules",
      },
      checkType: {
        type: "select",
        label: "Check Type",
        placeholder: "All Check Types",
        apiParam: "checkType",
        relation: "checkTypes",
      },
      responseType: {
        // Added filter for response type
        type: "select",
        label: "Response Type",
        placeholder: "All Types",
        apiParam: "responseType", // Matches req.query.responseType
        options: ["yes/no", "text", "number"],
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
      checkType: {
        type: "select",
        label: "Check Type (Category)",
        required: true,
        relation: "checkTypes",
        tableColumn: true,
        filterable: true,
        dataAccessor: "checkType.name",
        placeholder: "Select a Check Type",
      },
      questions: {
        type: "select-multi", // ❗ This is a NEW type, needs a custom component
        label: "Questions",
        required: false, // Can be empty
        relation: "questions", // Links to 'questions' module
        tableColumn: false, // Don't show array in table
        filterable: false,
        placeholder: "Select questions for this template",
        formField: true,
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
      checkType: {
        type: "select",
        label: "Check Type",
        placeholder: "All Check Types",
        apiParam: "checkType",
        relation: "checkTypes",
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

  programs: {
    // API Configuration
    endpoint: "programs",

    // UI Configuration
    title: "Program Management",
    description: "Manage audit programs and initiatives",

    // Field definitions map to the Program.js model
    fields: {
      name: {
        type: "text",
        label: "Program Name",
        placeholder: "Enter program name",
        required: true,
        tableColumn: true,
        filterable: true,
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter program details",
        required: false,
        tableColumn: true,
        filterable: true,
        fullWidth: true,
      },
      company: {
        type: "select",
        label: "Company",
        required: true,
        relation: "companies", // Populates dropdown from 'companies' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "company.name", // Displays 'company.name' in the table
        placeholder: "Select Company",
      },
      // Field for Template relation
      template: {
        type: "select",
        label: "Template",
        required: true,
        relation: "templates", // Populates dropdown from 'templates' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "template.title", // Displays 'template.title' in the table
        placeholder: "Select Template",
      },
      // Field for Frequency
      frequency: {
        type: "select",
        label: "Frequency",
        required: true,
        options: [
          "one-time",
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "yearly",
        ],
        default: "monthly",
        tableColumn: true,
        filterable: true,
        placeholder: "Select Frequency",
      },
      // Field for Responsible Dept
      responsibleDept: {
        type: "text",
        label: "Responsible Dept.",
        required: false,
        placeholder: "e.g., Safety Department",
        tableColumn: true,
        filterable: true,
      },
      startDate: {
        type: "date",
        label: "Start Date",
        required: false,
        tableColumn: true,
        filterable: false,
      },
      endDate: {
        type: "date",
        label: "End Date",
        required: false,
        tableColumn: true,
        filterable: false,
      },
      programStatus: {
        type: "select",
        label: "Program Status",
        required: true,
        options: [
          "planning",
          "in-progress",
          "completed",
          "on-hold",
          "cancelled",
        ],
        default: "planning",
        tableColumn: true,
        filterable: true,
      },
      status: {
        type: "select",
        label: "System Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        editOnly: true, // Field only appears on the 'Edit' form
      },
      // Common fields (read-only, not shown in forms)
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
        placeholder: "Search name, description, or dept...",
        apiParam: "search",
        fields: ["name", "description", "responsibleDept"],
      },
      company: {
        type: "select",
        label: "Company",
        placeholder: "All Companies",
        apiParam: "company",
        relation: "companies",
      },
      template: {
        type: "select",
        label: "Template",
        placeholder: "All Templates",
        apiParam: "template",
        relation: "templates",
      },
      frequency: {
        type: "select",
        label: "Frequency",
        placeholder: "All Frequencies",
        apiParam: "frequency",
        options: [
          "one-time",
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "yearly",
        ],
      },
      programStatus: {
        type: "select",
        label: "Program Status",
        placeholder: "All Program Statuses",
        apiParam: "programStatus",
        options: [
          "planning",
          "in-progress",
          "completed",
          "on-hold",
          "cancelled",
        ],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS
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
    description: "Plan and assign all upcoming audit schedules",

    // FIELD DEFINITIONS - Based on your new Schedule.js
    fields: {
      title: {
        type: "text",
        label: "Schedule Title",
        placeholder: "Enter a title for the schedule",
        required: true,
        tableColumn: true,
        filterable: true, // For search
      },
      company: {
        type: "select",
        label: "Company",
        required: true,
        relation: "companies",
        tableColumn: true,
        filterable: true,
        dataAccessor: "company.name",
        placeholder: "Select Company",
      },
      program: {
        type: "select",
        label: "Program (Optional)",
        required: false,
        relation: "programs",
        tableColumn: true,
        filterable: true,
        dataAccessor: "program.name",
        placeholder: "Select Program",
      },
      // ✅ NEW FIELD - Handling the Array
      sites: {
        type: "select-multi", // ❗ This is a NEW, custom component type
        label: "Sites",
        required: false, // Per your schema
        relation: "sites", // Loads options from 'sites' module
        tableColumn: true, // We can show multiple names
        filterable: true,
        dataAccessor: "sites", // Let the component handle rendering the array
        placeholder: "Select Site(s)",
        fullWidth: true,
      },
      // ✅ NEW FIELD - Handling the Array
      assignedAuditors: {
        type: "select-multi", // ❗ This is also a multi-select
        label: "Assigned Auditors",
        required: false, // Per your schema
        relation: "users", // Loads options from 'users' module
        tableColumn: true,
        filterable: true,
        dataAccessor: "assignedAuditors",
        placeholder: "Select Auditor(s)",
        fullWidth: true,
      },
      startDate: {
        type: "date",
        label: "Start Date",
        // required: true,
        tableColumn: true,
        filterable: false,
      },
      endDate: {
        type: "date",
        label: "End Date",
        // required: true,
        tableColumn: true,
        filterable: false,
      },
      // ✅ NEW FIELD - From your schema
      scheduleStatus: {
        type: "select",
        label: "Schedule Status",
        required: true,
        options: [
          "scheduled",
          "in-progress",
          "completed",
          "postponed",
          "cancelled",
        ],
        default: "scheduled",
        tableColumn: true,
        filterable: true,
      },
      status: {
        // commonFields.status
        type: "select",
        label: "System Status",
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
    },

    // FILTER CONFIGURATION - Now includes new fields
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
        relation: "programs",
      },
      // ✅ NEW FILTER
      site: {
        type: "select", // Filter by ONE site (e.g., "show all schedules that include this site")
        label: "Site",
        placeholder: "Filter by Site",
        apiParam: "site", // Matches req.query.site in controller
        relation: "sites",
      },
      // ✅ NEW FILTER
      auditor: {
        type: "select", // Filter by ONE auditor
        label: "Auditor",
        placeholder: "Filter by Auditor",
        apiParam: "auditor", // Matches req.query.auditor in controller
        relation: "users",
      },
      // ✅ NEW FILTER
      scheduleStatus: {
        type: "select",
        label: "Schedule Status",
        placeholder: "All Statuses",
        apiParam: "scheduleStatus",
        options: [
          "scheduled",
          "in-progress",
          "completed",
          "postponed",
          "cancelled",
        ],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
    },

    // PERMISSIONS
    permissions: {
      create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
      start: ["admin", "sysadmin", "audit_manager"],
    },

    // CUSTOM ACTIONS
    customActions: [
      {
        label: "Start Audit",
        action: "start",

        endpoint: "/:id/start",

        method: "POST",
        showWhen: {
          field: "scheduleStatus",
          value: "scheduled",
        },
      },
    ],
  },

  auditSessions: {
    endpoint: "auditSessions",
    title: "Audit Session Management",
    description: "Manage ongoing and completed audit sessions",
    hasCustomActions: true, // To enable custom actions like "Start Audit", "Complete Audit"
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
      // create: ["admin", "sysadmin", "audit_manager"],
      edit: ["admin", "sysadmin", "audit_manager", "auditor"], // Auditor might update status/dates
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager", "auditor"],
      viewDetails: ["admin", "sysadmin", "audit_manager", "auditor"],
    },
    customActions: [
      {
        label: "Manage",
        action: "viewDetails", // Permission-er shathe match korbe
        type: "link", // ✅ Notun property: Eti ekta "command" na, eti ekta "link"
        href: "/dashboard/admin/auditsessions/:id" // ✅ Notun property: Kothay jabe
      }
    ]
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
        tableColumn: false,
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
        tableColumn: false,
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
        type: "number",
        label: " Observation Severity",
        required: false,
        relation: "observations",
        tableColumn: true,
        filterable: true,
       dataAccessor: (item) => {
          if (!item.observation) return "N/A (Manual)";
          return `${item.observation.response} (Severity: ${item.observation.severity})`;
        },
        placeholder: "Enter Observation Severity",
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
      // methodology: {
      //   type: "textarea",
      //   label: "Methodology (Optional)",
      //   required: false,
      //   tableColumn: false,
      //   filterable: false, // Hide from table maybe?
      //   placeholder: "How was this identified?",
      // },
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
      // create: ["admin", "sysadmin", "audit_manager", "auditor"],
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

  fixActions: {
    endpoint: "fix-actions", // Matches backend route (e.g., /api/fix-actions)
    title: "Corrective Actions", // Changed title slightly
    description: "Manage and track corrective actions for identified problems",
    displayField: "actionText",
    fields: {
      problem: {
        type: "select",
        label: "Related Problem",
        required: true,
        relation: "problems",
        tableColumn: true,
        filterable: true,
        dataAccessor: "problem.title", // Show problem title
        placeholder: "Link to Problem",
      },
      actionText: {
        type: "textarea",
        label: "Action Description",
        required: true,
        tableColumn: true,
        filterable: true,
        fullWidth: true,
        placeholder: "Describe the corrective action needed",
      },
      owner: {
        // Assigned User
        type: "select",
        label: "Owner",
        required: true,
        relation: "users",
        tableColumn: true,
        filterable: true,
        dataAccessor: "owner.name", // Show owner name
        placeholder: "Assign Owner",
      },
      deadline: {
        type: "date",
        label: "Deadline",
        required: true,
        tableColumn: true,
        filterable: false,
      },
      actionStatus: {
        // Workflow status
        type: "select",
        label: "Action Status",
        required: true,
        options: [
          "Pending",
          "In Progress",
          "Completed",
          "Verified",
          "Rejected",
        ],
        default: "Pending",
        tableColumn: true,
        filterable: true,
      },
      // Verification fields (mostly read-only in table, maybe editable in form for verifiers)
      verifiedBy: {
        type: "select",
        label: "Verified By",
        required: false,
        relation: "users",
        tableColumn: true,
        filterable: true,
        dataAccessor: "verifiedBy.name",
        formField: true, // Allow setting verifier in form (maybe edit only?)
        readOnly: false, // Make editable
        editOnly: true, // Only show on edit form
        placeholder: "Select Verifier (if verified)",
      },
      verifiedAt: {
        type: "date",
        label: "Verified At",
        required: false,
        tableColumn: true,
        filterable: false,
        formField: true, // Allow setting date
        readOnly: false,
        editOnly: true,
      },
      verificationResult: {
        type: "select",
        label: "Verification Result",
        required: false,
        options: [
          "Effective",
          "Ineffective",
          "Partially Effective",
          "Not Applicable",
          "Pending Verification",
        ],
        tableColumn: true,
        filterable: true,
        formField: true, // Allow setting result
        readOnly: false,
        editOnly: true,
        placeholder: "Select Verification Result (if verified)",
      },
      reviewNotes: {
        type: "textarea",
        label: "Review/Verification Notes",
        required: false,
        tableColumn: false,
        filterable: false, // Maybe hide from main table
        formField: true,
        fullWidth: true,
        readOnly: false, // Allow editing notes
        editOnly: true, // Only needed during/after completion?
        placeholder: "Enter review or verification notes",
      },
      verificationMethod: {
        type: "textarea",
        label: "Verification Method",
        required: false,
        tableColumn: false,
        filterable: false,
        formField: true,
        fullWidth: true,
        readOnly: false,
        editOnly: true,
        placeholder: "Describe how completion was verified",
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
        label: "Search Actions",
        placeholder: "Search action text...",
        apiParam: "search",
      },
      problem: {
        type: "select",
        label: "Problem",
        placeholder: "All Problems",
        apiParam: "problem",
        relation: "problems",
      },
      owner: {
        type: "select",
        label: "Owner",
        placeholder: "All Owners",
        apiParam: "owner",
        relation: "users",
      },
      actionStatus: {
        type: "select",
        label: "Action Status",
        placeholder: "All Action Statuses",
        apiParam: "actionStatus",
        options: [
          "Pending",
          "In Progress",
          "Completed",
          "Verified",
          "Rejected",
        ],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      verificationResult: {
        type: "select",
        label: "Verification Result",
        placeholder: "All Results",
        apiParam: "verificationResult",
        options: [
          "Effective",
          "Ineffective",
          "Partially Effective",
          "Not Applicable",
          "Pending Verification",
        ],
      },
      // Filter by deadline range would need custom UI
    },
    permissions: {
      // Match backend roles
      // Who can view? Probably everyone involved.
      view: [
        "admin",
        "sysadmin",
        "audit_manager",
        "auditor",
        "compliance_officer",
      ],
      // Who creates actions? Usually Managers/Admins based on Problems.
      create: ["admin", "sysadmin", "audit_manager"],
      // Who edits? Manager might change details. Owner might update status. Verifier updates verification fields. Needs thought.
      edit: ["admin", "sysadmin", "audit_manager" /*, add owner role? */],
      // Who deletes? Restricted.
      delete: ["admin", "sysadmin"],
    },
  },

  proofs: {
    endpoint: "proofs", // Matches backend route
    title: "Proof Management",
    description:
      "Manage uploaded evidence files for observations, problems, and actions",

    // Field definitions focus on table display, not a standard form
    fields: {
      // --- Relation fields (Read-only in table, not on form) ---
      problem: {
        type: "select",
        label: "Related Problem",
        relation: "problems",
        tableColumn: true,
        filterable: true,
        dataAccessor: "problem.title",
        formField: false, // ✅ ফর্মে দেখাবে না
      },
      observation: {
        type: "select",
        label: "Related Observation",
        relation: "observations",
        tableColumn: true,
        filterable: true,
        dataAccessor: "observation._id",
        formField: false, // ✅ ফর্মে দেখাবে না
      },
      fixAction: {
        type: "select",
        label: "Related Fix Action",
        relation: "FixAction",
        tableColumn: true,
        filterable: true,
        dataAccessor: "fixAction.actionText",
        formField: false, // ✅ ফর্মে দেখাবে না
      },

      // --- File Info (Read-only in table, not on form) ---
      originalName: {
        type: "text",
        label: "Filename",
        required: true,
        tableColumn: true,
        filterable: true,
        formField: false, // ✅ ফর্মে দেখাবে না (এডিট করা যাবে না)
        readOnly: true,
      },
      fileType: {
        type: "select",
        label: "File Type",
        required: true,
        options: ["image", "document", "video", "audio", "other"],
        tableColumn: true,
        filterable: true,
        formField: false, // ✅ ফর্মে দেখাবে না (এডিট করা যাবে না)
        readOnly: true,
      },
      size: {
        type: "number",
        label: "Size (Bytes)",
        required: true,
        tableColumn: true,
        filterable: false,
        formField: false, // ✅ ফর্মে দেখাবে না (এডিট করা যাবে না)
        readOnly: true,
      },
      uploadedAt: {
        type: "date",
        label: "Uploaded At",
        tableColumn: true,
        formField: false,
        readOnly: true,
      },

      // --- Editable Fields (Show on Edit Form) ---
      caption: {
        type: "textarea",
        label: "Caption",
        required: false,
        tableColumn: true,
        filterable: true,
        formField: true, // ✅ ফর্মে দেখাবে
        editOnly: true, // ✅ শুধু Edit মোডে
        readOnly: false, // ✅ এডিট করা যাবে
      },
      status: {
        type: "select",
        label: "Status",
        required: true,
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        formField: true, // ✅ ফর্মে দেখাবে
        editOnly: true, // ✅ শুধু Edit মোডে
        readOnly: false, // ✅ এডিট করা যাবে
      },

      // --- Common Fields (Hidden from form) ---
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

      // --- Cloudinary data (Hidden everywhere) ---
      cloudinaryId: { tableColumn: false, formField: false, readOnly: true },
      cloudinaryUrl: { tableColumn: false, formField: false, readOnly: true },
      cloudinaryFormat: {
        tableColumn: false,
        formField: false,
        readOnly: true,
      },
      cloudinaryResourceType: {
        tableColumn: false,
        formField: false,
        readOnly: true,
      },
      width: { tableColumn: false, formField: false, readOnly: true },
      height: { tableColumn: false, formField: false, readOnly: true },
      duration: { tableColumn: false, formField: false, readOnly: true },
      version: { tableColumn: false, formField: false, readOnly: true },
    },

    filters: {
      search: {
        type: "search",
        label: "Search Proofs",
        placeholder: "Search filename or caption...",
        apiParam: "search",
      },
      problem: {
        type: "select",
        label: "Problem",
        placeholder: "Filter by Problem",
        apiParam: "problem",
        relation: "problems",
      },
      observation: {
        type: "select",
        label: "Observation",
        placeholder: "Filter by Observation",
        apiParam: "observation",
        relation: "observations",
      },
      fixAction: {
        type: "select",
        label: "Fix Action",
        placeholder: "Filter by Fix Action",
        apiParam: "fix-action",
        relation: "fixActions",
      }, // Needs fixActions module
      fileType: {
        type: "select",
        label: "File Type",
        placeholder: "All File Types",
        apiParam: "fileType",
        options: ["image", "document", "video", "audio", "other"],
      },
      status: {
        type: "select",
        label: "Status",
        placeholder: "All Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      uploader: {
        type: "select",
        label: "Uploaded By",
        placeholder: "All Users",
        apiParam: "uploader",
        relation: "users",
      }, // Filter by createdBy
    },

    // Permissions - Need careful consideration for file uploads/deletes
    permissions: {
      // View might be broad
      view: [
        "admin",
        "sysadmin",
        "audit_manager",
        "auditor",
        "compliance_officer",
      ],
      // Create (Upload) - Who can upload evidence?
      create: ["admin", "sysadmin", "audit_manager", "auditor"], // Needs a dedicated upload UI, not UniversalForm create
      // Edit (Caption/Status only) - Who can edit metadata?
      edit: ["admin", "sysadmin", "audit_manager"], // UniversalForm edit can handle caption/status
      // Delete - Highly restricted
      delete: ["admin", "sysadmin"],
    },
    // ✅ Indicate that standard CRUD form isn't fully applicable
    hasCustomCreate: true, // Signal to hide default "Add" button
    // hasCustomEdit: false, // Can use UniversalForm for simple edits (caption, status)
  },

  reports: {
    endpoint: "reports",
    title: "Report Management",
    description: "View, generate, and manage audit reports",

    // ✅ hasCustomCreate: true মানে UniversalCRUDManager "Add" বাটন দেখাবে না
    hasCustomCreate: true,
    // UniversalForm Edit-এর জন্য ব্যবহৃত হবে

    // FIELD DEFINITIONS - Based on Report.js model
    fields: {
      // Core Info (Editable in form)
      title: {
        type: "text",
        label: "Report Title",
        required: true,
        tableColumn: true,
        filterable: true,
        formField: true, // Allow editing title
        placeholder: "Enter report title",
      },
      summary: {
        type: "textarea",
        label: "Summary",
        required: true,
        tableColumn: true,
        filterable: true,
        formField: true, // Allow editing summary
        placeholder: "Enter brief summary",
        fullWidth: true,
      },
      executiveSummary: {
        type: "textarea",
        label: "Executive Summary",
        required: true,
        tableColumn: false, // Too long for table
        formField: true, // Allow editing
        placeholder: "Enter executive summary",
        fullWidth: true,
      },

      // Relation (Read-only in form, filterable in table)
      auditSession: {
        type: "select",
        label: "Audit Session",
        required: true,
        relation: "auditSessions",
        tableColumn: true,
        filterable: true,
        dataAccessor: "auditSession.title",
        formField: true, // Show in form
        readOnly: true, // ✅ Make read-only in edit form
        placeholder: "Select Audit Session",
      },

      // Statuses (Editable in form)
      reportType: {
        type: "select",
        label: "Report Type",
        required: true,
        options: ["draft", "preliminary", "final", "executive"],
        default: "draft",
        tableColumn: true,
        filterable: true,
        formField: true, // Allow editing type
      },
      reportStatus: {
        type: "select",
        label: "Report Status",
        required: true,
        options: ["generating", "completed", "published", "archived"],
        default: "generating",
        tableColumn: true,
        filterable: true,
        formField: true, // Allow editing status
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
        formField: true,
        editOnly: true, // Allow editing system status
      },

      // Generated Info (Read-only, in table only)
      generatedBy: {
        type: "relation",
        label: "Generated By",
        relation: "users",
        tableColumn: true,
        filterable: true,
        dataAccessor: "generatedBy.name",
        formField: false, // Read-only, set by backend
      },
      generatedAt: {
        type: "date",
        label: "Generated At",
        tableColumn: true,
        filterable: false,
        formField: false,
      },

      // Complex fields (Hidden from table/form)
      findings: { label: "Findings", tableColumn: false, formField: false },
      metrics: { label: "Metrics", tableColumn: false, formField: false },
      filePath: { label: "File Path", tableColumn: false, formField: false },
      fileName: { label: "File Name", tableColumn: false, formField: false },
      fileSize: { label: "File Size", tableColumn: false, formField: false },

      // ✅ Common Fields (আপনার অনুরোধ অনুযায়ী যোগ করা হয়েছে)
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
        label: "Search Reports",
        placeholder: "Search title/summary...",
        apiParam: "search",
      },
      auditSession: {
        type: "select",
        label: "Audit Session",
        placeholder: "All Sessions",
        apiParam: "auditSession",
        relation: "auditSessions",
      },
      reportType: {
        type: "select",
        label: "Report Type",
        placeholder: "All Types",
        apiParam: "reportType",
        options: ["draft", "preliminary", "final", "executive"],
      },
      reportStatus: {
        type: "select",
        label: "Report Status",
        placeholder: "All Statuses",
        apiParam: "reportStatus",
        options: ["generating", "completed", "published", "archived"],
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
      generatedBy: {
        type: "select",
        label: "Generated By",
        placeholder: "All Users",
        apiParam: "generatedBy",
        relation: "users",
      },
    },

    // PERMISSIONS (Match backend roles)
    permissions: {
      create: ["admin", "sysadmin"], // Manual create (hidden by hasCustomCreate)
      edit: ["admin", "sysadmin", "audit_manager"], // Edit metadata
      delete: ["admin", "sysadmin"], // Delete report
      view: [
        "admin",
        "sysadmin",
        "audit_manager",
        "auditor",
        "compliance_officer",
      ],
      // ✅ Custom permission for generate button
      generate: ["admin", "sysadmin", "audit_manager"],
    },
  },

  approvals: {
    endpoint: "approvals",
    title: "Approval Requests",
    description:
      "Manage and review all approval requests in the system (Admin View)",

    // ✅ This module CANNOT be created via UniversalForm
    hasCustomCreate: true,
    // Edit form will only update specific, non-workflow fields

    fields: {
      // Core Info
      title: {
        type: "text",
        label: "Title",
        required: true,
        tableColumn: true,
        filterable: true,
        formField: true, // Allow editing title
        editOnly: true, // Only in edit mode
      },
      entityType: {
        type: "select",
        label: "Entity Type",
        required: true,
        options: [
          "Report",
          "Problem",
          "FixAction",
          "AuditSession",
          "Template",
          "Schedule",
        ],
        tableColumn: true,
        filterable: true,
        formField: false, // Cannot be edited
        readOnly: true,
      },
      entityId: {
        // Link to the actual item
        type: "relation",
        label: "Related Item",
        // relationPath: "entityType", // Dynamic refPath is complex for UniversalForm
        // We'll just show the ID or title if populated
        tableColumn: true,
        filterable: false,
        formField: false,
        readOnly: true,
        dataAccessor: "entityId.title", // Try to get title, fallback handled by column
      },
      approvalStatus: {
        type: "select",
        label: "Approval Status",
        options: [
          "pending",
          "in-review",
          "approved",
          "rejected",
          "cancelled",
          "escalated",
        ],
        tableColumn: true,
        filterable: true,
        formField: true, // Allow manual status override by admin?
        editOnly: true,
      },
      priority: {
        type: "select",
        label: "Priority",
        options: ["low", "medium", "high", "critical"],
        default: "medium",
        tableColumn: true,
        filterable: true,
        formField: true,
        editOnly: true,
      },

      // User Links
      approver: {
        type: "select",
        label: "Current Approver",
        required: true,
        relation: "users",
        tableColumn: true,
        filterable: true,
        dataAccessor: "approver.name",
        formField: true, // Allow changing approver (escalation?)
        editOnly: true,
        placeholder: "Select Approver",
      },
      requestedBy: {
        type: "relation",
        label: "Requested By",
        required: true,
        relation: "users",
        tableColumn: true,
        filterable: true,
        dataAccessor: "requestedBy.name",
        formField: false,
        readOnly: true,
      },

      // Timeline (Read-only in table)
      "timeline.deadline": {
        // Use dot notation for nested path
        type: "date",
        label: "Deadline",
        tableColumn: true,
        filterable: false,
        formField: true, // Allow editing deadline
        editOnly: true,
      },
      "timeline.requestedAt": {
        type: "date",
        label: "Requested At",
        tableColumn: true,
        filterable: false,
        formField: false,
      },
      "decision.decisionAt": {
        type: "date",
        label: "Decision At",
        tableColumn: false,
        filterable: false,
        formField: false,
      },
      "decision.comments": {
        type: "textarea",
        label: "Decision Comments",
        tableColumn: false,
        formField: true,
        editOnly: true, // Allow editing/adding notes?
        fullWidth: true,
      },

      // Complex fields (Hidden from table/form)
      description: {
        type: "textarea",
        label: "Description",
        required: true,
        formField: true,
        editOnly: true,
        fullWidth: true,
        tableColumn: false,
      },
      requirements: {
        label: "Requirements",
        tableColumn: false,
        formField: false,
      },
      reviewHistory: { label: "History", tableColumn: false, formField: false },
      notifications: {
        label: "Notifications",
        tableColumn: false,
        formField: false,
      },

      // Common fields
      status: {
        // System Status
        type: "select",
        label: "System Status",
        options: ["active", "inactive"],
        default: "active",
        tableColumn: true,
        filterable: true,
        formField: true,
        editOnly: true,
      },
      // ✅ common fields added as requested
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
        label: "Search Approvals",
        placeholder: "Search title/description...",
        apiParam: "search",
      },
      approvalStatus: {
        type: "select",
        label: "Approval Status",
        placeholder: "All Approval Statuses",
        apiParam: "approvalStatus",
        options: [
          "pending",
          "in-review",
          "approved",
          "rejected",
          "cancelled",
          "escalated",
        ],
      },
      priority: {
        type: "select",
        label: "Priority",
        placeholder: "All Priorities",
        apiParam: "priority",
        options: ["low", "medium", "high", "critical"],
      },
      entityType: {
        type: "select",
        label: "Entity Type",
        placeholder: "All Types",
        apiParam: "entityType",
        options: [
          "Report",
          "Problem",
          "FixAction",
          "AuditSession",
          "Template",
          "Schedule",
        ],
      },
      approver: {
        type: "select",
        label: "Approver",
        placeholder: "All Approvers",
        apiParam: "approver",
        relation: "users",
      },
      requestedBy: {
        type: "select",
        label: "Requested By",
        placeholder: "All Requesters",
        apiParam: "requestedBy",
        relation: "users",
      },
      status: {
        type: "select",
        label: "System Status",
        placeholder: "All System Statuses",
        apiParam: "status",
        options: ["active", "inactive"],
      },
    },
    permissions: {
      // Match backend roles
      create: ["admin", "sysadmin", "audit_manager"], // Manual create (hidden by hasCustomCreate)
      edit: ["admin", "sysadmin", "audit_manager"], // Admin/Manager edit of basic fields
      delete: ["admin", "sysadmin"], // Admin delete
      view: ["admin", "sysadmin", "audit_manager"], // Admin/Manager view of *all* requests

      // Custom permissions for workflow actions
      canApprove: ["admin", "sysadmin", "audit_manager", "auditor"], // Who can *ever* be an approver
      canComment: [
        "admin",
        "sysadmin",
        "audit_manager",
        "auditor",
        "compliance_officer",
      ], // Who can comment
    },
  },
};
