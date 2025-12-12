
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface HolographicChartProps {
  data: ChartData[];
  colors: [string, string]; // [startColor, endColor] for gradient
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-900/80 backdrop-blur-sm border border-green-400/50 rounded-lg shadow-lg">
        <p className="label text-green-300">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const HolographicChart: React.FC<HolographicChartProps> = ({ data, colors }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[1]} stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="url(#colorUv)" style={{ filter: `drop-shadow(0 0 8px ${colors[0]})` }}/>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HolographicChart;
