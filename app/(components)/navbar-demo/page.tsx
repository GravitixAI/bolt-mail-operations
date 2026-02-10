"use client";

import * as React from "react";
import { Navbar, NavLink } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Home,
  Settings,
  Mail,
  Rocket,
  Code,
  Zap,
} from "lucide-react";

export default function NavbarDemoPage() {
  return (
    <>
      {/* Main Navbar */}
      <Navbar
        logo={<Code className="h-8 w-8 text-primary" />}
        title="Navbar Demo"
      >
        <NavLink href="/navbar-demo" active>
          Demo
        </NavLink>
        <NavLink href="/custom-components">Components</NavLink>
      </Navbar>

      {/* Content */}
      <div className="container py-12 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Navbar Component Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Different variations of the Navbar component with various
            configurations
          </p>
        </div>

        <Separator />

        {/* Example 1 */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Basic Navbar (Title Only)</CardTitle>
              <CardDescription>
                Simplest configuration with just a title. Logo automatically
                generates from first letter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Navbar title="My Company" />
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Page content area</p>
                </div>
              </div>
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block overflow-x-auto">
                  {`<Navbar title="My Company" />`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example 2 */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2. Navbar with Icon Logo</CardTitle>
              <CardDescription>
                Using a lucide-react icon as the logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Navbar
                  logo={<Palette className="h-8 w-8 text-primary" />}
                  title="Theme Switcher Demo"
                />
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Page content area</p>
                </div>
              </div>
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block overflow-x-auto">
                  {`<Navbar
  logo={<Palette className="h-8 w-8 text-primary" />}
  title="Theme Switcher Demo"
/>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example 3 */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>3. Navbar with Navigation Links</CardTitle>
              <CardDescription>
                Includes navigation links in the center of the navbar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Navbar
                  logo={<Rocket className="h-8 w-8 text-primary" />}
                  title="Dashboard"
                >
                  <NavLink href="/dashboard" active>
                    Home
                  </NavLink>
                  <NavLink href="/about">About</NavLink>
                  <NavLink href="/services">Services</NavLink>
                  <NavLink href="/contact">Contact</NavLink>
                </Navbar>
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Page content area</p>
                </div>
              </div>
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block overflow-x-auto whitespace-pre">
                  {`<Navbar
  logo={<Rocket className="h-8 w-8 text-primary" />}
  title="Dashboard"
>
  <NavLink href="/dashboard" active>Home</NavLink>
  <NavLink href="/about">About</NavLink>
  <NavLink href="/services">Services</NavLink>
  <NavLink href="/contact">Contact</NavLink>
</Navbar>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example 4 */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>4. Navbar with Icon Navigation Links</CardTitle>
              <CardDescription>
                Navigation links with icons for better visual hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Navbar
                  logo={<Settings className="h-8 w-8 text-primary" />}
                  title="Admin Panel"
                >
                  <NavLink
                    href="/dashboard"
                    active
                    className="flex items-center gap-2"
                  >
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
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Page content area</p>
                </div>
              </div>
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block overflow-x-auto whitespace-pre">
                  {`<Navbar
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
</Navbar>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example 5 */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>5. Custom Logo Component</CardTitle>
              <CardDescription>
                Using a fully custom React component as the logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Navbar
                  logo={
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">AC</span>
                    </div>
                  }
                  title="Acme Corp"
                />
                <div className="h-32 bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Page content area</p>
                </div>
              </div>
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block overflow-x-auto whitespace-pre">
                  {`<Navbar
  logo={
    <div className="h-10 w-10 rounded-full bg-gradient-to-r 
                    from-purple-500 to-pink-500 flex items-center 
                    justify-center">
      <span className="text-white font-bold text-lg">AC</span>
    </div>
  }
  title="Acme Corp"
/>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Theme Switcher Included</CardTitle>
                <CardDescription>
                  Every navbar includes the AdvancedThemeSwitcher on the right
                  side automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Flexible Logo Support</CardTitle>
                <CardDescription>
                  Use icons, images, or custom components. Auto-generates
                  initial if no logo provided
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Rocket className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Responsive Design</CardTitle>
                <CardDescription>
                  Sticky header with backdrop blur effect. Adapts to different
                  screen sizes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Documentation Link */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Full Documentation</CardTitle>
            <CardDescription>
              For complete usage instructions, props documentation, and more
              examples, see the NAVBAR_GUIDE.md file in your project root.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}

