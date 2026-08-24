import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileStack,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Inbox,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/StatCard/StatCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import IncidentCard from '../../components/IncidentCard/IncidentCard';
import { SkeletonTable, ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getRecentFiles, getProcessingChartData } from '../../services/fileService';
import { getActiveIncidents } from '../../services/incidentService';
import { getDashboardStats } from '../../services/notificationService';
import { KPI_TRENDS } from '../../utils/constants';
import { getFileStatusColor } from '../../utils/statusColors';
import {
  formatFileSize,
  formatTime,
  formatDuration,
} from '../../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('24h');

  const { data: recentFiles, loading: filesLoading, error: filesError } = useAsyncData(
    () => getRecentFiles(6),
    []
  );

  const { data: incidents, loading: incidentsLoading } = useAsyncData(
    () => getActiveIncidents(4),
    []
  );

  const { data: stats } = useAsyncData(() => getDashboardStats(), []);

  const { data: chartData, loading: chartLoading } = useAsyncData(
    () => getProcessingChartData(chartPeriod),
    [chartPeriod]
  );

  const kpi = stats ?? {
    totalFiles: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    openIncidents: 0,
    dlqMessages: 0,
  };

  const fileColumns = [
    { key: 'id', label: 'File ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'name', label: 'File Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'type', label: 'Type' },
    { key: 'size', label: 'Size', render: (r) => formatFileSize(r.size) },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'uploadedAt', label: 'Upload Time', render: (r) => formatTime(r.uploadedAt) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <StatusBadge status={r.status} color={getFileStatusColor(r.status)} />
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (r) => formatDuration(r.processingDuration),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/files/${r.id}`);
          }}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="page-container space-y-8">
      <div>
        <h1 className="page-title">Operations Dashboard</h1>
        <p className="page-subtitle">
          Monitor file processing, incidents, and system health
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Files"
          value={kpi.totalFiles}
          icon={FileStack}
          trend={KPI_TRENDS.totalFiles}
          description="All time uploads"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Processing"
          value={kpi.processing}
          icon={Loader2}
          trend={KPI_TRENDS.processing}
          description="Currently in pipeline"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Completed"
          value={kpi.completed}
          icon={CheckCircle2}
          trend={KPI_TRENDS.completed}
          description="Successfully processed"
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Failed"
          value={kpi.failed}
          icon={XCircle}
          trend={KPI_TRENDS.failed}
          description="Processing failures"
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <StatCard
          title="Open Incidents"
          value={kpi.openIncidents}
          icon={AlertTriangle}
          trend={KPI_TRENDS.openIncidents}
          description="Requires attention"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="DLQ Messages"
          value={kpi.dlqMessages}
          icon={Inbox}
          trend={KPI_TRENDS.dlqMessages}
          description="Dead letter queue"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Processing Overview</h2>
            <p className="text-sm text-slate-500 mt-0.5">File processing pipeline metrics</p>
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {[
              { key: '24h', label: 'Last 24 Hours' },
              { key: '7d', label: 'Last 7 Days' },
              { key: '30d', label: 'Last 30 Days' },
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setChartPeriod(period.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  chartPeriod === period.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {chartLoading ? (
          <div className="h-72 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="successful" name="Successful" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="processing" name="Processing" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Active Incidents</h2>
            <Link
              to="/incidents"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All Incidents
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {incidentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {incidents?.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent File Activity</h2>
            <Link
              to="/files"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All Files
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {filesLoading ? (
            <SkeletonTable rows={5} cols={8} />
          ) : filesError ? (
            <ErrorState title="Unable to load file data" />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-slate-50/80">
                      {fileColumns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentFiles?.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/files/${row.id}`)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        {fileColumns.map((col) => (
                          <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                            {col.render ? col.render(row) : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
