import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function StatCard({ title, value, icon: Icon, trend, description, iconColor = 'text-brand-600', iconBg = 'bg-brand-50' }) {
  const isUp = trend?.direction === 'up';

  return (
    <div className="card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-slate-900 tracking-tight">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        <p className="text-sm font-medium text-slate-700 mt-1">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
