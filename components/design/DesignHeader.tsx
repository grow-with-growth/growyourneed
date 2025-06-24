import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { DESIGN_HEADER_BUTTONS } from '../../constants';

interface DesignHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const DesignHeader: React.FC<DesignHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="Design Dashboard"
      titleColorClass="text-indigo-300" // Theme color for Design title
      buttons={DESIGN_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-indigo-600 text-white" // Theme color for active button
    />
  );
};
