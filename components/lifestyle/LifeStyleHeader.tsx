import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { LIFESTYLE_HEADER_BUTTONS } from '../../constants';

interface LifeStyleHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const LifeStyleHeader: React.FC<LifeStyleHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="LifeStyle Dashboard"
      titleColorClass="text-yellow-300" // Theme color for LifeStyle title
      buttons={LIFESTYLE_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-yellow-500 text-white" // Theme color for active button
    />
  );
};
