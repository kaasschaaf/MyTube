import React from 'react';
import { Star, Sliders, EyeOff, Radio, Smartphone, ArrowUpDown } from 'lucide-react';
import { FilterState, SortOption } from '../types';

interface TimeFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onOpenTimeSlider: () => void;
  totalVideoCount: number;
  filteredVideoCount: number;
}

const PRESET_DURATIONS = [
  { label: 'All', maxMinutes: null, minMinutes: 0 },
  { label: '≤ 5 min', maxMinutes: 5, minMinutes: 0 },
  { label: '≤ 10 min', maxMinutes: 10, minMinutes: 0 },
  { label: '≤ 15 min ⏱️', maxMinutes: 15, minMinutes: 0 },
  { label: '≤ 30 min', maxMinutes: 30, minMinutes: 0 },
  { label: '≤ 45 min', maxMinutes: 45, minMinutes: 0 },
  { label: '45+ min', maxMinutes: null, minMinutes: 45 },
];

export const TimeFilterBar: React.FC<TimeFilterBarProps> = ({
  filters,
  onFilterChange,
  onOpenTimeSlider,
  totalVideoCount,
  filteredVideoCount,
}) => {
  const isCustomTime =
    filters.maxDurationMinutes !== null &&
    !PRESET_DURATIONS.some(
      (p) => p.maxMinutes === filters.maxDurationMinutes && p.minMinutes === filters.minDurationMinutes
    );

  return (
    <div className="sticky top-14 z-30 bg-yt-bg/95 backdrop-blur-md px-3 sm:px-4 py-2 border-b border-yt-border/30 overflow-x-auto no-scrollbar flex items-center gap-2 select-none">
      {/* Time Preset Chips */}
      {PRESET_DURATIONS.map((preset) => {
        const isSelected =
          filters.maxDurationMinutes === preset.maxMinutes &&
          filters.minDurationMinutes === preset.minMinutes &&
          !isCustomTime;

        return (
          <button
            key={preset.label}
            onClick={() =>
              onFilterChange({
                maxDurationMinutes: preset.maxMinutes,
                minDurationMinutes: preset.minMinutes,
              })
            }
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-yt-pillActive text-yt-bg shadow-sm'
                : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
            }`}
          >
            {preset.label}
          </button>
        );
      })}

      {/* Custom Duration Button */}
      <button
        onClick={onOpenTimeSlider}
        className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isCustomTime
            ? 'bg-yt-red text-white'
            : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text border border-yt-border/50'
        }`}
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>
          {isCustomTime ? `Custom ≤ ${filters.maxDurationMinutes} min` : 'Set duration...'}
        </span>
      </button>

      <div className="h-5 w-[1px] bg-yt-border/60 mx-1 flex-shrink-0" />

      {/* Favorites Toggle */}
      <button
        onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
        className={`whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          filters.onlyFavorites
            ? 'bg-amber-400 text-black shadow-sm font-bold'
            : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${filters.onlyFavorites ? 'fill-black' : 'fill-none'}`} />
        <span>Favorites</span>
      </button>

      {/* Hide Watched Toggle */}
      <button
        onClick={() => onFilterChange({ hideWatched: !filters.hideWatched })}
        aria-pressed={filters.hideWatched}
        className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          filters.hideWatched
            ? 'bg-yt-pillActive text-yt-bg'
            : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
        }`}
        title="Hide videos marked as watched, including videos you open from MyTube"
      >
        <EyeOff className="w-3.5 h-3.5" />
        <span>Unwatched</span>
      </button>

      {/* Hide Shorts */}
      <button
        onClick={() => onFilterChange({ hideShorts: !filters.hideShorts })}
        aria-pressed={filters.hideShorts}
        className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          filters.hideShorts
            ? 'bg-yt-pillActive text-yt-bg'
            : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
        }`}
        title="Shorts are approximated as videos up to 3 minutes; regular short videos may also be hidden."
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{filters.hideShorts ? 'Hide Shorts' : 'Show Shorts'}</span>
      </button>

      {/* Hide live streams */}
      <button
        onClick={() => onFilterChange({ hideLiveStreams: !filters.hideLiveStreams })}
        aria-pressed={filters.hideLiveStreams}
        className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          filters.hideLiveStreams
            ? 'bg-yt-pillActive text-yt-bg'
            : 'bg-yt-pill hover:bg-yt-pillHover text-yt-text'
        }`}
        title="Hide current, upcoming, and videos with live-stream metadata."
      >
        <Radio className="w-3.5 h-3.5" />
        <span>{filters.hideLiveStreams ? 'Hide live' : 'Show live'}</span>
      </button>

      {/* Sort Option Dropdown */}
      <div className="relative flex-shrink-0 ml-auto flex items-center gap-1">
        <label htmlFor="sort-select" className="sr-only">Sort by</label>
        <ArrowUpDown className="w-3.5 h-3.5 text-yt-textSec" />
        <select
          id="sort-select"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          className="bg-yt-pill hover:bg-yt-pillHover text-xs text-yt-text rounded-lg px-2 py-1.5 border border-yt-border/40 focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="duration_asc">Shortest first</option>
          <option value="duration_desc">Longest first</option>
        </select>

        {/* Video Count indicator */}
        <span className="hidden lg:inline-block text-[11px] text-yt-textSec px-2 whitespace-nowrap">
          {filteredVideoCount} / {totalVideoCount} videos
        </span>
      </div>
    </div>
  );
};
