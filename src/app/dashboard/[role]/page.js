"use client";
import React from "react";
import { useParams } from "next/navigation";
import AdminDashboard from "@/components/dashboard/views/AdminDashboard";
import ManagerDashboard from "@/components/dashboard/views/ManagerDashboard";
import AuditorDashboard from "@/components/dashboard/views/AuditorDashboard";

export default function DashboardPage() {
  const params = useParams();
  const role = params.role;

  // Capitalize role for display (used for username prop as placeholder)
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  // Render appropriate dashboard based on role
  if (
    role === "admin" ||
    role === "sysadmin" ||
    role === "companyadmin" ||
    role === "superadmin" ||
    role === "groupadmin"
  ) {
    return <AdminDashboard userName={displayRole} role={role} />;
  }

  if (role === "manager" || role === "sitemanager") {
    return <ManagerDashboard userName={displayRole} role={role} />;
  }

  if (role === "auditor") {
    return <AuditorDashboard userName={displayRole} role={role} />;
  }

  // Fallback for known or unknown roles (can default to Auditor view or generic)
  return <AuditorDashboard userName={displayRole} role={role} />;
}
