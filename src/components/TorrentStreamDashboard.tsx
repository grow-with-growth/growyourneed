// REAL TORRENT STREAMING DASHBOARD - Browser WebTorrent Implementation
import React, { useEffect, useRef, useState } from 'react';
import { ChartBarIcon, ChatBubbleLeftEllipsisIcon, StarIcon, UsersIcon, VideoCameraIcon } from '../../components/icons';

// WebTorrent client for browser
declare global {
  interface Window {
    WebTorrent: any;
  }
}

interface TorrentContent {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  language: string;
  poster: string;
  summary: string;
  type: 'movie' | 'tv' | 'anime' | 'documentary';
  magnet?: string;
  hash?: string;
  seeders?: number;
  size?: string;
  quality?: string;
}

interface StreamingSession {
  torrent: any;
  file: any;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
}

export const TorrentStreamDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<'all' | 'movie' | 'tv' | 'anime' | 'documentary'>('all');
  const [content, setContent] = useState<TorrentContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState<StreamingSession | null>(null);
  const [selectedContent, setSelectedContent] = useState<TorrentContent | null>(null);
  const [webTorrentReady, setWebTorrentReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<any>(null);

  // Initialize WebTorrent client
  useEffect(() => {
    const initWebTorrent = () => {
      if (window.WebTorrent) {
        clientRef.current = new window.WebTorrent();
        setWebTorrentReady(true);
        console.log('🚀 WebTorrent client initialized');
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js';
        script.onload = () => {
          clientRef.current = new window.WebTorrent();
          setWebTorrentReady(true);
          console.log('🚀 WebTorrent client loaded and initialized');
        };
        script.onerror = () => {
          console.error('❌ Failed to load WebTorrent');
        };
        document.head.appendChild(script);
      }
    };

    initWebTorrent();

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, []);

  // REAL TORRENT CRAWLERS - Working APIs
  const crawlContent = async (query: string, type: string): Promise<TorrentContent[]> => {
    const results: TorrentContent[] = [];

    try {
      // YTS Movies API - REAL WORKING
      if (type === 'all' || type === 'movie') {
        const ytsResponse = await fetch(
          `https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(query)}&limit=20&sort_by=download_count`
        );
        const ytsData = await ytsResponse.json();
        
        if (ytsData.data?.movies) {
          ytsData.data.movies.forEach((movie: any) => {
            const bestTorrent = movie.torrents?.find((t: any) => t.quality === '1080p') ?? movie.torrents?.[0];
            if (bestTorrent) {
              results.push({
                id: `yts_${movie.id}`,
                title: movie.title_english ?? movie.title,
                year: movie.year,
                rating: movie.rating,
                genres: movie.genres ?? [],
                language: movie.language ?? 'en',
                poster: movie.large_cover_image ?? movie.medium_cover_image,
                summary: movie.summary ?? '',
                type: 'movie',
                hash: bestTorrent.hash,
                magnet: `magnet:?xt=urn:btih:${bestTorrent.hash}&dn=${encodeURIComponent(movie.title)}&tr=udp://open.demonii.com:1337&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce`,
                seeders: bestTorrent.seeds,
                size: bestTorrent.size,
                quality: bestTorrent.quality
              });
            }
          });
        }
      }

      // Add more crawlers for TV, Anime, etc.
      if (type === 'all' || type === 'anime') {
        // Nyaa.si for anime (would implement similar pattern)
        // results.push(...animeResults);
      }

    } catch (error) {
      console.error('Crawl error:', error);
    }

    return results;
  };

  // Search content
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await crawlContent(searchQuery, contentType);
      setContent(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load trending content
  const loadTrending = async () => {
    setLoading(true);
    try {
      const results = await crawlContent('', 'movie'); // Get popular movies
      setContent(results.slice(0, 20));
    } catch (error) {
      console.error('Failed to load trending:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stream torrent directly in browser
  const streamContent = async (item: TorrentContent) => {
    if (!clientRef.current || !item.magnet) {
      console.error('WebTorrent not ready or no magnet link');
      return;
    }

    setSelectedContent(item);
    console.log('🎬 Starting stream:', item.title);

    try {
      const torrent = clientRef.current.add(item.magnet, {
        path: '/tmp/webtorrent' // Browser storage
      });

      torrent.on('ready', () => {
        console.log('✅ Torrent ready, finding video file...');
        
        // Find the largest video file
        const videoFile = torrent.files.find((file: any) => {
          const ext = file.name.split('.').pop()?.toLowerCase();
          return ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext ?? '');
        }) ?? torrent.files.reduce((largest: any, file: any) => 
          file.length > largest.length ? file : largest
        );

        if (videoFile && videoRef.current) {
          console.log(`🎥 Streaming: ${videoFile.name}`);
          
          // Create blob URL for video
          videoFile.getBlobURL((err: any, url: string) => {
            if (err) {
              console.error('Failed to get blob URL:', err);
              return;
            }
            
            if (videoRef.current) {
              videoRef.current.src = url;
              videoRef.current.play();
            }
          });

          setStreaming({
            torrent,
            file: videoFile,
            progress: 0,
            downloadSpeed: 0,
            uploadSpeed: 0
          });
        }
      });

      torrent.on('download', () => {
        if (streaming) {
          setStreaming(prev => prev ? {
            ...prev,
            progress: torrent.progress,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed
          } : null);
        }
      });

      torrent.on('error', (err: any) => {
        console.error('Torrent error:', err);
        setStreaming(null);
      });

    } catch (error) {
      console.error('Stream error:', error);
    }
  };

  // Stop streaming
  const stopStreaming = () => {
    if (streaming?.torrent) {
      streaming.torrent.destroy();
    }
    setStreaming(null);
    setSelectedContent(null);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  // Load trending on mount
  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span>🎬 Torrent Stream Cinema</span>
            <span className="text-sm bg-green-600 px-2 py-1 rounded">LIVE</span>
          </h1>
          <p className="text-gray-400">
            Direct torrent streaming • No downloads • WebTorrent + Browser
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <ChartBarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search movies, TV shows, anime..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!webTorrentReady}
            />
          </div>
          
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
            <option value="anime">Anime</option>
            <option value="documentary">Documentaries</option>
          </select>
          
          <button
            onClick={handleSearch}
            disabled={loading || !webTorrentReady}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Video Player */}
        {selectedContent && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedContent.title}</h2>
              <button
                onClick={stopStreaming}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Stop Stream
              </button>
            </div>
            
            <video
              ref={videoRef}
              controls
              className="w-full h-96 bg-black rounded-lg"
              poster={selectedContent.poster}
            >
              <track kind="captions" />
              Your browser does not support video playback.
            </video>
            
            {streaming && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Progress:</span>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${streaming.progress * 100}%` }}
                    />
                  </div>
                  <span className="text-blue-400">{(streaming.progress * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Download:</span>
                  <span className="text-green-400 ml-2">
                    {(streaming.downloadSpeed / 1024 / 1024).toFixed(1)} MB/s
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Upload:</span>
                  <span className="text-yellow-400 ml-2">
                    {(streaming.uploadSpeed / 1024 / 1024).toFixed(1)} MB/s
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {content.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer w-full text-left"
              onClick={() => streamContent(item)}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && streamContent(item)}
            >
              <div className="relative">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
                  {item.quality ?? 'HD'}
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <VideoCameraIcon className="w-3 h-3" />
                  Stream
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{item.title}</h3>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{item.year}</span>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{item.type}</span>
                  {item.seeders && (
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-3 h-3" />
                      <span>{item.seeders}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {item.genres.slice(0, 2).join(', ')}
                </div>
                
                {item.size && (
                  <div className="mt-1 text-xs text-blue-400">
                    {item.size}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Crawling torrents...</p>
          </div>
        )}

        {content.length === 0 && !loading && (
          <div className="text-center py-12">
            <ChatBubbleLeftEllipsisIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No content found. Try searching for movies or TV shows.</p>
          </div>
        )}
      </div>
    </div>
  );
};
