"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { handleLogout } from "@/utils/auth-client";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "./ThemeToggle";

export function RoleBasedNavbar({ role, onToggleSidebar }) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Audit Assigned",
      message: "You have been assigned to the Q3 Financial Audit.",
      time: "2 mins ago",
      read: false,
      type: "info",
    },
    {
      id: 2,
      title: "Security Alert",
      message: "Unusual login attempt detected from new IP.",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: 3,
      title: "Report Approved",
      message: "The Compliance Report #2024-001 has been approved.",
      time: "Yesterday",
      read: true,
      type: "success",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const roleStyles = {
    admin: "from-red-500 to-rose-600",
    auditor: "from-blue-500 to-indigo-600",
    manager: "from-green-500 to-emerald-600",
  };

  const roleTitle = {
    admin: "Audit Tracker Admin",
    auditor: "Audit Tracker Auditor",
    manager: "Audit Tracker Manager",
  };

  const accent = roleStyles[role] || "from-slate-500 to-slate-600";

  return (
    <nav
      className={clsx(
        "relative z-50 h-16 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300"
      )}
    >
      {/* Animated role accent underline */}
      <motion.div
        layout
        className={clsx(
          "absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r",
          accent
        )}
      />

      <div className="flex h-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-secondary/70 transition"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1
            className={clsx(
              "text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
              accent
            )}
          >
            {roleTitle[role] || "Audit Tracker"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-9 pr-3 bg-secondary/40 border-secondary rounded-full focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 focus:w-80"
            />
          </div>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-secondary/70 transition"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        "flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                        !notification.read &&
                          "bg-blue-50/50 dark:bg-blue-900/10"
                      )}
                    >
                      <div
                        className={clsx(
                          "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                          !notification.read ? "bg-blue-600" : "bg-transparent"
                        )}
                      />
                      <div className="space-y-1">
                        <p
                          className={clsx(
                            "text-sm font-medium leading-none",
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground pt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-8"
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 gap-2 rounded-full px-2 hover:bg-secondary/70 transition"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/profile.webp" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {role}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 shadow-lg border bg-background/90 backdrop-blur"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
