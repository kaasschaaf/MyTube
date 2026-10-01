import { AppSettings, Channel } from '../types';
import { HARDCODED_GOOGLE_CLIENT_ID } from '../config';

const STORAGE_KEY = 'mytube_app_settings_v1';
const CHANNELS_STORAGE_KEY = 'mytube_imported_channels_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  googleClientId:
    HARDCODED_GOOGLE_CLIENT_ID ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '',
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  dataSource: 'demo',
  favoriteChannelIds: [
    'UC6nSFpj9HTCZ5t-N3Rm3-HA',
    'UCBJycsmduvYEL83R_U4JriQ',
    'UCsXVk37bltHxD1rDPwtNM8Q',
    'UCsBjURrPoezykLs9EqgamOA',
    'UCnosop3',
  ],
  mutedChannelIds: [],
  watchedVideoIds: [],
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const googleClientId = parsed.googleClientId || HARDCODED_GOOGLE_CLIENT_ID || '';
    return { ...DEFAULT_SETTINGS, ...parsed, googleClientId };
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

export function loadStoredChannels(): Channel[] | null {
  try {
    const raw = localStorage.getItem(CHANNELS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredChannels(channels: Channel[]): void {
  try {
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
  } catch (e) {
    console.error('Failed to save channels:', e);
  }
}



/**
 * Exports settings and favorites to a downloadable JSON file.
 */
export function exportSettingsToFile(settings: AppSettings): void {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `mytube-backup-${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Imports settings from a JSON string.
 */
export function importSettingsFromString(jsonStr: string): AppSettings | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || !parsed) return null;
    return {
      googleClientId: typeof parsed.googleClientId === 'string' ? parsed.googleClientId : '',
      youtubeApiKey: typeof parsed.youtubeApiKey === 'string' ? parsed.youtubeApiKey : '',
      dataSource: parsed.dataSource === 'google' ? 'google' : 'demo',
      favoriteChannelIds: Array.isArray(parsed.favoriteChannelIds) ? parsed.favoriteChannelIds : [],
      mutedChannelIds: Array.isArray(parsed.mutedChannelIds) ? parsed.mutedChannelIds : [],
      watchedVideoIds: Array.isArray(parsed.watchedVideoIds) ? parsed.watchedVideoIds : [],
    };
  } catch (e) {
    console.error('Invalid settings JSON:', e);
    return null;
  }
}
