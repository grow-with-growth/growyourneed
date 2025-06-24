import React from 'react';
import { SampleLifeStyleWidget } from './widgets/SampleLifeStyleWidget';
import { DiningWidget } from './widgets/DiningWidget';
import { TravelBookingWidget } from './widgets/TravelBookingWidget';
import { HealthGymWidget } from './widgets/HealthGymWidget';
import { GardeningWidget } from './widgets/GardeningWidget';
import { GroceriesWidget } from './widgets/GroceriesWidget';
import { HomeMaintenanceWidget } from './widgets/HomeMaintenanceWidget';
import { PersonalTrainersWidget } from './widgets/PersonalTrainersWidget';
import { CleaningServicesWidget } from './widgets/CleaningServicesWidget';
import { PetCareWidget } from './widgets/PetCareWidget';

interface LifeStyleMainContentProps {
  activeSubModuleKey: string | null;
}

export const LifeStyleMainContent: React.FC<LifeStyleMainContentProps> = ({ activeSubModuleKey }) => {
  
  const renderContent = () => {
    switch (activeSubModuleKey) {
      case 'lifestyle-dining':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <DiningWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      case 'lifestyle-booking':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <TravelBookingWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      case 'lifestyle-health-gym':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <HealthGymWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      case 'lifestyle-trainers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <PersonalTrainersWidget />
            <SampleLifeStyleWidget />
          </div>
        );
      case 'lifestyle-cleaning':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <CleaningServicesWidget />
            <SampleLifeStyleWidget />
          </div>
        );
      case 'lifestyle-pet-care':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <PetCareWidget />
            <SampleLifeStyleWidget />
          </div>
        );
      case 'lifestyle-gardening':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <GardeningWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      case 'lifestyle-groceries':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <GroceriesWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      case 'lifestyle-home-maintenance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <HomeMaintenanceWidget />
            <SampleLifeStyleWidget /> 
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <SampleLifeStyleWidget />
            <DiningWidget />
            <TravelBookingWidget />
            <HealthGymWidget />
            <PersonalTrainersWidget />
            <CleaningServicesWidget />
            <PetCareWidget />
            <GardeningWidget />
            <GroceriesWidget/>
            <HomeMaintenanceWidget/>
          </div>
        );
    }
  };

  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      {renderContent()}
      
      <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-300 mb-2">Campus Life Updates</h2>
        <p className="text-slate-400">
          Information about upcoming events, club activities, and student services can be displayed here.
          Currently showing content for: <span className="font-semibold text-yellow-300">{activeSubModuleKey || "Default View"}</span>
        </p>
      </div>
    </main>
  );
};
