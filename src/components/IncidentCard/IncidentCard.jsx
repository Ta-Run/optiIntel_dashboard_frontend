import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import { getIncidentSeverityColor, getIncidentStatusColor } from '../../utils/statusColors';
import { formatRelativeTime } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';

export default function IncidentCard({ incident }) {
  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="block card p-4 hover:shadow-elevated transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500">{incident.id}</span>
            <StatusBadge
              status={incident.severity}
              color={getIncidentSeverityColor(incident.severity)}
            />
            <StatusBadge
              status={incident.status}
              color={getIncidentStatusColor(incident.status)}
            />
          </div>
          <h3 className="text-sm font-medium text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">
            {incident.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>{incident.service}</span>
            <span>·</span>
            <span>{formatRelativeTime(incident.createdAt)}</span>
            <span>·</span>
            <span>{incident.affectedFiles} files affected</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}
