import { apiGet, apiPost } from '../api/client';

export async function getNotifications() {
  return apiGet('/notifications');
}

export async function markNotificationRead(id) {
  return apiPost(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  return apiPost('/notifications/read-all');
}

export function getUnreadCount(notifications) {
  return (notifications ?? []).filter((n) => !n.read).length;
}

export async function getReportMetrics(period = '7d') {
  return apiGet('/reports/summary', { period });
}

export async function getReportCharts(period = '7d') {
  return apiGet('/reports/charts', { period });
}

export async function getDashboardStats() {
  return apiGet('/reports/dashboard');
}

export async function globalSearch(query) {
  return apiGet('/search', { q: query });
}
