import React, { useState } from 'react';
import { DESIGN_HEADER_BUTTONS, DESIGN_SUB_MODULE_SIDEBAR_CONFIG } from '../../constants';

interface DesignLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSubModuleKey: string | null;
  onSubModuleChange?: (key: string) => void;
}

export const DesignLeftSidebar: React.FC<DesignLeftSidebarProps> = ({
  isOpen,
  activeSubModuleKey,
  onSubModuleChange
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const transitionClass = isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";

  const currentSubModuleConfig = activeSubModuleKey
    ? DESIGN_SUB_MODULE_SIDEBAR_CONFIG[activeSubModuleKey]
    : null;

  const sidebarTitle = currentSubModuleConfig?.title || "Design Studio";
  const actions = currentSubModuleConfig?.actions || [];

  const sidebarHeaderHeight = '3.5rem';

  const handleActionClick = (action: string) => {
    // Handle specific actions
    switch (action) {
      case 'Create New Template':
      case 'Template Editor':
        onSubModuleChange?.('design-editor');
        break;
      case 'Browse Templates':
        onSubModuleChange?.('design-templates');
        break;
      case 'Asset Library':
      case 'Search Assets':
        onSubModuleChange?.('design-assets');
        break;
      case 'Brand Guidelines':
      case 'View Brand Guidelines':
        onSubModuleChange?.('design-branding');
        break;
      default:
        console.log(`Action clicked: ${action}`);
    }
  };

  const quickStats = {
    totalProjects: 12,
    templatesUsed: 8,
    assetsDownloaded: 45,
    designsCreated: 23
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-52 sm:w-64 bg-slate-800/70 backdrop-blur-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3 border-r border-slate-700/60 shadow-2xl
                 transform transition-all duration-300 ease-in-out z-10 ${transitionClass}`}
      style={{ paddingTop: `calc(${sidebarHeaderHeight} + 1rem)`, display: isOpen ? 'block' : 'none' }}
    >
      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-3 sm:mb-4 px-1">{sidebarTitle}</h3>

      {/* Quick Stats */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Projects:</span>
            <span className="text-indigo-400 font-medium">{quickStats.totalProjects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Templates:</span>
            <span className="text-blue-400 font-medium">{quickStats.templatesUsed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Assets:</span>
            <span className="text-green-400 font-medium">{quickStats.assetsDownloaded}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Designs:</span>
            <span className="text-purple-400 font-medium">{quickStats.designsCreated}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300 px-1">Design Tools</h4>
        {DESIGN_HEADER_BUTTONS.map((button) => (
          <button
            key={button.key}
            onClick={() => onSubModuleChange?.(button.key.replace('design-', ''))}
            className={`w-full flex items-center justify-start text-left px-3 py-2.5
                       rounded-md transition-all duration-200 text-xs sm:text-sm ${
              activeSubModuleKey === button.key.replace('design-', '')
                ? 'bg-indigo-600/70 text-white border border-indigo-500'
                : 'bg-slate-700/60 hover:bg-indigo-600/50 text-slate-200 hover:text-white border border-slate-600/80 hover:border-indigo-500'
            }`}
          >
            <span className="mr-2">
              {button.key === 'design-editor' && '🎨'}
              {button.key === 'design-branding' && '🏷️'}
              {button.key === 'design-templates' && '📋'}
              {button.key === 'design-assets' && '🖼️'}
              {button.key === 'design-requests' && '📝'}
              {button.key === 'design-guidelines' && '📖'}
              {button.key === 'design-projects' && '📁'}
            </span>
            {button.label}
          </button>
        ))}
      </div>

      {/* Quick Create */}
      <div className="space-y-2">
        <button
          onClick={() => setShowQuickCreate(!showQuickCreate)}
          className="w-full flex items-center justify-between px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white transition-colors text-sm"
        >
          <span className="flex items-center gap-2">
            <span>➕</span>
            Quick Create
          </span>
          <span className={`transform transition-transform ${showQuickCreate ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showQuickCreate && (
          <div className="space-y-1 pl-2">
            <button
              onClick={() => onSubModuleChange?.('design-editor')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-md text-slate-200 hover:text-white transition-colors text-xs"
            >
              <span>🎨</span>
              Visual Design
            </button>
            <button
              onClick={() => onSubModuleChange?.('design-editor')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-md text-slate-200 hover:text-white transition-colors text-xs"
            >
              <span>💻</span>
              Code Project
            </button>
            <button
              onClick={() => onSubModuleChange?.('design-editor')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-md text-slate-200 hover:text-white transition-colors text-xs"
            >
              <span>📊</span>
              Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 px-1">Quick Actions</h4>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="w-full flex items-center justify-start text-left px-3 py-2
                         bg-slate-700/40 hover:bg-slate-600/60 rounded-md text-slate-200 hover:text-white
                         transition-all duration-200 border border-slate-600/60 hover:border-slate-500
                         text-xs"
            >
              <span className="mr-2">
                {action.includes('Create') && '➕'}
                {action.includes('View') && '👁️'}
                {action.includes('Browse') && '🔍'}
                {action.includes('Search') && '🔍'}
                {action.includes('Library') && '📚'}
                {action.includes('Guidelines') && '📖'}
                {action.includes('Request') && '📝'}
                {action.includes('Track') && '📊'}
              </span>
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Activity</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-slate-400">Logo design completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎨</span>
            <span className="text-slate-400">New template created</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">📊</span>
            <span className="text-slate-400">Dashboard updated</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
