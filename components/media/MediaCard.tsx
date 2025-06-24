
import React from 'react';

interface MediaCardProps {
  imageUrl: string;
  title: string;
  description: string;
  onPlay: () => void;
  onPlayMedia?: () => void; // New prop for playing the full media
  playUrl?: string;
  cardType?: 'poster' | 'default';
  mediaType?: 'movie' | 'series' | 'anime' | 'book'; // To show specific play button text
}

export const MediaCard: React.FC<MediaCardProps> = ({ imageUrl, title, description, onPlay, onPlayMedia, playUrl, cardType = 'default', mediaType }) => {
  if (cardType === 'poster') {
    const playButtonText = mediaType === 'movie' ? 'Play Movie' : 'Play Series';
    return (
      <div className="group relative aspect-[2/3] w-full bg-slate-900 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ring-1 ring-white/10">
        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:opacity-0">{title}</h3>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 p-4 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          <h4 className="text-xl font-bold text-white">{title}</h4>
          <p className="text-sm text-slate-300 mt-2 max-h-36 overflow-y-auto custom-scrollbar">{description || 'No description available.'}</p>
          <div className="flex items-center space-x-2 mt-4">
            {onPlayMedia && (
              <button
                onClick={onPlayMedia}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-transform duration-200 hover:scale-105"
              >
                {playButtonText}
              </button>
            )}
            {playUrl && (
              <button
                onClick={onPlay}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-transform duration-200 hover:scale-105"
              >
                Play Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default card for other media types (books, anime)
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl">
      <div>
        <img src={imageUrl} alt={title} className="aspect-video object-cover rounded-md mb-3" />
        <h4 className="text-sm font-medium text-slate-300">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 h-10 overflow-hidden">{description || 'No description available.'}</p>
      </div>
      {playUrl && (
        <button onClick={onPlay} className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm self-start">
          Play Trailer
        </button>
      )}
    </div>
  );
};

