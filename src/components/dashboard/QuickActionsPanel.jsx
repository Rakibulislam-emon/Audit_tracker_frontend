// src/components/dashboard/QuickActionsPanel.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
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
export default function QuickActionsPanel() {
  const router = useRouter();
  const params = useParams();
  const role = params.role;

  // Define actions based on role
  const getActionsForRole = () => {
    const baseActions = [
      {
        label: "View Notifications",
        icon: BellIcon,
        href: `/dashboard/${role}/auditsessions`,
        variant: "outline",
        roles: [
          "admin",
          "manager",
          "auditor",
          "compliance_officer",
          "sysadmin",
        ],
      },
      {
        label: "My Approvals",
        icon: CheckSquareIcon,
        href: `/dashboard/${role}/my-approvals`,
        variant: "outline",
        roles: ["admin", "manager", "compliance_officer", "sysadmin"],
      },
      {
        label: "My Tasks",
        icon: ListTodoIcon,
        href: `/dashboard/${role}/auditsessions`,
        variant: "outline",
        roles: [
          "admin",
          "manager",
          "auditor",
          "compliance_officer",
          "sysadmin",
        ],
      },
    ];

    const roleSpecificActions = {
      admin: [
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
      sysadmin: [
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
      manager: [
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
      complianceOfficer: [
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
                variant={action.variant || "outline"}
                className="h-auto flex-col gap-2 py-4"
                onClick={() => router.push(action.href)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
