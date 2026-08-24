import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, XCircle } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import { getJobs, retryJob, cancelJob } from '../../services/jobService';
import { getJobStatusColor } from '../../utils/statusColors';
import { formatDateTime, formatDuration } from '../../utils/formatters';

export default function ProcessingJobs() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { data: jobs, loading, error, refetch } = useAsyncData(
    () => getJobs(filters),
    [JSON.stringify(filters)]
  );

  const handleAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'retry') {
        await retryJob(confirmAction.job.id);
        addToast(`Job ${confirmAction.job.id} retry initiated`);
      } else if (confirmAction.type === 'cancel') {
        await cancelJob(confirmAction.job.id);
        addToast(`Job ${confirmAction.job.id} cancelled`);
      }
      setConfirmAction(null);
      refetch();
    } catch {
      addToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Job ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'fileId', label: 'File ID', render: (r) => <span className="font-mono text-xs">{r.fileId}</span> },
    { key: 'fileName', label: 'File Name', render: (r) => <span className="max-w-[180px] truncate block">{r.fileName}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} color={getJobStatusColor(r.status)} />,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (r) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                r.status === 'Failed' ? 'bg-red-500' : r.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand-500'
              }`}
              style={{ width: `${r.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{r.progress}%</span>
        </div>
      ),
    },
    { key: 'service', label: 'Service' },
    { key: 'retryCount', label: 'Retries' },
    {
      key: 'startedAt',
      label: 'Started',
      render: (r) => (r.startedAt ? formatDateTime(r.startedAt) : '—'),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (r) => formatDuration(r.duration),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1">
          {r.status === 'Failed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: 'retry', job: r });
              }}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
              title="Retry job"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {(r.status === 'Running' || r.status === 'Pending') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ type: 'cancel', job: r });
              }}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600"
              title="Cancel job"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="page-title">Processing Jobs</h1>
        <p className="page-subtitle">Monitor async file processing jobs</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="select-field"
            value={filters.status || ''}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {['Pending', 'Running', 'Completed', 'Failed', 'Cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={10} />
      ) : error ? (
        <ErrorState title="Unable to load jobs" onRetry={refetch} />
      ) : jobs?.length === 0 ? (
        <EmptyState title="No processing jobs" description="Jobs will appear when files enter the pipeline." />
      ) : (
        <DataTable
          columns={columns}
          data={jobs}
          onRowClick={(row) => navigate(`/files/${row.fileId}`)}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title={confirmAction?.type === 'retry' ? 'Retry Job' : 'Cancel Job'}
        message={
          confirmAction?.type === 'retry'
            ? `Are you sure you want to retry job ${confirmAction?.job?.id}?`
            : `Are you sure you want to cancel job ${confirmAction?.job?.id}?`
        }
        confirmLabel={confirmAction?.type === 'retry' ? 'Retry' : 'Cancel Job'}
        variant={confirmAction?.type === 'cancel' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
