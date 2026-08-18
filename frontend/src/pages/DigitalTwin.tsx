import React, { useEffect, useState, useCallback } from 'react';
import { fetchTwinGraph } from '../api/client';
import type { TwinGraphData, TwinNode } from '../types';
import { 
  Building2, 
  Truck, 
  Package, 
  Users, 
  RefreshCw, 
  Activity, 
  Radio, 
  SlidersHorizontal,
  Flame,
  Network,
  Eye,
  EyeOff
} from 'lucide-react';

interface DigitalTwinProps {
  initialSelectedNodeId?: string | null;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ initialSelectedNodeId }) => {
  const [data, setData] = useState<TwinGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<TwinNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isolateSelected, setIsolateSelected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchTwinGraph();
      setData(res);

      if (initialSelectedNodeId) {
        const target = res.nodes.find(n => n.id === initialSelectedNodeId);
        if (target) {
          setSelectedNode(target);
          return;
        }
      }

      if (res.nodes.length > 0 && !selectedNode) {
        const crit = res.nodes.find(n => n.status === 'Critical') || res.nodes[0];
        setSelectedNode(crit);
      } else if (selectedNode) {
        const found = res.nodes.find(n => n.id === selectedNode.id);
        if (found) setSelectedNode(found);
      }
    } catch (err) {
      console.error('Failed to load digital twin graph:', err);
    } finally {
      setLoading(false);
    }
  }, [initialSelectedNodeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <span className="text-slate-400 text-xs font-mono">Synchronizing Physical-to-Digital Twin Graph Nodes...</span>
      </div>
    );
  }

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  // Filter nodes according to selected echelon
  const filteredNodes = nodes.filter(n => filterType === 'all' || n.type === filterType);

  // Connected edges and neighbor IDs
  const showEdges = filterType === 'all';
  const connectedEdges = selectedNode 
    ? edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];
  const connectedNodeIds = new Set(
    connectedEdges.flatMap(e => [e.source, e.target])
  );

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'warehouse':
        return Building2;
      case 'transporter':
        return Truck;
      case 'shipment':
        return Package;
      case 'customer':
        return Users;
      default:
        return Activity;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'Critical':
        return {
          bg: 'bg-rose-950/90',
          border: 'border-rose-500',
          text: 'text-rose-300',
          glow: 'glow-rose shadow-rose-950/80',
          pulse: 'animate-pulse',
          dot: 'bg-rose-500'
        };
      case 'At Risk':
        return {
          bg: 'bg-amber-950/90',
          border: 'border-amber-500',
          text: 'text-amber-300',
          glow: 'glow-amber shadow-amber-950/80',
          pulse: '',
          dot: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-slate-900/90',
          border: 'border-emerald-500/70',
          text: 'text-emerald-300',
          glow: 'glow-emerald shadow-emerald-950/80',
          pulse: '',
          dot: 'bg-emerald-400'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Supply Chain Digital Twin</h2>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-xs font-mono font-bold">
              Multi-Echelon Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical-to-digital graph mapping Warehouses &rarr; Transporters &rarr; Active Shipments &rarr; Customer Accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsolateSelected(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-2 ${
              isolateSelected 
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isolateSelected ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isolateSelected ? 'Focused Node Routes Isolated' : 'Show All Routes'}</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
            title="Refresh Twin Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Health Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="tech-card rounded-xl p-3 sm:p-4 bg-slate-950 border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-blue-400" /> Total Graph Nodes
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">{nodes.length} Live Entities</div>
        </div>

        <div className="tech-card rounded-xl p-3 sm:p-4 bg-slate-950 border-slate-800/80">
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> Healthy Flow
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {data?.health_summary.Healthy || 0} Nodes
          </div>
        </div>

        <div className="tech-card rounded-xl p-3 sm:p-4 bg-slate-950 border-slate-800/80">
          <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Delay / At Risk
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {data?.health_summary['At Risk'] || 0} Nodes
          </div>
        </div>

        <div className="tech-card rounded-xl p-3 sm:p-4 bg-slate-950 border-slate-800/80">
          <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Bottleneck Blockers
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {data?.health_summary.Critical || 0} Nodes
          </div>
        </div>
      </div>

      {/* Echelon Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-500 text-xs flex items-center gap-1 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" /> ECHELON:
          </span>
          {[
            { id: 'all', label: 'All Echelons (Graph)' },
            { id: 'warehouse', label: 'Warehouses' },
            { id: 'transporter', label: 'Transporters' },
            { id: 'shipment', label: 'Active Shipments' },
            { id: 'customer', label: 'Customer Accounts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {selectedNode ? (
            <span>Selected: <strong className="text-blue-300">{selectedNode.label}</strong> ({selectedNode.id})</span>
          ) : (
            <span>Click any node to inspect telemetry</span>
          )}
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visual Graph Canvas (3 cols) */}
        <div className="lg:col-span-3 tech-card rounded-2xl p-4 sm:p-6 relative overflow-hidden bg-[#070b14] border-slate-800/80 min-h-[640px] flex flex-col justify-between">
          {/* Echelon Column Header Labels */}
          <div className="grid grid-cols-4 gap-2 border-b border-slate-800/80 pb-3 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider text-center">
            <span className={`flex items-center justify-center gap-1.5 ${filterType === 'warehouse' ? 'text-blue-400 font-black' : ''}`}>
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> Warehouses
            </span>
            <span className={`flex items-center justify-center gap-1.5 ${filterType === 'transporter' ? 'text-amber-400 font-black' : ''}`}>
              <Truck className="w-3.5 h-3.5 text-amber-400" /> Transporters
            </span>
            <span className={`flex items-center justify-center gap-1.5 ${filterType === 'shipment' ? 'text-cyan-400 font-black' : ''}`}>
              <Package className="w-3.5 h-3.5 text-cyan-400" /> In-Transit Cargo
            </span>
            <span className={`flex items-center justify-center gap-1.5 ${filterType === 'customer' ? 'text-purple-400 font-black' : ''}`}>
              <Users className="w-3.5 h-3.5 text-purple-400" /> Customers
            </span>
          </div>

          {/* SVG Visual Graph */}
          <div className="relative flex-1 min-h-[540px] w-full overflow-x-auto">
            <svg 
              className="w-full h-full min-w-[760px] min-h-[540px]" 
              viewBox="0 0 1000 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Edge Connecting Lines */}
              {showEdges && edges.map((edge) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                const isHighlighted = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                const isBottleneck = edge.is_bottleneck || edge.status === 'Critical';

                // If isolateSelected is ON and a node is selected, hide unrelated edges completely
                if (isolateSelected && selectedNode && !isHighlighted) {
                  return null;
                }

                let strokeColor = isBottleneck ? '#f43f5e' : '#334155';
                let strokeWidth = isBottleneck ? 2.5 : 1.5;
                let strokeDash = isBottleneck ? '6 3' : '';
                let opacity = selectedNode ? (isHighlighted ? 1 : 0.15) : 0.7;

                if (isHighlighted) {
                  strokeWidth = 3.2;
                  strokeColor = isBottleneck ? '#fb7185' : '#38bdf8';
                }

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x + 40}
                      y1={sourceNode.y + 20}
                      x2={targetNode.x - 20}
                      y2={targetNode.y + 20}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      strokeOpacity={opacity}
                      className={isBottleneck ? 'animate-pulse' : ''}
                    />
                    {isHighlighted && (
                      <circle
                        r="3.5"
                        fill={isBottleneck ? '#f43f5e' : '#38bdf8'}
                        className="animate-ping"
                      >
                        <animateMotion
                          path={`M ${sourceNode.x + 40} ${sourceNode.y + 20} L ${targetNode.x - 20} ${targetNode.y + 20}`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Render Filtered Nodes as SVG Foreign Objects */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = showEdges && selectedNode ? connectedNodeIds.has(node.id) : false;
                const colors = getStatusColors(node.status);
                const Icon = getNodeIcon(node.type);

                return (
                  <foreignObject
                    key={node.id}
                    x={node.x - 70}
                    y={node.y - 10}
                    width="160"
                    height="70"
                    className="overflow-visible cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className={`p-2.5 rounded-xl border transition-all duration-200 ${colors.bg} ${colors.border} ${
                      isSelected 
                        ? 'ring-2 ring-blue-400 scale-105 shadow-xl' 
                        : isConnected 
                        ? 'opacity-100 ring-1 ring-slate-500 scale-102' 
                        : (showEdges && selectedNode)
                        ? 'opacity-40 hover:opacity-90' 
                        : 'hover:scale-102 opacity-100'
                    }`}>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Icon className={`w-3.5 h-3.5 ${colors.text} shrink-0`} />
                          <span className="text-[11px] font-bold text-white font-mono truncate">{node.id}</span>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${colors.dot} ${colors.pulse}`}></span>
                      </div>

                      <div className="text-[10px] text-slate-300 font-sans truncate mt-0.5">{node.label}</div>
                      <div className="text-[9px] text-slate-500 font-mono truncate">{node.sub_label}</div>
                    </div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>

          {/* Footer Legend */}
          <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Nominal Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Transit Delay
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Bottleneck / SLA Breach
              </span>
            </div>
            <span>Interactive Multi-Echelon Visual Mesh</span>
          </div>
        </div>

        {/* Node Telemetry Inspector Drawer (1 col) */}
        <div className="tech-card rounded-2xl p-5 bg-[#070b14] border-slate-800/80 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Node Telemetry Inspector
            </span>
            {selectedNode ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedNode.id}</h3>
                  <p className="text-xs text-slate-400 font-sans">{selectedNode.label}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  selectedNode.status === 'Critical'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : selectedNode.status === 'At Risk'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {selectedNode.status}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Select a node to inspect telemetry.</p>
            )}
          </div>

          {selectedNode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Telemetry Metrics
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  {Object.entries(selectedNode.metrics).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="text-slate-200 font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Links */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Connected Graph Edges</span>
                  <span className="text-blue-400">{connectedEdges.length} Links</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {connectedEdges.length === 0 ? (
                    <div className="text-xs text-slate-500 font-mono p-2">No active links connected.</div>
                  ) : (
                    connectedEdges.map((e) => (
                      <div 
                        key={e.id}
                        className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between ${
                          e.is_bottleneck || e.status === 'Critical'
                            ? 'bg-rose-950/40 border-rose-900/60 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate">{e.source} &rarr; {e.target}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                          {e.label}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Trigger for Bottlenecks */}
              {selectedNode.status === 'Critical' && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/80 text-xs space-y-2">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Bottleneck Propagation Alert
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This node is causing cascading delay risks down the multi-echelon network. Run the What-If Recovery Simulator to mitigate.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
