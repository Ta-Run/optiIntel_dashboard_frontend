import { useState } from 'react';
import { Eye, RefreshCw, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import {
  getDLQMessages,
  retryDLQMessage,
  deleteDLQMessage,
  getDLQQueues,
} from '../../services/dlqService';
import { getDLQStatusColor } from '../../utils/statusColors';
import { formatTime, formatDateTime } from '../../utils/formatters';

export default function DeadLetterQueue() {
  const { addToast } = useToast();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { data: messages, loading, error, refetch } = useAsyncData(
    () => getDLQMessages(filters),
    [JSON.stringify(filters)]
  );

  const { data: queues = [] } = useAsyncData(() => getDLQQueues(), []);

  const handleAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'retry') {
        await retryDLQMessage(confirmAction.message.id);
        addToast(`Message ${confirmAction.message.id} retry initiated`);
      } else if (confirmAction.type === 'delete') {
        await deleteDLQMessage(confirmAction.message.id);
        addToast(`Message ${confirmAction.message.id} deleted`);
      }
      setConfirmAction(null);
      refetch();
    } catch {
      // Error toast shown by API client
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Message ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'fileId', label: 'File ID', render: (r) => <span className="font-mono text-xs">{r.fileId}</span> },
    { key: 'queue', label: 'Queue', render: (r) => <span className="text-xs">{r.queue}</span> },
    { key: 'failureReason', label: 'Failure Reason' },
    { key: 'retryCount', label: 'Retry Count' },
    { key: 'createdAt', label: 'Created At', render: (r) => formatTime(r.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} color={getDLQStatusColor(r.status)} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMessage(r);
            }}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {r.status === 'Failed' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmAction({ type: 'retry', message: r });
                }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmAction({ type: 'delete', message: r });
                }}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="page-title">Dead Letter Queue</h1>
        <p className="page-subtitle">Manage failed messages requiring manual intervention</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="select-field"
            value={filters.queue || ''}
            onChange={(e) => {
              setFilters({ ...filters, queue: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Queues</option>
            {queues.map((q) => (
              <option key={q} value={q}>{q}</option>
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
            {['Failed', 'Retrying', 'Resolved', 'Deleted'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min retry count"
            className="select-field w-36"
            value={filters.retryCount || ''}
            onChange={(e) => {
              setFilters({ ...filters, retryCount: e.target.value || undefined });
              setPage(1);
            }}
          />
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
        <SkeletonTable rows={8} cols={8} />
      ) : error ? (
        <ErrorState title="Unable to load DLQ messages" onRetry={refetch} />
      ) : messages?.length === 0 ? (
        <EmptyState title="No DLQ messages" description="Dead letter queue is empty." />
      ) : (
        <DataTable
          columns={columns}
          data={messages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Message ID</p>
                <p className="text-sm font-mono font-medium">{selectedMessage.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Queue</p>
                <p className="text-sm font-medium">{selectedMessage.queue}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Retry Count</p>
                <p className="text-sm font-medium">{selectedMessage.retryCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <StatusBadge
                  status={selectedMessage.status}
                  color={getDLQStatusColor(selectedMessage.status)}
                />
              </div>
              <div>
                <p className="text-xs text-slate-500">First Failure</p>
                <p className="text-sm">{formatDateTime(selectedMessage.firstFailure)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Failure</p>
                <p className="text-sm">{formatDateTime(selectedMessage.lastFailure)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Error</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-mono">{selectedMessage.error}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Payload</p>
              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                {JSON.stringify(selectedMessage.payload, null, 2)}
              </pre>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Stack Trace</p>
              <pre className="bg-slate-900 text-red-300 rounded-lg p-4 text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                {selectedMessage.stackTrace}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title={confirmAction?.type === 'retry' ? 'Retry Message' : 'Delete Message'}
        message={
          confirmAction?.type === 'retry'
            ? `Are you sure you want to retry message ${confirmAction?.message?.id}?`
            : `Are you sure you want to delete message ${confirmAction?.message?.id}? This action cannot be undone.`
        }
        confirmLabel={confirmAction?.type === 'retry' ? 'Retry' : 'Delete'}
        variant={confirmAction?.type === 'delete' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
