"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Palette,
  Menu as MenuIcon,
  Component,
  LayoutDashboard,
  Database,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Components Home",
    href: "/custom-components",
    icon: <Home className="h-4 w-4" />,
    description: "Custom components overview",
  },
  {
    title: "Navbar",
    href: "/navbar-demo",
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: "Navigation bar component",
  },
  {
    title: "Theme Switcher",
    href: "/theme-switcher-demo",
    icon: <Palette className="h-4 w-4" />,
    description: "50+ themes with light/dark mode",
  },
  {
    title: "Todo CRUD",
    href: "/todo-crud",
    icon: <Database className="h-4 w-4" />,
    description: "SQLite database testing",
  },
  {
    title: "Framer Motion",
    href: "/framer-motion-demo",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Animation library demos",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-20 left-4 z-40 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b px-4">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Component className="h-5 w-5 text-primary" />
                <span className="font-semibold">Components</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn("hidden md:flex", isCollapsed && "mx-auto")}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Menu Items */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!isCollapsed && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {!isCollapsed && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Coming Soon
                  </h4>
                  <div className="px-3 py-2 text-sm text-muted-foreground/50">
                    More components will be added here as you build them!
                  </div>
                </div>
              </>
            )}
          </ScrollArea>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t p-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                Back to Main Site
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/**
 * Hook to use with content that needs to adjust for sidebar
 */
export function useSidebarOffset(isCollapsed?: boolean) {
  const [collapsed, setCollapsed] = React.useState(isCollapsed ?? false);
  
  return {
    className: cn(
      "transition-all duration-300",
      collapsed ? "md:ml-16" : "md:ml-64"
    ),
    isCollapsed: collapsed,
    setIsCollapsed: setCollapsed,
  };
}

