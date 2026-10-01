import React, { useState } from 'react';
import { Menu, Search, Settings, RefreshCw, X, SlidersHorizontal, LogIn, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onOpenTimeSlider: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  userProfile: UserProfile | null;
  onLogin: () => void;
  maxDurationMinutes: number | null;
  dataSource: 'demo' | 'google';
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenTimeSlider,
  onRefresh,
  isRefreshing,
  userProfile,
  onLogin,
  maxDurationMinutes,
  dataSource,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-3 sm:px-4 bg-yt-bg/95 backdrop-blur-md border-b border-yt-border/40 select-none">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="p-2 rounded-full hover:bg-yt-pillHover active:scale-95 transition text-yt-text"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a href="./" className="flex items-center gap-1.5 focus:outline-none group">
          <div className="w-7 h-5 bg-yt-red rounded-md flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5"></div>
          </div>
          <span className="font-bold tracking-tight text-lg text-yt-text flex items-center gap-1">
            My<span className="text-white font-black">Tube</span>
          </span>
          {dataSource === 'demo' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              <Sparkles className="w-2.5 h-2.5" /> Demo
            </span>
          )}
        </a>
      </div>

      {/* Middle: Desktop Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
        <div className="flex w-full items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search videos or channels..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#121212] border border-yt-border rounded-l-full py-2 pl-4 pr-9 text-sm text-yt-text placeholder-yt-textSec focus:outline-none focus:border-blue-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yt-textSec hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            aria-label="Search"
            className="bg-yt-pill hover:bg-yt-pillHover px-5 py-2 rounded-r-full border border-l-0 border-yt-border text-yt-textSec hover:text-white transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden p-2 rounded-full hover:bg-yt-pillHover text-yt-text"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Time Budget Button */}
        <button
          onClick={onOpenTimeSlider}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            maxDurationMinutes !== null
              ? 'bg-yt-red/15 border-yt-red/50 text-red-300 hover:bg-yt-red/25'
              : 'bg-yt-pill border-yt-border hover:bg-yt-pillHover text-yt-text'
          }`}
          title="Filter by duration"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Time:</span>
          <span className="font-bold">
            {maxDurationMinutes !== null ? `≤ ${maxDurationMinutes}m` : 'Any length'}
          </span>
        </button>

        {/* Refresh Feed */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh feed"
          className="p-2 rounded-full hover:bg-yt-pillHover active:scale-95 transition text-yt-text disabled:opacity-50"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-yt-red' : ''}`} />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-yt-pillHover active:scale-95 transition text-yt-text"
          title="Settings & accounts"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar / Login */}
        {userProfile ? (
          <button
            onClick={onOpenSettings}
            className="flex items-center pl-1 focus:outline-none"
            title={`${userProfile.name} (${userProfile.email})`}
          >
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full border border-yt-border ring-1 ring-yt-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/50 hover:bg-blue-500/10 text-blue-400 font-medium text-xs transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        )}
      </div>

      {/* Mobile search bar overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-14 bg-yt-bg px-3 flex items-center gap-2 z-50 border-b border-yt-border">
          <input
            type="text"
            autoFocus
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-yt-surface border border-yt-border rounded-full py-1.5 pl-4 pr-9 text-sm text-yt-text focus:outline-none"
          />
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-yt-textSec hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};
