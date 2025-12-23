/**
 * HomeScreen - P-Stream home experience
 * - Hero banner
 * - Horizontal carousels using FlatList
 * - React Query for caching and offline
 */
import React, { useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchHome, fetchDetails, fetchSources } from '../api/pstream';
import type { MediaItem } from '../api/types';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import PosterCard from '../components/PosterCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;

interface RowData {
  key: string;
  title: string;
  items: MediaItem[];
  showProgress?: boolean;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { colors, spacing, radii } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const viewportWidth = windowWidth || SCREEN_WIDTH;

  const cachedHome = queryClient.getQueryData<MediaItem[]>(['home']);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<MediaItem[]>({
    queryKey: ['home'],
    queryFn: fetchHome,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // gcTime replaces cacheTime in react-query v5
    networkMode: 'offlineFirst',
    retry: 1,
    placeholderData: cachedHome,
  });

  const hasData = Boolean(data?.length);
  // Prefetch details for first 6 items (top carousel)
  useEffect(() => {
    if (!data || data.length === 0) return;
    const top = data.slice(0, 6);
    top.forEach((item: MediaItem) => {
      queryClient.prefetchQuery({
        queryKey: ['details', item.id],
        queryFn: () => fetchDetails(item.id),
        staleTime: 10 * 60 * 1000,
      });
    });
  }, [data, queryClient]);

  const heroItem = data?.[0];
  const libraryItems = useMemo(() => data?.slice(1) ?? [], [data]);
  const continueWatching = useMemo(
    () => libraryItems.filter(item => typeof item.progress === 'number' && item.progress > 0),
    [libraryItems],
  );

  const posterWidth = useMemo(() => {
    const baseColumns = Math.max(2, Math.floor((viewportWidth - spacing.md * 2) / 140));
    const gap = spacing.sm;
    return Math.floor((viewportWidth - spacing.md * 2 - gap * (baseColumns - 1)) / baseColumns);
  }, [viewportWidth, spacing]);

  const rows: RowData[] = useMemo(() => {
    if (!libraryItems || libraryItems.length === 0) return [];

    const trending = libraryItems.slice(0, 12);
    const popular = libraryItems.slice(12, 24);
    const newReleases = libraryItems.slice(24, 36);

    const list: RowData[] = [];
    if (continueWatching.length) {
      list.push({ key: 'continue', title: 'Continue Watching', items: continueWatching, showProgress: true });
    }
    if (trending.length) list.push({ key: 'trending', title: 'Trending', items: trending });
    if (popular.length) list.push({ key: 'popular', title: 'Popular', items: popular });
    if (newReleases.length) list.push({ key: 'new', title: 'New Releases', items: newReleases });

    return list;
  }, [libraryItems, continueWatching]);

  const onPressCard = useCallback((item: MediaItem) => {
    navigation.navigate('Details', { id: item.id });
  }, [navigation]);

  const handleWatchHero = useCallback(async () => {
    if (!heroItem) return;
    if (heroItem.tmdbId) {
      // Prefetch sources; fall back to player navigation
      queryClient.prefetchQuery({
        queryKey: ['sources', heroItem.tmdbId],
        queryFn: () => fetchSources(heroItem.tmdbId!),
        staleTime: 5 * 60 * 1000,
      });
      
      navigation.navigate('Player', {
        tmdbId: heroItem.tmdbId,
        type: heroItem.type === 'tv' ? 'tv' : 'movie',
        title: heroItem.title,
        poster: heroItem.poster || undefined,
      });
    }
  }, [heroItem, navigation, queryClient]);

  const renderHero = useCallback(() => {
    if (!heroItem) return null;

    const backdrop = heroItem.backdrop ?? heroItem.poster ?? undefined;

    return (
      <View
        style={[
          styles.heroContainer,
          {
            marginBottom: spacing.md,
            backgroundColor: colors.SURFACE,
            borderRadius: radii.md,
          },
        ]}>
        {backdrop ? (
          <Image
            source={{ uri: backdrop }}
            style={[styles.heroImage, { height: Math.round(SCREEN_WIDTH * 0.56) }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            style={[
              styles.heroImage,
              {
                height: Math.round(SCREEN_WIDTH * 0.56),
                backgroundColor: colors.SURFACE,
              },
            ]}
          />
        )}
        <View style={{ padding: spacing.md }}>
          <ThemedText variant="h1" numberOfLines={1}>
            {heroItem.title}
          </ThemedText>
          <ThemedText variant="body" color="secondary" numberOfLines={2} style={{ marginTop: spacing.xs }}>
            {heroItem.overview || ''}
          </ThemedText>
          <View style={[styles.heroButtonRow, { marginTop: spacing.md }]}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Watch now"
              onPress={handleWatchHero}
              activeOpacity={0.85}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.PRIMARY,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.lg,
                  borderRadius: radii.sm,
                  marginRight: spacing.sm,
                },
              ]}>
              <ThemedText variant="body">Watch</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="More info"
              onPress={() => navigation.navigate('Details', { id: heroItem.id })}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.CARD,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                borderRadius: radii.sm,
              }}>
              <ThemedText variant="body" color="secondary">More Info</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [heroItem, colors, spacing, radii, handleWatchHero, navigation]);

  const renderRow = useCallback(({ item }: { item: RowData }) => {
    return (
      <View style={[styles.rowContainer, { marginBottom: spacing.lg }]}>
        <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
          {item.title}
        </ThemedText>
        <FlatList
          data={item.items}
          keyExtractor={(m) => m.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          getItemLayout={(_, index) => ({
            length: posterWidth + spacing.sm,
            offset: (posterWidth + spacing.sm) * index,
            index,
          })}
          renderItem={({ item: media }) => (
            <PosterCard
              item={media}
              width={posterWidth}
              onPress={onPressCard}
              showProgress={item.showProgress ?? typeof media.progress === 'number'}
              progress={media.progress ?? 0}
              containerStyle={{ marginRight: spacing.sm }}
            />
          )}
        />
      </View>
    );
  }, [onPressCard, posterWidth, spacing]);

  const keyExtractor = useCallback((row: RowData) => row.key, []);

  const renderContent = () => {
    if (isLoading && !hasData) {
      return <SkeletonHome posterWidth={posterWidth} />;
    }
    if (isError && !hasData) {
      return (
        <ErrorView onRetry={refetch} />
      );
    }
    if (!hasData) {
      return <EmptyState onRetry={refetch} />;
    }
    return (
      <FlatList
        data={rows}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            {renderHero()}
            {isError ? <OfflineBanner onRetry={refetch} /> : null}
          </>
        }
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}
        renderItem={renderRow}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={colors.TEXT_PRIMARY}
          />
        }
        ListEmptyComponent={<EmptyState onRetry={refetch} />}
      />
    );
  };

  return (
    <ThemedView variant="background" style={styles.container}>
      {renderContent()}
    </ThemedView>
  );
};

const SkeletonHome: React.FC<{ posterWidth: number }> = ({ posterWidth }) => {
  const { colors, spacing, radii } = useTheme();
  const heroHeight = Math.round(SCREEN_WIDTH * 0.56);
  return (
    <View style={[styles.skeletonContainer, { padding: spacing.md }]}>
      <View
        style={[
          styles.skeletonHero,
          {
          height: heroHeight,
          backgroundColor: colors.SURFACE,
          borderRadius: radii.md,
          marginBottom: spacing.lg,
          },
        ]}
      />
      {[0, 1, 2].map(row => (
        <View key={row} style={[styles.skeletonRow, { marginBottom: spacing.lg }]}>
          <View style={[styles.skeletonTitle, { backgroundColor: colors.SURFACE, marginBottom: spacing.sm, borderRadius: radii.sm }]} />
          <View style={styles.skeletonCarousel}>
            {[0, 1, 2, 3].map(i => (
              <View
                key={i}
                style={[
                  styles.skeletonPoster,
                  {
                    width: posterWidth,
                    height: Math.round(posterWidth * 1.5),
                    backgroundColor: colors.SURFACE,
                    borderRadius: radii.md,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const ErrorView: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={[styles.errorContainer, { padding: spacing.lg }]}>
      <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>Something went wrong</ThemedText>
      <ThemedText variant="body" color="secondary" style={{ marginBottom: spacing.lg }}>Please check your connection and try again.</ThemedText>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Retry loading home"
        onPress={onRetry}
        activeOpacity={0.85}
        style={{
          backgroundColor: colors.PRIMARY,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.sm,
        }}>
        <ThemedText variant="body">Retry</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const EmptyState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={[styles.emptyContainer, { padding: spacing.lg }]}>
      <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>Nothing to show yet</ThemedText>
      <ThemedText variant="body" color="secondary" style={{ marginBottom: spacing.lg }}>
        Content will appear when we can reach the service.
      </ThemedText>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Retry loading home"
        onPress={onRetry}
        activeOpacity={0.85}
        style={{
          backgroundColor: colors.CARD,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.sm,
        }}>
        <ThemedText variant="body">Retry</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const OfflineBanner: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={[styles.offlineBanner, { backgroundColor: colors.CARD, borderRadius: radii.sm, padding: spacing.md, marginBottom: spacing.md }]}>
      <View style={styles.offlineRow}>
        <View style={[styles.offlineDot, { backgroundColor: colors.WARNING, marginRight: spacing.sm }]} />
        <ThemedText variant="body" color="secondary" style={styles.offlineText}>
          Showing cached content. You appear to be offline.
        </ThemedText>
        <TouchableOpacity onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry sync">
          <ThemedText variant="body" color="accent">Retry</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
  },
  heroButtonRow: {
    flexDirection: 'row',
  },
  primaryButton: {},
  rowContainer: {},
  skeletonContainer: {},
  skeletonHero: {},
  skeletonRow: {},
  skeletonTitle: {
    width: 120,
    height: 20,
  },
  skeletonCarousel: {
    flexDirection: 'row',
  },
  skeletonPoster: {
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBanner: {},
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  offlineText: {
    flex: 1,
  },
});

export default HomeScreen;
