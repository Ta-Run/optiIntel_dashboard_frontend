import { apiGet, apiPost } from '../api/client';

export async function getJobs(filters = {}) {
  return apiGet('/jobs', filters);
}

export async function getJobById(id) {
  return apiGet(`/jobs/${id}`);
}

export async function cancelJob(id) {
  return apiPost(`/jobs/${id}/cancel`);
}

export async function retryJob(id) {
  return apiPost(`/jobs/${id}/retry`);
}
