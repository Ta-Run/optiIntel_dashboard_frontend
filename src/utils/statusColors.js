export function getFileStatusColor(status) {
  const map = {
    Uploaded: 'blue',
    Validating: 'yellow',
    Processing: 'purple',
    Completed: 'green',
    Failed: 'red',
    Quarantined: 'orange',
  };
  return map[status] || 'gray';
}

export function getIncidentSeverityColor(severity) {
  const map = {
    Critical: 'red',
    High: 'orange',
    Medium: 'yellow',
    Low: 'blue',
  };
  return map[severity] || 'gray';
}

export function getIncidentStatusColor(status) {
  const map = {
    Open: 'red',
    Investigating: 'yellow',
    Resolved: 'green',
    Ignored: 'gray',
  };
  return map[status] || 'gray';
}

export function getServiceStatusColor(status) {
  const map = {
    Healthy: 'green',
    Degraded: 'yellow',
    Down: 'red',
  };
  return map[status] || 'gray';
}

export function getJobStatusColor(status) {
  const map = {
    Pending: 'gray',
    Running: 'blue',
    Completed: 'green',
    Failed: 'red',
    Cancelled: 'orange',
  };
  return map[status] || 'gray';
}

export function getDLQStatusColor(status) {
  const map = {
    Failed: 'red',
    Retrying: 'yellow',
    Resolved: 'green',
    Deleted: 'gray',
  };
  return map[status] || 'gray';
}

export function getAuditStatusColor(status) {
  const map = {
    Success: 'green',
    Failed: 'red',
    Warning: 'yellow',
  };
  return map[status] || 'gray';
}
