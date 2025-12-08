/**
 * DetailsScreen - Content detail view.
 * Shows movie/show information with play options.
 */
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, radii } = useTheme();

  return (
    <ThemedView variant="background" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Hero Image Placeholder */}
        <View
          style={[
            styles.heroImage,
            styles.heroImageHeight,
            {
              backgroundColor: colors.SURFACE,
            },
          ]}>
          {/* Gradient overlay would go here */}
          <View
            style={[
              styles.heroOverlay,
              {
                padding: spacing.md,
              },
            ]}>
            <ThemedText variant="small" color="accent">
              MOVIE
            </ThemedText>
          </View>
        </View>

        {/* Content Info */}
        <View style={[styles.contentSection, { padding: spacing.md }]}>
          <ThemedText variant="h1" style={{ marginBottom: spacing.xs }}>
            Sample Movie Title
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText variant="small" color="secondary">
              2024
            </ThemedText>
            <ThemedText variant="small" color="muted" style={styles.metaDot}>
              •
            </ThemedText>
            <ThemedText variant="small" color="secondary">
              2h 15m
            </ThemedText>
            <ThemedText variant="small" color="muted" style={styles.metaDot}>
              •
            </ThemedText>
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
              <ThemedText variant="small">8.5</ThemedText>
            </View>
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
              onPress={() => navigation.navigate('Player')}
              activeOpacity={0.8}>
              <ThemedText variant="body" style={styles.playButtonText}>
                ▶ Play
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.CARD,
                  borderRadius: radii.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                },
              ]}
              activeOpacity={0.8}>
              <ThemedText variant="body">+</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.CARD,
                  borderRadius: radii.md,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  marginLeft: spacing.sm,
                },
              ]}
              activeOpacity={0.8}>
              <ThemedText variant="body">↓</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={[styles.descriptionSection, { marginTop: spacing.lg }]}>
            <ThemedText variant="body" color="secondary">
              A compelling story about adventure and discovery. This is placeholder
              description text that would normally contain the full synopsis of
              the movie or TV show. The dark theme makes it easy to read even in
              low light conditions.
            </ThemedText>
          </View>

          {/* Genres */}
          <View style={[styles.genresSection, { marginTop: spacing.lg }]}>
            <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
              Genres
            </ThemedText>
            <View style={styles.genresList}>
              {['Action', 'Adventure', 'Sci-Fi'].map(genre => (
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
                    },
                  ]}>
                  <ThemedText variant="small" color="secondary">
                    {genre}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Cast Section */}
          <View style={[styles.castSection, { marginTop: spacing.lg }]}>
            <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
              Cast
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'].map((actor, index) => (
                <View
                  key={index}
                  style={[
                    styles.castItem,
                    { marginRight: spacing.md },
                  ]}>
                  <View
                    style={[
                      styles.castAvatar,
                      styles.castAvatarRound,
                      {
                        backgroundColor: colors.CARD,
                        marginBottom: spacing.xs,
                      },
                    ]}
                  />
                  <ThemedText variant="small" color="secondary">
                    {actor}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Similar Content */}
          <View style={[styles.similarSection, { marginTop: spacing.lg }]}>
            <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
              More Like This
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.similarItem,
                    styles.similarItemSize,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.md,
                      marginRight: spacing.sm,
                    },
                  ]}
                  activeOpacity={0.7}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionSection: {},
  genresSection: {},
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {},
  castSection: {},
  castItem: {
    alignItems: 'center',
  },
  castAvatar: {
    width: 60,
    height: 60,
  },
  castAvatarRound: {
    borderRadius: 30,
  },
  similarSection: {},
  similarItem: {},
  similarItemSize: {
    width: 120,
    height: 180,
  },
});

export default DetailsScreen;
