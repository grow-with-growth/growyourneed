
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SAMPLE_ANALYTIC_CHART_DATA } from '../../../constants';
import { exportToCsv } from '../../../utils'; // Import the utility
import { AnalyticDataCard } from '../AnalyticDataCard';

const BAR_COLORS = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fb7185']; // Sky, Indigo, Purple, Pink, Rose

export const SampleAnalyticWidget: React.FC = () => {
  const handleExport = () => {
    exportToCsv('sample_analytics_metrics.csv', SAMPLE_ANALYTIC_CHART_DATA);
  };

  return (
    <AnalyticDataCard
        title="Sample Metric Overview"
        footer={<span>Last updated: {new Date().toLocaleDateString()}</span>}
        onExportCsv={handleExport}
    >
      <ResponsiveContainer width="100%" height={250}>
          <BarChart data={SAMPLE_ANALYTIC_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.6}/>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dy={5}/>
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{stroke: "#475569"}} dx={-5}/>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem', boxShadow: '0 0 15px rgba(0, 150, 255, 0.2)' }}
              labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ color: '#bae6fd', fontSize: '11px' }}
              cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: "10px", paddingTop: "10px"}} verticalAlign="bottom" align="center" />
            <Bar dataKey="value" barSize={15} radius={[4, 4, 0, 0]}>
              {SAMPLE_ANALYTIC_CHART_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity"/>
              ))}
            </Bar>
          </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        This chart shows a sample overview of key metrics. Interact with the bars for more details.
      </p>
    </AnalyticDataCard>
  );
};
