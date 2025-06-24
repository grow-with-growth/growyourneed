
import React, { useState } from 'react';
import { HEADER_MODULES } from '../constants';
import { ModuleKey } from '../types';
import { CogIcon } from './icons';
import { SchoolSettingsModal } from './school/SchoolSettingsModal';

interface HeaderProps {
  activeModule: ModuleKey | null;
  onModuleSelect: (moduleKey: ModuleKey) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onModuleSelect }) => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <header
      className="flex items-center justify-between px-4 py-2
                 bg-slate-800/50 backdrop-blur-lg
                 border-b border-slate-700/80
                 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]
                 h-16 shrink-0 relative z-20"
    >
      <div className="flex items-center">
        {/* Module Selector */}
        <nav className="flex items-center bg-slate-800/50 rounded-md p-1 border border-slate-700">
          {HEADER_MODULES.map((module, index) => (
            <React.Fragment key={module.key}>
              <button
                onClick={() => onModuleSelect(module.key)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 rounded-sm
                  ${activeModule === module.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-800 hover:bg-slate-200'
                  }
                `}
              >
                {module.label}
              </button>
              {index < HEADER_MODULES.length - 1 && (
                <div className="w-px h-4 bg-slate-400 mx-1"></div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Settings and Profile Widget */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-1.5 bg-slate-700/80 rounded-md hover:bg-slate-600/80 border border-slate-600 transition-colors"
        >
          <CogIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button className="text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-1.5 bg-slate-700/80 rounded-md hover:bg-slate-600/80 border border-slate-600">
          Welcome Back
        </button>
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center ring-2 ring-purple-500/70 shadow-lg">
          <img src="https://picsum.photos/seed/useravatar2/40/40" alt="User Avatar" className="rounded-full w-full h-full object-cover" />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SchoolSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          activeModule={activeModule}
        />
      )}
    </header>
  );
};
