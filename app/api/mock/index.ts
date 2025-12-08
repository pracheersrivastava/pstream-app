/**
 * Mock data provider for local development.
 * Used when backend is unreachable or mock mode is enabled.
 */
import type { MediaItem, Source, HomeResponse, SearchResponse, SourcesResponse } from '../types';

// Import mock data
import homeData from './homeData.json';
import searchData from './searchData.json';
import sourcesData from './sourcesData.json';

/**
 * Simulate network delay for realistic testing
 */
async function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get mock home data
 */
export async function getMockHome(): Promise<HomeResponse> {
  await simulateDelay();
  return homeData as HomeResponse;
}

/**
 * Get mock search results
 * @param query - Search query (used to filter mock results)
 */
export async function getMockSearch(query: string): Promise<SearchResponse> {
  await simulateDelay();

  // Simple filtering for mock data
  const lowerQuery = query.toLowerCase();
  const filteredItems = (searchData.items as MediaItem[]).filter(
    item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.overview.toLowerCase().includes(lowerQuery),
  );

  return {
    items: filteredItems,
    totalResults: filteredItems.length,
    page: 1,
    totalPages: 1,
  };
}

/**
 * Get mock media details
 * @param id - Media ID
 */
export async function getMockDetails(id: string): Promise<MediaItem> {
  await simulateDelay();

  // Find item in mock data
  const allItems = [
    ...(homeData.items as MediaItem[]),
    ...(searchData.items as MediaItem[]),
  ];

  const item = allItems.find(i => i.id === id || i.tmdbId === id);

  if (item) {
    return {
      ...item,
      sources: sourcesData.sources as Source[],
    };
  }

  // Return a default mock item if not found
  return {
    id,
    title: `Mock Item ${id}`,
    poster: null,
    overview: 'This is a mock media item for development testing.',
    type: 'movie',
    year: 2024,
    rating: 7.5,
    sources: sourcesData.sources as Source[],
  };
}

/**
 * Get mock sources
 * @param tmdbId - TMDB ID
 */
export async function getMockSources(tmdbId: string): Promise<SourcesResponse> {
  await simulateDelay();
  console.log(`[Mock] Getting sources for TMDB ID: ${tmdbId}`);
  return sourcesData as SourcesResponse;
}

export default {
  getMockHome,
  getMockSearch,
  getMockDetails,
  getMockSources,
};

