import React from 'react';
import { Play, Pause, ChevronUp, RotateCcw, RotateCw } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDurationBengali } from '../../utils/bengaliUtils';

export const MiniPlayer: React.FC = () => {
  const { 
    currentAudio, 
    isPlaying, 
    isLoading,
    togglePlay, 
    currentTime, 
    duration, 
    skipSeconds,
    setIsFullPlayerOpen 
  } = useAudioPlayer();

  if (!currentAudio) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed mini-player-pos left-0 right-0 z-35 px-2 pointer-events-auto">
      <div 
        onClick={() => setIsFullPlayerOpen(true)}
        className="max-w-md mx-auto relative bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-stone-800/80 overflow-hidden cursor-pointer select-none group transition-all transform active:scale-[0.99]"
      >
        {/* Top Slim Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        <div className="flex items-center justify-between p-2 pt-2.5">
          {/* Left: Thumbnail & Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-stone-800 border border-stone-700/60">
              <img 
                src={currentAudio.speakerImage} 
                alt={currentAudio.speakerName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = './dr_abu_bakkar_zakaria.png';
                }}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-orange-400 animate-pulse h-3" />
                    <span className="w-0.5 bg-orange-400 animate-pulse h-2 delay-75" />
                    <span className="w-0.5 bg-orange-400 animate-pulse h-3.5 delay-150" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-stone-100 truncate group-hover:text-orange-400 transition-colors">
                {currentAudio.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <span className="truncate">{currentAudio.speakerName}</span>
                <span>•</span>
                <span className="text-orange-400/90 font-mono text-[10px]">
                  {formatDurationBengali(currentTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div 
            className="flex items-center gap-1 shrink-0 ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 10s Rewind */}
            <button
              onClick={() => skipSeconds(-10)}
              aria-label="১০ সেকেন্ড পেছনে"
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 active:scale-90 transition-all"
              title="১০ সেকেন্ড পেছনে"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'বিরতি দিন' : 'চালান'}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white shadow-md shadow-orange-600/30 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* 10s Forward */}
            <button
              onClick={() => skipSeconds(10)}
              aria-label="১০ সেকেন্ড সামনে"
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 active:scale-90 transition-all"
              title="১০ সেকেন্ড সামনে"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Open Full Player */}
            <button
              onClick={() => setIsFullPlayerOpen(true)}
              aria-label="পূর্ণাঙ্গ প্লেয়ার খুলুন"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 active:scale-90 transition-all ml-0.5"
              title="বড় প্লেয়ার"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
