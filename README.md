# Renewal Desk

A lightweight insurance policy renewal tracker for small teams.
Built with plain HTML, CSS, and JavaScript — no build step required.

## Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. That's it — no install, no build, no server needed

You can also use a simple local server if you prefer:

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

## Features

- **Track policy renewals** with client name, policy number, renewal date, and handler
- **One-click status cycling**: Not Started → In Progress → Done → Not Started
- **Real-time search** — filter policies by client name as you type
- **30-day renewal counter** — prominent badge showing how many non-complete renewals are due soon
- **Days-until indicators** — each policy shows urgency with color-coded countdowns
- **Persistent data** — all changes saved to localStorage, surviving page refreshes and browser restarts
- **Seed data** — pre-loaded with 6 example policies on first visit so the app is immediately useful
- **Fully responsive** — table layout on desktop, stacked cards on mobile

## How It Works

All data is stored in your browser's `localStorage` under the key `renewaldesk_policies`. There is no server, no database, and no network requests. Everything runs client-side.

### Data Model

Each policy record contains:

| Field | Description |
|---|---|
| `id` | Unique identifier (auto-generated) |
| `clientName` | Name of the insured client |
| `policyNumber` | Policy reference number |
| `renewalDate` | Date the policy is due for renewal (YYYY-MM-DD) |
| `handler` | Team member handling the renewal |
| `status` | One of: `not_started`, `in_progress`, `done` |
| `createdAt` | Timestamp when the record was added |

## Deployment

### GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Set Source to your main branch, root directory
4. Your site will be live at `https://<username>.github.io/renewal-desk/`

### Any Static Host

Simply upload all files maintaining the folder structure. No build step, no configuration.

## Project Structure
