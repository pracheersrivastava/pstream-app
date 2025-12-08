/**
 * SearchScreen - Search functionality for content discovery.
 * Demonstrates themed search UI components.
 */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

const SearchScreen: React.FC = () => {
  const { colors, spacing, radii, typography } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder recent searches
  const recentSearches = ['Action Movies', 'Comedy Series', 'Documentary'];

  // Placeholder trending topics
  const trendingTopics = [
    { id: '1', title: 'Trending Movie 1', category: 'Movie' },
    { id: '2', title: 'Popular Series', category: 'TV Show' },
    { id: '3', title: 'New Documentary', category: 'Documentary' },
  ];

  return (
    <ThemedView variant="background" style={styles.container}>
      {/* Search Header */}
      <View style={[styles.header, { padding: spacing.md }]}>
        <ThemedText variant="h1" style={{ marginBottom: spacing.md }}>
          Search
        </ThemedText>

        {/* Search Input */}
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: colors.SURFACE,
              borderRadius: radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.TEXT_PRIMARY,
                fontSize: typography.fontSize.body,
              },
            ]}
            placeholder="Search movies, shows, genres..."
            placeholderTextColor={colors.MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Recent Searches */}
        <View style={[styles.section, { paddingHorizontal: spacing.md }]}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h2">Recent Searches</ThemedText>
            <TouchableOpacity>
              <ThemedText variant="small" color="accent">
                Clear
              </ThemedText>
            </TouchableOpacity>
          </View>

          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.recentItem,
                {
                  backgroundColor: colors.CARD,
                  borderRadius: radii.sm,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
              activeOpacity={0.7}>
              <ThemedText variant="body">{search}</ThemedText>
              <ThemedText variant="small" color="muted">
                ×
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending */}
        <View
          style={[
            styles.section,
            { paddingHorizontal: spacing.md, marginTop: spacing.lg },
          ]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Trending Now
          </ThemedText>

          {trendingTopics.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.trendingItem,
                {
                  backgroundColor: colors.CARD,
                  borderRadius: radii.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
              activeOpacity={0.7}>
              {/* Placeholder thumbnail */}
              <View
                style={[
                  styles.trendingThumbnail,
                  {
                    backgroundColor: colors.SURFACE,
                    borderRadius: radii.sm,
                    marginRight: spacing.md,
                  },
                ]}
              />
              <View style={styles.trendingInfo}>
                <ThemedText variant="body">{item.title}</ThemedText>
                <ThemedText variant="small" color="secondary">
                  {item.category}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Browse Categories */}
        <View
          style={[
            styles.section,
            { paddingHorizontal: spacing.md, marginTop: spacing.lg },
          ]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Browse by Category
          </ThemedText>

          <View style={styles.categoriesGrid}>
            {[
              { name: 'Action', color: colors.ERROR },
              { name: 'Comedy', color: colors.WARNING },
              { name: 'Drama', color: colors.PRIMARY },
              { name: 'Horror', color: colors.MUTED },
              { name: 'Romance', color: colors.ACCENT },
              { name: 'Sci-Fi', color: colors.SUCCESS },
            ].map(category => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.CARD,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    borderLeftWidth: 4,
                    borderLeftColor: category.color,
                  },
                ]}
                activeOpacity={0.7}>
                <ThemedText variant="body">{category.name}</ThemedText>
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
  header: {},
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingThumbnail: {
    width: 60,
    height: 60,
  },
  trendingInfo: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
  },
});

export default SearchScreen;
