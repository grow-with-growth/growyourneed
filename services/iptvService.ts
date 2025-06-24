// Free IPTV Service using open-source IPTV-Org repository
// Completely free, no API key required, 8000+ channels worldwide

export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group: string;
  country: string;
  language: string;
  category: string;
  isNSFW?: boolean;
}

export interface IPTVPlaylist {
  channels: IPTVChannel[];
  countries: string[];
  categories: string[];
  languages: string[];
}

const IPTV_ORG_BASE = 'https://iptv-org.github.io/iptv';

// Available playlist URLs from IPTV-Org
export const IPTV_PLAYLISTS = {
  all: `${IPTV_ORG_BASE}/index.m3u`,
  countries: {
    us: `${IPTV_ORG_BASE}/countries/us.m3u`,
    uk: `${IPTV_ORG_BASE}/countries/gb.m3u`,
    ca: `${IPTV_ORG_BASE}/countries/ca.m3u`,
    au: `${IPTV_ORG_BASE}/countries/au.m3u`,
    de: `${IPTV_ORG_BASE}/countries/de.m3u`,
    fr: `${IPTV_ORG_BASE}/countries/fr.m3u`,
    es: `${IPTV_ORG_BASE}/countries/es.m3u`,
    it: `${IPTV_ORG_BASE}/countries/it.m3u`,
    jp: `${IPTV_ORG_BASE}/countries/jp.m3u`,
    kr: `${IPTV_ORG_BASE}/countries/kr.m3u`,
    in: `${IPTV_ORG_BASE}/countries/in.m3u`,
    br: `${IPTV_ORG_BASE}/countries/br.m3u`,
    mx: `${IPTV_ORG_BASE}/countries/mx.m3u`,
    ar: `${IPTV_ORG_BASE}/countries/ar.m3u`,
    sa: `${IPTV_ORG_BASE}/countries/sa.m3u`,
    ae: `${IPTV_ORG_BASE}/countries/ae.m3u`,
    eg: `${IPTV_ORG_BASE}/countries/eg.m3u`,
    tr: `${IPTV_ORG_BASE}/countries/tr.m3u`,
    ru: `${IPTV_ORG_BASE}/countries/ru.m3u`,
    cn: `${IPTV_ORG_BASE}/countries/cn.m3u`
  },
  categories: {
    news: `${IPTV_ORG_BASE}/categories/news.m3u`,
    sports: `${IPTV_ORG_BASE}/categories/sports.m3u`,
    entertainment: `${IPTV_ORG_BASE}/categories/entertainment.m3u`,
    movies: `${IPTV_ORG_BASE}/categories/movies.m3u`,
    music: `${IPTV_ORG_BASE}/categories/music.m3u`,
    kids: `${IPTV_ORG_BASE}/categories/kids.m3u`,
    documentary: `${IPTV_ORG_BASE}/categories/documentary.m3u`,
    religious: `${IPTV_ORG_BASE}/categories/religious.m3u`,
    cooking: `${IPTV_ORG_BASE}/categories/cooking.m3u`,
    travel: `${IPTV_ORG_BASE}/categories/travel.m3u`
  }
};

const parseM3UPlaylist = (m3uContent: string): IPTVChannel[] => {
  const channels: IPTVChannel[] = [];
  const lines = m3uContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1]?.trim();
      if (nextLine?.startsWith('http')) {
        const channel = parseEXTINFLine(line, nextLine);
        if (channel) {
          channels.push(channel);
        }
      }
    }
  }
  
  return channels;
};

const parseEXTINFLine = (extinf: string, url: string): IPTVChannel | null => {
  try {
    // Extract channel name (after the last comma)
    const nameMatch = /,(.*)$/.exec(extinf);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
    // Extract attributes
    const groupMatch = /group-title="([^"]*)"/.exec(extinf);
    const logoMatch = /tvg-logo="([^"]*)"/.exec(extinf);
    const countryMatch = /tvg-country="([^"]*)"/.exec(extinf);
    const languageMatch = /tvg-language="([^"]*)"/.exec(extinf);
    return {
      id: Math.random().toString(36).substring(7),
      name,
      url,
      logo: logoMatch ? logoMatch[1] : undefined,
      group: groupMatch ? groupMatch[1] : 'General',
      country: countryMatch ? countryMatch[1] : 'Unknown',
      language: languageMatch ? languageMatch[1] : 'Unknown',
      category: groupMatch ? groupMatch[1] : 'General',
      isNSFW: extinf.toLowerCase().includes('xxx') || extinf.toLowerCase().includes('adult')
    };
  } catch (error) {
    console.error('Error parsing EXTINF line:', error);
    return null;
  }
};

export const fetchIPTVChannels = async (playlistUrl?: string): Promise<IPTVChannel[]> => {
  try {
    const url = playlistUrl ?? IPTV_PLAYLISTS.all;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const m3uContent = await response.text();
    const channels = parseM3UPlaylist(m3uContent);
    
    // Filter out NSFW content by default
    return channels.filter(channel => channel.isNSFW !== true);
  } catch (error) {
    console.error('Error fetching IPTV channels:', error);
    return [];
  }
};

export const fetchIPTVChannelsByCountry = async (countryCode: string): Promise<IPTVChannel[]> => {
  const playlistUrl = IPTV_PLAYLISTS.countries[countryCode as keyof typeof IPTV_PLAYLISTS.countries];
  if (!playlistUrl) {
    console.warn(`No playlist found for country code: ${countryCode}`);
    return [];
  }
  
  return fetchIPTVChannels(playlistUrl);
};

export const fetchIPTVChannelsByCategory = async (category: string): Promise<IPTVChannel[]> => {
  const playlistUrl = IPTV_PLAYLISTS.categories[category as keyof typeof IPTV_PLAYLISTS.categories];
  if (!playlistUrl) {
    console.warn(`No playlist found for category: ${category}`);
    return [];
  }
  
  return fetchIPTVChannels(playlistUrl);
};

export const getAvailableCountries = (): string[] => {
  return Object.keys(IPTV_PLAYLISTS.countries);
};

export const getAvailableCategories = (): string[] => {
  return Object.keys(IPTV_PLAYLISTS.categories);
};

export const searchIPTVChannels = (channels: IPTVChannel[], query: string): IPTVChannel[] => {
  if (!query.trim()) return channels;
  
  const searchTerm = query.toLowerCase();
  return channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm) ||
    channel.group.toLowerCase().includes(searchTerm) ||
    channel.country.toLowerCase().includes(searchTerm) ||
    channel.category.toLowerCase().includes(searchTerm)
  );
};

// Popular free streaming channels (additional sources)
export const getFreeStreamingChannels = (): IPTVChannel[] => {
  return [
    {
      id: 'pluto-tv',
      name: 'Pluto TV',
      url: 'https://pluto.tv/live-tv/',
      group: 'Free Streaming',
      country: 'US',
      language: 'English',
      category: 'Entertainment'
    },
    {
      id: 'tubi-tv',
      name: 'Tubi TV',
      url: 'https://tubitv.com/live',
      group: 'Free Streaming',
      country: 'US',
      language: 'English',
      category: 'Movies'
    },
    {
      id: 'crackle',
      name: 'Crackle',
      url: 'https://www.crackle.com/',
      group: 'Free Streaming',
      country: 'US',
      language: 'English',
      category: 'Entertainment'
    },
    {
      id: 'youtube-live',
      name: 'YouTube Live',
      url: 'https://www.youtube.com/live',
      group: 'Free Streaming',
      country: 'Global',
      language: 'Multiple',
      category: 'General'
    }
  ];
};
