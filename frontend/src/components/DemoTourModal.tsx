import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  LayoutDashboard, 
  Package, 
  Truck, 
  AlertTriangle, 
  Sliders, 
  Network, 
  Zap
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

interface TourStep {
  title: string;
  tab: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  actionInstruction: string;
  keyHighlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Executive Supply Chain Command Center',
    tab: 'dashboard',
    icon: LayoutDashboard,
    badge: 'Phase 1 • Real-Time Telemetry',
    description: 'High-level executive dashboard synthesizing multi-facility warehouse utilization, active shipment statuses, and live IoT event streams.',
    actionInstruction: 'Inspect the live KPI cards, regional warehouse utilization bars, and the real-time event feed.',
    keyHighlights: [
      'Live KPI telemetry metrics (Active shipments, On-time rate, Inventory health)',
      'Regional warehouse utilization tracking (Chennai, Bangalore, Mumbai, Hyderabad)',
      'Sub-second event stream updates from IoT beacons and RFID scanners'
    ]
  },
  {
    title: '2. Multi-State Inventory Truth Engine',
    tab: 'inventory',
    icon: Package,
    badge: 'Phase 2 • Digital-Physical Reconciliation',
    description: 'Eliminates phantom inventory by categorizing stock across 5 operational states (Available, Reserved, Being Picked, In Transit, Quality Hold).',
    actionInstruction: 'Click "Simulate Mismatch" on SKU-IND-001 to observe how the Confidence Score drops and flags an ERP-to-physical audit discrepancy.',
    keyHighlights: [
      '5 granular inventory states per SKU (Available, Reserved, Picked, In-Transit, Quality Hold)',
      'Mathematical Confidence Scoring Engine (0-100%)',
      'One-click Cycle Count Mismatch Simulator for audit discrepancy demonstration'
    ]
  },
  {
    title: '3. Predictive Delay Risk Engine',
    tab: 'shipments',
    icon: Truck,
    badge: 'Phase 3 & 4 • Scikit-Learn ML Ensemble',
    description: '8-stage shipment lifecycle tracker powered by a Random Forest & Gradient Boosting ML model forecasting delays before they materialize.',
    actionInstruction: 'Select SHP-2026-001 and adjust the Highway Traffic and Warehouse Delay sliders to see live ML probability and feature attributions.',
    keyHighlights: [
      '8-stage visual milestone progression (Created -> Loaded -> In Transit -> Delivered)',
      'Trained Random Forest Regressor calculating calibrated delay probability & ETA drift',
      'Dynamic feature importance attribution breakdown (Traffic, Warehouse, Vehicle health)'
    ]
  },
  {
    title: '4. Root Cause & Exception Intelligence',
    tab: 'risk',
    icon: AlertTriangle,
    badge: 'Phase 5 • 3-Tier Cascade Graph',
    description: 'Correlates cascading supply chain anomalies into grouped incident clusters, preventing alert fatigue and computing contractual SLA loss.',
    actionInstruction: 'Click "Simulate Warehouse Bottleneck" to trigger a loading dock failure and trace its propagation down to affected customers.',
    keyHighlights: [
      'Automated grouping of isolated alarms into high-severity Incident Clusters',
      '3-Tier Dependency Graph: Warehouse Bottleneck -> Queued Shipments -> Impacted Customers',
      'Financial impact quantification (₹12.50 Lakhs contractual exposure)'
    ]
  },
  {
    title: '5. Autonomous What-If Recovery Simulator',
    tab: 'simulator',
    icon: Sliders,
    badge: 'Phase 6 • Action Value Optimization',
    description: 'Evaluates 5 strategic mitigation actions using the Action Value Score formula (Benefit / Cost) and persists selected plans to the database.',
    actionInstruction: 'Select ACT-01 (Assign Backup Vehicles) and click "Apply Recovery Plan to Production" to surge On-Time delivery back to 93%.',
    keyHighlights: [
      '5 distinct mitigation action models (Backup fleet, alternate hubs, micro-batches, carrier switch)',
      'Mathematical Action Value Score (0-100) optimizing ROI & SLA recovery',
      'Real database persistence that resolves active bottlenecks and restores dashboard metrics'
    ]
  },
  {
    title: '6. Supply Chain Digital Twin & AI Copilot',
    tab: 'twin',
    icon: Network,
    badge: 'Phase 7 & 8 • Multi-Echelon & NLP Vectors',
    description: 'Interactive 4-echelon visual network topology paired with a TF-IDF vector-based AI Copilot with autoregressive token streaming.',
    actionInstruction: 'Inspect the Digital Twin node connections or open AI Copilot to ask custom natural language questions about your live fleet.',
    keyHighlights: [
      'Interactive SVG Digital Twin topology: Warehouses -> Transporters -> Cargo -> Customers',
      'Isolated Node Route Focus eliminating canvas visual congestion',
      'NLP Vector Space Cosine Similarity Copilot with live database entity lookup & token streaming'
    ]
  }
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNavigateTab(TOUR_STEPS[nextIndex].tab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onNavigateTab(TOUR_STEPS[prevIndex].tab);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    onNavigateTab(TOUR_STEPS[index].tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#090d16] border border-blue-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl shadow-blue-950/80 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/50 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-mono">CHAINSIGHT Hackathon Demo Tour</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
                  Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive end-to-end evaluation flow for judges and review panels.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-6 gap-2">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-blue-500 shadow-md shadow-blue-500/50 scale-105'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500/80'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={step.title}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                {currentStep.badge}
              </span>
              <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Icon className="w-5 h-5 text-blue-400" />
                <span>{currentStep.title}</span>
              </h4>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {currentStep.description}
          </p>

          {/* Key Feature Highlights */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              Key Technical Capabilities Demonstrated:
            </div>
            <div className="space-y-1.5">
              {currentStep.keyHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Demo Directive */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-200 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block font-sans">Suggested Judge Demo Action:</strong>
              <span className="text-slate-300 font-sans text-[11px]">{currentStep.actionInstruction}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="text-[11px] font-mono text-slate-500">
            Navigation Mode: Interactive
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold font-mono transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-950/60"
          >
            <span>{isLast ? 'Complete Tour' : 'Next Stage'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
