import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { EMAIL_HEADER_BUTTONS } from '../../constants';

interface EmailHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="Email Dashboard"
      titleColorClass="text-pink-300" // Theme color for Email title
      buttons={EMAIL_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-pink-600 text-white" // Theme color for active button
    />
  );
};
