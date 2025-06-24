import React from 'react';
import { LIFESTYLE_HEADER_BUTTONS, LIFESTYLE_SUB_MODULE_SIDEBAR_CONFIG } from '../../constants';

interface LifeStyleLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSubModuleKey: string | null;
}

export const LifeStyleLeftSidebar: React.FC<LifeStyleLeftSidebarProps> = ({ isOpen, activeSubModuleKey }) => {
  const transitionClass = isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";

  const currentSubModuleConfig = activeSubModuleKey
    ? LIFESTYLE_SUB_MODULE_SIDEBAR_CONFIG[activeSubModuleKey]
    : null;

  const sidebarTitle = currentSubModuleConfig?.title || "LifeStyle Menu";
  const actions = currentSubModuleConfig?.actions || (LIFESTYLE_HEADER_BUTTONS.length > 0 && LIFESTYLE_SUB_MODULE_SIDEBAR_CONFIG[LIFESTYLE_HEADER_BUTTONS[0].key]?.actions) || [];

  const sidebarHeaderHeight = '3.5rem';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-52 sm:w-60 bg-slate-800/70 backdrop-blur-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-r border-slate-700/60 shadow-2xl
                 transform transition-all duration-300 ease-in-out z-10 ${transitionClass}`}
      style={{ paddingTop: `calc(${sidebarHeaderHeight} + 1rem)`, display: isOpen ? 'block' : 'none' }}
    >
      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 sm:mb-4 px-1">{sidebarTitle}</h3>
      {actions.map((action, index) => (
        <button
          key={index}
          className="w-full flex items-center justify-start text-left px-3 py-2.5 sm:px-4 sm:py-3
                     bg-slate-700/60 hover:bg-yellow-600/70 rounded-md text-slate-200 hover:text-white
                     transition-all duration-200 border border-slate-600/80 hover:border-yellow-500
                     shadow-[0_2px_5px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.05)]
                     hover:shadow-[0_4px_8px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.07)]
                     focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-60 text-xs sm:text-sm"
        >
          {action}
        </button>
      ))}
    </aside>
  );
};
