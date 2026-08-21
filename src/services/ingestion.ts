import { db, type Incident } from './db';

type SignalPayload = Record<string, unknown>;
type NormalizedIncident = Omit<Incident, 'id'>;

function isRecord(value: unknown): value is SignalPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function asSeverity(value: unknown): 'High' | 'Medium' | 'Low' {
  if (typeof value === 'number') {
    return value > 7 ? 'High' : value > 4 ? 'Medium' : 'Low';
  }

  const normalizedSeverity = asString(value, 'Low').toUpperCase();
  if (normalizedSeverity === 'BLOCKER' || normalizedSeverity === 'CRITICAL' || normalizedSeverity === 'HIGH') {
    return 'High';
  }
  if (normalizedSeverity === 'MAJOR' || normalizedSeverity === 'MEDIUM') {
    return 'Medium';
  }
  return 'Low';
}

export interface SignalParser {
  readonly name: string;
  canParse(payload: unknown): boolean;
  parse(payload: unknown): NormalizedIncident[];
}

class GuardDutyParser implements SignalParser {
  readonly name = 'AWS GuardDuty';

  canParse(payload: unknown): boolean {
    return isRecord(payload) && payload.source === 'aws.guardduty';
  }

  parse(payload: unknown): NormalizedIncident[] {
    if (!isRecord(payload) || !isRecord(payload.detail) || !Array.isArray(payload.detail.findings)) {
      return [];
    }

    return payload.detail.findings.filter(isRecord).map((finding) => {
      const resource = isRecord(finding.resource) ? finding.resource : undefined;
      return {
        system: `AWS - ${asString(resource?.resourceType, 'Unknown resource')}`,
        severity: asSeverity(finding.severity),
        message: asString(finding.title, 'Untitled GuardDuty finding'),
        source: 'AWS GuardDuty',
        timestamp: asString(finding.createdAt, new Date().toISOString()),
      };
    });
  }
}

class SonarQubeParser implements SignalParser {
  readonly name = 'SonarQube';

  canParse(payload: unknown): boolean {
    return isRecord(payload) && Array.isArray(payload.issues);
  }

  parse(payload: unknown): NormalizedIncident[] {
    if (!isRecord(payload) || !Array.isArray(payload.issues)) {
      return [];
    }

    return payload.issues.filter(isRecord).map((issue) => ({
      system: asString(issue.project, 'SonarQube Project'),
      severity: asSeverity(issue.severity),
      message: asString(issue.message, 'Untitled SonarQube issue'),
      source: 'SonarQube',
      timestamp: asString(issue.creationDate, new Date().toISOString()),
    }));
  }
}

const parsers: SignalParser[] = [new GuardDutyParser(), new SonarQubeParser()];

export const supportedSignalSources = parsers.map((parser) => parser.name);

export async function ingestSignal(payload: unknown, sourceName = 'Manual upload') {
  const parser = parsers.find((candidate) => candidate.canParse(payload));
  if (!parser) {
    throw new Error(
      `Unsupported signal format. Supported adapters: ${supportedSignalSources.join(', ')}.`,
    );
  }

  const incidents = parser.parse(payload);
  const timestamp = new Date().toISOString();

  await db.transaction('rw', db.incidents, db.scanHistory, async () => {
    if (incidents.length > 0) {
      await db.incidents.bulkAdd(incidents);
    }

    await db.scanHistory.add({
      timestamp,
      source: sourceName.trim() || 'Manual upload',
      issuesFound: incidents.length,
      rawPayload: JSON.stringify(payload),
    });
  });

  return {
    issuesFound: incidents.length,
    adapter: parser.name,
    timestamp,
  };
}
