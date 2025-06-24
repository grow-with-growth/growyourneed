// Comprehensive Lifestyle Booking Manager
// Handles all lifestyle service bookings in one place

import React, { useState, useEffect } from 'react';
import { Restaurant, Hotel, FitnessClass, ServiceProvider } from '../../services/lifestyleService';
import { MenuItem, Order } from '../../services/foodDeliveryService';
import { TravelBooking, FlightBooking, HotelBooking } from '../../services/travelBookingService';

interface BookingManagerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'restaurant' | 'hotel' | 'fitness' | 'cleaning' | 'grocery' | 'travel';
  initialData?: any;
}

export const LifestyleBookingManager: React.FC<BookingManagerProps> = ({
  isOpen,
  onClose,
  serviceType,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'restaurant': return 'Restaurant Booking';
      case 'hotel': return 'Hotel Booking';
      case 'fitness': return 'Fitness Class Booking';
      case 'cleaning': return 'Cleaning Service Booking';
      case 'grocery': return 'Grocery Order';
      case 'travel': return 'Travel Booking';
      default: return 'Service Booking';
    }
  };

  const renderBookingForm = () => {
    switch (serviceType) {
      case 'restaurant':
        return <RestaurantBookingForm data={bookingData} onChange={setBookingData} />;
      case 'hotel':
        return <HotelBookingForm data={bookingData} onChange={setBookingData} />;
      case 'fitness':
        return <FitnessBookingForm data={bookingData} onChange={setBookingData} />;
      case 'cleaning':
        return <CleaningBookingForm data={bookingData} onChange={setBookingData} />;
      case 'grocery':
        return <GroceryOrderForm data={bookingData} onChange={setBookingData} />;
      case 'travel':
        return <TravelBookingForm data={bookingData} onChange={setBookingData} />;
      default:
        return <div>Service not available</div>;
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and close
      alert('Booking confirmed! You will receive a confirmation email shortly.');
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">{getServiceTitle()}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-yellow-500 text-slate-900' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-yellow-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Service Details</span>
            <span>Personal Info</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderBookingForm()}
          {currentStep === 2 && <PersonalInfoForm data={bookingData} onChange={setBookingData} />}
          {currentStep === 3 && <BookingConfirmation data={bookingData} serviceType={serviceType} />}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </button>
          
          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual booking form components
const RestaurantBookingForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Restaurant Reservation</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Date</label>
        <input
          type="date"
          value={data.date || ''}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-2">Time</label>
        <select
          value={data.time || ''}
          onChange={(e) => onChange({ ...data, time: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="">Select time</option>
          {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Party Size</label>
        <select
          value={data.partySize || ''}
          onChange={(e) => onChange({ ...data, partySize: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="">Select size</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
            <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-2">Seating Preference</label>
        <select
          value={data.seating || ''}
          onChange={(e) => onChange({ ...data, seating: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
        >
          <option value="">No preference</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="bar">Bar seating</option>
          <option value="private">Private dining</option>
        </select>
      </div>
    </div>
    
    <div>
      <label className="block text-sm text-slate-300 mb-2">Special Requests</label>
      <textarea
        value={data.specialRequests || ''}
        onChange={(e) => onChange({ ...data, specialRequests: e.target.value })}
        placeholder="Any dietary restrictions, allergies, or special occasions..."
        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500 resize-none"
        rows={3}
      />
    </div>
  </div>
);

const PersonalInfoForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">First Name</label>
        <input
          type="text"
          value={data.firstName || ''}
          onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm text-slate-300 mb-2">Last Name</label>
        <input
          type="text"
          value={data.lastName || ''}
          onChange={(e) => onChange({ ...data, lastName: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
          required
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm text-slate-300 mb-2">Email</label>
      <input
        type="email"
        value={data.email || ''}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
        required
      />
    </div>
    
    <div>
      <label className="block text-sm text-slate-300 mb-2">Phone Number</label>
      <input
        type="tel"
        value={data.phone || ''}
        onChange={(e) => onChange({ ...data, phone: e.target.value })}
        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:border-yellow-500"
        required
      />
    </div>
  </div>
);

const BookingConfirmation: React.FC<{ data: any; serviceType: string }> = ({ data, serviceType }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
    
    <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <span className="text-slate-300">Service:</span>
        <span className="text-white font-medium capitalize">{serviceType}</span>
      </div>
      
      {data.date && (
        <div className="flex justify-between">
          <span className="text-slate-300">Date:</span>
          <span className="text-white">{new Date(data.date).toLocaleDateString()}</span>
        </div>
      )}
      
      {data.time && (
        <div className="flex justify-between">
          <span className="text-slate-300">Time:</span>
          <span className="text-white">{data.time}</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <span className="text-slate-300">Contact:</span>
        <span className="text-white">{data.firstName} {data.lastName}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-slate-300">Email:</span>
        <span className="text-white">{data.email}</span>
      </div>
    </div>
    
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <p className="text-yellow-200 text-sm">
        📧 A confirmation email will be sent to {data.email} once your booking is confirmed.
      </p>
    </div>
  </div>
);

// Placeholder components for other service types
const HotelBookingForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div>Hotel booking form - Coming soon</div>
);

const FitnessBookingForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div>Fitness class booking form - Coming soon</div>
);

const CleaningBookingForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div>Cleaning service booking form - Coming soon</div>
);

const GroceryOrderForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div>Grocery order form - Coming soon</div>
);

const TravelBookingForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <div>Travel booking form - Coming soon</div>
);
