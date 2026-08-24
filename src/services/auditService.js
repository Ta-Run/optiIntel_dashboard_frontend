import { apiGet } from '../api/client';

export async function getAuditLogs(filters = {}) {
  return apiGet('/audit-logs', filters);
}

export async function getAuditActions() {
  return apiGet('/audit-logs/actions');
}

export async function getAuditUsers() {
  return apiGet('/audit-logs/users');
}

export async function logAction(action) {
  return { success: true, action };
}
