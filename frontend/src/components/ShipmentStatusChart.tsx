import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ShipmentStatusChartProps {
  distribution: Record<string, number>;
}

export const ShipmentStatusChart: React.FC<ShipmentStatusChartProps> = ({ distribution }) => {
  const data = Object.entries(distribution).map(([status, count]) => ({
    status,
    count
  }));

  const getColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#10b981';
      case 'In Transit':
        return '#3b82f6';
      case 'Out for Delivery':
        return '#06b6d4';
      case 'Loaded':
      case 'Departed':
        return '#8b5cf6';
      default:
        return '#f59e0b';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Shipment Status Overview</h3>
          <p className="text-xs text-slate-400">Distribution across current logistics lifecycle stages</p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
          {Object.values(distribution).reduce((a, b) => a + b, 0)} Total
        </span>
      </div>

      <div className="h-64 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis 
                dataKey="status" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No shipment data available
          </div>
        )}
      </div>
    </div>
  );
};
