import React from 'react';
import { Play, Pause, Download, Check, Heart, Clock, Headphones } from 'lucide-react';
import { AudioItem } from '../../types/audio';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDurationBengali, formatPlayCountBengali, formatFileSizeBengali } from '../../utils/bengaliUtils';

interface AudioCardProps {
  audio: AudioItem;
  playlist?: AudioItem[];
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio, playlist }) => {
  const { 
    currentAudio, 
    isPlaying, 
    playAudio, 
    togglePlay, 
    isFavorite, 
    toggleFavorite,
    downloadAudio,
    isDownloaded,
    downloadProgress
  } = useAudioPlayer();

  const isCurrent = currentAudio?.id === audio.id;
  const isPlayingNow = isCurrent && isPlaying;
  const isFav = isFavorite(audio.id);
  const downloaded = isDownloaded(audio.id);
  const dlProgress = downloadProgress[audio.id];

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playAudio(audio, playlist);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!downloaded && dlProgress === undefined) {
      downloadAudio(audio);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(audio.id);
  };

  return (
    <div 
      onClick={handlePlayClick}
      className={`group relative bg-white rounded-2xl p-3.5 transition-all duration-200 border cursor-pointer select-none active:scale-[0.99] shadow-xs hover:shadow-md ${
        isCurrent 
          ? 'border-orange-500/80 bg-orange-50/20 ring-1 ring-orange-400/40' 
          : 'border-stone-200/90 hover:border-orange-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Speaker Thumbnail */}
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/80 shadow-xs">
          <img 
            src={audio.speakerImage} 
            alt={audio.speakerName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/dr_abu_bakkar_zakaria.png';
            }}
          />
          
          {/* Category Tag overlay on image */}
          <div className="absolute top-1 left-1 max-w-[85%] bg-stone-900/85 backdrop-blur-xs text-[9px] font-semibold text-white px-1.5 py-0.5 rounded truncate">
            {audio.category}
          </div>

          {/* Playing overlay */}
          {isPlayingNow && (
            <div className="absolute inset-0 bg-orange-600/30 backdrop-blur-xs flex items-center justify-center">
              <div className="flex items-end gap-1 h-4">
                <span className="w-1 bg-white animate-pulse h-4 rounded-full" />
                <span className="w-1 bg-white animate-pulse h-2.5 delay-100 rounded-full" />
                <span className="w-1 bg-white animate-pulse h-3.5 delay-200 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Info & Content */}
        <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
          <div>
            <h3 className={`text-sm font-bold line-clamp-2 leading-tight transition-colors ${
              isCurrent ? 'text-orange-600' : 'text-stone-900 group-hover:text-orange-600'
            }`}>
              {audio.title}
            </h3>
            
            <p className="text-xs font-medium text-stone-600 mt-1 flex items-center gap-1 truncate">
              <span>{audio.speakerName}</span>
              {audio.seriesName && (
                <>
                  <span className="text-stone-300">•</span>
                  <span className="text-orange-600/90 text-[11px] truncate">{audio.seriesName}</span>
                </>
              )}
            </p>

            <p className="text-[11px] text-stone-500 line-clamp-1 mt-1 leading-snug">
              {audio.description}
            </p>
          </div>

          {/* Meta Badges */}
          <div className="flex items-center gap-2.5 mt-2 text-[10px] text-stone-400 font-medium">
            <span className="flex items-center gap-0.5 text-stone-500">
              <Clock className="w-3 h-3 text-stone-400" />
              {formatDurationBengali(audio.duration)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-stone-500">
              <Headphones className="w-3 h-3 text-stone-400" />
              {formatPlayCountBengali(audio.playCount)}
            </span>
            <span>•</span>
            <span className="text-stone-400">{formatFileSizeBengali(audio.fileSizeMb)}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col items-center justify-between self-stretch shrink-0 gap-2">
          
          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteClick}
            aria-label="পছন্দ"
            className="p-1.5 rounded-full text-stone-300 hover:text-rose-500 active:scale-90 transition-all"
            title="পছন্দের তালিকায় রাখুন"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-300 hover:text-stone-400'
              }`} 
            />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadClick}
            disabled={downloaded || dlProgress !== undefined}
            aria-label={downloaded ? 'ডাউনলোড সম্পন্ন' : 'অফলাইনে ডাউনলোড করুন'}
            className={`p-1.5 rounded-full transition-all ${
              downloaded 
                ? 'text-emerald-600 bg-emerald-50' 
                : dlProgress !== undefined 
                ? 'text-orange-600' 
                : 'text-stone-400 hover:text-orange-600 hover:bg-orange-50 active:scale-90'
            }`}
            title={downloaded ? 'অফলাইনে সংরক্ষিত' : 'ডাউনলোড'}
          >
            {downloaded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : dlProgress !== undefined ? (
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayClick}
            aria-label={isPlayingNow ? 'বিরতি দিন' : 'চালান'}
            className={`p-2 rounded-xl transition-all shadow-xs flex items-center justify-center active:scale-95 ${
              isPlayingNow 
                ? 'bg-orange-600 text-white shadow-orange-600/30' 
                : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white'
            }`}
          >
            {isPlayingNow ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
