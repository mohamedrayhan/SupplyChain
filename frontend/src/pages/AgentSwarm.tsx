import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Package, 
  Building2, 
  ArrowRight, 
  Activity,
  Sliders
} from 'lucide-react';
import { orchestrateAgentSwarm, fetchAgentHistory } from '../api/client';
import type { AgentOrchestrateResponse, SupplyChainEvent } from '../types';

export const AgentSwarm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orchestrationData, setOrchestrationData] = useState<AgentOrchestrateResponse | null>(null);
  const [history, setHistory] = useState<SupplyChainEvent[]>([]);
  const [budgetGuardrail, setBudgetGuardrail] = useState<number>(200000);
  const [autoCommit, setAutoCommit] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [agentStates, setAgentStates] = useState<{
    orchestrator: string;
    carrier: string;
    inventory: string;
    dock: string;
  }>({
    orchestrator: 'MONITORING TELEMETRY',
    carrier: 'STANDBY (SPOT GATEWAYS LOCKED)',
    inventory: 'BUFFER TRACKING (4 DCs)',
    dock: 'DOCK QUEUE SURVEILLANCE'
  });

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchAgentHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load agent history:', err);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleTriggerSwarm = async () => {
    try {
      setLoading(true);
      setActiveStepIndex(0);

      // Animate agent states
      setAgentStates({
        orchestrator: 'INGESTING LIVE IoT TELEMETRY',
        carrier: 'QUERYING SPOT FREIGHT GATEWAYS',
        inventory: 'CROSS-CHECKING DC CAPACITIES',
        dock: 'ANALYZING LOADING BAY QUEUES'
      });

      const result = await orchestrateAgentSwarm(budgetGuardrail);
      setOrchestrationData(result);
      await loadHistory();

      // Step-by-step thought stream animation
      for (let i = 0; i < result.thought_stream.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setActiveStepIndex(i + 1);
      }

      setAgentStates({
        orchestrator: 'CONSENSUS REACHED • COMMITTED',
        carrier: 'SPOT VEHICLES RESERVED',
        inventory: 'CROSS-DOCK MANIFEST GENERATED',
        dock: 'AUXILIARY DOCK RE-ROUTED'
      });
    } catch (err) {
      console.error('Failed to orchestrate agent swarm:', err);
      alert('Failed to orchestrate agent swarm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Autonomous Multi-Agent AI Swarm</h2>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono font-bold">
              Phase 10 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Self-healing multi-agent consensus network resolving supply chain bottlenecks, bidding spot freight, and rebalancing queues autonomously.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSwarm}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold font-mono transition cursor-pointer shadow-lg shadow-blue-950/80 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Swarm Consensus Evaluating...' : 'Trigger Autonomous Swarm Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Swarm Architecture Topology & Live Agent Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        {/* Master Orchestrator */}
        <div className="tech-card border-t-2 border-t-blue-500 p-5 rounded-2xl md:col-span-4 bg-gradient-to-r from-blue-950/20 via-slate-950 to-cyan-950/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/50 text-blue-400 flex items-center justify-center glow-blue shrink-0">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-sans">Master Supply Chain Orchestrator Agent</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                    SUPERVISOR AGENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Continuously ingests national telemetry nodes and delegates remediation sub-tasks to specialized domain agents.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 block uppercase">Agent Lifecycle State</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> {agentStates.orchestrator}
              </span>
            </div>
          </div>
        </div>

        {/* Worker Agent 1: Carrier Spot-Auction */}
        <div className="tech-card border-t-2 border-t-cyan-500 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              SPOT FREIGHT
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Carrier Spot-Auction Agent</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Bids on 3PL spot rate markets and reserves backup sprinter fleet.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block">Live State:</span>
            <span className="text-[11px] font-bold text-cyan-300 truncate block">{agentStates.carrier}</span>
          </div>
        </div>

        {/* Worker Agent 2: Inventory Rebalancing */}
        <div className="tech-card border-t-2 border-t-emerald-500 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              INVENTORY
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Inventory Rebalancing Agent</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Evaluates multi-facility buffers & generates cross-dock transfer orders.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block">Live State:</span>
            <span className="text-[11px] font-bold text-emerald-300 truncate block">{agentStates.inventory}</span>
          </div>
        </div>

        {/* Worker Agent 3: Loading Dock Turnaround */}
        <div className="tech-card border-t-2 border-t-purple-500 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              YARD MGMT
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Loading Dock Turnaround Agent</h4>
            <p className="text-[11px] text-slate-400 font-sans mt-1">
              Reroutes queued trucks to auxiliary bays and reschedules driver arrival slots.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase block">Live State:</span>
            <span className="text-[11px] font-bold text-purple-300 truncate block">{agentStates.dock}</span>
          </div>
        </div>

        {/* Supervisor Guardrail Controls */}
        <div className="tech-card border-t-2 border-t-amber-500 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              GOVERNANCE
            </span>
          </div>
          <div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-sans font-bold">Max Budget Cap:</span>
              <span className="text-amber-300 font-bold">₹{(budgetGuardrail/100000).toFixed(1)} Lakhs</span>
            </div>
            <input 
              type="range"
              min={50000}
              max={500000}
              step={25000}
              value={budgetGuardrail}
              onChange={(e) => setBudgetGuardrail(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-2"
            />
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-sans">Autonomous Commit:</span>
            <button 
              onClick={() => setAutoCommit(!autoCommit)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                autoCommit ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoCommit ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Agent Thought Stream & Consensus Visualizer */}
      {orchestrationData && (
        <div className="tech-card border-t-2 border-t-blue-500 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-bold text-white font-sans">Autonomous Swarm Consensus Stream</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {orchestrationData.cycle_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Real-time multi-agent reasoning trace showing autonomous detection, bidding, and state mutation.
              </p>
            </div>

            <div className="flex items-center gap-6 text-right text-xs">
              <div>
                <span className="text-slate-500 block uppercase">Total OPEX</span>
                <strong className="text-amber-300 font-bold text-sm">₹{(orchestrationData.total_cost / 1000).toFixed(0)}K</strong>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">Loss Avoided</span>
                <strong className="text-emerald-400 font-bold text-sm">₹{(orchestrationData.total_benefit_avoided / 100000).toFixed(2)}L</strong>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">Shipments Saved</span>
                <strong className="text-cyan-400 font-bold text-sm">+{orchestrationData.shipments_saved}</strong>
              </div>
            </div>
          </div>

          {/* Thought Stream Timeline */}
          <div className="space-y-3 font-mono">
            {orchestrationData.thought_stream.map((step, idx) => {
              const isVisible = idx < activeStepIndex;
              if (!isVisible) return null;

              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 animate-fade-in transition hover:border-blue-500/40"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-white font-sans">{step.agent_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                        {step.stage}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Confidence: {step.confidence}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    <strong>Thought:</strong> {step.thought}
                  </p>

                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span><strong>Action Executed:</strong> {step.action}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions Executed Cards */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Autonomous Actions Executed ({orchestrationData.executed_actions.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {orchestrationData.executed_actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">{act.action_id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      AVS: {act.action_value_score}/100
                    </span>
                  </div>
                  <div className="font-bold text-white font-sans text-sm">{act.title}</div>
                  <div className="text-[11px] text-slate-400 font-sans">Agent: {act.agent}</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Cost: ₹{(act.cost/1000).toFixed(0)}K</span>
                    <span className="text-emerald-400 font-bold">Saved: {act.shipments_saved} shps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Action History */}
      <div className="tech-card rounded-2xl overflow-hidden font-mono">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-sans">Autonomous Swarm Decision Ledger</h3>
          </div>
          <span className="text-xs text-slate-400">{history.length} Events Logged</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-sans">
              No autonomous cycles executed yet. Click &quot;Trigger Autonomous Swarm Cycle&quot; to test the multi-agent consensus network.
            </div>
          ) : (
            history.map((evt) => (
              <div key={evt.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-900/40 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-blue-400">{evt.id}</span>
                    <span className="text-xs font-bold text-white font-sans">{evt.event_type}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {evt.confidence}% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{evt.description}</p>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0 font-sans">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
