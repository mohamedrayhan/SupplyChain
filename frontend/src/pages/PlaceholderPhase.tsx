import React from 'react';
import { Network, Package, Truck, AlertTriangle, Sliders, Bot, Clock } from 'lucide-react';

interface PlaceholderPhaseProps {
  tab: string;
}

export const PlaceholderPhase: React.FC<PlaceholderPhaseProps> = ({ tab }) => {
  const getTabDetails = () => {
    switch (tab) {
      case 'twin':
        return {
          title: 'Supply Chain Digital Twin',
          phase: 'Phase 7',
          description: 'Interactive node graph connecting Factories → Warehouses → Shipments → Transporters → Customers with health states & bottleneck propagation.',
          icon: Network
        };
      case 'inventory':
        return {
          title: 'Inventory Truth Engine',
          phase: 'Phase 2',
          description: 'Detailed multi-warehouse SKU breakdown with dynamic Inventory Confidence Scoring (0-100%) & mismatch simulation.',
          icon: Package
        };
      case 'shipments':
        return {
          title: 'Real-Time Shipment Visibility',
          phase: 'Phase 3',
          description: 'Live GPS vehicle telemetry tracking, stage lifecycle progression, predicted ETA calculation & delay simulation.',
          icon: Truck
        };
      case 'risk':
        return {
          title: 'Root Cause & Exception Intelligence',
          phase: 'Phase 5',
          description: 'Incident graph grouping cascading supply chain disruptions to avoid alert fatigue & evaluate financial impacts.',
          icon: AlertTriangle
        };
      case 'simulator':
        return {
          title: 'What-If Recovery Simulator',
          phase: 'Phase 6',
          description: 'Signature what-if simulator to model vehicle re-assignments, shipment splits, and cost-benefit action scores before execution.',
          icon: Sliders
        };
      case 'copilot':
        return {
          title: 'AI Supply Chain Copilot',
          phase: 'Phase 8',
          description: 'Context-aware logistics assistant providing real-time natural language answers directly queried from platform database state.',
          icon: Bot
        };
      default:
        return {
          title: 'Module Portal',
          phase: 'Upcoming Phase',
          description: 'Detailed interactive module.',
          icon: Clock
        };
    }
  };

  const details = getTabDetails();
  const Icon = details.icon;

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] p-6 text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center mx-auto text-blue-400">
          <Icon className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-mono font-semibold border border-slate-700">
          {details.phase} Ready
        </div>
        <h3 className="text-xl font-bold text-white">{details.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{details.description}</p>
        <div className="pt-2 text-xs text-slate-500 italic">
          Phase 1 Command Center is active. Click "Dashboard" in sidebar to view live live telemetry metrics.
        </div>
      </div>
    </div>
  );
};
