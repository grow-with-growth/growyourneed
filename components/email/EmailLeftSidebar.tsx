import React, { useState } from 'react';
import { EMAIL_HEADER_BUTTONS, EMAIL_SUB_MODULE_SIDEBAR_CONFIG } from '../../constants';
import { EmailTemplateBuilder } from './EmailTemplateBuilder';

interface EmailLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSubModuleKey: string | null;
  onSubModuleChange?: (key: string) => void;
}

export const EmailLeftSidebar: React.FC<EmailLeftSidebarProps> = ({
  isOpen,
  activeSubModuleKey,
  onSubModuleChange
}) => {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const transitionClass = isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0";

  const currentSubModuleConfig = activeSubModuleKey
    ? EMAIL_SUB_MODULE_SIDEBAR_CONFIG[activeSubModuleKey]
    : null;

  const sidebarTitle = currentSubModuleConfig?.title || "Email Marketing";
  const actions = currentSubModuleConfig?.actions || [];

  const sidebarHeaderHeight = '3.5rem';

  const handleActionClick = (action: string) => {
    // Handle specific actions
    switch (action) {
      case 'Create New Template':
      case 'Template Editor':
        setShowTemplateBuilder(true);
        break;
      case 'Create New Campaign':
        // Handle campaign creation
        console.log('Creating new campaign...');
        break;
      case 'Import Contacts':
        // Handle contact import
        console.log('Importing contacts...');
        break;
      case 'Create New Workflow':
        // Handle workflow creation
        console.log('Creating new workflow...');
        break;
      default:
        console.log(`Action clicked: ${action}`);
    }
  };

  const quickStats = {
    totalCampaigns: 24,
    totalSubscribers: 5420,
    openRate: 24.5,
    clickRate: 3.2
  };

  return (
    <>
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
              <span className="text-slate-400">Campaigns:</span>
              <span className="text-pink-400 font-medium">{quickStats.totalCampaigns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Subscribers:</span>
              <span className="text-blue-400 font-medium">{quickStats.totalSubscribers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Open Rate:</span>
              <span className="text-green-400 font-medium">{quickStats.openRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Click Rate:</span>
              <span className="text-purple-400 font-medium">{quickStats.clickRate}%</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300 px-1">Navigation</h4>
          {EMAIL_HEADER_BUTTONS.map((button) => (
            <button
              key={button.key}
              onClick={() => onSubModuleChange?.(button.key.replace('email-', ''))}
              className={`w-full flex items-center justify-start text-left px-3 py-2.5
                         rounded-md transition-all duration-200 text-xs sm:text-sm ${
                activeSubModuleKey === button.key.replace('email-', '')
                  ? 'bg-pink-600/70 text-white border border-pink-500'
                  : 'bg-slate-700/60 hover:bg-pink-600/50 text-slate-200 hover:text-white border border-slate-600/80 hover:border-pink-500'
              }`}
            >
              <span className="mr-2">
                {button.key === 'email-campaigns' && '📧'}
                {button.key === 'email-lists' && '📋'}
                {button.key === 'email-templates' && '📝'}
                {button.key === 'email-automation' && '⚡'}
                {button.key === 'email-stats' && '📊'}
                {button.key === 'email-configure' && '⚙️'}
              </span>
              {button.label}
            </button>
          ))}
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
                  {action.includes('Import') && '📥'}
                  {action.includes('Export') && '📤'}
                  {action.includes('Manage') && '⚙️'}
                  {action.includes('Analytics') && '📊'}
                  {action.includes('Reports') && '📈'}
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
              <span className="text-slate-400">Welcome campaign sent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📧</span>
              <span className="text-slate-400">New template created</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              <span className="text-slate-400">Automation triggered</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Template Builder Modal */}
      <EmailTemplateBuilder
        isOpen={showTemplateBuilder}
        onClose={() => setShowTemplateBuilder(false)}
        onSave={(template) => {
          console.log('Template saved:', template);
          setShowTemplateBuilder(false);
        }}
      />
    </>
  );
};
