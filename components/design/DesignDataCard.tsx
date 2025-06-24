import React from 'react';

interface DesignDataCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const DesignDataCard: React.FC<DesignDataCardProps> = ({ title, children, className = '', footer }) => {
  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-xl border border-slate-700/80 h-full flex flex-col overflow-hidden ${className}`}
      style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.1), 0 0 8px rgba(99, 102, 241, 0.08)' }} // Indigo glow
    >
      {title && (
        <h3 className="text-sm sm:text-base font-semibold text-indigo-200 mb-2 sm:mb-3 pb-2 border-b border-slate-700/70 truncate">
            {title}
        </h3>
      )}
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