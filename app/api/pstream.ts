/**
 * P-Stream API adapter.
 * Provides typed functions for interacting with the P-Stream backend.
 * Supports mock mode for development when backend is unreachable.
 */
import { get } from './client';
import {
  MediaItem,
  Source,
  HomeResponse,
  SearchResponse,
  SourcesResponse,
} from './types';
import { ApiError, ErrorCodes } from './errors';
import { getMockHome, getMockSearch, getMockDetails, getMockSources } from './mock';
import { getItem, setItem, STORAGE_KEYS } from '../store/storage';
import { MOCK_INSTANCE_IDENTIFIER } from '../config/defaults';
import { getCurrentInstance } from '../config/env';

/**
 * Check if mock mode is currently enabled
 */
async function shouldUseMock(): Promise<boolean> {
  // Check if mock mode is explicitly enabled
  const mockMode = await getItem(STORAGE_KEYS.MOCK_MODE);
  if (mockMode === 'true') {
    return true;
  }

  // Check if instance URL is the mock identifier
  const instanceUrl = await getCurrentInstance();
  if (instanceUrl === MOCK_INSTANCE_IDENTIFIER) {
    return true;
  }

  return false;
}

/**
 * Enable or disable mock mode
 * @param enabled - Whether mock mode should be enabled
 */
export async function setMockMode(enabled: boolean): Promise<void> {
  await setItem(STORAGE_KEYS.MOCK_MODE, enabled ? 'true' : 'false');
  console.log(`[PStream] Mock mode ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Map raw backend item to MediaItem type
 * Handles various backend response formats gracefully
 */
function mapToMediaItem(raw: Record<string, unknown>): MediaItem {
  // Handle different possible field names from backend
  const id = String(raw.id ?? raw._id ?? raw.tmdbId ?? '');
  const tmdbId = raw.tmdbId ?? raw.tmdb_id ?? raw.id;
  const title = String(raw.title ?? raw.name ?? 'Unknown');
  const poster = raw.poster ?? raw.poster_path ?? raw.image ?? null;
  const backdrop = raw.backdrop ?? raw.backdrop_path ?? null;
  const overview = String(raw.overview ?? raw.description ?? raw.plot ?? '');

  // Determine media type
  let type: MediaItem['type'] = 'unknown';
  if (raw.type === 'movie' || raw.media_type === 'movie') {
    type = 'movie';
  } else if (raw.type === 'tv' || raw.media_type === 'tv' || raw.seasons) {
    type = 'tv';
  } else if (raw.type === 'episode' || raw.episode_number) {
    type = 'episode';
  }

  // Extract year from various date formats
  let year: number | undefined;
  const releaseDate = raw.release_date ?? raw.first_air_date ?? raw.year;
  if (typeof releaseDate === 'string' && releaseDate.length >= 4) {
    year = parseInt(releaseDate.substring(0, 4), 10);
  } else if (typeof releaseDate === 'number') {
    year = releaseDate;
  }

  // Extract rating
  const rating = typeof raw.rating === 'number'
    ? raw.rating
    : typeof raw.vote_average === 'number'
      ? raw.vote_average
      : undefined;

  // Map sources if present
  let sources: Source[] | undefined;
  if (Array.isArray(raw.sources)) {
    sources = raw.sources.map(mapToSource);
  }

  // Log warning if mapping required significant transformation
  if (!raw.id && !raw.tmdbId) {
    console.warn('[PStream] Item missing ID field:', raw);
  }

  return {
    id,
    tmdbId: tmdbId ? String(tmdbId) : undefined,
    title,
    poster: poster ? String(poster) : null,
    backdrop: backdrop ? String(backdrop) : null,
    overview,
    type,
    year,
    rating,
    sources,
    season: typeof raw.season === 'number' ? raw.season : undefined,
    episode: typeof raw.episode === 'number' ? raw.episode : undefined,
    genres: Array.isArray(raw.genres)
      ? raw.genres.map((g: unknown) => (typeof g === 'string' ? g : String((g as { name?: string })?.name ?? g)))
      : undefined,
  };
}

/**
 * Map raw source to Source type
 */
function mapToSource(raw: Record<string, unknown>): Source {
  const url = String(raw.url ?? raw.file ?? raw.src ?? '');
  const provider = String(raw.provider ?? raw.source ?? 'unknown');
  const quality = String(raw.quality ?? raw.label ?? 'auto');

  // Determine source type
  let type: Source['type'] = 'unknown';
  const rawType = String(raw.type ?? '').toLowerCase();
  if (rawType.includes('hls') || url.includes('.m3u8')) {
    type = 'hls';
  } else if (rawType.includes('mp4') || url.includes('.mp4')) {
    type = 'mp4';
  } else if (rawType.includes('dash') || url.includes('.mpd')) {
    type = 'dash';
  }

  return { url, provider, quality, type };
}

/**
 * Fetch home page content
 * @returns Array of MediaItem for the home page
 */
export async function fetchHome(): Promise<MediaItem[]> {
  try {
    // Check for mock mode
    if (await shouldUseMock()) {
      console.log('[PStream] Using mock data for home');
      const mockData = await getMockHome();
      return mockData.items;
    }

    // Fetch from real backend
    const response = await get<HomeResponse | unknown[]>('/backend/home');

    // Handle different response formats
    if (Array.isArray(response)) {
      return response.map(item => mapToMediaItem(item as Record<string, unknown>));
    }

    if (response && typeof response === 'object' && 'items' in response && Array.isArray(response.items)) {
      return response.items.map(item => mapToMediaItem(item as unknown as Record<string, unknown>));
    }

    console.warn('[PStream] Unexpected home response format, returning empty array');
    return [];
  } catch (error) {
    console.error('[PStream] fetchHome error:', error);

    // Fall back to mock on network errors
    if (error instanceof ApiError && error.code === ErrorCodes.NETWORK_ERROR) {
      console.log('[PStream] Falling back to mock data due to network error');
      const mockData = await getMockHome();
      return mockData.items;
    }

    throw error;
  }
}

/**
 * Search for media content
 * @param query - Search query string
 * @returns Array of matching MediaItem
 */
export async function search(query: string): Promise<MediaItem[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    // Check for mock mode
    if (await shouldUseMock()) {
      console.log('[PStream] Using mock data for search');
      const mockData = await getMockSearch(query);
      return mockData.items;
    }

    // Fetch from real backend
    const response = await get<SearchResponse | unknown[]>('/backend/search', {
      q: query,
      query: query, // Some backends use 'query' instead of 'q'
    });

    // Handle different response formats
    if (Array.isArray(response)) {
      return response.map(item => mapToMediaItem(item as Record<string, unknown>));
    }

    if (response && typeof response === 'object' && 'items' in response && Array.isArray(response.items)) {
      return response.items.map(item => mapToMediaItem(item as unknown as Record<string, unknown>));
    }

    console.warn('[PStream] Unexpected search response format, returning empty array');
    return [];
  } catch (error) {
    console.error('[PStream] search error:', error);

    // Fall back to mock on network errors
    if (error instanceof ApiError && error.code === ErrorCodes.NETWORK_ERROR) {
      console.log('[PStream] Falling back to mock data due to network error');
      const mockData = await getMockSearch(query);
      return mockData.items;
    }

    throw error;
  }
}

/**
 * Fetch details for a specific media item
 * @param id - Media item ID
 * @returns MediaItem with full details
 */
export async function fetchDetails(id: string): Promise<MediaItem> {
  try {
    // Check for mock mode
    if (await shouldUseMock()) {
      console.log('[PStream] Using mock data for details');
      return getMockDetails(id);
    }

    // Fetch from real backend
    const response = await get<MediaItem | Record<string, unknown>>(`/backend/details/${id}`);

    return mapToMediaItem(response as Record<string, unknown>);
  } catch (error) {
    console.error('[PStream] fetchDetails error:', error);

    // Fall back to mock on network errors
    if (error instanceof ApiError && error.code === ErrorCodes.NETWORK_ERROR) {
      console.log('[PStream] Falling back to mock data due to network error');
      return getMockDetails(id);
    }

    throw error;
  }
}

/**
 * Fetch streaming sources for a media item
 * @param tmdbId - TMDB ID of the media
 * @returns Array of available Source objects
 */
export async function fetchSources(tmdbId: string): Promise<Source[]> {
  try {
    // Check for mock mode
    if (await shouldUseMock()) {
      console.log('[PStream] Using mock data for sources');
      const mockData = await getMockSources(tmdbId);
      return mockData.sources;
    }

    // Fetch from real backend
    const response = await get<SourcesResponse | unknown[]>(`/backend/sources/${tmdbId}`);

    // Handle different response formats
    if (Array.isArray(response)) {
      return response.map(source => mapToSource(source as Record<string, unknown>));
    }

    if (response && typeof response === 'object' && 'sources' in response && Array.isArray(response.sources)) {
      return response.sources.map(source => mapToSource(source as unknown as Record<string, unknown>));
    }

    console.warn('[PStream] Unexpected sources response format, returning empty array');
    return [];
  } catch (error) {
    console.error('[PStream] fetchSources error:', error);

    // Fall back to mock on network errors
    if (error instanceof ApiError && error.code === ErrorCodes.NETWORK_ERROR) {
      console.log('[PStream] Falling back to mock data due to network error');
      const mockData = await getMockSources(tmdbId);
      return mockData.sources;
    }

    throw error;
  }
}

export default {
  fetchHome,
  search,
  fetchDetails,
  fetchSources,
  setMockMode,
};

