
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RESOURCE_USAGE_DATA } from '../../constants';
import { WidgetCard } from './WidgetCard';

export const BarChartWidget: React.FC = () => {
  return (
    <WidgetCard title="Resource Usage Volume">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RESOURCE_USAGE_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
             <filter id="glowBar" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
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
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid #334155', borderRadius: '0.375rem', boxShadow: '0 0 10px rgba(0, 183, 255, 0.3)' }}
            labelStyle={{ color: '#cbd5e1', fontSize: '10px' }}
            itemStyle={{ color: '#0ea5e9', fontSize: '10px' }}
            cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={10} filter="url(#glowBar)">
            {RESOURCE_USAGE_DATA.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#0ea5e9" className="opacity-70 hover:opacity-100 transition-opacity duration-150" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
};
