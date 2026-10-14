import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  HardDrive, 
  Play, 
  Pause, 
  WifiOff, 
  FileDown, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDurationBengali, formatFileSizeBengali, toBengaliNumber } from '../../utils/bengaliUtils';
import { TabType } from '../common/BottomNav';

interface DownloadsScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({ onNavigateTab }) => {
  const { 
    downloads, 
    deleteDownload, 
    clearAllDownloads, 
    playAudio, 
    currentAudio, 
    isPlaying, 
    togglePlay 
  } = useAudioPlayer();

  const [confirmClear, setConfirmClear] = useState(false);

  // Calculate total space used
  const totalMb = downloads.reduce((acc, curr) => acc + (curr.fileSizeMb || 10), 0);

  const handleDeviceDownload = (audioUrl: string, title: string) => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="pb-32 px-4 pt-4 max-w-md mx-auto space-y-4">
      
      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-orange-600" />
          <h2 className="text-base font-bold text-stone-900">ডাউনলোডকৃত অডিও</h2>
        </div>

        {downloads.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সব মুছুন</span>
          </button>
        )}
      </div>

      {/* Storage Information Card */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] text-orange-100 font-medium block">
                ইন্টারনাল মেমোরি স্টোরেজ
              </span>
              <span className="text-base font-bold text-white">
                {formatFileSizeBengali(totalMb)} ব্যবহৃত
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-white/25 px-2.5 py-1 rounded-full text-[11px] font-bold">
              <WifiOff className="w-3 h-3" />
              অফলাইন রেডি
            </span>
            <span className="block text-[10px] text-orange-100 mt-1">
              {toBengaliNumber(downloads.length)} টি অডিও ফাইল
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Clear Modal Dialog */}
      {confirmClear && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-stone-800 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>আপনি কি সকল ডাউনলোড মুছে ফেলতে চান?</span>
          </div>
          <p className="text-stone-600 text-[11px]">
            এর ফলে সংরক্ষিত অফলাইন ফাইলগুলো আপনার ব্রাউজার মেমোরি থেকে মুছে যাবে।
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-semibold text-stone-600"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                clearAllDownloads();
                setConfirmClear(false);
              }}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold"
            >
              হ্যাঁ, মুছুন
            </button>
          </div>
        </div>
      )}

      {/* Downloads List */}
      {downloads.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/90 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
            <Download className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="text-sm font-bold text-stone-800">
            কোনো অডিও ডাউনলোড করা নেই
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mt-1 leading-relaxed">
            ইন্টারনেট ছাড়াই শুনতে যেকোনো অডিওর পাশে থাকা ডাউনলোড আইকনে ট্যাপ করুন।
          </p>

          <button
            onClick={() => onNavigateTab('home')}
            className="mt-4 flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            <span>অডিও ব্রাউজ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {downloads.map((item) => {
            const isCurrent = currentAudio?.id === item.id;
            const isPlayingNow = isCurrent && isPlaying;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-3.5 border border-stone-200/90 hover:border-orange-300 shadow-xs transition-all flex items-center justify-between"
              >
                <div 
                  onClick={() => {
                    if (isCurrent) togglePlay();
                    else playAudio(item, downloads);
                  }}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                    <img 
                      src={item.speakerImage} 
                      alt={item.speakerName} 
                      className="w-full h-full object-cover"
                    />
                    {isPlayingNow && (
                      <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-bold truncate leading-tight ${
                      isCurrent ? 'text-orange-600' : 'text-stone-900'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {item.speakerName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <WifiOff className="w-2.5 h-2.5" />
                        অফলাইন
                      </span>
                      <span>•</span>
                      <span>{formatDurationBengali(item.duration)}</span>
                      <span>•</span>
                      <span>{formatFileSizeBengali(item.fileSizeMb)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {/* Direct Device Download */}
                  <button
                    onClick={() => handleDeviceDownload(item.audioUrl, item.title)}
                    aria-label="মোবাইল স্টোরেজে এক্সপোর্ট করুন"
                    className="p-2 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    title="মোবাইলে ফাইল সেভ করুন"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  {/* Play Button */}
                  <button
                    onClick={() => {
                      if (isCurrent) togglePlay();
                      else playAudio(item, downloads);
                    }}
                    aria-label={isPlayingNow ? 'বিরতি দিন' : 'চালান'}
                    className={`p-2 rounded-xl transition-all ${
                      isPlayingNow 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-700'
                    }`}
                  >
                    {isPlayingNow ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Delete Download */}
                  <button
                    onClick={() => deleteDownload(item.id)}
                    aria-label="মুছে ফেলুন"
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="ডাউনলোড থেকে মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
