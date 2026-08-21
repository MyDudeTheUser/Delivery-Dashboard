# Delivery Dashboard

A modern, responsive React application built to provide a unified view of system health, incident alerts, release calendars, sprint statuses, and enterprise metrics.

## 🚀 Technologies

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Material UI (MUI) v9
- **Local Database:** Dexie.js (IndexedDB)
- **Data Fetching:** React Query (Legacy) & dexie-react-hooks (Reactive UI)
- **Testing:** Vitest & React Testing Library
- **Formatting & Linting:** ESLint & Prettier

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MyDudeTheUser/Delivery-Dashboard.git
   cd Delivery-Dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles TypeScript and builds the production bundle.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run format` - Formats the codebase using Prettier.
- `npm run check` - Runs linting, formatting, testing, and a test build.
- `npm run test` - Runs the Vitest test suite.
- `npm run test:coverage` - Runs the test suite and generates a coverage report.

## 🛡️ CI/CD & Security

This repository utilizes GitHub Actions for continuous integration and security:

- **CI Pipeline (`ci.yml`):** Automatically runs on every push and pull request to `main`. It enforces:
  - Zero high/critical npm vulnerabilities (`npm audit`)
  - Code linting (`eslint`)
  - Code formatting (`prettier`)
  - Test execution and coverage (`vitest`)
  - Production build verification (`vite build`)
- **Dependabot:** Configured to automatically scan and create PRs for outdated npm packages and GitHub Actions weekly.

## 🏗️ Architecture

The application is structured around isolated, data-fetching widgets:

- `SystemHealthWidget`: Displays real-time CPU/Memory usage and status.
- `AlertsWidget`: Shows active incidents and their severity.
- `ReleasesWidget`: Provides a calendar of upcoming system releases.
- `SprintStatusWidget`: Tracks agile sprint progress and velocity.
- `EnterpriseMetricsWidget`: High-level KPIs (Deployments, Uptime).

### Local-First Data Layer

The application has transitioned to a local-first architecture. Instead of fetching data from an external API, the dashboard persists system health, sprint status, releases, and enterprise metrics locally within the browser using IndexedDB (via Dexie.js).

Widgets are fully reactive using `useLiveQuery` from `dexie-react-hooks`, meaning the UI instantly updates whenever the local database changes.

### Signal Ingestion Pipeline

To support multi-source enterprise scanning, the app includes a pluggable signal ingestion pipeline (`src/services/ingestion.ts`). The pipeline normalizes disparate formats into a common schema, saves incidents to the local database, and maintains an audit log of all scan history.

The **Scan Operations** route (`/scans`) supports three configurable enterprise scanning modes:

1. **Interactive Local Scanning**: Connects directly to Microsoft 365 from the browser using delegated permissions. Operators provide an Entra Client ID and authorize the scopes they wish to scan (Email, Teams, SharePoint).
2. **Managed Scheduled Scanning**: Defines the scope and schedule for future unattended background scans. The dashboard stores the plan but enforces secure readiness—the scan remains blocked until a secure backend and Entra administrator consent are deployed.
3. **Export-and-Ingest Baseline**: Provides instructions for operators to run official Microsoft Graph PowerShell scripts locally, exporting their data securely before manually uploading the JSON payload for ingestion.
