import React from 'react';
import { RIGHT_SIDEBAR_ITEMS } from '../constants';
import { FuturisticIdCard } from './FuturisticIdCard'; 
import { MainViewKey } from '../types';

interface RightSidebarProps {
  onViewSelect: (viewKey?: MainViewKey) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onViewSelect }) => {
  return (
    <aside 
      className="w-20 sm:w-24 bg-slate-900/80 backdrop-blur-lg border-l border-slate-700/50 
                 pt-3 px-1 sm:px-1.5 flex flex-col items-center shrink-0 relative z-10"
    >
      <div className="mb-3 w-full">
        <FuturisticIdCard />
      </div>

      <div className="flex-grow w-full flex flex-col items-center space-y-0.5 overflow-y-auto pt-1">
        {RIGHT_SIDEBAR_ITEMS.map((item, index) => (
          <React.Fragment key={item.name}>
            <button 
              onClick={() => onViewSelect(item.viewKey)}
              className={`w-full flex flex-col items-center py-1 sm:py-1.5 px-0.5 rounded-md transition-all duration-200 
                          bg-slate-800/40 hover:bg-slate-700/60 
                          border border-slate-700/50 hover:border-purple-500/70 
                          shadow-[0_1px_2px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] 
                          hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.1)] 
                          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:bg-slate-800/70
                          group focus:outline-none focus:ring-1 focus:ring-purple-500/80 relative`}
              title={item.name}
            >
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-px ${item.color} group-hover:scale-110 transition-transform duration-150`} />
              <span className="text-[8px] sm:text-[9px] text-slate-400 group-hover:text-slate-200 transition-colors duration-150">{item.name}</span>
            </button>
            {index < RIGHT_SIDEBAR_ITEMS.length - 1 && (
              <div className="h-2.5 sm:h-3 w-px bg-slate-600/50 group-hover:bg-purple-500/50 transition-colors duration-200 my-px"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};