import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SAMPLE_MEDIA_CHART_DATA } from '../../../constants'; // Adapt or create new data
import { MediaDataCard } from '../MediaDataCard';

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#f43f5e']; // Reds, Oranges

export const SampleMediaWidget: React.FC = () => {
  return (
    <MediaDataCard
        title="Media Content Distribution"
        footer={<span>Monthly analysis</span>}
    >
      <ResponsiveContainer width="100%" height={250}>
        <div style={{ width: '100%', height: '100%' }}>
            <PieChart>
                <Tooltip
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem'}}
                labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{fontSize: "10px", paddingTop: "10px"}} verticalAlign="bottom" align="center" iconSize={8}/>
                <Pie
                    data={SAMPLE_MEDIA_CHART_DATA} // Assuming data structure { name: string, value: number }
                    cx="50%"
                    cy="45%" // Adjusted for legend
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                {SAMPLE_MEDIA_CHART_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity"/>
                ))}
                </Pie>
            </PieChart>
        </div>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Breakdown of media types and engagement across platforms.
      </p>
    </MediaDataCard>
  );
};
