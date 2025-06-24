import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from 'recharts';
import { WidgetCard } from './WidgetCard';
import { ComputerDesktopIcon, ArrowTrendingUpIcon } from '../icons'; // Assuming these are still representative

const data = [
  { name: 'Online', value: 88, fill: '#22d3ee' }, // Cyan
  { name: 'Usage', value: 46, fill: '#38bdf8' }, // Sky Blue
];

export const DualGaugePanelWidget: React.FC = () => {
  return (
    <WidgetCard title="Device Status">
      <div className="flex items-center justify-around h-full space-x-1 sm:space-x-2">
        {data.map(item => (
        <div key={item.name} className="flex-1 w-full text-center">
            {item.name === 'Online' ? 
              <ComputerDesktopIcon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5 text-cyan-400" /> :
              <ArrowTrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-0.5 text-sky-400" />
            }
            <ResponsiveContainer width="100%" height="70%">
                <RadialBarChart
                    cx="50%"
                    cy="60%" 
                    innerRadius="65%"
                    outerRadius="100%"
                    barSize={8}
                    data={[item]}
                    startAngle={180}
                    endAngle={0}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                        minPointSize={5}
                        background={{ fill: 'rgba(51, 65, 85, 0.5)' }} // slate-700 with opacity
                        dataKey="value"
                        cornerRadius={4}
                        className="filter_drop-shadow_0_0_3px_var(fill)" // attempt glow via filter
                        style={{ filter: `drop-shadow(0 0 3px ${item.fill})` }}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', border: '1px solid #334155', borderRadius: '0.375rem', fontSize: '10px' }} 
                        formatter={(value: number) => [`${value}%`, '']}
                        labelStyle={{ display: 'none' }}
                    />
                    <text x="50%" y="60%" textAnchor="middle" dy="-0.2em" className="fill-current text-slate-100 text-sm sm:text-base font-semibold">
                        {`${item.value}%`}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-[9px] sm:text-[10px] text-slate-400 -mt-1 sm:mt-0">{item.name}</p>
        </div>
        ))}
      </div>
    </WidgetCard>
  );
};
