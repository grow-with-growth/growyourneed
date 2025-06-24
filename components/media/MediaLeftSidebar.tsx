import React, { useEffect, useRef, useState } from 'react';
import { MEDIA_HEADER_BUTTONS, MEDIA_SUB_MODULE_SIDEBAR_CONFIG } from '../../constants';

interface MediaLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSubModuleKey: string | null;
  onActionSelect?: (action: string) => void;
}

export const MediaLeftSidebar: React.FC<MediaLeftSidebarProps> = ({ isOpen, onToggle, activeSubModuleKey, onActionSelect }) => {
  const transitionClass = isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";

  const currentSubModuleConfig = activeSubModuleKey
    ? MEDIA_SUB_MODULE_SIDEBAR_CONFIG[activeSubModuleKey]
    : null;

  const sidebarTitle = currentSubModuleConfig?.title ?? "Media Menu";

  let actions: string[] = [];
  if (currentSubModuleConfig?.actions) {
    actions = currentSubModuleConfig.actions;
  } else if (MEDIA_HEADER_BUTTONS.length > 0 && MEDIA_SUB_MODULE_SIDEBAR_CONFIG[MEDIA_HEADER_BUTTONS[0].key]?.actions) {
    actions = MEDIA_SUB_MODULE_SIDEBAR_CONFIG[MEDIA_HEADER_BUTTONS[0].key].actions;
  }

  const sidebarHeaderHeight = '3.5rem';

  // Advanced: Track selected action for highlight and keyboard navigation
  const [selectedActionIndex, setSelectedActionIndex] = useState(0);
  const actionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Reset selection when actions or sidebar open state changes
    setSelectedActionIndex(0);
  }, [actions, isOpen, activeSubModuleKey]);

  useEffect(() => {
    if (isOpen && actionRefs.current[selectedActionIndex]) {
      actionRefs.current[selectedActionIndex]?.focus();
    }
  }, [selectedActionIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedActionIndex((prev) => (prev + 1) % actions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedActionIndex((prev) => (prev - 1 + actions.length) % actions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onActionSelect) onActionSelect(actions[idx]);
    }
  };

  const handleActionClick = (action: string, idx: number) => {
    setSelectedActionIndex(idx);
    if (onActionSelect) onActionSelect(action);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-52 sm:w-60 bg-slate-800/70 backdrop-blur-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-r border-slate-700/60 shadow-2xl overflow-y-auto
                 transform transition-all duration-300 ease-in-out z-10 ${transitionClass}`}
      style={{ paddingTop: `calc(${sidebarHeaderHeight} + 1rem)`, display: isOpen ? 'block' : 'none' }}
      aria-label="Media Sidebar"
    >
      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 sm:mb-4 px-1">{sidebarTitle}</h3>
      {actions.map((action: string, index: number) => (
        <button
          key={action}
          ref={el => actionRefs.current[index] = el}
          className={`w-full flex items-center justify-start text-left px-3 py-2.5 sm:px-4 sm:py-3
                     bg-slate-700/60 hover:bg-red-600/70 rounded-md text-slate-200 hover:text-white
                     transition-all duration-200 border border-slate-600/80 hover:border-red-500
                     shadow-[0_2px_5px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.05)]
                     hover:shadow-[0_4px_8px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.07)]
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 text-xs sm:text-sm
                     ${selectedActionIndex === index ? 'ring-2 ring-red-500 bg-red-600/80 text-white' : ''}`}
          tabIndex={isOpen ? 0 : -1}
          onClick={() => handleActionClick(action, index)}
          onKeyDown={e => handleKeyDown(e, index)}
        >
          {action}
        </button>
      ))}
      {/* Toggle button for accessibility */}
      <button
        className="mt-4 w-full py-2 bg-slate-900/70 text-slate-300 rounded hover:bg-red-700/80 hover:text-white transition"
        onClick={onToggle}
        tabIndex={isOpen ? 0 : -1}
      >
        {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>
    </aside>
  );
};
