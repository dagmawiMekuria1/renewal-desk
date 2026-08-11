# Renewal Desk — Style Guide

## Language & Runtime
- Plain HTML5, CSS3, vanilla JavaScript (ES2020)
- No frameworks, no build tools, no transpilation
- Target: evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)

## File Organization
- `index.html` — single page, references CSS and JS via relative paths
- `assets/styles.css` — all styles in one file, organized by section
- `assets/app.js` — all logic in one file, organized by module pattern

## HTML Conventions
- Use semantic elements: `<header>`, `<main>`, `<section>`, `<footer>`, `<table>`, `<form>`
- All interactive elements must be keyboard-accessible (use `<button>`, not `<div onclick>`)
- Every form input must have a visible `<label>` with a `for` attribute
- Use `data-*` attributes for JS hooks (e.g., `data-policy-id`, `data-action`)
- IDs use kebab-case: `id="policy-list"`, `id="add-form"`
- Classes use BEM-like kebab-case: `policy-row`, `policy-row--overdue`, `status-badge--done`

## CSS Conventions
- Use CSS custom properties (variables) defined in `:root` for all colors, spacing, fonts
- Organize CSS in this order: reset/base → layout → components → utilities → responsive
- No `!important` — there are no third-party styles to override
- Use relative units (`rem`, `em`) for font sizes; `px` for borders, shadows, fine spacing
- Class naming: `.component-name`, `.component-name__element`, `.component-name--modifier`
- Media queries at the bottom of the file, mobile-adjustments only (desktop-first approach)
- Use `box-sizing: border-box` globally

## JavaScript Conventions

### Variables & Scope
- Use `const` by default, `let` when reassignment is needed, never `var`
- Use an IIFE or a module-pattern object to avoid polluting global scope
- All DOM queries happen through a single `elements` object initialized on DOMContentLoaded

### Naming
- Function naming: `camelCase`, descriptive verbs — `renderPolicies()`, `handleStatusClick()`
- Private/internal functions prefixed with underscore: `_calculateDaysUntil()`
- Data layer functions: `loadPolicies()`, `savePolicies()`, `addPolicy()`, `updatePolicyStatus()`
- Constants: `UPPER_SNAKE_CASE` — `STORAGE_KEY`, `STATUSES`, `STATUS_LABELS`

### Events
- Event delegation: attach listeners to parent containers, not individual items
- Use `addEventListener`, never inline `onclick` attributes

### Data
- localStorage key constant: `STORAGE_KEY = 'renewaldesk_policies'`
- Always `JSON.parse` / `JSON.stringify` for localStorage operations, wrapped in try/catch
- Dates: use `YYYY-MM-DD` strings internally, format for display with `Intl.DateTimeFormat`
- Generate IDs with: `'pol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)`

## Accessibility
- Color is never the only indicator — always pair with text labels or icons
- Status badges include text ("Not Started", "In Progress", "Done")
- Focus styles: visible outline on all interactive elements
- `aria-live="polite"` on the policy list container for screen reader announcements
- `aria-label` on the search input and status badge buttons

## Error Handling
- Form validation: check all fields non-empty before submit; show inline error messages
- localStorage: graceful fallback if storage is full or unavailable (show warning, keep working in memory)
- Never throw unhandled exceptions — wrap risky operations in try/catch

## Code Comments
- File-level JSDoc comment at the top of `app.js` describing the module
- Section separators: `// ─── DATA LAYER ───`, `// ─── RENDERING ───`, etc.
- Comment *why*, not *what* — the code should be self-documenting for the *what*

## SVG Icons
- All icons are inline SVG — no external icon libraries, no image files
- Use `currentColor` for fill/stroke where possible so icons inherit text color
- Keep SVGs minimal: 1–2 paths max, viewBox-based sizing
- Standard sizes: 14×14 (inline), 16×16 (search), 20×24 (logo)

## Performance
- No network requests of any kind
- No debounce needed for search (dataset is small, <100 items)
- Re-render the full list on every change (simple and correct for this scale)
- No loading states — everything is synchronous and instant

## Git Conventions
- Commit messages: imperative mood, 50-char subject line
- Examples: "Add policy search filtering", "Fix status badge hover state"
- One logical change per commit