import React from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { GARDENING_DATA_PLACEHOLDER } from '../../../constants';

export const GardeningWidget: React.FC = () => {
  return (
    <LifeStyleDataCard 
        title="Gardening Services" 
        footer={<span>Keep your green spaces beautiful.</span>}
    >
      <div className="text-sm">
        <p className="mb-2">Request landscaping, order supplies, or get gardening advice.</p>
        {GARDENING_DATA_PLACEHOLDER.map(item => (
          <div key={item.id} className="p-2 bg-slate-700/50 rounded-md mb-2">
            <h4 className="font-semibold text-yellow-200">{item.service}</h4>
            <p>Scheduled: {item.schedule}</p>
          </div>
        ))}
        <button className="mt-2 px-3 py-1.5 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 text-xs font-semibold">
          Request Service
        </button>
      </div>
    </LifeStyleDataCard>
  );
};
