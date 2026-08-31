import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, RotateCcw, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Timeline from '../../components/Timeline/Timeline';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import { getFileById, retryFile, reprocessFile } from '../../services/fileService';
import { getFileStatusColor } from '../../utils/statusColors';
import {
  formatFileSize,
  formatDateTime,
  formatDuration,
} from '../../utils/formatters';

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { data: file, loading, error, refetch } = useAsyncData(
    () => getFileById(id),
    [id]
  );

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (confirmAction === 'retry') {
        await retryFile(id);
        addToast('File processing retry initiated');
      } else if (confirmAction === 'reprocess') {
        await reprocessFile(id);
        addToast('File reprocessing initiated');
      }
      setConfirmAction(null);
      refetch();
    } catch {
      // Error toast shown by API client
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="page-container">
        <ErrorState
          title="Unable to load file data"
          description={error || 'File not found'}
          onRetry={() => navigate('/files')}
        />
      </div>
    );
  }

  const infoItems = [
    { label: 'File ID', value: file.id },
    { label: 'File Type', value: file.type },
    { label: 'File Size', value: formatFileSize(file.size) },
    { label: 'Uploaded By', value: file.uploadedBy },
    { label: 'Uploaded At', value: formatDateTime(file.uploadedAt) },
    { label: 'Processing Started', value: formatDateTime(file.processingStarted) },
    { label: 'Processing Completed', value: formatDateTime(file.processingCompleted) },
    { label: 'Processing Duration', value: formatDuration(file.processingDuration) },
  ];

  return (
    <div className="page-container space-y-6">
      <div>
        <Link
          to="/files"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Files
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="page-title">{file.name}</h1>
              <StatusBadge status={file.status} color={getFileStatusColor(file.status)} size="md" />
            </div>
            <p className="text-sm text-slate-500 mt-1 font-mono">{file.id}</p>
          </div>
          <div className="flex gap-2">
            {(file.status === 'Failed' || file.status === 'Quarantined') && (
              <button onClick={() => setConfirmAction('retry')} className="btn-primary">
                <RefreshCw className="w-4 h-4" />
                Retry Processing
              </button>
            )}
            {file.status === 'Completed' && (
              <button onClick={() => setConfirmAction('reprocess')} className="btn-secondary">
                <RotateCcw className="w-4 h-4" />
                Reprocess File
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">File Information</h2>
            <dl className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-slate-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-slate-900 mt-0.5">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-6">Processing Timeline</h2>
            <Timeline items={file.timeline} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmAction === 'retry'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Retry Processing"
        message={`Are you sure you want to retry processing for "${file.name}"?`}
        confirmLabel="Retry"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={confirmAction === 'reprocess'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Reprocess File"
        message={`Are you sure you want to reprocess "${file.name}"? This will restart the entire pipeline.`}
        confirmLabel="Reprocess"
        loading={actionLoading}
      />
    </div>
  );
}
