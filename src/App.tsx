import React, { useState, useEffect, useRef } from 'react';
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
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

interface NavHistoryEntry {
  tab: TabType;
  speaker: Speaker | null;
  categoryId: string | null;
}

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

  const { 
    settings, 
    currentAudio, 
    isOnline, 
    isFullPlayerOpen, 
    setIsFullPlayerOpen, 
    showToast 
  } = useAudioPlayer();

  // Navigation history stack to track backward transitions
  const navHistoryRef = useRef<NavHistoryEntry[]>([
    { tab: 'home', speaker: null, categoryId: null }
  ]);

  // Debouncing refs to prevent double-firing from both Capacitor backButton and browser popstate
  const lastBackActionTimeRef = useRef<number>(0);
  const lastExitPromptTimeRef = useRef<number>(0);

  // Status bar styling & safe area measurement on Android Native
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.getInfo()
        .then((info) => {
          if (info && info.height) {
            document.documentElement.style.setProperty('--safe-area-top', `${info.height}px`);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Back button state reference to avoid stale closures
  const stateRef = useRef({
    isFullPlayerOpen,
    isDrawerOpen,
    isSearchOpen,
    isSettingsOpen,
    isAboutOpen,
    isInstallOpen,
    isSleepTimerOpen,
    selectedSpeaker,
    selectedCategoryId,
    activeTab,
  });

  useEffect(() => {
    stateRef.current = {
      isFullPlayerOpen,
      isDrawerOpen,
      isSearchOpen,
      isSettingsOpen,
      isAboutOpen,
      isInstallOpen,
      isSleepTimerOpen,
      selectedSpeaker,
      selectedCategoryId,
      activeTab,
    };
  });

  // Comprehensive, debounced Android Hardware / Gesture Back Button handling
  useEffect(() => {
    const handleBackButton = () => {
      const now = Date.now();
      // Debounce rapid duplicate events (within 300ms)
      if (now - lastBackActionTimeRef.current < 300) {
        return;
      }
      lastBackActionTimeRef.current = now;

      const s = stateRef.current;

      // 1. If full screen player is open, close it first
      if (s.isFullPlayerOpen) {
        setIsFullPlayerOpen(false);
        return;
      }

      // 2. If navigation drawer is open, close it
      if (s.isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }

      // 3. If any modal dialog is open, close it
      if (s.isSearchOpen) {
        setIsSearchOpen(false);
        return;
      }
      if (s.isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (s.isAboutOpen) {
        setIsAboutOpen(false);
        return;
      }
      if (s.isInstallOpen) {
        setIsInstallOpen(false);
        return;
      }
      if (s.isSleepTimerOpen) {
        setIsSleepTimerOpen(false);
        return;
      }

      // 4. Submenu: If viewing a speaker's audio list, return to previous view
      if (s.selectedSpeaker !== null) {
        setSelectedSpeaker(null);
        if (navHistoryRef.current.length > 1) {
          navHistoryRef.current.pop();
          const prev = navHistoryRef.current[navHistoryRef.current.length - 1];
          setActiveTab(prev.tab);
        }
        return;
      }

      // 5. Submenu: If viewing a category's audio list, return to previous view
      if (s.selectedCategoryId !== null) {
        setSelectedCategoryId(null);
        if (navHistoryRef.current.length > 1) {
          navHistoryRef.current.pop();
          const prev = navHistoryRef.current[navHistoryRef.current.length - 1];
          setActiveTab(prev.tab);
        }
        return;
      }

      // 6. Navigation Stack: Return to previous tab if history exists
      if (navHistoryRef.current.length > 1) {
        navHistoryRef.current.pop();
        const prev = navHistoryRef.current[navHistoryRef.current.length - 1];
        setActiveTab(prev.tab);
        setSelectedSpeaker(prev.speaker);
        setSelectedCategoryId(prev.categoryId);
        return;
      }

      // 7. If on a secondary tab other than home, return to home
      if (s.activeTab !== 'home') {
        setActiveTab('home');
        navHistoryRef.current = [{ tab: 'home', speaker: null, categoryId: null }];
        return;
      }

      // 8. On home screen with no overlays: Double-tap to exit application
      if (now - lastExitPromptTimeRef.current < 2000) {
        CapApp.exitApp();
      } else {
        lastExitPromptTimeRef.current = now;
        showToast('অ্যাপ থেকে বের হতে পুনরায় ব্যাক বাটন চাপুন', 'info');
      }
    };

    const listenerPromise = CapApp.addListener('backButton', handleBackButton);

    // Also handle document backbutton event (standard Cordova/Capacitor DOM event)
    const handleDocumentBack = (e: Event) => {
      e.preventDefault();
      handleBackButton();
    };
    document.addEventListener('backbutton', handleDocumentBack);

    // Also support browser back navigation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleBackButton();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      listenerPromise.then(handle => handle.remove()).catch(() => {});
      document.removeEventListener('backbutton', handleDocumentBack);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setIsFullPlayerOpen, showToast]);

  const handleSpeakerSelect = (speaker: Speaker | null) => {
    setSelectedSpeaker(speaker);
    if (speaker) {
      navHistoryRef.current.push({
        tab: 'speakers',
        speaker,
        categoryId: null,
      });
      setActiveTab('speakers');
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      navHistoryRef.current.push({
        tab: 'categories',
        speaker: null,
        categoryId,
      });
      setActiveTab('categories');
    }
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab !== activeTab) {
      navHistoryRef.current.push({
        tab: newTab,
        speaker: null,
        categoryId: null,
      });
      setActiveTab(newTab);
      setSelectedSpeaker(null);
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInstallModal={() => setIsInstallOpen(true)}
        onOpenDownloadsTab={() => handleTabChange('downloads')}
      />

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-xs z-20">
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
      <main className="flex-1 w-full max-w-md mx-auto pb-32">
        {activeTab === 'home' && (
          <HomeScreen
            onSelectSpeaker={handleSpeakerSelect}
            onSelectCategory={handleCategorySelect}
            onNavigateTab={handleTabChange}
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
          <DownloadsScreen onNavigateTab={handleTabChange} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen onNavigateTab={handleTabChange} />
        )}
      </main>

      {/* Fixed Mini Player Bar */}
      <MiniPlayer />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Full-Screen Music Player Modal */}
      <FullPlayerModal />

      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectTab={handleTabChange}
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
