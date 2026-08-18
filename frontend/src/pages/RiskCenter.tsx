import React, { useEffect, useState, useCallback } from 'react';
import { fetchIncidents, simulateWarehouseBottleneck } from '../api/client';
import type { Incident } from '../types';
import { 
  ShieldAlert, 
  RefreshCw, 
  Zap, 
  Building2, 
  Truck, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  DollarSign,
  Network,
  ShieldCheck
} from 'lucide-react';

export const RiskCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidentAlert, setIncidentAlert] = useState<{
    show: boolean;
    title: string;
    rootCause: string;
    impact: number;
    shipmentCount: number;
    customerCount: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchIncidents();
      setIncidents(data);
      if (data.length > 0) {
        setSelectedIncident(data[0]);
      } else {
        setSelectedIncident(null);
      }
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSimulateBottleneck = async () => {
    try {
      setSimulating(true);
      const updatedIncident = await simulateWarehouseBottleneck();
      setIncidents([updatedIncident]);
      setSelectedIncident(updatedIncident);

      setIncidentAlert({
        show: true,
        title: updatedIncident.title,
        rootCause: updatedIncident.root_cause,
        impact: updatedIncident.financial_impact,
        shipmentCount: updatedIncident.affected_shipments.length,
        customerCount: updatedIncident.affected_customers.length
      });
    } catch (err) {
      console.error('Failed to simulate bottleneck:', err);
      alert('Failed to simulate warehouse bottleneck');
    } finally {
      setSimulating(false);
    }
  };

  const totalFinancialRisk = incidents.reduce((acc, inc) => acc + inc.financial_impact, 0);
  const totalShipmentsAffected = new Set(incidents.flatMap(i => i.affected_shipments)).size;
  const totalCustomersAffected = new Set(incidents.flatMap(i => i.affected_customers)).size;

  if (loading && incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <span className="text-slate-400 text-xs font-mono">Aggregating Root Cause Intelligence Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Bottleneck Alert Banner */}
      {incidentAlert?.show && (
        <div className="bg-rose-950/90 border-2 border-rose-600 p-5 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-900 border border-rose-500 text-white shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-wide uppercase font-mono">
                    Warehouse Bottleneck Incident Detected!
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-900 text-rose-200 rounded font-mono font-bold">
                    SYSTEM EXCEPTION
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-1">
                  Root Cause: <strong className="text-white">{incidentAlert.rootCause}</strong>
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
                  <span className="text-rose-300">
                    Affected Shipments: <strong className="text-white font-bold">{incidentAlert.shipmentCount}</strong>
                  </span>
                  <span className="text-rose-300">
                    Impacted Customers: <strong className="text-white font-bold">{incidentAlert.customerCount}</strong>
                  </span>
                  <span className="text-rose-300">
                    Financial Impact: <strong className="text-amber-300 font-bold">₹{(incidentAlert.impact / 100000).toFixed(2)} Lakhs</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIncidentAlert(null)}
              className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold border border-rose-700 transition cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Root Cause & Exception Intelligence</h2>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono">
              Phase 5 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Correlated incident intelligence preventing alert fatigue by grouping cascading supply chain anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateBottleneck}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-rose-100 text-xs font-bold border border-rose-800/80 transition cursor-pointer disabled:opacity-50 glow-rose"
          >
            <Zap className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
            <span>Simulate Warehouse Bottleneck</span>
          </button>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Executive Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`tech-card border-t-2 p-5 rounded-2xl ${incidents.length > 0 ? 'border-t-rose-500' : 'border-t-emerald-500'}`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Incidents</span>
              <div className={`text-3xl font-black mt-1 ${incidents.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {incidents.length}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${incidents.length > 0 ? 'bg-rose-950/60 text-rose-400 border-rose-800/60' : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'}`}>
              {incidents.length > 0 ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">
            {incidents.length > 0 ? 'Correlated root-cause clusters' : 'All incidents mitigated'}
          </div>
        </div>

        <div className="tech-card border-t-2 border-t-amber-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Shipments At Risk</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{totalShipmentsAffected}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Downstream cargo impacted</div>
        </div>

        <div className="tech-card border-t-2 border-t-cyan-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Impacted Customers</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">{totalCustomersAffected}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Tier-1 accounts notified</div>
        </div>

        <div className="tech-card border-t-2 border-t-purple-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Cumulative SLA Risk</span>
              <div className="text-3xl font-black text-purple-400 mt-1">₹{(totalFinancialRisk / 100000).toFixed(2)} L</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-sans">Total contractual exposure</div>
        </div>
      </div>

      {/* When 0 incidents are active (Post-Recovery Plan State) */}
      {incidents.length === 0 && (
        <div className="tech-card border-t-2 border-t-emerald-500 p-8 rounded-2xl text-center space-y-4 bg-[#070b14]/90">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">All Correlated Incidents Mitigated & Resolved</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              The applied recovery mitigation plan successfully resolved outbound queue delays, cleared shipment bottlenecks, and restored On-Time delivery rates.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSimulateBottleneck}
              className="px-5 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800 text-xs font-bold font-mono transition cursor-pointer flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Warehouse Bottleneck (Trigger Crisis)</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Incident Dependency Cascade Tree */}
      {selectedIncident && (
        <div className="tech-card border-t-2 border-t-blue-500 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-white tracking-tight">{selectedIncident.title}</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  selectedIncident.severity === 'Critical' 
                    ? 'bg-rose-950 text-rose-300 border-rose-800 glow-rose animate-pulse'
                    : 'bg-amber-950 text-amber-300 border-amber-800 glow-amber'
                }`}>
                  {selectedIncident.severity} Severity ({selectedIncident.probability}% confidence)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                <strong className="text-rose-400">ROOT CAUSE:</strong> {selectedIncident.root_cause}
              </p>
            </div>

            <div className="text-right font-mono shrink-0">
              <div className="text-lg font-bold text-rose-400">₹{(selectedIncident.financial_impact / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[11px] text-slate-400 font-sans">Projected Financial Risk</div>
            </div>
          </div>

          {/* Dependency Cascade Visualizer (Warehouse -> Shipments -> Customers) */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" /> Incident Dependency Propagation Graph
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Facility Source Node */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" /> SOURCE FACILITY
                  </span>
                  <span className="text-rose-400 font-bold">Bottleneck Point</span>
                </div>
                <div className="font-bold text-white text-sm">{selectedIncident.affected_warehouse_name}</div>
                <div className="text-[11px] font-mono text-slate-400">Node ID: {selectedIncident.affected_warehouse_id}</div>
                <div className="mt-2 text-[11px] text-amber-400 font-mono">Capacity Constraint: -40% Dispatch Speed</div>
              </div>

              {/* 2. Affected Shipments Node */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-cyan-400" /> AFFECTED SHIPMENTS ({selectedIncident.affected_shipments.length})
                  </span>
                  <span className="text-amber-400 font-bold">In-Queue</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 font-mono">
                  {selectedIncident.affected_shipments.map(shpId => (
                    <span key={shpId} className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold">
                      {shpId}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Delay Escalation: +4.5 hrs average SLA drift
                </div>
              </div>

              {/* 3. Impacted Customers Node */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" /> IMPACTED CUSTOMERS ({selectedIncident.affected_customers.length})
                  </span>
                  <span className="text-rose-400 font-bold">SLA Breach Risk</span>
                </div>
                <div className="space-y-1 font-sans">
                  {selectedIncident.affected_customers.map((cust, idx) => (
                    <div key={idx} className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      {cust}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Mitigations */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> AI-Recommended Recovery Actions (Ready for Phase 6 Simulator)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedIncident.recommended_actions.map((act, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 flex flex-col justify-between">
                  <p className="leading-relaxed">{act}</p>
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Ready in Recovery Simulator
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incidents Table / Master List (Only shown if incidents exist) */}
      {incidents.length > 0 && (
        <div className="tech-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Correlated Incident Master Registry</h3>
            <span className="text-xs text-slate-400 font-mono">{incidents.length} Correlated Incidents</span>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-5 cursor-pointer transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isSelected ? 'bg-blue-950/30 border-l-4 border-l-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-white text-sm">{inc.id}</span>
                      <span className="font-bold text-slate-200 text-sm font-sans">{inc.title}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        inc.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans line-clamp-1">
                      <strong className="text-slate-300">Root Cause:</strong> {inc.root_cause}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Facility: <strong className="text-slate-300">{inc.affected_warehouse_id}</strong></span>
                      <span>Shipments: <strong className="text-cyan-400">{inc.affected_shipments.join(', ')}</strong></span>
                      <span>Customers: <strong className="text-purple-400">{inc.affected_customers.length} Accounts</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-rose-400">₹{(inc.financial_impact / 100000).toFixed(2)} L</div>
                    <div className="text-[10px] text-slate-500 font-sans">Est. Financial Risk</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
