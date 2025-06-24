
import React from 'react';
import { LEFT_SIDEBAR_ACTIONS } from '../constants';
import { ModuleKey } from '../types';

interface LeftSidebarProps {
  selectedModule: ModuleKey | null;
  isOpen: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ selectedModule, isOpen }) => {
  // Use a different transition for hiding to prevent layout shift during unmount
  const transitionClass = isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";

  if (!selectedModule && !isOpen) return null; // Fully hidden and no module, render nothing
  
  const actions = selectedModule ? LEFT_SIDEBAR_ACTIONS[selectedModule] || [] : [];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen w-52 sm:w-60 bg-slate-800/60 backdrop-blur-lg pt-20 p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-r border-slate-700/50 shadow-2xl 
                 transform transition-all duration-300 ease-in-out z-10 ${transitionClass}`}
      // Ensure it's hidden when not open, even if module is selected
      style={{ display: isOpen ? 'block' : 'none' }} 
    >
      {selectedModule && (
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 sm:mb-4 px-1">{selectedModule}</h3>
      )}
      {actions.map((action, index) => (
        <button
          key={index}
          className="w-full flex items-center justify-start text-left px-3 py-2.5 sm:px-4 sm:py-3 
                     bg-slate-700/50 hover:bg-blue-600/70 rounded-md text-slate-200 hover:text-white 
                     transition-all duration-200 
                     border border-slate-600/80 hover:border-blue-500 
                     shadow-[0_2px_5px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.1)] 
                     hover:shadow-[0_4px_8px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.1)] 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 text-xs sm:text-sm"
        >
          {action}
        </button>
      ))}
    </aside>
  );
};
