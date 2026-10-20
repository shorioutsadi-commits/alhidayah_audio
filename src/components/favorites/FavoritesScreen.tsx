import React from 'react';
import { Heart, Play, ArrowRight } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { AudioCard } from '../home/AudioCard';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { TabType } from '../common/BottomNav';

interface FavoritesScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onNavigateTab }) => {
  const { audios, favorites, playAudio } = useAudioPlayer();

  const favoriteAudios = audios.filter(audio => favorites.includes(audio.id));

  return (
    <div className="pb-32 px-4 pt-4 max-w-md mx-auto space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h2 className="text-base font-bold text-stone-900">পছন্দের অডিও তালিকা</h2>
        </div>

        <span className="text-xs font-semibold text-stone-400">
          {toBengaliNumber(favoriteAudios.length)} টি সংরক্ষিত
        </span>
      </div>

      {favoriteAudios.length > 0 && (
        <button
          onClick={() => playAudio(favoriteAudios[0], favoriteAudios)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-orange-600/20 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>পছন্দের সবগুলো অডিও শুনুন</span>
        </button>
      )}

      {/* List */}
      {favoriteAudios.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/90 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-3">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="text-sm font-bold text-stone-800">
            পছন্দের কোনো অডিও যুক্ত করা হয়নি
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mt-1 leading-relaxed">
            যেকোনো বয়ান বা তিলাওয়াত ভালো লাগলে হার্ট (❤️) আইকনে ট্যাপ করে এখানে সেভ করতে পারেন।
          </p>

          <button
            onClick={() => onNavigateTab('home')}
            className="mt-4 flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            <span>আলোচনা ব্রাউজ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {favoriteAudios.map((audio) => (
            <AudioCard key={audio.id} audio={audio} playlist={favoriteAudios} />
          ))}
        </div>
      )}

    </div>
  );
};
