import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AudioItem, DownloadedAudio, PlayMode, PlayerSettings } from '../types/audio';
import { StorageService } from '../services/storageService';
import { AUDIOS_DATA } from '../data/mockAudioData';
import { Network } from '@capacitor/network';
import { ToastMessage, Toast } from '../components/common/Toast';

interface AudioPlayerContextType {
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
  const [queue, setQueue] = useState<AudioItem[]>(AUDIOS_DATA);
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

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      handleTrackEnded();
    };

    const onError = (e: Event) => {
      console.warn('Audio element error event:', e);
      setIsLoading(false);
      // If error occurs with archive.org download URL, try direct CDN node mirror
      if (audio.src && audio.src.includes('archive.org/download/')) {
        const directMirror = audio.src.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/');
        console.log('Switching to archive.org direct CDN mirror:', directMirror);
        audio.src = directMirror;
        audio.play().then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Mirror playback failed:', err);
          setIsPlaying(false);
          showToast('অডিও লোড করা যায়নি — ইন্টারনেট সংযোগ পরীক্ষা করুন', 'error');
        });
      } else {
        setIsPlaying(false);
        if (!navigator.onLine) {
          showToast('ইন্টারনেট নেই — অডিওটি শুনতে ডাউনলোড করুন', 'warning');
        } else {
          showToast('অডিও প্লেব্যাকের সময় একটি সমস্যা হয়েছে', 'error');
        }
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, [showToast]);

  // Update MediaSession on track change
  useEffect(() => {
    if (!currentAudio) return;

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentAudio.title,
          artist: currentAudio.speakerName,
          album: 'আল হিদায়াহ অডিও (Al Hidayah)',
          artwork: [
            { src: currentAudio.speakerImage, sizes: '512x512', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => resume());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', () => skipSeconds(-10));
        navigator.mediaSession.setActionHandler('seekforward', () => skipSeconds(10));
      } catch (e) {
        console.warn('MediaSession setup note:', e);
      }
    }
  }, [currentAudio]);

  const handleTrackEnded = () => {
    if (playMode === 'repeat-one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
    } else {
      nextTrack();
    }
  };

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      if (sleepTimerIntervalRef.current) {
        clearInterval(sleepTimerIntervalRef.current);
        sleepTimerIntervalRef.current = null;
      }
      setSleepTimerRemaining(null);
      return;
    }

    const totalSeconds = sleepTimerMinutes * 60;
    setSleepTimerRemaining(totalSeconds);

    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
    }

    sleepTimerIntervalRef.current = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (sleepTimerIntervalRef.current) {
            clearInterval(sleepTimerIntervalRef.current);
          }
          pause();
          setSleepTimerMinutes(null);
          showToast('স্লিপ টাইমার শেষ — অডিও বিরতি দেওয়া হয়েছে', 'info');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (sleepTimerIntervalRef.current) {
        clearInterval(sleepTimerIntervalRef.current);
      }
    };
  }, [sleepTimerMinutes, showToast]);

  const playAudio = async (audio: AudioItem, newQueue?: AudioItem[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
    }
    setCurrentAudio(audio);
    setCurrentTime(0);
    setDuration(audio.duration);
    setIsLoading(true);

    StorageService.addToHistory(audio.id);

    // Rule 1: Check if audio is downloaded locally
    const isLocal = StorageService.isDownloaded(audio.id);
    let srcToPlay: string | null = null;

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
        // Fallback 2: if archive.org redirect fails, try direct edge mirror
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
    if (currentTime > 3) {
      seek(0);
      return;
    }
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
    const updated = StorageService.toggleFavorite(id);
    setFavorites(updated);
    const isNowFav = updated.includes(id);
    showToast(isNowFav ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে', 'success');
  };

  const isFavorite = (id: string): boolean => {
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
      try {
        const response = await fetch(audio.audioUrl, { mode: 'cors' });
        if (response.ok) {
          const fetchedBlob = await response.blob();
          if (fetchedBlob.size > 1024) {
            blob = fetchedBlob;
          }
        }
      } catch (e) {
        console.warn('CORS or direct fetch error during download, trying fallback node:', e);
        if (audio.audioUrl.includes('archive.org/download/')) {
          const directMirror = audio.audioUrl.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/');
          try {
            const resp2 = await fetch(directMirror, { mode: 'cors' });
            if (resp2.ok) {
              blob = await resp2.blob();
            }
          } catch (e2) {
            console.warn('Mirror download failed:', e2);
          }
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
      showToast('সকল ডাউনলোড সফলভাবে মুছে ফেলা হয়েছে', 'info');
    } catch (e) {
      console.error('Failed to clear downloads:', e);
    }
  };

  const isDownloaded = (id: string): boolean => {
    return downloads.some(d => d.id === id);
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
