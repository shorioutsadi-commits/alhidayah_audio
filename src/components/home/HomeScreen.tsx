import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  ChevronRight, 
  BookOpen, 
  Mic2, 
  Flame,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { AUDIOS_DATA, SPEAKERS_DATA, CATEGORIES_DATA } from '../../data/mockAudioData';
import { AudioCard } from './AudioCard';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDurationBengali, toBengaliNumber } from '../../utils/bengaliUtils';
import { Speaker, AudioItem } from '../../types/audio';
import { TabType } from '../common/BottomNav';

interface HomeScreenProps {
  onSelectSpeaker: (speaker: Speaker) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectSpeaker,
  onSelectCategory,
  onNavigateTab
}) => {
  const { currentAudio, isPlaying, playAudio, togglePlay } = useAudioPlayer();
  const [selectedFilter, setSelectedFilter] = useState<string>('সকল');

  // Featured audio (first with isFeatured)
  const featuredAudio = AUDIOS_DATA.find(a => a.isFeatured) || AUDIOS_DATA[0];
  const isFeaturedPlaying = currentAudio?.id === featuredAudio.id && isPlaying;

  // Filtered audios
  const filterTags = ['সকল', 'কুরআন তিলাওয়াত ও অর্থ', 'তাওবা ও আত্মশুদ্ধি', 'পরিবার ও সমাজ সংস্কার', 'ঈমান ও আকীদা'];
  
  const displayAudios = selectedFilter === 'সকল' 
    ? AUDIOS_DATA 
    : AUDIOS_DATA.filter(a => a.category === selectedFilter);

  // Quran audios
  const quranAudios = AUDIOS_DATA.filter(a => a.category === 'কুরআন তিলাওয়াত ও অর্থ');

  return (
    <div className="pb-32 px-4 pt-4 max-w-md mx-auto space-y-6">
      
      {/* Hero Featured Audio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white p-5 shadow-lg shadow-orange-600/25">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-28 h-28 bg-amber-400/20 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide text-orange-50">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              আজকের নির্বাচিত অডিও
            </span>

            <span className="text-[11px] font-medium text-orange-100 font-mono">
              {formatDurationBengali(featuredAudio.duration)}
            </span>
          </div>

          <div className="my-3.5">
            <h2 className="text-lg font-bold leading-snug drop-shadow-sm text-white">
              {featuredAudio.title}
            </h2>
            <p className="text-xs text-orange-100 font-medium mt-1 flex items-center gap-1.5">
              <span>{featuredAudio.speakerName}</span>
              <span>•</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-[10px]">
                {featuredAudio.category}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex items-center gap-2">
              <img 
                src={featuredAudio.speakerImage} 
                alt={featuredAudio.speakerName} 
                className="w-8 h-8 rounded-full border border-white/40 object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = './dr_abu_bakkar_zakaria.png';
                }}
              />
              <span className="text-xs text-white/90 font-medium truncate max-w-[150px]">
                {featuredAudio.description}
              </span>
            </div>

            <button
              onClick={() => {
                if (currentAudio?.id === featuredAudio.id) {
                  togglePlay();
                } else {
                  playAudio(featuredAudio, AUDIOS_DATA);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 active:scale-95 rounded-xl font-bold text-xs shadow-md shadow-black/10 transition-all shrink-0 ml-2"
            >
              {isFeaturedPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>বিরতি দিন</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>এখনই শুনুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none select-none">
        {filterTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedFilter(tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === tag
                ? 'bg-orange-600 text-white shadow-xs shadow-orange-500/30'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Popular Speakers Horizontal Scroll */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Mic2 className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-stone-900">জনপ্রিয় বক্তাগণ ও দাঈ</h3>
          </div>
          <button
            onClick={() => onNavigateTab('speakers')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none select-none">
          {SPEAKERS_DATA.slice(0, 14).map((speaker) => (
            <div
              key={speaker.id}
              onClick={() => onSelectSpeaker(speaker)}
              className="flex flex-col items-center shrink-0 w-20 group cursor-pointer"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden p-0.5 border-2 border-orange-500/60 group-hover:border-orange-600 group-hover:scale-105 transition-all shadow-xs bg-white">
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = './dr_abu_bakkar_zakaria.png';
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold text-stone-800 text-center mt-1.5 line-clamp-1 leading-tight group-hover:text-orange-600 transition-colors">
                {speaker.name}
              </span>
              <span className="text-[9px] text-stone-400 font-medium">
                {toBengaliNumber(speaker.totalAudios)} টি অডিও
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quran Recitation Section */}
      <section className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-950">কুরআন তিলাওয়াত ও বাংলা অর্থ</h3>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">
            {toBengaliNumber(quranAudios.length)} টি সূরা
          </span>
        </div>

        <div className="space-y-2">
          {quranAudios.slice(0, 2).map((audio) => (
            <AudioCard key={audio.id} audio={audio} playlist={quranAudios} />
          ))}
        </div>
      </section>

      {/* Latest Audios Feed (image_1.png style) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-stone-900">
              {selectedFilter === 'সকল' ? 'সর্বশেষ প্রকাশিত আলোচনা' : selectedFilter}
            </h3>
          </div>
          <span className="text-xs font-medium text-stone-400">
            {toBengaliNumber(displayAudios.length)} টি অডিও
          </span>
        </div>

        <div className="space-y-2.5">
          {displayAudios.map((audio) => (
            <AudioCard key={audio.id} audio={audio} playlist={displayAudios} />
          ))}
        </div>
      </section>

    </div>
  );
};
