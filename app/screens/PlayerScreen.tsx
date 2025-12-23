/**
 * PlayerScreen - Media player screen.
 * Displays video player UI with controls.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Video, { VideoRef, OnLoadData, OnProgressData, TextTrackType, ISO639_1 } from 'react-native-video';
import { fetchSources } from '../api/pstream';
import { Source } from '../api/types';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

const PlayerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PlayerScreenRouteProp>();
  const { tmdbId, type, title } = route.params;
  const { colors, spacing, radii } = useTheme();

  const videoRef = useRef<VideoRef>(null);
  const [currentSource, setCurrentSource] = useState<Source | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sources
  const {
    data: sourcesResponse,
    isLoading: isSourcesLoading,
    isError: isSourcesError,
    refetch,
  } = useQuery({
    queryKey: ['sources', tmdbId, type],
    queryFn: () => fetchSources(tmdbId, type),
    gcTime: 0, // Do not cache permanently
    staleTime: 0,
  });

  // Select default source
  useEffect(() => {
    if (sourcesResponse && sourcesResponse.sources.length > 0) {
      const sourcesData = sourcesResponse.sources;
      // 1. Filter for HLS
      const hlsSources = sourcesData.filter(s => s.type === 'hls' || s.url.includes('.m3u8'));
      
      // 2. Sort by quality (simple heuristic)
      const sorted = hlsSources.sort((a, b) => {
        if (a.quality === 'auto') return -1;
        if (b.quality === 'auto') return 1;
        return parseInt(b.quality, 10) - parseInt(a.quality, 10);
      });

      // 3. Pick best or fallback to first available
      const bestSource = sorted[0] || sourcesData[0];
      
      if (bestSource) {
        setCurrentSource(bestSource);
        setError(null);
      } else {
        setError('No playable sources found');
      }
    } else if (sourcesResponse && sourcesResponse.sources.length === 0) {
      setError('No sources available');
    }
  }, [sourcesResponse]);

  const textTracks = React.useMemo(() => {
    if (!sourcesResponse?.subtitles) return undefined;
    return sourcesResponse.subtitles.map((sub) => ({
      title: sub.label,
      language: sub.language as ISO639_1,
      type: TextTrackType.VTT, // Assuming VTT for now, or check extension
      uri: sub.url,
    }));
  }, [sourcesResponse]);

  const handleLoad = (data: OnLoadData) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const handleProgress = (data: OnProgressData) => {
    setProgress(data.currentTime);
  };

  const handleError = (videoError: any) => {
    console.error('Video Error:', videoError);
    // Try next source if available
    const sources = sourcesResponse?.sources;
    if (sources && currentSource) {
      const currentIndex = sources.indexOf(currentSource);
      if (currentIndex < sources.length - 1) {
        console.log('Switching to next source...');
        setCurrentSource(sources[currentIndex + 1]);
      } else {
        setError('Playback failed for all sources');
        setIsLoading(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);

  if (isSourcesLoading) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <ThemedText style={{ marginTop: spacing.md }}>Loading sources...</ThemedText>
      </ThemedView>
    );
  }

  if (isSourcesError || error) {
    return (
      <ThemedView variant="background" style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>
          {error || 'Failed to load stream'}
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            setError(null);
            refetch();
          }}
          style={[styles.button, { backgroundColor: colors.PRIMARY, borderRadius: radii.sm }]}>
          <ThemedText>Retry</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.button, { marginTop: spacing.md }]}>
          <ThemedText color="secondary">Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="background" style={styles.container}>
      <StatusBar hidden />

      {currentSource && (
        <Video
          ref={videoRef}
          source={{ uri: currentSource.url }}
          style={styles.video}
          resizeMode="contain"
          onLoad={handleLoad}
          onProgress={handleProgress}
          onError={handleError}
          paused={!isPlaying}
          onBuffer={() => setIsLoading(true)}
          onReadyForDisplay={() => setIsLoading(false)}
          textTracks={textTracks}
        />
      )}

      {/* Clickable Area */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={toggleControls}>
        
        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}>
                <ThemedText variant="h2">←</ThemedText>
              </TouchableOpacity>
              
              <View style={styles.topRightControls}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowQualityModal(true)}>
                  <ThemedText variant="body">⚙ Quality</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Play/Pause */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                onPress={() => {
                  videoRef.current?.seek(progress - 10);
                }}
                style={styles.skipButton}>
                <ThemedText variant="body">-10s</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsPlaying(!isPlaying)}
                style={[styles.playButton, { backgroundColor: colors.PRIMARY }]}>
                <ThemedText variant="h1">{isPlaying ? '⏸' : '▶'}</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  videoRef.current?.seek(progress + 10);
                }}
                style={styles.skipButton}>
                <ThemedText variant="body">+10s</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              <ThemedText variant="body" style={{ marginBottom: spacing.xs }}>
                {title}
              </ThemedText>
              <View style={styles.timeRow}>
                <ThemedText variant="small">{formatTime(progress)}</ThemedText>
                <View style={[styles.progressBar, { backgroundColor: colors.MUTED }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.PRIMARY,
                        width: `${duration > 0 ? (progress / duration) * 100 : 0}%` 
                      }
                    ]} 
                  />
                </View>
                <ThemedText variant="small">{formatTime(duration)}</ThemedText>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Quality Modal */}
      <Modal
        visible={showQualityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQualityModal(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowQualityModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.CARD, borderRadius: radii.md }]}>
            <ThemedText variant="h2" style={{ marginBottom: spacing.md }}>Select Quality</ThemedText>
            <FlatList
              data={sourcesResponse?.sources || []}
              keyExtractor={(item, index) => `${item.quality}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.qualityOption,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      borderBottomColor: colors.MUTED,
                      backgroundColor: currentSource === item ? colors.SURFACE : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setCurrentSource(item);
                    setShowQualityModal(false);
                  }}>
                  <ThemedText>
                    {item.quality} ({item.provider})
                  </ThemedText>
                  {currentSource === item && <ThemedText color="primary">✓</ThemedText>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 10,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  skipButton: {
    padding: 10,
  },
  bottomBar: {
    width: '100%',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 4,
    marginHorizontal: 10,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    padding: 20,
  },
  qualityOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default PlayerScreen;
