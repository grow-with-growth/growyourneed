# Free APIs Documentation

This document lists all the **completely free, open-source, unlimited APIs** integrated into the Grow Your Need project. **No subscriptions, no API keys required** for basic usage.

## 🎬 Movies & TV Shows

### 1. OMDb API (Open Movie Database)
- **URL**: `http://www.omdbapi.com/`
- **Free Tier**: 1,000 requests/day (no API key needed)
- **Features**: Movie/TV show details, ratings, cast, plot
- **Usage**: `http://www.omdbapi.com/?t=movie_title&y=year`
- **Implementation**: `services/movieService.ts`, `services/seriesService.ts`

### 2. TVMaze API
- **URL**: `https://api.tvmaze.com`
- **Features**: Complete TV series database, completely free
- **Rate Limit**: No official limit
- **Usage**: `https://api.tvmaze.com/shows`
- **Implementation**: `services/seriesService.ts`

### 3. Archive.org Movies
- **URL**: `https://archive.org/advancedsearch.php`
- **Features**: Public domain movies, completely free
- **Usage**: Search and stream classic movies
- **Implementation**: `services/movieService.ts`

## 🎌 Anime

### 1. Jikan API (MyAnimeList)
- **URL**: `https://api.jikan.moe/v4/`
- **Features**: Complete anime/manga database, no API key required
- **Rate Limit**: 3 requests/second, 60 requests/minute
- **Usage**: `https://api.jikan.moe/v4/anime/{id}`
- **Implementation**: `services/animeService.ts`

### 2. AnimeChan API
- **URL**: `https://animechan.vercel.app/api`
- **Features**: 10,000+ anime quotes, completely free
- **Usage**: `https://animechan.vercel.app/api/random`
- **Implementation**: `services/animeService.ts`

## 📺 Live TV & IPTV

### 1. IPTV-Org (GitHub)
- **URL**: `https://github.com/iptv-org/iptv`
- **Features**: 8,000+ free live TV channels worldwide
- **M3U Playlists**:
  - All channels: `https://iptv-org.github.io/iptv/index.m3u`
  - By country: `https://iptv-org.github.io/iptv/countries/{country_code}.m3u`
  - By category: `https://iptv-org.github.io/iptv/categories/{category}.m3u`
- **Implementation**: `services/iptvService.ts`

### 2. Free-TV IPTV
- **URL**: `https://github.com/Free-TV/IPTV`
- **Features**: Curated free TV channels
- **M3U**: `https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8`
- **Implementation**: `services/iptvService.ts`

## 📚 Books

### 1. Project Gutenberg API (Gutendex)
- **URL**: `https://gutendex.com/`
- **Features**: 70,000+ free ebooks, no API key required
- **Usage**: `https://gutendex.com/books/`
- **Implementation**: `services/bookService.ts`

### 2. Open Library API
- **URL**: `https://openlibrary.org/developers/api`
- **Features**: Millions of books, completely free
- **Usage**: `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}`
- **Implementation**: `services/bookService.ts`

## 📰 News

### 1. RSS Feeds (Multiple Sources)
- **Sources**: BBC, CNN, Reuters, AP, NPR, Al Jazeera, TechCrunch, etc.
- **Converter**: RSS2JSON API (`https://api.rss2json.com/v1/api.json`)
- **Features**: Latest news from major sources
- **Implementation**: `services/newsService.ts`

### 2. Hacker News API
- **URL**: `https://hacker-news.firebaseio.com/v0/`
- **Features**: Tech news, completely free
- **Usage**: `https://hacker-news.firebaseio.com/v0/topstories.json`
- **Implementation**: `services/newsService.ts`

### 3. Reddit API
- **URL**: `https://www.reddit.com/r/{subreddit}/hot.json`
- **Features**: News from various subreddits
- **Usage**: No API key required for public posts
- **Implementation**: `services/newsService.ts`

## 🎮 Games

### 1. RAWG API
- **URL**: `https://api.rawg.io/api`
- **Free Tier**: 20,000 requests/month (no API key for basic usage)
- **Features**: 500,000+ games database
- **Usage**: `https://api.rawg.io/api/games`
- **Implementation**: `services/gamesService.ts`

### 2. FreeToGame API
- **URL**: `https://www.freetogame.com/api`
- **Features**: Free-to-play games database, completely free
- **Usage**: `https://www.freetogame.com/api/games`
- **Implementation**: `services/gamesService.ts`

## 🌐 Additional Free Services

### 1. Free Streaming Embeds
- **VidSrc**: `https://vidsrc.to/embed/movie/{imdb_id}`
- **Features**: Free movie/TV streaming embeds
- **Usage**: Embedded in movie and series cards

### 2. Placeholder Images
- **Via Placeholder**: `https://via.placeholder.com/`
- **Features**: Dynamic placeholder images
- **Usage**: Fallback for missing posters/thumbnails

### 3. Image Services
- **Archive.org Images**: `https://archive.org/services/img/{identifier}`
- **Open Library Covers**: `https://covers.openlibrary.org/b/id/{cover_id}-L.jpg`
- **TMDB Images**: `https://image.tmdb.org/t/p/w500{poster_path}` (when available)

## 🔧 Implementation Details

### Rate Limiting
- **Jikan API**: 3 requests/second implemented in `animeService.ts`
- **OMDb API**: 1,000 requests/day limit
- **Other APIs**: No strict limits, but respectful usage implemented

### Error Handling
- All services include comprehensive error handling
- Fallback data and graceful degradation
- Console logging for debugging

### Caching Strategy
- Client-side caching for repeated requests
- Pagination support for large datasets
- Efficient data fetching with Promise.all()

## 🚀 Usage Examples

### Movies
```typescript
import { getMovies, searchMovies } from './services/movieService';

// Get popular movies
const movies = await getMovies();

// Search for specific movies
const searchResults = await searchMovies('Inception');
```

### Anime
```typescript
import { getTopAnime, searchAnime } from './services/animeService';

// Get top anime
const topAnime = await getTopAnime(25);

// Search anime
const animeResults = await searchAnime('Naruto');
```

### Live TV
```typescript
import { fetchIPTVChannels, fetchIPTVChannelsByCountry } from './services/iptvService';

// Get all channels
const allChannels = await fetchIPTVChannels();

// Get US channels only
const usChannels = await fetchIPTVChannelsByCountry('us');
```

### Books
```typescript
import { getBooks, searchBooks } from './services/bookService';

// Get popular books
const books = await getBooks(1, 32);

// Search books
const bookResults = await searchBooks('Shakespeare');
```

## 📊 API Limits Summary

| API | Daily Limit | Rate Limit | API Key Required |
|-----|-------------|------------|------------------|
| OMDb | 1,000 requests | None | No |
| Jikan | Unlimited | 3/second | No |
| TVMaze | Unlimited | None | No |
| IPTV-Org | Unlimited | None | No |
| Gutenberg | Unlimited | None | No |
| Open Library | Unlimited | None | No |
| RAWG | 20,000/month | None | No |
| FreeToGame | Unlimited | None | No |
| RSS Feeds | Unlimited | None | No |
| Hacker News | Unlimited | None | No |
| Reddit | Unlimited | None | No |

## 🔒 Privacy & Terms

All integrated APIs are:
- ✅ **Free to use** for personal and commercial projects
- ✅ **No registration required** for basic usage
- ✅ **Open source** or publicly available
- ✅ **No personal data collection** by our implementation
- ✅ **Respectful usage** with proper rate limiting

## 🆕 Adding New Free APIs

To add new free APIs:

1. Create a new service file in `services/`
2. Implement proper error handling and rate limiting
3. Add TypeScript interfaces in `types.ts`
4. Update this documentation
5. Test thoroughly with the free tier limits

## 🤝 Contributing

Found more free APIs? Please contribute by:
1. Verifying the API is truly free and unlimited
2. Implementing proper service integration
3. Adding comprehensive documentation
4. Testing with real usage scenarios
