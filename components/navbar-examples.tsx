/**
 * Navbar Usage Examples
 * 
 * This file demonstrates various ways to use the Navbar component
 */

import { Navbar, NavLink } from "@/components/navbar";
import { Home, Info, Mail, Settings } from "lucide-react";

// Example 1: Basic navbar with just title
export function BasicNavbar() {
  return <Navbar title="My Company" />;
}

// Example 2: Navbar with custom logo icon
export function NavbarWithIcon() {
  return (
    <Navbar
      logo={<Home className="h-8 w-8 text-primary" />}
      title="My Dashboard"
    />
  );
}

// Example 3: Navbar with image logo
export function NavbarWithImage() {
  return (
    <Navbar
      logo="/logo.png" // Path to your logo image
      title="Company Name"
    />
  );
}

// Example 4: Navbar with navigation links
export function NavbarWithLinks() {
  return (
    <Navbar title="My App">
      <NavLink href="/" active>
        Home
      </NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/services">Services</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </Navbar>
  );
}

// Example 5: Navbar with icon navigation links
export function NavbarWithIconLinks() {
  return (
    <Navbar
      logo={<Settings className="h-8 w-8 text-primary" />}
      title="Admin Panel"
    >
      <NavLink href="/dashboard" active className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        Dashboard
      </NavLink>
      <NavLink href="/settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </NavLink>
      <NavLink href="/contact" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Contact
      </NavLink>
    </Navbar>
  );
}

// Example 6: Minimal navbar (no logo, just initial)
export function MinimalNavbar() {
  return <Navbar title="Portfolio" />;
}

// Example 7: Custom styled navbar
export function CustomStyledNavbar() {
  return (
    <Navbar
      logo={
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">AC</span>
        </div>
      }
      title="Acme Corp"
      className="border-b-2"
    />
  );
}

