import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { CONTACT_HEADER_BUTTONS } from '../../constants';

interface ContactHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
}

export const ContactHeader: React.FC<ContactHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect }) => {
  return (
    <SubViewHeader
      title="Contact Dashboard"
      titleColorClass="text-teal-300" // Theme color for Contact title
      buttons={CONTACT_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-teal-600 text-white" // Theme color for active button
    />
  );
};
