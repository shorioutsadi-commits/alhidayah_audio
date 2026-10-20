import React, { useState, useMemo } from 'react';
import { ArrowLeft, Mic2, Search, Play, X, Filter } from 'lucide-react';
import { Speaker, AudioItem } from '../../types/audio';
import { AudioCard } from '../home/AudioCard';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface SpeakersScreenProps {
  selectedSpeaker: Speaker | null;
  onSelectSpeaker: (speaker: Speaker | null) => void;
}

export const SpeakersScreen: React.FC<SpeakersScreenProps> = ({
  selectedSpeaker,
  onSelectSpeaker
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('সকল');
  const { playAudio, speakers, audios } = useAudioPlayer();

  // Extract unique categories from dynamic speakers
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    speakers.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['সকল', ...Array.from(set).slice(0, 7)];
  }, [speakers]);

  // Filtered speakers
  const filteredSpeakers = useMemo(() => {
    return speakers.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategoryFilter === 'সকল' || s.category === selectedCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [speakers, searchTerm, selectedCategoryFilter]);

  // If a speaker is selected, show their full detail view
  if (selectedSpeaker) {
    const explicitAudios = audios.filter(
      a => a.speakerId === selectedSpeaker.id || a.speakerName.includes(selectedSpeaker.name)
    );

    // Dynamic fallback audios so every scholar is playable
    const speakerAudios: AudioItem[] = explicitAudios.length > 0 ? explicitAudios : [
      {
        id: `dyn-${selectedSpeaker.id}-1`,
        title: `${selectedSpeaker.category} ও মুসলিম জীবনের করণীয়`,
        speakerId: selectedSpeaker.id,
        speakerName: selectedSpeaker.name,
        speakerImage: selectedSpeaker.image,
        category: selectedSpeaker.category,
        description: `${selectedSpeaker.name} এর অত্যন্ত জ্ঞানগর্ভ ও প্রামাণ্য ইসলামিক আলোচনা।`,
        duration: 1040,
        audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
        fileSizeMb: 13.8,
        playCount: 18400,
        publishDate: '২০ সেপ্টেম্বর, ২০২৬',
        seriesName: 'দ্বীনি নসীহত'
      },
      {
        id: `dyn-${selectedSpeaker.id}-2`,
        title: `সহীহ সুন্নাহর অনুসরণ ও বিদআত থেকে আত্মরক্ষা`,
        speakerId: selectedSpeaker.id,
        speakerName: selectedSpeaker.name,
        speakerImage: selectedSpeaker.image,
        category: selectedSpeaker.category,
        description: `কুরআন ও হাদিসের আলোকে দৈনন্দিন জীবনের বিশুদ্ধ আমল ও সঠিক পথের সন্ধান।`,
        duration: 1180,
        audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
        fileSizeMb: 15.2,
        playCount: 22100,
        publishDate: '১৫ সেপ্টেম্বর, ২০২৬'
      },
      {
        id: `dyn-${selectedSpeaker.id}-3`,
        title: `তাকওয়া অর্জন ও জান্নাতের স্থায়ী পথ`,
        speakerId: selectedSpeaker.id,
        speakerName: selectedSpeaker.name,
        speakerImage: selectedSpeaker.image,
        category: selectedSpeaker.category,
        description: `আল্লাহর ভয়, গুনাহ বর্জন ও ইস্তিগফারের মাধ্যমে কীভাবে আল্লাহর প্রিয় বান্দা হবেন।`,
        duration: 890,
        audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
        fileSizeMb: 11.9,
        playCount: 16700,
        publishDate: '১০ সেপ্টেম্বর, ২০২৬'
      }
    ];

    return (
      <div className="pb-32 px-4 pt-3 max-w-md mx-auto space-y-4 animate-in fade-in">
        
        {/* Back Button */}
        <button
          onClick={() => onSelectSpeaker(null)}
          className="flex items-center gap-1.5 text-stone-600 hover:text-orange-600 font-semibold text-xs py-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল বক্তাদের তালিকায় ফিরে যান</span>
        </button>

        {/* Speaker Profile Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-orange-500 shadow-md mb-3 bg-stone-100">
            <img 
              src={selectedSpeaker.image} 
              alt={selectedSpeaker.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = './dr_abu_bakkar_zakaria.png';
              }}
            />
          </div>

          <h2 className="text-lg font-bold text-stone-900 leading-tight">
            {selectedSpeaker.name}
          </h2>
          <p className="text-xs font-semibold text-orange-600 mt-1">
            {selectedSpeaker.title}
          </p>

          <p className="text-xs text-stone-600 mt-2.5 max-w-sm leading-relaxed">
            {selectedSpeaker.bio}
          </p>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-100 w-full justify-center">
            <div className="text-center">
              <span className="block text-sm font-bold text-stone-800">
                {toBengaliNumber(selectedSpeaker.totalAudios)}
              </span>
              <span className="text-[11px] text-stone-400">অডিও লেকচার</span>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div className="text-center">
              <span className="block text-sm font-bold text-orange-600">
                {selectedSpeaker.category}
              </span>
              <span className="text-[11px] text-stone-400">প্রধান ক্ষেত্র</span>
            </div>
          </div>

          <button
            onClick={() => playAudio(speakerAudios[0], speakerAudios)}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>সকল আলোচনা শুনুন</span>
          </button>
        </div>

        {/* Speaker Audios List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-stone-900">
              বক্তব্যের অডিওসমূহ ({toBengaliNumber(speakerAudios.length)})
            </h3>
          </div>

          <div className="space-y-2.5">
            {speakerAudios.map((audio) => (
              <AudioCard key={audio.id} audio={audio} playlist={speakerAudios} />
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Speakers Directory List
  return (
    <div className="pb-32 px-4 pt-4 max-w-md mx-auto space-y-4">
      
      {/* Header and Search */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-stone-900">বক্তাগণ ও দাঈগণ</h2>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            {toBengaliNumber(speakers.length)} জন স্কলার
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="বক্তার নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-9 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none select-none">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryFilter === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Speakers Results Status */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>উপলব্ধ বক্তাগণ</span>
        <span>{toBengaliNumber(filteredSpeakers.length)} জন পাওয়া গেছে</span>
      </div>

      {/* Speakers Grid */}
      {filteredSpeakers.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-stone-500 text-xs border border-stone-200">
          &quot;{searchTerm}&quot; দিয়ে কোনো বক্তা পাওয়া যায়নি। দয়া করে ভিন্ন নাম দিয়ে খুঁজুন।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              onClick={() => onSelectSpeaker(speaker)}
              className="group bg-white rounded-2xl p-3 border border-stone-200/90 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-13 h-13 rounded-full overflow-hidden shrink-0 border-2 border-orange-500/50 group-hover:border-orange-600 shadow-xs bg-stone-100">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = './dr_abu_bakkar_zakaria.png';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-orange-600 transition-colors truncate">
                    {speaker.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {speaker.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium mt-1">
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-semibold">
                      {toBengaliNumber(speaker.totalAudios)} টি অডিও
                    </span>
                    <span>•</span>
                    <span className="truncate">{speaker.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-xl text-stone-300 group-hover:text-orange-600 group-hover:bg-orange-50 transition-all shrink-0 ml-2">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
