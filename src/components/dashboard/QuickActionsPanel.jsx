// src/components/dashboard/QuickActionsPanel.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  SearchIcon,
  FileIcon,
  AlertTriangleIcon,
  ImageIcon,
  BellIcon,
  CheckSquareIcon,
  ListTodoIcon,
} from "lucide-react";

/**
 * Quick Actions Panel Component
 * Displays role-based action buttons
 */
export default function QuickActionsPanel({ role: propRole }) {
  const router = useRouter();
  const params = useParams();
  const isReadOnly = useAuthStore((state) => state.isReadOnly);

  // Use prop if provided, otherwise fallback to params
  // Ensure we handle mixed case by converting to lowercase
  const rawRole = propRole || params.role || "";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase() : "";

  // Define actions based on role
  const getActionsForRole = () => {
    const baseActions = [
      {
        label: "View Notifications",
        icon: BellIcon,
        href: `/dashboard/${role}/auditsessions`,
        variant: "outline",
        roles: [
          "complianceofficer",
          "auditor",
          "superadmin",
          "groupadmin",
          "companyadmin",
          "sitemanager",
          "problemowner",
          "approver",
        ],
      },
      {
        label: "My Approvals",
        icon: CheckSquareIcon,
        href: `/dashboard/${role}/my-approvals`,
        variant: "outline",
        roles: [
          "complianceofficer",
          "superadmin",
          "groupadmin",
          "companyadmin",
          "sitemanager",
          "problemowner",
          "approver",
        ],
      },
      {
        label: "My Tasks",
        icon: ListTodoIcon,
        href: `/dashboard/${role}/auditsessions`,
        variant: "outline",
        roles: [
          "complianceofficer",
          "auditor",
          "superadmin",
          "groupadmin",
          "companyadmin",
          "sitemanager",
          "problemowner",
          "approver",
        ],
      },
    ];

    const roleSpecificActions = {
      companyadmin: [
        {
          label: "Create Program",
          icon: PlusIcon,
          href: `/dashboard/${role}/programs`,
          variant: "default",
        },
        {
          label: "Schedule Audit",
          icon: CalendarIcon,
          href: `/dashboard/${role}/schedules`,
          variant: "default",
        },
        {
          label: "Manage Teams",
          icon: UsersIcon,
          href: `/dashboard/${role}/teams`,
          variant: "default",
        },
        {
          label: "Generate Report",
          icon: FileTextIcon,
          href: `/dashboard/${role}/reports`,
          variant: "default",
        },
      ],
      superadmin: [
        {
          label: "Create Program",
          icon: PlusIcon,
          href: `/dashboard/${role}/programs`,
          variant: "default",
        },
        {
          label: "Schedule Audit",
          icon: CalendarIcon,
          href: `/dashboard/${role}/schedules`,
          variant: "default",
        },
        {
          label: "Manage Users",
          icon: UsersIcon,
          href: `/dashboard/${role}/users`,
          variant: "default",
        },
        {
          label: "System Settings",
          icon: FileTextIcon,
          href: `/dashboard/${role}/settings`,
          variant: "default",
        },
      ],
      groupadmin: [
        {
          label: "Create Program",
          icon: PlusIcon,
          href: `/dashboard/${role}/programs`,
          variant: "default",
        },
        {
          label: "Schedule Audit",
          icon: CalendarIcon,
          href: `/dashboard/${role}/schedules`,
          variant: "default",
        },
        {
          label: "Manage Teams",
          icon: UsersIcon,
          href: `/dashboard/${role}/teams`,
          variant: "default",
        },
        {
          label: "Generate Report",
          icon: FileTextIcon,
          href: `/dashboard/${role}/reports`,
          variant: "default",
        },
      ],
      sitemanager: [
        {
          label: "Create Program",
          icon: PlusIcon,
          href: `/dashboard/${role}/programs`,
          variant: "default",
        },
        {
          label: "Schedule Audit",
          icon: CalendarIcon,
          href: `/dashboard/${role}/schedules`,
          variant: "default",
        },
        {
          label: "Manage Teams",
          icon: UsersIcon,
          href: `/dashboard/${role}/teams`,
          variant: "default",
        },
        {
          label: "View Reports",
          icon: FileTextIcon,
          href: `/dashboard/${role}/reports`,
          variant: "default",
        },
      ],
      complianceofficer: [
        {
          label: "Review Reports",
          icon: FileTextIcon,
          href: `/dashboard/${role}/reports`,
          variant: "default",
        },
        {
          label: "View Problems",
          icon: AlertTriangleIcon,
          href: `/dashboard/${role}/problems`,
          variant: "default",
        },
        {
          label: "Track Fix Actions",
          icon: CheckSquareIcon,
          href: `/dashboard/${role}/fix-actions`,
          variant: "default",
        },
      ],
      auditor: [
        {
          label: "Start Audit",
          icon: SearchIcon,
          href: `/dashboard/${role}/auditsessions`,
          variant: "default",
        },
        {
          label: "Record Observation",
          icon: FileIcon,
          href: `/dashboard/${role}/observations`,
          variant: "default",
        },
        {
          label: "Report Problem",
          icon: AlertTriangleIcon,
          href: `/dashboard/${role}/problems`,
          variant: "default",
        },
        {
          label: "Upload Proof",
          icon: ImageIcon,
          href: `/dashboard/${role}/proofs`,
          variant: "default",
        },
      ],
      problemowner: [
        {
          label: "My Problems",
          icon: AlertTriangleIcon,
          href: `/dashboard/${role}/problems`,
          variant: "default",
        },
        {
          label: "Fix Actions",
          icon: CheckSquareIcon,
          href: `/dashboard/${role}/fix-actions`,
          variant: "default",
        },
        {
          label: "Upload Proof",
          icon: ImageIcon,
          href: `/dashboard/${role}/proofs`,
          variant: "default",
        },
      ],
      approver: [
        {
          label: "My Approvals",
          icon: CheckSquareIcon,
          href: `/dashboard/${role}/my-approvals`,
          variant: "default",
        },
        {
          label: "Audit Sessions",
          icon: ListTodoIcon,
          href: `/dashboard/${role}/auditsessions`,
          variant: "default",
        },
      ],
    };

    const specificActions = roleSpecificActions[role] || [];
    const filteredBaseActions = baseActions.filter((action) =>
      action.roles.includes(role)
    );

    return [...specificActions, ...filteredBaseActions];
  };

  const actions = getActionsForRole();

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                type="button"
                variant={action.variant || "outline"}
                disabled={isReadOnly && action.variant === "default"}
                className="h-auto flex-col gap-2 py-4 relative"
                onClick={() => router.push(action.href)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center">{action.label}</span>
                {isReadOnly && action.variant === "default" && (
                  <span className="absolute -top-1 -right-1 bg-slate-100 text-slate-500 text-[8px] px-1 rounded border border-slate-200 uppercase font-bold">
                    Read Only
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
