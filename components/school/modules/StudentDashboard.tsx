import React, { useState, useEffect } from 'react';
import { School, Student, getStudents } from '../../../services/schoolService';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  ExclamationCircleIcon
} from '../../../components/icons';
import { CommonServicesWidget } from '../CommonServicesWidget';
import { IslamicResourcesWidget } from '../IslamicResourcesWidget';
import { AIAssistantWidget } from '../AIAssistantWidget';

interface StudentDashboardProps {
  schools: School[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ schools }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(schools[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const studentsData = await getStudents(selectedSchool.id);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [selectedSchool]);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
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

  const StudentCard = ({ student }: { student: Student }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-start space-x-3">
        <img 
          src={student.profilePicture || 'https://picsum.photos/seed/student/60/60'} 
          alt={`${student.firstName} ${student.lastName}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200">
              {student.firstName} {student.lastName}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              student.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {student.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm">ID: {student.studentId}</p>
          <p className="text-slate-400 text-sm">Grade {student.grade} - Section {student.section}</p>
          
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <ChartBarIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">GPA: {student.academicRecord.gpa}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Attendance: {student.academicRecord.attendance}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Behavior: {student.academicRecord.behaviorScore}/5</span>
            </div>
          </div>

          {student.academicRecord.achievements.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {student.academicRecord.achievements.slice(0, 2).map((achievement, index) => (
                  <span key={index} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                    {achievement}
                  </span>
                ))}
                {student.academicRecord.achievements.length > 2 && (
                  <span className="text-xs text-slate-500">
                    +{student.academicRecord.achievements.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getStudentStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const averageGPA = students.reduce((sum, s) => sum + s.academicRecord.gpa, 0) / totalStudents || 0;
    const averageAttendance = students.reduce((sum, s) => sum + s.academicRecord.attendance, 0) / totalStudents || 0;

    return { totalStudents, activeStudents, averageGPA, averageAttendance };
  };

  const stats = getStudentStats();

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

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="All enrolled"
          icon={UserGroupIcon}
          color="text-blue-400"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          subtitle="Currently enrolled"
          icon={AcademicCapIcon}
          color="text-green-400"
        />
        <StatCard
          title="Average GPA"
          value={stats.averageGPA.toFixed(2)}
          subtitle="Academic performance"
          icon={ChartBarIcon}
          color="text-purple-400"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats.averageAttendance.toFixed(1)}%`}
          subtitle="Class attendance"
          icon={ClockIcon}
          color="text-yellow-400"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search students by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Add New Student
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Students ({filteredStudents.length})
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No students found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>

      {/* AI-Powered Student Features */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">AI-Powered Learning Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
            <AcademicCapIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-slate-200">AI Learning Guide</h3>
            <p className="text-slate-400 text-sm">Personalized learning pathways</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <StarIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-slate-200">EduCoins System</h3>
            <p className="text-slate-400 text-sm">Gamified achievement rewards</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
            <ChartBarIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Growth Analytics</h3>
            <p className="text-slate-400 text-sm">Track learning progress</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
            <ClockIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold text-slate-200">Study Assistant</h3>
            <p className="text-slate-400 text-sm">AI-powered study help</p>
          </div>
        </div>
      </div>

      {/* Common Services Integration */}
      <CommonServicesWidget userRole="student" />

      {/* Islamic Resources */}
      <IslamicResourcesWidget compact={true} />

      {/* AI Assistant */}
      <AIAssistantWidget userRole="student" moduleContext="student" compact={true} />

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <UserGroupIcon className="w-6 h-6 text-blue-400" />
            <span className="text-slate-200">Bulk Import Students</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ChartBarIcon className="w-6 h-6 text-green-400" />
            <span className="text-slate-200">Generate Reports</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <ClockIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-slate-200">Attendance Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
