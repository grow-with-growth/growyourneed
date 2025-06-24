import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer url={url} playing controls width="100%" height="100%" />
      </div>
    </div>
  );
};
