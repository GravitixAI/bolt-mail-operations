# Navbar Quick Start 🚀

Get started with the Navbar component in 30 seconds!

## ⚡ Instant Usage

```tsx
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <>
      <Navbar title="My App" />
      {/* Your content here */}
    </>
  );
}
```

That's it! You now have a navbar with:
- ✅ Your company name
- ✅ Auto-generated logo (first letter)
- ✅ Theme switcher with 50+ themes
- ✅ Sticky header with backdrop blur

## 🎨 Add Your Logo

### With an Icon

```tsx
import { Navbar } from "@/components/navbar";
import { Rocket } from "lucide-react";

<Navbar 
  logo={<Rocket className="h-8 w-8 text-primary" />}
  title="My App" 
/>
```

### With an Image

```tsx
<Navbar 
  logo="/logo.png"
  title="My Company" 
/>
```

## 🔗 Add Navigation Links

```tsx
import { Navbar, NavLink } from "@/components/navbar";

<Navbar title="My App">
  <NavLink href="/" active>Home</NavLink>
  <NavLink href="/about">About</NavLink>
  <NavLink href="/contact">Contact</NavLink>
</Navbar>
```

## 📱 View Demo

Visit `/navbar-demo` in your browser to see:
- 5 different navbar variations
- Live code examples
- Feature highlights

## 📖 Full Documentation

See `NAVBAR_GUIDE.md` for:
- Complete API reference
- Advanced examples
- Styling guide
- Best practices

## 🎯 What You Get

The Navbar component includes:

1. **Logo Area** (Left)
   - Custom icons, images, or components
   - Auto-generated initial fallback

2. **Navigation Links** (Center, optional)
   - Clean, accessible links
   - Active state support
   - Icon support

3. **Theme Switcher** (Right)
   - 50+ beautiful themes
   - Light/dark mode
   - Search & categories
   - Instant preview

## 🎨 Customization

```tsx
// Custom styling
<Navbar 
  title="My App"
  className="border-b-2 shadow-lg"
/>

// Custom home link
<Navbar 
  title="My App"
  homeLink="/dashboard"
/>

// Custom logo component
<Navbar
  logo={
    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
      <span className="text-white font-bold">A</span>
    </div>
  }
  title="Acme"
/>
```

## 💡 Tips

- Keep logo size around `h-8 w-8` (32px)
- Limit navigation to 4-6 items
- Use `active` prop for current page
- Theme switcher works automatically!

---

**Need help?** Check `NAVBAR_GUIDE.md` or view `/navbar-demo` 🚀

