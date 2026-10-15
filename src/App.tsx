import React, { useState, useEffect } from 'react';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { SideDrawer } from './components/common/SideDrawer';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullPlayerModal } from './components/player/FullPlayerModal';
import { HomeScreen } from './components/home/HomeScreen';
import { SpeakersScreen } from './components/speakers/SpeakersScreen';
import { CategoriesScreen } from './components/categories/CategoriesScreen';
import { DownloadsScreen } from './components/downloads/DownloadsScreen';
import { FavoritesScreen } from './components/favorites/FavoritesScreen';
import { SearchModal } from './components/search/SearchModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AboutModal } from './components/modals/AboutModal';
import { ApkInstallModal } from './components/modals/ApkInstallModal';
import { SleepTimerModal } from './components/modals/SleepTimerModal';
import { Speaker } from './types/audio';
import { WifiOff, Car } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutInitialTab, setAboutInitialTab] = useState<'about' | 'apps'>('about');
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);

  // Deep speaker / category navigation state
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { settings, currentAudio, isOnline } = useAudioPlayer();

  const handleSpeakerSelect = (speaker: Speaker | null) => {
    setSelectedSpeaker(speaker);
    if (speaker) {
      setActiveTab('speakers');
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      setActiveTab('categories');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInstallModal={() => setIsInstallOpen(true)}
        onOpenDownloadsTab={() => setActiveTab('downloads')}
      />

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-xs sticky top-[57px] z-20">
          <WifiOff className="w-3.5 h-3.5" />
          <span>ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে — অফলাইনে সংরক্ষিত অডিওসমূহ শুনুন</span>
        </div>
      )}

      {/* Drive Mode Alert Pill */}
      {settings.driveMode && (
        <div className="bg-stone-900 text-amber-400 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
          <Car className="w-4 h-4 text-amber-400" />
          <span>ড্রাইভ মোড সক্রিয় — সহজ নিয়ন্ত্রণের জন্য অপ্টিমাইজড</span>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === 'home' && (
          <HomeScreen
            onSelectSpeaker={handleSpeakerSelect}
            onSelectCategory={handleCategorySelect}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'speakers' && (
          <SpeakersScreen
            selectedSpeaker={selectedSpeaker}
            onSelectSpeaker={setSelectedSpeaker}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesScreen
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        )}

        {activeTab === 'downloads' && (
          <DownloadsScreen onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Fixed Mini Player Bar (image_3.png style) */}
      <MiniPlayer />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // If switching to directory tab directly, reset specific selection if desired
          if (tab === 'speakers' && selectedSpeaker) {
            // Keep or reset
          }
        }}
      />

      {/* Full-Screen Music Player Modal */}
      <FullPlayerModal />

      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => {
          setAboutInitialTab('about');
          setIsAboutOpen(true);
        }}
        onOpenOtherApps={() => {
          setAboutInitialTab('apps');
          setIsAboutOpen(true);
        }}
        onOpenInstallModal={() => setIsInstallOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
      />

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        initialTab={aboutInitialTab}
      />

      <ApkInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AudioPlayerProvider>
      <MainAppContent />
    </AudioPlayerProvider>
  );
}
