import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { ACADEMICS_HEADER_BUTTONS } from '../../constants';

interface AcademicsHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const AcademicsHeader: React.FC<AcademicsHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="Academics Dashboard"
      titleColorClass="text-green-300" // Theme color for Academics title
      buttons={ACADEMICS_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-green-600 text-white" // Theme color for active button
    />
  );
};
