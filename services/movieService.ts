// Free Movie Service using multiple free APIs
// No API key required - combines OMDb API and Archive.org

export interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  genre: string[];
  rating?: string;
  director?: string;
  actors?: string;
  runtime?: string;
  imdbID?: string;
  streamUrl?: string;
}

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Popular movies to fetch from OMDb (free tier: 1000 requests/day)
const POPULAR_MOVIES = [
  'The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction',
  'The Godfather', 'Forrest Gump', 'The Shawshank Redemption', 'Fight Club',
  'Goodfellas', 'The Lord of the Rings', 'Star Wars', 'Jurassic Park',
  'Titanic', 'Avatar', 'The Avengers', 'Spider-Man', 'Iron Man',
  'Deadpool', 'Wonder Woman', 'Black Panther', 'Guardians of the Galaxy'
];

const fetchMovieFromOMDb = async (title: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&type=movie`);
    const data = await response.json();

    if (data.Response === 'True') {
      return {
        id: data.imdbID ?? Math.random().toString(36).substring(7),
        title: data.Title,
        description: data.Plot ?? 'No description available',
        imageUrl: data.Poster !== 'N/A' ? data.Poster : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(data.Title)}`,
        year: parseInt(data.Year) ?? 0,
        genre: data.Genre ? data.Genre.split(', ') : [],
        rating: data.imdbRating,
        director: data.Director,
        actors: data.Actors,
        runtime: data.Runtime,
        imdbID: data.imdbID,
        streamUrl: `https://vidsrc.to/embed/movie/${data.imdbID}` // Free streaming embed
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching movie ${title} from OMDb:`, error);
    return null;
  }
};

const fetchMoviesFromArchive = async (): Promise<Movie[]> => {
  try {
    const response = await fetch('https://archive.org/advancedsearch.php?q=collection%3Amovies%20AND%20mediatype%3A(movies)&fl[]=identifier&fl[]=title&fl[]=description&fl[]=date&rows=20&output=json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.response.docs.map((item: any) => ({
      id: item.identifier ?? Math.random().toString(36).substring(7),
      title: item.title ?? 'Unknown Title',
      description: item.description ?? 'No description available',
      imageUrl: `https://archive.org/services/img/${item.identifier}`,
      year: item.date ? parseInt(item.date.split('-')[0]) : 0,
      genre: ['Archive'],
      streamUrl: `https://archive.org/details/${item.identifier}`
    }));
  } catch (error) {
    console.error("Error fetching movies from Archive.org:", error);
    return [];
  }
};

export const getMovies = async (): Promise<Movie[]> => {
  try {
    // Combine movies from both sources
    const [omdbMovies, archiveMovies] = await Promise.all([
      Promise.all(POPULAR_MOVIES.slice(0, 12).map(title => fetchMovieFromOMDb(title))),
      fetchMoviesFromArchive()
    ]);

    const validOMDbMovies = omdbMovies.filter((movie): movie is Movie => movie !== null);
    const allMovies = [...validOMDbMovies, ...archiveMovies.slice(0, 8)];

    return allMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

  try {
    // Search OMDb API
    const response = await fetch(`${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&type=movie`);
    const data = await response.json();

    if (data.Response === 'True' && data.Search) {
      const detailedMovies = await Promise.all(
        data.Search.slice(0, 10).map(async (movie: any) => {
          const detailed = await fetchMovieFromOMDb(movie.Title);
          return detailed;
        })
      );
      return detailedMovies.filter((movie): movie is Movie => movie !== null);
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

