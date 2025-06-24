
// Free TV Series Service using multiple free APIs
// TVMaze API (completely free, no API key required) + OMDb API

export interface Series {
  id: string;
  name: string;
  title?: string;
  description: string;
  imageUrl: string;
  year: number;
  genre: string[];
  rating?: string;
  status?: string;
  network?: string;
  runtime?: number;
  imdbID?: string;
  streamUrl?: string;
}

const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

// Popular TV series to fetch from OMDb
const POPULAR_SERIES = [
  'Breaking Bad', 'Game of Thrones', 'The Office', 'Friends', 'Stranger Things',
  'The Crown', 'House of Cards', 'Narcos', 'Black Mirror', 'Sherlock',
  'The Walking Dead', 'Better Call Saul', 'Westworld', 'The Mandalorian',
  'Money Heist', 'Dark', 'Ozark', 'The Witcher', 'Squid Game', 'Euphoria'
];

const fetchSeriesFromOMDb = async (title: string): Promise<Series | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&type=series`);
    const data = await response.json();

    if (data.Response === 'True') {
      return {
        id: data.imdbID || Math.random().toString(36).substring(7),
        name: data.Title,
        title: data.Title,
        description: data.Plot || 'No description available',
        imageUrl: data.Poster !== 'N/A' ? data.Poster : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(data.Title)}`,
        year: parseInt(data.Year?.split('–')[0]) || 0,
        genre: data.Genre ? data.Genre.split(', ') : [],
        rating: data.imdbRating,
        status: data.Year?.includes('–') ? 'Ended' : 'Running',
        network: data.Writer,
        runtime: data.Runtime ? parseInt(data.Runtime) : undefined,
        imdbID: data.imdbID,
        streamUrl: `https://vidsrc.to/embed/tv/${data.imdbID}` // Free streaming embed
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching series ${title} from OMDb:`, error);
    return null;
  }
};

const fetchSeriesFromTVMaze = async (): Promise<Series[]> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=0`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.slice(0, 20).map((show: any) => ({
      id: show.id?.toString() || Math.random().toString(36).substring(7),
      name: show.name,
      title: show.name,
      description: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No description available',
      imageUrl: show.image?.medium || show.image?.original || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(show.name)}`,
      year: show.premiered ? parseInt(show.premiered.split('-')[0]) : 0,
      genre: show.genres || [],
      rating: show.rating?.average?.toString(),
      status: show.status,
      network: show.network?.name || show.webChannel?.name,
      runtime: show.runtime,
      streamUrl: `https://vidsrc.to/embed/tv/${show.externals?.imdb || show.id}`
    }));
  } catch (error) {
    console.error("Error fetching series from TVMaze:", error);
    return [];
  }
};

export const getSeries = async (): Promise<Series[]> => {
  try {
    // Combine series from both sources
    const [omdbSeries, tvmazeSeries] = await Promise.all([
      Promise.all(POPULAR_SERIES.slice(0, 10).map(title => fetchSeriesFromOMDb(title))),
      fetchSeriesFromTVMaze()
    ]);

    const validOMDbSeries = omdbSeries.filter((series): series is Series => series !== null);
    const allSeries = [...validOMDbSeries, ...tvmazeSeries.slice(0, 15)];

    return allSeries;
  } catch (error) {
    console.error('Error fetching series:', error);
    return [];
  }
};

export const searchSeries = async (query: string): Promise<Series[]> => {
  if (!query.trim()) return [];

  try {
    // Search both APIs
    const [omdbResults, tvmazeResults] = await Promise.all([
      searchOMDbSeries(query),
      searchTVMazeSeries(query)
    ]);

    return [...omdbResults, ...tvmazeResults];
  } catch (error) {
    console.error('Error searching series:', error);
    return [];
  }
};

const searchOMDbSeries = async (query: string): Promise<Series[]> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&type=series`);
    const data = await response.json();

    if (data.Response === 'True' && data.Search) {
      const detailedSeries = await Promise.all(
        data.Search.slice(0, 5).map(async (series: any) => {
          const detailed = await fetchSeriesFromOMDb(series.Title);
          return detailed;
        })
      );
      return detailedSeries.filter((series): series is Series => series !== null);
    }
    return [];
  } catch (error) {
    console.error('Error searching OMDb series:', error);
    return [];
  }
};

const searchTVMazeSeries = async (query: string): Promise<Series[]> => {
  try {
    const response = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];

    const data = await response.json();

    return data.slice(0, 5).map((result: any) => {
      const show = result.show;
      return {
        id: show.id?.toString() || Math.random().toString(36).substring(7),
        name: show.name,
        title: show.name,
        description: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No description available',
        imageUrl: show.image?.medium || show.image?.original || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(show.name)}`,
        year: show.premiered ? parseInt(show.premiered.split('-')[0]) : 0,
        genre: show.genres || [],
        rating: show.rating?.average?.toString(),
        status: show.status,
        network: show.network?.name || show.webChannel?.name,
        runtime: show.runtime,
        streamUrl: `https://vidsrc.to/embed/tv/${show.externals?.imdb || show.id}`
      };
    });
  } catch (error) {
    console.error('Error searching TVMaze series:', error);
    return [];
  }
};

