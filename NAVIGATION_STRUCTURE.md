# Navigation Structure

This document explains the navigation structure of the application, including the sidebar menu and page organization.

## 📁 Page Structure

```
/                           → Main landing page
├── /custom-components      → Component library home (with sidebar)
├── /navbar-demo           → Navbar demo page (with sidebar)
└── /theme-switcher-demo   → Theme switcher demo (with sidebar)
```

## 🏠 Main Pages

### `/` - Landing Page
The main homepage that welcomes users and provides overview of the boilerplate.

**Features:**
- Hero section with call-to-actions
- Feature highlights
- Quick links to component demos
- Technology stack showcase

**Layout:** Standard layout without sidebar

### `/custom-components` - Component Library Home
Central hub for all custom components with a beautiful overview.

**Features:**
- List of all available components
- Component descriptions and features
- Quick links to component demos
- Documentation references

**Layout:** Uses sidebar navigation

### `/navbar-demo` - Navbar Component Demo
Interactive demonstration of the Navbar component.

**Features:**
- 5 different navbar variations
- Live code examples
- Usage documentation
- Props reference

**Layout:** Uses sidebar navigation

### `/theme-switcher-demo` - Theme Switcher Demo
Comprehensive showcase of the theme system with 50+ themes.

**Features:**
- All UI components styled with current theme
- Cards, buttons, badges, alerts examples
- Color palette preview
- Theme features showcase

**Layout:** Uses sidebar navigation

## 🎨 Sidebar Navigation

The sidebar appears on all component-related pages (routes under `/custom-components`, `/navbar-demo`, `/theme-switcher-demo`).

### Features:
- ✅ Collapsible (expand/collapse on desktop)
- ✅ Mobile responsive with hamburger menu
- ✅ Active page highlighting
- ✅ Automatic menu items from component list
- ✅ "Coming Soon" section for future components

### Menu Items:

1. **Components Home** (`/custom-components`)
   - Overview of all components
   - Central navigation hub

2. **Navbar** (`/navbar-demo`)
   - Navbar component demo and docs

3. **Theme Switcher** (`/theme-switcher-demo`)
   - Theme system showcase

### Adding New Components to Sidebar

To add a new component to the sidebar menu:

1. Open `components/sidebar.tsx`
2. Add a new menu item to the `menuItems` array:

```tsx
{
  title: "Your Component",
  href: "/your-component-demo",
  icon: <YourIcon className="h-4 w-4" />,
  description: "Brief description",
}
```

3. Create your component page under `app/(components)/your-component-demo/page.tsx`
4. The sidebar will automatically display and highlight your new component!

## 🧭 Navigation Components

### Navbar Component
Located in: `components/navbar.tsx`

Used on all pages for top navigation. Features:
- Logo/title on the left
- Optional center navigation links
- Theme switcher on the right (automatic)

**Usage on main page:**
```tsx
<Navbar
  logo={<Rocket className="h-8 w-8 text-primary" />}
  title="Next.js Boilerplate"
>
  <NavLink href="/" active>Home</NavLink>
  <NavLink href="/custom-components">Components</NavLink>
</Navbar>
```

**Usage on component pages:**
```tsx
<Navbar
  logo={<Component className="h-8 w-8 text-primary" />}
  title="Custom Components"
/>
```

### Sidebar Component
Located in: `components/sidebar.tsx`

Provides left-side navigation for component pages.

**Features:**
- Collapsible on desktop
- Hamburger menu on mobile
- Active state highlighting
- Smooth transitions
- Back to main site link

**Layout Integration:**
The sidebar is automatically included via the layout file at `app/(components)/layout.tsx`. Any page created under the `(components)` route group will have the sidebar.

## 🎯 Route Groups

### `(components)` Route Group
All component demo pages are organized under the `(components)` route group.

**Location:** `app/(components)/`

**Purpose:**
- Share common layout with sidebar
- Organize component-related pages
- Keep URL structure clean (route group doesn't appear in URL)

**Current pages:**
- `custom-components/page.tsx`
- `navbar-demo/page.tsx`
- `theme-switcher-demo/page.tsx`

## 📱 Responsive Behavior

### Desktop (≥ 768px)
- Sidebar visible, collapsible
- Full navbar with center navigation
- Content adjusts for sidebar width

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger menu button appears (top-left)
- Overlay when sidebar opens
- Full-width content

## 🔗 Navigation Flow

### User Journey:

1. **Landing Page** (`/`)
   - User sees overview and features
   - CTA buttons lead to component library or theme demo

2. **Component Library** (`/custom-components`)
   - Central hub with all components listed
   - Sidebar appears for easy navigation
   - Cards link to individual demos

3. **Component Demos** (e.g., `/navbar-demo`)
   - Full demo with examples
   - Sidebar for switching between components
   - Back button to component library

### Quick Access:
- Footer on landing page has quick links to all major sections
- Navbar top navigation available on all pages
- Sidebar "Back to Main Site" link on component pages

## 💡 Best Practices

### Adding New Pages

1. **Component Demo Pages:**
   - Create under `app/(components)/your-page/`
   - Add to sidebar menu items
   - Use Navbar component at top
   - Content automatically has sidebar

2. **Non-Component Pages:**
   - Create directly under `app/`
   - No sidebar (unless you want it)
   - Add to main navbar if needed

### Navigation Consistency

- Always use `Navbar` component for top navigation
- Keep logo/title consistent within sections
- Use `NavLink` for navigation items
- Maintain active state for current page

## 🎨 Styling

### Navbar
- Sticky at top (z-50)
- Backdrop blur effect
- Border bottom
- Height: 64px (h-16)

### Sidebar
- Fixed position
- Full height minus navbar
- Left-aligned
- Width: 256px expanded, 64px collapsed
- Z-index: 40 (below navbar)

### Content Area
- Auto-margin for sidebar (md:ml-64)
- Transitions when sidebar collapses
- Full width on mobile

## 📚 Related Documentation

- `NAVBAR_GUIDE.md` - Complete navbar documentation
- `NAVBAR_QUICKSTART.md` - Quick start for navbar
- `THEME_SWITCHER.md` - Theme system documentation
- `README.md` - Main project documentation

## 🔄 Future Enhancements

The navigation system is designed to grow with your component library:

1. Add new menu items easily
2. Categorize components into groups
3. Add search functionality to sidebar
4. Breadcrumb navigation
5. Keyboard shortcuts for navigation

The "Coming Soon" section in the sidebar will automatically fill as you add more components!

