"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar, NavLink } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Sparkles,
  Code,
  Palette,
  Zap,
  Component,
  LayoutDashboard,
  Rocket,
  Database,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar
        logo={<Rocket className="h-8 w-8 text-primary" />}
        title="Next.js Boilerplate"
      >
        <NavLink href="/" active>
          Home
        </NavLink>
        <NavLink href="/custom-components">Components</NavLink>
      </Navbar>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            Next.js 15 + shadcn/ui
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Modern Next.js
            <span className="text-primary block mt-2">Boilerplate</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A production-ready Next.js boilerplate with 50+ themes, beautiful
            components, and best practices built in. Start building immediately.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/custom-components">
              <Button size="lg" className="text-lg">
                <Component className="mr-2 h-5 w-5" />
                Explore Components
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/theme-switcher-demo">
              <Button size="lg" variant="outline" className="text-lg">
                <Palette className="mr-2 h-5 w-5" />
                Try Themes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Features Section */}
      <section className="container py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need to Start
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and best practices for building
            production-ready applications
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Palette className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">50+ Themes</CardTitle>
              <CardDescription className="text-base">
                Choose from over 50 professionally designed themes with both
                light and dark modes. Switch instantly without page reload.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Component className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Custom Components</CardTitle>
              <CardDescription className="text-base">
                Beautifully crafted components with full documentation, examples,
                and TypeScript support. Ready to use in your projects.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Code className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">TypeScript First</CardTitle>
              <CardDescription className="text-base">
                Fully typed components and utilities. Catch errors early and
                enjoy better IDE support and autocomplete.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <LayoutDashboard className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Responsive Design</CardTitle>
              <CardDescription className="text-base">
                All components are mobile-first and fully responsive. Works
                beautifully on any screen size and device.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Fast & Optimized</CardTitle>
              <CardDescription className="text-base">
                Built on Next.js 15 with App Router. Optimized for performance
                with fast refresh and instant page loads.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Modern Stack</CardTitle>
              <CardDescription className="text-base">
                Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. The
                best tools for building modern web applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <Database className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">SQLite & ORM</CardTitle>
              <CardDescription className="text-base">
                Integrated SQLite database with Drizzle ORM. Type-safe queries,
                full CRUD operations, and production-ready setup included.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Quick Links Section */}
      <section className="container py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Get Started</h2>
          <p className="text-lg text-muted-foreground">
            Explore the components and features
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          <Link href="/custom-components">
            <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader className="space-y-4">
                <Component className="h-10 w-10 text-primary" />
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Component Library
                </CardTitle>
                <CardDescription>
                  Browse the collection of custom components with demos and
                  documentation
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  View Components
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/theme-switcher-demo">
            <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader className="space-y-4">
                <Palette className="h-10 w-10 text-primary" />
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Theme Showcase
                </CardTitle>
                <CardDescription>
                  Experience 50+ beautiful themes with live component examples
                  and color palettes
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  Try Themes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/todo-crud">
            <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader className="space-y-4">
                <Database className="h-10 w-10 text-primary" />
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  SQLite CRUD Demo
                </CardTitle>
                <CardDescription>
                  Full-stack Todo app demonstrating SQLite database with complete
                  CRUD operations
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/framer-motion-demo">
            <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
              <CardHeader className="space-y-4">
                <Sparkles className="h-10 w-10 text-primary" />
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Framer Motion
                </CardTitle>
                <CardDescription>
                  Comprehensive animation library demos with gestures, scroll effects,
                  and parallax
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  View Animations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container py-12">
        <Card className="bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Built With Modern Technologies</CardTitle>
            <CardDescription className="text-base pt-2">
              This boilerplate uses the latest and most popular tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Next.js 15
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                React 19
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                TypeScript
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Tailwind CSS
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                shadcn/ui
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                next-themes
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                SQLite
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Drizzle ORM
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Framer Motion
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Tailwind CSS, and shadcn/ui
            </p>
            <div className="flex gap-4">
              <Link href="/custom-components">
                <Button variant="ghost" size="sm">
                  Components
                </Button>
              </Link>
              <Link href="/navbar-demo">
                <Button variant="ghost" size="sm">
                  Navbar Demo
                </Button>
              </Link>
              <Link href="/theme-switcher-demo">
                <Button variant="ghost" size="sm">
                  Themes
                </Button>
              </Link>
              <Link href="/todo-crud">
                <Button variant="ghost" size="sm">
                  Todo CRUD
                </Button>
              </Link>
              <Link href="/framer-motion-demo">
                <Button variant="ghost" size="sm">
                  Framer Motion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
