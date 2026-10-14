import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Tag, Sparkles } from 'lucide-react';
import { AUDIOS_DATA } from '../../data/mockAudioData';
import { AudioCard } from '../home/AudioCard';
import { toBengaliNumber } from '../../utils/bengaliUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularKeywords = [
    'আবু বকর জাকারিয়া',
    'মতিউর রহমান মাদানি',
    'আব্দুর রাজ্জাক বিন ইউসুফ',
    'আসাদুল্লাহ আল গালিব',
    'সাইফুল্লাহ মাদানি',
    'মানজুরে ইলাহি',
    'আব্দুল হামিদ ফাইযি',
    'মোজাফফর বিন মহসিন',
    'আব্দুল্লাহ জাহাঙ্গীর',
    'আহমাদুল্লাহ সালাফি',
    'সূরা আর-রহমান',
    'সূরা আল-মুলক'
  ];

  const results = query.trim() === '' 
    ? [] 
    : AUDIOS_DATA.filter((item) => {
        const q = query.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.speakerName.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.seriesName && item.seriesName.toLowerCase().includes(q))
        );
      });

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 flex flex-col animate-in fade-in duration-200">
      
      {/* Search Header Bar */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-10 shadow-xs">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 -ml-1 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-600" />
            <input
              ref={inputRef}
              type="text"
              placeholder="বয়ান, বক্তা বা সূরা অনুসন্ধান করুন..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-xl pl-9 pr-9 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                aria-label="মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {query.trim() === '' ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>জনপ্রিয় অনুসন্ধান শব্দসমূহ</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setQuery(kw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 hover:border-orange-500 hover:text-orange-600 shadow-2xs transition-colors"
                  >
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-4 text-xs text-stone-700 space-y-1.5">
              <span className="font-bold text-orange-800 block">💡 খোঁজার টিপস:</span>
              <p className="text-stone-600 leading-relaxed">
                বক্তার নাম (যেমন: আবু বকর জাকারিয়া, মতিউর রহমান মাদানি), সূরার নাম (যেমন: আর-রহমান, আল-মুলক) কিংবা যেকোনো বিষয়ের নাম লিখে দ্রুত অডিও খুঁজে পেতে পারেন।
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700">
                অনুসন্ধানের ফলাফল
              </span>
              <span className="text-xs font-medium text-orange-600">
                {toBengaliNumber(results.length)} টি অডিও পাওয়া গেছে
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-stone-500 text-xs border border-stone-200">
                &quot;{query}&quot; দিয়ে কোনো অডিও পাওয়া যায়নি। দয়া করে ভিন্ন শব্দ বা বানান পরীক্ষা করে পুনরায় চেষ্টা করুন।
              </div>
            ) : (
              <div className="space-y-2.5 pb-24">
                {results.map((audio) => (
                  <AudioCard key={audio.id} audio={audio} playlist={results} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
