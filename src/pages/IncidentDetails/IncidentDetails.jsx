import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  UserPlus,
  CheckCircle,
  Ban,
  FileText,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { IncidentTimeline } from '../../components/Timeline/Timeline';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Modal from '../../components/Modal/Modal';
import { ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import {
  getIncidentById,
  resolveIncident,
  ignoreIncident,
  assignIncident,
} from '../../services/incidentService';
import { retryFile } from '../../services/fileService';
import {
  getIncidentSeverityColor,
  getIncidentStatusColor,
} from '../../utils/statusColors';
import { formatDateTime } from '../../utils/formatters';

export default function IncidentDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignee, setAssignee] = useState('Alex Rivera');

  const { data: incident, loading, error, refetch } = useAsyncData(
    () => getIncidentById(id),
    [id]
  );

  const handleAction = async () => {
    setActionLoading(true);
    try {
      switch (confirmAction) {
        case 'resolve':
          await resolveIncident(id);
          addToast('Incident resolved successfully');
          break;
        case 'ignore':
          await ignoreIncident(id);
          addToast('Incident marked as ignored');
          break;
        case 'retry':
          if (incident?.affectedFileIds?.[0]) {
            await retryFile(incident.affectedFileIds[0]);
            addToast('File processing retry initiated');
          }
          break;
        default:
          break;
      }
      setConfirmAction(null);
      refetch();
    } catch {
      addToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async () => {
    setActionLoading(true);
    try {
      await assignIncident(id, assignee);
      addToast(`Incident assigned to ${assignee}`);
      setShowAssign(false);
      refetch();
    } catch {
      addToast('Failed to assign incident', 'error');
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

  if (error || !incident) {
    return (
      <div className="page-container">
        <ErrorState title="Unable to load incident data" description={error} />
      </div>
    );
  }

  const infoItems = [
    { label: 'Incident ID', value: incident.id },
    { label: 'Service', value: incident.service },
    { label: 'Environment', value: incident.environment },
    { label: 'Created At', value: formatDateTime(incident.createdAt) },
    { label: 'Last Updated', value: formatDateTime(incident.updatedAt) },
    { label: 'Affected Files', value: `${incident.affectedFiles} files` },
    { label: 'Assigned To', value: incident.assignedTo },
  ];

  const isOpen = incident.status === 'Open' || incident.status === 'Investigating';

  return (
    <div className="page-container space-y-6">
      <div>
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incidents
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-slate-500">{incident.id}</p>
            <h1 className="page-title mt-1">{incident.title}</h1>
            <div className="flex items-center mt-2 flex-wrap gap-2">
              <StatusBadge
                status={incident.severity}
                color={getIncidentSeverityColor(incident.severity)}
                size="md"
              />
              <StatusBadge
                status={incident.status}
                color={getIncidentStatusColor(incident.status)}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Description</h2>
            <p className="text-sm text-slate-600">{incident.description}</p>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-6">Incident Timeline</h2>
            <IncidentTimeline items={incident.timeline} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Details</h2>
            <dl className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-slate-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-slate-900 mt-0.5">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {isOpen && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setConfirmAction('retry')}
                  className="btn-secondary w-full justify-start"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Processing
                </button>
                <button
                  onClick={() => setConfirmAction('retry')}
                  className="btn-secondary w-full justify-start"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reprocess File
                </button>
                <button
                  onClick={() => setShowAssign(true)}
                  className="btn-secondary w-full justify-start"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign Incident
                </button>
                <button
                  onClick={() => setConfirmAction('resolve')}
                  className="btn-primary w-full justify-start"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve Incident
                </button>
                <button
                  onClick={() => setConfirmAction('ignore')}
                  className="btn-secondary w-full justify-start"
                >
                  <Ban className="w-4 h-4" />
                  Ignore Incident
                </button>
                <button
                  onClick={() => addToast('Logs viewer coming soon', 'info')}
                  className="btn-secondary w-full justify-start"
                >
                  <FileText className="w-4 h-4" />
                  View Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmAction === 'retry'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Retry Processing"
        message="Are you sure you want to retry processing for affected files?"
        confirmLabel="Retry"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={confirmAction === 'resolve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Resolve Incident"
        message={`Are you sure you want to resolve incident ${incident.id}?`}
        confirmLabel="Resolve"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={confirmAction === 'ignore'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title="Ignore Incident"
        message={`Are you sure you want to ignore incident ${incident.id}? This action can be reversed.`}
        confirmLabel="Ignore"
        loading={actionLoading}
      />

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Incident" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Assign To</label>
            <select
              className="select-field w-full mt-1"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="Alex Rivera">Alex Rivera</option>
              <option value="Jordan Lee">Jordan Lee</option>
              <option value="Sarah Chen">Sarah Chen</option>
              <option value="Mike Johnson">Mike Johnson</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAssign(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAssign} className="btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
