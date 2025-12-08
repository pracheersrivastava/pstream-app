/**
 * PlayerScreen - Media player screen.
 * Displays video player UI with controls.
 */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

const PlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, spacing, radii } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Placeholder progress
  const progress = 35;
  const currentTime = '12:45';
  const totalTime = '2:15:30';

  return (
    <ThemedView variant="background" style={styles.container}>
      <StatusBar hidden />

      {/* Video Area (placeholder) */}
      <TouchableOpacity
        style={styles.videoArea}
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}>
        <View
          style={[
            styles.videoPlaceholder,
            { backgroundColor: colors.SURFACE },
          ]}>
          <ThemedText variant="h2" color="muted">
            Video Player
          </ThemedText>
        </View>

        {/* Controls Overlay */}
        {showControls && (
          <View style={[styles.controlsOverlay, { padding: spacing.md }]}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={[
                  styles.backButton,
                  {
                    backgroundColor: colors.CARD,
                    borderRadius: radii.sm,
                    padding: spacing.sm,
                  },
                ]}
                onPress={() => navigation.goBack()}>
                <ThemedText variant="body">←</ThemedText>
              </TouchableOpacity>

              <View style={styles.topBarRight}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.sm,
                      padding: spacing.sm,
                      marginLeft: spacing.sm,
                    },
                  ]}>
                  <ThemedText variant="small">CC</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.sm,
                      padding: spacing.sm,
                      marginLeft: spacing.sm,
                    },
                  ]}>
                  <ThemedText variant="small">⚙</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                style={[
                  styles.skipButton,
                  {
                    backgroundColor: colors.CARD,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                  },
                ]}>
                <ThemedText variant="body">-10</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.playPauseButton,
                  {
                    backgroundColor: colors.PRIMARY,
                    borderRadius: 40,
                    width: 80,
                    height: 80,
                    marginHorizontal: spacing.xl,
                  },
                ]}
                onPress={() => setIsPlaying(!isPlaying)}>
                <ThemedText variant="h1">{isPlaying ? '⏸' : '▶'}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.skipButton,
                  {
                    backgroundColor: colors.CARD,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                  },
                ]}>
                <ThemedText variant="body">+10</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              {/* Title */}
              <View style={[styles.titleSection, { marginBottom: spacing.md }]}>
                <ThemedText variant="body">Sample Movie Title</ThemedText>
                <ThemedText variant="small" color="secondary">
                  Chapter 3: The Journey Begins
                </ThemedText>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <ThemedText variant="small" color="secondary">
                  {currentTime}
                </ThemedText>

                <View
                  style={[
                    styles.progressBarContainer,
                    {
                      backgroundColor: colors.MUTED,
                      borderRadius: radii.sm,
                      marginHorizontal: spacing.md,
                    },
                  ]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: colors.PRIMARY,
                        borderRadius: radii.sm,
                        width: `${progress}%`,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.progressThumb,
                      {
                        backgroundColor: colors.TEXT_PRIMARY,
                        borderRadius: 8,
                        left: `${progress}%`,
                      },
                    ]}
                  />
                </View>

                <ThemedText variant="small" color="secondary">
                  {totalTime}
                </ThemedText>
              </View>

              {/* Additional Controls */}
              <View
                style={[
                  styles.additionalControls,
                  { marginTop: spacing.md },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.additionalButton,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.sm,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                    },
                  ]}>
                  <ThemedText variant="small">1x</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.additionalButton,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.sm,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      marginLeft: spacing.sm,
                    },
                  ]}>
                  <ThemedText variant="small">Episodes</ThemedText>
                </TouchableOpacity>

                <View style={styles.spacer} />

                <TouchableOpacity
                  style={[
                    styles.additionalButton,
                    {
                      backgroundColor: colors.CARD,
                      borderRadius: radii.sm,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                    },
                  ]}>
                  <ThemedText variant="small">⛶</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoArea: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {},
  topBarRight: {
    flexDirection: 'row',
  },
  controlButton: {},
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {},
  titleSection: {},
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
  },
  progressThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    top: -6,
    marginLeft: -8,
  },
  additionalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalButton: {},
  spacer: {
    flex: 1,
  },
});

export default PlayerScreen;
