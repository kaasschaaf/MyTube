import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, Check } from 'lucide-react';
import { Video } from '../types';

interface TimeSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaxMinutes: number | null;
  onApply: (maxMinutes: number | null) => void;
  videos: Video[];
}

export const TimeSliderModal: React.FC<TimeSliderModalProps> = ({
  isOpen,
  onClose,
  currentMaxMinutes,
  onApply,
  videos,
}) => {
  const [minutes, setMinutes] = useState<number>(currentMaxMinutes ?? 15);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(currentMaxMinutes === null);

  useEffect(() => {
    if (isOpen) {
      setMinutes(currentMaxMinutes ?? 15);
      setIsUnlimited(currentMaxMinutes === null);
    }
  }, [isOpen, currentMaxMinutes]);

  if (!isOpen) return null;

  // Calculate how many videos match this duration
  const matchingCount = videos.filter((v) => {
    if (isUnlimited) return true;
    return v.durationSeconds <= minutes * 60;
  }).length;

  const handlePreset = (presetMinutes: number) => {
    setMinutes(presetMinutes);
    setIsUnlimited(false);
  };

  const handleApply = () => {
    onApply(isUnlimited ? null : minutes);
    onClose();
  };

  const handleReset = () => {
    setIsUnlimited(true);
    onApply(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-yt-surface border border-yt-border rounded-2xl shadow-2xl p-6 text-yt-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-yt-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yt-red/15 text-yt-red">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">How much time do you have?</h2>
              <p className="text-xs text-yt-textSec">
                Filter videos to fit the time you have
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

        {/* Content */}
        <div className="py-6 flex flex-col items-center">
          {/* Large Time Display */}
          <div className="text-center mb-6">
            {isUnlimited ? (
              <div className="text-4xl font-extrabold text-white tracking-tight">
                No limit
              </div>
            ) : (
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-black text-yt-red tracking-tight">
                  {minutes}
                </span>
                <span className="text-xl font-medium text-yt-textSec">minutes</span>
              </div>
            )}
            <p className="text-xs text-yt-textSec mt-1">
              {isUnlimited
                ? 'Shows videos of any length'
                : `Shows videos up to ${minutes} minutes long`}
            </p>
          </div>

          {/* Range Slider */}
          <div className="w-full px-2 mb-6">
            <input
              type="range"
              min="2"
              max="60"
              step="1"
              disabled={isUnlimited}
              value={minutes}
              onChange={(e) => {
                setMinutes(parseInt(e.target.value, 10));
                setIsUnlimited(false);
              }}
              className="w-full h-2 bg-yt-pill rounded-lg appearance-none cursor-pointer accent-yt-red disabled:opacity-30"
            />
            <div className="flex justify-between text-[11px] text-yt-textSec mt-2 font-medium">
              <span>2 min</span>
              <span className="text-yt-red font-bold">15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-3 gap-2 w-full mb-6">
            {[
              { label: '5 min', value: 5, desc: 'Quick break' },
              { label: '10 min', value: 10, desc: 'Coffee break' },
              { label: '15 min ⭐', value: 15, desc: 'Before you go' },
              { label: '20 min', value: 20, desc: 'Lunch break' },
              { label: '30 min', value: 30, desc: 'Take it easy' },
              { label: 'All', value: null, desc: 'No limit' },
            ].map((p) => {
              const active =
                (p.value === null && isUnlimited) ||
                (p.value !== null && !isUnlimited && minutes === p.value);

              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    if (p.value === null) {
                      setIsUnlimited(true);
                    } else {
                      handlePreset(p.value);
                    }
                  }}
                  className={`p-2 rounded-xl text-left border transition flex flex-col justify-between ${
                    active
                      ? 'bg-yt-red/15 border-yt-red text-white'
                      : 'bg-yt-pill/60 border-yt-border/40 hover:bg-yt-pillHover text-yt-text'
                  }`}
                >
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-[10px] text-yt-textSec">{p.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Results Badge */}
          <div className="w-full bg-yt-bg/80 border border-yt-border/50 rounded-xl py-2 px-3 flex items-center justify-between text-xs">
            <span className="text-yt-textSec flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Matching videos:
            </span>
            <span className="font-bold text-white bg-yt-pill px-2 py-0.5 rounded-full">
              {matchingCount} videos
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-yt-border/40">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold text-yt-textSec hover:text-white hover:bg-yt-pillHover transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-full text-xs font-bold bg-yt-red hover:bg-yt-redHover text-white flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
