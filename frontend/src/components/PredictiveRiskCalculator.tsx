import React, { useState, useEffect, useRef } from 'react';
import { predictDelayRisk } from '../api/client';
import type { Shipment, PredictRiskResponse } from '../types';
import { 
  Calculator, 
  Activity, 
  Clock, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface PredictiveRiskCalculatorProps {
  shipment: Shipment;
  onPredictionApplied?: (updatedEta: string, newRisk: string, newProb: number) => void;
}

export const PredictiveRiskCalculator: React.FC<PredictiveRiskCalculatorProps> = ({ 
  shipment, 
  onPredictionApplied 
}) => {
  const [trafficFactor, setTrafficFactor] = useState<number>(30);
  const [warehouseDelayMins, setWarehouseDelayMins] = useState<number>(20);
  const [vehicleRiskFactor, setVehicleRiskFactor] = useState<number>(15);
  const [transporterReliability, setTransporterReliability] = useState<number>(88);
  const [historicalDelayFactor, setHistoricalDelayFactor] = useState<number>(25);

  const [prediction, setPrediction] = useState<PredictRiskResponse | null>(null);
  const onPredictionAppliedRef = useRef(onPredictionApplied);
  onPredictionAppliedRef.current = onPredictionApplied;

  // Debounced API call to prevent infinite re-render loop
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const res = await predictDelayRisk({
          shipment_id: shipment.id,
          traffic_factor: trafficFactor,
          warehouse_delay_mins: warehouseDelayMins,
          vehicle_risk_factor: vehicleRiskFactor,
          transporter_reliability: transporterReliability,
          historical_delay_factor: historicalDelayFactor
        });
        if (isMounted) {
          setPrediction(res);
          if (onPredictionAppliedRef.current) {
            onPredictionAppliedRef.current(res.updated_predicted_eta, res.risk_level, res.delay_probability);
          }
        }
      } catch (err) {
        console.error('Prediction failed:', err);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [shipment.id, trafficFactor, warehouseDelayMins, vehicleRiskFactor, transporterReliability, historicalDelayFactor]);

  // Preset buttons
  const applyPreset = (tier: 'LOW' | 'MEDIUM' | 'HIGH') => {
    if (tier === 'LOW') {
      setTrafficFactor(15);
      setWarehouseDelayMins(5);
      setVehicleRiskFactor(10);
      setTransporterReliability(95);
      setHistoricalDelayFactor(10);
    } else if (tier === 'MEDIUM') {
      setTrafficFactor(50);
      setWarehouseDelayMins(45);
      setVehicleRiskFactor(40);
      setTransporterReliability(80);
      setHistoricalDelayFactor(35);
    } else {
      setTrafficFactor(90);
      setWarehouseDelayMins(140);
      setVehicleRiskFactor(85);
      setTransporterReliability(65);
      setHistoricalDelayFactor(80);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-950/80 border-rose-800 glow-rose',
          badge: 'bg-rose-900 text-rose-200 border-rose-700',
          bar: 'bg-rose-500',
          icon: ShieldAlert
        };
      case 'MEDIUM':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-950/80 border-amber-800 glow-amber',
          badge: 'bg-amber-900 text-amber-200 border-amber-700',
          bar: 'bg-amber-500',
          icon: AlertTriangle
        };
      default:
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/80 border-emerald-800 glow-emerald',
          badge: 'bg-emerald-900 text-emerald-200 border-emerald-700',
          bar: 'bg-emerald-500',
          icon: CheckCircle2
        };
    }
  };

  const riskStyles = prediction ? getRiskColor(prediction.risk_level) : getRiskColor('LOW');
  const RiskIcon = riskStyles.icon;

  return (
    <div className="tech-card border-t-2 border-t-cyan-500 p-6 rounded-2xl space-y-6">
      {/* Header (Fixed stable layout, no twitching) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-lg font-bold text-white tracking-tight">Predictive Delay Risk Engine</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-semibold">
              Live Mathematical Scoring
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transparent algorithmic prediction for <strong className="text-white font-mono">{shipment.id}</strong> based on weighted real-time factors.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">Scenarios:</span>
          <button
            onClick={() => applyPreset('LOW')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-400 text-xs font-mono border border-slate-700 transition cursor-pointer"
          >
            Low Risk
          </button>
          <button
            onClick={() => applyPreset('MEDIUM')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-950 hover:text-amber-300 text-slate-400 text-xs font-mono border border-slate-700 transition cursor-pointer"
          >
            Medium Risk
          </button>
          <button
            onClick={() => applyPreset('HIGH')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-mono border border-slate-700 transition cursor-pointer"
          >
            High Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column (Sliders & Controls) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Interactive Factor Inputs (Re-calculates Real-Time)
          </div>

          {/* 1. Traffic Factor */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Highway Traffic Congestion Factor
              </span>
              <span className="font-mono text-cyan-400 font-bold">{trafficFactor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={trafficFactor}
              onChange={(e) => setTrafficFactor(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Free Flow (0%)</span>
              <span>Moderate (50%)</span>
              <span>Gridlock (100%)</span>
            </div>
          </div>

          {/* 2. Warehouse Loading Delay */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Warehouse Loading Dock Delay
              </span>
              <span className="font-mono text-amber-400 font-bold">{warehouseDelayMins} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={warehouseDelayMins}
              onChange={(e) => setWarehouseDelayMins(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>No Delay (0m)</span>
              <span>60 mins</span>
              <span>Extreme Bottleneck (180m)</span>
            </div>
          </div>

          {/* 3. Vehicle Condition */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-400" /> Vehicle Condition & Fleet Telemetry Flag
              </span>
              <span className="font-mono text-purple-400 font-bold">{vehicleRiskFactor}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={vehicleRiskFactor}
              onChange={(e) => setVehicleRiskFactor(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Optimal Fleet (0%)</span>
              <span>Minor Alert (50%)</span>
              <span>Engine Malfunction (100%)</span>
            </div>
          </div>
        </div>

        {/* Right Output Column (Calculated Risk & Contributing Factors) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Calculated Risk Prediction Output
          </div>

          {/* Output Card */}
          <div className={`p-5 rounded-2xl border ${riskStyles.bg} transition-all duration-300 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Delay Probability</span>
                <div className={`text-4xl font-black font-mono tracking-tight ${riskStyles.text}`}>
                  {prediction ? `${prediction.delay_probability}%` : '--'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Risk Tier</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold border ${riskStyles.badge}`}>
                  <RiskIcon className="w-3.5 h-3.5" />
                  {prediction ? `${prediction.risk_level} RISK` : '--'}
                </span>
              </div>
            </div>

            {/* Gauge progress line */}
            <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-slate-700/60">
              <div 
                className={`h-full transition-all duration-300 ${riskStyles.bar}`}
                style={{ width: `${prediction ? prediction.delay_probability : 0}%` }}
              ></div>
            </div>

            {/* Forecast ETA */}
            <div className="pt-2 border-t border-slate-800/60 text-xs font-mono">
              <span className="text-slate-400">Projected ETA:</span>{' '}
              <strong className="text-white">
                {prediction ? prediction.updated_predicted_eta : '--'}
              </strong>
            </div>
          </div>

          {/* Top Contributing Factors List */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
              Top 3 Contributing Risk Drivers:
            </span>
            <div className="space-y-2 font-mono text-xs">
              {prediction?.top_contributing_factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {factor.name}
                    </span>
                    <span className="text-cyan-400 font-bold">+{factor.impact_score}% impact</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, factor.impact_score * 4)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
