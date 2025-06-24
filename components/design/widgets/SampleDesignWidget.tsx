import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { SAMPLE_DESIGN_CHART_DATA } from '../../../constants'; // Adapt or create data
import { DesignDataCard } from '../DesignDataCard';

const radarData = SAMPLE_DESIGN_CHART_DATA.slice(0, 5).map(d => ({ subject: d.name, A: d.value, fullMark: Math.max(...SAMPLE_DESIGN_CHART_DATA.map(i=>i.value)) + 100 }));


export const SampleDesignWidget: React.FC = () => {
  return (
    <DesignDataCard 
        title="Project Design Phase Progress" 
        footer={<span>Current sprint overview</span>}
    >
      <ResponsiveContainer width="100%" height={250}>
        <div style={{ width: '100%', height: '100%' }}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <defs>
                    <radialGradient id="gradDesign" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(129, 140, 248, 0.1)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
                    </radialGradient>
                </defs>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" stroke="#a5b4fc" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, radarData[0]?.fullMark || 1000]} tick={false} axisLine={false} />
                <Radar name="Progress" dataKey="A" stroke="#818cf8" fill="url(#gradDesign)" fillOpacity={0.7} strokeWidth={2}/>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.375rem'}} 
                    labelStyle={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#c7d2fe', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{fontSize: "10px", paddingTop: "0px", transform: "translateY(-10px)"}} verticalAlign="bottom" align="center" />
            </RadarChart>
        </div>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">
        Visual representation of progress across different design areas.
      </p>
    </DesignDataCard>
  );
};