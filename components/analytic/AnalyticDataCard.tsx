
import React from 'react';
import { ArrowDownTrayIcon } from '../icons'; // Assuming icons are in components/icons

interface AnalyticDataCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  footer?: React.ReactNode;
  onExportCsv?: () => void; // New prop for export functionality
}

export const AnalyticDataCard: React.FC<AnalyticDataCardProps> = ({ title, children, className = '', titleClassName = '', footer, onExportCsv }) => {
  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-xl border border-slate-700/80 h-full flex flex-col overflow-hidden ${className}`}
      style={{
        boxShadow: '0 0 20px rgba(0, 150, 255, 0.1), 0 0 8px rgba(0, 150, 255, 0.08)', 
      }}
    >
      <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 border-b border-slate-700/70">
        {title && (
          <h3 
              className={`text-sm sm:text-base font-semibold text-sky-200 truncate ${titleClassName}`}
          >
              {title}
          </h3>
        )}
        {onExportCsv && (
          <button
            onClick={onExportCsv}
            title="Export data to CSV"
            className="p-1 text-sky-300 hover:text-sky-100 transition-colors duration-150"
          >
            <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      <div className="flex-grow overflow-auto relative min-h-0 text-slate-300">
        {children}
      </div>
      {footer && (
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-slate-700/70 text-xs text-slate-400">
            {footer}
        </div>
      )}
    </div>
  );
};
