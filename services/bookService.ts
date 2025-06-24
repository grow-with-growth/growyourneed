
// Free Books Service using multiple free APIs
// Project Gutenberg (70,000+ free ebooks) + Open Library API
// Completely free, no API key required

export interface Book {
  id: number;
  title: string;
  authors: Array<{
    name: string;
    birth_year?: number;
    death_year?: number;
  }>;
  subjects: string[];
  languages: string[];
  formats: { [key: string]: string };
  download_count: number;
  copyright?: boolean;
  media_type: string;
  bookshelves: string[];
  // Additional fields from Open Library
  isbn?: string[];
  publish_date?: string;
  publishers?: string[];
  number_of_pages?: number;
  description?: string;
  cover_url?: string;
  read_url?: string;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  authors?: Array<{ name: string; key: string }>;
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
  subject?: string[];
  language?: string[];
  number_of_pages_median?: number;
}

const GUTENBERG_BASE_URL = 'https://gutendex.com/books';
const OPENLIBRARY_BASE_URL = 'https://openlibrary.org';

export const getBooks = async (page: number = 1, pageSize: number = 32): Promise<Book[]> => {
  try {
    const response = await fetch(`${GUTENBERG_BASE_URL}/?page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((book: any) => ({
      ...book,
      cover_url: getCoverUrl(book),
      read_url: getReadUrl(book)
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const searchBooks = async (query: string, page: number = 1): Promise<Book[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${GUTENBERG_BASE_URL}/?search=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((book: any) => ({
      ...book,
      cover_url: getCoverUrl(book),
      read_url: getReadUrl(book)
    }));
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};

export const getBooksByAuthor = async (author: string, page: number = 1): Promise<Book[]> => {
  try {
    const response = await fetch(`${GUTENBERG_BASE_URL}/?author=${encodeURIComponent(author)}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((book: any) => ({
      ...book,
      cover_url: getCoverUrl(book),
      read_url: getReadUrl(book)
    }));
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error);
    return [];
  }
};

export const getBooksBySubject = async (subject: string, page: number = 1): Promise<Book[]> => {
  try {
    const response = await fetch(`${GUTENBERG_BASE_URL}/?topic=${encodeURIComponent(subject)}&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((book: any) => ({
      ...book,
      cover_url: getCoverUrl(book),
      read_url: getReadUrl(book)
    }));
  } catch (error) {
    console.error(`Error fetching books by subject ${subject}:`, error);
    return [];
  }
};

export const getPopularBooks = async (page: number = 1): Promise<Book[]> => {
  try {
    const response = await fetch(`${GUTENBERG_BASE_URL}/?sort=popular&page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.results.map((book: any) => ({
      ...book,
      cover_url: getCoverUrl(book),
      read_url: getReadUrl(book)
    }));
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return [];
  }
};

// Open Library API integration
export const searchOpenLibrary = async (query: string, limit: number = 20): Promise<OpenLibraryBook[]> => {
  try {
    const response = await fetch(`${OPENLIBRARY_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.docs.map((book: any) => ({
      ...book,
      cover_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : undefined
    }));
  } catch (error) {
    console.error("Error searching Open Library:", error);
    return [];
  }
};

export const getBookByISBN = async (isbn: string): Promise<any> => {
  try {
    const response = await fetch(`${OPENLIBRARY_BASE_URL}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data[`ISBN:${isbn}`] || null;
  } catch (error) {
    console.error(`Error fetching book by ISBN ${isbn}:`, error);
    return null;
  }
};

// Helper functions
const getCoverUrl = (book: any): string => {
  // Try to get cover from formats
  if (book.formats && book.formats['image/jpeg']) {
    return book.formats['image/jpeg'];
  }

  // Fallback to placeholder
  return `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(book.title.substring(0, 20))}`;
};

const getReadUrl = (book: any): string => {
  // Prefer HTML format for online reading
  if (book.formats) {
    if (book.formats['text/html']) return book.formats['text/html'];
    if (book.formats['application/epub+zip']) return book.formats['application/epub+zip'];
    if (book.formats['text/plain; charset=utf-8']) return book.formats['text/plain; charset=utf-8'];
    if (book.formats['application/pdf']) return book.formats['application/pdf'];
  }

  return `https://www.gutenberg.org/ebooks/${book.id}`;
};

// Popular subjects for filtering
export const POPULAR_SUBJECTS = [
  'Fiction',
  'Literature',
  'History',
  'Philosophy',
  'Science',
  'Poetry',
  'Drama',
  'Biography',
  'Adventure',
  'Mystery',
  'Romance',
  'Children',
  'Religion',
  'Politics',
  'Art',
  'Music',
  'Travel',
  'Nature',
  'Psychology',
  'Education'
];

// Popular authors
export const POPULAR_AUTHORS = [
  'Charles Dickens',
  'Jane Austen',
  'Mark Twain',
  'William Shakespeare',
  'Arthur Conan Doyle',
  'Lewis Carroll',
  'Edgar Allan Poe',
  'H. G. Wells',
  'Jules Verne',
  'Oscar Wilde',
  'Charlotte Brontë',
  'Emily Brontë',
  'George Eliot',
  'Herman Melville',
  'Nathaniel Hawthorne',
  'Washington Irving',
  'Louisa May Alcott',
  'L. Frank Baum',
  'Rudyard Kipling',
  'Robert Louis Stevenson'
];

