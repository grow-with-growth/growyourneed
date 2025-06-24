import React from 'react';
import { SampleAcademicsWidget } from './widgets/SampleAcademicsWidget';

export const AcademicsMainContent: React.FC = () => {
  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="lg:col-span-2">
            <SampleAcademicsWidget />
        </div>
        <div>
            <SampleAcademicsWidget /> 
        </div>
        <div>
            <SampleAcademicsWidget />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
            <SampleAcademicsWidget />
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-300 mb-2">Academics Resources</h2>
        <p className="text-slate-400">
          Detailed academic reports, curriculum details, and student progress trackers can be integrated here.
        </p>
      </div>
    </main>
  );
};