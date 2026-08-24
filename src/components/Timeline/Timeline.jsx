import { CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const statusIcons = {
  completed: CheckCircle2,
  active: Loader2,
  failed: XCircle,
  pending: Circle,
};

const statusColors = {
  completed: 'text-emerald-500',
  active: 'text-brand-500 animate-spin',
  failed: 'text-red-500',
  pending: 'text-slate-300',
};

export default function Timeline({ items }) {
  return (
    <div className="relative">
      {items.map((item, index) => {
        const Icon = statusIcons[item.status] || Circle;
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <div
                className={`absolute left-[11px] top-6 w-0.5 h-full ${
                  item.status === 'completed' ? 'bg-emerald-200' : 'bg-slate-200'
                }`}
              />
            )}
            <div className="relative z-10 flex-shrink-0">
              <Icon className={`w-6 h-6 ${statusColors[item.status]}`} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{item.step}</p>
                {item.timestamp && (
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatTime(item.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{item.service}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IncidentTimeline({ items }) {
  const typeColors = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    success: 'bg-emerald-500',
  };

  return (
    <div className="relative space-y-6">
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${typeColors[item.type] || 'bg-slate-400'}`} />
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <p className="text-xs text-slate-500">{formatTime(item.timestamp)}</p>
            <p className="text-sm text-slate-800 mt-0.5">{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
