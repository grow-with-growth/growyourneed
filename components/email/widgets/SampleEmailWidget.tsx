import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SAMPLE_EMAIL_CHART_DATA } from '../../../constants';
import { EmailDataCard } from '../EmailDataCard';

const BAR_COLORS = ['#ec4899', '#f472b6', '#f9a8d4', '#db2777']; // Pinks

export const SampleEmailWidget: React.FC = () => {
  return (
    <EmailDataCard
        title="Email Campaign Performance"
        footer={<span>Last campaign: Summer Promo</span>}
    >
      <ResponsiveContainer width="100%" height={250}>
       <div style={{ width: '100%', height: '100%' }}>
          <BarChart data={SAMPLE_EMAIL_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.6}/>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dy={5}/>
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dx={-5}/>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem'}}
              labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ color: '#fbcfe8', fontSize: '11px' }}
            />
            <Legend wrapperStyle={{fontSize: "10px", paddingTop: "10px"}} verticalAlign="bottom" align="center"/>
            <Bar dataKey="value" name="Open Rate %" barSize={15} radius={[4, 4, 0, 0]}>
              {SAMPLE_EMAIL_CHART_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity"/>
              ))}
            </Bar>
          </BarChart>
        </div>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Key metrics for recent email marketing campaigns.
      </p>
    </EmailDataCard>
  );
};
