import {
  LayoutDashboard,
  Users,
  Building2,
  Factory,
  FolderCheck,
  ShieldCheck,
  HelpCircle,
  FileEdit,
  CalendarCheck,
  Calendar,
  ClipboardList,
  SearchCheck,
  AlertTriangle,
  Wrench,
  Camera,
  BarChart3,
  ThumbsUp,
  Settings,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

export const navItems = {
  superAdmin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/superAdmin",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/dashboard/superAdmin/users",
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      submenu: [
        {
          id: "groups",
          label: "Groups",
          href: "/dashboard/superAdmin/groups",
        },
        {
          id: "companies",
          label: "Companies",
          href: "/dashboard/superAdmin/companies",
        },
        {
          id: "sites",
          label: "Sites",
          href: "/dashboard/superAdmin/sites",
        },
        {
          id: "teams",
          label: "Teams",
          href: "/dashboard/superAdmin/teams",
        },
      ],
    },
    {
      id: "library",
      label: "Library",
      icon: BookOpen,
      submenu: [
        {
          id: "checkTypes",
          label: "Check Types",
          href: "/dashboard/superAdmin/check-types",
        },
        {
          id: "rules",
          label: "Rules",
          href: "/dashboard/superAdmin/rules",
        },
        {
          id: "questions",
          label: "Questions",
          href: "/dashboard/superAdmin/questions",
        },
        {
          id: "templates",
          label: "Templates",
          href: "/dashboard/superAdmin/templates",
        },
        {
          id: "programs",
          label: "Programs",
          href: "/dashboard/superAdmin/programs",
        },
      ],
    },
    {
      id: "auditExecution",
      label: "Audit Execution",
      icon: ClipboardCheck,
      submenu: [
        {
          id: "schedules",
          label: "Schedules",
          href: "/dashboard/superAdmin/schedules",
        },
        {
          id: "auditSessions",
          label: "Audit Sessions",
          href: "/dashboard/superAdmin/auditsessions",
        },
        {
          id: "observations",
          label: "Observations",
          href: "/dashboard/superAdmin/observations",
        },
      ],
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "problems",
          label: "Problems",
          href: "/dashboard/superAdmin/problems",
        },
        {
          id: "fixActions",
          label: "Fix Actions",
          href: "/dashboard/superAdmin/fix-actions",
        },
        {
          id: "proofs",
          label: "Proofs",
          href: "/dashboard/superAdmin/proofs",
        },
      ],
    },
    {
      id: "reportsCompliance",
      label: "Reports & Compliance",
      icon: BarChart3,
      submenu: [
        {
          id: "reports",
          label: "Reports",
          href: "/dashboard/superAdmin/reports",
        },
        {
          id: "approvals",
          label: "Approvals",
          href: "/dashboard/superAdmin/approvals",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/superAdmin/settings",
    },
  ],

  groupAdmin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/groupAdmin",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/dashboard/groupAdmin/users",
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      submenu: [
        {
          id: "companies",
          label: "Companies",
          href: "/dashboard/groupAdmin/companies",
        },
        {
          id: "sites",
          label: "Sites",
          href: "/dashboard/groupAdmin/sites",
        },
      ],
    },
    {
      id: "library",
      label: "Library",
      icon: BookOpen,
      submenu: [
        {
          id: "checkTypes",
          label: "Check Types",
          href: "/dashboard/groupAdmin/check-types",
        },
        {
          id: "rules",
          label: "Rules",
          href: "/dashboard/groupAdmin/rules",
        },
        {
          id: "questions",
          label: "Questions",
          href: "/dashboard/groupAdmin/questions",
        },
        {
          id: "templates",
          label: "Templates",
          href: "/dashboard/groupAdmin/templates",
        },
        {
          id: "programs",
          label: "Programs",
          href: "/dashboard/groupAdmin/programs",
        },
      ],
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "problems",
          label: "Problems",
          href: "/dashboard/groupAdmin/problems",
        },
        {
          id: "fix-actions",
          label: "Fix Actions",
          href: "/dashboard/groupAdmin/fix-actions",
        },
      ],
    },
    {
      id: "reportsCompliance",
      label: "Reports & Compliance",
      icon: BarChart3,
      submenu: [
        {
          id: "reports",
          label: "Reports",
          href: "/dashboard/groupAdmin/reports",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/groupAdmin/settings",
    },
  ],

  companyAdmin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/companyAdmin",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/dashboard/companyAdmin/users",
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      submenu: [
        {
          id: "sites",
          label: "Sites",
          href: "/dashboard/companyAdmin/sites",
        },
      ],
    },
    {
      id: "auditExecution",
      label: "Audit Execution",
      icon: ClipboardCheck,
      submenu: [
        {
          id: "programs",
          label: "Programs",
          href: "/dashboard/companyAdmin/programs",
        },
        {
          id: "schedules",
          label: "Schedules",
          href: "/dashboard/companyAdmin/schedules",
        },
        {
          id: "auditSessions",
          label: "Audit Sessions",
          href: "/dashboard/companyAdmin/auditsessions",
        },
      ],
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "fix-actions",
          label: "Fix Actions",
          href: "/dashboard/companyAdmin/fix-actions",
        },
      ],
    },
    {
      id: "reportsCompliance",
      label: "Reports & Compliance",
      icon: BarChart3,
      submenu: [
        {
          id: "reports",
          label: "Reports",
          href: "/dashboard/companyAdmin/reports",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/companyAdmin/settings",
    },
  ],

  complianceOfficer: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/complianceOfficer",
    },
    {
      id: "library",
      label: "Library",
      icon: BookOpen,
      submenu: [
        {
          id: "checkTypes",
          label: "Check Types",
          href: "/dashboard/complianceOfficer/check-types",
        },
        {
          id: "rules",
          label: "Rules",
          href: "/dashboard/complianceOfficer/rules",
        },
        {
          id: "questions",
          label: "Questions",
          href: "/dashboard/complianceOfficer/questions",
        },
        {
          id: "templates",
          label: "Templates",
          href: "/dashboard/complianceOfficer/templates",
        },
        {
          id: "programs",
          label: "Programs",
          href: "/dashboard/complianceOfficer/programs",
        },
      ],
    },
    {
      id: "reportsCompliance",
      label: "Reports & Compliance",
      icon: BarChart3,
      submenu: [
        {
          id: "approvals",
          label: "Approvals",
          href: "/dashboard/complianceOfficer/approvals",
        },
        {
          id: "reports",
          label: "Reports",
          href: "/dashboard/complianceOfficer/reports",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/complianceOfficer/settings",
    },
  ],

  auditor: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/auditor",
    },
    {
      id: "schedules",
      label: "My Assignments",
      icon: Calendar,
      href: "/dashboard/auditor/schedules",
    },
    {
      id: "auditSessions",
      label: "Active Audits",
      icon: ClipboardList,
      href: "/dashboard/auditor/auditsessions",
    },
    {
      id: "observations",
      label: "Observations",
      icon: SearchCheck,
      href: "/dashboard/auditor/observations",
    },
    {
      id: "proofs",
      label: "Proofs",
      icon: Camera,
      href: "/dashboard/auditor/proofs",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/auditor/settings",
    },
  ],

  siteManager: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/siteManager",
    },
    {
      id: "my-tasks",
      label: "My Tasks",
      icon: ClipboardList,
      href: "/dashboard/siteManager/my-problems",
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "problems",
          label: "My Problems",
          href: "/dashboard/siteManager/problems",
        },
        {
          id: "fix-actions",
          label: "Fix Actions",
          href: "/dashboard/siteManager/fix-actions",
        },
        {
          id: "proofs",
          label: "Proofs",
          href: "/dashboard/siteManager/proofs",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/siteManager/settings",
    },
  ],

  problemOwner: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/problemOwner",
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "my-tasks",
          label: "My Tasks",
          href: "/dashboard/problemOwner/my-problems",
        },
        {
          id: "fix-actions",
          label: "Fix Actions",
          href: "/dashboard/problemOwner/fix-actions",
        },
        {
          id: "proofs",
          label: "Proofs",
          href: "/dashboard/problemOwner/proofs",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/problemOwner/settings",
    },
  ],

  approver: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/approver",
    },
    {
      id: "auditSessions",
      label: "Active Audits",
      icon: ClipboardList,
      href: "/dashboard/approver/auditsessions",
    },
    {
      id: "issueManagement",
      label: "Issue Management",
      icon: AlertTriangle,
      submenu: [
        {
          id: "problems",
          label: "Problems",
          href: "/dashboard/approver/problems",
        },
        {
          id: "fixActions",
          label: "Fix Actions",
          href: "/dashboard/approver/fix-actions",
        },
        {
          id: "proofs",
          label: "Proofs",
          href: "/dashboard/approver/proofs",
        },
      ],
    },
    {
      id: "reportsCompliance",
      label: "Reports & Compliance",
      icon: BarChart3,
      submenu: [
        {
          id: "approvals",
          label: "Approvals",
          href: "/dashboard/approver/approvals",
        },
        {
          id: "reports",
          label: "Reports",
          href: "/dashboard/approver/reports",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/approver/settings",
    },
  ],
};
