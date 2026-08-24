import StatusBadge from '../StatusBadge/StatusBadge';
import { getServiceStatusColor } from '../../utils/statusColors';
import { formatRelativeTime } from '../../utils/formatters';
import { Activity, Clock, AlertTriangle, Zap } from 'lucide-react';

export default function ServiceStatus({ service }) {
  return (
    <div className="card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{service.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
        </div>
        <StatusBadge
          status={service.status}
          color={getServiceStatusColor(service.status)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Latency</p>
            <p className="text-sm font-medium text-slate-900">{service.latency}ms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Error Rate</p>
            <p className="text-sm font-medium text-slate-900">{service.errorRate}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Requests</p>
            <p className="text-sm font-medium text-slate-900">
              {service.requests.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Last Check</p>
            <p className="text-sm font-medium text-slate-900">
              {formatRelativeTime(service.lastHealthCheck)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
