# AI Instructions: Component Development

## Project Structure

```
components/
├── navbar.tsx                  # Custom navbar component
├── sidebar.tsx                 # Custom sidebar component
├── advanced-theme-switcher.tsx # Theme switcher
├── navbar-examples.tsx         # Usage examples
├── providers/
│   └── theme-provider.tsx      # Theme context
└── ui/                         # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    └── ... (50+ components)

app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── (components)/               # Route group for demos
│   ├── layout.tsx             # Shared layout with sidebar
│   ├── custom-components/     # Component library home
│   ├── navbar-demo/           # Navbar demo
│   └── theme-switcher-demo/   # Theme demo

hooks/
├── use-theme-config.ts        # Theme management hook
└── use-mobile.ts              # Mobile detection hook

lib/
├── themes.ts                  # Theme configuration
└── utils.ts                   # Utility functions (cn, etc.)
```

## Component Development Guidelines

### 1. Creating New Components

#### File Location
- **Custom components**: `components/[name].tsx`
- **UI primitives**: `components/ui/[name].tsx` (shadcn)
- **Examples**: `components/[name]-examples.tsx`

#### Component Template
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface YourComponentProps {
  /**
   * Description of prop
   */
  prop1?: string;
  className?: string;
  children?: React.ReactNode;
}

export function YourComponent({
  prop1,
  className,
  children,
}: YourComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

#### Key Principles
- ✅ Use TypeScript with explicit interfaces
- ✅ Include JSDoc comments for props
- ✅ Export named functions (not default)
- ✅ Use `cn()` for className merging
- ✅ Support `className` prop for customization
- ✅ Use theme-aware CSS variables
- ✅ Mark as `"use client"` if using hooks/state

### 2. Adding Component Demos

#### Create Demo Page
Location: `app/(components)/[component-name]-demo/page.tsx`

```tsx
"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { YourComponent } from "@/components/your-component";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function YourComponentDemoPage() {
  return (
    <>
      {/* Navbar with appropriate title */}
      <Navbar
        logo={<YourIcon className="h-8 w-8 text-primary" />}
        title="Your Component Demo"
      />

      <div className="container py-12 space-y-12">
        {/* Title and description */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Your Component Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Description of the component
          </p>
        </div>

        {/* Examples */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example 1: Basic Usage</CardTitle>
              <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent>
              <YourComponent />
              <div className="mt-4">
                <code className="text-sm bg-muted p-3 rounded block">
                  {`<YourComponent />`}
                </code>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
```

### 3. Adding to Sidebar Navigation

Location: `components/sidebar.tsx`

Find the `menuItems` array and add:
```tsx
const menuItems: MenuItem[] = [
  // ... existing items
  {
    title: "Your Component",
    href: "/your-component-demo",
    icon: <YourIcon className="h-4 w-4" />,
    description: "Brief description",
  },
];
```

### 4. Adding to Component Library Home

Location: `app/(components)/custom-components/page.tsx`

Add a card in the component grid:
```tsx
<Link href="/your-component-demo" className="group">
  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
    <CardHeader>
      <div className="flex items-start justify-between">
        <YourIcon className="h-10 w-10 text-primary mb-3" />
        <Badge>Live</Badge>
      </div>
      <CardTitle className="group-hover:text-primary transition-colors">
        Your Component
      </CardTitle>
      <CardDescription>
        Description of what it does
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Feature 1
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Feature 2
          </Badge>
        </div>
        <Button variant="outline" className="w-full">
          View Demo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
</Link>
```

## Styling Guidelines

### CSS Variables to Use
```css
/* Colors */
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--accent, --accent-foreground
--muted, --muted-foreground
--destructive, --destructive-foreground
--border, --input, --ring

/* Effects */
--radius (border radius)

/* Usage in Tailwind */
```

```tsx
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="border-border hover:bg-accent"
className="text-muted-foreground"
```

### Responsive Design
```tsx
// Mobile first approach
className="flex-col md:flex-row"
className="hidden md:flex"
className="w-full md:w-64"
className="text-sm md:text-base"
className="p-4 md:p-6"
```

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns
```tsx
// Button with icon
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Click Me
</Button>

// Card structure
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Conditional classes with cn()
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

## Navigation Structure

### Page Types

#### 1. Landing Page (`/`)
- No sidebar
- Full width
- Hero section + features
- Links to component library

#### 2. Component Library (`/custom-components`)
- Has sidebar
- Overview of all components
- Cards linking to demos

#### 3. Component Demos (`/[component]-demo`)
- Has sidebar
- Live examples
- Code snippets
- Documentation

### Route Groups
- Use `(components)` route group for demo pages
- Automatically includes sidebar via layout
- URL structure: `/demo-name` (no `/components/` prefix)

## Documentation Requirements

### Component Documentation File
Create `[COMPONENT]_GUIDE.md` in project root:

```markdown
# Component Name Guide

## Overview
Brief description

## Features
- Feature 1
- Feature 2

## Installation
Already included in boilerplate

## Usage
\`\`\`tsx
import { Component } from "@/components/component";

<Component prop="value" />
\`\`\`

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | undefined | Description |

## Examples
[Include 3-5 examples]

## Styling
[Customization guide]

## Accessibility
[A11y considerations]
```

### Quick Start File (Optional)
Create `[COMPONENT]_QUICKSTART.md` for simple components.

## Testing Components

### Visual Testing
1. Test in `/component-demo` page
2. Test all variants/states
3. Test both light and dark modes
4. Test all themes (at least 5 different)
5. Test mobile responsiveness

### Checklist
- [ ] Light mode
- [ ] Dark mode
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Hover states
- [ ] Focus states
- [ ] Active states
- [ ] Disabled states
- [ ] Loading states
- [ ] Error states
- [ ] Keyboard navigation
- [ ] Screen reader (ARIA labels)

## Common Component Patterns

### 1. Navigation Component
```tsx
// Sticky header with backdrop blur
className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"

// Container with max width
className="container flex h-16 items-center"
```

### 2. Sidebar Component
```tsx
// Fixed sidebar
className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r"

// Collapsible width
className={cn(
  "transition-all duration-300",
  isCollapsed ? "w-16" : "w-64"
)}
```

### 3. Modal/Dialog
```tsx
// Use shadcn Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Responsive width
<DialogContent className="w-[95vw] max-w-[600px]">
```

### 4. Form Component
```tsx
// Form with proper spacing
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Label</Label>
    <Input id="field" />
  </div>
</form>
```

## Hook Usage

### Theme Hook
```tsx
import { useThemeConfig } from "@/hooks/use-theme-config";

function MyComponent() {
  const {
    themes,          // All themes
    customTheme,     // Current theme
    setCustomTheme,  // Change theme
    isDark,          // Dark mode status
    toggleMode,      // Toggle dark/light
  } = useThemeConfig();
}
```

### Mobile Hook
```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function MyComponent() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## State Management

### Local State (useState)
```tsx
const [value, setValue] = React.useState("");
```

### Client Storage (localStorage)
```tsx
// Only in useEffect (client-side)
React.useEffect(() => {
  const saved = localStorage.getItem("key");
  if (saved) setValue(saved);
}, []);

React.useEffect(() => {
  localStorage.setItem("key", value);
}, [value]);
```

### Context (for shared state)
```tsx
// Create context
const MyContext = React.createContext<ContextType | null>(null);

// Provider
export function MyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState();
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// Hook
export function useMyContext() {
  const context = React.useContext(MyContext);
  if (!context) throw new Error("useMyContext must be used within MyProvider");
  return context;
}
```

## Performance Best Practices

### 1. Memoization
```tsx
// Expensive computations
const value = React.useMemo(() => {
  return expensiveComputation(data);
}, [data]);

// Callback functions
const handleClick = React.useCallback(() => {
  doSomething(value);
}, [value]);
```

### 2. Lazy Loading
```tsx
// Dynamic imports
const HeavyComponent = React.lazy(() => import("@/components/heavy-component"));

<React.Suspense fallback={<Spinner />}>
  <HeavyComponent />
</React.Suspense>
```

### 3. Code Splitting
```tsx
// Next.js dynamic import
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("@/components/dynamic"),
  { loading: () => <Spinner /> }
);
```

## Accessibility Guidelines

### ARIA Labels
```tsx
<button aria-label="Close menu">
  <X className="h-4 w-4" />
</button>
```

### Keyboard Navigation
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
/>
```

### Focus Management
```tsx
// Auto-focus
<Input autoFocus />

// Focus trap in modals
import { Dialog } from "@/components/ui/dialog"; // Handles this automatically
```

### Screen Reader Text
```tsx
<span className="sr-only">Descriptive text for screen readers</span>
```

## Error Handling

### Component Error Boundary
```tsx
"use client";

import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### Try-Catch in Functions
```tsx
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
```

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `theme-switcher.tsx`)
- **Component names**: `PascalCase` (e.g., `ThemeSwitcher`)
- **Hooks**: `use-feature.ts` (e.g., `use-theme-config.ts`)
- **Utils**: `kebab-case.ts` (e.g., `format-date.ts`)
- **Types**: `types.ts` or inline in component file
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_WIDTH`)

## Import Organization

```tsx
// 1. React/Next
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

// 2. External libraries
import { useTheme } from "next-themes";

// 3. Internal components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Hooks
import { useThemeConfig } from "@/hooks/use-theme-config";

// 5. Utils
import { cn } from "@/lib/utils";

// 6. Types
import type { Theme } from "@/lib/themes";

// 7. Icons (last)
import { Menu, X, ChevronDown } from "lucide-react";
```

## Quick Reference Commands

```bash
# Run dev server
pnpm dev

# Add shadcn component
pnpm dlx shadcn@latest add [component-name]

# Build
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Summary Checklist for New Components

- [ ] Create component file in `components/`
- [ ] Add TypeScript interface for props
- [ ] Include JSDoc comments
- [ ] Use theme CSS variables
- [ ] Make responsive (mobile-first)
- [ ] Support dark mode
- [ ] Add `className` prop support
- [ ] Create demo page in `app/(components)/`
- [ ] Add to sidebar navigation
- [ ] Add to component library home
- [ ] Create documentation file
- [ ] Test all themes
- [ ] Test light/dark modes
- [ ] Test responsive breakpoints
- [ ] Check accessibility
- [ ] Add usage examples

---

**For more details, see:**
- `COMPONENT_LIBRARY.md` - Component reference
- `NAVIGATION_STRUCTURE.md` - Navigation system
- `NAVBAR_GUIDE.md` - Navbar example
- `components/` - Existing components for reference

