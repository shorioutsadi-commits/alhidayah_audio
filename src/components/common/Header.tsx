import React from 'react';
import { Menu, Search, Download } from 'lucide-react';
import { Logo } from './Logo';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenInstallModal?: () => void;
  onOpenDownloadsTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenSearch,
  onOpenDownloadsTab
}) => {
  const { downloads } = useAudioPlayer();

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-950/10 transition-all safe-area-top">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Drawer Menu Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            aria-label="মেনু খুলুন"
            className="p-2 -ml-1 rounded-xl text-white hover:bg-white/15 active:scale-95 transition-all focus:outline-none"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <Logo size="sm" variant="white" />
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                আল হিদায়াহ
              </span>
              <span className="text-[10px] font-medium leading-none text-orange-100/90 tracking-wide">
                অডিও লাইব্রেরি
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="অনুসন্ধান"
            className="p-2 rounded-xl text-white hover:bg-white/15 active:scale-95 transition-all"
            title="খুঁজুন"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Downloads Counter Icon */}
          <button
            onClick={onOpenDownloadsTab}
            aria-label="ডাউনলোড তালিকা"
            className="relative p-2 rounded-xl text-white hover:bg-white/15 active:scale-95 transition-all"
            title="ডাউনলোডকৃত অডিও"
          >
            <Download className="w-5 h-5 stroke-[2.2]" />
            {downloads.length > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 bg-white text-orange-600 text-[10px] font-bold rounded-full shadow-sm leading-none">
                {toBengaliNumber(downloads.length)}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
