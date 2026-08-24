import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import StatCard from '../../components/StatCard/StatCard';
import { ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getReportMetrics, getReportCharts } from '../../services/notificationService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FileStack,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CheckCheck,
} from 'lucide-react';

export default function Reports() {
  const [period, setPeriod] = useState('7d');

  const { data: metrics, loading: metricsLoading, error: metricsError, refetch } = useAsyncData(
    () => getReportMetrics(period),
    [period]
  );

  const { data: charts, loading: chartsLoading } = useAsyncData(
    () => getReportCharts(period),
    [period]
  );

  const periods = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
  ];

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Analytics and performance metrics</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {metricsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : metricsError ? (
        <ErrorState title="Unable to load report data" onRetry={refetch} />
      ) : metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Files Processed"
            value={metrics.filesProcessed}
            icon={FileStack}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Success Rate"
            value={`${metrics.successRate}%`}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Failure Rate"
            value={`${metrics.failureRate}%`}
            icon={XCircle}
            iconColor="text-red-600"
            iconBg="bg-red-50"
          />
          <StatCard
            title="Avg Processing Time"
            value={`${metrics.avgProcessingTime}s`}
            icon={Clock}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
          <StatCard
            title="Incidents Created"
            value={metrics.incidentsCreated}
            icon={AlertTriangle}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Incidents Resolved"
            value={metrics.incidentsResolved}
            icon={CheckCheck}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
        </div>
      )}

      {chartsLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : charts && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Processing Volume</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.processingVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" name="Files" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Failure Rate (%)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={charts.failureRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" name="Failure Rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Incident Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.incidentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="created" name="Created" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Processing Time (seconds)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={charts.processingTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" name="Avg Time (s)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
