# Component Library

A comprehensive guide to all custom components in this Next.js boilerplate.

## 🎯 Overview

This boilerplate includes a growing collection of custom-built, production-ready components. Each component is:

- ✅ **Fully TypeScript typed**
- ✅ **Documented with examples**
- ✅ **Responsive and accessible**
- ✅ **Theme-aware (works with 50+ themes)**
- ✅ **Easy to customize**

## 📦 Available Components

### 1. Navbar Component

**Location:** `components/navbar.tsx`

**Demo:** `/navbar-demo`

**Documentation:** `NAVBAR_GUIDE.md`, `NAVBAR_QUICKSTART.md`

A flexible navigation bar with logo support, navigation links, and integrated theme switcher.

**Key Features:**
- Flexible logo (icons, images, or custom components)
- Optional center navigation links
- Automatic theme switcher integration
- Sticky header with backdrop blur
- Fully responsive

**Quick Usage:**
```tsx
import { Navbar } from "@/components/navbar";

<Navbar 
  logo={<YourIcon className="h-8 w-8 text-primary" />}
  title="Your App"
/>
```

**Props:**
- `logo`: React.ReactNode | string - Logo component or image path
- `title`: string - App/company name
- `homeLink`: string - Home link URL (default: "/")
- `className`: string - Additional CSS classes
- `children`: React.ReactNode - Navigation items

---

### 2. Sidebar Component

**Location:** `components/sidebar.tsx`

**Used In:** All component demo pages

**Documentation:** `NAVIGATION_STRUCTURE.md`

A collapsible sidebar navigation for organizing component demos and documentation.

**Key Features:**
- Collapsible on desktop
- Mobile-responsive hamburger menu
- Active state highlighting
- Smooth animations
- Easy to extend with new items

**Quick Usage:**
```tsx
import { Sidebar } from "@/components/sidebar";

// Automatically included in (components) route group
// Or manually add:
<Sidebar />
```

**How to Add Menu Items:**
Edit `components/sidebar.tsx` and add to `menuItems` array:
```tsx
{
  title: "Your Component",
  href: "/your-component-demo",
  icon: <YourIcon className="h-4 w-4" />,
  description: "Brief description",
}
```

---

### 3. Advanced Theme Switcher

**Location:** `components/advanced-theme-switcher.tsx`

**Demo:** `/theme-switcher-demo`

**Documentation:** `THEME_SWITCHER.md`

A powerful theme selector with 50+ themes, search, categories, and color previews.

**Key Features:**
- 50+ professionally designed themes
- Light/dark mode toggle
- Search functionality
- Theme categories (Tech, Nature, Modern, Fun, etc.)
- Color palette previews
- Random theme button

**Quick Usage:**
```tsx
import { AdvancedThemeSwitcher } from "@/components/advanced-theme-switcher";

<AdvancedThemeSwitcher />
```

**Note:** Automatically included in the Navbar component!

---

### 4. NavLink Component

**Location:** `components/navbar.tsx` (exported)

**Used In:** Navbar navigation

Helper component for creating navigation links in the navbar.

**Quick Usage:**
```tsx
import { NavLink } from "@/components/navbar";

<NavLink href="/about" active>
  About
</NavLink>

// With icon
<NavLink href="/settings" className="flex items-center gap-2">
  <Settings className="h-4 w-4" />
  Settings
</NavLink>
```

**Props:**
- `href`: string - Link destination
- `children`: React.ReactNode - Link content
- `active`: boolean - Highlight as active
- `className`: string - Additional CSS classes

---

## 🎨 shadcn/ui Components

This boilerplate also includes all shadcn/ui components located in `components/ui/`:

### Layout
- `card.tsx` - Card container
- `separator.tsx` - Divider line
- `scroll-area.tsx` - Scrollable container
- `sidebar.tsx` - Sidebar primitives

### Forms
- `input.tsx` - Text input
- `button.tsx` - Button
- `checkbox.tsx` - Checkbox
- `radio-group.tsx` - Radio buttons
- `select.tsx` - Select dropdown
- `slider.tsx` - Range slider
- `switch.tsx` - Toggle switch
- `textarea.tsx` - Text area
- `label.tsx` - Form label
- `form.tsx` - Form wrapper

### Feedback
- `alert.tsx` - Alert messages
- `alert-dialog.tsx` - Alert modal
- `dialog.tsx` - Modal dialog
- `drawer.tsx` - Slide-out drawer
- `toast.tsx` / `sonner.tsx` - Toast notifications
- `progress.tsx` - Progress bar
- `spinner.tsx` - Loading spinner
- `skeleton.tsx` - Loading skeleton

### Navigation
- `navigation-menu.tsx` - Complex navigation
- `menubar.tsx` - Menu bar
- `dropdown-menu.tsx` - Dropdown menu
- `context-menu.tsx` - Right-click menu
- `tabs.tsx` - Tab navigation
- `breadcrumb.tsx` - Breadcrumb trail
- `pagination.tsx` - Pagination

### Display
- `badge.tsx` - Label/tag badge
- `avatar.tsx` - User avatar
- `tooltip.tsx` - Hover tooltip
- `hover-card.tsx` - Hover card
- `popover.tsx` - Popover container
- `table.tsx` - Data table
- `accordion.tsx` - Collapsible sections
- `collapsible.tsx` - Collapsible content

### Data Entry
- `calendar.tsx` - Date picker
- `command.tsx` - Command palette
- `input-otp.tsx` - OTP input

### Other
- `sheet.tsx` - Slide-out sheet
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Toggle group
- `aspect-ratio.tsx` - Aspect ratio container
- `resizable.tsx` - Resizable panels
- `carousel.tsx` - Image carousel
- `chart.tsx` - Chart components

## 🚀 Using Components

### Basic Import

```tsx
// Custom components
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { AdvancedThemeSwitcher } from "@/components/advanced-theme-switcher";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

### With TypeScript

All components are fully typed:

```tsx
import type { NavbarProps } from "@/components/navbar";

const props: NavbarProps = {
  logo: <MyLogo />,
  title: "My App",
  homeLink: "/dashboard",
};

<Navbar {...props} />
```

## 📖 Documentation Structure

Each custom component has:

1. **Component File** - The actual component code
2. **Demo Page** - Live examples and usage
3. **Documentation** - Detailed guide (if complex)
4. **Examples File** - Multiple usage examples

### Documentation Files:
- `NAVBAR_GUIDE.md` - Complete navbar docs
- `NAVBAR_QUICKSTART.md` - Quick start guide
- `THEME_SWITCHER.md` - Theme system docs
- `NAVIGATION_STRUCTURE.md` - Navigation structure
- `COMPONENT_LIBRARY.md` - This file

## 🎯 Best Practices

### 1. Component Organization

```
components/
├── navbar.tsx              # Custom components
├── sidebar.tsx
├── advanced-theme-switcher.tsx
├── navbar-examples.tsx     # Example files
├── providers/              # Context providers
│   └── theme-provider.tsx
└── ui/                     # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

### 2. Naming Conventions

- **Components**: PascalCase (`Navbar`, `ThemeSwitcher`)
- **Files**: kebab-case (`navbar.tsx`, `theme-switcher.tsx`)
- **Props**: Descriptive, typed interfaces
- **Examples**: Component name + "Examples" (`navbar-examples.tsx`)

### 3. Documentation

When creating new components:

1. Add TypeScript interfaces for props
2. Include JSDoc comments
3. Create a demo page under `app/(components)/`
4. Add to sidebar menu
5. Write usage examples
6. Document edge cases

### 4. Styling

- Use Tailwind CSS utilities
- Leverage CSS variables from themes
- Use `cn()` helper for conditional classes
- Follow shadcn/ui patterns
- Ensure dark mode compatibility

### 5. Accessibility

- Use semantic HTML
- Include ARIA labels
- Support keyboard navigation
- Test with screen readers
- Maintain focus management

## 🔄 Adding New Components

### Step-by-Step Guide:

1. **Create Component**
   ```tsx
   // components/your-component.tsx
   export function YourComponent() {
     return <div>Your component</div>;
   }
   ```

2. **Create Demo Page**
   ```tsx
   // app/(components)/your-component-demo/page.tsx
   export default function YourComponentDemo() {
     return (
       <>
         <Navbar title="Your Component Demo" />
         {/* Demo content */}
       </>
     );
   }
   ```

3. **Add to Sidebar**
   ```tsx
   // In components/sidebar.tsx menuItems array:
   {
     title: "Your Component",
     href: "/your-component-demo",
     icon: <YourIcon className="h-4 w-4" />,
     description: "Brief description",
   }
   ```

4. **Update Component Library Page**
   ```tsx
   // Add card in app/(components)/custom-components/page.tsx
   ```

5. **Write Documentation**
   - Create `YOUR_COMPONENT_GUIDE.md`
   - Document props, usage, examples

6. **Create Examples** (optional)
   - Create `components/your-component-examples.tsx`

## 🎨 Theme Integration

All components automatically work with the theme system:

```tsx
// Use CSS variables
className="bg-background text-foreground"
className="border-border hover:bg-accent"

// Use theme-aware colors
className="text-primary bg-primary/10"
className="text-muted-foreground"
```

### Available CSS Variables:
- `--background` / `--foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`
- `--muted` / `--muted-foreground`
- `--destructive` / `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--radius` (border radius)

## 📱 Responsive Design

All components follow mobile-first approach:

```tsx
// Mobile first, then larger screens
className="flex-col md:flex-row"
className="hidden md:flex"
className="w-full md:w-64"
```

### Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎯 Quick Reference

### Import Paths
```tsx
import { Component } from "@/components/component-name";
import { UIComponent } from "@/components/ui/component-name";
import { useHook } from "@/hooks/hook-name";
import { utility } from "@/lib/utility-name";
```

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

// Responsive grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Items */}
</div>
```

## 📚 Next Steps

1. Explore `/custom-components` for component overview
2. Visit individual demo pages to see components in action
3. Read component-specific documentation
4. Start building your own components!

## 🤝 Contributing

When adding components:
- Follow existing patterns
- Maintain TypeScript types
- Write documentation
- Create demo pages
- Test responsiveness
- Ensure accessibility

---

**Ready to build?** Visit `/custom-components` to start exploring! 🚀

