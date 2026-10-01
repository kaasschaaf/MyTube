import React from 'react';
import { Home, Clock, Star, Tv, Settings } from 'lucide-react';
import { FilterState } from '../types';

interface MobileNavProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onOpenTimeSlider: () => void;
  onOpenChannelManager: () => void;
  onOpenSettings: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  filters,
  onFilterChange,
  onOpenTimeSlider,
  onOpenChannelManager,
  onOpenSettings,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-yt-bg/95 backdrop-blur-md border-t border-yt-border/50 lg:hidden flex items-center justify-around h-14 px-2 safe-area-bottom select-none">
      {/* Home */}
      <button
        onClick={() =>
          onFilterChange({
            onlyFavorites: false,
            maxDurationMinutes: null,
            minDurationMinutes: 0,
            selectedChannelId: null,
          })
        }
        className={`flex flex-col items-center justify-center flex-1 py-1 ${
          !filters.onlyFavorites && filters.maxDurationMinutes === null && !filters.selectedChannelId
            ? 'text-white'
            : 'text-yt-textSec hover:text-yt-text'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      {/* Time Filter */}
      <button
        onClick={onOpenTimeSlider}
        className={`flex flex-col items-center justify-center flex-1 py-1 ${
          filters.maxDurationMinutes !== null
            ? 'text-yt-red font-bold'
            : 'text-yt-textSec hover:text-yt-text'
        }`}
      >
        <Clock className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">
          {filters.maxDurationMinutes !== null ? `≤${filters.maxDurationMinutes}m` : 'Tijd'}
        </span>
      </button>

      {/* Favorieten */}
      <button
        onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
        className={`flex flex-col items-center justify-center flex-1 py-1 ${
          filters.onlyFavorites
            ? 'text-amber-400 font-bold'
            : 'text-yt-textSec hover:text-yt-text'
        }`}
      >
        <Star className={`w-5 h-5 mb-0.5 ${filters.onlyFavorites ? 'fill-amber-400' : ''}`} />
        <span className="text-[10px] font-medium">Favorieten</span>
      </button>

      {/* Kanalen */}
      <button
        onClick={onOpenChannelManager}
        className="flex flex-col items-center justify-center flex-1 py-1 text-yt-textSec hover:text-yt-text"
      >
        <Tv className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">Kanalen</span>
      </button>

      {/* Instellingen */}
      <button
        onClick={onOpenSettings}
        className="flex flex-col items-center justify-center flex-1 py-1 text-yt-textSec hover:text-yt-text"
      >
        <Settings className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">Instellingen</span>
      </button>
    </nav>
  );
};
