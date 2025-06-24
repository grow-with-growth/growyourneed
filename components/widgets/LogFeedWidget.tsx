
import React from 'react';
import { SYSTEM_LOG_DATA } from '../../constants';
import { WidgetCard } from './WidgetCard';

export const LogFeedWidget: React.FC = () => {
  return (
    <WidgetCard title="System Activity Log">
      <ul className="space-y-1 h-full overflow-y-auto text-[10px] sm:text-xs pr-0.5">
        {SYSTEM_LOG_DATA.map((entry) => (
          <li key={entry.id} className="flex items-start p-1 bg-black/20 rounded hover:bg-slate-700/30 transition-colors duration-150 leading-tight">
            <span className="font-mono text-cyan-400 mr-1.5 shrink-0 text-[9px] sm:text-[10px]">{entry.timestamp}</span>
            <span className="text-slate-300 break-words">{entry.message}</span>
          </li>
        ))}
        {/* Add more items if needed to test scrolling within the widget */}
        {SYSTEM_LOG_DATA.map((entry, index) => (
          <li key={`${entry.id}-${index}-clone`} className="flex items-start p-1 bg-black/20 rounded hover:bg-slate-700/30 transition-colors duration-150 leading-tight">
            <span className="font-mono text-cyan-400 mr-1.5 shrink-0 text-[9px] sm:text-[10px]">{entry.timestamp}</span>
            <span className="text-slate-300 break-words">{entry.message} (Copy)</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
