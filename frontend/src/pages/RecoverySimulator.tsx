import React, { useEffect, useState, useCallback } from 'react';
import { fetchSimulatorEvaluation, applyRecoveryPlan } from '../api/client';
import type { SimulatorEvaluation, RecoveryOption } from '../types';
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  Truck, 
  CheckCheck
} from 'lucide-react';

export const RecoverySimulator: React.FC = () => {
  const [data, setData] = useState<SimulatorEvaluation | null>(null);
  const [selectedAction, setSelectedAction] = useState<RecoveryOption | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applying, setApplying] = useState<boolean>(false);
  const [appliedBanner, setAppliedBanner] = useState<{
    show: boolean;
    title: string;
    onTimeRate: number;
    resolvedCount: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSimulatorEvaluation();
      setData(res);
      if (res.options.length > 0) {
        if (!selectedAction) {
          const rec = res.options.find(o => o.is_recommended) || res.options[0];
          setSelectedAction(rec);
        } else {
          const found = res.options.find(o => o.id === selectedAction.id);
          if (found) setSelectedAction(found);
        }
      }
    } catch (err) {
      console.error('Failed to load simulator data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedAction]);

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyPlan = async () => {
    if (!selectedAction) return;

    try {
      setApplying(true);
      const res = await applyRecoveryPlan(selectedAction.id);

      setAppliedBanner({
        show: true,
        title: selectedAction.title,
        onTimeRate: res.updated_on_time_rate,
        resolvedCount: res.resolved_shipments_count
      });

      await loadData();
    } catch (err) {
      console.error('Failed to apply recovery plan:', err);
      alert('Failed to apply recovery plan');
    } finally {
      setApplying(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <span className="text-slate-400 text-xs font-mono">Initializing What-If Recovery Simulator Sandbox...</span>
      </div>
    );
  }

  const baseline = data?.baseline;
  const baselineOnTime = 78.0;
  const projectedLoss = selectedAction && baseline ? Math.max(0, baseline.potential_sla_loss - selectedAction.expected_benefit) : 320000;
  const projectedOnTime = selectedAction ? selectedAction.sla_recovery_rate : 93.0;
  const surge = (projectedOnTime - baselineOnTime).toFixed(0);

  return (
    <div className="space-y-6 pb-12">
      {/* Execution Success Banner */}
      {appliedBanner?.show && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 p-5 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-900 border border-emerald-500 text-white shrink-0 mt-0.5">
                <CheckCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-wide uppercase font-mono">
                    Recovery Plan Successfully Applied to Production!
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-900 text-emerald-200 rounded font-mono font-bold">
                    SYSTEM RECOVERED
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-1">
                  Plan <strong className="text-white font-semibold">"{appliedBanner.title}"</strong> has been executed. All connected bottleneck shipments have been mitigated to on-time schedules.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
                  <span className="text-emerald-300">
                    On-Time Delivery Rate Restored: <strong className="text-white font-bold text-sm">{appliedBanner.onTimeRate}%</strong>
                  </span>
                  <span className="text-emerald-300">
                    Shipment Bottlenecks Cleared: <strong className="text-white font-bold text-sm">{appliedBanner.resolvedCount} Active Shipments</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setAppliedBanner(null)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold border border-emerald-700 transition cursor-pointer shrink-0"
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
            <h2 className="text-2xl font-bold text-white tracking-tight">What-If Recovery Simulator</h2>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
              Signature Engine • Phase 6
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate, score, and model mitigation strategies before committing changes to production logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Sandbox Mode Active
          </div>
        </div>
      </div>

      {/* Workflow Navigation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-bold border border-slate-700">1. CURRENT STATE</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">2. SELECT ACTION</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">3. SIMULATE</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">4. APPLY TO PROD</span>
        </div>
        <span className="text-[11px] text-slate-500 italic hidden lg:inline">
          *Original production data is protected until operator executes "Apply Recovery Plan"
        </span>
      </div>

      {/* Side-by-Side: Current State (BEFORE) vs Simulated Outcome (AFTER) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CURRENT STATE (BEFORE) */}
        <div className="tech-card border-t-2 border-t-rose-500 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">CURRENT DISRUPTED STATE (BEFORE)</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
              AT-RISK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">On-Time Rate</span>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{baselineOnTime}%</div>
              <span className="text-[10px] text-slate-500">-16% vs target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">High-Risk Loads</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">4</div>
              <span className="text-[10px] text-slate-500">Critical delays</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Potential Loss</span>
              <div className="text-xl font-extrabold text-rose-400 mt-1">₹12.50L</div>
              <span className="text-[10px] text-slate-500">Contractual SLA</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-200 font-sans leading-relaxed">
            <strong>System Bottleneck Detected:</strong> Chennai Loading Dock queue is causing cascade delays for 4 shipments and breaching SLA targets for Tier-1 customer accounts.
          </div>
        </div>

        {/* PROJECTED OUTCOME (AFTER SIMULATION) */}
        <div className="tech-card border-t-2 border-t-emerald-500 p-6 rounded-2xl space-y-4 glow-emerald">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">PROJECTED OUTCOME (AFTER SIMULATION)</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
              {selectedAction ? `${selectedAction.action_value_score}/100 VALUE SCORE` : '--'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Projected On-Time</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{projectedOnTime}%</div>
              <span className="text-[10px] text-emerald-400 font-bold">+{surge}% surge</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Shipments Saved</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{selectedAction?.shipments_saved || 0}</div>
              <span className="text-[10px] text-cyan-400 font-bold">Recovered</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Net Loss Avoided</span>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">₹{((selectedAction?.expected_benefit || 0) / 100000).toFixed(2)}L</div>
              <span className="text-[10px] text-emerald-400 font-bold">Saved</span>
            </div>
          </div>

          {/* Action Comparison Metrics */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/60 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Plan Cost: <strong className="text-white">₹{((selectedAction?.estimated_cost || 0) / 1000).toFixed(0)}K</strong>
            </span>
            <span className="text-slate-300">
              Delay Reduction: <strong className="text-emerald-400 font-bold">-{selectedAction?.expected_delay_reduction_hrs} Hours</strong>
            </span>
            <span className="text-slate-300">
              Remaining SLA Risk: <strong className="text-amber-400">₹{(projectedLoss / 100000).toFixed(2)}L</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Selection Deck (5 Mitigation Strategies) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4 text-cyan-400" /> SELECT MITIGATION RECOVERY ACTION
            </h3>
            <p className="text-xs text-slate-400">Click any strategy card to simulate its business outcome in real time.</p>
          </div>

          {selectedAction && (
            <button
              onClick={handleApplyPlan}
              disabled={applying}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold font-mono transition cursor-pointer shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${applying ? 'animate-spin' : ''}`} />
              <span>Apply Recovery Plan to Production</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.options.map((option) => {
            const isSelected = selectedAction?.id === option.id;

            return (
              <div
                key={option.id}
                onClick={() => setSelectedAction(option)}
                className={`tech-card p-5 rounded-2xl cursor-pointer transition-all duration-200 relative flex flex-col justify-between space-y-4 border ${
                  isSelected 
                    ? 'border-cyan-500 shadow-xl shadow-cyan-950/40 bg-slate-900/90' 
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{option.id}</span>
                      {option.is_recommended && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" /> RECOMMENDED
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-black text-cyan-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      Score: {option.action_value_score}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 tracking-tight">{option.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{option.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-amber-400" /> Plan Cost:
                    </span>
                    <strong className="text-white">₹{(option.estimated_cost / 1000).toFixed(0)}K</strong>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-cyan-400" /> Saved Cargo:
                    </span>
                    <strong className="text-cyan-400 font-bold">{option.shipments_saved} Shipments</strong>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> SLA Recovery:
                    </span>
                    <strong className="text-emerald-400 font-bold">{option.sla_recovery_rate}% On-Time</strong>
                  </div>
                </div>

                <div className={`w-full py-2 rounded-xl text-center text-xs font-mono font-semibold transition ${
                  isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}>
                  {isSelected ? 'Active in Simulation' : 'Click to Simulate'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
