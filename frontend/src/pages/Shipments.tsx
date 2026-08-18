import React, { useEffect, useState, useCallback } from 'react';
import { fetchShipments, simulateShipmentDelay } from '../api/client';
import type { Shipment } from '../types';
import { PredictiveRiskCalculator } from '../components/PredictiveRiskCalculator';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  User, 
  Calendar,
  ShieldAlert,
  ArrowRight,
  Calculator
} from 'lucide-react';

const STAGES = [
  'Created',
  'Packed',
  'Loaded',
  'Departed',
  'In Transit',
  'Arrived at Hub',
  'Out for Delivery',
  'Delivered'
];

export const Shipments: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(true);
  const [delayBanner, setDelayBanner] = useState<{
    show: boolean;
    shipmentId: string;
    customer: string;
    prevRisk: string;
    newRisk: string;
    prevProb: number;
    newProb: number;
    predictedEta: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchShipments();
      setShipments(data);
      if (data.length > 0 && !selectedShipment) {
        setSelectedShipment(data[0]);
      } else if (selectedShipment) {
        const updatedSelected = data.find(s => s.id === selectedShipment.id);
        if (updatedSelected) setSelectedShipment(updatedSelected);
      }
    } catch (err) {
      console.error('Failed to load shipments data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedShipment]);

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateDelay = async (shipment: Shipment) => {
    try {
      setSimulatingId(shipment.id);
      const prevRisk = shipment.delay_risk;
      const prevProb = shipment.delay_probability;

      const updated = await simulateShipmentDelay(shipment.id);

      setShipments(prev => prev.map(s => s.id === updated.id ? updated : s));
      if (selectedShipment?.id === updated.id) {
        setSelectedShipment(updated);
      }

      setDelayBanner({
        show: true,
        shipmentId: updated.id,
        customer: updated.customer,
        prevRisk,
        newRisk: updated.delay_risk,
        prevProb,
        newProb: updated.delay_probability,
        predictedEta: updated.predicted_eta
      });
    } catch (err) {
      console.error('Failed to simulate delay:', err);
      alert('Failed to simulate shipment delay');
    } finally {
      setSimulatingId(null);
    }
  };

  const handlePredictionApplied = useCallback((updatedEta: string, newRisk: string, newProb: number) => {
    setSelectedShipment(prev => {
      if (!prev) return null;
      if (prev.delay_probability === newProb && prev.predicted_eta === updatedEta) return prev;
      return {
        ...prev,
        predicted_eta: updatedEta,
        delay_risk: newRisk.charAt(0).toUpperCase() + newRisk.slice(1).toLowerCase() as any,
        delay_probability: newProb
      };
    });
  }, []);

  const getStageIndex = (status: string) => {
    const idx = STAGES.indexOf(status);
    return idx >= 0 ? idx : 4;
  };

  const getRiskBadge = (risk: string, probability: number) => {
    if (risk === 'High' || probability >= 70) {
      return 'bg-rose-950/90 text-rose-300 border-rose-800 glow-rose animate-pulse';
    } else if (risk === 'Medium' || probability >= 35) {
      return 'bg-amber-950/90 text-amber-300 border-amber-800 glow-amber';
    } else {
      return 'bg-emerald-950/90 text-emerald-300 border-emerald-800 glow-emerald';
    }
  };

  if (loading && shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <span className="text-slate-400 text-xs font-mono">Connecting to GPS Vehicle Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Delay Alert Banner */}
      {delayBanner?.show && (
        <div className="bg-rose-950/90 border-2 border-rose-600 p-5 rounded-2xl shadow-2xl animate-bounce">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-900 border border-rose-500 text-white shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-wide uppercase font-mono">
                    Shipment Delay Incident Triggered Persistence!
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-900 text-rose-200 rounded font-mono font-bold">
                    GPS BOTTLENECK
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-1">
                  Delay triggered for <strong className="text-white font-mono">{delayBanner.shipmentId}</strong> (Customer: {delayBanner.customer}). Predicted ETA updated & persistent risk added to database.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
                  <span className="text-rose-300">
                    Delay Risk: <span className="line-through text-slate-400">{delayBanner.prevRisk}</span> &rarr; <strong className="text-white font-bold">{delayBanner.newRisk} RISK</strong>
                  </span>
                  <span className="text-rose-300">
                    Delay Prob: <span className="line-through text-slate-400">{delayBanner.prevProb}%</span> &rarr; <strong className="text-rose-400 font-bold">{delayBanner.newProb}%</strong>
                  </span>
                  <span className="text-rose-300">
                    ETA: <strong className="text-amber-300">{delayBanner.predictedEta}</strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setDelayBanner(null)}
              className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold border border-rose-700 transition cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time Shipment Visibility & Risk Engine</h2>
            <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono">
              Phase 4 Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            End-to-end GPS vehicle telemetry, lifecycle timelines, and predictive mathematical delay risk scoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
              showCalculator 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showCalculator ? 'Hide Risk Calculator' : 'Open Risk Calculator'}</span>
          </button>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Selected Shipment Detail Visual Timeline Box */}
      {selectedShipment && (
        <div className="tech-card border-t-2 border-t-blue-500 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-white font-mono">{selectedShipment.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getRiskBadge(selectedShipment.delay_risk, selectedShipment.delay_probability)}`}>
                  {selectedShipment.delay_risk} Risk ({selectedShipment.delay_probability}% delay prob)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                <span>{selectedShipment.origin}</span>
                <ArrowRight className="w-3 h-3 text-blue-400" />
                <span>{selectedShipment.destination}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSimulateDelay(selectedShipment)}
                disabled={simulatingId === selectedShipment.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-rose-100 text-xs font-semibold border border-rose-800/80 transition cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${simulatingId === selectedShipment.id ? 'animate-spin' : ''}`} />
                <span>Simulate Delay Bottleneck</span>
              </button>
            </div>
          </div>

          {/* Visual Lifecycle Timeline (8 Stages) */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
              Shipment Lifecycle Stage Progression Timeline
            </h4>
            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex items-center min-w-[700px] justify-between relative px-4">
                  <div className="absolute left-8 right-8 top-4 h-1 bg-slate-800 -z-0"></div>

                  {STAGES.map((stage, idx) => {
                    const currentIdx = getStageIndex(selectedShipment.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    let circleStyle = 'bg-slate-900 border-slate-700 text-slate-500';
                    if (isCompleted) {
                      circleStyle = 'bg-emerald-950 border-emerald-500 text-emerald-400';
                    } else if (isCurrent) {
                      circleStyle = selectedShipment.delay_risk === 'High' 
                        ? 'bg-rose-950 border-rose-500 text-rose-300 glow-rose animate-pulse'
                        : 'bg-blue-950 border-blue-500 text-blue-300 glow-blue';
                    }

                    return (
                      <div key={stage} className="flex flex-col items-center relative z-10 space-y-2">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition ${circleStyle}`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-mono tracking-tight text-center max-w-[80px] ${
                          isCurrent ? 'font-bold text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-blue-400" /> Customer / Transporter
              </div>
              <div className="text-xs text-white font-bold mt-1 truncate">{selectedShipment.customer}</div>
              <div className="text-[11px] text-slate-400">{selectedShipment.transporter}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Truck className="w-3 h-3 text-cyan-400" /> Vehicle ID
              </div>
              <div className="text-xs text-white font-bold mt-1">{selectedShipment.vehicle_id}</div>
              <div className="text-[11px] text-emerald-400">GPS Signal Locked</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Current Telemetry Location
              </div>
              <div className="text-xs text-white font-bold mt-1 truncate">{selectedShipment.current_location}</div>
              <div className="text-[11px] text-slate-400">Status: {selectedShipment.status}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" /> Planned vs Predicted ETA
              </div>
              <div className="text-xs text-slate-300 mt-1">Plan: {selectedShipment.planned_eta}</div>
              <div className={`text-xs font-bold ${selectedShipment.delay_risk === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
                ETA: {selectedShipment.predicted_eta}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Delay Risk Calculator Component (Phase 4 Signature Engine) */}
      {selectedShipment && showCalculator && (
        <PredictiveRiskCalculator 
          shipment={selectedShipment} 
          onPredictionApplied={handlePredictionApplied}
        />
      )}

      {/* Shipments List Table */}
      <div className="tech-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Active Telemetry Trackers</h3>
          <span className="text-xs text-slate-400 font-mono">{shipments.length} Active Shipments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Shipment ID</th>
                <th className="px-4 py-3.5">Route</th>
                <th className="px-4 py-3.5">Customer & Transporter</th>
                <th className="px-4 py-3.5">Vehicle</th>
                <th className="px-4 py-3.5">Current Location</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Predicted ETA</th>
                <th className="px-4 py-3.5">Delay Risk</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {shipments.map((shp) => {
                const isSelected = selectedShipment?.id === shp.id;
                const isSimulating = simulatingId === shp.id;

                return (
                  <tr 
                    key={shp.id} 
                    onClick={() => setSelectedShipment(shp)}
                    className={`cursor-pointer transition ${isSelected ? 'bg-blue-950/30 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      {shp.id}
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-sans text-xs">
                      <div>{shp.origin}</div>
                      <div className="text-[10px] text-slate-500">&rarr; {shp.destination}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-sans">
                      <div className="font-semibold text-slate-200">{shp.customer}</div>
                      <div className="text-[10px] text-slate-400">{shp.transporter}</div>
                    </td>
                    <td className="px-4 py-4 text-cyan-400 font-mono">
                      {shp.vehicle_id}
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-sans text-xs max-w-[150px] truncate">
                      {shp.current_location}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono text-[11px]">
                        {shp.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-xs">
                      {shp.predicted_eta}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getRiskBadge(shp.delay_risk, shp.delay_probability)}`}>
                        {shp.delay_risk} ({shp.delay_probability}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateDelay(shp);
                        }}
                        disabled={isSimulating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-rose-100 text-[11px] font-semibold border border-rose-800/80 transition cursor-pointer disabled:opacity-50"
                        title="Simulate delay event"
                      >
                        <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                        <span>Simulate Delay</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
