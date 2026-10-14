import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Grid, 
  Play, 
  BookOpen, 
  ShieldCheck, 
  Compass, 
  Users, 
  Heart, 
  Sparkles, 
  Moon, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { CATEGORIES_DATA, AUDIOS_DATA } from '../../data/mockAudioData';
import { Category, AudioItem } from '../../types/audio';
import { AudioCard } from '../home/AudioCard';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface CategoriesScreenProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck': return ShieldCheck;
    case 'BookOpen': return BookOpen;
    case 'Compass': return Compass;
    case 'Users': return Users;
    case 'Heart': return Heart;
    case 'Sparkles': return Sparkles;
    case 'Moon': return Moon;
    case 'HelpCircle': return HelpCircle;
    default: return FolderOpen;
  }
};

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const { playAudio } = useAudioPlayer();

  const selectedCategory = CATEGORIES_DATA.find(c => c.id === selectedCategoryId);

  // If a category is selected, show filtered audios
  if (selectedCategory) {
    const categoryAudios = AUDIOS_DATA.filter(a => a.category === selectedCategory.name);
    const Icon = getCategoryIcon(selectedCategory.iconName);

    return (
      <div className="pb-32 px-4 pt-3 max-w-md mx-auto space-y-4 animate-in fade-in">
        {/* Back Button */}
        <button
          onClick={() => onSelectCategory(null)}
          className="flex items-center gap-1.5 text-stone-600 hover:text-orange-600 font-semibold text-xs py-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল ক্যাটাগরিতে ফিরে যান</span>
        </button>

        {/* Category Header Card */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-lg shadow-orange-600/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {selectedCategory.name}
              </h2>
              <p className="text-xs text-orange-100 mt-0.5">
                {toBengaliNumber(categoryAudios.length)} টি আলোচনা উপলব্ধ
              </p>
            </div>
          </div>

          <p className="text-xs text-orange-50 mt-3.5 leading-relaxed bg-black/10 p-2.5 rounded-xl">
            {selectedCategory.description}
          </p>

          {categoryAudios.length > 0 && (
            <button
              onClick={() => playAudio(categoryAudios[0], categoryAudios)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 active:scale-95 rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>এই বিষয়ের সবগুলো অডিও শুনুন</span>
            </button>
          )}
        </div>

        {/* List of Audios */}
        <div className="space-y-2.5">
          {categoryAudios.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-stone-400 text-xs border border-stone-200">
              এই ক্যাটাগরিতে আরও নতুন অডিও খুব দ্রুত যুক্ত করা হবে।
            </div>
          ) : (
            categoryAudios.map((audio) => (
              <AudioCard key={audio.id} audio={audio} playlist={categoryAudios} />
            ))
          )}
        </div>

      </div>
    );
  }

  // Categories Grid List
  return (
    <div className="pb-32 px-4 pt-4 max-w-md mx-auto space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-orange-600" />
          <h2 className="text-base font-bold text-stone-900">বিষয়ভিত্তিক ক্যাটাগরি</h2>
        </div>
        <span className="text-xs font-semibold text-stone-400">
          {toBengaliNumber(CATEGORIES_DATA.length)} টি বিভাগ
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl p-4 border border-stone-200/90 hover:border-orange-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
                  {cat.name}
                </h3>

                <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                <span className="text-orange-600 font-semibold">
                  {toBengaliNumber(cat.audioCount)} অডিও
                </span>
                <Play className="w-3 h-3 text-stone-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
