import React, { useState, useEffect } from 'react';
import { StarIcon, AcademicCapIcon, CreditCardIcon } from '../icons';

interface BookStoreWidgetProps {
  compact?: boolean;
  userRole?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  price: number;
  digitalPrice?: number;
  thumbnail: string;
  rating: number;
  reviews: number;
  description: string;
  availability: 'in-stock' | 'out-of-stock' | 'digital-only';
  type: 'physical' | 'digital' | 'both';
}

export const BookStoreWidget: React.FC<BookStoreWidgetProps> = ({ compact = false, userRole = 'admin' }) => {
  const [selectedCategory, setSelectedCategory] = useState('textbooks');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Mock educational books data
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Advanced Mathematics for High School',
      author: 'Dr. Sarah Johnson',
      isbn: '978-0123456789',
      category: 'textbooks',
      price: 89.99,
      digitalPrice: 59.99,
      thumbnail: 'https://picsum.photos/seed/mathbook/200/300',
      rating: 4.8,
      reviews: 156,
      description: 'Comprehensive mathematics textbook covering algebra, geometry, and calculus',
      availability: 'in-stock',
      type: 'both'
    },
    {
      id: '2',
      title: 'Science Laboratory Manual',
      author: 'Prof. Michael Chen',
      isbn: '978-0987654321',
      category: 'textbooks',
      price: 65.99,
      digitalPrice: 45.99,
      thumbnail: 'https://picsum.photos/seed/sciencebook/200/300',
      rating: 4.6,
      reviews: 89,
      description: 'Hands-on laboratory experiments and procedures for science students',
      availability: 'in-stock',
      type: 'both'
    },
    {
      id: '3',
      title: 'World History Chronicles',
      author: 'Dr. Emily Rodriguez',
      isbn: '978-0456789123',
      category: 'reference',
      price: 75.99,
      digitalPrice: 49.99,
      thumbnail: 'https://picsum.photos/seed/historybook/200/300',
      rating: 4.9,
      reviews: 234,
      description: 'Comprehensive world history from ancient civilizations to modern times',
      availability: 'in-stock',
      type: 'both'
    },
    {
      id: '4',
      title: 'Creative Writing Workshop',
      author: 'Jane Smith',
      isbn: '978-0789123456',
      category: 'literature',
      price: 45.99,
      digitalPrice: 29.99,
      thumbnail: 'https://picsum.photos/seed/writingbook/200/300',
      rating: 4.7,
      reviews: 67,
      description: 'Guide to creative writing techniques and exercises',
      availability: 'in-stock',
      type: 'both'
    }
  ];

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setBooks(mockBooks);
      setIsLoading(false);
    };

    loadBooks();
  }, [selectedCategory]);

  const categories = [
    { id: 'textbooks', label: 'Textbooks', count: 45 },
    { id: 'reference', label: 'Reference', count: 23 },
    { id: 'literature', label: 'Literature', count: 67 },
    { id: 'digital', label: 'Digital Only', count: 89 }
  ];

  const getBooksByCategory = () => {
    if (selectedCategory === 'digital') {
      return books.filter(book => book.type === 'digital' || book.type === 'both');
    }
    return books.filter(book => book.category === selectedCategory);
  };

  const addToCart = (bookId: string) => {
    setCartItems(prev => [...prev, bookId]);
  };

  const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-slate-700/30 rounded-lg overflow-hidden hover:bg-slate-700/50 transition-all duration-200">
      <div className="relative">
        <img 
          src={book.thumbnail} 
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {book.availability === 'in-stock' ? 'In Stock' : 
           book.availability === 'digital-only' ? 'Digital' : 'Out of Stock'}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
          <StarIcon className="w-3 h-3 text-yellow-400" />
          <span className="text-white text-xs">{book.rating}</span>
          <span className="text-white text-xs">({book.reviews})</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-slate-200 text-sm line-clamp-2 mb-1">{book.title}</h4>
        <p className="text-slate-400 text-xs mb-2">by {book.author}</p>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{book.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-slate-200 font-semibold">${book.price}</div>
            {book.digitalPrice && (
              <div className="text-slate-400 text-xs">Digital: ${book.digitalPrice}</div>
            )}
          </div>
          <div className="text-slate-500 text-xs">
            ISBN: {book.isbn}
          </div>
        </div>
        
        <button 
          onClick={() => addToCart(book.id)}
          disabled={book.availability === 'out-of-stock'}
          className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
            book.availability === 'out-of-stock'
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {book.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-200">Book Store</h3>
          <StarIcon className="w-5 h-5 text-blue-400" />
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-slate-700/30 rounded">
              <div className="text-lg font-bold text-blue-400">224</div>
              <div className="text-xs text-slate-400">Books Available</div>
            </div>
            <div className="text-center p-2 bg-slate-700/30 rounded">
              <div className="text-lg font-bold text-green-400">{cartItems.length}</div>
              <div className="text-xs text-slate-400">In Cart</div>
            </div>
          </div>
          
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Book Store</h2>
          <p className="text-slate-400 text-sm">Educational books and digital resources</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Cart:</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              {cartItems.length} items
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Role:</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded capitalize">
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-700/30 rounded-lg p-1">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {getBooksByCategory().map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Store Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">224</div>
            <div className="text-slate-400 text-sm">Total Books</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">89</div>
            <div className="text-slate-400 text-sm">Digital Books</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">4.7</div>
            <div className="text-slate-400 text-sm">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">15%</div>
            <div className="text-slate-400 text-sm">Bulk Discount</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <AcademicCapIcon className="w-5 h-5 text-blue-400" />
          <span className="text-slate-200 text-sm">Request New Books</span>
        </button>
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <CreditCardIcon className="w-5 h-5 text-green-400" />
          <span className="text-slate-200 text-sm">Bulk Order Discount</span>
        </button>
        <button className="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
          <StarIcon className="w-5 h-5 text-purple-400" />
          <span className="text-slate-200 text-sm">View Cart ({cartItems.length})</span>
        </button>
      </div>
    </div>
  );
};
