import React, { useState } from 'react';
import { School } from '../../../services/schoolService';
import {
  HomeIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface SchoolDashboardProps {
  schools: School[];
  analytics: any;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ schools, analytics }) => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);

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

  const SchoolCard = ({ school }: { school: School }) => (
    <div 
      className={`bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
        selectedSchool?.id === school.id 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-700/50 hover:border-slate-600'
      }`}
      onClick={() => setSelectedSchool(school)}
    >
      <div className="flex items-start space-x-3">
        <img 
          src={school.logo || 'https://picsum.photos/seed/school/60/60'} 
          alt={school.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-200">{school.name}</h3>
          <p className="text-slate-400 text-sm">{school.principalName}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-slate-500">
              {school.totalStudents} Students
            </span>
            <span className="text-xs text-slate-500">
              {school.totalTeachers} Teachers
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              school.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {school.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Schools"
          value={analytics?.totalSchools || 0}
          subtitle="Active institutions"
          icon={HomeIcon}
          color="text-blue-400"
        />
        <StatCard
          title="Total Students"
          value={analytics?.totalStudents?.toLocaleString() || 0}
          subtitle="Enrolled students"
          icon={AcademicCapIcon}
          color="text-green-400"
        />
        <StatCard
          title="Total Teachers"
          value={analytics?.totalTeachers?.toLocaleString() || 0}
          subtitle="Active educators"
          icon={UsersIcon}
          color="text-purple-400"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(analytics?.monthlyRevenue || 0).toLocaleString()}`}
          subtitle={`+${analytics?.growthRate || 0}% growth`}
          icon={ChartBarIcon}
          color="text-yellow-400"
        />
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {analytics?.subscriptionBreakdown?.basic || 0}
            </div>
            <div className="text-slate-400">Basic Plan</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {analytics?.subscriptionBreakdown?.premium || 0}
            </div>
            <div className="text-slate-400">Premium Plan</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {analytics?.subscriptionBreakdown?.enterprise || 0}
            </div>
            <div className="text-slate-400">Enterprise Plan</div>
          </div>
        </div>
      </div>

      {/* Schools List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Schools Overview</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {schools.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>

        {/* Selected School Details */}
        {selectedSchool && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">School Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedSchool.logo || 'https://picsum.photos/seed/school/80/80'} 
                  alt={selectedSchool.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-slate-200">{selectedSchool.name}</h3>
                  <p className="text-slate-400">{selectedSchool.principalName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Established</p>
                  <p className="text-slate-200">{selectedSchool.establishedYear}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Academic Year</p>
                  <p className="text-slate-200">{selectedSchool.academicYear}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Students</p>
                  <p className="text-slate-200">{selectedSchool.totalStudents}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Teachers</p>
                  <p className="text-slate-200">{selectedSchool.totalTeachers}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Contact Information</p>
                <p className="text-slate-200">{selectedSchool.email}</p>
                <p className="text-slate-200">{selectedSchool.phone}</p>
                <p className="text-slate-300 text-sm">{selectedSchool.address}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedSchool.subscription.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedSchool.subscription.plan} - {selectedSchool.subscription.status}
                  </span>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  Manage School
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Academic Health Monitor */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Academic Health Monitor</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">92%</div>
              <div className="text-slate-400 text-sm">Overall Performance</div>
              <div className="text-green-400 text-xs">Excellent</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">96%</div>
              <div className="text-slate-400 text-sm">Attendance Rate</div>
              <div className="text-blue-400 text-xs">Above Target</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">4.6</div>
              <div className="text-slate-400 text-sm">Teacher Rating</div>
              <div className="text-purple-400 text-xs">High Quality</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">89%</div>
              <div className="text-slate-400 text-sm">Parent Satisfaction</div>
              <div className="text-yellow-400 text-xs">Very Good</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Management & Emergency Hub */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Crisis Management & Emergency Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Emergency Contacts</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Fire Department</span>
                <span className="text-red-400 text-sm">911</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Police</span>
                <span className="text-blue-400 text-sm">911</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Medical</span>
                <span className="text-green-400 text-sm">911</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400 text-sm">All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400 text-sm">Security Systems Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400 text-sm">Communication Online</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Recent Alerts</h3>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">No active alerts</div>
              <div className="text-slate-500 text-xs">Last drill: 2 weeks ago</div>
              <div className="text-slate-500 text-xs">Next drill: 1 month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="admin" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="admin" moduleContext="school" />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <HomeIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Add New School</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <CogIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">System Settings</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-slate-200">View Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
