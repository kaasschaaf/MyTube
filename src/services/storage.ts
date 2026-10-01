import { AppSettings } from '../types';

const STORAGE_KEY = 'mytube_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  googleClientId: '',
  youtubeApiKey: '',
  dataSource: 'demo',
  favoriteChannelIds: ['UC6nSFpj9HTCZ5t-N3Rm3-HA', 'UCBJycsmduvYEL83R_U4JriQ', 'UCsXVk37bltHxD1rDPwtNM8Q', 'UCsBjURrPoezykLs9EqgamOA', 'UCnosop3'],
  mutedChannelIds: [],
  watchedVideoIds: [],
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
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

/**
 * Exports settings and favorites to a downloadable JSON file.
 */
export function exportSettingsToFile(settings: AppSettings): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mytube-backup-${new Date().toISOString().slice(0, 10)}.json`);
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
