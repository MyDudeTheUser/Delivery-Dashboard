# Delivery Dashboard

A modern, responsive React application built to provide a unified view of system health, incident alerts, release calendars, sprint statuses, and enterprise metrics.

## 🚀 Technologies

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **UI Library:** Material UI (MUI) v9
*   **Data Fetching & Caching:** React Query (TanStack Query)
*   **Testing:** Vitest & React Testing Library
*   **Formatting & Linting:** ESLint & Prettier

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

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and specify your API base URL:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/v1
   ```
   *(Note: If the API is unreachable, the application gracefully falls back to mock data for development purposes.)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts

*   `npm run dev` - Starts the Vite development server.
*   `npm run build` - Compiles TypeScript and builds the production bundle.
*   `npm run lint` - Runs ESLint to check for code quality issues.
*   `npm run test` - Runs the Vitest test suite.
*   `npm run test:coverage` - Runs the test suite and generates a coverage report.
*   `npx prettier --write "src/**/*.{ts,tsx,css}"` - Formats the codebase.

## 🛡️ CI/CD & Security

This repository utilizes GitHub Actions for continuous integration and security:
*   **CI Pipeline (`ci.yml`):** Automatically runs on every push and pull request to `main`. It enforces:
    *   Zero high/critical npm vulnerabilities (`npm audit`)
    *   Code linting (`eslint`)
    *   Code formatting (`prettier`)
    *   Test execution and coverage (`vitest`)
    *   Production build verification (`vite build`)
*   **Dependabot:** Configured to automatically scan and create PRs for outdated npm packages and GitHub Actions weekly.

## 🏗️ Architecture

The application is structured around isolated, data-fetching widgets:
*   `SystemHealthWidget`: Displays real-time CPU/Memory usage and status.
*   `AlertsWidget`: Shows active incidents and their severity.
*   `ReleasesWidget`: Provides a calendar of upcoming system releases.
*   `SprintStatusWidget`: Tracks agile sprint progress and velocity.
*   `EnterpriseMetricsWidget`: High-level KPIs (Deployments, Uptime).

All data fetching is centralized in `src/services/api.ts` and cached globally using React Query to ensure high performance and minimize unnecessary network requests.
