import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getIncidents, getIncidentServices } from '../../services/incidentService';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '../../utils/constants';
import { getIncidentSeverityColor, getIncidentStatusColor } from '../../utils/statusColors';
import { formatRelativeTime } from '../../utils/formatters';

export default function Incidents() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data: incidents, loading, error, refetch } = useAsyncData(
    () => getIncidents(filters),
    [JSON.stringify(filters)]
  );

  const { data: services = [] } = useAsyncData(() => getIncidentServices(), []);

  const columns = [
    { key: 'id', label: 'Incident ID', render: (r) => <span className="font-mono text-xs font-medium">{r.id}</span> },
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    {
      key: 'severity',
      label: 'Severity',
      render: (r) => (
        <StatusBadge status={r.severity} color={getIncidentSeverityColor(r.severity)} />
      ),
    },
    { key: 'service', label: 'Service' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <StatusBadge status={r.status} color={getIncidentStatusColor(r.status)} />
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (r) => formatRelativeTime(r.createdAt),
    },
    {
      key: 'affectedFiles',
      label: 'Affected Files',
      render: (r) => `${r.affectedFiles} files`,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/incidents/${r.id}`);
          }}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="page-title">Incidents</h1>
        <p className="page-subtitle">Track and manage operational incidents</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="select-field"
            value={filters.severity || ''}
            onChange={(e) => {
              setFilters({ ...filters, severity: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Severities</option>
            {INCIDENT_SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
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
            {INCIDENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="select-field"
            value={filters.service || ''}
            onChange={(e) => {
              setFilters({ ...filters, service: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Services</option>
            {services.map((s) => (
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
        <SkeletonTable rows={6} cols={7} />
      ) : error ? (
        <ErrorState title="Unable to load incident data" onRetry={refetch} />
      ) : incidents?.length === 0 ? (
        <EmptyState title="No incidents found" description="All systems operating normally." />
      ) : (
        <DataTable
          columns={columns}
          data={incidents}
          onRowClick={(row) => navigate(`/incidents/${row.id}`)}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
