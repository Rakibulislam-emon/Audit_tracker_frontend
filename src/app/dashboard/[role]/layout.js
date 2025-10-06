// src/app/dashboard/[role]/layout.js
"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  default as RoleBasedNavbar,
  default as RoleBasedSidebar,
} from "@/components/ui/RoleBasedNavbar";

export default function RoleLayout({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const role = params.role;

  useEffect(() => {
    if (user && user.role !== role) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, role, router]);

  if (!user) return null; // or loading spinner

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RoleBasedSidebar role={role} />
      <div className="flex-1">
        <RoleBasedNavbar role={role} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
