export interface WatchProvider {
  id: number;
  name: string;
  short: string;
  color: string;
  bgColor?: string;
  textColor?: string;
  ids: number[]; // TMDB provider IDs (e.g. Netflix = 8, 1796)
  rentOnly?: boolean;
  logoUrl?: string;
}

export interface ProviderItem {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
  display_priority?: number;
}

export interface WatchAvailability {
  link?: string;
  flatrate?: ProviderItem[];
  free?: ProviderItem[];
  ads?: ProviderItem[];
  rent?: ProviderItem[];
  buy?: ProviderItem[];
}

export interface Movie {
  id: string | number;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  originalTitle?: string;
  year: string;
  overview: string;
  poster: string;
  backdrop: string;
  rating: number;
  voteCount?: number;
  genres: string[];
  runtime?: number;
  director?: string;
  cast?: string[];
  trailerUrl?: string;
  source: 'tmdb' | 'cinemeta' | 'apple' | 'curated';
  storeUrl?: string;
  justWatchUrl?: string;
  cachedProviders?: Record<string, WatchAvailability>; // by country code (e.g., 'FR')
}

export type CategoryType = 'trending' | 'popular' | 'top_rated' | 'now_playing' | 'mine' | 'watchlist' | 'upcoming' | 'cinemas';

export type CostFilterType = 'all' | 'free' | 'rent_buy';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export interface VodPrice {
  providerId: number;
  providerName: string;
  logoUrl?: string;
  rentPrice?: number;
  buyPrice?: number;
  quality?: 'HD' | '4K' | 'SD';
  url?: string;
  isCheapestRent?: boolean;
  isCheapestBuy?: boolean;
}

export interface UgcShowtime {
  cinemaName: string;
  address: string;
  city: string;
  postalCode?: string;
  distanceKm?: number;
  format: string; // 'VF', 'VOSTFR', 'IMAX Laser', 'UGC Illimité'
  times: string[];
  bookingUrl: string;
  lat: number;
  lng: number;
}

export interface AvailabilityAlert {
  id: string;
  movieId: string | number;
  movieTitle: string;
  moviePoster: string;
  platformId?: number;
  platformName?: string;
  targetAllUserSubs: boolean;
  createdAt: string;
  status: 'active' | 'triggered';
  triggeredPlatform?: string;
  triggeredDate?: string;
}

export interface UpcomingMovie {
  id: string | number;
  title: string;
  poster: string;
  backdrop?: string;
  releaseDate: string; // '2026-10-04'
  daysLeft: number;
  platformId: number;
  platformName: string;
  platformLogo?: string;
  synopsis: string;
  rating: number;
  genres: string[];
  reminderSet?: boolean;
}

export interface QuizAnswers {
  mood: string;
  context: string;
  runtime: string; // '<90', '90-120', '120-150', '>150'
  era: string; // 'recent', '2010s', '2000s', 'classic', 'any'
  minRating: number;
  platforms: number[];
  actors?: string;
}

export interface FriendPreference {
  id: string;
  name: string;
  avatarColor: string;
  favoriteGenres: string[];
  dislikes: string[];
  favoriteActor?: string;
}

export interface AiMovieRecommendation {
  movieId?: string | number;
  title: string;
  year: string;
  director?: string;
  genres: string[];
  matchScore: number;
  reason: string;
  suggestedPlatform?: string;
  poster?: string;
  rating?: number;
  runtime?: number;
  cast?: string[];
  overview?: string;
}

export interface CameraIdentificationResult {
  title: string;
  year: string;
  confidence: number;
  explanation: string;
  actors: string[];
  famousScene?: string;
  matchedMovie?: Movie;
}
