import React from 'react';
import { RANKED_LIST_DATA } from '../../constants';
import { WidgetCard } from './WidgetCard';
import { StarIcon } from '../icons'; // Assuming StarIcon is appropriate

export const RankedListWidget: React.FC = () => {
  return (
    <WidgetCard title="Top Ranked Items / Users">
      <ul className="space-y-1.5 h-full overflow-y-auto pr-0.5 text-xs">
        {RANKED_LIST_DATA.map((item) => (
          <li key={item.id} className="flex items-center p-1.5 sm:p-2 bg-black/20 rounded-md hover:bg-slate-700/40 transition-colors duration-150">
            <StarIcon 
              className={`w-4 h-4 mr-2 ${item.iconColor} shrink-0 filter drop-shadow(0 0 2px var(--icon-shadow-color, #fff))`} 
              style={{'--icon-shadow-color': item.iconColor.replace('text-', 'var(--tw-color-').replace('-400', ')').replace(')', ',0.7)')} as React.CSSProperties & { '--icon-shadow-color': string }}
            />
            <div className="flex-grow overflow-hidden">
              <p className="text-[10px] sm:text-xs font-medium text-slate-200 truncate">{item.rank}. {item.name}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{item.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
