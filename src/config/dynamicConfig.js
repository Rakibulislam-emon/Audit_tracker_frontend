export const universalConfig = {
  // USERS MODULE - Complete example with all features
  users: {
    // 🔗 API Connection
    endpoint: "users",  // Maps to: GET/POST/PUT/DELETE /api/users

    // 🏷️ UI Display
    title: "User Management",  // Shows in page headers, buttons

    // 📝 FORM FIELDS DEFINITION
    fields: {
      // Field 1: Basic text input
      name: {
        type: "text",           // Renders as <input type="text">
        label: "Full Name",     // Display label: "Full Name"
        placeholder: "Enter user's full name",  // Input placeholder
        required: true,         // Adds validation: "Name is required"
        tableColumn: true,      // Shows this field in data table
        // 🔍 Searchable: true   // Future: Enable search on this field
      },

      // Field 2: Email with validation
      email: {
        type: "email",          // Renders as <input type="email">
        label: "Email Address",
        required: true,
        placeholder: "user@company.com",
        tableColumn: true,
        // ✨ Auto-validation: Browser validates email format automatically
      },

      // Field 3: Password (create only)
      password: {
        type: "password",       // Renders as <input type="password">
        label: "Password",
        required: true,
        createOnly: true,       // 🚨 ONLY shows in create form, not edit form
        placeholder: "Enter secure password",
        tableColumn: false,     // ❌ Never show password in table (security!)
      },

      // Field 4: Select dropdown
      role: {
        type: "select",         // Renders as <select> with <options>
        label: "User Role",
        required: true,
        options: [              // Dropdown options array
          "admin",              // Value: "admin", Display: "Admin" (auto-formatted)
          "audit_manager",      // Value: "audit_manager", Display: "Audit Manager"
          "auditor",
          "compliance_officer",
          "sysadmin"
        ],
        tableColumn: true,
        // 🎯 Future: optionLabels: {admin: "Administrator"} for custom display
      },

      // Field 5: Switch/Toggle
      isActive: {
        type: "switch",         // Renders as toggle switch
        label: "Active Status",
        default: true,          // Default value when creating new
        tableColumn: true,
        // 🔄 Future: onColor: "green", offColor: "red"
      },

      // Field 6: Auto-managed field (readonly)
      lastLogin: {
        type: "date",           // Special type for date formatting
        label: "Last Login",
        tableColumn: true,
        readOnly: true,         // 🚫 Cannot edit - managed by system
        // ⚡ Auto-populated by backend
      }
    },

    // 🔐 ROLE-BASED PERMISSIONS
    permissions: {
      create: ["admin", "sysadmin"],        // Who can create users
      edit: ["admin", "sysadmin"],          // Who can edit users
      delete: ["admin", "sysadmin"],        // Who can delete users
      view: ["admin", "sysadmin", "audit_manager"]  // Who can see users
      // 🛡️ Future: custom: {approve: ["compliance_officer"]}
    },

    // ⚙️ TABLE CONFIGURATION
    tableConfig: {
      defaultSort: { field: "name", direction: "asc" },  // Initial table sort
      pageSize: 10,              // Rows per page
      // 🔍 Future: searchableFields: ["name", "email"]
    }
  },

  // GROUPS MODULE - Simpler example
  groups: {
    endpoint: "groups",
    title: "Group Management",

    fields: {
      name: {
        type: "text",
        label: "Group Name",
        placeholder: "Enter group name",
        required: true,
        tableColumn: true,
      },
      description: {
        type: "textarea",       // Renders as <textarea>
        label: "Description",
        placeholder: "Enter group description",
        tableColumn: true,
        // 📏 Future: rows: 4, maxLength: 500
      }
    },

    permissions: {
      create: ["admin", "sysadmin"],
      edit: ["admin", "sysadmin"],
      delete: ["admin", "sysadmin"],
      view: ["admin", "sysadmin", "audit_manager"]
    }
  }
};
