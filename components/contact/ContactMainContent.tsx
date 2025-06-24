import React from 'react';
import { SampleContactWidget } from './widgets/SampleContactWidget';

export const ContactMainContent: React.FC = () => {
  return (
    <main className="h-full flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <SampleContactWidget />
        <SampleContactWidget />
        <SampleContactWidget />
      </div>
      <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
        <h2 className="text-lg font-semibold text-slate-300 mb-2">Contact Management Tools</h2>
        <p className="text-slate-400">
          Access user directory, manage support tickets, and view communication logs.
        </p>
      </div>
    </main>
  );
};