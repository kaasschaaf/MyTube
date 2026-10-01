import React from 'react';
import { Home, Star, Clock, Tv, Settings, VolumeX, Volume2, Sparkles } from 'lucide-react';
import { Channel, FilterState } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onToggleFavoriteChannel: (channelId: string) => void;
  onToggleMuteChannel: (channelId: string) => void;
  onOpenChannelManager: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  channels,
  filters,
  onFilterChange,
  onToggleFavoriteChannel,
  onToggleMuteChannel,
  onOpenChannelManager,
  onOpenSettings,
}) => {
  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-30 w-64 bg-yt-bg border-r border-yt-border/40 overflow-y-auto transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onFilterChange({
                  selectedChannelId: null,
                  onlyFavorites: false,
                  maxDurationMinutes: null,
                  minDurationMinutes: 0,
                });
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                filters.selectedChannelId === null &&
                !filters.onlyFavorites &&
                filters.maxDurationMinutes === null
                  ? 'bg-yt-pillHover text-white font-bold'
                  : 'hover:bg-yt-pill text-yt-text'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>All videos</span>
            </button>

            <button
              onClick={() => {
                onFilterChange({ onlyFavorites: true, selectedChannelId: null });
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                filters.onlyFavorites && filters.selectedChannelId === null
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                  : 'hover:bg-yt-pill text-yt-text'
              }`}
            >
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Favorite channels</span>
            </button>

            <button
              onClick={() => {
                onFilterChange({ maxDurationMinutes: 15, minDurationMinutes: 0, selectedChannelId: null });
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                filters.maxDurationMinutes === 15 && filters.selectedChannelId === null
                  ? 'bg-yt-red/20 text-red-400 font-bold border border-yt-red/30'
                  : 'hover:bg-yt-pill text-yt-text'
              }`}
            >
              <Clock className="w-5 h-5 text-yt-red" />
              <span>Under 15 minutes ⏱️</span>
            </button>

            <button
              onClick={() => {
                onFilterChange({ maxDurationMinutes: 5, minDurationMinutes: 0, selectedChannelId: null });
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                filters.maxDurationMinutes === 5 && filters.selectedChannelId === null
                  ? 'bg-yt-pillHover text-white font-bold'
                  : 'hover:bg-yt-pill text-yt-text'
              }`}
            >
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Quick picks (≤ 5 min)</span>
            </button>
          </div>

          <div className="h-[1px] bg-yt-border/40" />

          {/* Subscriptions List */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-yt-textSec">
                Subscriptions ({channels.length})
              </span>
              <button
                onClick={onOpenChannelManager}
                className="text-xs text-blue-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-0.5 max-h-[45vh] overflow-y-auto pr-1">
              {channels.map((channel) => {
                const isSelected = filters.selectedChannelId === channel.id;

                return (
                  <div
                    key={channel.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm transition cursor-pointer ${
                      isSelected
                        ? 'bg-yt-pillActive text-black font-bold'
                        : channel.isMuted
                        ? 'opacity-40 hover:opacity-80 hover:bg-yt-pill text-yt-textSec'
                        : 'hover:bg-yt-pill text-yt-text'
                    }`}
                    onClick={() => {
                      onFilterChange({
                        selectedChannelId: isSelected ? null : channel.id,
                      });
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={channel.thumbnail}
                        alt={channel.title}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="truncate text-xs">{channel.title}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 flex-shrink-0">
                      {/* Star Favorite */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteChannel(channel.id);
                        }}
                        className="p-1 hover:text-amber-400 transition"
                        title={channel.isFavorite ? 'Favorite' : 'Add to favorites'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            channel.isFavorite
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-yt-textSec hover:text-white'
                          }`}
                        />
                      </button>

                      {/* Mute channel */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMuteChannel(channel.id);
                        }}
                        className="p-1 hover:text-red-400 transition"
                        title={channel.isMuted ? 'Muted (click to unmute)' : 'Mute channel'}
                      >
                        {channel.isMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-yt-border/40" />

          {/* Bottom Settings Link */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onOpenChannelManager();
                onClose();
              }}
              className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs text-yt-textSec hover:text-yt-text hover:bg-yt-pill transition"
            >
              <Tv className="w-4 h-4" />
              <span>Filter & manage channels</span>
            </button>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs text-yt-textSec hover:text-yt-text hover:bg-yt-pill transition"
            >
              <Settings className="w-4 h-4" />
              <span>Settings & accounts</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
