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
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

export function RoleBasedNavbar({ role, onToggleSidebar }) {
  const { user } = useAuthStore();
  const pathname = usePathname();

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
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary/70 transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
            </span>
          </Button>

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
