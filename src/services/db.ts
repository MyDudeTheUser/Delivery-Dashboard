import Dexie, { type Table } from 'dexie';
import type {
  EnterpriseMetrics,
  Incident,
  Release,
  ScanHistory,
  ScannerProfile,
  SprintStatus,
  SystemHealth,
} from '../types/dashboard';

export class DashboardDB extends Dexie {
  systemHealth!: Table<SystemHealth, number>;
  incidents!: Table<Incident, number>;
  releases!: Table<Release, number>;
  sprintStatus!: Table<SprintStatus, number>;
  enterpriseMetrics!: Table<EnterpriseMetrics, number>;
  scanHistory!: Table<ScanHistory, number>;
  scannerProfiles!: Table<ScannerProfile, number>;

  constructor() {
    super('DeliveryDashboardDB');
    this.version(1).stores({
      systemHealth: '++id, component, status',
      incidents: '++id, system, severity, source',
      releases: '++id, version, date, status',
      sprintStatus: '++id, sprintName',
      enterpriseMetrics: '++id',
      scanHistory: '++id, timestamp, source',
    });

    this.version(2).stores({
      systemHealth: '++id, component, status',
      incidents: '++id, system, severity, source, timestamp',
      releases: '++id, version, date, status',
      sprintStatus: '++id, sprintName',
      enterpriseMetrics: '++id',
      scanHistory: '++id, timestamp, source',
    });

    this.version(3).stores({
      systemHealth: '++id, component, status',
      incidents: '++id, system, severity, source, timestamp',
      releases: '++id, version, date, status',
      sprintStatus: '++id, sprintName',
      enterpriseMetrics: '++id',
      scanHistory: '++id, timestamp, source',
      scannerProfiles: '++id, name, type, enabled',
    });
  }
}

export const db = new DashboardDB();

export async function seedDatabase() {
  const incidentCount = await db.incidents.count();
  if (incidentCount !== 0) {
    return;
  }

  const now = new Date().toISOString();
  await db.transaction(
    'rw',
    db.incidents,
    db.systemHealth,
    db.releases,
    db.sprintStatus,
    db.enterpriseMetrics,
    async () => {
      await db.incidents.bulkAdd([
        {
          system: 'Payment Gateway',
          severity: 'High',
          message: 'CPU usage high',
          source: 'System Monitor',
          timestamp: now,
        },
        {
          system: 'User Service',
          severity: 'Medium',
          message: 'Memory warning',
          source: 'System Monitor',
          timestamp: now,
        },
      ]);
      await db.systemHealth.bulkAdd([
        { component: 'API Server', status: 'Healthy', uptime: 99.9 },
        { component: 'Database', status: 'Warning', uptime: 98.5 },
      ]);
      await db.releases.bulkAdd([
        { version: 'Release 1.0', date: '2026-09-01', status: 'Planned' },
        { version: 'Release 1.1', date: '2026-10-01', status: 'Draft' },
      ]);
      await db.sprintStatus.add({
        sprintName: 'Sprint 42',
        progress: 65,
        completedStoryPoints: 26,
        totalStoryPoints: 40,
      });
      await db.enterpriseMetrics.add({
        deployments: 12,
        incidentsResolved: 8,
        avgUptime: 99.95,
      });
    },
  );
}
