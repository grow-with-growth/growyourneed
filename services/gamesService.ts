// Free Games Service using multiple free APIs
// RAWG API (500,000+ games) - free tier available
// FreeToGame API - completely free

export interface Game {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  released?: string;
  background_image?: string;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  metacritic?: number;
  platforms?: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stores?: Array<{
    store: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  developers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  publishers?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  esrb_rating?: {
    id: number;
    name: string;
    slug: string;
  };
  short_screenshots?: Array<{
    id: number;
    image: string;
  }>;
  // Free-to-play specific fields
  game_url?: string;
  freetogame_profile_url?: string;
  minimum_system_requirements?: {
    os?: string;
    processor?: string;
    memory?: string;
    graphics?: string;
    storage?: string;
  };
}

export interface FreeGame {
  id: number;
  title: string;
  thumbnail: string;
  status: string;
  short_description: string;
  description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
  minimum_system_requirements?: {
    os?: string;
    processor?: string;
    memory?: string;
    graphics?: string;
    storage?: string;
  };
  screenshots?: Array<{
    id: number;
    image: string;
  }>;
}

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const FREETOGAME_BASE_URL = 'https://www.freetogame.com/api';

// RAWG API - Free tier: 20,000 requests/month (no API key for basic usage)
export const getPopularGames = async (page: number = 1, pageSize: number = 20): Promise<Game[]> => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?page=${page}&page_size=${pageSize}&ordering=-rating`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return [];
  }
};

export const getLatestGames = async (page: number = 1, pageSize: number = 20): Promise<Game[]> => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?page=${page}&page_size=${pageSize}&ordering=-released`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching latest games:', error);
    return [];
  }
};

export const searchGames = async (query: string, page: number = 1, pageSize: number = 20): Promise<Game[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

export const getGamesByGenre = async (genreId: number, page: number = 1, pageSize: number = 20): Promise<Game[]> => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?genres=${genreId}&page=${page}&page_size=${pageSize}&ordering=-rating`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching games by genre ${genreId}:`, error);
    return [];
  }
};

export const getGamesByPlatform = async (platformId: number, page: number = 1, pageSize: number = 20): Promise<Game[]> => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?platforms=${platformId}&page=${page}&page_size=${pageSize}&ordering=-rating`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching games by platform ${platformId}:`, error);
    return [];
  }
};

// Free-to-Play Games API
export const getFreeGames = async (): Promise<FreeGame[]> => {
  try {
    const response = await fetch(`${FREETOGAME_BASE_URL}/games`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching free games:', error);
    return [];
  }
};

export const getFreeGamesByCategory = async (category: string): Promise<FreeGame[]> => {
  try {
    const response = await fetch(`${FREETOGAME_BASE_URL}/games?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching free games by category ${category}:`, error);
    return [];
  }
};

export const getFreeGamesByPlatform = async (platform: string): Promise<FreeGame[]> => {
  try {
    const response = await fetch(`${FREETOGAME_BASE_URL}/games?platform=${encodeURIComponent(platform)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching free games by platform ${platform}:`, error);
    return [];
  }
};

export const getFreeGameById = async (id: number): Promise<FreeGame | null> => {
  try {
    const response = await fetch(`${FREETOGAME_BASE_URL}/game?id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching free game ${id}:`, error);
    return null;
  }
};

// Game genres (RAWG API)
export const GAME_GENRES = {
  action: 4,
  indie: 51,
  adventure: 3,
  rpg: 5,
  strategy: 10,
  shooter: 2,
  casual: 40,
  simulation: 14,
  puzzle: 7,
  arcade: 11,
  platformer: 83,
  racing: 1,
  massivelyMultiplayer: 59,
  sports: 15,
  fighting: 6,
  family: 19,
  boardGames: 28,
  educational: 34,
  card: 17
};

// Game platforms (RAWG API)
export const GAME_PLATFORMS = {
  pc: 4,
  playstation5: 187,
  playstation4: 18,
  xboxOne: 1,
  xboxSeriesX: 186,
  nintendoSwitch: 7,
  ios: 3,
  android: 21,
  macOS: 5,
  linux: 6,
  web: 171
};

// Free-to-Play game categories
export const FREE_GAME_CATEGORIES = [
  'mmorpg',
  'shooter',
  'strategy',
  'moba',
  'racing',
  'sports',
  'social',
  'sandbox',
  'open-world',
  'survival',
  'pvp',
  'pve',
  'pixel',
  'voxel',
  'zombie',
  'turn-based',
  'first-person',
  'third-person',
  'top-down',
  'tank',
  'space',
  'sailing',
  'side-scroller',
  'superhero',
  'permadeath',
  'card',
  'battle-royale',
  'mmo',
  'mmofps',
  'mmotps',
  '3d',
  '2d',
  'anime',
  'fantasy',
  'sci-fi',
  'fighting',
  'action-rpg',
  'action',
  'military',
  'martial-arts',
  'flight',
  'low-spec',
  'tower-defense',
  'horror',
  'mmorts'
];

// Free-to-Play platforms
export const FREE_GAME_PLATFORMS = [
  'pc',
  'web-browser'
];

// Utility function to combine free and paid games
export const getAllGames = async (includeFree: boolean = true, page: number = 1): Promise<(Game | FreeGame)[]> => {
  try {
    const promises = [getPopularGames(page, 15)];
    
    if (includeFree) {
      promises.push(getFreeGames().then(games => games.slice(0, 10)));
    }
    
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching all games:', error);
    return [];
  }
};
