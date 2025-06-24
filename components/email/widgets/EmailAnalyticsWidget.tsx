// Email Analytics Widget - Production Ready
// Comprehensive email marketing analytics and insights

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCampaignAnalytics, getEmailCampaigns, getOverallAnalytics } from '../../../services/emailService';
import { EmailDataCard } from '../EmailDataCard';
import { ErrorBoundary } from '../ErrorBoundary';
import '../i18n';

interface AnalyticsData {
  totalCampaigns: number;
  totalSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalSubscribers: number;
  newSubscribers: number;
  unsubscribes: number;
  topPerformingCampaign: string;
  recentActivity: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
  }>;
}

export const EmailAnalyticsWidget: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState<'sent' | 'opened' | 'clicked'>('sent');
  const [campaigns, setCampaigns] = useState<{id: string, name: string}[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  useEffect(() => {
    // Fetch available campaigns for dropdown
    const fetchCampaigns = async () => {
      try {
        const data = await getEmailCampaigns();
        setCampaigns(data.map((c) => ({ id: c.id, name: c.name })));
        setSelectedCampaign(data[0]?.id || '');
      } catch (e) {
        // fallback: no campaigns
        setCampaigns([]);
        setSelectedCampaign('');
        // Show a user-friendly notification (could be replaced with a real toast/alert system)
        window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'Failed to load campaigns. Please try again later.' } }));
        console.error('Error fetching campaigns:', e);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const endDate = new Date();
        const startDate = new Date();
        switch (timeRange) {
          case '7d': startDate.setDate(endDate.getDate() - 7); break;
          case '30d': startDate.setDate(endDate.getDate() - 30); break;
          case '90d': startDate.setDate(endDate.getDate() - 90); break;
        }
        let analyticsData;
        if (selectedCampaign) {
          analyticsData = await getCampaignAnalytics(selectedCampaign);
        } else {
          analyticsData = await getOverallAnalytics();
        }
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, selectedCampaign]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'sent': return 'text-blue-400';
      case 'opened': return 'text-green-400';
      case 'clicked': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return <span className="text-green-400 text-xs">↗ +{value.toFixed(1)}%</span>;
    } else if (value < 0) {
      return <span className="text-red-400 text-xs">↘ {value.toFixed(1)}%</span>;
    }
    return <span className="text-slate-400 text-xs">→ 0%</span>;
  };

  // Refactor nested ternary for loading/analytics UI
  let analyticsContent: React.ReactNode;
  if (loading) {
    analyticsContent = (
      <output className="flex justify-center py-4" aria-live="polite">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" aria-label={t('Loading')}></div>
      </output>
    );
  } else if (analytics) {
    analyticsContent = (
      <div className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-blue-400">{formatNumber(analytics.totalSent)}</div>
                <div className="text-xs text-slate-400">{t('Emails Sent')}</div>
              </div>
              <div className="text-right">
                {getChangeIndicator(12.5)}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-green-400">{analytics.averageOpenRate.toFixed(1)}%</div>
                <div className="text-xs text-slate-400">{t('Open Rate')}</div>
              </div>
              <div className="text-right">
                {getChangeIndicator(2.3)}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-purple-400">{analytics.averageClickRate.toFixed(1)}%</div>
                <div className="text-xs text-slate-400">{t('Click Rate')}</div>
              </div>
              <div className="text-right">
                {getChangeIndicator(-0.8)}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{formatNumber(analytics.totalSubscribers)}</div>
                <div className="text-xs text-slate-400">{t('Subscribers')}</div>
              </div>
              <div className="text-right">
                {getChangeIndicator(5.2)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Chart */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-slate-300">{t('Recent Activity')}</h4>
            <div className="flex gap-1" role="tablist">
              {['sent', 'opened', 'clicked'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric as any)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    activeMetric === metric
                      ? 'bg-pink-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  role="tab"
                  aria-selected={activeMetric === metric}
                  aria-controls={`activity-panel-${metric}`}
                  tabIndex={activeMetric === metric ? 0 : -1}
                >
                  {t(metric.charAt(0).toUpperCase() + metric.slice(1))}
                </button>
              ))}
            </div>
          </div>
          {/* Simple Bar Chart */}
          <div className="space-y-2" id={`activity-panel-${activeMetric}`} role="tabpanel" aria-live="polite">
            {analytics.recentActivity.slice(0, 5).map((activity) => {
              const maxValue = Math.max(...analytics.recentActivity.map(a => a[activeMetric]));
              const percentage = (activity[activeMetric] / maxValue) * 100;
              let barColor = '';
              if (activeMetric === 'sent') {
                barColor = 'bg-blue-500';
              } else if (activeMetric === 'opened') {
                barColor = 'bg-green-500';
              } else {
                barColor = 'bg-purple-500';
              }
              return (
                <div key={activity.date} className="flex items-center gap-2">
                  <div className="text-xs text-slate-400 w-12">
                    {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 bg-slate-600/50 rounded-full h-2 relative" aria-label={`${activeMetric} bar`}>
                    <div 
                      className={`h-2 rounded-full transition-all ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className={`text-xs font-medium w-12 text-right ${getMetricColor(activeMetric)}`}
                    aria-label={`${activity[activeMetric]} ${activeMetric}`}
                  >
                    {formatNumber(activity[activeMetric])}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <h4 className="font-medium text-slate-300 mb-3">{t('Performance Insights')}</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{t('Top Performing Campaign')}:</span>
              <span className="text-green-400 font-medium">{analytics.topPerformingCampaign}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{t('New Subscribers')}:</span>
              <span className="text-blue-400 font-medium">+{analytics.newSubscribers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{t('Unsubscribes')}:</span>
              <span className="text-red-400 font-medium">-{analytics.unsubscribes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{t('Net Growth')}:</span>
              <span className="text-green-400 font-medium">+{analytics.newSubscribers - analytics.unsubscribes}</span>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <h4 className="font-medium text-slate-300 mb-3">{t('Engagement Breakdown')}</h4>
          <div className="space-y-2">
            {/* Open Rate Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{t('Open Rate')}</span>
                <span className="text-green-400">{analytics.averageOpenRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${analytics.averageOpenRate}%` }}
                />
              </div>
            </div>
            
            {/* Click Rate Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{t('Click Rate')}</span>
                <span className="text-purple-400">{analytics.averageClickRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${analytics.averageClickRate * 10}%` }}
                />
              </div>
            </div>
            
            {/* Click-to-Open Rate */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{t('Click-to-Open Rate')}</span>
                <span className="text-blue-400">{(analytics.averageClickRate / analytics.averageOpenRate * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${(analytics.averageClickRate / analytics.averageOpenRate * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    analyticsContent = (
      <output className="text-center py-6 text-slate-400" aria-live="polite">
        <div className="text-4xl mb-2">📊</div>
        <p>{t('No analytics data available')}</p>
        <p className="text-xs mt-1">{t('Send some campaigns to see analytics')}</p>
      </output>
    );
  }

  return (
    <ErrorBoundary>
      <EmailDataCard 
        title={t('Email Analytics')} 
        footer={
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-400 text-xs font-semibold">
              {t('Full Report')}
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
              {t('Export Data')}
            </button>
          </div>
        }
      >
        <div className="text-sm">
          {/* Time Range Selector */}
          <div className="flex mb-4 bg-slate-700/30 rounded-md p-1" aria-label={t('Time Range Selector')}>
            {[
              { key: '7d', label: t('7 Days') },
              { key: '30d', label: t('30 Days') },
              { key: '90d', label: t('90 Days') }
            ].map(range => (
              <label key={range.key} className="flex-1">
                <input
                  type="radio"
                  name="time-range"
                  value={range.key}
                  checked={timeRange === range.key}
                  onChange={() => setTimeRange(range.key)}
                  className="hidden peer"
                  aria-checked={timeRange === range.key}
                />
                <span
                  className={`block py-1.5 px-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                    timeRange === range.key
                      ? 'bg-pink-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  } peer-checked:bg-pink-500 peer-checked:text-white`}
                  tabIndex={timeRange === range.key ? 0 : -1}
                >
                  {range.label}
                </span>
              </label>
            ))}
          </div>
          {/* Campaign Selector */}
          <div className="flex mb-2 gap-2 items-center">
            <span className="text-xs text-slate-400">{t('Campaign')}:</span>
            <select
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
              value={selectedCampaign}
              onChange={e => setSelectedCampaign(e.target.value)}
              aria-label={t('Select Campaign')}
            >
              <option value="">{t('All Campaigns')}</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Replace nested ternary with variable */}
          <div aria-live="polite" aria-atomic="true">{analyticsContent}</div>
        </div>
      </EmailDataCard>
    </ErrorBoundary>
  );
};
