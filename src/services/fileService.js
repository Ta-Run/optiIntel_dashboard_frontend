import { apiGet, apiPost, apiUpload } from '../api/client';

export async function getFiles(filters = {}) {
  return apiGet('/files', filters);
}

export async function getFileById(id) {
  return apiGet(`/files/${id}`);
}

export async function getRecentFiles(limit = 5) {
  return apiGet('/files/recent', { limit });
}

export async function getProcessingChartData(period = '24h') {
  return apiGet('/files/chart', { period });
}

export async function uploadFile(fileData) {
  if (fileData instanceof File) {
    return apiUpload('/files/upload', fileData);
  }
  if (fileData?.file instanceof File) {
    return apiUpload('/files/upload', fileData.file);
  }
  throw new Error('No file provided');
}

export async function retryFile(id) {
  return apiPost(`/files/${id}/retry`);
}

export async function reprocessFile(id) {
  return apiPost(`/files/${id}/reprocess`);
}

export async function getFileUploaders() {
  return apiGet('/files/uploaders');
}

export async function searchFiles(query) {
  return apiGet('/files', { search: query });
}
