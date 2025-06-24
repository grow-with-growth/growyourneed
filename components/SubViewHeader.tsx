import React from 'react';
import { HeaderButtonConfig } from '../constants'; // Assuming HeaderButtonConfig is exported from constants

interface SubViewHeaderProps {
  title: string;
  titleColorClass?: string;
  buttons: HeaderButtonConfig[];
  activeButtonKey: string | null;
  onButtonClick: (key: string) => void;
  activeButtonColorClass?: string; // e.g., "bg-sky-600 text-white"
  // For inactive buttons, style is fixed to match main header's "School" style
  children?: React.ReactNode;
}

export const SubViewHeader: React.FC<SubViewHeaderProps> = ({
  title,
  titleColorClass = 'text-slate-100', // Default title color
  buttons,
  activeButtonKey,
  onButtonClick,
  activeButtonColorClass = 'bg-blue-600 text-white', // Default active like main "School" header
  children,
}) => {
  return (
    <header 
      className="flex items-center justify-between px-4 py-2 
                 bg-slate-800/60 backdrop-blur-md 
                 border-b border-slate-700
                 h-14 shrink-0 relative z-20 shadow-md" // h-14 is 3.5rem
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <h1 className={`text-lg sm:text-xl font-semibold ${titleColorClass}`}>
          {title}
        </h1>
        {buttons && buttons.length > 0 && (
          <nav className="flex items-center bg-slate-800/50 rounded-md p-1 border border-slate-700">
            {buttons.map((button, index) => (
              <React.Fragment key={button.key}>
                <button
                  onClick={() => onButtonClick(button.key)}
                  aria-pressed={activeButtonKey === button.key}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 rounded-sm
                    ${activeButtonKey === button.key
                      ? `${activeButtonColorClass} shadow-md`
                      : 'bg-white text-slate-800 hover:bg-slate-200' // Style like main "School" header inactive
                    }
                  `}
                >
                  {button.label}
                </button>
                {index < buttons.length - 1 && (
                  <div className="w-px h-4 bg-slate-400 mx-1"></div>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
      {/* Render children if provided, otherwise empty div for layout consistency */}
      <div>{children}</div>
    </header>
  );
};
