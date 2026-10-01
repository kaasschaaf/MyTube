import React from 'react';
import { Star, CheckCircle, ExternalLink, Play } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onToggleFavoriteChannel: (channelId: string) => void;
  onToggleWatched: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onToggleFavoriteChannel,
  onToggleWatched,
}) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="group flex flex-col cursor-pointer select-none">
      {/* Thumbnail Container */}
      <div
        className="relative aspect-video w-full rounded-xl overflow-hidden bg-yt-surface mb-3 shadow-sm"
        onClick={() => onPlay(video)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Overlay Icon on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge (YouTube standard style) */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-yt-badge text-white font-semibold text-xs tracking-tight shadow">
          {video.durationFormatted}
        </div>

        {/* Watched Badge */}
        {video.isWatched && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 text-emerald-400 font-bold text-[11px] shadow">
            <CheckCircle className="w-3 h-3" />
            <span>Bekeken</span>
          </div>
        )}
      </div>

      {/* Meta & Info Row */}
      <div className="flex gap-3 items-start">
        {/* Channel Avatar with Star Indicator */}
        <div className="relative flex-shrink-0">
          <img
            src={video.channelAvatar}
            alt={video.channelTitle}
            className="w-9 h-9 rounded-full object-cover bg-yt-surface border border-yt-border/50"
          />
          {video.isFavoriteChannel && (
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-amber-400 rounded-full text-black shadow-sm">
              <Star className="w-2.5 h-2.5 fill-black" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            onClick={() => onPlay(video)}
            className="text-sm font-semibold text-yt-text line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Channel Name & Favorite Toggle */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-yt-textSec">
            <span className="hover:text-yt-text transition truncate">
              {video.channelTitle}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavoriteChannel(video.channelId);
              }}
              title={video.isFavoriteChannel ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
              className="p-0.5 hover:text-amber-400 transition"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  video.isFavoriteChannel ? 'text-amber-400 fill-amber-400' : 'text-yt-textSec hover:text-white'
                }`}
              />
            </button>
          </div>

          {/* Views & Date */}
          <div className="flex items-center gap-1.5 text-xs text-yt-textSec mt-0.5">
            {video.viewCount && <span>{video.viewCount}</span>}
            {video.viewCount && <span>•</span>}
            <span>{video.publishedRelative}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition">
          {/* Open directly in YouTube */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open in YouTube"
            className="p-1.5 rounded-full hover:bg-yt-pill text-yt-textSec hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Toggle Watched */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatched(video.id);
            }}
            title={video.isWatched ? 'Markeer als onbekeken' : 'Markeer als bekeken'}
            className={`p-1.5 rounded-full hover:bg-yt-pill transition ${
              video.isWatched ? 'text-emerald-400' : 'text-yt-textSec hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
