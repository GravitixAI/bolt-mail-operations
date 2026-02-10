# Theme Switcher Implementation

## Overview

This implementation provides a robust theme switching system for Next.js with 50+ carefully crafted themes, each supporting both light and dark modes.

## Architecture

### Best Approach: Dynamic CSS Loading

The implementation uses **dynamic CSS loading** as the optimal approach for managing multiple themes. Here's why:

#### ✅ Advantages:

1. **Performance**: Only one theme CSS file is loaded at a time
2. **Scalability**: Easy to add new themes without increasing bundle size
3. **Flexibility**: Each theme can have completely different styling including fonts, shadows, and custom variables
4. **No Conflicts**: Themes don't interfere with each other
5. **Instant Switching**: Themes change instantly without page reload
6. **Persistence**: User preferences are saved to localStorage

#### How It Works:

1. Theme CSS files are stored in `public/themes/`
2. When a theme is selected, a `<link>` tag is dynamically injected into the document head
3. The previous theme's CSS is removed before loading the new one
4. Dark/light mode is handled separately via `next-themes` and CSS classes

## File Structure

```
├── app/
│   ├── layout.tsx           # Root layout with ThemeProvider
│   ├── page.tsx             # Demo page with sample components
│   └── globals.css          # Base styles
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx  # Main theme provider
│   ├── theme-switcher.tsx      # Theme switcher UI
│   └── ui/                     # shadcn/ui components
├── lib/
│   └── themes.ts               # Theme configuration
└── public/
    └── themes/                 # Theme CSS files (50+ themes)
```

## Components

### 1. Theme Configuration (`lib/themes.ts`)

Defines all available themes with their metadata:

```typescript
export interface Theme {
  name: string;      // Display name
  value: string;     // Internal identifier
  cssFile: string;   // CSS filename
}
```

### 2. Theme Provider (`components/providers/theme-provider.tsx`)

Manages theme state and CSS injection:

- Wraps `next-themes` for dark/light mode support
- Provides custom theme context
- Handles dynamic CSS loading
- Persists theme selection to localStorage

### 3. Theme Switcher (`components/theme-switcher.tsx`)

User interface for theme selection:

- Dropdown select for theme selection
- Toggle button for dark/light mode
- Icons and visual feedback
- Responsive design

### 4. Demo Page (`app/page.tsx`)

Comprehensive showcase featuring:

- Various shadcn/ui components
- Color palette preview
- Different component states
- Typography examples
- Interactive elements

## Usage

### Basic Implementation

1. **Import the ThemeProvider** in your root layout:

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

2. **Add the ThemeSwitcher** component anywhere in your app:

```tsx
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Header() {
  return (
    <header>
      <ThemeSwitcher />
    </header>
  );
}
```

### Using Theme Context

Access the current theme in any client component:

```tsx
"use client";

import { useCustomTheme } from "@/components/providers/theme-provider";

export function MyComponent() {
  const { customTheme, setCustomTheme } = useCustomTheme();
  
  return (
    <div>
      <p>Current theme: {customTheme}</p>
      <button onClick={() => setCustomTheme("cyberpunk")}>
        Switch to Cyberpunk
      </button>
    </div>
  );
}
```

### Using Dark/Light Mode

Access dark/light mode from `next-themes`:

```tsx
"use client";

import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Mode
    </button>
  );
}
```

## Adding New Themes

1. **Create the CSS file** in `public/themes/`:

```css
/* public/themes/my-theme.css */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.5 0.2 250);
  /* ... other variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode variables */
}
```

2. **Add theme to configuration** in `lib/themes.ts`:

```typescript
export const themes: Theme[] = [
  // ... existing themes
  { name: "My Theme", value: "my-theme", cssFile: "my-theme.css" },
];
```

That's it! The theme will automatically appear in the selector.

## CSS Variables

Each theme CSS file should define the following variables:

### Colors
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`

### Charts
- `--chart-1` through `--chart-5`

### Sidebar
- `--sidebar`, `--sidebar-foreground`
- `--sidebar-primary`, `--sidebar-primary-foreground`
- `--sidebar-accent`, `--sidebar-accent-foreground`
- `--sidebar-border`, `--sidebar-ring`

### Typography
- `--font-sans`, `--font-serif`, `--font-mono`

### Spacing & Effects
- `--radius` (border radius)
- `--shadow-*` (shadow definitions)
- `--spacing` (base spacing unit)

## Features

### ✨ 50+ Themes
Choose from military themes (USAF, USA, USCG, etc.), tech themes (Cyberpunk, Vercel, Claude), nature themes (Ocean Breeze, Northern Lights), and many more.

### 🌓 Light & Dark Modes
Every theme includes carefully crafted light and dark variants that maintain readability and visual hierarchy.

### ⚡ Performance
- Only loads one theme at a time
- No bundle bloat
- Instant theme switching
- Efficient CSS injection

### 💾 Persistence
- Theme preference saved to localStorage
- Survives page reloads
- Per-device customization

### 🎨 Full Customization
- Custom fonts per theme
- Unique shadows and effects
- Theme-specific styling
- Complete design control

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties (CSS Variables)
- Dynamic `<link>` tag injection
- localStorage

## Dependencies

- `next-themes`: Dark/light mode management
- `shadcn/ui`: Component library
- `lucide-react`: Icons
- `tailwindcss`: Utility classes

## Performance Considerations

1. **CSS Loading**: Themes load asynchronously to prevent blocking
2. **Caching**: Browser automatically caches theme CSS files
3. **Bundle Size**: Theme CSS files are not included in the JavaScript bundle
4. **Hydration**: Uses `suppressHydrationWarning` to prevent mismatches

## Troubleshooting

### Theme not applying
- Check that the CSS file exists in `public/themes/`
- Verify the filename matches in `lib/themes.ts`
- Clear browser cache

### Flash of unstyled content
- Ensure `suppressHydrationWarning` is on the `<html>` tag
- Theme loads after mount to prevent hydration mismatch

### Dark mode not working
- Verify `.dark` class selectors in theme CSS
- Check `next-themes` configuration in ThemeProvider

## Examples in Demo Page

The demo page (`app/page.tsx`) showcases:

1. **Header**: With theme switcher integration
2. **Hero Section**: Typography and badges
3. **Alerts**: Different alert variants
4. **Cards & Tabs**: Form inputs and layouts
5. **Buttons**: All button variants and sizes
6. **Badges**: Different badge styles
7. **Color Palette**: Visual preview of theme colors
8. **Features Grid**: Card layouts

## Credits

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Theme system inspired by modern design systems

