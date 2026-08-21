import { db, type Incident } from './db';

// Interface for pluggable signal parsers
export interface SignalParser {
  canParse(payload: any): boolean;
  parse(payload: any): Incident[];
}

// Example Parser: AWS GuardDuty JSON format
class GuardDutyParser implements SignalParser {
  canParse(payload: any): boolean {
    return payload && payload.source === 'aws.guardduty';
  }

  parse(payload: any): Incident[] {
    if (!payload.detail || !payload.detail.findings) return [];
    
    return payload.detail.findings.map((finding: any) => ({
      system: `AWS - ${finding.resource?.resourceType || 'Unknown'}`,
      severity: finding.severity > 7 ? 'High' : finding.severity > 4 ? 'Medium' : 'Low',
      message: finding.title,
      source: 'AWS GuardDuty',
      timestamp: finding.createdAt || new Date().toISOString()
    }));
  }
}

// Example Parser: Generic SonarQube JSON format
class SonarQubeParser implements SignalParser {
  canParse(payload: any): boolean {
    return payload && Array.isArray(payload.issues);
  }

  parse(payload: any): Incident[] {
    return payload.issues.map((issue: any) => ({
      system: issue.project || 'SonarQube Project',
      severity: issue.severity === 'BLOCKER' || issue.severity === 'CRITICAL' ? 'High' : issue.severity === 'MAJOR' ? 'Medium' : 'Low',
      message: issue.message,
      source: 'SonarQube',
      timestamp: issue.creationDate || new Date().toISOString()
    }));
  }
}

// Register parsers
const parsers: SignalParser[] = [
  new GuardDutyParser(),
  new SonarQubeParser()
];

export async function ingestSignal(payload: any, sourceName: string = 'Manual Upload') {
  let incidents: Incident[] = [];
  let parsed = false;

  for (const parser of parsers) {
    if (parser.canParse(payload)) {
      incidents = parser.parse(payload);
      parsed = true;
      break;
    }
  }

  if (!parsed) {
    throw new Error('No compatible parser found for the provided signal format.');
  }

  if (incidents.length > 0) {
    // Save the normalized incidents
    await db.incidents.bulkAdd(incidents);
    
    // Log the scan history
    await db.scanHistory.add({
      timestamp: new Date().toISOString(),
      source: sourceName,
      issuesFound: incidents.length,
      rawPayload: JSON.stringify(payload)
    });
  }
  
  return incidents.length;
}
