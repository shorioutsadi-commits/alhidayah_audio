import React from 'react';
import { 
  X, 
  Home, 
  Mic2, 
  Grid, 
  Download, 
  Heart, 
  Clock, 
  Settings, 
  Info, 
  Smartphone, 
  Share2, 
  MessageSquare,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { TabType } from './BottomNav';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenOtherApps: () => void;
  onOpenInstallModal: () => void;
  onOpenSleepTimer: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenSettings,
  onOpenAbout,
  onOpenOtherApps,
  onOpenInstallModal,
  onOpenSleepTimer
}) => {
  const { downloads, favorites, sleepTimerMinutes, showToast } = useAudioPlayer();

  if (!isOpen) return null;

  const handleNav = (tab: TabType) => {
    onSelectTab(tab);
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'আল হিদায়াহ অডিও - ইসলামিক অডিও লাইব্রেরি',
          text: 'বাংলা ভাষায় সমৃদ্ধ ইসলামিক ওয়াজ, লেকচার ও কুরআন তিলাওয়াত শুনুন এবং অফলাইনে ডাউনলোড করুন।',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('অ্যাপের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-xs h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        
        {/* Drawer Header */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-5 text-white relative">
          <button 
            onClick={onClose}
            aria-label="মেনু বন্ধ করুন"
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mt-1">
            <Logo size="md" variant="white" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                আল হিদায়াহ অডিও
              </h2>
              <p className="text-xs text-orange-100 font-medium mt-0.5">
                ইসলামিক অডিও লাইব্রেরি
              </p>
            </div>
          </div>

          {/* Quick Counters */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
            <div 
              onClick={() => handleNav('downloads')}
              className="bg-white/15 hover:bg-white/25 rounded-lg p-2 text-center cursor-pointer transition-colors"
            >
              <span className="block font-bold text-sm">{toBengaliNumber(downloads.length)}</span>
              <span className="text-[11px] text-orange-100">ডাউনলোডকৃত</span>
            </div>
            <div 
              onClick={() => handleNav('favorites')}
              className="bg-white/15 hover:bg-white/25 rounded-lg p-2 text-center cursor-pointer transition-colors"
            >
              <span className="block font-bold text-sm">{toBengaliNumber(favorites.length)}</span>
              <span className="text-[11px] text-orange-100">পছন্দের অডিও</span>
            </div>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          
          {/* Main Navigation Group */}
          <div className="text-[11px] font-semibold text-stone-400 px-3 py-1 uppercase tracking-wider">
            প্রধান নেভিগেশন
          </div>

          <button
            onClick={() => handleNav('home')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-orange-500" />
              <span>মূল পাতা</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => handleNav('speakers')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mic2 className="w-4 h-4 text-orange-500" />
              <span>বক্তাগণ ও দাঈ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => handleNav('categories')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Grid className="w-4 h-4 text-orange-500" />
              <span>ক্যাটাগরি ও বিষয়সমূহ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => handleNav('downloads')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-orange-500" />
              <span>ডাউনলোডসমূহ</span>
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
              {toBengaliNumber(downloads.length)}
            </span>
          </button>

          <button
            onClick={() => handleNav('favorites')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-orange-500" />
              <span>পছন্দের তালিকা</span>
            </div>
            <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
              {toBengaliNumber(favorites.length)}
            </span>
          </button>

          {/* Tools & Utilities Group */}
          <div className="pt-3">
            <div className="text-[11px] font-semibold text-stone-400 px-3 py-1 uppercase tracking-wider">
              সুবিধাসমূহ
            </div>

            <button
              onClick={() => {
                onOpenSleepTimer();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>ঘুমের টাইমার (Sleep Timer)</span>
              </div>
              {sleepTimerMinutes && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  চালু
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-stone-500" />
                <span>সেটিংস</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          {/* App Info & About Group */}
          <div className="pt-3">
            <div className="text-[11px] font-semibold text-stone-400 px-3 py-1 uppercase tracking-wider">
              অ্যাপ পরিচিতি ও সাহায্য
            </div>

            <button
              onClick={() => {
                onOpenAbout();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-blue-500" />
                <span>আমাদের সম্পর্কে</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => {
                onOpenOtherApps();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-emerald-500" />
                <span>অন্যান্য ইসলামিক অ্যাপ</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-semibold">
                নতুন
              </span>
            </button>

            <button
              onClick={() => {
                onOpenInstallModal();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-orange-50/70 hover:bg-orange-100 text-orange-800 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-orange-600" />
                <span>অ্যান্ড্রয়েড অ্যাপ ইনস্টল ও APK</span>
              </div>
              <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-md font-bold">
                APK
              </span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-stone-700 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>বন্ধুদের সাথে শেয়ার করুন</span>
              </div>
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500">
            আল হিদায়াহ অডিও সংস্করণ {toBengaliNumber('1.4.0')}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            সদকায়ে জারিয়া ও দাওয়াহ প্রচারের উদ্দেশ্যে নিবেদিত
          </p>
        </div>

      </div>
    </div>
  );
};
