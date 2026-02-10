# AI Instructions: Theme System

## Overview
This Next.js project uses a **dynamic CSS loading** system for 50+ themes with light/dark mode support.

## Theme Architecture

### File Locations
```
public/themes/          # Theme CSS files (*.css)
lib/themes.ts           # Theme registry
components/
  ├── providers/theme-provider.tsx    # Context + CSS loader
  └── advanced-theme-switcher.tsx     # UI component
hooks/use-theme-config.ts             # Unified hook
```

### How It Works
1. Theme CSS files stored in `public/themes/`
2. Only ONE theme CSS loaded at a time via `<link>` tag
3. Dark/light mode via CSS `.dark` class
4. Persistence via localStorage
5. No bundle bloat (each theme ~7KB)

## Adding New Themes

### Step 1: Create CSS File
Location: `public/themes/your-theme-name.css`

**Required CSS Variables:**
```css
:root {
  /* Core colors (REQUIRED) */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  
  /* Brand colors (REQUIRED) */
  --primary: oklch(0.5 0.2 250);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.96 0.01 250);
  --secondary-foreground: oklch(0.145 0 0);
  --muted: oklch(0.96 0.01 250);
  --muted-foreground: oklch(0.45 0.01 250);
  --accent: oklch(0.96 0.01 250);
  --accent-foreground: oklch(0.145 0 0);
  
  /* Semantic (REQUIRED) */
  --destructive: oklch(0.576 0.215 29.234);
  --destructive-foreground: oklch(0.985 0 0);
  
  /* UI elements (REQUIRED) */
  --border: oklch(0.92 0.01 250);
  --input: oklch(0.92 0.01 250);
  --ring: oklch(0.5 0.2 250);
  
  /* Charts (REQUIRED) */
  --chart-1: oklch(0.5 0.2 250);
  --chart-2: oklch(0.65 0.2 200);
  --chart-3: oklch(0.7 0.2 150);
  --chart-4: oklch(0.75 0.2 100);
  --chart-5: oklch(0.8 0.2 50);
  
  /* Sidebar (REQUIRED) */
  --sidebar: oklch(0.98 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.5 0.2 250);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.96 0.01 250);
  --sidebar-accent-foreground: oklch(0.145 0 0);
  --sidebar-border: oklch(0.92 0.01 250);
  --sidebar-ring: oklch(0.5 0.2 250);
  
  /* Effects (OPTIONAL) */
  --radius: 0.5rem;
}

/* Dark mode overrides (REQUIRED) */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... override all colors for dark mode */
}
```

**Color Format:**
- Use OKLCH format: `oklch(lightness chroma hue)`
- Lightness: 0-1 (0=black, 1=white)
- Chroma: 0-0.4 (saturation)
- Hue: 0-360 (color wheel)

**Example:**
```css
/* Blue: oklch(0.5 0.2 250) */
/* Red: oklch(0.5 0.2 30) */
/* Green: oklch(0.5 0.2 150) */
```

### Step 2: Register Theme
Location: `lib/themes.ts`

```typescript
export const themes: Theme[] = [
  // ... existing themes
  {
    name: "Your Theme Name",    // Display name
    value: "your-theme-name",   // Must match CSS filename (without .css)
    cssFile: "your-theme-name.css",
    colors: {
      primary: "#hexcolor",     // For preview swatch
      accent: "#hexcolor",
      secondary: "#hexcolor",
      muted: "#hexcolor",
    }
  },
];
```

### Step 3: Extract Colors (Optional)
Run the color extraction script to auto-generate color swatches:
```bash
node scripts/extract-theme-colors.mjs
```

This updates `scripts/theme-colors.json` and `lib/themes.ts` with color previews.

### Step 4: Update Theme List (for AI)
Location: `.cursor/rules/shadcn/0_THEME_LIST.md`

Add your theme to the list for AI reference.

## Using Themes in Code

### Get Current Theme
```tsx
import { useThemeConfig } from "@/hooks/use-theme-config";

function MyComponent() {
  const { customTheme, isDark } = useThemeConfig();
  return <div>Current: {customTheme}</div>;
}
```

### Change Theme
```tsx
const { setCustomTheme } = useThemeConfig();
setCustomTheme("cyberpunk");
```

### Toggle Dark Mode
```tsx
const { toggleMode } = useThemeConfig();
toggleMode();
```

### Get All Themes
```tsx
const { themes } = useThemeConfig();
themes.forEach(theme => console.log(theme.name));
```

## Theme Guidelines

### DO ✅
- Test both light AND dark modes
- Use OKLCH color format
- Keep CSS file under 10KB
- Provide all required CSS variables
- Use semantic color names
- Test with all UI components
- Ensure sufficient contrast (WCAG AA)

### DON'T ❌
- Use HEX/RGB in CSS (use OKLCH)
- Skip dark mode variants
- Hardcode colors in components
- Import theme CSS in components
- Modify globals.css for themes
- Use overly bright/saturated colors
- Forget to test accessibility

## Color Extraction Script

### When to Run
- After creating new theme CSS
- After modifying theme colors
- To update color swatches

### How to Run
```bash
node scripts/extract-theme-colors.mjs
```

### What It Does
1. Reads all CSS files in `public/themes/`
2. Extracts primary, accent, secondary, muted colors
3. Converts OKLCH to HEX for preview swatches
4. Updates `lib/themes.ts` with color data

## Testing New Themes

### Test Pages
1. `/` - Landing page
2. `/custom-components` - Component library
3. `/theme-switcher-demo` - Full component showcase

### Components to Test
- Buttons (all variants)
- Cards
- Inputs
- Alerts
- Badges
- Navigation
- Sidebar
- Typography
- Charts

### Checklist
- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Text is readable (contrast check)
- [ ] Borders visible
- [ ] Hover states work
- [ ] Focus states visible
- [ ] No flickering on switch
- [ ] Colors match brand/style

## Common Issues

### Theme not appearing in selector
- Check CSS file exists in `public/themes/`
- Verify filename matches `value` in `lib/themes.ts`
- Ensure theme added to themes array
- Clear browser cache

### Colors not applying
- Check all required CSS variables defined
- Verify OKLCH format syntax
- Check for typos in variable names
- Inspect element to see actual values

### Dark mode broken
- Ensure `.dark` class defined in CSS
- Check all variables overridden in `.dark`
- Verify next-themes configured correctly
- Check `suppressHydrationWarning` on `<html>`

### Performance issues
- Keep CSS under 10KB
- Don't use @import in theme files
- Minimize complex selectors
- Use CSS variables, not hardcoded values

## Advanced Customization

### Custom Fonts Per Theme
```css
:root {
  --font-sans: "Your Font", system-ui, sans-serif;
  --font-mono: "Your Mono", monospace;
}
```

### Custom Shadows
```css
:root {
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1);
}
```

### Custom Border Radius
```css
:root {
  --radius: 0.75rem;  /* More rounded */
  --radius: 0.25rem;  /* Less rounded */
  --radius: 0;        /* No rounding */
}
```

## File Structure Reference

```
project/
├── public/themes/              # Theme CSS files
│   ├── default.css
│   ├── cyberpunk.css
│   └── [your-theme].css       # ← Add new themes here
├── lib/
│   └── themes.ts              # ← Register themes here
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx # Core theme system
│   └── advanced-theme-switcher.tsx
├── hooks/
│   └── use-theme-config.ts    # Hook to use themes
├── scripts/
│   ├── extract-theme-colors.mjs
│   └── theme-colors.json
└── .cursor/rules/
    ├── shadcn/0_THEME_LIST.md # ← Update for AI reference
    └── AI_THEME_INSTRUCTIONS.md # ← This file
```

## Quick Reference Commands

```bash
# Extract colors from themes
node scripts/extract-theme-colors.mjs

# Run dev server
pnpm dev

# Build for production
pnpm build

# Test build locally
pnpm start
```

## Color Conversion Tool

OKLCH to HEX converter online:
- https://oklch.com/

HEX to OKLCH:
```javascript
// Use the script in scripts/extract-theme-colors.mjs
```

## Best Practices Summary

1. **Always define both light and dark modes**
2. **Use OKLCH color format** for better perceptual uniformity
3. **Test with real content** not just sample text
4. **Check accessibility** contrast ratios
5. **Keep themes consistent** with design system
6. **Document custom themes** with comments in CSS
7. **Version control** theme files in git
8. **Test performance** CSS file size under 10KB

---

**For more details, see:**
- `THEME_SYSTEM_SUMMARY.md` - Complete overview
- `THEME_SWITCHER.md` - Implementation details
- `README_THEMES.md` - Theme documentation
- `lib/themes.ts` - Theme registry
- `public/themes/` - Example theme files

