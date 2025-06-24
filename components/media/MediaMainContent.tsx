import React, { useMemo, useState } from 'react';
import { Anime, Book, Movie, Series } from '../../types';

import { TorrentStreamDashboard } from '../../src/components/TorrentStreamDashboard';
import { MediaCard } from './MediaCard';
import { VideoPlayer } from './VideoPlayer';


interface MediaMainContentProps {
  activeSubModuleKey: string | null;
  anime: Anime[];
  books: Book[];
  movies: Movie[];
  series: Series[];
  searchQuery: string;
  bookPage: number;
  setBookPage: (page: number) => void;
  moviePage: number;
  setMoviePage: (page: number) => void;
  isLoading: boolean;
}

export const MediaMainContent: React.FC<MediaMainContentProps> = ({
  activeSubModuleKey,
  anime,
  books,
  movies,
  series,
  searchQuery,
  bookPage,
  setBookPage,
  moviePage,
  setMoviePage,
  isLoading,
}) => {
  const [playingItem, setPlayingItem] = useState<{ url: string; title: string } | null>(null);
  const [iptvChannels, setIptvChannels] = useState<any[]>([]);
  const [favoriteChannels, setFavoriteChannels] = useState<string[]>([]);
  const [activeTvFilter, setActiveTvFilter] = useState<'All Channels' | 'Favorites' | 'By Type' | 'By Country'>('All Channels');
  const [selectedChannelType, setSelectedChannelType] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleFavoriteToggle = (channelId: string) => {
    setFavoriteChannels(prev =>
      prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId]
    );
  };

  const [channelTypes, setChannelTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  React.useEffect(() => {
    if (activeSubModuleKey === 'media-tv') {
      fetch('/Stream.m3u8')
        .then(response => response.text())
          .then(data => {
            const channels = data.split('#EXTINF:-1').slice(1).map(channel => {
              const lines = channel.split(/\r?\n/);
              const titleMatch = lines[0].match(/,(.*)/);
              const title = titleMatch ? titleMatch[1] : 'Untitled Channel';
              const groupTitleMatch = lines[0].match(/group-title=\"(.*?)\"/);
              const groupTitle = groupTitleMatch ? groupTitleMatch[1] : 'Uncategorized';
              const originalUrl = lines.find(line => line && line.startsWith('http'));
              if (title && originalUrl) {
                let proxiedUrl = originalUrl;
                if (originalUrl.startsWith('https://vo-live-media.cdb.cdn.orange.com')) {
                  proxiedUrl = originalUrl.replace('https://vo-live-media.cdb.cdn.orange.com', '/proxy_vo');
                }
                return { id: originalUrl, name: title, url: proxiedUrl, type: groupTitle, country: 'Unknown' }; // Assuming country for now
              }
              return null;
            }).filter((c): c is NonNullable<typeof c> => c !== null);
            setIptvChannels(channels as any[]);
            const types = [...new Set(channels.map(c => c.type))];
            const countries = [...new Set(channels.map(c => c.country))];
            setChannelTypes(types as string[]);
            setCountries(countries as string[]);
          })
          .catch(error => console.error('Error fetching IPTV:', error));
      }
    }, [activeSubModuleKey]);

  // UI for TV filter controls
  const renderTvFilterControls = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        className="bg-slate-800 text-white px-3 py-2 rounded"
        value={activeTvFilter}
        onChange={e => {
          setActiveTvFilter(e.target.value as any);
          setSelectedChannelType('');
          setSelectedCountry('');
        }}
      >
        <option value="All Channels">All Channels</option>
        <option value="Favorites">Favorites</option>
        <option value="By Type">By Type</option>
        <option value="By Country">By Country</option>
      </select>
      {activeTvFilter === 'By Type' && (
        <select
          className="bg-slate-700 text-white px-3 py-2 rounded"
          value={selectedChannelType}
          onChange={e => setSelectedChannelType(e.target.value)}
        >
          <option value="">All Types</option>
          {channelTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      )}
      {activeTvFilter === 'By Country' && (
        <select
          className="bg-slate-700 text-white px-3 py-2 rounded"
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      )}
    </div>
  );

  const filteredData = useMemo(() => {
    let data: any[] = [];
    switch (activeSubModuleKey) {
      case 'media-movies':
        data = movies;
        break;
      case 'media-series':
        data = series;
        break;
      case 'media-documentaries':
        data = movies.filter(movie => movie.description?.toLowerCase().includes('documentary') || movie.title?.toLowerCase().includes('documentary'));
        break;
      case 'media-anime':
        data = anime;
        break;
      case 'media-books':
        data = books;
        break;
      case 'media-tv':
        if (activeTvFilter === 'Favorites') {
          data = iptvChannels.filter(c => favoriteChannels.includes(c.id));
        } else if (activeTvFilter === 'By Type') {
          data = selectedChannelType ? iptvChannels.filter(c => c.type === selectedChannelType) : iptvChannels;
        } else if (activeTvFilter === 'By Country') {
          data = selectedCountry ? iptvChannels.filter(c => c.country === selectedCountry) : iptvChannels;
        } else {
          data = iptvChannels;
        }
        break;
      case 'media-torrent':
        data = [];
        break;
    }
    return data.filter(item => {
      const itemTitle = item.title ?? item.name ?? '';
      return itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeSubModuleKey, movies, series, anime, books, searchQuery, iptvChannels, favoriteChannels, activeTvFilter, selectedChannelType, selectedCountry]);

  if (playingItem) {
    return (
      <div className="p-6">
        <button onClick={() => setPlayingItem(null)} className="mb-4 bg-red-600 text-white px-4 py-2 rounded-lg">
          Back to list
        </button>
        <VideoPlayer url={playingItem.url} title={playingItem.title} />
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p className="text-slate-400">Loading...</p></div>;
    }

    if (filteredData.length === 0 && activeSubModuleKey) {
      return (
        <div className="flex justify-center items-center h-full">
          <p className="text-slate-400">No content found for this category.</p>
        </div>
      );
    }

    if (!activeSubModuleKey) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Select a media category</h2>
          <p className="text-slate-400">Choose a category from the header menu to start streaming.</p>
        </div>
      );
    }

    // Special handling for torrent streaming
    if (activeSubModuleKey === 'media-torrent') {
      return <TorrentStreamDashboard />;
    }

    return (
      <>
        {activeSubModuleKey === 'media-tv' && renderTvFilterControls()}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredData.map((item, index) => {
            let imageUrl = '';
            let itemTitle = '';
            let itemDescription = '';
            let playUrl: string | undefined = undefined;
            let mediaPlayUrl: string | undefined = undefined;
            let cardType: 'poster' | 'default' = 'default';
            let mediaType: 'movie' | 'series' | 'anime' | 'book' | undefined = undefined;

            switch (activeSubModuleKey) {
              case 'media-movies':
              case 'media-documentaries':
                imageUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                itemTitle = item.title;
                itemDescription = item.overview;
                cardType = 'poster';
                mediaType = 'movie';
mediaPlayUrl = `https://vidsrc.to/embed/movie/${item.id}`;
                break;
              case 'media-series':
                imageUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                itemTitle = item.name;
                itemDescription = item.overview;
                cardType = 'poster';
                mediaType = 'series';
                mediaPlayUrl = `https://vidsrc.to/embed/tv/${item.id}`;
                break;
              case 'media-anime':
                imageUrl = item.images.jpg.image_url;
                itemTitle = item.title;
                itemDescription = item.synopsis;
                playUrl = item.trailer?.url;
                break;
              case 'media-books':
                imageUrl = item.formats['image/jpeg'];
                itemTitle = item.title;
                itemDescription = item.authors.map((author: any) => author.name).join(', ');
                break;
              case 'media-tv':
                itemTitle = item.name;
                mediaPlayUrl = item.url;
                imageUrl = `https://placehold.co/500x750/000000/FFFFFF/png?text=${encodeURIComponent(itemTitle)}`;
                cardType = 'poster';
                mediaType = 'movie'; // Treat as movie for the play button text
                const isFavorite = favoriteChannels.includes(item.id);
                return (
                  <div className="relative" key={item.id || index}>
                    <MediaCard
                      imageUrl={imageUrl}
                      title={itemTitle}
                      description={itemDescription}
                      playUrl={playUrl}
                      onPlay={() => playUrl && setPlayingItem({ url: playUrl, title: itemTitle })}
                      onPlayMedia={() => mediaPlayUrl && setPlayingItem({ url: mediaPlayUrl, title: itemTitle })}
                      cardType={cardType}
                      mediaType={mediaType}
                    />
                    <button onClick={() => handleFavoriteToggle(item.id)} className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-red-500' : 'bg-gray-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                );
                break;
            }

            return (
              <MediaCard
                key={item.id ? `${item.id}-${index}` : `media-item-${index}`}
                imageUrl={imageUrl}
                title={itemTitle}
                description={itemDescription}
                playUrl={playUrl}
                onPlay={() => playUrl && setPlayingItem({ url: playUrl, title: itemTitle })}
                onPlayMedia={() => mediaPlayUrl && setPlayingItem({ url: mediaPlayUrl, title: itemTitle })}
                cardType={cardType}
                mediaType={mediaType}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 space-y-6 h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-100">
          {activeSubModuleKey ? activeSubModuleKey.replace('media-', '').replace('-', ' ') : 'Media'}
        </h2>
        {renderContent()}
        {activeSubModuleKey === 'media-books' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setBookPage(bookPage + 1)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
            >
              Load More
            </button>
          </div>
        )}
        {activeSubModuleKey === 'media-movies' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setMoviePage(moviePage + 1)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
