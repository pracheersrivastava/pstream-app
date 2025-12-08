/**
 * Type definitions for P-Stream API responses.
 * These types normalize the backend response structure.
 */

/**
 * Video/audio source information
 */
export interface Source {
  /** Source URL */
  url: string;
  /** Provider name (e.g., 'vidcloud', 'upcloud') */
  provider: string;
  /** Quality label (e.g., '1080p', '720p', 'auto') */
  quality: string;
  /** Source type (e.g., 'hls', 'mp4', 'dash') */
  type: 'hls' | 'mp4' | 'dash' | 'unknown';
}

/**
 * Media item (movie, TV show, episode, etc.)
 */
export interface MediaItem {
  /** Unique identifier */
  id: string;
  /** TMDB ID if available */
  tmdbId?: string;
  /** Media title */
  title: string;
  /** Poster image URL */
  poster: string | null;
  /** Backdrop image URL */
  backdrop?: string | null;
  /** Overview/description */
  overview: string;
  /** Media type */
  type: 'movie' | 'tv' | 'episode' | 'unknown';
  /** Release year */
  year?: number;
  /** Rating (0-10) */
  rating?: number;
  /** Available sources (populated when fetching details) */
  sources?: Source[];
  /** Season number (for episodes) */
  season?: number;
  /** Episode number (for episodes) */
  episode?: number;
  /** Genres */
  genres?: string[];
}

/**
 * Home page response structure
 */
export interface HomeResponse {
  items: MediaItem[];
  sections?: {
    title: string;
    items: MediaItem[];
  }[];
}

/**
 * Search response structure
 */
export interface SearchResponse {
  items: MediaItem[];
  totalResults?: number;
  page?: number;
  totalPages?: number;
}

/**
 * Sources response structure
 */
export interface SourcesResponse {
  sources: Source[];
  subtitles?: {
    url: string;
    language: string;
    label: string;
  }[];
}

/**
 * Backend API error response shape
 */
export interface BackendErrorResponse {
  error?: string;
  message?: string;
  status?: number;
}

