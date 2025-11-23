import {
  Building2,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  Layers,
  Layers3,
  LayoutDashboard,
  ListChecks,
  Settings,
  Users,
} from "lucide-react";

export const navItems = {
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      href: "/dashboard/admin/users",
    },
    {
      id: "groups",
      label: "Groups",
      icon: Layers,
      href: "/dashboard/admin/groups",
    },
    {
      id: "companies",
      label: "Companies",
      icon: Building2,
      href: "/dashboard/admin/companies",
    },
    {
      id: "sites",
      label: "Sites",
      icon: Factory,
      href: "/dashboard/admin/sites",
    },
    {
      id: "check-types",
      label: "Category (Check Types)",
      icon: ListChecks,
      href: "/dashboard/admin/check-types",
    },
    {
      id: "rules",
      label: "Rules",
      icon: FileText,
      href: "/dashboard/admin/rules",
    },
    {
      id: "questions",
      label: "Questions",
      icon: ClipboardCheck,
      href: "/dashboard/admin/questions",
    },

    {
      id: "templates",
      label: "Templates",
      icon: ClipboardList,
      href: "/dashboard/admin/templates",
    },

    {
      id: "programs",
      label: "Programs",
      icon: Layers3,
      href: "/dashboard/admin/programs",
    },
    {
      id: "schedules",
      label: "Schedules",
      icon: Calendar,
      href: "/dashboard/admin/schedules",
    },
    // teams

    //  auditSessions
    {
      id: "auditSessions",
      label: "Audit Sessions",
      icon: Calendar,
      href: "/dashboard/admin/auditsessions",
    },
    {
      id: "teams",
      label: "Teams",
      icon: Users,
      href: "/dashboard/admin/teams",
    },
    // observations
    {
      id: "observations",
      label: "Observations",
      icon: FileText,
      href: "/dashboard/admin/observations",
    },
    // problems
    {
      id: "problems",
      label: "Problems",
      icon: ListChecks,
      href: "/dashboard/admin/problems",
    },
    // fix-actions
    {
      id: "fix-actions",
      label: "Fix Actions",
      icon: ClipboardCheck,
      href: "/dashboard/admin/fix-actions",
    },
    // proofs
    {
      id: "proofs",
      label: "Proofs",
      icon: FileText,
      href: "/dashboard/admin/proofs",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      href: "/dashboard/admin/reports",
    },
    {
      id: "approvals",
      label: "Approvals",
      icon: FileText,
      href: "/dashboard/admin/approvals",
    },
    // {
    //   id: "metrics",
    //   label: "Metrics",
    //   icon: LayoutDashboard,
    //   href: "/dashboard/admin/metrics",
    // },
    // {
    //   id: "question-rule-links",
    //   label: "Question Rule Links",
    //   icon: Layers,
    //   href: "/dashboard/admin/question-rule-links",
    // },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
    },
  ],
  manager: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/manager",
    },
    {
      id: "team-audits",
      label: "Team Audits",
      icon: Users,
      href: "/dashboard/manager/team-audits",
    },
    {
      id: "approvals",
      label: "Approvals",
      icon: ClipboardCheck,
      href: "/dashboard/manager/approvals",
    },
    {
      id: "schedules",
      label: "Schedules",
      icon: Calendar,
      href: "/dashboard/manager/schedules",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      href: "/dashboard/manager/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/manager/settings",
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
      id: "my-audits",
      label: "My Audits",
      icon: ClipboardList,
      href: "/dashboard/auditor/my-audits",
    },
    {
      id: "schedule",
      label: "My Schedule",
      icon: Calendar,
      href: "/dashboard/auditor/schedule",
    },
    {
      id: "reports",
      label: "My Reports",
      icon: FileText,
      href: "/dashboard/auditor/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/auditor/settings",
    },
  ],
};

// export { navItems };

// import {
//   HomeIcon,
//   UsersIcon,
//   SettingsIcon,
//   FileTextIcon,
//   ClockIcon,
//   BuildingIcon,
//   LayersIcon,
//   CheckSquareIcon,
//   ClipboardListIcon,
//   CalendarIcon,
//   ShieldIcon,
// } from "lucide-react";

// export const navItems = {
//   admin: [
//     {
//       id: 1,
//       label: "Dashboard",
//       href: "/dashboard/admin",
//       icon: HomeIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 2,
//       label: "Users",
//       href: "/dashboard/admin/users",
//       icon: UsersIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 3,
//       label: "Companies",
//       href: "/dashboard/admin/companies",
//       icon: BuildingIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 4,
//       label: "Templates",
//       href: "/dashboard/admin/templates",
//       icon: ClipboardListIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 5,
//       label: "Check Types",
//       href: "/dashboard/admin/check-types",
//       icon: CheckSquareIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 6,
//       label: "Programs",
//       href: "/dashboard/admin/programs",
//       icon: LayersIcon,
//       roles: ["admin"],
//     },
//     {
//       id: 7,
//       label: "Settings",
//       href: "/dashboard/admin/settings",
//       icon: SettingsIcon,
//       roles: ["admin"],
//     },
//   ],
//   auditor: [
//     {
//       id: 1,
//       label: "Dashboard",
//       href: "/dashboard/auditor",
//       icon: HomeIcon,
//       roles: ["auditor"],
//     },
//     {
//       id: 2,
//       label: "Audit Reports",
//       href: "/dashboard/auditor/reports",
//       icon: FileTextIcon,
//       roles: ["auditor"],
//     },
//     {
//       id: 3,
//       label: "Pending Audits",
//       href: "/dashboard/auditor/pending",
//       icon: ClockIcon,
//       roles: ["auditor"],
//     },
//     {
//       id: 4,
//       label: "Schedules",
//       href: "/dashboard/auditor/schedules",
//       icon: CalendarIcon,
//       roles: ["auditor"],
//     },
//   ],
//   manager: [
//     {
//       id: 1,
//       label: "Dashboard",
//       href: "/dashboard/manager",
//       icon: HomeIcon,
//       roles: ["manager"],
//     },
//     {
//       id: 2,
//       label: "Team Audits",
//       href: "/dashboard/manager/team-audits",
//       icon: UsersIcon,
//       roles: ["manager"],
//     },
//     {
//       id: 3,
//       label: "Reports",
//       href: "/dashboard/manager/reports",
//       icon: FileTextIcon,
//       roles: ["manager"],
//     },
//     {
//       id: 4,
//       label: "Compliance",
//       href: "/dashboard/manager/compliance",
//       icon: ShieldIcon,
//       roles: ["manager"],
//     },
//   ],
// };
