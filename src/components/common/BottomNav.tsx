import React from 'react';
import { Home, Mic2, Grid, Download, Heart } from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export type TabType = 'home' | 'speakers' | 'categories' | 'downloads' | 'favorites';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { downloads, favorites } = useAudioPlayer();

  const tabs: { id: TabType; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'মূল পাতা', icon: Home },
    { id: 'speakers', label: 'বক্তাগণ', icon: Mic2 },
    { id: 'categories', label: 'ক্যাটাগরি', icon: Grid },
    { id: 'downloads', label: 'ডাউনলোড', icon: Download, badge: downloads.length },
    { id: 'favorites', label: 'পছন্দের', icon: Heart, badge: favorites.length }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all select-none ${
                isActive ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold leading-none shadow-xs ${
                    isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-stone-300 text-stone-800'
                  }`}>
                    {toBengaliNumber(tab.badge)}
                  </span>
                )}
              </div>

              <span className={`text-[11px] mt-1 tracking-tight leading-tight transition-all ${
                isActive ? 'text-orange-600 scale-100' : 'text-stone-500'
              }`}>
                {tab.label}
              </span>

              {isActive && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-orange-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
