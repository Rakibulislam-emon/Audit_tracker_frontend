"use client";

import { navItems } from "@/app/dashboard/constants/NavItems";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RoleBasedSidebar({ role, isOpen, onToggle }) {
  const pathname = usePathname();
  const sidebarItems = navItems[role] || [];

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onToggle();
    }
    // Only run when pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
    
      {/* Desktop Sidebar — always visible */}
      <aside className="hidden overflow-y-auto lg:flex lg:flex-col lg:w-64 lg:fixed lg:h-screen lg:border-r lg:bg-background lg:z-50">
        
        <SidebarContent role={role} items={sidebarItems} pathname={pathname} />
      </aside>

      {/* Mobile Sidebar — drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent role={role} items={sidebarItems} pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarContent({ role, items, pathname }) {
  return (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              AT
            </span>
          </div>
          <span className="text-lg font-semibold">Audit Tracker</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="grid gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.id} href={item.href}>
                <Button
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 font-normal"
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn("h-5 w-5", isActive && "text-primary")}
                    />
                    <span>{item.label}</span>
                  </div>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Need help?</p>
              <p className="text-xs text-muted-foreground truncate">
                Check our docs
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
