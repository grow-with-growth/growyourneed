import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { ANALYTICS_HEADER_BUTTONS } from '../../constants';

interface AnalyticHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const AnalyticHeader: React.FC<AnalyticHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="Analytics Dashboard"
      titleColorClass="text-sky-300" // Theme color for Analytics title
      buttons={ANALYTICS_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-sky-600 text-white" // Theme color for active button
    />
  );
};
