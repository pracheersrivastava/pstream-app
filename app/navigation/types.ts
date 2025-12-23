export type RootStackParamList = {
  Main: undefined;
  Details: { id: string } | undefined;
  Player: { tmdbId: string; type: 'movie' | 'tv'; title?: string; poster?: string };
};

export type TabParamList = {
  Home: undefined;
  Latest: undefined;
  LatestTV: undefined;
  Search: undefined;
  Settings: undefined;
};

