import React, { useState, useEffect, useCallback } from 'react';
import { 
  Network, 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  Compass,
  Layers,
  Leaf,
  Sliders,
  Play,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { fetchGNNCascadeForecast, optimizeDeepRLReroute } from '../api/client';
import type { GNNCascadeResponse, RLOptimizeResponse } from '../types';

export const GNNTopologyReroute: React.FC = () => {
  const [gnnData, setGnnData] = useState<GNNCascadeResponse | null>(null);
  const [rlData, setRlData] = useState<RLOptimizeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [optimizingStep, setOptimizingStep] = useState<string>('');
  const [rerouteExecuted, setRerouteExecuted] = useState<boolean>(false);
  const [animatingWave, setAnimatingWave] = useState<boolean>(false);
  const [selectedRootNode, setSelectedRootNode] = useState<string>('NODE-WH-CHE');
  const [severityMultiplier, setSeverityMultiplier] = useState<number>(1.5);
  const [trafficLevel, setTrafficLevel] = useState<number>(92.0);
  const [selectedShipmentId] = useState<string>('SHP-2026-001');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('TRAJ-CURRENT-NH44');
  const [activeHopView, setActiveHopView] = useState<'hop1' | 'hop2' | 'final'>('final');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [gnnRes, rlRes] = await Promise.all([
        fetchGNNCascadeForecast(selectedRootNode, severityMultiplier),
        optimizeDeepRLReroute(selectedShipmentId, trafficLevel)
      ]);
      setGnnData(gnnRes);
      setRlData(rlRes);
    } catch (err) {
      console.error('Failed to load GNN and RL data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRootNode, severityMultiplier, selectedShipmentId, trafficLevel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTriggerWaveAnimation = async () => {
    setAnimatingWave(true);
    setActiveHopView('hop1');
    await new Promise(r => setTimeout(r, 700));
    setActiveHopView('hop2');
    await new Promise(r => setTimeout(r, 700));
    setActiveHopView('final');
    setAnimatingWave(false);
  };

  const handleExecuteRLReroute = async () => {
    try {
      setOptimizing(true);
      setOptimizingStep('Ingesting Highway Telemetry (NH44 Traffic: ' + trafficLevel.toFixed(0) + '%)...');
      await new Promise(r => setTimeout(r, 400));
      
      setOptimizingStep('Evaluating Actor-Critic Policy Network across candidate trajectories...');
      const result = await optimizeDeepRLReroute(selectedShipmentId, trafficLevel);
      await new Promise(r => setTimeout(r, 500));

      setOptimizingStep('Pareto Optimization: Balancing Delay Penalties vs Toll OPEX...');
      await new Promise(r => setTimeout(r, 400));

      setRlData(result);
      setSelectedRouteId(result.pareto_optimal_route_id);
      setRerouteExecuted(true);
    } catch (err) {
      console.error('Failed to execute RL reroute:', err);
      alert('Failed to execute Deep RL reroute');
    } finally {
      setOptimizing(false);
      setOptimizingStep('');
    }
  };

  const getEchelonLabel = (echelon: number) => {
    switch (echelon) {
      case 1: return 'Echelon 1: Regional DCs';
      case 2: return 'Echelon 2: Transit Corridors & Fleets';
      case 3: return 'Echelon 3: Active Consignments';
      case 4: return 'Echelon 4: Strategic Customer Accounts';
      default: return `Echelon ${echelon}`;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score > 0.65) {
      return { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-700', label: 'CRITICAL CASCADE' };
    }
    if (score > 0.40) {
      return { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700', label: 'ELEVATED RISK' };
    }
    return { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700', label: 'NOMINAL FLOW' };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">GNN Risk Propagation & Deep RL Rerouter</h2>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
              Phase 12 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Graph Convolutional Network (GCN/GAT) multi-hop risk forecasting paired with Deep Reinforcement Learning (PPO) Pareto trajectory optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerWaveAnimation}
            disabled={animatingWave}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition cursor-pointer shadow-lg shadow-cyan-950/80"
          >
            <Play className={`w-3.5 h-3.5 ${animatingWave ? 'animate-spin' : ''}`} />
            <span>{animatingWave ? 'Propagating Graph Wave...' : 'Simulate Diffusion Wave'}</span>
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* GNN Mathematical Formulation Status Banner */}
      <div className="tech-card border-t-2 border-t-cyan-500 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-950 to-blue-950/30 font-mono text-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400 shrink-0">
              <Network className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white font-sans text-sm flex items-center gap-2">
                <span>{gnnData?.model_architecture || 'Graph Convolutional Network (GCN Layer)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 border border-cyan-700">
                  CONVERGED (12 EPOCHS)
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs mt-0.5">
                Evaluates graph message passing across 16 multi-echelon nodes and attention weights.
              </p>
            </div>
          </div>

          {/* Root Anomaly Controls */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase block font-bold">Inject Root Anomaly</label>
              <select
                value={selectedRootNode}
                onChange={(e) => setSelectedRootNode(e.target.value)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="NODE-WH-CHE">Chennai Central DC (Dock Bottleneck)</option>
                <option value="NODE-COR-NH44">NH44 Corridor (Highway Gridlock)</option>
                <option value="NODE-WH-BLR">Bangalore Hub</option>
              </select>
            </div>

            <div className="space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 uppercase font-bold">Severity Multiplier:</span>
                <span className="text-cyan-400 font-bold ml-2">{severityMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.8}
                max={2.0}
                step={0.1}
                value={severityMultiplier}
                onChange={(e) => setSeverityMultiplier(Number(e.target.value))}
                className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Hop Diffusion Canvas Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-bold uppercase">GNN Propagation Hop Level:</span>
          <button
            onClick={() => setActiveHopView('hop1')}
            className={`px-3 py-1 rounded-lg text-xs cursor-pointer font-bold border transition ${
              activeHopView === 'hop1' ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-md shadow-cyan-950/80' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            1-Hop Immediate
          </button>
          <button
            onClick={() => setActiveHopView('hop2')}
            className={`px-3 py-1 rounded-lg text-xs cursor-pointer font-bold border transition ${
              activeHopView === 'hop2' ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-md shadow-cyan-950/80' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            2-Hop Intermediate
          </button>
          <button
            onClick={() => setActiveHopView('final')}
            className={`px-3 py-1 rounded-lg text-xs cursor-pointer font-bold border transition ${
              activeHopView === 'final' ? 'bg-purple-950 text-purple-300 border-purple-700 shadow-md shadow-purple-950/80' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Full 3-Hop Equilibrium
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Viewing: <strong className="text-cyan-300">
            {activeHopView === 'hop1' ? 'Direct 1-Hop Neighbors' : activeHopView === 'hop2' ? '2-Hop Fleet Diffusion' : 'Full 3-Hop Network'}
          </strong>
        </span>
      </div>

      {/* 4-Echelon GNN Node Risk Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {[1, 2, 3, 4].map((echelonNum) => {
          const echelonNodes = gnnData?.nodes.filter(n => n.echelon === echelonNum) || [];

          return (
            <div key={echelonNum} className="space-y-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-bold text-slate-300 uppercase">
                {getEchelonLabel(echelonNum)}
              </div>

              <div className="space-y-2.5">
                {echelonNodes.map((node) => {
                  const score = activeHopView === 'hop1' 
                    ? node.hop_1_risk 
                    : activeHopView === 'hop2' 
                    ? node.hop_2_risk 
                    : node.gnn_risk_score;
                  const badge = getRiskBadge(score);

                  return (
                    <div 
                      key={node.id} 
                      className={`p-3.5 rounded-xl border bg-slate-950 transition-all duration-300 ${
                        node.id === selectedRootNode 
                          ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/60' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-sans font-bold text-xs truncate max-w-[130px]" title={node.name}>
                          {node.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border transition ${badge.bg} ${badge.text} ${badge.border}`}>
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Score Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            score > 0.65 ? 'bg-rose-500' : score > 0.40 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, score * 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2">
                        <span>Attn: {node.attention_weight}</span>
                        <span className={badge.text}>{node.risk_tier}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Reinforcement Learning (PPO) Dynamic Rerouter Playground */}
      <div className="tech-card border-t-2 border-t-purple-500 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-sans">Deep Reinforcement Learning (PPO) Dynamic Rerouter</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Actor-Critic policy solving dynamic Vehicle Routing Problem with Time Windows (VRPTW) under real-time congestion.
            </p>
          </div>

          {/* Traffic Sensitivity Slider & Action Button */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400 font-sans flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" /> NH44 Traffic:
                </span>
                <span className="text-amber-300 font-bold">{trafficLevel.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                step={5}
                value={trafficLevel}
                onChange={(e) => {
                  setTrafficLevel(Number(e.target.value));
                  setRerouteExecuted(false);
                  setSelectedRouteId('TRAJ-CURRENT-NH44');
                }}
                className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-1.5"
              />
            </div>

            <button
              onClick={handleExecuteRLReroute}
              disabled={optimizing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold font-mono transition cursor-pointer shadow-lg shadow-purple-950/80 disabled:opacity-50 shrink-0"
            >
              <Zap className={`w-4 h-4 ${optimizing ? 'animate-spin' : ''}`} />
              <span>{optimizing ? 'Evaluating Actor-Critic Policy...' : 'Execute Deep RL Dynamic Reroute'}</span>
            </button>
          </div>
        </div>

        {/* Live Execution Progress Stepper */}
        {optimizing && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 flex items-center gap-3 font-mono text-xs text-purple-200 animate-pulse">
            <RefreshCw className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
            <span><strong>Policy Optimization Step:</strong> {optimizingStep}</span>
          </div>
        )}

        {/* Post-Execution Success Banner */}
        {rerouteExecuted && !optimizing && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs animate-fade-in">
            <div className="flex items-center gap-2.5 text-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Deep RL Detour Trajectory Applied!</strong> Consignment rerouted to <strong>SH17 Bypass Corridor</strong>, avoiding Hosur gridlock.
              </span>
            </div>
            <span className="px-3 py-1 rounded-md bg-emerald-900/80 text-emerald-200 border border-emerald-700 text-[11px] font-bold shrink-0">
              +{rlData?.delay_reduction_hrs}h SAVED • {rlData?.projected_sla_recovery}% ON-TIME
            </span>
          </div>
        )}

        {/* Candidate Trajectories Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
          {rlData?.candidate_trajectories.map((traj) => {
            const isSelected = selectedRouteId === traj.route_id;
            const isPareto = traj.route_id === 'TRAJ-RL-SH17';
            const isCongested = traj.route_id === 'TRAJ-CURRENT-NH44';

            return (
              <div
                key={traj.route_id}
                onClick={() => setSelectedRouteId(traj.route_id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected && isPareto
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-2xl shadow-purple-950/80 scale-[1.02]'
                    : isSelected && isCongested
                    ? 'bg-rose-950/20 border-rose-600/80 ring-2 ring-rose-500/20'
                    : isSelected
                    ? 'bg-slate-900 border-blue-500'
                    : 'bg-slate-950 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {traj.route_id}
                    </span>
                    {isPareto && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> PPO PARETO OPTIMAL
                      </span>
                    )}
                    {isCongested && !rerouteExecuted && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> ACTIVE ROUTE (GRIDLOCK)
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white font-sans text-sm">{traj.name}</h4>

                  {/* Waypoints */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Dynamic Trajectory Waypoints:</span>
                    <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {traj.waypoints.join(' ➔ ')}
                    </div>
                  </div>
                </div>

                {/* Metrics Table */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Predicted ETA Duration:</span>
                    <strong className="text-white font-bold">{traj.predicted_duration_hrs} hrs</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Delay Drift:</span>
                    <strong className={traj.expected_delay_hrs > 2 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      +{traj.expected_delay_hrs} hrs
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans">Toll & Fuel OPEX:</span>
                    <span className="text-amber-300">₹{(traj.toll_fuel_cost_inr / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-400" /> Carbon Emissions:
                    </span>
                    <span className="text-emerald-400">{traj.carbon_footprint_kg} kg CO₂</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                    <span className="text-slate-400 font-sans">PPO Reward Score:</span>
                    <strong className={traj.ppo_reward_score > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {traj.ppo_reward_score}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Optimization Summary Banner */}
        {rlData && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block">Optimal Trajectory Result</span>
                <span className="text-white font-bold font-sans text-sm">
                  {rlData.delay_reduction_hrs} Hours Delay Avoided • SLA Recovered to {rlData.projected_sla_recovery}%
                </span>
              </div>
            </div>

            <span className="text-emerald-400 font-bold px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
              {rlData.ppo_reward_gain}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
