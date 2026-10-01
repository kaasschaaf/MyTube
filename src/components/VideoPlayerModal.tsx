import React, { useEffect } from 'react';
import { X, ExternalLink, Star, CheckCircle, Clock } from 'lucide-react';
import { Video } from '../types';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
  onToggleFavoriteChannel: (channelId: string) => void;
  onToggleWatched: (videoId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onToggleFavoriteChannel,
  onToggleWatched,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-yt-bg border border-yt-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-yt-border/50 bg-yt-surface/60">
          <div className="flex items-center gap-2 overflow-hidden mr-4">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yt-badge text-xs font-semibold text-white">
              <Clock className="w-3 h-3 text-yt-red" />
              {video.durationFormatted}
            </span>
            <span className="text-sm font-semibold truncate text-yt-text">
              {video.title}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yt-pill hover:bg-yt-pillHover text-xs font-medium text-yt-text transition"
              title="Open in officiële YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in YouTube</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-yt-pillHover text-yt-textSec hover:text-white transition"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Video Embed Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Information & Actions */}
        <div className="p-4 bg-yt-surface/30 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-yt-border/30">
            {/* Channel details */}
            <div className="flex items-center gap-3">
              <img
                src={video.channelAvatar}
                alt={video.channelTitle}
                className="w-10 h-10 rounded-full object-cover border border-yt-border"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-yt-text">
                    {video.channelTitle}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onToggleFavoriteChannel(video.channelId)}
                    className="p-1 hover:text-amber-400 transition"
                    title={video.isFavoriteChannel ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        video.isFavoriteChannel
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-yt-textSec hover:text-white'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-yt-textSec">
                  {video.publishedRelative} {video.viewCount ? `• ${video.viewCount}` : ''}
                </p>
              </div>
            </div>

            {/* Toggle Watched Status */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleWatched(video.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  video.isWatched
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text border border-yt-border/50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{video.isWatched ? 'Gemarkeerd als bekeken' : 'Markeer als bekeken'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
