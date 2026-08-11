# Renewal Desk — Requirements Document

## Project Overview
Renewal Desk is a lightweight, single-page web application for insurance teams to track
policy renewals. It runs entirely in the browser with localStorage persistence — no backend,
no database server, no authentication.

## Target Users
Small insurance team (3–10 people) who need a shared-screen or individual tracker for
upcoming policy renewals. Not a replacement for a full policy management system — this is
a quick-reference board.

## Functional Requirements

### FR-1: Policy List Display
- Display all policies in a list/table format
- Each row shows: client name, policy number, renewal date, handler name, status
- List is sorted by renewal date ascending (soonest first, overdue at top)
- Show the number of days until renewal (or "Overdue" for past dates)
- Days-until indicator is color-coded by urgency:
  - Overdue: red
  - Today: red
  - 1–7 days: orange/warning
  - 8–30 days: secondary text color
  - 30+ days: muted text color

### FR-2: Status Management
- Three statuses: "Not Started", "In Progress", "Done"
- User can change status with a single click on the status badge
- Status cycles in order: Not Started → In Progress → Done → Not Started
- Status change persists to localStorage immediately
- Status badges are visually distinct with color-coded pill styling

### FR-3: Add New Policy
- Inline form at the top of the page (always visible, not behind a modal)
- Four required fields:
  - **Client Name** — text input, 1–120 characters
  - **Policy Number** — text input, 1–30 characters
  - **Renewal Date** — native `<input type="date">`
  - **Handler** — text input, 1–80 characters
- Form validates that all fields are filled before submission
- On successful submission:
  - Policy is added to the list with status "Not Started"
  - Form is cleared
  - localStorage is updated
  - 30-day counter is recalculated
  - New policy appears in sorted position

### FR-4: Search / Filter
- A text input that filters the displayed list by client name
- Filter is case-insensitive and matches partial strings
- Filtering happens on every keystroke (no submit button needed)
- Show a count: "Showing X of Y policies"
- When the search box is cleared, all policies are shown
- If no policies match, show an empty state message

### FR-5: 30-Day Renewal Counter
- A prominent counter in the header area
- Shows the number of policies where:
  - Renewal date is today or in the future
  - Renewal date is within 30 days from today
  - Status is NOT "Done"
- Recalculates whenever:
  - Status changes
  - A policy is added
  - The page loads
- Visually distinct badge with warning/accent styling

### FR-6: Data Persistence
- All data stored in `localStorage` under key `renewaldesk_policies`
- Data survives page refresh, tab close/reopen, and browser restart
- Graceful handling if localStorage is unavailable or full
- Data format: JSON-serialized array of policy objects

### FR-7: Seed Data
- 6 realistic-looking policies with varied statuses, handlers, and renewal dates
- Only loaded on first visit (when localStorage key does not exist)
- Renewal dates are calculated relative to today so urgency indicators are always meaningful
- Spread across: some due very soon (3 days), some mid-range (8, 15, 22 days), some far out (45, 60 days)
- Mix of statuses: some not_started, some in_progress, one done

## Non-Functional Requirements

### NFR-1: No External Dependencies
- No CDN scripts, no external CSS, no Google Fonts, no remote images
- No npm packages, no build step, no transpilation
- No `fetch()` or `XMLHttpRequest` calls
- Must work when served from any static file server including GitHub Pages
- Must work via `file://` protocol (direct file open)

### NFR-2: Browser Compatibility
- Must work in latest 2 versions of Chrome, Firefox, Safari, and Edge
- Uses ES2020 JavaScript features (const, let, arrow functions, template literals, optional chaining)
- Uses CSS custom properties (supported in all target browsers)

### NFR-3: Responsiveness
- Usable on screens from 375px (mobile) to 1920px (desktop)
- Table layout on desktop (≥768px)
- Stacked card layout on mobile (<768px)
- Form fields in a row on desktop, stacked on mobile
- Header elements wrap appropriately on small screens

### NFR-4: Accessibility
- All interactive elements keyboard-navigable
- Visible focus indicators on all interactive elements
- Status communicated via text (not color alone)
- Form inputs have associated `<label>` elements with `for` attributes
- Policy list container has `aria-live="polite"` for screen reader updates
- Status badge buttons have `aria-label` describing the action

### NFR-5: Performance
- Page loads instantly (no network requests, no parsing delay)
- All interactions feel immediate (no loading states needed)
- Re-rendering the full list on every change is acceptable for the expected data size (<100 policies)

## Acceptance Criteria

1. ✅ Opening `index.html` shows 6 pre-loaded policies on first visit
2. ✅ Each policy row displays client name, policy number, renewal date, handler, and status badge
3. ✅ Policies are sorted by renewal date ascending (overdue first, then soonest)
4. ✅ Each row shows a days-until indicator that is color-coded by urgency
5. ✅ Clicking a status badge cycles it through the three states
6. ✅ The 30-day counter in the header updates correctly when statuses change
7. ✅ Filling out and submitting the add-policy form creates a new row in the list
8. ✅ The form validates that all four fields are filled before allowing submission
9. ✅ The form clears after successful submission
10. ✅ Typing in the search box filters the list by client name in real time
11. ✅ A "Showing X of Y" count updates as the user types in search
12. ✅ An empty state message appears when search yields no results
13. ✅ All changes survive a full page refresh (data persists in localStorage)
14. ✅ No network requests are made (verify in browser DevTools Network tab)
15. ✅ The page is usable on a 375px-wide screen (card layout, no horizontal scroll)
16. ✅ All form fields can be navigated and submitted via keyboard
17. ✅ Focus indicators are visible on all interactive elements
18. ✅ Clearing localStorage and refreshing re-generates the seed data

## Out of Scope
- User authentication / login
- Multi-user collaboration / real-time sync
- Policy deletion (can be added later)
- Policy editing (beyond status cycling)
- Export/import functionality
- Print styling
- Dark mode
- Sorting controls (fixed sort order by renewal date)