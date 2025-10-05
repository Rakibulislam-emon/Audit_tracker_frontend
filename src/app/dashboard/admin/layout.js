"use client";

import { useState } from "react";
import { AdminNavbar } from "./components/layout/AdminNavbar";
import AdminSidebar from "./components/layout/AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking overlay (mobile only)
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden "
          onClick={handleOverlayClick}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64 " : "lg:ml-20 "}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <AdminNavbar onToggleSidebar={toggleSidebar} />
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}