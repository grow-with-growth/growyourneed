import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, StarIcon, ComputerDesktopIcon } from '../icons';

interface MediaHubWidgetProps {
  compact?: boolean;
  userRole?: string;
}

interface MediaContent {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'documentary' | 'educational' | 'live-tv';
  thumbnail: string;
  duration?: string;
  rating?: number;
  category: string;
  description: string;
  url?: string;
}

export const MediaHubWidget: React.FC<MediaHubWidgetProps> = ({ compact = false, userRole = 'admin' }) => {
  const [selectedCategory, setSelectedCategory] = useState('educational');
  const [featuredContent, setFeaturedContent] = useState<MediaContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock educational content data
  const mockEducationalContent: MediaContent[] = [
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      type: 'educational',
      thumbnail: 'https://picsum.photos/seed/math/300/200',
      duration: '45 min',
      rating: 4.8,
      category: 'Mathematics',
      description: 'Comprehensive guide to mathematical concepts for students',
      url: 'https://example.com/math-video'
    },
    {
      id: '2',
      title: 'Science Experiments',
      type: 'educational',
      thumbnail: 'https://picsum.photos/seed/science/300/200',
      duration: '30 min',
      rating: 4.6,
      category: 'Science',
      description: 'Interactive science experiments for classroom learning',
      url: 'https://example.com/science-video'
    },
    {
      id: '3',
      title: 'History Documentary',
      type: 'documentary',
      thumbnail: 'https://picsum.photos/seed/history/300/200',
      duration: '60 min',
      rating: 4.9,
      category: 'History',
      description: 'Exploring ancient civilizations and their impact',
      url: 'https://example.com/history-doc'
    },
    {
      id: '4',
      title: 'Educational News',
      type: 'live-tv',
      thumbnail: 'https://picsum.photos/seed/news/300/200',
      duration: 'Live',
      rating: 4.5,
      category: 'News',
      description: 'Live educational news and current events',
      url: 'https://example.com/live-news'
    }
  ];

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeaturedContent(mockEducationalContent);
      setIsLoading(false);
    };

    loadContent();
  }, [selectedCategory]);

  const categories = [
    { id: 'educational', label: 'Educational', icon: ComputerDesktopIcon, color: 'text-blue-400' },
    { id: 'documentary', label: 'Documentaries', icon: VideoCameraIcon, color: 'text-green-400' },
    { id: 'live-tv', label: 'Live TV', icon: StarIcon, color: 'text-red-400' },
    { id: 'entertainment', label: 'Entertainment', icon: VideoCameraIcon, color: 'text-purple-400' }
  ];

  const getContentByCategory = () => {
    return featuredContent.filter(content => 
      selectedCategory === 'educational' ? content.type === 'educational' :
      selectedCategory === 'documentary' ? content.type === 'documentary' :
      selectedCategory === 'live-tv' ? content.type === 'live-tv' :
      content.type === 'movie' || content.type === 'series'
    );
  };

  const MediaCard = ({ content }: { content: MediaContent }) => (
    <div className="bg-slate-700/30 rounded-lg overflow-hidden hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
      <div className="relative">
        <img 
          src={content.thumbnail} 
          alt={content.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {content.duration}
        </div>
        {content.rating && (
          <div className="absolute bottom-2 left-2 flex items-center space-x-1">
            <StarIcon className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs">{content.rating}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-slate-200 text-sm line-clamp-1">{content.title}</h4>
        <p className="text-slate-400 text-xs mt-1">{content.category}</p>
        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{content.description}</p>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-200">Media Hub</h3>
          <VideoCameraIcon className="w-5 h-5 text-pink-400" />
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {featuredContent.slice(0, 2).map(content => (
              <div key={content.id} className="text-center p-2 bg-slate-700/30 rounded">
                <div className="text-sm font-medium text-slate-200">{content.title}</div>
                <div className="text-xs text-slate-400">{content.category}</div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm transition-colors">
            Browse All Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Media Hub</h2>
          <p className="text-slate-400 text-sm">Educational content, documentaries, and live TV</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Role:</span>
          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded capitalize">
            {userRole}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-700/30 rounded-lg p-1">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.id 
                ? 'bg-pink-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getContentByCategory().map(content => (
            <MediaCard key={content.id} content={content} />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">150+</div>
            <div className="text-slate-400 text-sm">Educational Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">50+</div>
            <div className="text-slate-400 text-sm">Documentaries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">25+</div>
            <div className="text-slate-400 text-sm">Live Channels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">4.7</div>
            <div className="text-slate-400 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <VideoCameraIcon className="w-5 h-5 text-blue-400" />
          <span className="text-slate-200 text-sm">Upload Content</span>
        </button>
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <ComputerDesktopIcon className="w-5 h-5 text-green-400" />
          <span className="text-slate-200 text-sm">Manage Playlists</span>
        </button>
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <StarIcon className="w-5 h-5 text-purple-400" />
          <span className="text-slate-200 text-sm">View Analytics</span>
        </button>
      </div>
    </div>
  );
};
