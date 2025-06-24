import React, { useState } from 'react';
import { EmailAnalyticsWidget } from './widgets/EmailAnalyticsWidget';
import { EmailAutomationWidget } from './widgets/EmailAutomationWidget';
import { EmailCampaignsWidget } from './widgets/EmailCampaignsWidget';
import { EmailListsWidget } from './widgets/EmailListsWidget';
import { EmailTemplatesWidget } from './widgets/EmailTemplatesWidget';

interface EmailMainContentProps {
  activeSubModuleKey?: string;
}

export const EmailMainContent: React.FC<EmailMainContentProps> = ({ activeSubModuleKey = 'overview' }) => {
  const [quickActions] = useState({
    campaignsCreated: 24,
    emailsSent: 45680,
    openRate: 24.5,
    clickRate: 3.2
  });

  const renderContent = () => {
    switch (activeSubModuleKey) {
      case 'campaigns':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <EmailCampaignsWidget />
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <EmailTemplatesWidget />
            </div>
          </div>
        );

      case 'lists':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <EmailListsWidget />
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <EmailAutomationWidget />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <EmailAnalyticsWidget />
            </div>
          </div>
        );

      default: // overview
        return (
          <>
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Campaigns</p>
                    <p className="text-2xl font-bold text-pink-400">{quickActions.campaignsCreated}</p>
                  </div>
                  <div className="text-pink-400 text-2xl">📧</div>
                </div>
                <div className="text-xs text-green-400 mt-1">↗ +12% this month</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Emails Sent</p>
                    <p className="text-2xl font-bold text-blue-400">{quickActions.emailsSent.toLocaleString()}</p>
                  </div>
                  <div className="text-blue-400 text-2xl">📤</div>
                </div>
                <div className="text-xs text-green-400 mt-1">↗ +8% this month</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Open Rate</p>
                    <p className="text-2xl font-bold text-green-400">{quickActions.openRate}%</p>
                  </div>
                  <div className="text-green-400 text-2xl">👁️</div>
                </div>
                <div className="text-xs text-green-400 mt-1">↗ +2.3% this month</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Click Rate</p>
                    <p className="text-2xl font-bold text-purple-400">{quickActions.clickRate}%</p>
                  </div>
                  <div className="text-purple-400 text-2xl">👆</div>
                </div>
                <div className="text-xs text-red-400 mt-1">↘ -0.8% this month</div>
              </div>
            </div>

            {/* Main Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EmailCampaignsWidget />
              <EmailTemplatesWidget />
              <EmailAnalyticsWidget />
              <EmailListsWidget />
            </div>

            {/* Automation Section */}
            <div className="mt-6">
              <EmailAutomationWidget />
            </div>
          </>
        );
    }
  };

  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      {renderContent()}
    </main>
  );
};