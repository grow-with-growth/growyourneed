
import React from 'react';
import { WidgetCard } from './WidgetCard';

interface CentralGraphicWidgetProps {
  className?: string;
}

export const CentralGraphicWidget: React.FC<CentralGraphicWidgetProps> = ({ className = '' }) => {
  return (
    <WidgetCard title="School Campus Overview" className={`p-0 ${className}`}>
      <div className="w-full h-full rounded-b-lg overflow-hidden">
        <img 
          src="https://raw.githubusercontent.com/username/repo/main/path/to/your/school_campus_image.jpg" // Replace with a persistent URL to your image if possible
          // Fallback to picsum if the above is not available or for testing
          onError={(e) => (e.currentTarget.src = "https://picsum.photos/seed/schoolcampus2/1200/800")}
          alt="School Campus" 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
    </WidgetCard>
  );
};
