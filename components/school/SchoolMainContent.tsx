import React, { useState, useEffect } from 'react';
import { ModuleKey } from '../../types';
import { getSchoolAnalytics, getSchools, School } from '../../services/schoolService';

// Import individual module components
import { SchoolDashboard } from './modules/SchoolDashboard';
import { StudentDashboard } from './modules/StudentDashboard';
import { TeacherDashboard } from './modules/TeacherDashboard';
import { ParentDashboard } from './modules/ParentDashboard';
import { MarketingDashboard } from './modules/MarketingDashboard';
import { FinanceDashboard } from './modules/FinanceDashboard';

interface SchoolMainContentProps {
  activeModule: ModuleKey | null;
}

export const SchoolMainContent: React.FC<SchoolMainContentProps> = ({ activeModule }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [schoolsData, analyticsData] = await Promise.all([
          getSchools(),
          getSchoolAnalytics()
        ]);
        setSchools(schoolsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading school data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <main className="h-full flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading school data...</p>
        </div>
      </main>
    );
  }

  // Render appropriate dashboard based on active module
  const renderModuleDashboard = () => {
    switch (activeModule) {
      case ModuleKey.School:
        return <SchoolDashboard schools={schools} analytics={analytics} />;
      case ModuleKey.Student:
        return <StudentDashboard schools={schools} />;
      case ModuleKey.Teacher:
        return <TeacherDashboard schools={schools} />;
      case ModuleKey.Parents:
        return <ParentDashboard schools={schools} />;
      case ModuleKey.Marketing:
        return <MarketingDashboard schools={schools} />;
      case ModuleKey.Finance:
        return <FinanceDashboard schools={schools} />;
      default:
        return <SchoolDashboard schools={schools} analytics={analytics} />;
    }
  };

  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      {renderModuleDashboard()}
    </main>
  );
};
