import React from 'react';
import { SubViewHeader } from '../SubViewHeader';
import { MEDIA_HEADER_BUTTONS } from '../../constants';

interface MediaHeaderProps {
  activeSubModuleKey: string | null;
  onSubModuleSelect: (key: string) => void;
  onSearch: (query: string) => void;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({ activeSubModuleKey, onSubModuleSelect, onSearch }) => {
  return (
    <SubViewHeader
      title="Media Dashboard"
      titleColorClass="text-red-300" // Theme color for Media title
      buttons={MEDIA_HEADER_BUTTONS}
      activeButtonKey={activeSubModuleKey}
      onButtonClick={onSubModuleSelect}
      activeButtonColorClass="bg-red-600 text-white" // Theme color for active button
    >
      <div className="flex items-center ml-auto">
        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-800/50 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </SubViewHeader>
  );
};
