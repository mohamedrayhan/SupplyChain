import React from 'react';
import { Activity, RefreshCw, Cpu, RotateCcw, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onReset: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, onReset, isLoading, lastUpdated }) => {
  return (
    <header className="bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      {/* Top Telemetry Ticker Strip */}
      <div className="bg-[#050810] border-b border-slate-800/50 px-6 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-6 overflow-hidden">
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold shrink-0">
            <Zap className="w-3 h-3 text-cyan-400" /> TELEMETRY STREAM
          </span>
          <span className="hidden sm:inline text-slate-400 truncate">
            GPS NODE #44: Hosur NH44 Traffic Alert • WMS CHE-01: Dock 3 Bottleneck Active • ERP: SKU-BATT-770 Audit Flagged
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-slate-400">
          <span>LATENCY: <strong className="text-emerald-400 font-normal">14ms</strong></span>
          <span className="hidden md:inline">FREQ: <strong className="text-slate-300 font-normal">100Hz</strong></span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-blue-500/40 flex items-center justify-center glow-blue">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-white tracking-wider font-mono">
                CHAIN<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">SIGHT</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-400 border border-blue-800">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Autonomous Supply Chain Visibility & Predictive Recovery Engine
            </p>
          </div>
        </div>

        {/* Action & Status Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-mono text-[11px]">Twin Sync: Active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </div>

          {lastUpdated && (
            <span className="text-[11px] font-mono text-slate-400 hidden xl:inline">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/40 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-medium border border-slate-700/80 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>
      </div>
    </header>
  );
};
