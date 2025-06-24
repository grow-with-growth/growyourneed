import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { SAMPLE_LIFESTYLE_CHART_DATA } from '../../../constants';
import { LifeStyleDataCard } from '../LifeStyleDataCard';

export const SampleLifeStyleWidget: React.FC = () => {
  return (
    <LifeStyleDataCard 
        title="Campus Event Attendance" 
        footer={<span>Updated weekly</span>}
    >
      <ResponsiveContainer width="100%" height={250}>
        <div style={{ width: '100%', height: '100%' }}>
          <LineChart data={SAMPLE_LIFESTYLE_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorLifeStyle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.6}/>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dy={5}/>
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dx={-5}/>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem'}} 
              labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ color: '#fde047', fontSize: '11px' }} // Lighter yellow for item
            />
            <Legend wrapperStyle={{fontSize: "10px", paddingTop: "10px"}} verticalAlign="bottom" align="center"/>
            <Area type="monotone" dataKey="value" stroke="none" fill="url(#colorLifeStyle)" activeDot={false} />
            <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, strokeWidth:1, stroke:"#eab308" }}/>
          </LineChart>
        </div>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Tracking participation in various campus lifestyle events.
      </p>
    </LifeStyleDataCard>
  );
};