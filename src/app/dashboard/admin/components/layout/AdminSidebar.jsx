"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSidebar({ isOpen }) {
  const [activePage, setActivePage] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "users", label: "Users", icon: Users, href: "/users" },
    { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
    { id: "audit-logs", label: "Audit Logs", icon: FileCheck, href: "/audit-logs" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300 ease-in-out  ",
        isOpen ? "w-64" : "w-40 -translate-x-full lg:w-20 "
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            {isOpen && (
              <span className="text-lg font-semibold">AuditTracker</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActivePage(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isOpen && "lg:justify-center"
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}