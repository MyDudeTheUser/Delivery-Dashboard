# Delivery Dashboard Roadmap

**Author:** Manus AI
**Date:** August 21, 2026

## Executive Summary
The Delivery Dashboard has successfully transitioned to a stable, secure, local-first architecture using Dexie.js for IndexedDB persistence. The foundational schema, seed data, and a pluggable signal ingestion pipeline are in place. However, the current implementation leaves critical functionality unexposed to the user and retains significant technical debt. 

This roadmap outlines the prioritized next steps to mature the application, focusing on completing the local-first user experience, enforcing code quality, and removing unnecessary bloat.

## Priority 1: High (Feature Completion & UI Exposure)
The backend logic for the local database exists, but the user interface does not yet fully support or expose it.

**Implement Reactive Updates**
Currently, the dashboard widgets rely on `@tanstack/react-query` to fetch data. While this provides caching, it does not offer real-time reactivity to local database changes. Although the `dexie-react-hooks` package is installed, it is not yet utilized. The immediate next step is to refactor the widgets to use `useLiveQuery`. This change will ensure that the UI instantly reacts whenever new signals are ingested into the database, eliminating the need for manual refreshes or background polling.

**Build the Scan History and Ingestion UI**
While the backend logic for the `scanHistory` table and the `ingestSignal` service is complete, the application currently lacks a user interface to expose these features. The routing is limited to the main Dashboard and an About page. To make the local database actionable, a new dedicated route (e.g., `/scans`) must be created. This page should display a data grid of historical scans and provide a user interface—such as a file upload component or a JSON text area—allowing operators to manually upload signal payloads and trigger the ingestion service.

## Priority 2: Medium (Testing & Technical Debt)
With the core logic implemented, the focus must shift to stability and bundle optimization.

**Expand Automated Testing**
The current test suite is extremely minimal and does not provide adequate coverage for the new architecture. It lacks tests for the Dexie database, the ingestion adapters, and the widget rendering against local state. The engineering team should prioritize writing unit tests for the signal parsers to ensure they correctly normalize edge-case payloads. Furthermore, integration tests for the database service layer and expanded Playwright end-to-end tests are required to cover the upcoming ingestion UI and scan history routes.

**Clean Up Unused Dependencies**
The project's `package.json` contains numerous heavy dependencies that are no longer utilized, including `chart.js`, `jspdf`, `react-big-calendar`, `react-grid-layout`, `recharts`, `@reduxjs/toolkit`, and `@azure/msal-browser`. Removing these packages is a crucial maintenance step. Doing so will significantly reduce the size of the `node_modules` directory, improve Vite build times, and minimize the potential security attack surface.

## Priority 3: Low (Developer Experience & Architecture)
These improvements will help maintain the codebase as the team scales.

**Centralize Type Definitions**
TypeScript interfaces for domain models are currently defined directly inside the database service file. Moving all data models to a dedicated `src/types/` directory will cleanly separate domain models from database implementation details, making the codebase easier to navigate and maintain.

**Enforce Code Formatting**
Although a `.prettierrc` configuration file exists, the project lacks a formatting script and pre-commit enforcement. Adding a formatting script to `package.json` and configuring tools like Husky and lint-staged will ensure that formatting and linting rules are strictly enforced on every commit, maintaining a consistent code style across the team.

**Update Core Documentation**
The main `README.md` file suffers from documentation drift; it still describes the architecture in terms of external API fetching and mock data, entirely ignoring the new Dexie.js local-first implementation. The concepts detailed in the newly created `LOCAL_DB_ARCHITECTURE.md` should be merged into the main README to provide new developers with a single, accurate source of truth regarding the application's data flow.
