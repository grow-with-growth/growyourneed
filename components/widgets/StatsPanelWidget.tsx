import React from 'react';
import { USER_DEMOGRAPHICS_DATA } from '../../constants';
import { WidgetCard } from './WidgetCard';
import { UsersIcon } from '../icons';

export const StatsPanelWidget: React.FC = () => {
  const totalUsers = USER_DEMOGRAPHICS_DATA.reduce((sum, item) => sum + item.value, 0);
  return (
    <WidgetCard title="User Demographics">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-1.5 p-1.5 bg-slate-700/30 rounded-md">
          <div className="flex items-center">
            <UsersIcon className="w-5 h-5 text-sky-400 mr-1.5" />
            <span className="text-base font-bold text-slate-100">{totalUsers.toLocaleString()}</span>
          </div>
          <span className="text-xs text-slate-400">Total Users</span>
        </div>
        <ul className="space-y-0.5 text-[10px] sm:text-xs overflow-y-auto flex-grow pr-0.5">
          {USER_DEMOGRAPHICS_DATA.map((stat) => (
            <li key={stat.category} className="flex justify-between items-center p-1 bg-black/20 rounded hover:bg-slate-700/40 transition-colors">
              <span className="text-slate-300">{stat.category}:</span>
              <span className="font-medium text-sky-300">{stat.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </WidgetCard>
  );
};
