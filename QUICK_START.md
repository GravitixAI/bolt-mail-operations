# Quick Start Guide - Theme Switcher

## 🚀 Getting Started

### Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the theme switcher in action!

## 🎨 Using the Theme Switcher

### 1. Select a Theme
Click the theme dropdown in the header and choose from 50+ available themes:
- **Military**: USAF, USA, USCG, USMC, USN, USSF
- **Tech**: Claude, Vercel, Twitter, Supabase, Cyberpunk
- **Nature**: Ocean Breeze, Northern Lights, Nature, Kodama Grove
- **Modern**: Modern Minimal, Clean Slate, Neo Brutalism
- **Fun**: Bubblegum, Candyland, Retro Arcade
- And 35+ more!

### 2. Toggle Light/Dark Mode
Click the sun/moon icon button next to the theme selector to switch between:
- ☀️ Light Mode
- 🌙 Dark Mode
- 💻 System (follows your OS preference)

## 📦 What's Included

### Files Created

```
lib/
├── themes.ts                       # Theme configuration (50+ themes)

components/
├── providers/
│   └── theme-provider.tsx          # Theme provider with context
├── theme-switcher.tsx              # Theme switcher UI component

app/
├── layout.tsx                      # Updated with ThemeProvider
├── page.tsx                        # Demo page with examples

public/
└── themes/                         # 50+ CSS theme files
```

## 🛠️ How It Works

### The System
1. **Dynamic CSS Loading**: Themes are loaded as separate CSS files
2. **Context API**: React Context provides theme state globally
3. **next-themes**: Handles dark/light mode switching
4. **localStorage**: Saves user preferences

### The Flow
```
User selects theme
    ↓
Context updates
    ↓
Old CSS removed from DOM
    ↓
New CSS injected into DOM
    ↓
Theme preference saved to localStorage
```

## 🎯 Key Features

✅ **50+ Themes** - Massive variety of styles
✅ **Light & Dark** - Every theme has both modes
✅ **Instant Switch** - No page reload needed
✅ **Persistent** - Remembers your choice
✅ **Performant** - Only loads one theme at a time
✅ **Type-Safe** - Full TypeScript support

## 💡 Common Use Cases

### In a Header Component
```tsx
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <Logo />
      <ThemeSwitcher />
    </header>
  );
}
```

### Custom Theme Selector
```tsx
"use client";

import { useCustomTheme } from "@/components/providers/theme-provider";
import { themes } from "@/lib/themes";

export function CustomThemeSelector() {
  const { customTheme, setCustomTheme } = useCustomTheme();
  
  return (
    <div>
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => setCustomTheme(theme.value)}
          className={customTheme === theme.value ? "active" : ""}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}
```

### Custom Dark Mode Toggle
```tsx
"use client";

import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

## 🎨 Customizing Themes

### Adding Your Own Theme

1. **Create CSS file** at `public/themes/my-theme.css`:
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
  --primary: oklch(0.5 0.3 200);
  /* Add all required variables */
}

.dark {
  --background: oklch(0.15 0 0);
  --foreground: oklch(0.95 0 0);
  /* Dark mode overrides */
}
```

2. **Register in** `lib/themes.ts`:
```typescript
export const themes: Theme[] = [
  // ... existing themes
  { 
    name: "My Custom Theme", 
    value: "my-theme", 
    cssFile: "my-theme.css" 
  },
];
```

3. **Done!** Your theme appears in the selector automatically.

## 🧪 Testing Themes

The demo page includes:
- Typography samples
- All button variants
- Form components
- Card layouts
- Alert components
- Badge variants
- Color palette preview
- Interactive elements

Perfect for testing how your theme looks across all components!

## 📱 Responsive Design

The theme switcher is fully responsive:
- **Mobile**: Stacked layout with full-width selectors
- **Tablet**: Side-by-side controls
- **Desktop**: Compact inline controls

## 🔧 Configuration

### Change Default Theme

In `lib/themes.ts`:
```typescript
export const DEFAULT_THEME = "cyberpunk"; // or any theme value
```

### Disable System Theme

In `components/providers/theme-provider.tsx`:
```typescript
<NextThemesProvider
  attribute="class"
  defaultTheme="light"  // Change from "system"
  enableSystem={false}   // Disable system detection
  disableTransitionOnChange
>
```

## 🐛 Troubleshooting

**Theme not changing?**
- Check browser console for errors
- Verify CSS file exists in `public/themes/`
- Clear browser cache and reload

**Dark mode not working?**
- Ensure your theme CSS has `.dark` class definitions
- Check that `suppressHydrationWarning` is on `<html>` tag

**Styles not persisting?**
- Check localStorage is enabled
- Open DevTools → Application → Local Storage
- Look for `custom-theme` and `theme` keys

## 📚 Resources

- [Full Documentation](./THEME_SWITCHER.md)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## 🎉 Enjoy!

You now have a powerful, flexible theme system. Experiment with different themes and see which one fits your project best!

**Pro Tip**: Try the "Cyberpunk" theme in dark mode – it's incredible! 🚀

