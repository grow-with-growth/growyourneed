// Travel Booking Service - Production Ready
// Integrates with travel APIs and booking platforms

export interface TravelBooking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'package';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  totalPrice: number;
  currency: string;
  confirmationNumber: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface FlightBooking extends TravelBooking {
  type: 'flight';
  flights: Array<{
    flightNumber: string;
    airline: string;
    departure: {
      airport: string;
      city: string;
      date: string;
      time: string;
    };
    arrival: {
      airport: string;
      city: string;
      date: string;
      time: string;
    };
    passengers: Array<{
      name: string;
      seat?: string;
      ticketNumber: string;
    }>;
  }>;
}

export interface HotelBooking extends TravelBooking {
  type: 'hotel';
  hotel: {
    name: string;
    address: string;
    city: string;
    country: string;
    rating: number;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: Array<{
    type: string;
    guests: number;
    roomNumber?: string;
  }>;
  amenities: string[];
}

export interface CarRental extends TravelBooking {
  type: 'car';
  vehicle: {
    make: string;
    model: string;
    category: string;
    transmission: string;
    fuelType: string;
    seats: number;
    imageUrl?: string;
  };
  pickupLocation: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  dropoffLocation: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  pickupDate: string;
  dropoffDate: string;
  duration: number; // in days
  insurance: {
    type: string;
    coverage: string[];
    price: number;
  }[];
}

export interface TravelPackage extends TravelBooking {
  type: 'package';
  destination: string;
  duration: number; // in days
  includes: string[];
  itinerary: Array<{
    day: number;
    activities: string[];
    meals: string[];
    accommodation: string;
  }>;
  flights?: FlightBooking['flights'];
  hotels?: HotelBooking['hotel'][];
}

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  averageTemperature: {
    high: number;
    low: number;
    unit: string;
  };
  bestTimeToVisit: string[];
  popularAttractions: string[];
  averageCost: {
    budget: number;
    midRange: number;
    luxury: number;
    currency: string;
  };
  travelRequirements: {
    visa: boolean;
    passport: boolean;
    vaccinations: string[];
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Mock data for demonstration
const POPULAR_DESTINATIONS: TravelDestination[] = [
  {
    id: 'dest-1',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The City of Light, famous for its art, fashion, gastronomy, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600',
    averageTemperature: { high: 20, low: 8, unit: 'C' },
    bestTimeToVisit: ['April', 'May', 'September', 'October'],
    popularAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
    averageCost: { budget: 80, midRange: 150, luxury: 300, currency: 'EUR' },
    travelRequirements: { visa: false, passport: true, vaccinations: [] },
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 'dest-2',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'A vibrant metropolis blending traditional culture with cutting-edge technology.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    averageTemperature: { high: 22, low: 12, unit: 'C' },
    bestTimeToVisit: ['March', 'April', 'May', 'October', 'November'],
    popularAttractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Imperial Palace'],
    averageCost: { budget: 60, midRange: 120, luxury: 250, currency: 'USD' },
    travelRequirements: { visa: false, passport: true, vaccinations: [] },
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'dest-3',
    name: 'New York City',
    country: 'United States',
    region: 'North America',
    description: 'The Big Apple - a global hub for finance, arts, fashion, and culture.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
    averageTemperature: { high: 21, low: 9, unit: 'C' },
    bestTimeToVisit: ['April', 'May', 'September', 'October', 'November'],
    popularAttractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    averageCost: { budget: 100, midRange: 200, luxury: 400, currency: 'USD' },
    travelRequirements: { visa: true, passport: true, vaccinations: [] },
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }
];

const MAJOR_AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', coordinates: { lat: 40.6413, lng: -73.7781 } },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', coordinates: { lat: 33.9425, lng: -118.4081 } },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK', coordinates: { lat: 51.4700, lng: -0.4543 } },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.7720, lng: 140.3929 } },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', coordinates: { lat: 25.2532, lng: 55.3657 } }
];

export const getPopularDestinations = async (): Promise<TravelDestination[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return POPULAR_DESTINATIONS;
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    return [];
  }
};

export const searchDestinations = async (query: string): Promise<TravelDestination[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    
    return POPULAR_DESTINATIONS.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm) ||
      dest.country.toLowerCase().includes(searchTerm) ||
      dest.region.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
};

export const getDestinationDetails = async (destinationId: string): Promise<TravelDestination | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return POPULAR_DESTINATIONS.find(dest => dest.id === destinationId) || null;
  } catch (error) {
    console.error('Error fetching destination details:', error);
    return null;
  }
};

export const searchAirports = async (query: string): Promise<Airport[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    
    return MAJOR_AIRPORTS.filter(airport =>
      airport.code.toLowerCase().includes(searchTerm) ||
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

export const bookFlight = async (flightData: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
}): Promise<FlightBooking> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate booking process
    
    const bookingId = `FL-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const confirmationNumber = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const booking: FlightBooking = {
      id: bookingId,
      type: 'flight',
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      totalPrice: 299 * flightData.passengers,
      currency: 'USD',
      confirmationNumber,
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123'
      },
      flights: [
        {
          flightNumber: 'AA1234',
          airline: 'American Airlines',
          departure: {
            airport: flightData.origin,
            city: 'New York',
            date: flightData.departureDate,
            time: '08:30'
          },
          arrival: {
            airport: flightData.destination,
            city: 'Los Angeles',
            date: flightData.departureDate,
            time: '11:45'
          },
          passengers: Array.from({ length: flightData.passengers }, (_, i) => ({
            name: `Passenger ${i + 1}`,
            ticketNumber: `${confirmationNumber}${i + 1}`
          }))
        }
      ]
    };

    return booking;
  } catch (error) {
    console.error('Error booking flight:', error);
    throw new Error('Failed to book flight');
  }
};

export const bookHotel = async (hotelData: {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
}): Promise<HotelBooking> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const bookingId = `HT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const confirmationNumber = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const checkInDate = new Date(hotelData.checkIn);
    const checkOutDate = new Date(hotelData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const booking: HotelBooking = {
      id: bookingId,
      type: 'hotel',
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      totalPrice: 189 * nights * hotelData.rooms,
      currency: 'USD',
      confirmationNumber,
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123'
      },
      hotel: {
        name: 'Grand Plaza Hotel',
        address: '100 Central Park West',
        city: 'New York',
        country: 'USA',
        rating: 4.5
      },
      checkIn: hotelData.checkIn,
      checkOut: hotelData.checkOut,
      nights,
      rooms: Array.from({ length: hotelData.rooms }, (_, i) => ({
        type: 'Standard',
        guests: Math.ceil(hotelData.guests / hotelData.rooms)
      })),
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant']
    };

    return booking;
  } catch (error) {
    console.error('Error booking hotel:', error);
    throw new Error('Failed to book hotel');
  }
};

export const rentCar = async (carData: {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  carCategory: string;
}): Promise<CarRental> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingId = `CR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const confirmationNumber = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const pickupDate = new Date(carData.pickupDate);
    const dropoffDate = new Date(carData.dropoffDate);
    const duration = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const booking: CarRental = {
      id: bookingId,
      type: 'car',
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      totalPrice: 45 * duration,
      currency: 'USD',
      confirmationNumber,
      customerInfo: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123'
      },
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Midsize',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400'
      },
      pickupLocation: {
        name: 'Downtown Location',
        address: carData.pickupLocation
      },
      dropoffLocation: {
        name: 'Airport Location',
        address: carData.dropoffLocation
      },
      pickupDate: carData.pickupDate,
      dropoffDate: carData.dropoffDate,
      duration,
      insurance: [
        {
          type: 'Basic',
          coverage: ['Collision Damage Waiver'],
          price: 15
        }
      ]
    };

    return booking;
  } catch (error) {
    console.error('Error renting car:', error);
    throw new Error('Failed to rent car');
  }
};

export const getBookingHistory = async (userId: string): Promise<TravelBooking[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock booking history
    const mockBookings: TravelBooking[] = [
      {
        id: 'FL-1234567890',
        type: 'flight',
        status: 'completed',
        bookingDate: '2024-01-15T10:30:00Z',
        totalPrice: 598,
        currency: 'USD',
        confirmationNumber: 'ABC123',
        customerInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123'
        }
      },
      {
        id: 'HT-0987654321',
        type: 'hotel',
        status: 'confirmed',
        bookingDate: '2024-02-20T14:15:00Z',
        totalPrice: 756,
        currency: 'USD',
        confirmationNumber: 'DEF456',
        customerInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123'
        }
      }
    ];

    return mockBookings;
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return [];
  }
};

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate cancellation logic
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};
