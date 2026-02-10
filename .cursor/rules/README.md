# AI Rules and Instructions

This directory contains comprehensive instructions for AI assistants working on this Next.js project.

## 📁 Directory Structure

```
.cursor/rules/
├── README.md                          # This file
├── REQUIREMENTS AND INSTRUCTIONS.md   # Main project rules
├── AI_THEME_INSTRUCTIONS.md          # Theme system guide
├── AI_COMPONENT_INSTRUCTIONS.md      # Component development guide
└── shadcn/
    ├── 0_THEME_LIST.md               # List of all themes
    └── *.css                          # Theme CSS files (reference)
```

## 📚 Documentation Files

### 1. REQUIREMENTS AND INSTRUCTIONS.md
**Main project rules and setup instructions**

Contains:
- Node.js, pnpm, Next.js requirements
- Project setup steps
- Database configuration
- Git workflow
- Response format guidelines
- Links to theme and component instructions

**When to read:** Start of any task, project setup

---

### 2. AI_THEME_INSTRUCTIONS.md
**Complete guide for working with the theme system**

Contains:
- Theme architecture overview
- How to add new themes (step-by-step)
- CSS variable reference (REQUIRED variables)
- OKLCH color format guide
- Theme registration process
- Color extraction script usage
- Testing guidelines
- Common issues and solutions

**When to read:**
- Adding new themes
- Modifying existing themes
- Troubleshooting theme issues
- Understanding color system

**Key sections:**
- Adding New Themes (Step 1-4)
- Required CSS Variables
- Using Themes in Code
- Theme Guidelines (DO/DON'T)

---

### 3. AI_COMPONENT_INSTRUCTIONS.md
**Complete guide for building custom components**

Contains:
- Project structure overview
- Component development guidelines
- Creating demo pages
- Adding to navigation (sidebar)
- Styling guidelines (CSS variables, responsive)
- Common patterns and examples
- Hook usage
- State management
- Performance best practices
- Accessibility guidelines
- Error handling
- File naming conventions

**When to read:**
- Creating new components
- Building demo pages
- Adding navigation items
- Styling components
- Implementing responsive design

**Key sections:**
- Creating New Components
- Adding Component Demos
- Adding to Sidebar Navigation
- Styling Guidelines
- Summary Checklist

---

### 4. shadcn/0_THEME_LIST.md
**Master list of all available themes**

Contains:
- Alphabetical list of 50+ themes
- Theme names and values
- CSS file references

**When to read:**
- Checking available themes
- Verifying theme names
- Adding new themes to list

---

## 🎯 Quick Start for AI

### New to this project?
1. Read: `REQUIREMENTS AND INSTRUCTIONS.md`
2. Scan: Project structure in `AI_COMPONENT_INSTRUCTIONS.md`
3. Review: Theme system in `AI_THEME_INSTRUCTIONS.md`

### Adding a theme?
1. Read: `AI_THEME_INSTRUCTIONS.md` → "Adding New Themes"
2. Follow: Steps 1-4
3. Test: Use checklist in same file

### Building a component?
1. Read: `AI_COMPONENT_INSTRUCTIONS.md` → "Creating New Components"
2. Follow: Component template
3. Use: Summary checklist at end

### Troubleshooting?
1. Check: "Common Issues" in relevant instruction file
2. Review: Testing guidelines
3. Verify: File structure and naming

## 🔍 Finding Information

### Theme-Related Questions

| Question | File | Section |
|----------|------|---------|
| How do I add a theme? | AI_THEME_INSTRUCTIONS.md | Adding New Themes |
| What CSS variables are required? | AI_THEME_INSTRUCTIONS.md | Step 1: Create CSS File |
| How do I test themes? | AI_THEME_INSTRUCTIONS.md | Testing New Themes |
| What color format to use? | AI_THEME_INSTRUCTIONS.md | Color Format |
| How to extract colors? | AI_THEME_INSTRUCTIONS.md | Step 3: Extract Colors |
| Where are themes stored? | AI_THEME_INSTRUCTIONS.md | File Locations |
| Theme not appearing? | AI_THEME_INSTRUCTIONS.md | Common Issues |

### Component-Related Questions

| Question | File | Section |
|----------|------|---------|
| How do I create a component? | AI_COMPONENT_INSTRUCTIONS.md | Creating New Components |
| Where do demo pages go? | AI_COMPONENT_INSTRUCTIONS.md | Adding Component Demos |
| How to add to sidebar? | AI_COMPONENT_INSTRUCTIONS.md | Adding to Sidebar Navigation |
| What styling to use? | AI_COMPONENT_INSTRUCTIONS.md | Styling Guidelines |
| How to make responsive? | AI_COMPONENT_INSTRUCTIONS.md | Responsive Design |
| What CSS variables exist? | AI_COMPONENT_INSTRUCTIONS.md | CSS Variables to Use |
| Hook usage examples? | AI_COMPONENT_INSTRUCTIONS.md | Hook Usage |
| Accessibility checklist? | AI_COMPONENT_INSTRUCTIONS.md | Accessibility Guidelines |

### Project Setup Questions

| Question | File | Section |
|----------|------|---------|
| What versions required? | REQUIREMENTS AND INSTRUCTIONS.md | Requirements |
| How to setup project? | REQUIREMENTS AND INSTRUCTIONS.md | Core Setup |
| Database configuration? | REQUIREMENTS AND INSTRUCTIONS.md | Data Sources |
| Git workflow? | REQUIREMENTS AND INSTRUCTIONS.md | Git |
| Response format? | REQUIREMENTS AND INSTRUCTIONS.md | Response Format |

## 📖 Related Documentation (Project Root)

These files in the project root provide additional context:

### Theme Documentation
- `THEME_SYSTEM_SUMMARY.md` - Complete theme system overview
- `THEME_SWITCHER.md` - Implementation details
- `README_THEMES.md` - Theme documentation index
- `QUICK_START.md` - Quick start guide
- `IMPLEMENTATION_APPROACHES.md` - Technical comparison

### Component Documentation
- `COMPONENT_LIBRARY.md` - Component reference
- `NAVIGATION_STRUCTURE.md` - Navigation system guide
- `NAVBAR_GUIDE.md` - Navbar documentation
- `NAVBAR_QUICKSTART.md` - Navbar quick start

### Reference Documentation
- `README.md` - Main project README
- `TROUBLESHOOTING.md` - Troubleshooting guide
- `VERIFY_FIXES.md` - Verification steps

## 🎓 Best Practices

### When Working on Themes
1. ✅ Always read `AI_THEME_INSTRUCTIONS.md` first
2. ✅ Follow the 4-step process
3. ✅ Test both light and dark modes
4. ✅ Run color extraction script
5. ✅ Check accessibility (contrast)
6. ✅ Update theme list

### When Building Components
1. ✅ Always read `AI_COMPONENT_INSTRUCTIONS.md` first
2. ✅ Use component template
3. ✅ Create demo page
4. ✅ Add to sidebar navigation
5. ✅ Test responsive design
6. ✅ Check all themes
7. ✅ Complete checklist

### When Starting Any Task
1. ✅ Review `REQUIREMENTS AND INSTRUCTIONS.md`
2. ✅ Check relevant AI instruction file
3. ✅ Follow guidelines and patterns
4. ✅ Test thoroughly
5. ✅ Update documentation if needed

## 🔄 Keeping Instructions Updated

### When to Update These Files

**AI_THEME_INSTRUCTIONS.md:**
- New theme-related features added
- CSS variables change
- Theme system architecture changes
- New testing procedures
- Common issues discovered

**AI_COMPONENT_INSTRUCTIONS.md:**
- New component patterns established
- Project structure changes
- New styling guidelines
- New hooks or utilities added
- Best practices evolve

**REQUIREMENTS AND INSTRUCTIONS.md:**
- Dependency versions change
- Project requirements update
- New setup steps needed
- Git workflow changes

**shadcn/0_THEME_LIST.md:**
- New themes added
- Themes renamed or removed
- Theme categorization changes

## 📝 Documentation Standards

### Writing AI Instructions
- Be explicit and step-by-step
- Include code examples
- Provide file paths
- Show before/after if applicable
- Include common pitfalls
- Add checklists for verification

### File Organization
- Keep related information together
- Use clear headers and sections
- Cross-reference related docs
- Update table of contents
- Keep examples current

### Code Examples
- Use TypeScript
- Show imports
- Include comments
- Follow project conventions
- Demonstrate best practices

## 🚀 Quick Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Theme Tools
node scripts/extract-theme-colors.mjs  # Extract theme colors

# Components
pnpm dlx shadcn@latest add [name]      # Add shadcn component

# Code Quality
pnpm lint                   # Lint code
pnpm type-check            # Type check
```

## 🎯 Success Criteria

AI should be able to:
- ✅ Add a new theme in < 5 minutes
- ✅ Create a new component with demo in < 10 minutes
- ✅ Understand project structure immediately
- ✅ Follow styling guidelines consistently
- ✅ Implement responsive designs correctly
- ✅ Test thoroughly using checklists
- ✅ Find answers quickly in documentation

## 📞 Need Help?

1. **Check relevant instruction file** (theme or component)
2. **Review common issues** section
3. **Look at existing examples** in codebase
4. **Check project root documentation** for more details

---

**This documentation is maintained to help AI assistants work efficiently on this Next.js project. Keep it updated as the project evolves!**

