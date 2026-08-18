import React from 'react';
import { Truck, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { DashboardKPIs } from '../types';

interface KPICardsProps {
  kpis: DashboardKPIs;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Active Shipments',
      value: kpis.active_shipments.toString(),
      subtitle: `${kpis.total_warehouses} Connected Nodes`,
      icon: Truck,
      accentBorder: 'border-t-blue-500',
      iconBg: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
      badge: 'Live Tracking',
      badgeColor: 'bg-blue-950 text-blue-400 border-blue-800'
    },
    {
      title: 'At-Risk Shipments',
      value: kpis.at_risk_shipments.toString(),
      subtitle: `${kpis.critical_risks_count} Incident Alerts Active`,
      icon: AlertTriangle,
      accentBorder: kpis.at_risk_shipments > 0 ? 'border-t-amber-500' : 'border-t-emerald-500',
      iconBg: kpis.at_risk_shipments > 0 ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      badge: kpis.at_risk_shipments > 0 ? 'Action Needed' : 'Nominal',
      badgeColor: kpis.at_risk_shipments > 0 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      title: 'On-Time Delivery Rate',
      value: `${kpis.on_time_delivery_rate}%`,
      subtitle: 'Target Threshold: 92.0%',
      icon: CheckCircle2,
      accentBorder: kpis.on_time_delivery_rate >= 90 ? 'border-t-emerald-500' : 'border-t-rose-500',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      badge: '+1.8% vs benchmark',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      title: 'Inventory Confidence',
      value: `${kpis.inventory_health}%`,
      subtitle: 'Truth Engine Score',
      icon: ShieldCheck,
      accentBorder: 'border-t-cyan-500',
      iconBg: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
      badge: 'RFID Synced',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`tech-card border-t-2 ${card.accentBorder} p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}
          >
            {/* Background subtle glow overlay */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/2 rounded-full blur-2xl group-hover:bg-white/5 transition-all"></div>

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {card.value}
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${card.iconBg} shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{card.subtitle}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
