// Email Lists Widget - Production Ready
// Subscriber list management with segmentation and analytics

import React, { useEffect, useState } from 'react';
import { EmailList, getEmailLists, getListSubscribers, Subscriber } from '../../../services/emailService';
import { EmailDataCard } from '../EmailDataCard';

export const EmailListsWidget: React.FC = () => {
  const [lists, setLists] = useState<EmailList[]>([]);
  const [selectedList, setSelectedList] = useState<EmailList | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const listData = await getEmailLists();
        setLists(listData);
      } catch (error) {
        console.error('Error fetching email lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleViewSubscribers = async (list: EmailList) => {
    try {
      setSubscribersLoading(true);
      setSelectedList(list);
      setShowSubscribers(true);
      
      const subscriberData = await getListSubscribers(list.id, 1, 20);
      setSubscribers(subscriberData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getEngagementLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Very Low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'subscribed': return 'text-green-400';
      case 'unsubscribed': return 'text-red-400';
      case 'bounced': return 'text-orange-400';
      case 'complained': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const calculateGrowthRate = (list: EmailList) => {
    // Production-ready: calculate growth rate based on historical data if available
    // Example: ((current - previous) / previous) * 100
    // If no historical data, return 0 (safe default)
    if (!list.historicalSubscriberCounts || list.historicalSubscriberCounts.length < 2) {
      return 0;
    }
    const counts = list.historicalSubscriberCounts;
    const previous = counts[counts.length - 2];
    const current = counts[counts.length - 1];
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <>
      <EmailDataCard 
        title="Email Lists" 
        footer={
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-pink-500 text-white rounded-md hover:bg-pink-400 text-xs font-semibold">
              Create List
            </button>
            <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
              Import Contacts
            </button>
          </div>
        }
      >
        <div className="text-sm">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {lists.length > 0 ? (
                lists.map(emailList => {
                  const growthRate = calculateGrowthRate(emailList);
                  const engagementRate = (emailList.activeSubscribers / emailList.subscriberCount) * 100;
                  return (
                    <div 
                      key={emailList.id} 
                      className="p-3 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-pink-200">{emailList.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{emailList.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {emailList.isActive ? (
                            <span className="text-xs bg-green-600/50 text-green-300 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-600/50 text-gray-300 px-1.5 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Subscriber Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{emailList.subscriberCount.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{emailList.activeSubscribers.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{engagementRate.toFixed(1)}%</div>
                          <div className="text-xs text-slate-400">Engaged</div>
                        </div>
                      </div>
                      {/* Growth Indicator */}
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-400">Growth Rate:</span>
                        <span className={growthRate >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {growthRate >= 0 ? '↗' : '↘'} {Math.abs(growthRate).toFixed(1)}%
                        </span>
                      </div>
                      {/* Tags */}
                      {emailList.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {emailList.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                        <span>Created: {formatDate(emailList.createdAt)}</span>
                        <span>Updated: {formatDate(emailList.updatedAt)}</span>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewSubscribers(emailList)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-400"
                        >
                          View Subscribers
                        </button>
                        <button className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-400">
                          Create Segment
                        </button>
                        <button className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-400">
                          Export
                        </button>
                        <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500">
                          Settings
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No email lists found</p>
                  <p className="text-xs mt-1">Create your first email list to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </EmailDataCard>

      {/* Subscribers Modal */}
      {showSubscribers && selectedList && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedList.name} Subscribers</h2>
                <p className="text-slate-400 text-sm">{selectedList.subscriberCount.toLocaleString()} total subscribers</p>
              </div>
              <button
                onClick={() => setShowSubscribers(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Subscribers Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {subscribersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {subscribers.map(subscriber => (
                    <div key={subscriber.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">
                            {subscriber.firstName && subscriber.lastName 
                              ? `${subscriber.firstName} ${subscriber.lastName}`
                              : subscriber.email}
                          </h4>
                          <p className="text-sm text-slate-400">{subscriber.email}</p>
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Subscribed:</span>
                          <div className="text-slate-300">{formatDate(subscriber.subscribedAt)}</div>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Engagement:</span>
                          <div className={`font-medium ${getEngagementColor(subscriber.engagementScore)}`}>
                            {getEngagementLabel(subscriber.engagementScore)} ({subscriber.engagementScore})
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Last Activity:</span>
                          <div className="text-slate-300">
                            {subscriber.lastEngagement 
                              ? formatDate(subscriber.lastEngagement)
                              : 'Never'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Subscriber Tags */}
                      {subscriber.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {subscriber.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {subscribers.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p>No subscribers found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-slate-700/50">
              <div className="text-sm text-slate-400">
                Showing {subscribers.length} of {selectedList.subscriberCount.toLocaleString()} subscribers
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors">
                  Load More
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition-colors">
                  Export List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
