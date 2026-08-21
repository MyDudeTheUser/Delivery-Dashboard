import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { ingestSignal } from './ingestion';

async function clearIngestionData() {
  await db.transaction('rw', db.incidents, db.scanHistory, async () => {
    await Promise.all([db.incidents.clear(), db.scanHistory.clear()]);
  });
}

describe('signal ingestion', () => {
  beforeEach(async () => {
    await clearIngestionData();
  });

  afterEach(async () => {
    await clearIngestionData();
  });

  it('normalizes SonarQube findings and records their scan history', async () => {
    const result = await ingestSignal(
      {
        issues: [
          {
            project: 'checkout-service',
            severity: 'CRITICAL',
            message: 'SQL injection risk',
            creationDate: '2026-08-21T12:00:00.000Z',
          },
          {
            project: 'checkout-service',
            severity: 'MINOR',
            message: 'Naming convention violation',
            creationDate: '2026-08-21T12:01:00.000Z',
          },
        ],
      },
      'SonarQube quality scan',
    );

    expect(result).toMatchObject({ issuesFound: 2, adapter: 'SonarQube' });

    const incidents = await db.incidents.orderBy('timestamp').toArray();
    expect(incidents).toEqual([
      expect.objectContaining({
        system: 'checkout-service',
        severity: 'High',
        message: 'SQL injection risk',
        source: 'SonarQube',
      }),
      expect.objectContaining({
        system: 'checkout-service',
        severity: 'Low',
        message: 'Naming convention violation',
        source: 'SonarQube',
      }),
    ]);

    await expect(db.scanHistory.toArray()).resolves.toEqual([
      expect.objectContaining({ source: 'SonarQube quality scan', issuesFound: 2 }),
    ]);
  });

  it('normalizes GuardDuty severity and preserves an audit record for zero findings', async () => {
    const result = await ingestSignal(
      {
        source: 'aws.guardduty',
        detail: {
          findings: [
            {
              resource: { resourceType: 'Instance' },
              severity: 8.2,
              title: 'Suspicious network activity',
              createdAt: '2026-08-21T13:00:00.000Z',
            },
          ],
        },
      },
      'AWS security scan',
    );

    expect(result).toMatchObject({ issuesFound: 1, adapter: 'AWS GuardDuty' });
    await expect(db.incidents.toArray()).resolves.toEqual([
      expect.objectContaining({
        system: 'AWS - Instance',
        severity: 'High',
        message: 'Suspicious network activity',
        source: 'AWS GuardDuty',
      }),
    ]);

    await ingestSignal({ issues: [] }, 'Empty SonarQube scan');

    await expect(db.scanHistory.orderBy('source').toArray()).resolves.toEqual([
      expect.objectContaining({ source: 'AWS security scan', issuesFound: 1 }),
      expect.objectContaining({ source: 'Empty SonarQube scan', issuesFound: 0 }),
    ]);
  });

  it('rejects unsupported payloads without recording an incident or scan', async () => {
    await expect(ingestSignal({ alert: 'unknown format' })).rejects.toThrow(
      'Unsupported signal format',
    );

    await expect(db.incidents.count()).resolves.toBe(0);
    await expect(db.scanHistory.count()).resolves.toBe(0);
  });
});
