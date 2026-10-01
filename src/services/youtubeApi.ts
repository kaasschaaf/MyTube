import { Channel, Video, UserProfile } from '../types';
import { parseISODuration, formatDuration, formatRelativeTime } from '../utils/duration';

// Cache for video durations to save API quota
const DURATION_CACHE_KEY = 'mytube_duration_cache_v1';

function getDurationCache(): Record<string, number> {
  try {
    const raw = localStorage.getItem(DURATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDurationCache(cache: Record<string, number>): void {
  try {
    localStorage.setItem(DURATION_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to cache video durations:', e);
  }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

/**
 * Initializes the client-side Google Identity Services OAuth token client.
 */
export function initGoogleAuth(
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError: (error: string) => void
): (() => void) | null {
  if (!window.google?.accounts?.oauth2) {
    console.warn('Google Identity Services script not yet loaded.');
    return null;
  }

  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: (response) => {
        if (response.error) {
          onError(response.error);
        } else if (response.access_token) {
          onSuccess(response.access_token);
        }
      },
    });

    return () => client.requestAccessToken();
  } catch (e) {
    console.error('Error initializing Google Auth Client:', e);
    onError(String(e));
    return null;
  }
}

/**
 * Fetches user profile info (name, avatar, email) using Google userinfo endpoint.
 */
export async function fetchUserProfile(accessToken: string): Promise<UserProfile | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name || 'User',
      email: data.email || '',
      avatar: data.picture || '',
    };
  } catch (e) {
    console.error('Failed to fetch user profile:', e);
    return null;
  }
}

/**
 * Fetches the user's subscribed YouTube channels.
 */
export async function fetchUserSubscriptions(accessToken: string): Promise<Channel[]> {
  const channels: Channel[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/subscriptions');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('mine', 'true');
      url.searchParams.set('maxResults', '50');
      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const items = data.items || [];

      for (const item of items) {
        const snippet = item.snippet;
        const channelId = snippet.resourceId?.channelId;
        if (channelId) {
          channels.push({
            id: channelId,
            title: snippet.title || 'Channel',
            thumbnail: snippet.thumbnails?.default?.url || snippet.thumbnails?.medium?.url || '',
            customUrl: '',
            isFavorite: false,
            isMuted: false,
          });
        }
      }

      nextPageToken = data.nextPageToken;
      // Fetch up to 100 channels to avoid excessive quota
    } while (nextPageToken && channels.length < 100);

    return channels;
  } catch (e) {
    console.error('Failed to fetch YouTube subscriptions:', e);
    throw e;
  }
}

/**
 * Fetches recent video uploads for a list of channels and their video durations.
 */
export async function fetchRecentVideosForChannels(
  channels: Channel[],
  accessToken: string
): Promise<Video[]> {
  const allVideos: Video[] = [];
  const durationCache = getDurationCache();
  const uncachedVideoIds: string[] = [];

  // Limit to active/non-muted channels
  const activeChannels = channels.filter(c => !c.isMuted);

  // We can fetch uploads by taking channel ID: UC... -> replace 'UC' with 'UU' to get uploads playlist ID!
  for (const channel of activeChannels) {
    try {
      const uploadsPlaylistId = channel.id.startsWith('UC')
        ? 'UU' + channel.id.slice(2)
        : channel.id;

      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      url.searchParams.set('part', 'snippet,contentDetails');
      url.searchParams.set('playlistId', uploadsPlaylistId);
      url.searchParams.set('maxResults', '6'); // Latest 6 videos per channel

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const items = data.items || [];

      for (const item of items) {
        const videoId = item.contentDetails?.videoId;
        if (!videoId) continue;

        const snippet = item.snippet;
        const publishedAt = snippet.publishedAt || new Date().toISOString();

        if (durationCache[videoId] === undefined) {
          uncachedVideoIds.push(videoId);
        }

        allVideos.push({
          id: videoId,
          title: snippet.title || 'Video',
          channelId: channel.id,
          channelTitle: channel.title,
          channelAvatar: channel.thumbnail,
          thumbnail:
            snippet.thumbnails?.maxres?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          durationSeconds: durationCache[videoId] || 0,
          durationFormatted: formatDuration(durationCache[videoId] || 0),
          publishedAt,
          publishedRelative: formatRelativeTime(publishedAt),
          viewCount: '',
          isWatched: false,
          isFavoriteChannel: channel.isFavorite,
        });
      }
    } catch (e) {
      console.error(`Failed to fetch uploads for channel ${channel.title}:`, e);
    }
  }

  // Batch fetch durations for uncached video IDs (up to 50 at a time)
  if (uncachedVideoIds.length > 0) {
    const chunkSize = 50;
    for (let i = 0; i < uncachedVideoIds.length; i += chunkSize) {
      const chunk = uncachedVideoIds.slice(i, i + chunkSize);
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/videos');
        url.searchParams.set('part', 'contentDetails,statistics');
        url.searchParams.set('id', chunk.join(','));

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          for (const item of data.items || []) {
            const durationSec = parseISODuration(item.contentDetails?.duration || '');
            durationCache[item.id] = durationSec;
          }
        }
      } catch (e) {
        console.error('Error fetching video durations chunk:', e);
      }
    }

    saveDurationCache(durationCache);

    // Update the duration in allVideos
    for (const v of allVideos) {
      if (durationCache[v.id] !== undefined) {
        v.durationSeconds = durationCache[v.id];
        v.durationFormatted = formatDuration(durationCache[v.id]);
      }
    }
  }

  return allVideos;
}
