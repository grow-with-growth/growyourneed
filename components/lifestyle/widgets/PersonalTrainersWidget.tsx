import React from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { PERSONAL_TRAINERS_DATA_PLACEHOLDER } from '../../../constants';

export const PersonalTrainersWidget: React.FC = () => {
  return (
    <LifeStyleDataCard 
        title="Personal Trainers" 
        footer={<span>Achieve your fitness goals.</span>}
    >
      <div className="text-sm">
        <p className="mb-2">Find certified personal trainers, book sessions, and manage your training plans.</p>
        {PERSONAL_TRAINERS_DATA_PLACEHOLDER.map(item => (
          <div key={item.id} className="p-2 bg-slate-700/50 rounded-md mb-2">
            <h4 className="font-semibold text-yellow-200">{item.trainer}</h4>
            <p>Specialty: {item.specialty}</p>
            <p>Availability: <span className="text-green-400">{item.availability}</span></p>
          </div>
        ))}
        <button className="mt-2 px-3 py-1.5 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 text-xs font-semibold">
          Find a Trainer
        </button>
      </div>
    </LifeStyleDataCard>
  );
};
