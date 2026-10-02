export interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  customUrl?: string;
  isFavorite: boolean;
  isMuted: boolean;
  subscriberCount?: string;
  tags?: string[];
}

export interface Video {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  channelAvatar: string;
  thumbnail: string;
  durationSeconds: number; // In seconds (e.g. 890s = 14m 50s)
  durationFormatted: string; // e.g. "14:50"
  publishedAt: string; // ISO date string
  publishedRelative: string; // e.g. "3 hours ago"
  viewCount: string; // e.g. "450K views"
  isWatched: boolean;
  isLiveStream?: boolean;
  isFavoriteChannel?: boolean;
}

export type SortOption = 'newest' | 'duration_asc' | 'duration_desc' | 'views';

export interface FilterState {
  maxDurationMinutes: number | null; // null means no limit
  minDurationMinutes: number; // 0 default
  onlyFavorites: boolean;
  hideWatched: boolean;
  hideShorts: boolean;
  hideLiveStreams: boolean;
  searchQuery: string;
  selectedChannelId: string | null;
  sortBy: SortOption;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface AppSettings {
  googleClientId: string;
  youtubeApiKey: string;
  dataSource: 'demo' | 'google';
  favoriteChannelIds: string[];
  mutedChannelIds: string[];
  watchedVideoIds: string[];
}
