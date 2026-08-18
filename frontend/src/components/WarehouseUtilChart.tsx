import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Warehouse } from '../types';

interface WarehouseUtilChartProps {
  warehouses: Warehouse[];
}

export const WarehouseUtilChart: React.FC<WarehouseUtilChartProps> = ({ warehouses }) => {
  const data = warehouses.map(w => ({
    name: w.name.replace(' Warehouse', '').replace(' Distribution Center', ' DC').replace(' Logistics Hub', ' Hub'),
    utilization: w.current_utilization,
    status: w.status
  }));

  const getBarColor = (util: number, status: string) => {
    if (status === 'Critical' || util >= 90) return '#ef4444';
    if (status === 'At Risk' || util >= 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Warehouse Capacity Utilization</h3>
          <p className="text-xs text-slate-400">Current storage occupancy across key facilities (%)</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> &lt;80%
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 80-89%
          </span>
          <span className="flex items-center gap-1 text-[11px] text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> &ge;90%
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
              <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
              <Tooltip 
                formatter={(val: any) => [`${val}%`, 'Utilization']}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="utilization" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.utilization, entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No warehouse utilization data available
          </div>
        )}
      </div>
    </div>
  );
};
