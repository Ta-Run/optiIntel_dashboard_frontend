import { RefreshCw } from 'lucide-react';
import ServiceStatus from '../../components/ServiceStatus/ServiceStatus';
import { ErrorState } from '../../components/EmptyState/EmptyState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useToast } from '../../context/ToastContext';
import { getServices } from '../../services/serviceHealthService';

export default function Operations() {
  const { addToast } = useToast();

  const { data: services, loading, error, refetch } = useAsyncData(
    () => getServices(),
    []
  );

  const healthyCount = services?.filter((s) => s.status === 'Healthy').length || 0;
  const degradedCount = services?.filter((s) => s.status === 'Degraded').length || 0;
  const downCount = services?.filter((s) => s.status === 'Down').length || 0;

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Operations</h1>
          <p className="page-subtitle">Service health monitoring and control center</p>
        </div>
        <button
          onClick={() => {
            refetch();
            addToast('Service health refreshed', 'info');
          }}
          className="btn-secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {!loading && services && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div>
              <p className="text-2xl font-semibold text-slate-900">{healthyCount}</p>
              <p className="text-xs text-slate-500">Healthy Services</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <p className="text-2xl font-semibold text-slate-900">{degradedCount}</p>
              <p className="text-xs text-slate-500">Degraded Services</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div>
              <p className="text-2xl font-semibold text-slate-900">{downCount}</p>
              <p className="text-xs text-slate-500">Down Services</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Unable to load service data" onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services?.map((service) => (
            <ServiceStatus key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
