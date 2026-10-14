import React, { useState } from 'react';
import { 
  ChevronDown, 
  Heart, 
  Share2, 
  Download, 
  Check, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Repeat, 
  Repeat1, 
  Clock, 
  Gauge, 
  Volume2,
  Sparkles
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDurationBengali, toBengaliNumber } from '../../utils/bengaliUtils';

export const FullPlayerModal: React.FC = () => {
  const { 
    currentAudio, 
    isPlaying, 
    isLoading,
    togglePlay, 
    currentTime, 
    duration, 
    seek, 
    skipSeconds, 
    nextTrack, 
    prevTrack, 
    playbackRate, 
    setPlaybackRate, 
    playMode, 
    setPlayMode, 
    sleepTimerMinutes,
    sleepTimerRemaining,
    setSleepTimer,
    isFavorite, 
    toggleFavorite, 
    downloadAudio, 
    isDownloaded, 
    downloadProgress,
    isFullPlayerOpen, 
    setIsFullPlayerOpen 
  } = useAudioPlayer();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  if (!isFullPlayerOpen || !currentAudio) return null;

  const isFav = isFavorite(currentAudio.id);
  const downloaded = isDownloaded(currentAudio.id);
  const dlProgress = downloadProgress[currentAudio.id];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentAudio.title,
          text: `${currentAudio.speakerName} এর চমৎকার আলোচনা শুনুন আল হিদায়াহ অডিও অ্যাপে:`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share error', err);
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('অডিও লিংক কপি করা হয়েছে!');
    }
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];
  const timerOptions = [
    { label: 'বন্ধ', value: null },
    { label: '১৫ মিনিট', value: 15 },
    { label: '৩০ মিনিট', value: 30 },
    { label: '৪৫ মিনিট', value: 45 },
    { label: '৬০ মিনিট', value: 60 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-bottom duration-300">
      
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full px-5 pt-4 pb-2 flex items-center justify-between text-white">
        <button
          onClick={() => setIsFullPlayerOpen(false)}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 text-stone-300 hover:text-white transition-all"
          aria-label="প্লেয়ার নামিয়ে রাখুন"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-orange-400">
            বর্তমানে শুনছেন
          </span>
          <p className="text-xs text-stone-300 truncate max-w-[200px]">
            {currentAudio.category}
          </p>
        </div>

        <div className="flex items-center gap-1 -mr-2">
          <button
            onClick={() => toggleFavorite(currentAudio.id)}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
            aria-label="পছন্দ করুন"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-300'
              }`} 
            />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 text-stone-300 hover:text-white transition-all"
            aria-label="শেয়ার করুন"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="max-w-md mx-auto w-full px-6 flex-1 flex flex-col items-center justify-center my-auto py-4">
        
        {/* Album Artwork with Glow & Equalizer Visualizer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Glowing animated background rings when playing */}
          <div 
            className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-600/40 via-amber-500/30 to-orange-400/20 blur-xl transition-all duration-700 ${
              isPlaying ? 'scale-105 opacity-80' : 'scale-95 opacity-30'
            }`} 
          />

          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-800 bg-stone-900 group">
            <img 
              src={currentAudio.speakerImage} 
              alt={currentAudio.speakerName}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/dr_abu_bakkar_zakaria.png';
              }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

            {/* Category Badge on artwork */}
            <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700/60 text-[11px] font-medium text-orange-400 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>{currentAudio.category}</span>
            </div>

            {/* Audio Waveform visualization at bottom of artwork */}
            {isPlaying && (
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-center gap-1 h-6">
                {[40, 70, 90, 60, 100, 50, 80, 45, 95, 65, 85, 40].map((height, i) => (
                  <span 
                    key={i} 
                    className="w-1 bg-orange-400/90 rounded-full animate-pulse"
                    style={{ 
                      height: `${height}%`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audio Meta Details */}
        <div className="w-full text-center mt-5 mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-snug">
            {currentAudio.title}
          </h2>
          <p className="text-sm font-medium text-orange-400 mt-1">
            {currentAudio.speakerName}
          </p>
          {currentAudio.seriesName && (
            <span className="inline-block mt-1 text-[11px] text-stone-400 bg-stone-900/60 border border-stone-800 px-2.5 py-0.5 rounded-full">
              সিরিজ: {currentAudio.seriesName}
            </span>
          )}
        </div>

        {/* Progress Bar / Scrubber */}
        <div className="w-full mt-4">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || currentAudio.duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="অডিও টেনে সময় পরিবর্তন করুন"
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-stone-400 mt-1.5 px-0.5">
            <span>{formatDurationBengali(currentTime)}</span>
            <span>{formatDurationBengali(duration || currentAudio.duration)}</span>
          </div>
        </div>

        {/* Playback Primary Controls */}
        <div className="w-full flex items-center justify-between mt-4 px-2">
          {/* Repeat Mode */}
          <button
            onClick={() => {
              if (playMode === 'normal') setPlayMode('repeat-all');
              else if (playMode === 'repeat-all') setPlayMode('repeat-one');
              else setPlayMode('normal');
            }}
            aria-label="পুনরাবৃত্তি মোড"
            className={`p-2.5 rounded-full hover:bg-stone-800 transition-all ${
              playMode !== 'normal' ? 'text-orange-400 bg-stone-900' : 'text-stone-400 hover:text-white'
            }`}
            title={
              playMode === 'repeat-one' ? 'একটি অডিও পুনরাবৃত্তি' :
              playMode === 'repeat-all' ? 'সবগুলো অডিও পুনরাবৃত্তি' : 'স্বাভাবিক'
            }
          >
            {playMode === 'repeat-one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>

          {/* Previous Track */}
          <button
            onClick={prevTrack}
            aria-label="পূর্ববর্তী অডিও"
            className="p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full active:scale-95 transition-all"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* 10s Rewind */}
          <button
            onClick={() => skipSeconds(-10)}
            aria-label="১০ সেকেন্ড পেছনে"
            className="p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full active:scale-95 transition-all"
            title="১০ সেকেন্ড পেছনে"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Main Big Play/Pause Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'বিরতি দিন' : 'চালান'}
            className="relative p-5 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl shadow-orange-600/40 active:scale-95 transition-transform flex items-center justify-center group"
          >
            {isLoading ? (
              <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          {/* 10s Forward */}
          <button
            onClick={() => skipSeconds(10)}
            aria-label="১০ সেকেন্ড সামনে"
            className="p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full active:scale-95 transition-all"
            title="১০ সেকেন্ড সামনে"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            aria-label="পরবর্তী অডিও"
            className="p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-full active:scale-95 transition-all"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Download Action */}
          <button
            onClick={() => downloadAudio(currentAudio)}
            disabled={downloaded || dlProgress !== undefined}
            aria-label={downloaded ? 'ডাউনলোডকৃত' : 'ডাউনলোড করুন'}
            className={`p-2.5 rounded-full transition-all ${
              downloaded 
                ? 'text-emerald-400 bg-stone-900 cursor-default' 
                : dlProgress !== undefined 
                ? 'text-orange-400' 
                : 'text-stone-400 hover:text-white hover:bg-stone-800 active:scale-95'
            }`}
            title={downloaded ? 'অফলাইনে সেভ আছে' : 'অফলাইনে ডাউনলোড করুন'}
          >
            {downloaded ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : dlProgress !== undefined ? (
              <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        </div>

      </div>

      {/* Bottom Auxiliary Controls (Speed, Sleep Timer, Quality) */}
      <div className="max-w-md mx-auto w-full px-6 py-4 border-t border-stone-800/80 bg-stone-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-stone-400">
          
          {/* Playback Speed Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSpeedMenu(!showSpeedMenu);
                setShowTimerMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <Gauge className="w-3.5 h-3.5 text-orange-400" />
              <span>গতি: {toBengaliNumber(playbackRate)}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 left-0 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 min-w-[110px] z-20 animate-in fade-in zoom-in-95">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1.5 text-left rounded-lg text-xs font-medium transition-colors ${
                      playbackRate === rate 
                        ? 'bg-orange-600 text-white font-bold' 
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {toBengaliNumber(rate)}x {rate === 1.0 && '(স্বাভাবিক)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTimerMenu(!showTimerMenu);
                setShowSpeedMenu(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                sleepTimerMinutes 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {sleepTimerRemaining !== null 
                  ? `${toBengaliNumber(Math.ceil(sleepTimerRemaining / 60))} মি.`
                  : 'ঘুমের টাইমার'}
              </span>
            </button>

            {showTimerMenu && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 min-w-[130px] z-20 animate-in fade-in zoom-in-95">
                {timerOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSleepTimer(opt.value);
                      setShowTimerMenu(false);
                    }}
                    className={`px-3 py-1.5 text-left rounded-lg text-xs font-medium transition-colors ${
                      sleepTimerMinutes === opt.value 
                        ? 'bg-amber-600 text-white font-bold' 
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Quality indicator */}
          <div className="flex items-center gap-1 text-[11px] text-stone-400 bg-stone-800/80 px-2.5 py-1.5 rounded-xl border border-stone-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HD ১২৮ kbps</span>
          </div>

        </div>
      </div>

    </div>
  );
};
