# Renewal Desk — Developer Instructions for Codi

## Project Type
Single-page static web application. No build step. No server. No external dependencies.

## How to Create This Project

### Step 1: Create `index.html`
- DOCTYPE html5, lang="en"
- `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>Renewal Desk</title>`
- Link to `assets/styles.css` (relative path, no leading slash)
- Script tag at end of body pointing to `assets/app.js` (relative path, `defer` attribute)
- Structure the body as:
  1. `<header>` with app title (inline SVG icon of a shield) and 30-day counter badge
  2. `<main>` containing:
     - `<section id="add-policy-section">` — the add-policy form
     - `<section id="search-section">` — search input + result count
     - `<section id="policy-list-section">` — the policy table/list container
  3. `<footer>` with copyright

### Step 2: Create `assets/styles.css`
- Define all CSS custom properties in `:root`
- Apply `box-sizing: border-box` globally
- Style each section according to the design system in `yuvi.md`
- The policy list renders as a `<table>` on desktop (≥768px) and stacked cards on mobile (<768px)
- Status badges are `<button>` elements styled as pills
- Add smooth transitions on hover states (150ms ease)
- Ensure the counter badge in the header is visually prominent (colored background, bold number)

### Step 3: Create `assets/app.js`
Structure the file in this order:

```javascript
/**
 * Renewal Desk — Policy Renewal Tracker
 * All application logic: data persistence, rendering, event handling.
 */

// ─── CONSTANTS ───
const STORAGE_KEY = 'renewaldesk_policies';
const STATUSES = ['not_started', 'in_progress', 'done'];
const STATUS_LABELS = { not_started: 'Not Started', in_progress: 'In Progress', done: 'Done' };

// ─── SEED DATA ───
// 6 policies with dates relative to today

// ─── DATA LAYER ───
// loadPolicies(), savePolicies(policies), addPolicy(data), updatePolicyStatus(id)

// ─── UTILITY FUNCTIONS ───
// _generateId(), _calculateDaysUntil(dateString), _formatDate(dateString), _countUpcoming(policies)

// ─── RENDERING ───
// renderPolicies(policies), renderCounter(policies), renderResultCount(shown, total)

// ─── EVENT HANDLERS ───
// handleFormSubmit(e), handleStatusClick(e), handleSearchInput(e)

// ─── INITIALIZATION ───
// DOMContentLoaded listener that wires everything up
```

### Step 4: Seed Data Logic
- On first load, check if `localStorage.getItem(STORAGE_KEY)` returns null
- If null, generate 6 seed policies with dates calculated as offsets from `new Date()`
- Use realistic corporate client names and policy numbers from the architecture doc
- Save to localStorage immediately after generating

Seed data offsets:

| Client Name | Policy Number | Days from Today | Handler | Status |
|---|---|---|---|---|
| Greenfield Manufacturing Ltd | POL-2024-004821 | +15 | Sarah Chen | not_started |
| Baxter & Associates Legal | POL-2024-003197 | +8 | James Morton | in_progress |
| Riverside Medical Group | POL-2024-005540 | +45 | Sarah Chen | not_started |
| TechVault Solutions Inc | POL-2024-002883 | +3 | Priya Kapoor | in_progress |
| Harborview Hotels Group | POL-2024-006102 | +22 | James Morton | done |
| Pinnacle Sports Academy | POL-2024-001475 | +60 | Priya Kapoor | not_started |

### Step 5: Status Cycling
- Clicking a status badge cycles: not_started → in_progress → done → not_started
- Use event delegation on the table/list container
- After status change: save to localStorage, re-render the full list, update the counter

### Step 6: Search Filtering
- On every `input` event in the search box, filter the full policy array
- Case-insensitive `includes()` match on `clientName`
- Re-render only the filtered results
- Update the "Showing X of Y" result count
- If search is empty, show all policies

### Step 7: 30-Day Counter
- Count policies where:
  - `renewalDate` is today or in the future (not past)
  - `renewalDate` is within 30 days from today
  - `status` is NOT `"done"`
- Display as: "X renewals due in the next 30 days"
- Recalculate on every status change and on page load

### Step 8: Days-Until Display
- For each policy row, calculate days between today and renewalDate
- Show as:
  - "Overdue" (red) if date is in the past
  - "Today" (red) if date is today
  - "X days" (orange/red/gray depending on urgency)

### Step 9: Sorting
- Default sort: by `renewalDate` ascending (soonest renewal first)
- Overdue policies always appear at the top

## Critical Rules
- NEVER use `fetch()`, `XMLHttpRequest`, or any external URL
- NEVER use absolute paths (no leading `/`)
- NEVER reference CDN resources, Google Fonts, or remote images
- Use only inline SVG for icons
- All paths must be relative: `assets/styles.css`, `assets/app.js`
- Test by opening `index.html` directly in a browser — it must work via `file://` protocol
- All interactive elements must be `<button>` or `<a>` for keyboard accessibility
- Form inputs must have associated `<label>` elements
- Wrap localStorage operations in try/catch for resilience

## Testing Checklist
1. Open `index.html` — 6 seed policies appear
2. Click a status badge — it cycles through states
3. Refresh the page — data persists
4. Fill out the form and submit — new policy appears at top
5. Type in search — list filters in real time
6. Check the 30-day counter updates when statuses change
7. Resize to mobile width — layout switches to cards
8. Open DevTools Network tab — zero requests
9. Tab through all interactive elements — focus is visible
10. Clear localStorage and refresh — seed data reappears