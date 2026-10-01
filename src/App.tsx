import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TimeFilterBar } from './components/TimeFilterBar';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { TimeSliderModal } from './components/TimeSliderModal';
import { ChannelManagerModal } from './components/ChannelManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { MobileNav } from './components/MobileNav';

import { Channel, Video, FilterState, AppSettings, UserProfile } from './types';
import { DEMO_CHANNELS, getDemoVideos } from './data/demoVideos';
import {
  loadSettings,
  saveSettings,
  exportSettingsToFile,
  importSettingsFromString,
  loadStoredChannels,
} from './services/storage';
import {
  initGoogleAuth,
  fetchUserProfile,
  fetchUserSubscriptions,
  fetchRecentVideosForChannels,
} from './services/youtubeApi';

export const App: React.FC = () => {
  // App settings state
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Channels & Videos data
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = loadStoredChannels();
    const base = saved && saved.length > 0 ? saved : DEMO_CHANNELS;
    return base.map((c) => ({
      ...c,
      isFavorite: settings.favoriteChannelIds.includes(c.id),
      isMuted: settings.mutedChannelIds.includes(c.id),
    }));
  });

  const [rawVideos, setRawVideos] = useState<Video[]>(() => getDemoVideos());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auth state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    maxDurationMinutes: null,
    minDurationMinutes: 0,
    onlyFavorites: false,
    hideWatched: false,
    searchQuery: '',
    selectedChannelId: null,
    sortBy: 'newest',
  });

  // Modal / Drawer visibility states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTimeSliderOpen, setIsTimeSliderOpen] = useState(false);
  const [isChannelManagerOpen, setIsChannelManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGoogleLoginOpen, setIsGoogleLoginOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // Synchronize settings changes to localStorage
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    // Update channels isFavorite / isMuted
    setChannels((prev) =>
      prev.map((c) => ({
        ...c,
        isFavorite: newSettings.favoriteChannelIds.includes(c.id),
        isMuted: newSettings.mutedChannelIds.includes(c.id),
      }))
    );
  };

  // Google OAuth Login handler
  const handleLogin = useCallback(
    (explicitClientId?: string) => {
      const clientId =
        typeof explicitClientId === 'string' ? explicitClientId : settings.googleClientId;
      const effectiveClientId = (clientId || '').trim();
      if (!effectiveClientId) {
        setIsGoogleLoginOpen(true);
        return;
      }

      const triggerAuth = initGoogleAuth(
        effectiveClientId,
        async (token) => {
          setAccessToken(token);
          // Fetch user profile
          const profile = await fetchUserProfile(token);
          if (profile) setUserProfile(profile);

          // Switch to Google data source
          const updatedSettings: AppSettings = {
            ...settings,
            googleClientId: effectiveClientId,
            dataSource: 'google',
          };
          handleUpdateSettings(updatedSettings);

          // Fetch subscriptions & videos
          await loadGoogleData(token);
        },
        (err) => {
          console.error('Google Auth Error:', err);
          alert(`Google sign-in failed: ${err}`);
        }
      );

      if (triggerAuth) {
        triggerAuth();
      } else {
        alert('Google Identity Services is still loading. Please try again in a few seconds.');
      }
    },
    [settings]
  );

  const handleLogout = () => {
    setAccessToken(null);
    setUserProfile(null);
    const updated: AppSettings = { ...settings, dataSource: 'demo' };
    handleUpdateSettings(updated);
    // Revert to demo videos
    setChannels(
      DEMO_CHANNELS.map((c) => ({
        ...c,
        isFavorite: updated.favoriteChannelIds.includes(c.id),
        isMuted: updated.mutedChannelIds.includes(c.id),
      }))
    );
    setRawVideos(getDemoVideos());
  };

  // Load subscriptions & videos from YouTube API
  const loadGoogleData = async (token: string) => {
    setIsRefreshing(true);
    try {
      const subs = await fetchUserSubscriptions(token);
      const mappedSubs = subs.map((s) => ({
        ...s,
        isFavorite: settings.favoriteChannelIds.includes(s.id),
        isMuted: settings.mutedChannelIds.includes(s.id),
      }));
      setChannels(mappedSubs);

      const videos = await fetchRecentVideosForChannels(mappedSubs, token);
      setRawVideos(videos);
    } catch (e) {
      console.error('Failed to fetch YouTube data:', e);
      alert('Could not fetch YouTube subscriptions. Check that YouTube Data API v3 is enabled.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh Feed
  const handleRefresh = async () => {
    if (settings.dataSource === 'google' && accessToken) {
      await loadGoogleData(accessToken);
    } else {
      setIsRefreshing(true);
      setTimeout(() => {
        setRawVideos(getDemoVideos());
        setIsRefreshing(false);
      }, 400);
    }
  };

  // Channel Actions
  const toggleFavoriteChannel = (channelId: string) => {
    const isFav = settings.favoriteChannelIds.includes(channelId);
    const nextFavorites = isFav
      ? settings.favoriteChannelIds.filter((id) => id !== channelId)
      : [...settings.favoriteChannelIds, channelId];

    handleUpdateSettings({
      ...settings,
      favoriteChannelIds: nextFavorites,
    });
  };

  const toggleMuteChannel = (channelId: string) => {
    const isMuted = settings.mutedChannelIds.includes(channelId);
    const nextMuted = isMuted
      ? settings.mutedChannelIds.filter((id) => id !== channelId)
      : [...settings.mutedChannelIds, channelId];

    handleUpdateSettings({
      ...settings,
      mutedChannelIds: nextMuted,
    });
  };

  const toggleWatched = (videoId: string) => {
    const isWatched = settings.watchedVideoIds.includes(videoId);
    const nextWatched = isWatched
      ? settings.watchedVideoIds.filter((id) => id !== videoId)
      : [...settings.watchedVideoIds, videoId];

    handleUpdateSettings({
      ...settings,
      watchedVideoIds: nextWatched,
    });
  };

  const handlePlayVideo = (video: Video) => {
    setActiveVideo(video);
    // Automatically mark as watched when opened
    if (!settings.watchedVideoIds.includes(video.id)) {
      toggleWatched(video.id);
    }
  };

  // Filter & Sort Logic
  const processedVideos = useMemo(() => {
    // Merge live favorite and watched states
    const enriched = rawVideos.map((v) => ({
      ...v,
      isWatched: settings.watchedVideoIds.includes(v.id),
      isFavoriteChannel: settings.favoriteChannelIds.includes(v.channelId),
    }));

    return enriched
      .filter((video) => {
        // Exclude muted channels
        if (settings.mutedChannelIds.includes(video.channelId)) {
          return false;
        }

        // Specific channel filter
        if (filters.selectedChannelId && video.channelId !== filters.selectedChannelId) {
          return false;
        }

        // Favorites filter
        if (filters.onlyFavorites && !video.isFavoriteChannel) {
          return false;
        }

        // Max duration filter (e.g. <= 15 minutes)
        if (filters.maxDurationMinutes !== null) {
          const maxSec = filters.maxDurationMinutes * 60;
          if (video.durationSeconds > maxSec) {
            return false;
          }
        }

        // Min duration filter
        if (filters.minDurationMinutes > 0) {
          const minSec = filters.minDurationMinutes * 60;
          if (video.durationSeconds < minSec) {
            return false;
          }
        }

        // Hide watched filter
        if (filters.hideWatched && video.isWatched) {
          return false;
        }

        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = video.title.toLowerCase().includes(q);
          const matchChannel = video.channelTitle.toLowerCase().includes(q);
          if (!matchTitle && !matchChannel) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'duration_asc') {
          return a.durationSeconds - b.durationSeconds;
        }
        if (filters.sortBy === 'duration_desc') {
          return b.durationSeconds - a.durationSeconds;
        }
        // default: newest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [rawVideos, settings, filters]);

  const handleResetFilters = () => {
    setFilters({
      maxDurationMinutes: null,
      minDurationMinutes: 0,
      onlyFavorites: false,
      hideWatched: false,
      searchQuery: '',
      selectedChannelId: null,
      sortBy: 'newest',
    });
  };

  const handleImportBackup = (jsonStr: string) => {
    const imported = importSettingsFromString(jsonStr);
    if (!imported) return false;
    handleUpdateSettings(imported);
    return true;
  };

  return (
    <div className="min-h-screen bg-yt-bg text-yt-text flex flex-col selection:bg-yt-red selection:text-white pb-16 lg:pb-0">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTimeSlider={() => setIsTimeSliderOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        userProfile={userProfile}
        onLogin={handleLogin}
        maxDurationMinutes={filters.maxDurationMinutes}
        dataSource={settings.dataSource}
      />

      <div className="flex flex-1">
        {/* Desktop Collapsible Sidebar & Mobile Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          channels={channels}
          filters={filters}
          onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
          onToggleFavoriteChannel={toggleFavoriteChannel}
          onToggleMuteChannel={toggleMuteChannel}
          onOpenChannelManager={() => setIsChannelManagerOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:pl-64">
          {/* Horizontal Time & Category Filter Bar */}
          <TimeFilterBar
            filters={filters}
            onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            onOpenTimeSlider={() => setIsTimeSliderOpen(true)}
            totalVideoCount={rawVideos.length}
            filteredVideoCount={processedVideos.length}
          />

          {/* Active Filter Indicators on Top */}
          {filters.selectedChannelId && (
            <div className="px-4 py-2 bg-yt-surface/40 flex items-center justify-between text-xs border-b border-yt-border/20">
              <span className="text-yt-textSec">
                Channel filter:{' '}
                <strong className="text-white">
                  {channels.find((c) => c.id === filters.selectedChannelId)?.title}
                </strong>
              </span>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, selectedChannelId: null }))}
                className="text-blue-400 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Video Cards Grid */}
          <VideoGrid
            videos={processedVideos}
            isLoading={isRefreshing}
            onPlay={handlePlayVideo}
            onToggleFavoriteChannel={toggleFavoriteChannel}
            onToggleWatched={toggleWatched}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        filters={filters}
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        onOpenTimeSlider={() => setIsTimeSliderOpen(true)}
        onOpenChannelManager={() => setIsChannelManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Modals & Dialogs */}
      <TimeSliderModal
        isOpen={isTimeSliderOpen}
        onClose={() => setIsTimeSliderOpen(false)}
        currentMaxMinutes={filters.maxDurationMinutes}
        onApply={(maxMin) => setFilters((prev) => ({ ...prev, maxDurationMinutes: maxMin }))}
        videos={rawVideos}
      />

      <ChannelManagerModal
        isOpen={isChannelManagerOpen}
        onClose={() => setIsChannelManagerOpen(false)}
        channels={channels}
        onToggleFavoriteChannel={toggleFavoriteChannel}
        onToggleMuteChannel={toggleMuteChannel}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onExport={() => exportSettingsToFile(settings)}
        onImport={handleImportBackup}
      />

      <GoogleLoginModal
        isOpen={isGoogleLoginOpen}
        onClose={() => setIsGoogleLoginOpen(false)}
        onGoogleLogin={handleLogin}
        hasGoogleClientId={Boolean(settings.googleClientId)}
        currentClientId={settings.googleClientId}
        onSaveClientId={(id) => handleUpdateSettings({ ...settings, googleClientId: id })}
      />

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onToggleFavoriteChannel={toggleFavoriteChannel}
        onToggleWatched={toggleWatched}
      />
    </div>
  );
};
