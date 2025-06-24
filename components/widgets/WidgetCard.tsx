
import React from 'react';
import { ArrowDownTrayIcon } from '../icons/index';

interface WidgetCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  onExportCsv?: () => void; // New prop for export functionality
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, className = '', titleClassName = '', onExportCsv }) => {
  return (
    <div
      className={`bg-black/40 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border border-slate-700/70 h-full flex flex-col overflow-hidden ${className}`}
      style={{
        boxShadow: '0 0 15px rgba(0, 183, 255, 0.1), 0 0 5px rgba(0, 183, 255, 0.05)', // Subtle cyan glow
      }}
    >
      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
        {title && <h3 className={`text-xs sm:text-sm font-semibold text-slate-300 truncate ${titleClassName}`}>{title}</h3>}
        {onExportCsv && (
          <button
            onClick={onExportCsv}
            title="Export data to CSV"
            className="p-1 text-slate-400 hover:text-sky-300 transition-colors duration-150"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
      <div className="flex-grow overflow-hidden relative min-h-0"> {/* Added min-h-0 for Recharts flex fix */}
        {children}
      </div>
    </div>
  );
};
