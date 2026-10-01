/**
 * Parses an ISO 8601 duration string (e.g. "PT1H14M32S", "PT15M", "PT45S") to total seconds.
 */
export function parseISODuration(isoDuration: string): number {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const days = parseInt(match[1] || '0', 10);
  const hours = parseInt(match[2] || '0', 10);
  const minutes = parseInt(match[3] || '0', 10);
  const seconds = parseInt(match[4] || '0', 10);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats seconds to YouTube duration badge format: "MM:SS" or "H:MM:SS".
 */
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

/**
 * Formats an ISO publishedAt date to a friendly relative Dutch string (e.g. "2 uur geleden").
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMin < 1) return 'Zojuist';
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minuut' : 'minuten'} geleden`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'uur' : 'uur'} geleden`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'dag' : 'dagen'} geleden`;
    if (diffWeeks < 5) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weken'} geleden`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'maand' : 'maanden'} geleden`;
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} ${diffYears === 1 ? 'jaar' : 'jaar'} geleden`;
  } catch {
    return 'Recent';
  }
}

/**
 * Formats a raw view count number to Dutch abbreviation (e.g. "1.2M weergaven", "45K weergaven").
 */
export function formatViews(views: number | string): string {
  const num = typeof views === 'string' ? parseInt(views, 10) : views;
  if (isNaN(num)) return 'Geen weergaven';

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace('.', ',')}M weergaven`;
  }
  if (num >= 1_000) {
    return `${Math.round(num / 1_000)}K weergaven`;
  }
  return `${num} weergaven`;
}
