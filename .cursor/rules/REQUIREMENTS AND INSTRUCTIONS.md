# REQUIREMENTS AND INSTRUCTIONS

**Next.js + shadcn/ui Project Setup Rules**

# Project Setup Rules

## Requirements

* Node.js ≥ v22 (Windows)
* pnpm
* Next.js ≥ v16
  ```powershell
  pnpm create next-app@latest my-app --yes
  ```
* shadcn/ui
* shadcn MCP server
* dotenv
* DB packages: MSSQL, MySQL, PostgreSQL, Redis

## Core Setup

* Use **PowerShell 7.5.0** only
* Verify all requirements
* Install missing via `pnpm`
* Init shadcn/ui + all components
* MCP config:
  ```powershell
  pnpm dlx shadcn@latest mcp init --client cursor
  ```

## .env Files

* Create:
  * `.env` (prod)
  * `.env.example` (dummy values)
* Required vars:
  * DB: MSSQL, MySQL, PostgreSQL, Redis
  * `APP_DOMAIN` → base for all internal links

## Data Sources

* Local or same-network only
* Use official pnpm packages for:
  * MSSQL
  * MySQL
  * PostgreSQL
  * Redis

## Theme Switcher

* Read themes: `{root}/.cursor/rules/shadcn/0_THEME_LIST.md`
* CSS: shadcn/tailwind per-theme files in `public/themes/`
* Support: light/dark + fonts per theme
* Dropdown:
  * Order: as in `0_THEME_LIST.md`
  * Show: 4 color swatches left of name
  * Swatch colors (CSS vars):
    1. `--primary`
    2. `--accent`
    3. `--muted`
    4. `--secondary`
  * Border radius: inherit from active theme
  * Colors: respect light/dark mode

## AI Instructions

* **Theme System**: `.cursor/rules/AI_THEME_INSTRUCTIONS.md`
  * How to add/modify themes
  * CSS variable reference
  * Color extraction scripts
  * Testing guidelines
* **Component Development**: `.cursor/rules/AI_COMPONENT_INSTRUCTIONS.md`
  * Creating components
  * Adding demos
  * Navigation integration
  * Styling guidelines
  * Best practices

## Git

* Init repo
* `.gitignore`:
  * Standard Next.js ignores
  * **Keep**: `.cursor/` (all rules)
* Use Cursor’s built-in Git UI (VS Code-based)

## Response Format

* **Summary**: 1 sentence (≤15 words)
* **Outline**: bullets only (≤5 levels)
* **No**: intro, chit-chat, examples
* **Prioritize**: code, commands, paths
* **Target**: ≤150 tokens

## Passdown Logs

* Path: `{root}/.cursor/rules/Passdowns/`
* Create/update `.md` logs for:
  * New threads
  * Different LLMs/IDEs
  * Onboarding notes

## Coder Support

* Assume: may not know Git/PowerShell/Node
* Provide: exact commands when needed
* Minimize: housekeeping tasks

***

**Improvements**:

* **Structure**: Clear hierarchy, scannable
* **Consistency**: Unified bullet style, commands in code blocks
* **Clarity**: Removed redundancy, grouped logic
* **Token-efficient**: Enforces response rule inline
* **Maintainable**: Passdowns centralized
