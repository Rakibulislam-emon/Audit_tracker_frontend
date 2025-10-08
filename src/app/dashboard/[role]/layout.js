"use client";

import { RoleBasedNavbar } from "@/components/ui/RoleBasedNavbar";
import { RoleBasedSidebar } from "@/components/ui/RoleBasedSidebar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleLayout({ children }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const role = params.role;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && mounted) {
      if (!user) {
        router.replace("/auth/login");
      } else if (user.role !== role) {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, isLoading, role, router, mounted]);

  if (isLoading || !mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed positioning */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <RoleBasedSidebar
          role={role}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-66"
        }`}
      >
        {/* Navbar */}
        <div className="sticky top-0 z-40">
          <RoleBasedNavbar
            role={role}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto ">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
