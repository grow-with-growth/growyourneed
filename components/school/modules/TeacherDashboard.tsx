import React, { useState, useEffect } from 'react';
import { School, Teacher, getTeachers } from '../../../services/schoolService';
import {
  UsersIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  CogIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface TeacherDashboardProps {
  schools: School[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ schools }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTeachers = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const teachersData = await getTeachers(selectedSchool.id);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading teachers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, [selectedSchool]);

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start space-x-3">
        <img 
          src={teacher.profilePicture || 'https://picsum.photos/seed/teacher/60/60'} 
          alt={`${teacher.firstName} ${teacher.lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              teacher.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : teacher.status === 'on-leave'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {teacher.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm">ID: {teacher.employeeId}</p>
          <p className="text-slate-400 text-sm">{teacher.experience} years experience</p>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {teacher.subjects.slice(0, 3).map((subject, index) => (
                <span key={index} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  {subject}
                </span>
              ))}
              {teacher.subjects.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{teacher.subjects.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Rating: {teacher.performance.rating}/5</span>
            </div>
            <div className="flex items-center space-x-1">
              <AcademicCapIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Classes: {teacher.classes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BriefcaseIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">${teacher.salary.toLocaleString()}</span>
            </div>
          </div>

          {teacher.performance.achievements.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {teacher.performance.achievements.slice(0, 2).map((achievement, index) => (
                  <span key={index} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                    {achievement}
                  </span>
                ))}
                {teacher.performance.achievements.length > 2 && (
                  <span className="text-xs text-slate-500">
                    +{teacher.performance.achievements.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getTeacherStats = () => {
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.status === 'active').length;
    const averageRating = teachers.reduce((sum, t) => sum + t.performance.rating, 0) / totalTeachers || 0;
    const averageExperience = teachers.reduce((sum, t) => sum + t.experience, 0) / totalTeachers || 0;
    const averageSalary = teachers.reduce((sum, t) => sum + t.salary, 0) / totalTeachers || 0;

    return { totalTeachers, activeTeachers, averageRating, averageExperience, averageSalary };
  };

  const stats = getTeacherStats();

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

      {/* Teacher Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          subtitle="All faculty"
          icon={UsersIcon}
          color="text-blue-400"
        />
        <StatCard
          title="Active Teachers"
          value={stats.activeTeachers}
          subtitle="Currently teaching"
          icon={AcademicCapIcon}
          color="text-green-400"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle="Performance rating"
          icon={StarIcon}
          color="text-yellow-400"
        />
        <StatCard
          title="Avg Experience"
          value={`${stats.averageExperience.toFixed(1)} yrs`}
          subtitle="Teaching experience"
          icon={ClockIcon}
          color="text-purple-400"
        />
        <StatCard
          title="Average Salary"
          value={`$${Math.round(stats.averageSalary / 1000)}K`}
          subtitle="Annual compensation"
          icon={BriefcaseIcon}
          color="text-indigo-400"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search teachers by name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Add New Teacher
          </button>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Teachers ({filteredTeachers.length})
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Schedule View
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No teachers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredTeachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>

      {/* Performance Overview */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {teachers.filter(t => t.performance.rating >= 4.5).length}
            </div>
            <div className="text-slate-400">Excellent (4.5+)</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {teachers.filter(t => t.performance.rating >= 3.5 && t.performance.rating < 4.5).length}
            </div>
            <div className="text-slate-400">Good (3.5-4.4)</div>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {teachers.filter(t => t.performance.rating < 3.5).length}
            </div>
            <div className="text-slate-400">Needs Improvement (&lt;3.5)</div>
          </div>
        </div>
      </div>

      {/* AI-Powered Teaching Tools */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">AI-Powered Teaching Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <AcademicCapIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Classroom Insights</h3>
            <p className="text-slate-400 text-sm">AI-powered analytics</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Smart Gap Detector</h3>
            <p className="text-slate-400 text-sm">Identify learning gaps</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <CogIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-slate-200">AI Grading</h3>
            <p className="text-slate-400 text-sm">Automated assessment</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <ComputerDesktopIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Content Generator</h3>
            <p className="text-slate-400 text-sm">AI lesson planning</p>
          </div>
        </div>
      </div>

      {/* Teaching Resources Hub */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Teaching Resources Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Lesson Plans</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Math Grade 8</span>
                <span className="text-green-400 text-sm">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Science Grade 9</span>
                <span className="text-yellow-400 text-sm">Draft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Physics Grade 10</span>
                <span className="text-blue-400 text-sm">Review</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Assessment Tools</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 bg-slate-600/50 rounded text-slate-300 hover:bg-slate-600 transition-colors">
                Quiz Generator
              </button>
              <button className="w-full text-left p-2 bg-slate-600/50 rounded text-slate-300 hover:bg-slate-600 transition-colors">
                Rubric Builder
              </button>
              <button className="w-full text-left p-2 bg-slate-600/50 rounded text-slate-300 hover:bg-slate-600 transition-colors">
                Grade Calculator
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg">
            <h3 className="font-medium text-slate-200 mb-2">Collaboration</h3>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Active Discussions: 5</div>
              <div className="text-slate-400 text-sm">Shared Resources: 12</div>
              <div className="text-slate-400 text-sm">Peer Reviews: 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="teacher" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget compact={true} />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="teacher" moduleContext="teacher" compact={true} />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <UsersIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Manage Schedules</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ChartBarIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">Performance Reports</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <BriefcaseIcon className="w-6 h-6 text-purple-400" />
            <span className="text-slate-200">Payroll Management</span>
          </button>
        </div>
      </div>
    </div>
  );
};
