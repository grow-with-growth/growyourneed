
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { DONUT_CHART_DATA } from '../../constants'; // Assuming this data can be adapted
import { WidgetCard } from './WidgetCard';

const COLORS_OUTER = ['#fb7185', '#38bdf8', '#4ade80', '#facc15']; // Pink, Sky, Green, Yellow
const COLORS_INNER = ['#f472b6', '#0ea5e9', '#22c55e', '#eab308']; // Darker Pink, Blue, Darker Green, Darker Yellow
const COLORS_CENTER = ['#ec4899', '#0284c7', '#16a34a', '#d97706'];

export const MultiLayerDonutChartWidget: React.FC = () => {
  // Create slightly different data for inner layers for visual distinction
  const dataOuter = DONUT_CHART_DATA.map(d => ({ ...d, value: d.value * 1.0 }));
  const dataInner = DONUT_CHART_DATA.map(d => ({ ...d, value: d.value * 0.8 }));
  const dataCenter = DONUT_CHART_DATA.map(d => ({ ...d, value: d.value * 0.6 }));


  return (
    <WidgetCard title="Data Proportions">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 15, left: 0 }}>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid #334155', borderRadius: '0.375rem', fontSize: '10px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{fontSize: "9px", bottom: "-5px !important", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} layout="horizontal" verticalAlign="bottom" align="center" iconSize={8}/>

          <Pie
            data={dataOuter}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="85%"
            innerRadius="65%"
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
            stroke="none"
          >
            {dataOuter.map((_, index) => (
              <Cell key={`cell-outer-${index}`} fill={COLORS_OUTER[index % COLORS_OUTER.length]} style={{filter: `drop-shadow(0 0 2px ${COLORS_OUTER[index % COLORS_OUTER.length]})`}}/>
            ))}
          </Pie>
           <Pie
            data={dataInner}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="60%"
            innerRadius="40%"
            fill="#82ca9d"
            dataKey="value"
            paddingAngle={2}
            stroke="none"
          >
            {dataInner.map((_, index) => (
              <Cell key={`cell-inner-${index}`} fill={COLORS_INNER[index % COLORS_INNER.length]} style={{filter: `drop-shadow(0 0 2px ${COLORS_INNER[index % COLORS_INNER.length]})`}}/>
            ))}
          </Pie>
          <Pie
            data={dataCenter}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="35%"
            innerRadius="15%"
            fill="#ffc658"
            dataKey="value"
            paddingAngle={2}
            stroke="none"
          >
            {dataCenter.map((_, index) => (
              <Cell key={`cell-center-${index}`} fill={COLORS_CENTER[index % COLORS_CENTER.length]} style={{filter: `drop-shadow(0 0 2px ${COLORS_CENTER[index % COLORS_CENTER.length]})`}}/>
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
};
