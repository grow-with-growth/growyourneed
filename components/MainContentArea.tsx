
import React from 'react';
import { CentralGraphicWidget } from './widgets/CentralGraphicWidget';
import { LineChartWidget } from './widgets/LineChartWidget';
import { RankedListWidget } from './widgets/RankedListWidget';
import { BarChartWidget } from './widgets/BarChartWidget';
import { LogFeedWidget } from './widgets/LogFeedWidget';
import { StatsPanelWidget } from './widgets/StatsPanelWidget';
import { DualGaugePanelWidget } from './widgets/DualGaugePanelWidget';
import { InfoPanelWidget } from './widgets/InfoPanelWidget';
import { MultiLayerDonutChartWidget } from './widgets/MultiLayerDonutChartWidget';
import { MultiColorBarChartWidget } from './widgets/MultiColorBarChartWidget';
import { DualRadialGaugeWidget } from './widgets/DualRadialGaugeWidget';
import { SummaryCardsWidget } from './widgets/SummaryCardsWidget';
import { SchoolMainContent } from './school/SchoolMainContent';
import { ModuleKey } from '../types';

interface MainContentAreaProps {
  activeModule?: ModuleKey | null;
}

export const MainContentArea: React.FC<MainContentAreaProps> = ({ activeModule }) => {
  // If a school module is selected, show the school management interface
  if (activeModule && Object.values(ModuleKey).includes(activeModule)) {
    return <SchoolMainContent activeModule={activeModule} />;
  }
  return (
    <main className="h-full flex p-3 md:p-4 gap-3 md:gap-4 bg-transparent overflow-hidden">
      {/* Left Column of Widgets: Takes ~25% width */}
      <div className="flex flex-col gap-3 md:gap-4 w-[24%] h-full overflow-hidden">
        <div className="h-1/4"><LineChartWidget /></div>
        <div className="h-1/4"><RankedListWidget /></div>
        <div className="h-1/4"><BarChartWidget /></div>
        <div className="h-1/4"><LogFeedWidget /></div>
      </div>

      {/* Center Column (Central Graphic + Widgets Below): Takes ~52% width */}
      <div className="flex flex-col gap-3 md:gap-4 w-[52%] h-full overflow-hidden">
        <div className="h-2/3"><CentralGraphicWidget /></div>
        <div className="h-1/3 grid grid-cols-3 gap-3 md:gap-4 overflow-hidden">
          <MultiLayerDonutChartWidget />
          <MultiColorBarChartWidget />
          <DualRadialGaugeWidget />
        </div>
      </div>

      {/* Right Column of Widgets: Takes ~24% width */}
      <div className="flex flex-col gap-3 md:gap-4 w-[24%] h-full overflow-hidden">
        <div className="h-1/4"><StatsPanelWidget /></div>
        <div className="h-1/4"><DualGaugePanelWidget /></div>
        <div className="h-1/4"><InfoPanelWidget /></div>
        <div className="h-1/4"><SummaryCardsWidget /></div>
      </div>
    </main>
  );
};
