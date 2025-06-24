import React, { useState, useEffect } from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { getFitnessClasses, FitnessClass } from '../../../services/lifestyleService';

export const HealthGymWidget: React.FC = () => {
  const [fitnessClasses, setFitnessClasses] = useState<FitnessClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchFitnessData = async () => {
      try {
        setLoading(true);
        const classData = await getFitnessClasses(selectedDate);
        setFitnessClasses(classData);
      } catch (error) {
        console.error('Error fetching fitness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFitnessData();
  }, [selectedDate]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'yoga': return '🧘';
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'pilates': return '🤸';
      case 'dance': return '💃';
      case 'swimming': return '🏊';
      default: return '🏋️';
    }
  };

  const getAvailabilityPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getAvailabilityColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <LifeStyleDataCard
      title="Health & Fitness"
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-400 text-xs font-semibold">
            View Schedule
          </button>
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
            Book Class
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Date Selector */}
        <div className="mb-3">
          <label className="block text-xs text-slate-400 mb-1">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-slate-400 mb-2">Available fitness classes</p>
            {fitnessClasses.length > 0 ? (
              fitnessClasses.map(fitnessClass => {
                const availabilityPercentage = getAvailabilityPercentage(
                  fitnessClass.currentParticipants,
                  fitnessClass.maxParticipants
                );

                return (
                  <div key={fitnessClass.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(fitnessClass.type)}</span>
                        <h4 className="font-semibold text-yellow-200">{fitnessClass.name}</h4>
                      </div>
                      <span className="text-xs text-slate-400">{fitnessClass.duration}min</span>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-300">with {fitnessClass.instructor}</span>
                      <span className={`font-medium ${getDifficultyColor(fitnessClass.difficulty)}`}>
                        {fitnessClass.difficulty}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400">{fitnessClass.schedule.time} • {fitnessClass.location}</span>
                      <span className="text-green-400 font-semibold">${fitnessClass.price}</span>
                    </div>

                    {/* Availability Bar */}
                    <div className="mb-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Availability</span>
                        <span className={getAvailabilityColor(availabilityPercentage)}>
                          {fitnessClass.maxParticipants - fitnessClass.currentParticipants} spots left
                        </span>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            availabilityPercentage >= 90 ? 'bg-red-500' :
                            availabilityPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${availabilityPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Equipment */}
                    {fitnessClass.equipment && fitnessClass.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fitnessClass.equipment.slice(0, 3).map(equipment => (
                          <span key={equipment} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                            {equipment}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-slate-400">
                <p>No classes available for this date</p>
                <p className="text-xs mt-1">Try selecting a different date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </LifeStyleDataCard>
  );
};
