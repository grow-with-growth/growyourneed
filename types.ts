import React from 'react';

export enum ModuleKey {
  School = "School",
  Student = "Student",
  Parents = "Parents",
  Teacher = "Teacher",
  Marketing = "Marketing",
  Finance = "finance",
  Analytics = "Analytics"
}

export enum MainViewKey {
  Default = "Default", // For the main school dashboard with modules
  Analytics = "Analytics",
  Academics = "Academics",
  LifeStyle = "LifeStyle",
  Media = "Media",
  Design = "Design",
  Email = "Email",
  Contact = "Contact",
}

export interface RightSidebarItemType {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string; 
  viewKey?: MainViewKey; // Key to switch the main dashboard view
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any; 
}

export interface RankedListItem {
  id: string;
  rank: number;
  name: string;
  details: string;
  iconColor: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface DemographicData {
  category: string;
  value: number;
}

// Media types for the enhanced services
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
  isbn?: string[];
  publish_date?: string;
  publishers?: string[];
  number_of_pages?: number;
  description?: string;
  cover_url?: string;
  read_url?: string;
}

// Lifestyle service types
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: number;
  address: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  openingHours?: string[];
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: number;
  deliveryTime?: string;
  minimumOrder?: number;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  imageUrl?: string;
  amenities: string[];
  roomTypes: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  bookingUrl?: string;
}

export interface FitnessClass {
  id: string;
  name: string;
  instructor: string;
  type: string;
  duration: number;
  difficulty: string;
  maxParticipants: number;
  currentParticipants: number;
  schedule: {
    date: string;
    time: string;
  };
  location: string;
  price: number;
  description: string;
  equipment?: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  availability: string[];
  location: string;
  phone?: string;
  email?: string;
  specialties: string[];
  experience: string;
  imageUrl?: string;
  verified: boolean;
}