/**
 * SettingsScreen - App settings and preferences.
 * Demonstrates themed settings UI with toggles and options.
 */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  rightElement,
  onPress,
}) => {
  const { colors, spacing, radii } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.CARD,
          borderRadius: radii.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}>
      <View style={styles.settingInfo}>
        <ThemedText variant="body">{title}</ThemedText>
        {subtitle && (
          <ThemedText variant="small" color="secondary">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const { colors, spacing, radii } = useTheme();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [downloadWifi, setDownloadWifi] = useState(true);

  return (
    <ThemedView variant="background" style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { padding: spacing.md }]}>
        <ThemedText variant="h1">Settings</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xl,
        }}>
        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText
            variant="small"
            color="secondary"
            style={{ marginBottom: spacing.sm, marginLeft: spacing.xs }}>
            ACCOUNT
          </ThemedText>

          <SettingItem
            title="Profile"
            subtitle="Manage your account details"
            rightElement={
              <ThemedText variant="body" color="muted">
                →
              </ThemedText>
            }
            onPress={() => {}}
          />

          <SettingItem
            title="Subscription"
            subtitle="Premium • Renews Jan 2025"
            rightElement={
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.SUCCESS,
                    borderRadius: radii.sm,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                  },
                ]}>
                <ThemedText variant="small">Active</ThemedText>
              </View>
            }
          />
        </View>

        {/* Playback Section */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <ThemedText
            variant="small"
            color="secondary"
            style={{ marginBottom: spacing.sm, marginLeft: spacing.xs }}>
            PLAYBACK
          </ThemedText>

          <SettingItem
            title="Auto-play next episode"
            subtitle="Automatically play the next episode"
            rightElement={
              <Switch
                value={autoPlay}
                onValueChange={setAutoPlay}
                trackColor={{ false: colors.MUTED, true: colors.PRIMARY }}
                thumbColor={colors.TEXT_PRIMARY}
              />
            }
          />

          <SettingItem
            title="Video Quality"
            subtitle="Auto (recommended)"
            rightElement={
              <ThemedText variant="body" color="muted">
                →
              </ThemedText>
            }
            onPress={() => {}}
          />
        </View>

        {/* Downloads Section */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <ThemedText
            variant="small"
            color="secondary"
            style={{ marginBottom: spacing.sm, marginLeft: spacing.xs }}>
            DOWNLOADS
          </ThemedText>

          <SettingItem
            title="Download over Wi-Fi only"
            subtitle="Prevent downloads on mobile data"
            rightElement={
              <Switch
                value={downloadWifi}
                onValueChange={setDownloadWifi}
                trackColor={{ false: colors.MUTED, true: colors.PRIMARY }}
                thumbColor={colors.TEXT_PRIMARY}
              />
            }
          />

          <SettingItem
            title="Download Quality"
            subtitle="High (1080p)"
            rightElement={
              <ThemedText variant="body" color="muted">
                →
              </ThemedText>
            }
            onPress={() => {}}
          />

          <SettingItem
            title="Storage Used"
            subtitle="2.4 GB of 64 GB"
            rightElement={
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    borderColor: colors.ERROR,
                    borderWidth: 1,
                    borderRadius: radii.sm,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                  },
                ]}>
                <ThemedText variant="small" color="error">
                  Clear
                </ThemedText>
              </TouchableOpacity>
            }
          />
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <ThemedText
            variant="small"
            color="secondary"
            style={{ marginBottom: spacing.sm, marginLeft: spacing.xs }}>
            NOTIFICATIONS
          </ThemedText>

          <SettingItem
            title="Push Notifications"
            subtitle="Get notified about new releases"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.MUTED, true: colors.PRIMARY }}
                thumbColor={colors.TEXT_PRIMARY}
              />
            }
          />
        </View>

        {/* About Section */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <ThemedText
            variant="small"
            color="secondary"
            style={{ marginBottom: spacing.sm, marginLeft: spacing.xs }}>
            ABOUT
          </ThemedText>

          <SettingItem
            title="Version"
            subtitle="1.0.0 (Build 1)"
          />

          <SettingItem
            title="Terms of Service"
            rightElement={
              <ThemedText variant="body" color="muted">
                →
              </ThemedText>
            }
            onPress={() => {}}
          />

          <SettingItem
            title="Privacy Policy"
            rightElement={
              <ThemedText variant="body" color="muted">
                →
              </ThemedText>
            }
            onPress={() => {}}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            {
              backgroundColor: colors.CARD,
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.xl,
              borderWidth: 1,
              borderColor: colors.ERROR,
            },
          ]}
          activeOpacity={0.7}>
          <ThemedText variant="body" color="error" style={styles.signOutText}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  scrollView: {
    flex: 1,
  },
  section: {},
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  badge: {},
  clearButton: {},
  signOutButton: {
    alignItems: 'center',
  },
  signOutText: {
    fontWeight: '600',
  },
});

export default SettingsScreen;
