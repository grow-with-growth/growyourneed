import React, { useState, useEffect } from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { getPopularDestinations, getBookingHistory, TravelDestination, TravelBooking } from '../../../services/travelBookingService';

export const TravelBookingWidget: React.FC = () => {
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [bookings, setBookings] = useState<TravelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'destinations' | 'bookings'>('destinations');

  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        setLoading(true);
        const [destinationData, bookingData] = await Promise.all([
          getPopularDestinations(),
          getBookingHistory('user-123')
        ]);
        setDestinations(destinationData.slice(0, 3));
        setBookings(bookingData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching travel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'car': return '🚗';
      case 'package': return '📦';
      default: return '🎫';
    }
  };

  return (
    <LifeStyleDataCard
      title="Travel & Bookings"
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
            Book Flight
          </button>
          <button className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-400 text-xs font-semibold">
            Find Hotels
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Tab Navigation */}
        <div className="flex mb-3 bg-slate-700/30 rounded-md p-1">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'destinations'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            My Bookings
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'destinations' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Popular travel destinations</p>
                {destinations.map(destination => (
                  <div key={destination.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-yellow-200">{destination.name}</h4>
                      <span className="text-xs text-slate-400">{destination.region}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{destination.description.substring(0, 80)}...</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">
                        {destination.averageTemperature.high}°{destination.averageTemperature.unit} avg
                      </span>
                      <span className="text-green-400">
                        From ${destination.averageCost.budget}/day
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {destination.bestTimeToVisit.slice(0, 2).map(month => (
                        <span key={month} className="px-1.5 py-0.5 bg-blue-600/50 rounded text-xs text-blue-300">
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Recent travel bookings</p>
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <div key={booking.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getBookingTypeIcon(booking.type)}</span>
                          <h4 className="font-semibold text-yellow-200 capitalize">{booking.type}</h4>
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">#{booking.confirmationNumber}</span>
                        <span className="text-green-400">${booking.totalPrice}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Booked: {formatDate(booking.bookingDate)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400">
                    <p>No bookings found</p>
                    <p className="text-xs mt-1">Start planning your next trip!</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </LifeStyleDataCard>
  );
};
