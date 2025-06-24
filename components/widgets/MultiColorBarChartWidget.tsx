
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { MULTI_COLOR_BAR_DATA } from '../../constants';
import { WidgetCard } from './WidgetCard';

// Define more vibrant colors as per the image
const BAR_COLORS = ['#ec4899', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']; // Pink, Orange, Yellow, Green, Blue, Purple

export const MultiColorBarChartWidget: React.FC = () => {
  return (
    <WidgetCard title="Category Breakdown">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MULTI_COLOR_BAR_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
             <filter id="glowMultiBar" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#334155" opacity={0.5}/>
          <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} dy={5}/>
          <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} dx={-5}/>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid #334155', borderRadius: '0.375rem', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }} 
            labelStyle={{ color: '#cbd5e1', fontSize: '10px' }}
            itemStyle={{ fontSize: '10px' }}
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={10} filter="url(#glowMultiBar)">
            {MULTI_COLOR_BAR_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || BAR_COLORS[index % BAR_COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
};
