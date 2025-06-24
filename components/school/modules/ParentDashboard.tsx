import React, { useState, useEffect } from 'react';
import { School, Parent, getParents } from '../../../services/schoolService';
import {
  UserGroupIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface ParentDashboardProps {
  schools: School[];
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ schools }) => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadParents = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const parentsData = await getParents(selectedSchool.id);
        setParents(parentsData);
      } catch (error) {
        console.error('Error loading parents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParents();
  }, [selectedSchool]);

  const filteredParents = parents.filter(parent =>
    `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm)
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

  const ParentCard = ({ parent }: { parent: Parent }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
          {parent.firstName[0]}{parent.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">
              {parent.firstName} {parent.lastName}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              parent.emergencyContact 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {parent.emergencyContact ? 'Emergency Contact' : 'Regular'}
            </span>
          </div>
          <p className="text-slate-400 text-sm capitalize">{parent.relationship}</p>
          <p className="text-slate-400 text-sm">{parent.email}</p>
          <p className="text-slate-400 text-sm">{parent.phone}</p>
          
          <div className="mt-2">
            <p className="text-slate-500 text-xs">
              {parent.studentIds.length} child{parent.studentIds.length !== 1 ? 'ren' : ''} enrolled
            </p>
            {parent.occupation && (
              <p className="text-slate-500 text-xs">{parent.occupation}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <EnvelopeIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">
                {parent.communicationPreferences.email ? 'Email' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">
                {parent.communicationPreferences.sms ? 'SMS' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <CreditCardIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400 capitalize">
                {parent.paymentInfo.method}
              </span>
            </div>
          </div>

          {parent.meetings.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">
                  {parent.meetings.filter(m => m.status === 'scheduled').length} upcoming meetings
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getParentStats = () => {
    const totalParents = parents.length;
    const emergencyContacts = parents.filter(p => p.emergencyContact).length;
    const totalMeetings = parents.reduce((sum, p) => sum + p.meetings.length, 0);
    const upcomingMeetings = parents.reduce((sum, p) => 
      sum + p.meetings.filter(m => m.status === 'scheduled').length, 0
    );

    return { totalParents, emergencyContacts, totalMeetings, upcomingMeetings };
  };

  const stats = getParentStats();

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

      {/* Parent Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Parents"
          value={stats.totalParents}
          subtitle="Registered parents"
          icon={UserGroupIcon}
          color="text-blue-400"
        />
        <StatCard
          title="Emergency Contacts"
          value={stats.emergencyContacts}
          subtitle="Designated contacts"
          icon={ExclamationCircleIcon}
          color="text-red-400"
        />
        <StatCard
          title="Total Meetings"
          value={stats.totalMeetings}
          subtitle="All time meetings"
          icon={ClockIcon}
          color="text-green-400"
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats.upcomingMeetings}
          subtitle="Scheduled meetings"
          icon={ChatBubbleLeftEllipsisIcon}
          color="text-yellow-400"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search parents by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Add New Parent
          </button>
        </div>
      </div>

      {/* Parents List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Parents ({filteredParents.length})
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Send Notification
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredParents.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No parents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredParents.map(parent => (
              <ParentCard key={parent.id} parent={parent} />
            ))}
          </div>
        )}
      </div>

      {/* Communication Preferences */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Communication Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {parents.filter(p => p.communicationPreferences.email).length}
            </div>
            <div className="text-slate-400">Email Preferred</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {parents.filter(p => p.communicationPreferences.sms).length}
            </div>
            <div className="text-slate-400">SMS Preferred</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {parents.filter(p => p.communicationPreferences.phone).length}
            </div>
            <div className="text-slate-400">Phone Preferred</div>
          </div>
        </div>
      </div>

      {/* Parent AI Features */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Parent AI Assistant Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Learning Pulse</h3>
            <p className="text-slate-400 text-sm">Real-time progress tracking</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <AcademicCapIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Parent AI Coach</h3>
            <p className="text-slate-400 text-sm">Personalized parenting guidance</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Auto-Translate</h3>
            <p className="text-slate-400 text-sm">Multi-language communication</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <ExclamationCircleIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Safety Alerts</h3>
            <p className="text-slate-400 text-sm">Child safety monitoring</p>
          </div>
        </div>
      </div>

      {/* Daily Snapshot Digest */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Daily Snapshot Digest</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Academic Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Math</span>
                <span className="text-green-400 text-sm">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Science</span>
                <span className="text-blue-400 text-sm">88%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">English</span>
                <span className="text-purple-400 text-sm">92%</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Attendance</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">96%</div>
              <div className="text-slate-400 text-sm">This Month</div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Behavior Score</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">4.8</div>
              <div className="text-slate-400 text-sm">Out of 5.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="parent" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget compact={true} />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="parent" moduleContext="parent" compact={true} />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <EnvelopeIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Send Bulk Email</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ClockIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">Schedule Meetings</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <CreditCardIcon className="w-6 h-6 text-purple-400" />
            <span className="text-slate-200">Payment Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};
