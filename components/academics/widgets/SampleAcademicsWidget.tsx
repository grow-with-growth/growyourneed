import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SAMPLE_ACADEMICS_CHART_DATA } from '../../../constants';
import { AcademicsDataCard } from '../AcademicsDataCard';

const BAR_COLORS = ['#22c55e', '#4ade80', '#86efac', '#16a34a']; // Greens

export const SampleAcademicsWidget: React.FC = () => {
  return (
    <AcademicsDataCard
        title="Course Performance"
        footer={<span>Data as of Q2 2024</span>}
    >
      <ResponsiveContainer width="100%" height={250}>
       <div style={{ width: '100%', height: '100%' }}>
          <BarChart data={SAMPLE_ACADEMICS_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.6}/>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dy={5}/>
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dx={-5}/>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem', boxShadow: '0 0 15px rgba(34,197,94,0.2)' }}
              labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ color: '#86efac', fontSize: '11px' }}
              cursor={{ fill: 'rgba(34,197,94, 0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: "10px", paddingTop: "10px"}} verticalAlign="bottom" align="center"/>
            <Bar dataKey="value" barSize={15} radius={[4, 4, 0, 0]}>
              {SAMPLE_ACADEMICS_CHART_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity"/>
              ))}
            </Bar>
          </BarChart>
        </div>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Overview of average scores across different courses.
      </p>
    </AcademicsDataCard>
  );
};
