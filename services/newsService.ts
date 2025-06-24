// Free News Service using multiple free APIs
// No API key required for basic usage

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
  category?: string;
  country?: string;
  language?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

// Free news sources that don't require API keys
const FREE_NEWS_SOURCES = [
  {
    name: 'BBC News',
    rss: 'http://feeds.bbci.co.uk/news/rss.xml',
    category: 'general',
    country: 'gb',
    language: 'en'
  },
  {
    name: 'CNN',
    rss: 'http://rss.cnn.com/rss/edition.rss',
    category: 'general',
    country: 'us',
    language: 'en'
  },
  {
    name: 'Reuters',
    rss: 'https://feeds.reuters.com/reuters/topNews',
    category: 'general',
    country: 'us',
    language: 'en'
  },
  {
    name: 'Associated Press',
    rss: 'https://feeds.apnews.com/rss/apf-topnews',
    category: 'general',
    country: 'us',
    language: 'en'
  },
  {
    name: 'NPR',
    rss: 'https://feeds.npr.org/1001/rss.xml',
    category: 'general',
    country: 'us',
    language: 'en'
  },
  {
    name: 'Al Jazeera',
    rss: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'general',
    country: 'qa',
    language: 'en'
  },
  {
    name: 'TechCrunch',
    rss: 'https://techcrunch.com/feed/',
    category: 'technology',
    country: 'us',
    language: 'en'
  },
  {
    name: 'Ars Technica',
    rss: 'http://feeds.arstechnica.com/arstechnica/index',
    category: 'technology',
    country: 'us',
    language: 'en'
  },
  {
    name: 'ESPN',
    rss: 'https://www.espn.com/espn/rss/news',
    category: 'sports',
    country: 'us',
    language: 'en'
  },
  {
    name: 'Sky Sports',
    rss: 'http://www.skysports.com/rss/12040',
    category: 'sports',
    country: 'gb',
    language: 'en'
  }
];

// RSS to JSON converter service (free)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

const fetchRSSFeed = async (rssUrl: string, source: any): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}&count=20`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`RSS feed error: ${data.message}`);
    }
    
    return data.items.map((item: any, index: number) => ({
      id: `${source.name}-${index}-${Date.now()}`,
      title: item.title || 'No title',
      description: item.description ? stripHtml(item.description) : 'No description',
      content: item.content ? stripHtml(item.content) : undefined,
      url: item.link || item.guid || '#',
      imageUrl: extractImageFromContent(item.description || item.content) || item.thumbnail,
      publishedAt: item.pubDate || new Date().toISOString(),
      source: {
        name: source.name
      },
      author: item.author,
      category: source.category,
      country: source.country,
      language: source.language
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${rssUrl}:`, error);
    return [];
  }
};

export const getLatestNews = async (limit: number = 50): Promise<NewsArticle[]> => {
  try {
    const newsPromises = FREE_NEWS_SOURCES.slice(0, 6).map(source => 
      fetchRSSFeed(source.rss, source)
    );
    
    const newsArrays = await Promise.all(newsPromises);
    const allNews = newsArrays.flat();
    
    // Sort by published date (newest first)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return allNews.slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

export const getNewsByCategory = async (category: string, limit: number = 30): Promise<NewsArticle[]> => {
  try {
    const categoryFeeds = FREE_NEWS_SOURCES.filter(source => 
      source.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryFeeds.length === 0) {
      return [];
    }
    
    const newsPromises = categoryFeeds.map(source => 
      fetchRSSFeed(source.rss, source)
    );
    
    const newsArrays = await Promise.all(newsPromises);
    const allNews = newsArrays.flat();
    
    // Sort by published date (newest first)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return allNews.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching news by category ${category}:`, error);
    return [];
  }
};

export const getNewsBySource = async (sourceName: string, limit: number = 20): Promise<NewsArticle[]> => {
  try {
    const source = FREE_NEWS_SOURCES.find(s => 
      s.name.toLowerCase() === sourceName.toLowerCase()
    );
    
    if (!source) {
      return [];
    }
    
    const news = await fetchRSSFeed(source.rss, source);
    return news.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching news by source ${sourceName}:`, error);
    return [];
  }
};

export const searchNews = (articles: NewsArticle[], query: string): NewsArticle[] => {
  if (!query.trim()) return articles;
  
  const searchTerm = query.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.source.name.toLowerCase().includes(searchTerm)
  );
};

export const getAvailableCategories = (): string[] => {
  return [...new Set(FREE_NEWS_SOURCES.map(source => source.category))];
};

export const getAvailableSources = (): string[] => {
  return FREE_NEWS_SOURCES.map(source => source.name);
};

// Utility functions
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

const extractImageFromContent = (content: string): string | undefined => {
  if (!content) return undefined;
  
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
};

// Alternative free news sources (JSON APIs)
export const getHackerNews = async (limit: number = 30): Promise<NewsArticle[]> => {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json();
    
    const stories = await Promise.all(
      storyIds.slice(0, limit).map(async (id: number) => {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return storyResponse.json();
      })
    );
    
    return stories
      .filter(story => story && story.title && story.url)
      .map(story => ({
        id: story.id.toString(),
        title: story.title,
        description: story.text ? stripHtml(story.text) : 'No description',
        url: story.url,
        publishedAt: new Date(story.time * 1000).toISOString(),
        source: {
          name: 'Hacker News'
        },
        author: story.by,
        category: 'technology'
      }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
};

export const getRedditNews = async (subreddit: string = 'news', limit: number = 25): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`);
    const data = await response.json();
    
    return data.data.children
      .filter((post: any) => post.data.url && !post.data.is_self)
      .map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        description: post.data.selftext || 'No description',
        url: post.data.url,
        imageUrl: post.data.thumbnail !== 'self' ? post.data.thumbnail : undefined,
        publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
        source: {
          name: `Reddit r/${subreddit}`
        },
        author: post.data.author,
        category: 'general'
      }));
  } catch (error) {
    console.error(`Error fetching Reddit r/${subreddit}:`, error);
    return [];
  }
};
