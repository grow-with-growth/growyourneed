import React, { useState } from 'react';
import {
  HomeIcon,
  CreditCardIcon,
  ComputerDesktopIcon,
  CogIcon,
  VideoCameraIcon,
  StarIcon,
  BriefcaseIcon,
  UserGroupIcon
} from '../icons';
import { MediaHubWidget } from './MediaHubWidget';
import { BookStoreWidget } from './BookStoreWidget';

interface CommonServicesWidgetProps {
  userRole?: string;
}

export const CommonServicesWidget: React.FC<CommonServicesWidgetProps> = ({ userRole = 'admin' }) => {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showFullWidget, setShowFullWidget] = useState<string | null>(null);

  const services = [
    {
      id: 'bookstore',
      name: 'Book Store',
      description: 'Educational books and resources',
      icon: StarIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      features: ['Digital Library', 'Physical Books', 'Educational Resources', 'Bulk Orders']
    },
    {
      id: 'procurement',
      name: 'Procurement Hub',
      description: 'Bulk purchases and supplies',
      icon: BriefcaseIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      features: ['Office Supplies', 'Uniforms', 'Equipment', 'Bulk Discounts']
    },
    {
      id: 'accommodation',
      name: 'Accommodation',
      description: 'Hotels, villas, apartments',
      icon: HomeIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      features: ['Hotel Booking', 'Villa Rentals', 'Apartment Stays', 'Group Bookings']
    },
    {
      id: 'carrental',
      name: 'Car Rental',
      description: 'Vehicle booking and management',
      icon: CogIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      features: ['Fleet Management', 'Driver Services', 'Insurance', 'GPS Tracking']
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Facility and equipment maintenance',
      icon: ComputerDesktopIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      features: ['Preventive Maintenance', 'Emergency Repairs', 'Equipment Service', 'Facility Upkeep']
    },
    {
      id: 'concierge',
      name: 'Concierge Service',
      description: 'Personalized assistance',
      icon: UserGroupIcon,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      features: ['Event Planning', 'Personal Assistance', 'Custom Requests', '24/7 Support']
    },
    {
      id: 'mediahub',
      name: 'Media Hub',
      description: 'Movies, series, documentaries',
      icon: VideoCameraIcon,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      features: ['Educational Content', 'Entertainment', 'Live TV', 'Documentaries']
    },
    {
      id: 'islamic',
      name: 'Islamic Resources',
      description: 'Prayer times, Quran, Hadith',
      icon: StarIcon,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      features: ['Prayer Times', 'Quran', 'Hadith', 'Islamic Calendar']
    }
  ];

  const ServiceCard = ({ service }: { service: any }) => (
    <div 
      className={`p-4 rounded-lg border border-slate-700/50 cursor-pointer transition-all duration-200 hover:border-slate-600 ${
        activeService === service.id ? service.bgColor : 'bg-slate-800/30'
      }`}
      onClick={() => setActiveService(activeService === service.id ? null : service.id)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${service.bgColor}`}>
          <service.icon className={`w-5 h-5 ${service.color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-200">{service.name}</h3>
          <p className="text-slate-400 text-sm">{service.description}</p>
        </div>
      </div>
      
      {activeService === service.id && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Available Features:</h4>
          <div className="grid grid-cols-2 gap-2">
            {service.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${service.color.replace('text-', 'bg-')}`}></div>
                <span className="text-slate-400 text-xs">{feature}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowFullWidget(service.id)}
            className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            service.color.includes('blue') ? 'bg-blue-600 hover:bg-blue-700 text-white' :
            service.color.includes('green') ? 'bg-green-600 hover:bg-green-700 text-white' :
            service.color.includes('purple') ? 'bg-purple-600 hover:bg-purple-700 text-white' :
            service.color.includes('yellow') ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
            service.color.includes('red') ? 'bg-red-600 hover:bg-red-700 text-white' :
            service.color.includes('indigo') ? 'bg-indigo-600 hover:bg-indigo-700 text-white' :
            service.color.includes('pink') ? 'bg-pink-600 hover:bg-pink-700 text-white' :
            'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}>
            Access {service.name}
          </button>
        </div>
      )}
    </div>
  );

  // Show full widget if requested
  if (showFullWidget === 'bookstore') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowFullWidget(null)}
          className="text-slate-400 hover:text-slate-200 text-sm"
        >
          ← Back to Services
        </button>
        <BookStoreWidget userRole={userRole} />
      </div>
    );
  }

  if (showFullWidget === 'mediahub') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowFullWidget(null)}
          className="text-slate-400 hover:text-slate-200 text-sm"
        >
          ← Back to Services
        </button>
        <MediaHubWidget userRole={userRole} />
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Integrated Services</h2>
          <p className="text-slate-400 text-sm">Access all available services and resources</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Role:</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded capitalize">
            {userRole}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">8</div>
            <div className="text-slate-400 text-sm">Services Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-slate-400 text-sm">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-slate-400 text-sm">Integration Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">AI</div>
            <div className="text-slate-400 text-sm">Powered</div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Service Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.slice(0, 4).map(service => (
            <div key={service.id} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-400 text-xs">{service.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
