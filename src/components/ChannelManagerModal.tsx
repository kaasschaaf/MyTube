import React, { useState } from 'react';
import { X, Search, Star, VolumeX, Volume2, Plus, Tv, Check } from 'lucide-react';
import { Channel } from '../types';

interface ChannelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onToggleFavoriteChannel: (channelId: string) => void;
  onToggleMuteChannel: (channelId: string) => void;
  onAddCustomChannel?: (name: string, url: string) => void;
}

export const ChannelManagerModal: React.FC<ChannelManagerModalProps> = ({
  isOpen,
  onClose,
  channels,
  onToggleFavoriteChannel,
  onToggleMuteChannel,
  onAddCustomChannel,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'muted'>('all');
  const [newChannelName, setNewChannelName] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  if (!isOpen) return null;

  const filteredChannels = channels.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'favorites') return c.isFavorite;
    if (filterMode === 'muted') return c.isMuted;
    return true;
  });

  const favoritesCount = channels.filter((c) => c.isFavorite).length;
  const mutedCount = channels.filter((c) => c.isMuted).length;

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChannelName.trim() && onAddCustomChannel) {
      onAddCustomChannel(newChannelName.trim(), '');
      setNewChannelName('');
      setIsAddingChannel(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-yt-surface border border-yt-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] text-yt-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-yt-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Manage subscriptions</h2>
              <p className="text-xs text-yt-textSec">
                Favorite channels (⭐) or mute channels you don't want to see
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-yt-pillHover text-yt-textSec hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-yt-border/40 space-y-3 bg-yt-bg/40">
          <div className="relative">
            <input
              type="text"
              placeholder="Search channels by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-yt-surface border border-yt-border rounded-xl py-2 pl-9 pr-4 text-xs text-yt-text focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-yt-textSec absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  filterMode === 'all'
                    ? 'bg-yt-pillActive text-black font-bold'
                    : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
                }`}
              >
                All ({channels.length})
              </button>
              <button
                onClick={() => setFilterMode('favorites')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition font-medium ${
                  filterMode === 'favorites'
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favorites ({favoritesCount})</span>
              </button>
              <button
                onClick={() => setFilterMode('muted')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition font-medium ${
                  filterMode === 'muted'
                    ? 'bg-red-500/80 text-white font-bold'
                    : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
                }`}
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Muted ({mutedCount})</span>
              </button>
            </div>

            {onAddCustomChannel && (
              <button
                onClick={() => setIsAddingChannel(!isAddingChannel)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add channel</span>
              </button>
            )}
          </div>

          {/* Add Channel Form */}
          {isAddingChannel && (
            <form onSubmit={handleAddChannel} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. @veritasium or a channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="flex-1 bg-yt-surface border border-yt-border rounded-lg px-3 py-1.5 text-xs text-yt-text"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-yt-red text-white text-xs font-bold hover:bg-yt-redHover transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          )}
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredChannels.length === 0 ? (
            <div className="text-center py-8 text-yt-textSec text-xs">
              No channels found in this category.
            </div>
          ) : (
            filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-yt-bg/50 border border-yt-border/40 hover:border-yt-border transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-9 h-9 rounded-full object-cover border border-yt-border/50"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate text-yt-text">
                      {channel.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-yt-textSec">
                      {channel.subscriberCount && (
                        <span>{channel.subscriberCount} subscribers</span>
                      )}
                      {channel.isMuted && (
                        <span className="text-red-400 font-semibold">• Muted</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavoriteChannel(channel.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      channel.isFavorite
                        ? 'bg-amber-400 text-black shadow-xs font-bold'
                        : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        channel.isFavorite ? 'fill-black' : ''
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {channel.isFavorite ? 'Favorite' : 'Add favorite'}
                    </span>
                  </button>

                  {/* Mute Toggle */}
                  <button
                    onClick={() => onToggleMuteChannel(channel.id)}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                      channel.isMuted
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-yt-pill hover:bg-yt-pillHover text-yt-textSec hover:text-white'
                    }`}
                    title={channel.isMuted ? 'Unmute this channel' : 'Mute this channel'}
                  >
                    {channel.isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-yt-border/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-yt-pillActive text-black font-bold text-xs hover:bg-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
