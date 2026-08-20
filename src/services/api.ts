// src/services/api.ts
// Central API service for real and mock data integration

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
});

// Example: ServiceNow Incidents
export async function fetchIncidents() {
  try {
    const response = await apiClient.get('/incidents');
    return response.data;
  } catch (error) {
    console.warn('API call failed, falling back to mock data for incidents', error);
    return [
      { id: 1, system: 'App1', severity: 'High', message: 'CPU usage high' },
      { id: 2, system: 'App2', severity: 'Medium', message: 'Memory warning' },
    ];
  }
}

// Example: Jira Sprint Status
export async function fetchSprintStatus() {
  try {
    const response = await apiClient.get('/sprint-status');
    return response.data;
  } catch (error) {
    console.warn('API call failed, falling back to mock data for sprint status', error);
    return [
      { sprint: 'Sprint 42', status: 'In Progress', completed: 12, total: 20 },
      { sprint: 'Sprint 41', status: 'Completed', completed: 20, total: 20 },
    ];
  }
}

// Example: System Health Metrics
export async function fetchSystemHealth() {
  try {
    const response = await apiClient.get('/system-health');
    return response.data;
  } catch (error) {
    console.warn('API call failed, falling back to mock data for system health', error);
    return [
      { system: 'App1', cpu: 85, memory: 70, status: 'warning' },
      { system: 'App2', cpu: 45, memory: 60, status: 'ok' },
    ];
  }
}

// Add more API functions as needed for releases, knowledge hub, etc.
