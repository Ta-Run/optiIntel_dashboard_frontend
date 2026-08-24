import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Eye, RefreshCw } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import FileUpload from '../../components/FileUpload/FileUpload';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { SkeletonTable, EmptyState, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import { getFiles, uploadFile, retryFile, getFileUploaders } from '../../services/fileService';
import { FILE_STATUSES } from '../../utils/constants';
import { getFileStatusColor } from '../../utils/statusColors';
import {
  formatFileSize,
  formatTime,
  formatDuration,
} from '../../utils/formatters';

export default function Files() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [retryTarget, setRetryTarget] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);

  const { data: files, loading, error, refetch } = useAsyncData(
    () => getFiles(filters),
    [JSON.stringify(filters)]
  );

  const { data: uploaders = [] } = useAsyncData(() => getFileUploaders(), []);

  const handleUploadComplete = async (file) => {
    await uploadFile(file);
    addToast(`${file.name} uploaded successfully`);
    refetch();
  };

  const handleRetry = async () => {
    setRetryLoading(true);
    try {
      await retryFile(retryTarget.id);
      addToast(`Retry initiated for ${retryTarget.name}`);
      setRetryTarget(null);
      refetch();
    } catch {
      addToast('Failed to retry file processing', 'error');
    } finally {
      setRetryLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'File ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'name', label: 'File Name', render: (r) => <span className="font-medium max-w-[200px] truncate block">{r.name}</span> },
    { key: 'type', label: 'File Type' },
    { key: 'size', label: 'Size', render: (r) => formatFileSize(r.size) },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'uploadedAt', label: 'Upload Time', render: (r) => formatTime(r.uploadedAt) },
    {
      key: 'status',
      label: 'Processing Status',
      render: (r) => <StatusBadge status={r.status} color={getFileStatusColor(r.status)} />,
    },
    {
      key: 'duration',
      label: 'Processing Duration',
      render: (r) => formatDuration(r.processingDuration),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/files/${r.id}`);
            }}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {(r.status === 'Failed' || r.status === 'Quarantined') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRetryTarget(r);
              }}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
              title="Retry processing"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Files</h1>
          <p className="page-subtitle">Manage and monitor uploaded files</p>
        </div>
        <div className="flex gap-2">
          <Link to="/files/upload" className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload Files
          </Link>
          <button onClick={() => setShowUpload(true)} className="btn-secondary">
            Quick Upload
          </button>
        </div>
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
            {FILE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="select-field"
            value={filters.type || ''}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            {['CSV', 'JSON', 'XML', 'XLSX', 'PDF'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="select-field"
            value={filters.uploadedBy || ''}
            onChange={(e) => {
              setFilters({ ...filters, uploadedBy: e.target.value || undefined });
              setPage(1);
            }}
          >
            <option value="">All Users</option>
            {uploaders.map((u) => (
              <option key={u} value={u}>{u}</option>
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
          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
              className="btn-secondary text-xs"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={9} />
      ) : error ? (
        <ErrorState title="Unable to load files" onRetry={refetch} />
      ) : files?.length === 0 ? (
        <EmptyState
          title="No files uploaded yet"
          description="Upload your first file to get started with processing."
        />
      ) : (
        <DataTable
          columns={columns}
          data={files}
          onRowClick={(row) => navigate(`/files/${row.id}`)}
          currentPage={page}
          onPageChange={setPage}
          emptyMessage="No files match your filters"
        />
      )}

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Files" size="lg">
        <FileUpload onUploadComplete={handleUploadComplete} />
      </Modal>

      <ConfirmDialog
        isOpen={!!retryTarget}
        onClose={() => setRetryTarget(null)}
        onConfirm={handleRetry}
        title="Retry Processing"
        message={`Are you sure you want to retry processing for "${retryTarget?.name}"?`}
        confirmLabel="Retry"
        loading={retryLoading}
      />
    </div>
  );
}
