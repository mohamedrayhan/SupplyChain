import React, { useEffect, useState, useCallback } from 'react';
import { fetchDashboardData } from '../api/client';
import type { DashboardResponse } from '../types';
import { KPICards } from '../components/KPICards';
import { ShipmentStatusChart } from '../components/ShipmentStatusChart';
import { WarehouseUtilChart } from '../components/WarehouseUtilChart';
import { HighRiskEvents } from '../components/HighRiskEvents';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardProps {
  setLastUpdated: (d: Date) => void;
  setIsLoadingParent: (b: boolean) => void;
  refreshTrigger: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ setLastUpdated, setIsLoadingParent, refreshTrigger }) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setIsLoadingParent(true);
      setError(null);
      const res = await fetchDashboardData();
      setData(res);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to connect to ChainSight AI Backend Server.');
    } finally {
      setLoading(false);
      setIsLoadingParent(false);
    }
  }, [setLastUpdated, setIsLoadingParent]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData, refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <span className="text-slate-400 text-sm font-medium">Connecting to ChainSight AI Telemetry Hub...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto bg-rose-950/40 border border-rose-800 p-6 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Backend Connection Error</h3>
          <p className="text-sm text-slate-300">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Supply Chain Command Center</h2>
          <p className="text-xs text-slate-400">Unified real-time visibility across warehouses, transporters, and shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
            {data?.kpis.total_warehouses} Warehouses Connected
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      {data && <KPICards kpis={data.kpis} />}

      {/* Analytics Charts */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShipmentStatusChart distribution={data.shipment_status_distribution} />
          <WarehouseUtilChart warehouses={data.warehouse_utilization} />
        </div>
      )}

      {/* Recent Events and Risks */}
      {data && <HighRiskEvents events={data.recent_events} risks={data.high_risk_alerts} />}
    </div>
  );
};
