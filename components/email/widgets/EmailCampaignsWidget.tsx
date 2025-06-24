// Email Campaigns Widget - Production Ready
// Comprehensive campaign management with analytics

import React, { useEffect, useState } from 'react';
import { EmailCampaign, getEmailCampaigns, scheduleCampaign, sendCampaignNow } from '../../../services/emailService';
import { EmailDataCard } from '../EmailDataCard';

export const EmailCampaignsWidget: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'sent' | 'scheduled'>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const campaignData = await getEmailCampaigns();
        setCampaigns(campaignData);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400';
      case 'scheduled': return 'text-blue-400';
      case 'sending': return 'text-orange-400';
      case 'sent': return 'text-green-400';
      case 'paused': return 'text-gray-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return '📝';
      case 'scheduled': return '⏰';
      case 'sending': return '📤';
      case 'sent': return '✅';
      case 'paused': return '⏸️';
      case 'cancelled': return '❌';
      default: return '📧';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.status === activeTab;
  });

  const handleSendNow = async (campaignId: string) => {
    try {
      await sendCampaignNow(campaignId);
      // Refresh campaigns
      const updatedCampaigns = await getEmailCampaigns();
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error('Error sending campaign:', error);
    }
  };

  const handleSchedule = async (campaignId: string) => {
    try {
      // Example: schedule for 1 hour from now
      const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await scheduleCampaign(campaignId, scheduledAt);
      // Refresh campaigns
      const updatedCampaigns = await getEmailCampaigns();
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error('Error scheduling campaign:', error);
    }
  };

  return (
    <EmailDataCard 
      title="Email Campaigns" 
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-pink-500 text-white rounded-md hover:bg-pink-400 text-xs font-semibold">
            Create Campaign
          </button>
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
            View All
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Tab Navigation */}
        <div className="flex mb-3 bg-slate-700/30 rounded-md p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'draft', label: 'Drafts' },
            { key: 'sent', label: 'Sent' },
            { key: 'scheduled', label: 'Scheduled' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-pink-500 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map(campaign => (
                <div key={campaign.id} className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors cursor-pointer">
                  <button
                    key={campaign.id}
                    type="button"
                    className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors cursor-pointer w-full text-left"
                    onClick={() => setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign)}
                    aria-pressed={selectedCampaign?.id === campaign.id}
                    aria-label={`Toggle details for campaign ${campaign.name}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(campaign.status)}</span>
                        <h4 className="font-semibold text-pink-200">{campaign.name}</h4>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-300 mb-2">
                      <strong>Subject:</strong> {campaign.subject}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">
                        {(() => {
                          if (campaign.sentAt) {
                            return `Sent: ${formatDate(campaign.sentAt)}`;
                          } else if (campaign.scheduledAt) {
                            return `Scheduled: ${formatDate(campaign.scheduledAt)}`;
                          } else {
                            return `Created: ${formatDate(campaign.createdAt)}`;
                          }
                        })()}
                      </span>
                      <span className="text-slate-400">
                        To: {campaign.audienceId}
                      </span>
                    </div>
                    
                    {/* Campaign Analytics (for sent campaigns) */}
                    {campaign.status === 'sent' && campaign.analytics.totalSent > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-600/50">
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-green-400 font-semibold">{campaign.analytics.totalSent}</div>
                            <div className="text-slate-400">Sent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold">{campaign.analytics.openRate.toFixed(1)}%</div>
                            <div className="text-slate-400">Opens</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-semibold">{campaign.analytics.clickRate.toFixed(1)}%</div>
                            <div className="text-slate-400">Clicks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-semibold">{campaign.analytics.deliveryRate.toFixed(1)}%</div>
                            <div className="text-slate-400">Delivered</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded Campaign Details */}
                    {selectedCampaign?.id === campaign.id && (
                      <div className="mt-3 pt-3 border-t border-slate-600/50 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400">From:</span>
                            <div className="text-slate-300">{campaign.settings.fromName} &lt;{campaign.settings.fromEmail}&gt;</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Type:</span>
                            <div className="text-slate-300 capitalize">{campaign.type}</div>
                          </div>
                        </div>
                        
                        {campaign.content.previewText && (
                          <div className="text-xs">
                            <span className="text-slate-400">Preview:</span>
                            <div className="text-slate-300">{campaign.content.previewText}</div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          {campaign.status === 'draft' && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendNow(campaign.id);
                                }}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-400"
                              >
                                Send Now
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSchedule(campaign.id);
                                }}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-400"
                              >
                                Schedule
                              </button>
                            </>
                          )}
                          <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500">
                            Edit
                          </button>
                          <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500">
                            Duplicate
                          </button>
                          {campaign.status === 'sent' && (
                            <button className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-400">
                              View Report
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                <div className="text-4xl mb-2">📧</div>
                <p>No campaigns found</p>
                <p className="text-xs mt-1">
                  {activeTab === 'all' ? 'Create your first email campaign' : `No ${activeTab} campaigns`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </EmailDataCard>
  );
};
