
import React from 'react';
import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MONTHLY_ACTIVITY_DATA } from '../../constants';
import { exportToCsv } from '../../utils'; // Import the utility
import { WidgetCard } from './WidgetCard';

export const LineChartWidget: React.FC = () => {
  const handleExport = () => {
    exportToCsv('monthly_activity.csv', MONTHLY_ACTIVITY_DATA);
  };

  return (
    <WidgetCard title="Monthly Activity Trend" onExportCsv={handleExport}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MONTHLY_ACTIVITY_DATA} margin={{ top: 5, right: 15, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActivityLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
            </linearGradient>
            <filter id="glowLine" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
            itemStyle={{ color: '#38bdf8', fontSize: '10px' }}
            cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          {/* <Legend wrapperStyle={{fontSize: "10px", bottom: "-5px !important"}} verticalAlign="top" align="right" height={20}/> */}
          <Area type="monotone" dataKey="value" stroke="none" fill="url(#colorActivityLine)" activeDot={false} />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.5}
                dot={{ r: 0, strokeWidth:0 }}
                activeDot={{ r: 4, fill: '#38bdf8', stroke: '#0284c7', strokeWidth: 1, filter:"url(#glowLine)" }}
                filter="url(#glowLine)"
                />
        </LineChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
};
