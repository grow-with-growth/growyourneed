
import React from 'react';
import { WidgetCard } from './WidgetCard';

export const SummaryCardsWidget: React.FC = () => {
  return (
    <WidgetCard title="Quick Summaries" className="p-1.5 sm:p-2">
      <div className="grid grid-cols-1 gap-1 sm:gap-1.5 h-full">
        <div className="bg-black/30 p-1.5 sm:p-2 rounded-md flex flex-col justify-center text-center hover:bg-slate-700/50 transition-colors duration-150">
          <p className="text-[9px] sm:text-[10px] text-slate-400">Notices</p>
          <p className="text-sm sm:text-base font-bold text-amber-400" style={{textShadow: '0 0 5px rgba(251, 191, 36, 0.7)'}}>2 New</p>
          <p className="text-[8px] sm:text-[9px] text-slate-500">Updated: 2023.07.23 09:32</p>
        </div>
        <div className="bg-black/30 p-1.5 sm:p-2 rounded-md flex flex-col justify-center text-center hover:bg-slate-700/50 transition-colors duration-150">
          <p className="text-[9px] sm:text-[10px] text-slate-400">Tasks</p>
          <p className="text-sm sm:text-base font-bold text-teal-400" style={{textShadow: '0 0 5px rgba(45, 212, 191, 0.7)'}}>5 Pending</p>
          <p className="text-[8px] sm:text-[9px] text-slate-500">Due: 2023.07.30 00:00</p>
        </div>
      </div>
    </WidgetCard>
  );
};
