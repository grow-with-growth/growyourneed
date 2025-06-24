import React from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { HOME_MAINTENANCE_DATA_PLACEHOLDER } from '../../../constants';

export const HomeMaintenanceWidget: React.FC = () => {
  return (
    <LifeStyleDataCard 
        title="Home Maintenance" 
        footer={<span>Keep your living space in top shape.</span>}
    >
      <div className="text-sm">
        <p className="mb-2">Request repairs, find certified handymen, and manage maintenance tasks.</p>
        {HOME_MAINTENANCE_DATA_PLACEHOLDER.map(item => (
          <div key={item.id} className="p-2 bg-slate-700/50 rounded-md mb-2">
            <h4 className="font-semibold text-yellow-200">{item.request} ({item.room})</h4>
            <p>Status: <span className="text-orange-400">{item.status}</span></p>
          </div>
        ))}
        <button className="mt-2 px-3 py-1.5 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 text-xs font-semibold">
          New Maintenance Request
        </button>
      </div>
    </LifeStyleDataCard>
  );
};
