// import {
//   Building2,
//   Calendar,
//   ClipboardCheck,
//   ClipboardList,
//   Factory,
//   FileText,
//   Layers,
//   Layers3,
//   LayoutDashboard,
//   ListChecks,
//   Settings,
//   Users,
// } from "lucide-react";

import { HomeIcon, UsersIcon } from "lucide-react";

// const navItems = {
//   admin: [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       href: "/dashboard/admin",
//     },
//     {
//       id: "users",
//       label: "Users",
//       icon: Users,
//       href: "/dashboard/admin/users",
//     },
//     {
//       id: "groups",
//       label: "Groups",
//       icon: Layers,
//       href: "/dashboard/admin/groups",
//     },
//     {
//       id: "companies",
//       label: "Companies",
//       icon: Building2,
//       href: "/dashboard/admin/companies",
//     },
//     {
//       id: "sites",
//       label: "Sites",
//       icon: Factory,
//       href: "/dashboard/admin/sites",
//     },
//     {
//       id: "rules",
//       label: "Rules",
//       icon: FileText,
//       href: "/dashboard/admin/rules",
//     },
//     {
//       id: "check-types",
//       label: "Check Types",
//       icon: ListChecks,
//       href: "/dashboard/admin/check-types",
//     },
//     {
//       id: "templates",
//       label: "Templates",
//       icon: ClipboardList,
//       href: "/dashboard/admin/templates",
//     },
//     {
//       id: "questions",
//       label: "Questions",
//       icon: ClipboardCheck,
//       href: "/dashboard/admin/questions",
//     },
//     {
//       id: "programs",
//       label: "Programs",
//       icon: Layers3,
//       href: "/dashboard/admin/programs",
//     },
//     {
//       id: "schedules",
//       label: "Schedules",
//       icon: Calendar,
//       href: "/dashboard/admin/schedules",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: Settings,
//       href: "/dashboard/admin/settings",
//     },
//   ],
// };

// export { navItems };

// src/app/dashboard/constants/navItems.js
export const navItems = {
  admin: [
    {
      id: 1,
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: HomeIcon,
      roles: ["admin"],
    },
    {
      id: 2,
      label: "Users",
      href: "/dashboard/admin/users",
      icon: UsersIcon,
      roles: ["admin"],
    },
    {
      id: 3,
      label: "Settings",
      href: "/dashboard/admin/settings",
      icon: UsersIcon,
      roles: ["admin"],
    },
  ],
  auditor: [
    {
      id: 1,
      label: "Audit Reports",
      href: "/dashboard/auditor/reports",
      icon: UsersIcon,
      roles: ["auditor"],
    },
    {
      id: 2,
      label: "Pending Audits",
      href: "/dashboard/auditor/pending",
      icon: UsersIcon,
      roles: ["auditor"],
    },
  ],
};
