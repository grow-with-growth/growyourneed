import { API_KEY } from './env';

const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }
  return response.json();
};

export const getTrendingMovies = () => fetchFromTMDB('trending/movie/week');
export const getTrendingSeries = () => fetchFromTMDB('trending/tv/week');

