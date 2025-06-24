import React from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { PET_CARE_DATA_PLACEHOLDER } from '../../../constants';

export const PetCareWidget: React.FC = () => {
  return (
    <LifeStyleDataCard 
        title="Pet Care Services" 
        footer={<span>Happy pets, happy life.</span>}
    >
      <div className="text-sm">
        <p className="mb-2">Find pet sitters, book grooming, or schedule veterinary appointments.</p>
        {PET_CARE_DATA_PLACEHOLDER.map(item => (
          <div key={item.id} className="p-2 bg-slate-700/50 rounded-md mb-2">
            <h4 className="font-semibold text-yellow-200">{item.service} for {item.petName}</h4>
            <p>Time: <span className="text-green-400">{item.time}</span></p>
          </div>
        ))}
        <button className="mt-2 px-3 py-1.5 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 text-xs font-semibold">
          Schedule Pet Service
        </button>
      </div>
    </LifeStyleDataCard>
  );
};
