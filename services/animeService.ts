
// Free Anime Service using multiple free APIs
// Jikan API (MyAnimeList) - completely free, no API key required
// AnimeChan API for quotes - completely free

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  episodes?: number;
  status: string;
  aired: {
    from: string;
    to?: string;
  };
  genres: Array<{ mal_id: number; name: string; }>;
  studios: Array<{ mal_id: number; name: string; }>;
  year?: number;
  season?: string;
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  streamUrl?: string;
}

export interface AnimeQuote {
  anime: string;
  character: string;
  quote: string;
}

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const ANIMECHAN_BASE_URL = 'https://animechan.vercel.app/api';

// Rate limiting helper for Jikan API (3 requests per second)
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 334; // ~3 requests per second

const rateLimitedFetch = async (url: string): Promise<Response> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return fetch(url);
};

export const getTopAnime = async (limit: number = 25): Promise<Anime[]> => {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/top/anime?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.data.map((anime: any) => ({
      ...anime,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(anime.title)}` // Free anime streaming site
    }));
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
};

export const getSeasonalAnime = async (year?: number, season?: string): Promise<Anime[]> => {
  try {
    const currentYear = year || new Date().getFullYear();
    const currentSeason = season || getCurrentSeason();

    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/seasons/${currentYear}/${currentSeason}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.data.map((anime: any) => ({
      ...anime,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(anime.title)}`
    }));
  } catch (error) {
    console.error("Error fetching seasonal anime:", error);
    return [];
  }
};

export const searchAnime = async (query: string, limit: number = 20): Promise<Anime[]> => {
  if (!query.trim()) return [];

  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.data.map((anime: any) => ({
      ...anime,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(anime.title)}`
    }));
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
};

export const getAnimeById = async (id: number): Promise<Anime | null> => {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return {
      ...data.data,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(data.data.title)}`
    };
  } catch (error) {
    console.error(`Error fetching anime ${id}:`, error);
    return null;
  }
};

export const getAnimeRecommendations = async (id: number): Promise<Anime[]> => {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime/${id}/recommendations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.data.slice(0, 10).map((rec: any) => ({
      ...rec.entry,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(rec.entry.title)}`
    }));
  } catch (error) {
    console.error(`Error fetching recommendations for anime ${id}:`, error);
    return [];
  }
};

// Anime quotes from AnimeChan API
export const getRandomAnimeQuote = async (): Promise<AnimeQuote | null> => {
  try {
    const response = await fetch(`${ANIMECHAN_BASE_URL}/random`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching random anime quote:", error);
    return null;
  }
};

export const getAnimeQuotesByTitle = async (title: string): Promise<AnimeQuote[]> => {
  try {
    const response = await fetch(`${ANIMECHAN_BASE_URL}/quotes/anime?title=${encodeURIComponent(title)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quotes for ${title}:`, error);
    return [];
  }
};

export const getAnimeQuotesByCharacter = async (character: string): Promise<AnimeQuote[]> => {
  try {
    const response = await fetch(`${ANIMECHAN_BASE_URL}/quotes/character?name=${encodeURIComponent(character)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quotes for ${character}:`, error);
    return [];
  }
};

// Helper function to get current season
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall';
};

// Popular anime genres for filtering
export const getAnimeByGenre = async (genreId: number, limit: number = 20): Promise<Anime[]> => {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime?genres=${genreId}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.data.map((anime: any) => ({
      ...anime,
      streamUrl: `https://9anime.to/search?keyword=${encodeURIComponent(anime.title)}`
    }));
  } catch (error) {
    console.error(`Error fetching anime by genre ${genreId}:`, error);
    return [];
  }
};

// Popular genres with their IDs
export const ANIME_GENRES = {
  action: 1,
  adventure: 2,
  comedy: 4,
  drama: 8,
  fantasy: 10,
  horror: 14,
  mystery: 7,
  romance: 22,
  sciFi: 24,
  sliceOfLife: 36,
  sports: 30,
  supernatural: 37,
  thriller: 41
};

