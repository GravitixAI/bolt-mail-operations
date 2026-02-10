# Troubleshooting Guide - Theme Switcher

## Common Issues and Solutions

### Issue: Styling Appears Broken After Theme Switch

**Symptoms:**
- Page content shifted to the left
- Dropdown menus appearing behind page content
- Only a couple colors showing instead of full palette
- Black buttons on black background
- Fonts not updating

**Root Cause:**
The theme CSS files contain their own `@theme inline` blocks that conflict with the base `globals.css` file, causing CSS specificity issues and duplicate definitions.

**Solution:**
✅ **Already Fixed!** The `globals.css` has been updated to remove conflicting theme definitions. The theme CSS files in `public/themes/` now have full control.

**What Was Changed:**
1. Removed `:root` and `.dark` theme variable definitions from `globals.css`
2. Removed duplicate `@theme inline` block from `globals.css`
3. Added proper CSS loading and reflow handling in ThemeProvider
4. Added z-index management for dropdowns

---

### Issue: Theme CSS Not Loading

**Symptoms:**
- Theme doesn't change when selected
- Colors remain the same
- Console shows 404 errors for CSS files

**Solutions:**

1. **Check file exists:**
   ```bash
   # Verify theme CSS file is present
   ls public/themes/your-theme.css
   ```

2. **Check configuration:**
   ```typescript
   // In lib/themes.ts
   { name: "My Theme", value: "my-theme", cssFile: "my-theme.css" }
   //                                              ^ Must match filename
   ```

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or open DevTools → Network tab → Disable cache

4. **Check dev server:**
   - Restart your dev server
   - Verify it's running on correct port

---

### Issue: Dropdown Menu Behind Page Content

**Symptoms:**
- Theme selector dropdown appears below other elements
- Can't click on theme options

**Solution:**
Ensure proper z-index stacking context:

```tsx
// In your header/nav component
<header className="sticky top-0 z-50">
  <div className="container relative z-50">
    <ThemeSwitcher />
  </div>
</header>
```

**Already Fixed** in the demo page!

---

### Issue: Fonts Not Updating

**Symptoms:**
- Colors change but fonts remain the same
- Custom theme fonts don't apply

**Root Cause:**
Font variables in theme CSS need to override the default font variables from Next.js (Geist).

**Solution:**
The theme CSS files use standard font stacks that work correctly. If you want to use custom fonts:

1. **Google Fonts approach:**
```tsx
// In your layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-custom-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-custom-mono" });

// Add to body className
<body className={`${inter.variable} ${robotoMono.variable}`}>
```

2. **Update theme CSS:**
```css
:root {
  --font-sans: var(--font-custom-sans), ui-sans-serif, system-ui;
  /* ... other variables */
}
```

---

### Issue: Colors Not Showing Correctly

**Symptoms:**
- Only 2-3 colors visible instead of full theme palette
- Some elements have no background
- Text invisible on background

**Root Cause:**
CSS variables not being mapped correctly to Tailwind utilities.

**Solution:**
Ensure each theme CSS file has complete `@theme inline` block:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-muted: var(--muted);
  --color-card: var(--card);
  --color-popover: var(--popover);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  /* ... all required mappings */
}
```

**All theme CSS files already have this!**

---

### Issue: Page Content Shifted Left

**Symptoms:**
- Content not centered
- Uneven margins
- Layout broken

**Solutions:**

1. **Check container usage:**
```tsx
// Ensure you're using Tailwind's container
<div className="container mx-auto">
  {/* content */}
</div>
```

2. **Verify no conflicting styles:**
```css
/* Remove any hardcoded widths that conflict */
body {
  width: 100%; /* Remove this if present */
}
```

3. **Check for CSS import order:**
Theme CSS should load AFTER base styles to override properly.

---

### Issue: Dark Mode Not Working

**Symptoms:**
- Theme changes but dark/light mode toggle has no effect
- Always stays in one mode

**Solutions:**

1. **Check `next-themes` setup:**
```tsx
// ThemeProvider should wrap your app
<NextThemesProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
```

2. **Verify theme CSS has `.dark` selectors:**
```css
:root {
  /* Light mode */
}

.dark {
  /* Dark mode overrides */
}
```

3. **Check HTML attribute:**
Open DevTools and verify `<html class="dark">` or `<html class="light">` is present.

---

### Issue: Hydration Errors

**Symptoms:**
- Console warnings about hydration mismatch
- Content flashes or changes after load

**Solution:**
Add `suppressHydrationWarning` to `<html>`:

```tsx
<html lang="en" suppressHydrationWarning>
```

**Already added!**

---

### Issue: Theme Persists Across Refreshes Unexpectedly

**Symptoms:**
- Can't reset to default theme
- Theme "stuck" on a specific one

**Solutions:**

1. **Clear localStorage:**
```javascript
// In browser console
localStorage.removeItem('custom-theme');
localStorage.removeItem('theme');
```

2. **Or programmatically:**
```typescript
const { setCustomTheme } = useThemeConfig();
setCustomTheme('default');
```

---

### Issue: Slow Theme Switching

**Symptoms:**
- Delay when changing themes
- Page stutters during switch

**Solutions:**

1. **Check network tab:**
   - CSS files should be ~7KB
   - Should load in < 100ms
   - Verify they're being cached

2. **Optimize CSS loading:**
```typescript
// Already implemented in ThemeProvider
link.onload = () => {
  // Force repaint for instant visual update
  document.body.style.display = 'none';
  document.body.offsetHeight;
  document.body.style.display = '';
};
```

3. **Add preload for frequently used themes:**
```tsx
<link rel="preload" href="/themes/popular-theme.css" as="style" />
```

---

### Issue: Theme Not Loading on First Visit

**Symptoms:**
- First page load shows no theme
- Works after refresh

**Solution:**
Ensure default theme is set and loaded:

```typescript
// In ThemeProvider
React.useEffect(() => {
  setMounted(true);
  const savedTheme = localStorage.getItem("custom-theme");
  if (savedTheme && themes.find((t) => t.value === savedTheme)) {
    setCustomThemeState(savedTheme);
  } else {
    setCustomThemeState(DEFAULT_THEME); // Fallback to default
  }
}, []);
```

**Already implemented!**

---

## Debugging Tips

### 1. Check Theme CSS is Loading

Open DevTools → Network tab:
- Filter by CSS
- Switch themes
- Verify theme CSS files load (status 200)
- Check file size (~7KB per theme)

### 2. Inspect CSS Variables

Open DevTools → Elements tab → Select `<html>` or `:root`:
- Check Styles panel
- Look for `--background`, `--primary`, etc.
- Values should match your theme

### 3. Verify Theme Context

Add temporary logging:
```typescript
const { customTheme } = useThemeConfig();
console.log('Current theme:', customTheme);
```

### 4. Check z-index Hierarchy

DevTools → Elements → Computed:
- Select dropdown element
- Check z-index value
- Should be higher than content (typically 50+)

### 5. Test Without Dark Mode

Temporarily disable dark mode to isolate issues:
```typescript
<NextThemesProvider
  attribute="class"
  defaultTheme="light" // Force light mode
  enableSystem={false}
>
```

---

## Still Having Issues?

### Quick Fixes Checklist

- [ ] Clear browser cache and localStorage
- [ ] Restart dev server
- [ ] Check all theme CSS files exist in `public/themes/`
- [ ] Verify `globals.css` doesn't have conflicting theme definitions
- [ ] Ensure `suppressHydrationWarning` on `<html>` tag
- [ ] Check browser console for errors
- [ ] Try a different theme to isolate the issue
- [ ] Test in incognito/private window
- [ ] Verify Next.js version compatibility (16.0+)

### File Checklist

Ensure these key changes are in place:

**app/globals.css:**
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**No `:root` or `.dark` theme definitions should be in `globals.css`!**

---

## Getting More Help

If issues persist:

1. Check `IMPLEMENTATION_COMPLETE.md` for architecture overview
2. Review `VISUAL_GUIDE.md` for system diagrams
3. Compare your setup with demo `app/page.tsx`
4. Test with the default theme first
5. Try a fresh browser profile

---

## Common Mistakes to Avoid

❌ **Don't**: Import theme CSS directly in components
```tsx
import './themes/cyberpunk.css'; // Wrong!
```

✅ **Do**: Use the theme switcher or context
```tsx
const { setCustomTheme } = useThemeConfig();
setCustomTheme('cyberpunk');
```

---

❌ **Don't**: Modify loaded theme CSS with inline styles
```tsx
<div style={{ background: '#000' }}> // Overrides theme!
```

✅ **Do**: Use theme variables or Tailwind classes
```tsx
<div className="bg-background">
```

---

❌ **Don't**: Have theme variables in multiple places
```css
/* globals.css */
:root { --primary: red; } /* Conflicts! */
```

✅ **Do**: Let theme CSS files be the single source
```css
/* Only in public/themes/yourtheme.css */
:root { --primary: oklch(...); }
```

---

## Prevention Best Practices

1. **Always use Tailwind classes** for themed properties
2. **Don't hardcode colors** - use CSS variables
3. **Test both light and dark modes** when creating themes
4. **Keep `globals.css` minimal** - no theme-specific code
5. **Use the provided hooks** - don't access localStorage directly
6. **Preload default theme** for better initial load

---

## Success Indicators

Your theme system is working correctly when:

✅ Theme changes instantly (< 100ms)
✅ All colors update across the page
✅ Fonts change (if theme specifies custom fonts)
✅ Dark/light mode toggle works independently
✅ Preferences persist across page reloads
✅ No console errors or warnings
✅ Dropdowns appear above content
✅ Layout remains stable during switch
✅ Browser DevTools shows correct CSS variables

---

**Need more help?** Check the full documentation in [THEME_SWITCHER.md](./THEME_SWITCHER.md)

