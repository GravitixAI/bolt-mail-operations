"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Component,
  Palette,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  Code,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function CustomComponentsPage() {
  return (
    <>
      <Navbar
        logo={<Component className="h-8 w-8 text-primary" />}
        title="Custom Components"
      />

      <div className="container py-12 space-y-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            Custom Built Components
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to the Component Library
          </h1>
          <p className="text-lg text-muted-foreground">
            A collection of custom-built, reusable components for your Next.js
            application. Each component is fully documented with examples and
            usage guides.
          </p>
        </div>

        <Separator />

        {/* Available Components */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Available Components</h2>
            <p className="text-muted-foreground">
              Click on any component to view its demo and documentation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Navbar Component */}
            <Link href="/navbar-demo" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <LayoutDashboard className="h-10 w-10 text-primary mb-3" />
                    <Badge>Live</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Navbar Component
                  </CardTitle>
                  <CardDescription>
                    Flexible navigation bar with logo, links, and integrated
                    theme switcher
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Logo Support
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Navigation
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Responsive
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Theme Switcher Component */}
            <Link href="/theme-switcher-demo" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Palette className="h-10 w-10 text-primary mb-3" />
                    <Badge>Live</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Theme Switcher
                  </CardTitle>
                  <CardDescription>
                    Advanced theme selector with 50+ themes, light/dark mode,
                    and search
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        50+ Themes
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Dark Mode
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Search
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Coming Soon Card */}
            <Card className="h-full border-dashed">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Component className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardTitle className="text-muted-foreground">
                  More Components
                </CardTitle>
                <CardDescription>
                  Additional custom components will appear here as you build
                  them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep building amazing components and they'll be automatically
                  listed here!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Why These Components?</h2>
            <p className="text-muted-foreground">
              Built with best practices and modern web standards
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Type-Safe</CardTitle>
                <CardDescription>
                  Built with TypeScript for complete type safety and better
                  developer experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Well Documented</CardTitle>
                <CardDescription>
                  Each component includes comprehensive documentation, examples,
                  and usage guides
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Tested, accessible, and optimized for production use in
                  modern web applications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-4">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/navbar-demo">
                  <Button variant="outline" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Navbar Demo
                  </Button>
                </Link>
                <Link href="/theme-switcher-demo">
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="mr-2 h-4 w-4" />
                    Theme Switcher Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Documentation Note */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Documentation
            </CardTitle>
            <CardDescription>
              Each component has detailed documentation files in your project
              root:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  NAVBAR_GUIDE.md
                </code>
                - Complete navbar documentation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  NAVBAR_QUICKSTART.md
                </code>
                - Quick start guide
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  THEME_SWITCHER.md
                </code>
                - Theme switcher docs
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

