# Navbar Component Guide

A flexible and customizable navigation bar component with built-in theme switcher support.

## Features

- 🎨 **Integrated Theme Switcher** - Includes the AdvancedThemeSwitcher by default
- 🖼️ **Flexible Logo Support** - Use icons, images, or custom React components
- 🔗 **Navigation Links** - Optional center navigation with `NavLink` component
- 📱 **Responsive Design** - Sticky header with backdrop blur effect
- ⚡ **TypeScript Support** - Full type safety out of the box
- 🎯 **Customizable** - Easy to style and extend

## Basic Usage

### Simple Navbar

```tsx
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <div>
      <Navbar title="My Company" />
      {/* Your page content */}
    </div>
  );
}
```

### With Custom Icon Logo

```tsx
import { Navbar } from "@/components/navbar";
import { Palette } from "lucide-react";

export default function Page() {
  return (
    <Navbar
      logo={<Palette className="h-8 w-8 text-primary" />}
      title="Theme Switcher Demo"
    />
  );
}
```

### With Image Logo

```tsx
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <Navbar
      logo="/logo.png"
      title="Acme Corporation"
      homeLink="/"
    />
  );
}
```

## Advanced Usage

### With Navigation Links

```tsx
import { Navbar, NavLink } from "@/components/navbar";

export default function Page() {
  return (
    <Navbar title="My App">
      <NavLink href="/" active>Home</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/services">Services</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </Navbar>
  );
}
```

### With Icons in Navigation

```tsx
import { Navbar, NavLink } from "@/components/navbar";
import { Home, Settings, Mail } from "lucide-react";

export default function Page() {
  return (
    <Navbar title="Dashboard">
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
```

### Custom Logo Component

```tsx
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <Navbar
      logo={
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white font-bold">AC</span>
        </div>
      }
      title="Acme Corp"
    />
  );
}
```

## Component Props

### Navbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `React.ReactNode \| string` | Auto-generated initial | Logo to display. Can be a component, icon, or image path |
| `title` | `string` | `"My App"` | Company/app name to display |
| `homeLink` | `string` | `"/"` | URL for the logo/title link |
| `className` | `string` | `undefined` | Additional CSS classes for the navbar |
| `children` | `React.ReactNode` | `undefined` | Navigation items to display in center |

### NavLink Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | Required | Link destination |
| `children` | `React.ReactNode` | Required | Link content |
| `active` | `boolean` | `false` | Whether this link is currently active |
| `className` | `string` | `undefined` | Additional CSS classes |

## Logo Options

### 1. No Logo (Auto-generated Initial)

If no logo is provided, a default square with the first letter of your title is generated:

```tsx
<Navbar title="Acme" />
// Shows: [A] Acme
```

### 2. Icon Component

Use any icon from lucide-react or custom SVG:

```tsx
<Navbar
  logo={<Palette className="h-8 w-8 text-primary" />}
  title="My App"
/>
```

### 3. Image Path

Provide a path to an image file:

```tsx
<Navbar
  logo="/company-logo.png"
  title="Company Name"
/>
```

### 4. Custom Component

Create any custom React component:

```tsx
<Navbar
  logo={
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur"></div>
      <span className="relative text-white font-bold">LOGO</span>
    </div>
  }
  title="Custom Corp"
/>
```

## Styling

### Custom Navbar Styling

```tsx
<Navbar
  title="My App"
  className="border-b-2 shadow-lg bg-background/80"
/>
```

### Custom NavLink Styling

```tsx
<NavLink 
  href="/about" 
  className="font-bold text-lg underline-offset-4 hover:underline"
>
  About
</NavLink>
```

## Layout Integration

### In app/layout.tsx

For a navbar on all pages:

```tsx
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar title="My App" />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### In Individual Pages

For page-specific navbars:

```tsx
export default function Page() {
  return (
    <>
      <Navbar title="Specific Page" />
      <div className="container py-8">
        {/* Page content */}
      </div>
    </>
  );
}
```

## Theme Switcher

The navbar automatically includes the `AdvancedThemeSwitcher` component on the right side. This provides:

- 50+ theme options
- Light/dark mode toggle
- Search functionality
- Theme categories
- Color previews

No additional configuration needed - it works out of the box!

## Responsive Behavior

- **Desktop**: Shows all navigation links in the center
- **Mobile**: Navigation links are hidden (you may want to add a mobile menu)
- **Sticky Header**: Navbar stays at the top when scrolling
- **Backdrop Blur**: Semi-transparent background with blur effect

## Tips

1. **Logo Size**: Keep logos around `h-8 w-8` (32px) for consistency
2. **Navigation**: Limit to 4-6 main navigation items for best UX
3. **Active State**: Use the `active` prop to highlight the current page
4. **Icons**: Use lucide-react icons for consistency with the theme switcher
5. **Mobile**: Consider adding a hamburger menu for mobile navigation

## Examples

See `components/navbar-examples.tsx` for more complete examples.

## Related Components

- `AdvancedThemeSwitcher` - Theme selection dialog (automatically included)
- `NavLink` - Navigation link component
- `Button` - For additional actions in the navbar

