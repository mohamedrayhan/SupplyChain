import React, { useEffect, useState, useCallback } from 'react';
import { fetchInventory, fetchWarehouses, simulateInventoryMismatch } from '../api/client';
import type { InventoryItem, Warehouse } from '../types';
import { 
  Package, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Zap, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  SlidersHorizontal,
  Box,
  X
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mismatchBanner, setMismatchBanner] = useState<{
    show: boolean;
    sku: string;
    productName: string;
    prevAvailable: number;
    newAvailable: number;
    prevConfidence: number;
    newConfidence: number;
  } | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [invData, whData] = await Promise.all([
        fetchInventory(),
        fetchWarehouses()
      ]);
      setItems(invData);
      setWarehouses(whData);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSimulateMismatch = async (item: InventoryItem) => {
    try {
      setSimulatingId(item.id);
      const prevAvailable = item.available_quantity;
      const prevConfidence = item.confidence_score;

      const updated = await simulateInventoryMismatch(item.id);

      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));

      setMismatchBanner({
        show: true,
        sku: updated.sku,
        productName: updated.product_name,
        prevAvailable,
        newAvailable: updated.available_quantity,
        prevConfidence,
        newConfidence: updated.confidence_score
      });
    } catch (err) {
      console.error('Failed to simulate mismatch:', err);
      alert('Failed to simulate inventory mismatch');
    } finally {
      setSimulatingId(null);
    }
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: `${score}% High Confidence`,
        color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800 glow-emerald',
        icon: CheckCircle2
      };
    } else if (score >= 70) {
      return {
        label: `${score}% Medium Confidence`,
        color: 'bg-amber-950/80 text-amber-300 border-amber-800 glow-amber',
        icon: Clock
      };
    } else {
      return {
        label: `${score}% Low Confidence`,
        color: 'bg-rose-950/80 text-rose-300 border-rose-800 glow-rose animate-pulse',
        icon: AlertTriangle
      };
    }
  };

  const filteredItems = items.filter(item => {
    const matchesWh = selectedWarehouse === 'ALL' || item.warehouse_id === selectedWarehouse;
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWh && matchesSearch;
  });

  const totalStock = items.reduce((acc, i) => acc + i.total_quantity, 0);
  const totalAvailable = items.reduce((acc, i) => acc + i.available_quantity, 0);
  const totalQualityHold = items.reduce((acc, i) => acc + i.quality_hold_quantity, 0);
  const avgConfidence = items.length > 0
    ? (items.reduce((acc, i) => acc + i.confidence_score, 0) / items.length).toFixed(1)
    : '0.0';

  const chartData = items.map(item => ({
    name: item.sku,
    Available: item.available_quantity,
    Reserved: item.reserved_quantity,
    Picking: item.being_picked_quantity,
    InTransit: item.in_transit_quantity,
    QualityHold: item.quality_hold_quantity
  }));

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <span className="text-slate-400 text-xs font-mono">Querying Inventory Truth Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Mismatch Alert Banner */}
      {mismatchBanner?.show && (
        <div className="bg-rose-950/90 border-2 border-rose-600 p-5 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-900 border border-rose-500 text-white shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-wide uppercase font-mono">
                    Digital-Physical Inventory Mismatch Detected!
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-900 text-rose-200 rounded font-mono font-bold">
                    CRITICAL EXCEPTION
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-1">
                  Discrepancy detected for <strong className="text-white font-mono">{mismatchBanner.sku}</strong> ({mismatchBanner.productName}). Physical audit count does not match WMS record.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
                  <span className="text-rose-300">
                    Available Stock: <span className="line-through text-slate-400">{mismatchBanner.prevAvailable.toLocaleString()}</span> &rarr; <strong className="text-white font-bold">{mismatchBanner.newAvailable.toLocaleString()}</strong>
                  </span>
                  <span className="text-rose-300">
                    Truth Confidence: <span className="line-through text-slate-400">{mismatchBanner.prevConfidence}%</span> &rarr; <strong className="text-rose-400 font-bold">{mismatchBanner.newConfidence}% (Low Confidence)</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMismatchBanner(null)}
              className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold border border-rose-700 transition cursor-pointer shrink-0"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Truth Engine</h2>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono">
              Phase 2 Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time reconciliation across Available, Reserved, Picking, In-Transit, and Quality Hold inventory with truth confidence scoring.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Truth Index</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="tech-card border-t-2 border-t-blue-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Total Stock</span>
              <div className="text-3xl font-black text-white font-mono mt-1">{totalStock.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/60">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Across 4 connected facilities</div>
        </div>

        <div className="tech-card border-t-2 border-t-emerald-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Available Inventory</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{totalAvailable.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Ready for dispatch allocation</div>
        </div>

        <div className="tech-card border-t-2 border-t-rose-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Quality Hold</span>
              <div className="text-3xl font-black text-rose-400 font-mono mt-1">{totalQualityHold.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/60">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Quarantined for inspection</div>
        </div>

        <div className="tech-card border-t-2 border-t-cyan-500 p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Truth Confidence</span>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{avgConfidence}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Weighted RFID & WMS confidence</div>
        </div>
      </div>

      {/* Prominent High-Contrast Search & Filter Bar */}
      <div className="tech-card p-4 rounded-2xl border-2 border-blue-500/40 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search Box */}
        <div className="flex-1 w-full relative">
          <label className="block text-[10px] font-mono font-bold text-blue-400 uppercase mb-1 flex items-center gap-1">
            <Search className="w-3 h-3" /> SKU / Product Search Bar
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Type SKU or Product Name (e.g. SKU-MICRO-992, Sensor, Cell)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-blue-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-400 outline-none transition font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Warehouse Dropdown Filter */}
        <div className="w-full md:w-72 shrink-0">
          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter by Facility
          </label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 outline-none transition cursor-pointer font-mono"
          >
            <option value="ALL">All Warehouses ({warehouses.length})</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>{wh.name} ({wh.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recharts Inventory Buckets Breakdown */}
      <div className="tech-card p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-white">SKU Inventory Distribution Buckets</h3>
            <p className="text-xs text-slate-400">Categorized stock breakdown per SKU</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" /> Multi-bucket View
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Reserved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Picking" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="InTransit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="QualityHold" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="tech-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">SKU Inventory Truth Records</h3>
          <span className="text-xs text-slate-400 font-mono">{filteredItems.length} SKUs Match Filter</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">SKU / Product</th>
                <th className="px-4 py-3.5">Facility</th>
                <th className="px-4 py-3.5 text-right">Available</th>
                <th className="px-4 py-3.5 text-right">Reserved</th>
                <th className="px-4 py-3.5 text-right">Picking</th>
                <th className="px-4 py-3.5 text-right">In-Transit</th>
                <th className="px-4 py-3.5 text-right">Quality Hold</th>
                <th className="px-4 py-3.5">Confidence Score</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const confBadge = getConfidenceBadge(item.confidence_score);
                  const ConfIcon = confBadge.icon;
                  const isSimulating = simulatingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{item.sku}</div>
                        <div className="text-[11px] font-sans text-slate-400">{item.product_name}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-300 font-sans">
                        {item.warehouse_id}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-emerald-400 text-sm">
                        {item.available_quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-300">
                        {item.reserved_quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-amber-400">
                        {(item.being_picked_quantity ?? item.picking_quantity ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-purple-400">
                        {item.in_transit_quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-rose-400 font-bold">
                        {item.quality_hold_quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${confBadge.color}`}>
                          <ConfIcon className="w-3.5 h-3.5" />
                          {confBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSimulateMismatch(item)}
                          disabled={isSimulating}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-rose-100 text-[11px] font-semibold border border-rose-800/80 transition cursor-pointer disabled:opacity-50"
                          title="Trigger simulated physical vs digital discrepancy"
                        >
                          <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                          <span>Simulate Mismatch</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500 font-mono">
                    No SKU records match "{searchQuery}" in warehouse {selectedWarehouse}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
