
import React from 'react';
import { BOTTOM_DOCK_ICONS } from '../constants';

export const BottomDock: React.FC = () => {
  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-700/40 backdrop-blur-xl p-2 sm:p-2.5 rounded-xl shadow-2xl border border-slate-600/50">
        {BOTTOM_DOCK_ICONS.map((item, index) => (
          <button
            key={index}
            title={item.name}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center 
                        ${item.color} text-white hover:opacity-90 transition-all duration-200 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800/50 focus:ring-white 
                        transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
          >
            <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        ))}
      </div>
    </footer>
  );
};
