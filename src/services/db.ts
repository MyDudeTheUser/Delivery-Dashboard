import Dexie, { type Table } from 'dexie';

export interface SystemHealth {
  id?: number;
  component: string;
  status: string;
  uptime: number;
}

export interface Incident {
  id?: number;
  system: string;
  severity: string;
  message: string;
  source?: string;
  timestamp?: string;
}

export interface Release {
  id?: number;
  version: string;
  date: string;
  status: string;
}

export interface SprintStatus {
  id?: number;
  sprintName: string;
  progress: number;
  completedStoryPoints: number;
  totalStoryPoints: number;
}

export interface EnterpriseMetrics {
  id?: number;
  deployments: number;
  incidentsResolved: number;
  avgUptime: number;
}

export interface ScanHistory {
  id?: number;
  timestamp: string;
  source: string;
  issuesFound: number;
  rawPayload?: string; // Storing raw format for auditing
}

export class DashboardDB extends Dexie {
  systemHealth!: Table<SystemHealth, number>;
  incidents!: Table<Incident, number>;
  releases!: Table<Release, number>;
  sprintStatus!: Table<SprintStatus, number>;
  enterpriseMetrics!: Table<EnterpriseMetrics, number>;
  scanHistory!: Table<ScanHistory, number>;

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
  }
}

export const db = new DashboardDB();

// Initial Seed Data
export async function seedDatabase() {
  const incidentCount = await db.incidents.count();
  if (incidentCount === 0) {
    await db.incidents.bulkAdd([
      { system: 'Payment Gateway', severity: 'High', message: 'CPU usage high', source: 'System Monitor', timestamp: new Date().toISOString() },
      { system: 'User Service', severity: 'Medium', message: 'Memory warning', source: 'System Monitor', timestamp: new Date().toISOString() },
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
      totalStoryPoints: 40
    });
    
    await db.enterpriseMetrics.add({
      deployments: 12,
      incidentsResolved: 8,
      avgUptime: 99.95
    });
  }
}
