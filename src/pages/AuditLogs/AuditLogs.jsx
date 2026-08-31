import { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getAuditLogs, getAuditActions, getAuditUsers } from '../../services/auditService';
import { getAuditStatusColor } from '../../utils/statusColors';
import { formatDateTime } from '../../utils/formatters';

export default function AuditLogs() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data: logs, loading, error, refetch } = useAsyncData(
    () => getAuditLogs(filters),
    [JSON.stringify(filters)]
  );

  const { data: actions = [] } = useAsyncData(() => getAuditActions(), []);
  const { data: users = [] } = useAsyncData(() => getAuditUsers(), []);

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (r) => (
        <span className="text-xs whitespace-nowrap">{formatDateTime(r.timestamp)}</span>
      ),
    },
    { key: 'user', label: 'User', render: (r) => <span className="text-xs">{r.user}</span> },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.action}</span>
      ),
    },
    { key: 'resource', label: 'Resource' },
    { key: 'resourceId', label: 'Resource ID', render: (r) => <span className="font-mono text-xs">{r.resourceId}</span> },
    { key: 'ipAddress', label: 'IP Address', render: (r) => <span className="font-mono text-xs">{r.ipAddress}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <StatusBadge status={r.status} color={getAuditStatusColor(r.status)} />
      ),
    },
  ];

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">Track all operational actions and system events</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="select-field"
            value={filters.user || ''}
            onChange={(e) => {
              setFilters({ ...filters, user: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <select
            className="select-field"
            value={filters.action || ''}
            onChange={(e) => {
              setFilters({ ...filters, action: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            className="select-field"
            value={filters.status || ''}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {['Success', 'Failed', 'Warning'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            className="select-field"
            value={filters.date || ''}
            onChange={(e) => {
              setFilters({ ...filters, date: e.target.value || undefined });
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : error ? (
        <ErrorState title="Unable to load audit logs" onRetry={refetch} />
      ) : (logs ?? []).length === 0 ? (
        <EmptyState title="No audit logs found" description="No logs match your current filters." />
      ) : (
        <DataTable
          columns={columns}
          data={logs ?? []}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
