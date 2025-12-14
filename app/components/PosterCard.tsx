/**
 * PosterCard - Reusable media poster component.
 * Displays poster image, title and optional progress overlay.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { MediaItem } from '../api/types';
import { useTheme } from '../theme/ThemeProvider';
import placeholderImg from '../assets/poster-placeholder.png';

export interface PosterCardProps {
  item: MediaItem;
  width: number;
  onPress: (item: MediaItem) => void;
  showProgress?: boolean;
  progress?: number; // 0 - 1
  containerStyle?: StyleProp<ViewStyle>;
}

const PosterCard: React.FC<PosterCardProps> = ({
  item,
  width,
  onPress,
  showProgress = false,
  progress = 0,
  containerStyle,
}) => {
  const { colors, radii, spacing, typography } = useTheme();
  const [loaded, setLoaded] = useState(false);

  const height = Math.round(width * 1.5);
  const posterUri = item.poster ?? undefined;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. Open details`}
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={[
        styles.container,
        containerStyle,
        { width, height, borderRadius: radii.md, backgroundColor: colors.CARD },
      ]}>
      <View style={[styles.imageWrapper, { borderRadius: radii.md }]}>
        <Image
          source={posterUri ? { uri: posterUri } : placeholderImg}
          defaultSource={placeholderImg}
          style={[styles.image, loaded ? styles.imageLoaded : styles.imageLoading]}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <View
            style={[
              styles.image,
              styles.loadingOverlay,
              { backgroundColor: colors.SURFACE },
            ]}
          />
        )}
      </View>

      <Text
        numberOfLines={1}
        style={{
          color: colors.TEXT_PRIMARY,
          marginTop: spacing.xs,
          fontSize: typography.fontSize.small,
        }}>
        {item.title}
      </Text>

      {showProgress && (
        <View
          style={[
            styles.progressBarContainer,
            {
              backgroundColor: colors.MUTED,
              borderBottomLeftRadius: radii.md,
              borderBottomRightRadius: radii.md,
            },
          ]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                backgroundColor: colors.ACCENT,
                borderBottomLeftRadius: radii.md,
                borderBottomRightRadius: radii.md,
              },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  imageWrapper: {
    overflow: 'hidden',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoaded: {
    opacity: 1,
  },
  imageLoading: {
    opacity: 0,
  },
  loadingOverlay: {
    position: 'absolute',
  },
  progressBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
  },
  progressBarFill: {
    height: '100%',
  },
});

export default PosterCard;


