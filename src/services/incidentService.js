import { apiGet, apiPost } from '../api/client';

export async function getIncidents(filters = {}) {
  return apiGet('/incidents', filters);
}

export async function getIncidentById(id) {
  return apiGet(`/incidents/${id}`);
}

export async function getActiveIncidents(limit = 5) {
  return apiGet('/incidents/active', { limit });
}

export async function resolveIncident(id) {
  return apiPost(`/incidents/${id}/resolve`);
}

export async function ignoreIncident(id) {
  return apiPost(`/incidents/${id}/ignore`);
}

export async function assignIncident(id, assignee) {
  return apiPost(`/incidents/${id}/assign`, { assignee });
}

export async function getIncidentServices() {
  return apiGet('/incidents/services');
}

export async function searchIncidents(query) {
  return apiGet('/incidents', { search: query });
}

export async function getOpenIncidentCount() {
  const incidents = await getActiveIncidents(100);
  return incidents.length;
}
