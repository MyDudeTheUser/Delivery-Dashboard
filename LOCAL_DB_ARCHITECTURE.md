# Local Database Architecture

## Overview
The Delivery Dashboard has been enhanced with a local-first data layer powered by [Dexie.js](https://dexie.org/), a minimalist wrapper for IndexedDB. This architecture enables the dashboard to persist system health, sprint status, releases, and enterprise metrics locally within the browser without requiring a backend server.

## Database Schema
The database (`DeliveryDashboardDB`) is defined in `src/services/db.ts` and contains the following tables:

| Table | Primary Key | Description |
|-------|-------------|-------------|
| `systemHealth` | `++id` | Tracks component health status and uptime |
| `incidents` | `++id` | Stores alerts and incidents from various sources |
| `releases` | `++id` | Upcoming and past software releases |
| `sprintStatus` | `++id` | Current sprint progress and story points |
| `enterpriseMetrics` | `++id` | High-level KPIs (deployments, uptime) |
| `scanHistory` | `++id` | Audit log of ingested signal payloads |

## Signal Ingestion Pipeline
To support multi-source enterprise scanning, the app includes a pluggable signal ingestion pipeline (`src/services/ingestion.ts`). 

### Adapters
The ingestion service normalizes disparate data formats into a common `Incident` schema. Two example adapters are included:
1. **AWS GuardDuty Parser**: Normalizes JSON payloads from AWS security findings.
2. **SonarQube Parser**: Normalizes JSON payloads from SonarQube code quality scans.

### Adding New Sources
To add a new data source format, implement the `SignalParser` interface and register it in `parsers` array:

```typescript
class CustomParser implements SignalParser {
  canParse(payload: any): boolean {
    // Return true if payload matches expected format
  }
  parse(payload: any): Incident[] {
    // Map custom payload to Incident[] array
  }
}
```

## API Service Layer
The central API service (`src/services/api.ts`) has been refactored to read directly from the local IndexedDB using Dexie, seamlessly integrating with the existing React Query hooks in the widgets.

## Initial Seed Data
Upon application startup, `main.tsx` invokes `seedDatabase()` which populates the local database with initial sample data if the tables are empty. This ensures the dashboard immediately renders meaningful data for demonstration and testing purposes.
