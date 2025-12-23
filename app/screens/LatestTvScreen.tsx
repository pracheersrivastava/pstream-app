import React, { useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { fetchLatestTV } from '../api/pstream';
import type { MediaItem } from '../api/types';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import PosterCard from '../components/PosterCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;

const LatestTvScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, radii } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const viewportWidth = windowWidth || SCREEN_WIDTH;

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<MediaItem[]>({
    queryKey: ['latesttv'],
    queryFn: fetchLatestTV,
    staleTime: 5 * 60 * 1000,
  });

  const posterWidth = React.useMemo(() => {
    const baseColumns = Math.max(3, Math.floor((viewportWidth - spacing.md * 2) / 110));
    const gap = spacing.sm;
    return Math.floor((viewportWidth - spacing.md * 2 - gap * (baseColumns - 1)) / baseColumns);
  }, [viewportWidth, spacing]);

  const numColumns = React.useMemo(() => {
    return Math.max(3, Math.floor((viewportWidth - spacing.md * 2) / 110));
  }, [viewportWidth, spacing]);

  const onPressCard = useCallback((item: MediaItem) => {
    navigation.navigate('Details', { id: item.id });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: MediaItem }) => (
    <PosterCard
      item={item}
      width={posterWidth}
      onPress={onPressCard}
      containerStyle={{ marginBottom: spacing.md, marginRight: spacing.sm }}
    />
  ), [onPressCard, posterWidth, spacing]);

  if (isLoading) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ThemedText>Loading latest TV shows...</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ThemedText style={{ marginBottom: spacing.md }}>Failed to load latest TV shows</ThemedText>
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

  return (
    <ThemedView variant="background" style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.TEXT_PRIMARY}
          />
        }
      />
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
});

export default LatestTvScreen;
