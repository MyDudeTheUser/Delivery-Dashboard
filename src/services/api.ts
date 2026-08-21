// src/services/api.ts
// Central API service using local database

import { db } from './db';

export async function fetchIncidents() {
  return await db.incidents.toArray();
}

export async function fetchSprintStatus() {
  return await db.sprintStatus.toArray();
}

export async function fetchSystemHealth() {
  return await db.systemHealth.toArray();
}

export async function fetchReleases() {
  return await db.releases.toArray();
}

export async function fetchEnterpriseMetrics() {
  return await db.enterpriseMetrics.toArray();
}
