
import React from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetCard } from './WidgetCard';

const gaugeData = [
  { name: 'Completion', value: 77, fill: '#ec4899' }, // Pink
  { name: 'Efficiency', value: 62, fill: '#f97316' }, // Orange
];

export const DualRadialGaugeWidget: React.FC = () => {
  return (
    <WidgetCard title="Performance Metrics">
      <div className="flex items-center justify-around h-full space-x-1 sm:space-x-2">
        {gaugeData.map((item, _) => (
          <div key={item.name} className="flex-1 w-full text-center">
            <ResponsiveContainer width="100%" height="80%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="90%"
                barSize={10}
                data={[item]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  minPointSize={5}
                  background={{ fill: 'rgba(75, 85, 99, 0.4)' }} // bg-slate-600 with opacity
                  dataKey="value"
                  cornerRadius={5}
                  style={{ filter: `drop-shadow(0 0 4px ${item.fill}) drop-shadow(0 0 2px ${item.fill})` }}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid #334155', borderRadius: '0.375rem', fontSize: '10px' }}
                    formatter={(value: number) => [`${value}%`, '']}
                    labelStyle={{display: 'none'}}
                />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="fill-current text-slate-100 text-base sm:text-lg font-semibold" style={{filter: `drop-shadow(0 0 3px ${item.fill})`}}>
                  {`${item.value}%`}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};
