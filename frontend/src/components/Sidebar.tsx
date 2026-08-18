import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Package, 
  Truck, 
  AlertTriangle, 
  Sliders, 
  Bot,
  Zap,
  Link2,
  Compass,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, status: 'Active' },
    { id: 'inventory', label: 'Inventory Truth', icon: Package, status: 'Active' },
    { id: 'shipments', label: 'Shipments Tracking', icon: Truck, status: 'Active' },
    { id: 'risk', label: 'Risk Center', icon: AlertTriangle, status: 'Active' },
    { id: 'simulator', label: 'Recovery Simulator', icon: Sliders, status: 'Active' },
    { id: 'twin', label: 'Supply Chain Twin', icon: Network, status: 'Active' },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, status: 'Active' },
    { id: 'swarm', label: 'AI Agent Swarm', icon: Zap, status: 'Phase 10' },
    { id: 'blockchain', label: 'Blockchain & Escrow', icon: Link2, status: 'Phase 11' },
    { id: 'gnn', label: 'GNN & Deep RL Routing', icon: Compass, status: 'Phase 12' },
  ];

  return (
    <aside className="w-64 bg-[#090d16]/90 border-r border-slate-800/80 shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          Command Hub Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.status === 'Active' ? (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              ) : (
                <span className="text-[10px] bg-slate-900 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono font-bold">
                  {item.status}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CHAINSIGHT 2.0
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">All 12 Phases Active Locally</div>
        </div>
      </div>
    </aside>
  );
};
