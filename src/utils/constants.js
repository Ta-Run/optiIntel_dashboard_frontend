export const FILE_STATUSES = [
  'Uploaded',
  'Validating',
  'Processing',
  'Completed',
  'Failed',
  'Quarantined',
];

export const INCIDENT_SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

export const INCIDENT_STATUSES = ['Open', 'Investigating', 'Resolved', 'Ignored'];

export const SERVICE_STATUSES = ['Healthy', 'Degraded', 'Down'];

export const ACCEPTED_FILE_TYPES = ['CSV', 'JSON', 'XML', 'XLSX', 'PDF'];

export const ACCEPTED_EXTENSIONS = ['.csv', '.json', '.xml', '.xlsx', '.pdf'];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/files', label: 'Files', icon: 'FileStack' },
  { path: '/incidents', label: 'Incidents', icon: 'AlertTriangle' },
  { path: '/jobs', label: 'Processing Jobs', icon: 'Cog' },
  { path: '/operations', label: 'Operations', icon: 'Activity' },
  { path: '/dlq', label: 'Dead Letter Queue', icon: 'Inbox' },
  { path: '/audit-logs', label: 'Audit Logs', icon: 'ScrollText' },
  { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const KPI_STATS = {
  totalFiles: 12842,
  processing: 342,
  completed: 11926,
  failed: 214,
  openIncidents: 37,
  dlqMessages: 8,
};

export const KPI_TRENDS = {
  totalFiles: { value: 4.2, direction: 'up' },
  processing: { value: 12.5, direction: 'up' },
  completed: { value: 3.8, direction: 'up' },
  failed: { value: 2.1, direction: 'down' },
  openIncidents: { value: 8.3, direction: 'down' },
  dlqMessages: { value: 14.0, direction: 'up' },
};
