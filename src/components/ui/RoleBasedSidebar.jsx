"use client";

import { navItems } from "@/app/dashboard/constants/NavItems";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function RoleBasedSidebar({ role, isOpen, onToggle }) {
  const pathname = usePathname();
  const sidebarItems = navItems[role] || [];

  useEffect(() => {
    if (isOpen) {
      onToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:h-screen lg:z-50 bg-background border-r">
        <SidebarContent role={role} items={sidebarItems} pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
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
  // Track which submenus are open
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (id) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Check if any item in submenu is active
  const isSubmenuItemActive = (submenuItems) => {
    return submenuItems?.some(item => pathname === item.href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              AT
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Audit Tracker</span>
            <span className="text-xs text-muted-foreground capitalize">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation with Proper Scroll Area */}
      <ScrollArea className="flex-1 overflow-y-auto scroll-smooth">
        <div className="px-3 py-2">
          <nav className="grid gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isActive = pathname === item.href;
              const isSubmenuActive = hasSubmenu && isSubmenuItemActive(item.submenu);
              const isSubmenuOpen = openSubmenus[item.id];

              // Handle items without submenu (regular links)
              if (!hasSubmenu) {
                return (
                  <TooltipProvider key={item.id} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href || "#"}>
                          <Button
                            variant={(isActive || isSubmenuActive) ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 font-normal h-11",
                              (isActive || isSubmenuActive) && "bg-accent"
                            )}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="text-sm">{item.label}</span>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              // Handle items with submenu
              return (
                <div key={item.id} className="mb-1">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={(isSubmenuActive || isSubmenuOpen) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 font-normal h-11",
                            (isSubmenuActive || isSubmenuOpen) && "bg-accent"
                          )}
                          onClick={() => toggleSubmenu(item.id)}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span className="text-sm flex-1 text-left">{item.label}</span>
                          {isSubmenuOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Submenu items */}
                  {isSubmenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        return (
                          <TooltipProvider key={subItem.id} delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={subItem.href || "#"}>
                                  <Button
                                    variant={isSubItemActive ? "secondary" : "ghost"}
                                    className={cn(
                                      "w-full justify-start gap-3 font-normal h-10 pl-4",
                                      isSubItemActive && "bg-accent"
                                    )}
                                  >
                                    <span className="text-xs">{subItem.label}</span>
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right">{subItem.label}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <Separator />

      {/* Help Section - Fixed at Bottom */}
      <div className="p-4 shrink-0">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">?</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs text-muted-foreground">
                Check our documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}