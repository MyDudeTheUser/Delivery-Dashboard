import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db, seedDatabase } from './db';

async function clearDashboardData() {
  await db.transaction(
    'rw',
    db.systemHealth,
    db.incidents,
    db.releases,
    db.sprintStatus,
    db.enterpriseMetrics,
    db.scanHistory,
    async () => {
      await Promise.all([
        db.systemHealth.clear(),
        db.incidents.clear(),
        db.releases.clear(),
        db.sprintStatus.clear(),
        db.enterpriseMetrics.clear(),
        db.scanHistory.clear(),
      ]);
    },
  );
}

describe('DeliveryDashboardDB', () => {
  beforeEach(async () => {
    await clearDashboardData();
  });

  afterEach(async () => {
    await clearDashboardData();
  });

  it('seeds each dashboard data set once for an empty local database', async () => {
    await seedDatabase();

    await expect(db.systemHealth.count()).resolves.toBe(2);
    await expect(db.incidents.count()).resolves.toBe(2);
    await expect(db.releases.count()).resolves.toBe(2);
    await expect(db.sprintStatus.count()).resolves.toBe(1);
    await expect(db.enterpriseMetrics.count()).resolves.toBe(1);

    await seedDatabase();

    await expect(db.incidents.count()).resolves.toBe(2);
    await expect(db.systemHealth.count()).resolves.toBe(2);
  });

  it('orders incident records by the indexed timestamp field', async () => {
    await db.incidents.bulkAdd([
      {
        system: 'orders-api',
        severity: 'Low',
        message: 'Earlier finding',
        timestamp: '2026-08-21T08:00:00.000Z',
      },
      {
        system: 'orders-api',
        severity: 'High',
        message: 'Latest finding',
        timestamp: '2026-08-21T10:00:00.000Z',
      },
    ]);

    const incidents = await db.incidents.orderBy('timestamp').reverse().toArray();

    expect(incidents.map((incident) => incident.message)).toEqual([
      'Latest finding',
      'Earlier finding',
    ]);
  });
});
