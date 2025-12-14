/**
 * SearchScreen - Search functionality for content discovery.
 * Uses react-query with debounced input, grid layout, and reusable PosterCard.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { search } from '../api/pstream';
import type { MediaItem } from '../api/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import PosterCard from '../components/PosterCard';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DEBOUNCE_MS = 300;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();
  const { colors, spacing, radii, typography } = useTheme();
  const { width } = useWindowDimensions();
  const viewportWidth = width || 390;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(searchQuery.trim()), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      queryClient.prefetchQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: () => search(debouncedQuery),
        staleTime: 60 * 1000,
      });
    }
  }, [debouncedQuery, queryClient]);

  const queryEnabled = debouncedQuery.length >= 2;

  const {
    data,
    isFetching,
    isError,
    refetch,
  } = useQuery<MediaItem[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: queryEnabled,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    networkMode: 'offlineFirst',
  });

  const columns = useMemo(
    () => Math.max(2, Math.floor((viewportWidth - spacing.md * 2) / 150)),
    [viewportWidth, spacing],
  );
  const posterWidth = useMemo(() => {
    const gap = spacing.sm;
    return Math.floor((viewportWidth - spacing.md * 2 - gap * (columns - 1)) / columns);
  }, [viewportWidth, spacing, columns]);

  const results = queryEnabled ? data ?? [] : [];
  const showIdle = debouncedQuery.length === 0;
  const showLoading = isFetching && queryEnabled && results.length === 0;
  const showEmpty = !showLoading && !isError && queryEnabled && results.length === 0;
  const showError = isError && results.length === 0 && queryEnabled;

  const handlePress = useCallback((item: MediaItem) => {
    navigation.navigate('Details', { id: item.id });
  }, [navigation]);

  const clearQuery = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const handleRetry = useCallback(() => {
    if (queryEnabled) {
      refetch();
    }
  }, [queryEnabled, refetch]);

  const columnWrapperStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.columnWrapper,
      columns > 1 ? styles.columnMulti : styles.columnSingle,
      { marginBottom: spacing.md },
    ],
    [columns, spacing.md],
  );

  const searchInputContainerStyle = useMemo(
    () => [
      styles.searchInputContainer,
      {
        backgroundColor: colors.SURFACE,
        borderRadius: radii.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderColor: colors.CARD,
      },
    ],
    [colors.CARD, colors.SURFACE, radii.md, spacing.md, spacing.sm],
  );

  const gridCardStyle = useMemo(() => styles.gridCard, []);
  const footerStyle = useMemo(
    () => [styles.footer, { paddingVertical: spacing.md }],
    [spacing.md],
  );
  const listContentStyle = useMemo(
    () => ({
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    }),
    [spacing.md, spacing.xl],
  );

  const skeletonItems = useMemo(
    () => Array.from({ length: Math.max(4, columns * 2) }),
    [columns],
  );

  return (
    <ThemedView variant="background" style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        numColumns={columns}
        columnWrapperStyle={columnWrapperStyle}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={listContentStyle}
        ListHeaderComponent={
          <View style={[styles.header, { paddingVertical: spacing.md }]}>
            <ThemedText variant="h1" style={{ marginBottom: spacing.md }}>
              Search
            </ThemedText>
            <View
              style={searchInputContainerStyle}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    color: colors.TEXT_PRIMARY,
                    fontSize: typography.fontSize.body,
                  },
                ]}
                placeholder="Search movies & shows"
                placeholderTextColor={colors.MUTED}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => setDebouncedQuery(searchQuery.trim())}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearQuery} accessibilityRole="button" accessibilityLabel="Clear search">
                  <ThemedText variant="small" color="accent">Clear</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            {isFetching && results.length > 0 ? (
              <View style={[styles.inlineStatus, { marginTop: spacing.sm }]}>
                <ActivityIndicator color={colors.PRIMARY} size="small" />
                <ThemedText variant="small" color="secondary" style={{ marginLeft: spacing.xs }}>
                  Updating results...
                </ThemedText>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <PosterCard
            item={item}
            width={posterWidth}
            onPress={handlePress}
            showProgress={typeof item.progress === 'number'}
            progress={item.progress ?? 0}
            containerStyle={gridCardStyle}
            titleLines={2}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.emptyState, { paddingVertical: spacing.xl }]}>
            {showIdle && (
              <>
                <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>Find something to watch</ThemedText>
                <ThemedText variant="body" color="secondary">
                  Start typing to search the catalogue.
                </ThemedText>
              </>
            )}
            {showLoading && (
              <FlatList
                data={skeletonItems}
                keyExtractor={(_, idx) => `skeleton-${idx}`}
                numColumns={columns}
                columnWrapperStyle={columnWrapperStyle}
                scrollEnabled={false}
                renderItem={() => (
                  <View
                    style={[
                      styles.skeletonCard,
                      {
                        width: posterWidth,
                        height: Math.round(posterWidth * 1.5),
                        borderRadius: radii.md,
                        marginBottom: spacing.md,
                        backgroundColor: colors.SURFACE,
                      },
                    ]}
                  />
                )}
              />
            )}
            {showEmpty && (
              <>
                <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>No matches</ThemedText>
                <ThemedText variant="body" color="secondary">Try a different title or keyword.</ThemedText>
              </>
            )}
            {showError && (
              <>
                <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>Unable to search</ThemedText>
                <ThemedText variant="body" color="secondary" style={{ marginBottom: spacing.md }}>
                  {queryEnabled ? 'Check your connection or try again.' : "You're offline."}
                </ThemedText>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.CARD,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                    borderRadius: radii.sm,
                  }}
                  onPress={handleRetry}
                  accessibilityRole="button"
                  accessibilityLabel="Retry search">
                  <ThemedText variant="body" color="accent">Retry</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          isFetching && results.length > 0 ? (
            <View style={footerStyle}>
              <ActivityIndicator color={colors.PRIMARY} />
            </View>
          ) : null
        }
        removeClippedSubviews
        initialNumToRender={6}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnWrapper: {},
  columnMulti: {
    justifyContent: 'space-between',
  },
  columnSingle: {
    justifyContent: 'flex-start',
  },
  gridCard: {
    marginRight: 0,
  },
  footer: {
    alignItems: 'center',
  },
});

export default SearchScreen;
