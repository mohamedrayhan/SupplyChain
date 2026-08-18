import React from 'react';
import { AlertCircle, Clock, MapPin, Radio, ShieldAlert } from 'lucide-react';
import type { SupplyChainEvent, Risk } from '../types';

interface HighRiskEventsProps {
  events: SupplyChainEvent[];
  risks: Risk[];
}

export const HighRiskEvents: React.FC<HighRiskEventsProps> = ({ events, risks }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Critical Incident Risks */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold text-white">Active High-Risk Incidents</h3>
          </div>
          <span className="text-xs bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full font-medium">
            {risks.length} Action Required
          </span>
        </div>

        <div className="space-y-3">
          {risks.length > 0 ? (
            risks.map((risk) => (
              <div
                key={risk.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-sm">{risk.type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase ${getSeverityBadge(risk.severity)}`}>
                        {risk.severity} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      <strong className="text-slate-300">Root Cause:</strong> {risk.root_cause}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      ₹{(risk.financial_impact / 100000).toFixed(2)} L
                    </span>
                    <div className="text-[10px] text-slate-500">Est. Impact</div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[240px]">Affected: <span className="text-slate-300 font-mono">{risk.affected_entities}</span></span>
                  <span className="text-amber-400 font-medium">{risk.probability}% Probability</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No active high-risk incidents detected.
            </div>
          )}
        </div>
      </div>

      {/* Real-time Supply Chain Event Stream */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="text-base font-semibold text-white">Recent Supply Chain Events</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Telemetry Feed</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {events.length > 0 ? (
            events.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-400 mt-0.5 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 truncate">{evt.event_type.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5 line-clamp-2">{evt.description || `Entity: ${evt.entity_id}`}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                    {evt.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {evt.location}
                      </span>
                    )}
                    <span>Source: {evt.source}</span>
                    <span className="text-emerald-400 font-mono">{evt.confidence}% conf</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No recent event telemetry logged.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
