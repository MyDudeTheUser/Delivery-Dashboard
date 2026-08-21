export type IncidentSeverity = 'High' | 'Medium' | 'Low';
export type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

export interface SystemHealth {
  id?: number;
  component: string;
  status: HealthStatus;
  uptime: number;
}

export interface Incident {
  id?: number;
  system: string;
  severity: IncidentSeverity;
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
  rawPayload?: string;
}
