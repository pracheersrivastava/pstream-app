import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { fetchDetails } from '../api/pstream';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsScreenRouteProp>();
  const { id } = route.params || {};
  const { colors, spacing, radii } = useTheme();

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['details', id],
    queryFn: () => fetchDetails(id || ''),
    enabled: !!id,
  });

  const handlePlay = useCallback(async () => {
    if (!item?.tmdbId) return;
    
    navigation.navigate('Player', {
      tmdbId: item.tmdbId,
      type: item.type === 'tv' ? 'tv' : 'movie',
      title: item.title,
      poster: item.poster || undefined,
    });
  }, [item, navigation]);

  if (isLoading) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </ThemedView>
    );
  }

  if (isError || !item) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ThemedText style={{ marginBottom: spacing.md }}>Failed to load details</ThemedText>
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            backgroundColor: colors.PRIMARY,
            padding: spacing.sm,
            borderRadius: radii.sm,
          }}>
          <ThemedText>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const backdrop = item.backdrop || item.poster;

  return (
    <ThemedView variant="background" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Hero Image */}
        <View style={[styles.heroImage, styles.heroImageHeight]}>
          {backdrop ? (
            <Image
              source={{ uri: backdrop }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.SURFACE }]} />
          )}
          <View
            style={[
              styles.heroOverlay,
              styles.heroOverlayContent,
              {
                padding: spacing.md,
              },
            ]}>
            <ThemedText variant="small" color="accent">
              {item.type === 'tv' ? 'TV SHOW' : 'MOVIE'}
            </ThemedText>
          </View>
        </View>

        {/* Content Info */}
        <View style={[styles.contentSection, { padding: spacing.md }]}>
          <ThemedText variant="h1" style={{ marginBottom: spacing.xs }}>
            {item.title}
          </ThemedText>

          <View style={styles.metaRow}>
            {item.year && (
              <>
                <ThemedText variant="small" color="secondary">
                  {item.year}
                </ThemedText>
                <ThemedText variant="small" color="muted" style={styles.metaDot}>
                  •
                </ThemedText>
              </>
            )}
            {item.rating && (
              <View
                style={[
                  styles.ratingBadge,
                  styles.ratingBadgeBase,
                  {
                    backgroundColor: colors.SUCCESS,
                    borderRadius: radii.sm,
                    paddingHorizontal: spacing.sm,
                  },
                ]}>
                <ThemedText variant="small">{item.rating.toFixed(1)}</ThemedText>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={[styles.actionButtons, { marginTop: spacing.lg }]}>
            <TouchableOpacity
              style={[
                styles.playButton,
                styles.playButtonFlex,
                {
                  backgroundColor: colors.PRIMARY,
                  borderRadius: radii.md,
                  paddingVertical: spacing.md,
                  marginRight: spacing.sm,
                },
              ]}
              onPress={handlePlay}
              activeOpacity={0.8}>
              <ThemedText variant="body" style={styles.playButtonText}>
                ▶ Play
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={[styles.descriptionSection, { marginTop: spacing.lg }]}>
            <ThemedText variant="body" color="secondary">
              {item.overview}
            </ThemedText>
          </View>

          {/* Genres */}
          {item.genres && (
            <View style={[styles.genresSection, { marginTop: spacing.lg }]}>
              <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
                Genres
              </ThemedText>
              <View style={styles.genresList}>
                {item.genres.map((genre) => (
                  <View
                    key={genre}
                    style={[
                      styles.genreChip,
                      {
                        backgroundColor: colors.CARD,
                        borderRadius: radii.sm,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.sm,
                        marginRight: spacing.sm,
                        marginBottom: spacing.sm,
                      },
                    ]}>
                    <ThemedText variant="small" color="secondary">
                      {genre}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  heroImageHeight: {
    height: 250,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  contentSection: {},
  heroOverlayContent: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaDot: {
    marginHorizontal: 8,
  },
  ratingBadge: {},
  ratingBadgeBase: {
    paddingVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    alignItems: 'center',
  },
  playButtonFlex: {
    flex: 1,
  },
  playButtonText: {
    fontWeight: '600',
  },
  descriptionSection: {},
  genresSection: {},
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {},
});

export default DetailsScreen;
