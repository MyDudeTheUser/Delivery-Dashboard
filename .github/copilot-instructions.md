# Copilot Instructions for Delivery Dashboard

## Overview
This project is a modular, browser-based dashboard for HCA Front Office Application Delivery Managers. It visualizes system health, alerts, sprint status, releases, and knowledge resources using data from local JSON/CSV files. The UI is built with vanilla JS, HTML, and CSS, and uses Chart.js for visualizations.

## Architecture & Data Flow
- **index.html**: Main entry point, defines dashboard layout and loads `js/app.js`.
- **js/app.js**: Handles all data loading, DOM updates, and rendering logic. Fetches data from the `data/` directory and updates the dashboard sections.
- **styles/dashboard.css**: Custom styles for dashboard layout and widgets.
- **data/**: Contains all runtime data files (JSON/CSV) for dashboard sections:
  - `system_health.json`, `alerts.json`, `releases.json`, `knowledge_hub.json`, `sprint_status.csv`
- **Chart.js**: Used for rendering system health gauges (loaded via CDN in `index.html`).

## Key Patterns & Conventions
- **Data Fetching**: All data is loaded via `fetch()` from the `data/` directory. Data files are expected to be present and well-formed.
- **Section Rendering**: Each dashboard section has a dedicated render function (e.g., `renderSystemHealth`, `renderUpcomingReleases`).
- **Periodic Refresh**: Data is auto-refreshed every 30 seconds via `setInterval` in `app.js`.
- **Filtering**: Alerts and sprint status sections support client-side filtering via input fields.
- **Accessibility**: Uses ARIA roles and labels in HTML for improved accessibility.

## Developer Workflows
- **No build step**: All code is plain JS/CSS/HTML. Open `index.html` directly in a browser to run.
- **Data updates**: To test new data, edit or replace files in the `data/` directory.
- **Linting/Validation**: Python script `OldFiles/validate_json.py` can be used to check JSON syntax and (optionally) schema compliance. Install `jsonschema` for schema validation.
- **No automated tests or CI/CD**: All testing is manual and visual.

## Project-Specific Notes
- **No backend/server**: All logic is client-side. No Node.js, npm, or package.json.
- **No framework**: No React/Vue/Angular. All DOM manipulation is direct.
- **Modularity**: Each dashboard section is self-contained in `app.js`.
- **Legacy/Reference files**: `OldFiles/` contains legacy scripts and docs, not used in the main dashboard.

## Examples
- To add a new dashboard section, update `index.html` and add a new render function in `app.js`.
- To change the data source, update the relevant file in `data/` and adjust fetch logic if needed.

## Key Files
- `index.html`, `js/app.js`, `styles/dashboard.css`, `data/`, `OldFiles/validate_json.py`

---
For questions or unclear conventions, review the code in `js/app.js` and `index.html` for the latest patterns.
