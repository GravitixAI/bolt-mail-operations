"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AdvancedThemeSwitcher } from "@/components/advanced-theme-switcher";
import { cn } from "@/lib/utils";

interface NavbarProps {
  /**
   * Optional custom logo component or image source
   */
  logo?: React.ReactNode | string;
  /**
   * Company/App name to display next to logo
   */
  title?: string;
  /**
   * Link for the logo/title (defaults to "/")
   */
  homeLink?: string;
  /**
   * Additional CSS classes for the navbar container
   */
  className?: string;
  /**
   * Additional navigation items to display in the center
   */
  children?: React.ReactNode;
}

export function Navbar({
  logo,
  title = "My App",
  homeLink = "/",
  className,
  children,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Title Section */}
        <Link
          href={homeLink}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {/* Logo */}
          <div className="flex items-center justify-center">
            {typeof logo === "string" ? (
              <div className="relative h-8 w-8">
                <Image
                  src={logo}
                  alt={`${title} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : logo ? (
              logo
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </Link>

        {/* Center Navigation Items (optional) */}
        {children && (
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {children}
          </nav>
        )}

        {/* Right Section - Theme Switcher */}
        <div className="flex items-center gap-2">
          <AdvancedThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

/**
 * NavLink component for navigation items
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function NavLink({ href, children, active, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}

