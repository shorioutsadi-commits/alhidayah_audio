import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AudioItem, DownloadedAudio, PlayMode, PlayerSettings, Speaker, Category } from '../types/audio';
import { StorageService } from '../services/storageService';
import { CatalogService, AudioCatalog } from '../services/catalogService';
import { Network } from '@capacitor/network';
import { App as CapApp } from '@capacitor/app';
import { ToastMessage, Toast } from '../components/common/Toast';

interface AudioPlayerContextType {
  // Catalog Data
  catalog: AudioCatalog;
  audios: AudioItem[];
  speakers: Speaker[];
  categories: Category[];
  isCatalogLoading: boolean;
  catalogLastUpdated: string | null;
  refreshCatalog: (showToastNotification?: boolean) => Promise<void>;

  // Playback state
  currentAudio: AudioItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  playMode: PlayMode;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  isFullPlayerOpen: boolean;
  favorites: string[];
  downloads: DownloadedAudio[];
  downloadProgress: { [id: string]: number };
  queue: AudioItem[];
  settings: PlayerSettings;
  isOnline: boolean;
  toast: ToastMessage | null;
  
  // Actions
  playAudio: (audio: AudioItem, newQueue?: AudioItem[]) => Promise<void>;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  skipSeconds: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaybackRate: (rate: number) => void;
  setPlayMode: (mode: PlayMode) => void;
  setSleepTimer: (minutes: number | null) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  downloadAudio: (audio: AudioItem) => Promise<void>;
  deleteDownload: (id: string) => Promise<void>;
  clearAllDownloads: () => Promise<void>;
  isDownloaded: (id: string) => boolean;
  setIsFullPlayerOpen: (open: boolean) => void;
  updateSettings: (newSettings: Partial<PlayerSettings>) => void;
  showToast: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize dynamic catalog synchronously from cached local storage / fallback
  const [catalog, setCatalog] = useState<AudioCatalog>(() => CatalogService.getCachedCatalog());
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(false);

  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [playMode, setPlayMode] = useState<PlayMode>('normal');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadedAudio[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{ [id: string]: number }>({});
  const [queue, setQueue] = useState<AudioItem[]>(() => CatalogService.getCachedCatalog().audios);
  const [settings, setSettings] = useState<PlayerSettings>(() => StorageService.getSettings());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: String(Date.now()), type, text });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3800);
  }, []);

  // Centralized catalog refresh method
  const refreshCatalog = useCallback(async (showToastNotification: boolean = false) => {
    setIsCatalogLoading(true);
    if (showToastNotification) {
      showToast('অডিও তালিকা আপডেট পরীক্ষা করা হচ্ছে...', 'info');
    }

    try {
      const result = await CatalogService.fetchRemoteCatalog();
      setCatalog(result.catalog);
      
      // Update queue with latest audios while preserving current track
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return result.catalog.audios;
        return result.catalog.audios;
      });

      if (showToastNotification) {
        if (result.isNew) {
          showToast(`নতুন অডিও যুক্ত হয়েছে! মোট ${result.catalog.totalAudios}টি অডিও সংগৃহীত`, 'success');
        } else if (result.fromRemote) {
          showToast('অডিও ক্যাটালগ ইতিমধ্যে সর্বশেষ ভার্সনে রয়েছে', 'info');
        } else {
          showToast('ইন্টারনেট সংযোগ না থাকায় সংরক্ষিত ক্যাটালগ প্রদর্শিত হচ্ছে', 'warning');
        }
      }
    } catch (err) {
      console.warn('Error during catalog refresh:', err);
      if (showToastNotification) {
        showToast('ক্যাটালগ আপডেট করা যায়নি — ইন্টারনেট পরীক্ষা করুন', 'error');
      }
    } finally {
      setIsCatalogLoading(false);
    }
  }, [showToast]);

  // Initial remote fetch on app mount + refresh on resume & network online
  useEffect(() => {
    // 1. Fetch latest catalog silently on mount
    refreshCatalog(false);

    // 2. Refresh catalog when app resumes from background on native device
    let resumeHandlePromise: Promise<any> | null = null;
    try {
      resumeHandlePromise = CapApp.addListener('resume', () => {
        refreshCatalog(false);
      });
    } catch {
      // not native
    }

    // 3. Refresh catalog when device reconnects to internet
    const handleOnline = () => {
      refreshCatalog(false);
    };
    window.addEventListener('online', handleOnline);

    return () => {
      if (resumeHandlePromise) {
        resumeHandlePromise.then(h => h.remove()).catch(() => {});
      }
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshCatalog]);

  // Monitor network status with Capacitor Network + browser events
  useEffect(() => {
    try {
      Network.getStatus().then((status) => {
        setIsOnline(status.connected);
      }).catch(() => {
        setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
      });

      const handleStatusChange = (status: { connected: boolean }) => {
        setIsOnline(status.connected);
        if (!status.connected) {
          showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন — সংরক্ষিত অডিও শুনুন', 'warning');
        }
      };

      const pluginHandle = Network.addListener('networkStatusChange', handleStatusChange);

      const handleWindowOnline = () => {
        setIsOnline(true);
        showToast('ইন্টারনেট সংযোগ পুনঃস্থাপিত হয়েছে', 'success');
      };
      const handleWindowOffline = () => {
        setIsOnline(false);
        showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন — অফলাইন মোড চালু', 'warning');
      };

      window.addEventListener('online', handleWindowOnline);
      window.addEventListener('offline', handleWindowOffline);

      return () => {
        pluginHandle.then(h => h.remove()).catch(() => {});
        window.removeEventListener('online', handleWindowOnline);
        window.removeEventListener('offline', handleWindowOffline);
      };
    } catch {
      // Fallback
    }
  }, [showToast]);

  // Initialize storage safely
  useEffect(() => {
    try {
      setFavorites(StorageService.getFavorites());
      setDownloads(StorageService.getDownloads());
      setSettings(StorageService.getSettings());
    } catch (e) {
      console.warn('Storage initial load error:', e);
    }

    // Create audio element
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Save playback progress
      if (currentAudio) {
        StorageService.savePlaybackPosition(currentAudio.id, audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleTrackEnd();
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.warn('Audio playback error event:', e);
      if (audio.src && audio.src.includes('20261020_20261020_0602') && !audio.src.includes('%E0%A6%86%E0%A6%AC%E0%A7%81')) {
        const subfolder = '%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/';
        audio.src = audio.src.replace('20261020_20261020_0602/', `20261020_20261020_0602/${subfolder}`);
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          setIsLoading(false);
          setIsPlaying(false);
        });
        return;
      }
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sleep Timer Handler
  useEffect(() => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }

    if (sleepTimerMinutes === null) {
      setSleepTimerRemaining(null);
      return;
    }

    let remainingSeconds = sleepTimerMinutes * 60;
    setSleepTimerRemaining(remainingSeconds);
    showToast(`ঘুমের টাইমার: ${sleepTimerMinutes} মিনিট পর অডিও বন্ধ হবে`, 'info');

    sleepTimerIntervalRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setSleepTimerRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        if (sleepTimerIntervalRef.current) {
          clearInterval(sleepTimerIntervalRef.current);
          sleepTimerIntervalRef.current = null;
        }
        pause();
        setSleepTimerMinutes(null);
        setSleepTimerRemaining(null);
        showToast('ঘুমের টাইমার সমাপ্ত — অডিও বন্ধ করা হয়েছে', 'info');
      }
    }, 1000);

    return () => {
      if (sleepTimerIntervalRef.current) {
        clearInterval(sleepTimerIntervalRef.current);
      }
    };
  }, [sleepTimerMinutes]);

  // Media Session Controls (Lock screen / Notification bar)
  useEffect(() => {
    if ('mediaSession' in navigator && currentAudio) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentAudio.title,
          artist: currentAudio.speakerName,
          album: 'আল হিদায়াহ অডিও লাইব্রেরি',
          artwork: [
            { src: currentAudio.speakerImage, sizes: '96x96', type: 'image/jpeg' },
            { src: currentAudio.speakerImage, sizes: '128x128', type: 'image/jpeg' },
            { src: currentAudio.speakerImage, sizes: '192x192', type: 'image/jpeg' },
            { src: currentAudio.speakerImage, sizes: '512x512', type: 'image/jpeg' },
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => resume());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', () => skipSeconds(-15));
        navigator.mediaSession.setActionHandler('seekforward', () => skipSeconds(30));
      } catch (e) {
        console.warn('MediaSession error', e);
      }
    }
  }, [currentAudio, isPlaying]);

  const handleTrackEnd = () => {
    if (playMode === 'repeat-one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      return;
    }

    if (settings.autoPlayNext) {
      nextTrack();
    }
  };

  const playAudio = async (audio: AudioItem, newQueue?: AudioItem[]) => {
    if (newQueue) {
      setQueue(newQueue);
    }

    setCurrentAudio(audio);
    setIsLoading(true);

    // Save to history
    StorageService.addToHistory(audio.id);

    let srcToPlay: string | null = null;
    const isLocal = StorageService.isDownloaded(audio.id);

    // Rule 1: Always prioritize offline local copy if downloaded
    if (isLocal) {
      srcToPlay = await StorageService.getOfflineAudioUrl(audio.id);
      if (srcToPlay) {
        showToast('অফলাইনে সংরক্ষিত কপি বাজানো হচ্ছে', 'info');
      }
    }

    // Rule 2 & 3: If not downloaded, check network connectivity
    if (!srcToPlay) {
      if (!isOnline) {
        setIsLoading(false);
        setIsPlaying(false);
        showToast('ইন্টারনেট সংযোগ নেই — এই অডিওটি শুনতে ইন্টারনেট অথবা ডাউনলোড প্রয়োজন', 'warning');
        return;
      }
      srcToPlay = audio.audioUrl;
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = srcToPlay;
        audioRef.current.playbackRate = playbackRate;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback error with source:', err);
        // Fallback 1: if offline blob was used and failed, try original audioUrl if online
        if (isLocal && isOnline) {
          try {
            audioRef.current.src = audio.audioUrl;
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (eOffline) {
            console.warn('Fallback online stream failed:', eOffline);
          }
        }
        // Fallback 2: if archive.org nested path is needed
        if (srcToPlay.includes('20261020_20261020_0602') && !srcToPlay.includes('%E0%A6%86%E0%A6%AC%E0%A7%81')) {
          const subfolder = '%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/';
          const nestedUrl = srcToPlay.replace('20261020_20261020_0602/', `20261020_20261020_0602/${subfolder}`);
          try {
            audioRef.current.src = nestedUrl;
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (eNested) {
            console.warn('Archive nested path stream failed:', eNested);
          }
        }
        // Fallback 3: if archive.org redirect fails, try direct edge mirror
        if (srcToPlay.includes('archive.org/download/')) {
          const directMirror = srcToPlay.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/');
          try {
            audioRef.current.src = directMirror;
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (eMirror) {
            console.warn('Archive mirror failed:', eMirror);
          }
        }
        setIsPlaying(false);
        showToast('অডিও প্লেব্যাকের সময় ত্রুটি হয়েছে', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePlay = () => {
    if (!currentAudio) {
      if (queue.length > 0) {
        playAudio(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resume = () => {
    if (audioRef.current && currentAudio) {
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src === window.location.href) {
        playAudio(currentAudio);
        return;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Resume error, refreshing source:', err);
        playAudio(currentAudio);
      });
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      const targetTime = Math.max(0, Math.min(audioRef.current.duration || duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const nextTrack = () => {
    if (!currentAudio) return;
    const currentIndex = queue.findIndex(item => item.id === currentAudio.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      playAudio(queue[currentIndex + 1]);
    } else if (playMode === 'repeat-all' && queue.length > 0) {
      playAudio(queue[0]);
    } else {
      pause();
    }
  };

  const prevTrack = () => {
    if (!currentAudio) return;
    const currentIndex = queue.findIndex(item => item.id === currentAudio.id);
    if (currentIndex > 0) {
      playAudio(queue[currentIndex - 1]);
    } else {
      seek(0);
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleFavorite = (id: string) => {
    const isFav = favorites.includes(id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter(favId => favId !== id);
      showToast('পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে', 'info');
    } else {
      updated = [...favorites, id];
      showToast('পছন্দের তালিকায় যুক্ত হয়েছে', 'success');
    }
    setFavorites(updated);
    StorageService.saveFavorites(updated);
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const downloadAudio = async (audio: AudioItem) => {
    if (StorageService.isDownloaded(audio.id)) {
      showToast('এই অডিওটি ইতিমধ্যেই ডাউনলোড করা আছে', 'info');
      return;
    }

    if (!isOnline) {
      showToast('ডাউনলোড করতে ইন্টারনেট সংযোগ প্রয়োজন', 'warning');
      return;
    }

    setDownloadProgress(prev => ({ ...prev, [audio.id]: 15 }));
    showToast(`'${audio.title}' ডাউনলোড শুরু হচ্ছে...`, 'info');

    try {
      let progress = 15;
      const progressTimer = setInterval(() => {
        progress += 15;
        if (progress <= 85) {
          setDownloadProgress(prev => ({ ...prev, [audio.id]: progress }));
        }
      }, 400);

      // Fetch actual audio binary data
      let blob: Blob | undefined;
      const downloadUrls: string[] = [audio.audioUrl];
      if (audio.audioUrl.includes('20261020_20261020_0602') && !audio.audioUrl.includes('%E0%A6%86%E0%A6%AC%E0%A7%81')) {
        const subfolder = '%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/';
        downloadUrls.push(audio.audioUrl.replace('20261020_20261020_0602/', `20261020_20261020_0602/${subfolder}`));
      }
      if (audio.audioUrl.includes('archive.org/download/')) {
        downloadUrls.push(audio.audioUrl.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/'));
      }

      for (const dUrl of downloadUrls) {
        try {
          const response = await fetch(dUrl, { mode: 'cors' });
          if (response.ok) {
            const fetchedBlob = await response.blob();
            if (fetchedBlob.size > 1024) {
              blob = fetchedBlob;
              break;
            }
          }
        } catch (e) {
          console.warn('Fetch error during download for url:', dUrl, e);
        }
      }

      clearInterval(progressTimer);
      setDownloadProgress(prev => ({ ...prev, [audio.id]: 95 }));

      // Save to persistent storage (Android filesystem + IndexedDB + Cache)
      await StorageService.saveDownload(audio, blob);
      setDownloads(StorageService.getDownloads());

      setDownloadProgress(prev => ({ ...prev, [audio.id]: 100 }));
      showToast(`'${audio.title}' অফলাইনে সংরক্ষিত হয়েছে`, 'success');

      setTimeout(() => {
        setDownloadProgress(prev => {
          const copy = { ...prev };
          delete copy[audio.id];
          return copy;
        });
      }, 1000);
    } catch (err) {
      console.error('Download failure:', err);
      showToast('ডাউনলোড ব্যর্থ হয়েছে — ইন্টারনেট পরীক্ষা করুন', 'error');
      setDownloadProgress(prev => {
        const copy = { ...prev };
        delete copy[audio.id];
        return copy;
      });
    }
  };

  const deleteDownload = async (id: string) => {
    try {
      await StorageService.removeDownload(id);
      setDownloads(StorageService.getDownloads());
      showToast('অফলাইন ডাউনলোড মুছে ফেলা হয়েছে', 'info');
    } catch (e) {
      console.error('Failed to delete download:', e);
    }
  };

  const clearAllDownloads = async () => {
    try {
      await StorageService.clearAllDownloads();
      setDownloads([]);
      showToast('সকল ডাউনলোড মুছে ফেলা হয়েছে', 'info');
    } catch (e) {
      console.error('Failed to clear downloads:', e);
    }
  };

  const isDownloaded = (id: string) => {
    return StorageService.isDownloaded(id);
  };

  const updateSettings = (newSettings: Partial<PlayerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    showToast('সেটিংস সংরক্ষিত হয়েছে', 'success');
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        // Dynamic Catalog
        catalog,
        audios: catalog.audios,
        speakers: catalog.speakers,
        categories: catalog.categories,
        isCatalogLoading,
        catalogLastUpdated: catalog.lastUpdated,
        refreshCatalog,

        // Playback state
        currentAudio,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        playbackRate,
        playMode,
        sleepTimerMinutes,
        sleepTimerRemaining,
        isFullPlayerOpen,
        favorites,
        downloads,
        downloadProgress,
        queue,
        settings,
        isOnline,
        toast,
        playAudio,
        togglePlay,
        pause,
        resume,
        seek,
        skipSeconds,
        nextTrack,
        prevTrack,
        setPlaybackRate,
        setPlayMode,
        setSleepTimer: setSleepTimerMinutes,
        toggleFavorite,
        isFavorite,
        downloadAudio,
        deleteDownload,
        clearAllDownloads,
        isDownloaded,
        setIsFullPlayerOpen,
        updateSettings,
        showToast,
      }}
    >
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
