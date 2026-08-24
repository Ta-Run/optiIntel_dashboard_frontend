import { apiGet, apiPost, apiDelete } from '../api/client';

export async function getDLQMessages(filters = {}) {
  return apiGet('/dlq', filters);
}

export async function getDLQMessageById(id) {
  return apiGet(`/dlq/${id}`);
}

export async function retryDLQMessage(id) {
  return apiPost(`/dlq/${id}/retry`);
}

export async function deleteDLQMessage(id) {
  return apiDelete(`/dlq/${id}`);
}

export async function getDLQQueues() {
  return apiGet('/dlq/queues');
}

export async function searchDLQ(query) {
  return apiGet('/dlq', { search: query });
}

export async function getDLQCount() {
  const messages = await getDLQMessages({ status: 'Failed' });
  return messages.length;
}
