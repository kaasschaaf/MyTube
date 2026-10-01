import React from 'react';
import { VideoCard } from './VideoCard';
import { Video } from '../types';
import { Film, RotateCcw } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
  onPlay: (video: Video) => void;
  onToggleFavoriteChannel: (channelId: string) => void;
  onToggleWatched: (videoId: string) => void;
  onResetFilters: () => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading,
  onPlay,
  onToggleFavoriteChannel,
  onToggleWatched,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="aspect-video w-full bg-yt-surface rounded-xl" />
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-yt-surface flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-yt-surface rounded w-5/6" />
                <div className="h-3 bg-yt-surface rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center text-yt-textSec mb-4">
          <Film className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-lg font-bold text-yt-text mb-1">
          Geen passende video's gevonden
        </h3>
        <p className="text-sm text-yt-textSec max-w-sm mb-6">
          Er zijn op dit moment geen video's die voldoen aan je gekozen tijdsduur of favorietenfilters.
        </p>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yt-pill hover:bg-yt-pillHover text-yt-text font-semibold text-xs transition border border-yt-border/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Filters resetten</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7 p-3 sm:p-5">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={onPlay}
          onToggleFavoriteChannel={onToggleFavoriteChannel}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  );
};
