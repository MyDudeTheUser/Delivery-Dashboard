// src/services/api.ts
// Central API service for real and mock data integration

// import axios from 'axios';

// Example: ServiceNow Incidents (mock)
export async function fetchIncidents() {
  // Replace with real API call
  return Promise.resolve([
    { id: 1, system: 'App1', severity: 'High', message: 'CPU usage high' },
    { id: 2, system: 'App2', severity: 'Medium', message: 'Memory warning' },
  ]);
}

// Example: Jira Sprint Status (mock)
export async function fetchSprintStatus() {
  // Replace with real API call
  return Promise.resolve([
    { sprint: 'Sprint 42', status: 'In Progress', completed: 12, total: 20 },
    { sprint: 'Sprint 41', status: 'Completed', completed: 20, total: 20 },
  ]);
}

// Example: System Health Metrics (mock)
export async function fetchSystemHealth() {
  // Replace with real API call
  return Promise.resolve([
    { system: 'App1', cpu: 85, memory: 70, status: 'warning' },
    { system: 'App2', cpu: 45, memory: 60, status: 'ok' },
  ]);
}

// Add more API functions as needed for releases, knowledge hub, etc.
