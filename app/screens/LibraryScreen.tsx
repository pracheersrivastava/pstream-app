/**
 * LibraryScreen - User's saved content library.
 * Displays watchlist, favorites, and download history.
 */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

type TabType = 'watchlist' | 'favorites' | 'downloads';

const LibraryScreen: React.FC = () => {
  const { colors, spacing, radii } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');

  // Placeholder library data
  const libraryData: Record<TabType, Array<{ id: string; title: string; info: string }>> = {
    watchlist: [
      { id: '1', title: 'Movie to Watch', info: '2h 15m • Action' },
      { id: '2', title: 'Series in Queue', info: 'Season 1 • 10 episodes' },
    ],
    favorites: [
      { id: '1', title: 'Favorite Movie', info: '2019 • Drama' },
      { id: '2', title: 'Loved Series', info: '3 Seasons • Comedy' },
    ],
    downloads: [
      { id: '1', title: 'Downloaded Movie', info: '1.2 GB • Ready to watch' },
    ],
  };

  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'watchlist', label: 'Watchlist' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'downloads', label: 'Downloads' },
  ];

  return (
    <ThemedView variant="background" style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { padding: spacing.md }]}>
        <ThemedText variant="h1">Library</ThemedText>
      </View>

      {/* Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            paddingHorizontal: spacing.md,
            marginBottom: spacing.md,
          },
        ]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab.key ? colors.PRIMARY : colors.CARD,
                borderRadius: radii.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                marginRight: spacing.sm,
              },
            ]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}>
            <ThemedText
              variant="small"
              color={activeTab === tab.key ? 'primary' : 'secondary'}>
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xl,
        }}>
        {libraryData[activeTab].length === 0 ? (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: colors.CARD,
                borderRadius: radii.md,
                padding: spacing.xl,
              },
            ]}>
            <ThemedText variant="body" color="secondary" style={styles.emptyText}>
              No items in your {activeTab}
            </ThemedText>
          </View>
        ) : (
          libraryData[activeTab].map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.libraryItem,
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
                  styles.thumbnail,
                  {
                    backgroundColor: colors.SURFACE,
                    borderRadius: radii.sm,
                    marginRight: spacing.md,
                  },
                ]}
              />
              <View style={styles.itemInfo}>
                <ThemedText variant="body">{item.title}</ThemedText>
                <ThemedText variant="small" color="secondary">
                  {item.info}
                </ThemedText>
              </View>
              {/* More options indicator */}
              <ThemedText variant="body" color="muted">
                •••
              </ThemedText>
            </TouchableOpacity>
          ))
        )}

        {/* Stats Card */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: colors.CARD,
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.lg,
            },
          ]}>
          <ThemedText variant="h2" style={{ marginBottom: spacing.sm }}>
            Library Stats
          </ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText variant="h1" color="accent">
                12
              </ThemedText>
              <ThemedText variant="small" color="secondary">
                In Watchlist
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText variant="h1" color="accent">
                8
              </ThemedText>
              <ThemedText variant="small" color="secondary">
                Favorites
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText variant="h1" color="accent">
                3
              </ThemedText>
              <ThemedText variant="small" color="secondary">
                Downloaded
              </ThemedText>
            </View>
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
  tabBar: {
    flexDirection: 'row',
  },
  tab: {},
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 60,
  },
  itemInfo: {
    flex: 1,
  },
  statsCard: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});

export default LibraryScreen;
