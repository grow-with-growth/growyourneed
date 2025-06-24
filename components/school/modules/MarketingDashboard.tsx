import React, { useState, useEffect } from 'react';
import { School, MarketingCampaign, getMarketingCampaigns } from '../../../services/schoolService';
import {
  MegaphoneIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  StarIcon,
  ComputerDesktopIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface MarketingDashboardProps {
  schools: School[];
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ schools }) => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const campaignsData = await getMarketingCampaigns(selectedSchool.id);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [selectedSchool]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-slate-500 text-xs">{subtitle}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const CampaignCard = ({ campaign }: { campaign: MarketingCampaign }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start space-x-3">
        {campaign.content.imageUrl && (
          <img 
            src={campaign.content.imageUrl} 
            alt={campaign.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">{campaign.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              campaign.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : campaign.status === 'completed'
                ? 'bg-blue-500/20 text-blue-400'
                : campaign.status === 'paused'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm capitalize">{campaign.type} Campaign</p>
          <p className="text-slate-400 text-sm">Target: {campaign.targetAudience}</p>
          
          <div className="mt-2">
            <p className="text-slate-300 text-sm">{campaign.content.title}</p>
            <p className="text-slate-500 text-xs line-clamp-2">{campaign.content.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-slate-500 text-xs">Budget</p>
              <p className="text-slate-200 text-sm">${campaign.budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Spent</p>
              <p className="text-slate-200 text-sm">${campaign.spent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Reach</p>
              <p className="text-slate-200 text-sm">{campaign.metrics.reach.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Conversions</p>
              <p className="text-slate-200 text-sm">{campaign.metrics.conversions}</p>
            </div>
          </div>

          <div className="mt-3 bg-slate-700/30 rounded-lg p-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getCampaignStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalReach = campaigns.reduce((sum, c) => sum + c.metrics.reach, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.metrics.leads, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0);

    return { 
      totalCampaigns, 
      activeCampaigns, 
      totalBudget, 
      totalSpent, 
      totalReach, 
      totalLeads, 
      totalConversions 
    };
  };

  const stats = getCampaignStats();

  return (
    <div className="space-y-6">
      {/* School Selector */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <label className="block text-slate-300 text-sm font-medium mb-2">Select School</label>
        <select
          value={selectedSchool?.id || ''}
          onChange={(e) => setSelectedSchool(schools.find(s => s.id === e.target.value) || null)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {schools.map(school => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </select>
      </div>

      {/* Marketing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          subtitle={`${stats.activeCampaigns} active`}
          icon={MegaphoneIcon}
          color="text-blue-400"
        />
        <StatCard
          title="Total Reach"
          value={stats.totalReach.toLocaleString()}
          subtitle="People reached"
          icon={UsersIcon}
          color="text-green-400"
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle="Generated leads"
          icon={ArrowTrendingUpIcon}
          color="text-purple-400"
        />
        <StatCard
          title="Conversions"
          value={stats.totalConversions}
          subtitle={`${((stats.totalConversions / stats.totalLeads) * 100 || 0).toFixed(1)}% rate`}
          icon={ChartBarIcon}
          color="text-yellow-400"
        />
      </div>

      {/* Budget Overview */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              ${stats.totalBudget.toLocaleString()}
            </div>
            <div className="text-slate-400">Total Budget</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              ${stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-slate-400">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              ${(stats.totalBudget - stats.totalSpent).toLocaleString()}
            </div>
            <div className="text-slate-400">Remaining</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search campaigns by name, type, or audience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Campaigns ({filteredCampaigns.length})
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Analytics
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <MegaphoneIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No campaigns found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>

      {/* Campaign Performance */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Campaign Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <div className="text-slate-400">Active</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {campaigns.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-slate-400">Completed</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {campaigns.filter(c => c.status === 'paused').length}
            </div>
            <div className="text-slate-400">Paused</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-slate-400">
              {campaigns.filter(c => c.status === 'draft').length}
            </div>
            <div className="text-slate-400">Draft</div>
          </div>
        </div>
      </div>

      {/* Advanced Marketing Tools */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Advanced Marketing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Enrollment Funnel</h3>
            <p className="text-slate-400 text-sm">Track conversion pipeline</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <UsersIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Persona Campaigns</h3>
            <p className="text-slate-400 text-sm">Targeted messaging</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <StarIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Social Proof</h3>
            <p className="text-slate-400 text-sm">Testimonials & reviews</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <ComputerDesktopIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Geo-Targeting</h3>
            <p className="text-slate-400 text-sm">Location-based insights</p>
          </div>
        </div>
      </div>

      {/* Enrollment Funnel Analytics */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Enrollment Funnel Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">2,450</div>
            <div className="text-slate-400 text-sm">Website Visitors</div>
            <div className="text-slate-500 text-xs">100%</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">856</div>
            <div className="text-slate-400 text-sm">Inquiries</div>
            <div className="text-slate-500 text-xs">35%</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">342</div>
            <div className="text-slate-400 text-sm">Applications</div>
            <div className="text-slate-500 text-xs">14%</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">198</div>
            <div className="text-slate-400 text-sm">Interviews</div>
            <div className="text-slate-500 text-xs">8%</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">156</div>
            <div className="text-slate-400 text-sm">Enrollments</div>
            <div className="text-slate-500 text-xs">6.4%</div>
          </div>
        </div>
      </div>

      {/* Social Media & Content Hub */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Social Media & Content Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Social Media Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Facebook</span>
                <span className="text-blue-400 text-sm">12.5K followers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Instagram</span>
                <span className="text-pink-400 text-sm">8.2K followers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">LinkedIn</span>
                <span className="text-blue-400 text-sm">3.1K connections</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Content Calendar</h3>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Scheduled Posts: 15</div>
              <div className="text-slate-400 text-sm">Draft Content: 8</div>
              <div className="text-slate-400 text-sm">Published Today: 3</div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Engagement Metrics</h3>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Avg. Engagement: 4.2%</div>
              <div className="text-slate-400 text-sm">Comments: 156</div>
              <div className="text-slate-400 text-sm">Shares: 89</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="marketing" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget compact={true} />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="marketing" moduleContext="marketing" compact={true} />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <MegaphoneIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Launch Campaign</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ChartBarIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <CreditCardIcon className="w-6 h-6 text-purple-400" />
            <span className="text-slate-200">Budget Planning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
