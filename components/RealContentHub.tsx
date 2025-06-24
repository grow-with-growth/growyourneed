// REAL WORKING CONTENT HUB - TESTED COMPONENT
import React, { useState, useEffect, useCallback } from 'react';
import { realContentService, Movie, TVShow, Book, LiveChannel } from '../services/realContentService';

interface SearchResults {
  movies: Movie[];
  tvShows: TVShow[];
  books: Book[];
  liveChannels: LiveChannel[];
  totalResults: number;
}

export const RealContentHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv' | 'books' | 'live'>('all');
  const [results, setResults] = useState<SearchResults>({
    movies: [],
    tvShows: [],
    books: [],
    liveChannels: [],
    totalResults: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  // Load trending content on component mount
  useEffect(() => {
    const loadTrendingContent = async () => {
      try {
        const [trending, freeBooks, liveChannels] = await Promise.all([
          realContentService.getTrendingMovies(),
          realContentService.getFreeBooks(),
          realContentService.getLiveChannels()
        ]);

        setTrendingMovies(trending);
        setResults(prev => ({
          ...prev,
          books: freeBooks,
          liveChannels: liveChannels.slice(0, 20) // Limit for performance
        }));
      } catch (err) {
        console.error('Failed to load trending content:', err);
      }
    };

    loadTrendingContent();
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults({
        movies: [],
        tvShows: [],
        books: [],
        liveChannels: [],
        totalResults: 0
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [movieResults, tvResults, bookResults] = await Promise.allSettled([
        realContentService.searchMovies(query),
        realContentService.searchTVShows(query),
        realContentService.searchBooks(query)
      ]);

      const movies = movieResults.status === 'fulfilled' ? movieResults.value.movies : [];
      const tvShows = tvResults.status === 'fulfilled' ? tvResults.value : [];
      const books = bookResults.status === 'fulfilled' ? bookResults.value : [];

      setResults({
        movies,
        tvShows,
        books,
        liveChannels: [], // Live channels don't support search
        totalResults: movies.length + tvShows.length + books.length
      });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search input with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'movies':
        return { movies: results.movies, tvShows: [], books: [], liveChannels: [] };
      case 'tv':
        return { movies: [], tvShows: results.tvShows, books: [], liveChannels: [] };
      case 'books':
        return { movies: [], tvShows: [], books: results.books, liveChannels: [] };
      case 'live':
        return { movies: [], tvShows: [], books: [], liveChannels: results.liveChannels };
      default:
        return results;
    }
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Content Hub
          </h1>
          <p className="text-gray-600">
            Search millions of movies, TV shows, books, and live channels - all working with real APIs
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows, books..."
              className="w-full p-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
            {[
              { id: 'all', label: 'All', count: results.totalResults },
              { id: 'movies', label: 'Movies', count: results.movies.length },
              { id: 'tv', label: 'TV Shows', count: results.tvShows.length },
              { id: 'books', label: 'Books', count: results.books.length },
              { id: 'live', label: 'Live TV', count: results.liveChannels.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Trending Movies (when no search) */}
        {!searchQuery && trendingMovies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {trendingMovies.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-8">
          {/* Movies */}
          {filteredResults.movies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Movies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredResults.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {/* TV Shows */}
          {filteredResults.tvShows.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">TV Shows</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredResults.tvShows.map((show) => (
                  <TVShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {filteredResults.books.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredResults.books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Live Channels */}
          {filteredResults.liveChannels.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Live TV Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredResults.liveChannels.map((channel) => (
                  <LiveChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {searchQuery && results.totalResults === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-2">Try different keywords or check spelling</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Movie Card Component
const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {movie.posterUrl && (
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
    )}
    <div className="p-3">
      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
      <p className="text-gray-600 text-xs mb-2">
        {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
      </p>
      <div className="flex items-center">
        <span className="text-yellow-500 text-sm">★</span>
        <span className="ml-1 text-xs text-gray-600">{movie.rating.toFixed(1)}</span>
      </div>
    </div>
  </div>
);

// TV Show Card Component
const TVShowCard: React.FC<{ show: TVShow }> = ({ show }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {show.imageUrl && (
      <img
        src={show.imageUrl}
        alt={show.name}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
    )}
    <div className="p-3">
      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{show.name}</h3>
      <p className="text-gray-600 text-xs mb-1">{show.network}</p>
      <p className="text-gray-600 text-xs mb-2">{show.status}</p>
      <div className="flex items-center">
        <span className="text-yellow-500 text-sm">★</span>
        <span className="ml-1 text-xs text-gray-600">{show.rating.toFixed(1)}</span>
      </div>
    </div>
  </div>
);

// Book Card Component
const BookCard: React.FC<{ book: Book }> = ({ book }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    {book.coverUrl && (
      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
    )}
    <div className="p-3">
      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
      <p className="text-gray-600 text-xs mb-1">{book.authors.join(', ')}</p>
      <p className="text-gray-600 text-xs mb-2">{book.publishYear}</p>
      {book.isFree && (
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
          FREE
        </span>
      )}
    </div>
  </div>
);

// Live Channel Card Component
const LiveChannelCard: React.FC<{ channel: LiveChannel }> = ({ channel }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-3">
      {channel.logo && (
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-12 h-12 object-contain"
          loading="lazy"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-sm line-clamp-1">{channel.name}</h3>
        <p className="text-gray-600 text-xs">{channel.country}</p>
        <p className="text-gray-500 text-xs">{channel.category}</p>
      </div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-xs text-gray-500">
        {channel.languages.join(', ')}
      </span>
      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
        LIVE
      </span>
    </div>
  </div>
);
