import React, { useState, useEffect } from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { searchServiceProviders, ServiceProvider } from '../../../services/lifestyleService';

export const CleaningServicesWidget: React.FC = () => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('House Cleaning');

  const serviceTypes = [
    'House Cleaning',
    'Deep Cleaning',
    'Office Cleaning',
    'Carpet Cleaning',
    'Window Cleaning'
  ];

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        const providers = await searchServiceProviders(selectedService, 'local area');
        setServiceProviders(providers.slice(0, 3));
      } catch (error) {
        console.error('Error fetching service providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, [selectedService]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getNextAvailableSlot = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <LifeStyleDataCard
      title="Cleaning Services"
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
            Book Now
          </button>
          <button className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-400 text-xs font-semibold">
            Get Quote
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Service Type Selector */}
        <div className="mb-3">
          <label className="block text-xs text-slate-400 mb-1">Service Type:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
          >
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-slate-400 mb-2">Available service providers</p>
            {serviceProviders.length > 0 ? (
              serviceProviders.map(provider => (
                <div key={provider.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-yellow-200">{provider.name}</h4>
                    {provider.verified && (
                      <span className="text-xs bg-green-600/50 text-green-300 px-1.5 py-0.5 rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-yellow-400">{renderStars(provider.rating)}</span>
                    <span className="text-slate-400">({provider.reviewCount} reviews)</span>
                  </div>

                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">{provider.experience}</span>
                    <span className="text-green-400 font-semibold">{provider.priceRange}</span>
                  </div>

                  <div className="text-xs text-slate-400 mb-1">
                    📍 {provider.location}
                  </div>

                  <div className="text-xs text-green-400 mb-1">
                    Next available: {getNextAvailableSlot()}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {provider.specialties.slice(0, 3).map(specialty => (
                      <span key={specialty} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-400">
                <p>No providers found</p>
                <p className="text-xs mt-1">Try a different service type</p>
              </div>
            )}
          </div>
        )}
      </div>
    </LifeStyleDataCard>
  );
};
