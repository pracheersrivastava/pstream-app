/**
 * HomeScreen - Main home screen with featured content.
 * Demonstrates usage of theme tokens and themed components.
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

/**
 * Placeholder poster component for content grid
 */
const PosterPlaceholder: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ title, onPress }) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.poster,
        {
          backgroundColor: colors.CARD,
          borderRadius: radii.md,
          marginRight: spacing.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Placeholder image area */}
      <View
        style={[
          styles.posterImage,
          {
            backgroundColor: colors.SURFACE,
            borderTopLeftRadius: radii.md,
            borderTopRightRadius: radii.md,
          },
        ]}
      />
      <View style={[styles.posterInfo, { padding: spacing.sm }]}>
        <ThemedText variant="small" numberOfLines={2}>
          {title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Primary button component
 */
const PrimaryButton: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ title, onPress }) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          backgroundColor: colors.PRIMARY,
          borderRadius: radii.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <ThemedText variant="body" style={styles.buttonText}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

/**
 * Secondary button component
 */
const SecondaryButton: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ title, onPress }) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.secondaryButton,
        styles.secondaryButtonBase,
        {
          borderColor: colors.MUTED,
          borderRadius: radii.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <ThemedText variant="body" color="secondary">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, radii } = useTheme();

  // Placeholder content data
  const featuredContent = [
    { id: '1', title: 'Popular Movie 1' },
    { id: '2', title: 'Trending Series' },
    { id: '3', title: 'New Release' },
    { id: '4', title: 'Top Rated' },
  ];

  return (
    <ThemedView variant="background" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Hero Section */}
        <View
          style={[
            styles.heroSection,
            {
              backgroundColor: colors.SURFACE,
              padding: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}>
          <ThemedText variant="h1" style={styles.heroTitle}>
            Welcome to PStream
          </ThemedText>
          <ThemedText
            variant="body"
            color="secondary"
            style={{ marginBottom: spacing.md }}>
            Discover and stream your favorite content
          </ThemedText>

          {/* Button row */}
          <View style={styles.buttonRow}>
            <PrimaryButton
              title="Browse Content"
              onPress={() => navigation.navigate('Details')}
            />
            <View style={{ width: spacing.sm }} />
            <SecondaryButton
              title="View Library"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Featured Section */}
        <View style={[styles.section, { paddingHorizontal: spacing.md }]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Featured
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.md }}>
            {featuredContent.map(item => (
              <PosterPlaceholder
                key={item.id}
                title={item.title}
                onPress={() => navigation.navigate('Details')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Continue Watching Section */}
        <View
          style={[
            styles.section,
            { paddingHorizontal: spacing.md, marginTop: spacing.lg },
          ]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Continue Watching
          </ThemedText>

          {/* Card with progress indicator */}
          <View
            style={[
              styles.continueCard,
              {
                backgroundColor: colors.CARD,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}>
            <View style={styles.continueCardContent}>
              <View
                style={[
                  styles.continueThumbnail,
                  {
                    backgroundColor: colors.SURFACE,
                    borderRadius: radii.sm,
                    marginRight: spacing.md,
                  },
                ]}
              />
              <View style={styles.continueInfo}>
                <ThemedText variant="body">Last Watched Title</ThemedText>
                <ThemedText variant="small" color="secondary">
                  Episode 5 • 23 min left
                </ThemedText>
                {/* Progress bar */}
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: colors.MUTED,
                      borderRadius: radii.sm,
                      marginTop: spacing.sm,
                    },
                  ]}>
                <View
                  style={[
                    styles.progressFill,
                    styles.progressFillWidth,
                    {
                      backgroundColor: colors.PRIMARY,
                      borderRadius: radii.sm,
                    },
                  ]}
                />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View
          style={[
            styles.section,
            { paddingHorizontal: spacing.md, marginTop: spacing.lg },
          ]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Categories
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {['Action', 'Comedy', 'Drama', 'Sci-Fi'].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: colors.CARD,
                    borderRadius: radii.sm,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    marginRight: spacing.sm,
                    marginBottom: spacing.sm,
                  },
                ]}
                activeOpacity={0.7}>
                <ThemedText variant="small">{category}</ThemedText>
              </TouchableOpacity>
            ))}
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
  heroSection: {},
  heroTitle: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {},
  secondaryButton: {},
  secondaryButtonBase: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '600',
  },
  section: {},
  poster: {
    width: 120,
    height: 180,
  },
  posterImage: {
    width: '100%',
    height: 130,
  },
  posterInfo: {},
  continueCard: {},
  continueCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueThumbnail: {
    width: 80,
    height: 60,
  },
  continueInfo: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  progressFillWidth: {
    width: '65%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {},
});

export default HomeScreen;
