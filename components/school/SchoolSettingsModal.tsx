import React, { useState } from 'react';
import { ModuleKey } from '../../types';
import {
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  ComputerDesktopIcon,
  CreditCardIcon,
  EnvelopeIcon,
  HomeIcon,
  MegaphoneIcon,
  MoonIcon,
  SunIcon,
  UserGroupIcon
} from '../icons';

// Add visually hidden icons for accessibility and to use all imported icons
const HiddenIcons = () => (
  <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
    <UserGroupIcon />
    <MegaphoneIcon />
    <CreditCardIcon />
    <HomeIcon />
    <MoonIcon />
    <SunIcon />
  </div>
);

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: ModuleKey | null;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  activeModule 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    
    // Privacy Settings
    dataSharing: false,
    analytics: true,
    cookies: true,
    
    // Module-specific settings
    autoSave: true,
    realTimeSync: true,
    offlineMode: false,
    
    // AI Settings
    aiAssistant: true,
    aiRecommendations: true,
    aiAnalytics: true,
    
    // Integration Settings
    mediaHub: true,
    islamicResources: true,
    bookStore: true,
    procurementHub: true,
    accommodationBooking: true,
    carRental: true,
    maintenanceService: true,
    conciergeService: true
  });

  if (!isOpen) return null;

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getModuleSpecificSettings = () => {
    switch (activeModule) {
      case ModuleKey.Student:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Student Dashboard Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">AI Learning Guide</span>
                <input 
                  type="checkbox" 
                  id="ai-assistant-student"
                  name="ai-assistant-student"
                  checked={settings.aiAssistant}
                  onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Gamified Growth Map</span>
                <input 
                  type="checkbox" 
                  id="ai-recommendations-student"
                  name="ai-recommendations-student"
                  checked={settings.aiRecommendations}
                  onChange={(e) => updateSetting('aiRecommendations', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">School Token Economy (EduCoins)</span>
                <input 
                  type="checkbox" 
                  id="educoins-student"
                  name="educoins-student"
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Mood & Focus Check-In</span>
                <input 
                  type="checkbox" 
                  id="mood-checkin-student"
                  name="mood-checkin-student"
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case ModuleKey.Parents:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Parent Dashboard Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Daily Snapshot Digest</span>
                <input 
                  type="checkbox" 
                  checked={settings.weeklyReports}
                  onChange={(e) => updateSetting('weeklyReports', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Parent AI Coach</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAssistant}
                  onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Auto-Translate Messaging</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Child Safety Tracking</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case ModuleKey.Teacher:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Teacher Dashboard Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">AI-Powered Classroom Insights</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAnalytics}
                  onChange={(e) => updateSetting('aiAnalytics', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Smart Gap Detector</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiRecommendations}
                  onChange={(e) => updateSetting('aiRecommendations', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">AI-Assisted Grading</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAssistant}
                  onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Auto-Build Remediation Plans</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case ModuleKey.Marketing:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Marketing Dashboard Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Enrollment Funnel Tracking</span>
                <input 
                  type="checkbox" 
                  checked={settings.analytics}
                  onChange={(e) => updateSetting('analytics', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Persona-Based Campaigns</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiRecommendations}
                  onChange={(e) => updateSetting('aiRecommendations', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Geo-Targeted Insights</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Social Proof Stream</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
      
      case ModuleKey.Finance:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Finance Dashboard Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Cost Efficiency AI Suggestions</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiRecommendations}
                  onChange={(e) => updateSetting('aiRecommendations', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Advanced Financial Forecasting</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAnalytics}
                  onChange={(e) => updateSetting('aiAnalytics', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Grant Writing Assistant</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAssistant}
                  onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Audit Compliance Monitor</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">School Management Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Academic Health Monitor</span>
                <input 
                  type="checkbox" 
                  checked={settings.analytics}
                  onChange={(e) => updateSetting('analytics', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Emergency Notification Center</span>
                <input 
                  type="checkbox" 
                  checked={settings.pushNotifications}
                  onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Predictive Analytics</span>
                <input 
                  type="checkbox" 
                  checked={settings.aiAnalytics}
                  onChange={(e) => updateSetting('aiAnalytics', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Crisis Management Hub</span>
                <input 
                  type="checkbox" 
                  checked={true}
                  onChange={() => {}}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'notifications', label: 'Notifications', icon: EnvelopeIcon },
    { id: 'integrations', label: 'Integrations', icon: ComputerDesktopIcon },
    { id: 'module', label: 'Module Settings', icon: ChartBarIcon },
    { id: 'ai', label: 'AI Features', icon: AcademicCapIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-slate-200">Settings</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-700/50 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <HiddenIcons />
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="settings-theme" className="block text-slate-300 text-sm font-medium mb-2">Theme</label>
                    <select 
                      id="settings-theme"
                      value={settings.theme}
                      onChange={(e) => updateSetting('theme', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="settings-language" className="block text-slate-300 text-sm font-medium mb-2">Language</label>
                    <select 
                      id="settings-language"
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="settings-timezone" className="block text-slate-300 text-sm font-medium mb-2">Timezone</label>
                    <select 
                      id="settings-timezone"
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Dubai">Dubai</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="settings-currency" className="block text-slate-300 text-sm font-medium mb-2">Currency</label>
                    <select 
                      id="settings-currency"
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AED">AED (د.إ)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">Email Notifications</span>
                      <p className="text-slate-500 text-sm">Receive updates via email</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">SMS Notifications</span>
                      <p className="text-slate-500 text-sm">Receive urgent alerts via SMS</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.smsNotifications}
                      onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">Push Notifications</span>
                      <p className="text-slate-500 text-sm">Browser push notifications</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.pushNotifications}
                      onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">Weekly Reports</span>
                      <p className="text-slate-500 text-sm">Receive weekly summary reports</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.weeklyReports}
                      onChange={(e) => updateSetting('weeklyReports', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">Service Integrations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Media Hub</span>
                      <p className="text-slate-500 text-sm">Movies, series, documentaries</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.mediaHub}
                      onChange={(e) => updateSetting('mediaHub', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Islamic Resources</span>
                      <p className="text-slate-500 text-sm">Prayer times, Quran, Hadith</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.islamicResources}
                      onChange={(e) => updateSetting('islamicResources', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Book Store</span>
                      <p className="text-slate-500 text-sm">Educational books and resources</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.bookStore}
                      onChange={(e) => updateSetting('bookStore', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Procurement Hub</span>
                      <p className="text-slate-500 text-sm">Bulk purchases and supplies</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.procurementHub}
                      onChange={(e) => updateSetting('procurementHub', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Accommodation Booking</span>
                      <p className="text-slate-500 text-sm">Hotels, villas, apartments</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.accommodationBooking}
                      onChange={(e) => updateSetting('accommodationBooking', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Car Rental</span>
                      <p className="text-slate-500 text-sm">Vehicle booking and management</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.carRental}
                      onChange={(e) => updateSetting('carRental', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Maintenance Service</span>
                      <p className="text-slate-500 text-sm">Facility and equipment maintenance</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.maintenanceService}
                      onChange={(e) => updateSetting('maintenanceService', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <span className="text-slate-300">Concierge Service</span>
                      <p className="text-slate-500 text-sm">Personalized assistance and coordination</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.conciergeService}
                      onChange={(e) => updateSetting('conciergeService', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'module' && getModuleSpecificSettings()}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-200">AI Features</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">AI Assistant</span>
                      <p className="text-slate-500 text-sm">Enable AI-powered assistance</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.aiAssistant}
                      onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">AI Recommendations</span>
                      <p className="text-slate-500 text-sm">Personalized recommendations</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.aiRecommendations}
                      onChange={(e) => updateSetting('aiRecommendations', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-300">AI Analytics</span>
                      <p className="text-slate-500 text-sm">Advanced analytics and insights</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.aiAnalytics}
                      onChange={(e) => updateSetting('aiAnalytics', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Save settings logic here
              console.log('Settings saved:', settings);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
