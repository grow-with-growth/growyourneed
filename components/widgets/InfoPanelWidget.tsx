import React from 'react';
import { ArrowTrendingUpIcon, ChevronUpIcon, QrCodeIcon } from '../icons';
import { WidgetCard } from './WidgetCard';

export const InfoPanelWidget: React.FC = () => {
  return (
    <WidgetCard title="Digital Resource Stats">
      <div className="flex flex-col justify-between h-full text-[10px] sm:text-xs">
        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
          <div className="bg-black/20 p-1 sm:p-1.5 rounded">
            <p className="text-slate-400 text-[9px] sm:text-[10px]">Active Users</p>
            <p className="text-sm sm:text-base font-bold text-green-400 flex items-center">
              322K <ChevronUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5" />
            </p>
          </div>
          <div className="bg-black/20 p-1 sm:p-1.5 rounded">
            <p className="text-slate-400 text-[9px] sm:text-[10px]">Downloads</p>
            <p className="text-sm sm:text-base font-bold text-sky-400 flex items-center">
              2.3K <ArrowTrendingUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5" />
            </p>
          </div>
          <div className="bg-black/20 p-1 sm:p-1.5 rounded col-span-2">
            <p className="text-slate-400 text-[9px] sm:text-[10px]">Total Resources</p>
            <p className="text-sm sm:text-base font-bold text-purple-400 flex items-center">
              859K <ChevronUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5"/>
            </p>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center min-h-0"> {/* Added min-h-0 */}
           <QrCodeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 hover:text-sky-300 transition-colors" />
        </div>
      </div>
    </WidgetCard>
  );
};
