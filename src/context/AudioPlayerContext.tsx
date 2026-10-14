import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AudioItem, DownloadedAudio, PlayMode, PlayerSettings } from '../types/audio';
import { StorageService } from '../services/storageService';
import { AUDIOS_DATA } from '../data/mockAudioData';

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
  
  // Actions
  playAudio: (audio: AudioItem, newQueue?: AudioItem[]) => void;
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
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadedAudio[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{ [id: string]: number }>({});
  const [queue, setQueue] = useState<AudioItem[]>(AUDIOS_DATA);
  const [settings, setSettings] = useState<PlayerSettings>(StorageService.getSettings());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const synthAudioRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);

  // Initialize storage
  useEffect(() => {
    setFavorites(StorageService.getFavorites());
    setDownloads(StorageService.getDownloads());
    setSettings(StorageService.getSettings());

    // Create audio element
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || currentAudio?.duration || 0);
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
      console.warn('Audio playback encountered error:', e);
      setIsLoading(false);
      // If error occurs with archive.org download URL, try direct CDN node mirror
      if (audio.src && audio.src.includes('archive.org/download/')) {
        const directMirror = audio.src.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/');
        console.log('Switching to archive.org CDN mirror:', directMirror);
        audio.src = directMirror;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      } else {
        setIsPlaying(false);
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
  }, []);

  // Update MediaSession on track change
  useEffect(() => {
    if (!currentAudio) return;

    if ('mediaSession' in navigator) {
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
    }
  }, [currentAudio]);

  // Handle Track Ended with respect to PlayMode
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
  }, [sleepTimerMinutes]);

  const playAudio = async (audio: AudioItem, newQueue?: AudioItem[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
    }
    setCurrentAudio(audio);
    setCurrentTime(0);
    setDuration(audio.duration);
    setIsLoading(true);

    StorageService.addToHistory(audio.id);

    // Check if offline version exists
    let srcToPlay = audio.audioUrl;
    const offlineUrl = await StorageService.getOfflineAudioUrl(audio.id);
    if (offlineUrl) {
      srcToPlay = offlineUrl;
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = srcToPlay;
        audioRef.current.load();
        audioRef.current.playbackRate = playbackRate;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback error with primary source:', err);
        // Fallback 1: if offline blob was used and failed, try original audioUrl
        if (offlineUrl && srcToPlay === offlineUrl) {
          try {
            audioRef.current.src = audio.audioUrl;
            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (eOffline) {
            console.warn('Offline fallback failed:', eOffline);
          }
        }
        // Fallback 2: if archive.org redirect fails, try direct edge mirror
        if (srcToPlay.includes('archive.org/download/')) {
          const directMirror = srcToPlay.replace('https://archive.org/download/', 'https://dn710002.ca.archive.org/0/items/');
          try {
            audioRef.current.src = directMirror;
            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          } catch (eMirror) {
            console.warn('Archive mirror failed:', eMirror);
          }
        }
        setIsPlaying(false);
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
  };

  const isFavorite = (id: string): boolean => {
    return favorites.includes(id);
  };

  const downloadAudio = async (audio: AudioItem) => {
    if (StorageService.isDownloaded(audio.id)) {
      return;
    }

    setDownloadProgress(prev => ({ ...prev, [audio.id]: 10 }));

    try {
      // Simulate stepped progress for user feedback and fetch blob
      let progress = 10;
      const interval = setInterval(() => {
        progress += 20;
        if (progress <= 90) {
          setDownloadProgress(prev => ({ ...prev, [audio.id]: progress }));
        }
      }, 300);

      // Fetch real audio data
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
        console.warn('Direct blob fetch failed (likely CORS or network), will save metadata and stream directly:', e);
      }

      clearInterval(interval);
      setDownloadProgress(prev => ({ ...prev, [audio.id]: 100 }));

      const downloaded = await StorageService.saveDownload(audio, blob);
      setDownloads(StorageService.getDownloads());

      // Device file download trigger so it saves directly into Android/PC Downloads folder
      try {
        const a = document.createElement('a');
        a.href = audio.audioUrl;
        a.download = `${audio.title.replace(/[\/\\?%*:|"<>]/g, '_')}.mp3`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.log('Direct device download trigger note:', e);
      }

      setTimeout(() => {
        setDownloadProgress(prev => {
          const updated = { ...prev };
          delete updated[audio.id];
          return updated;
        });
      }, 1000);
    } catch (err) {
      console.error('Download error', err);
      setDownloadProgress(prev => {
        const updated = { ...prev };
        delete updated[audio.id];
        return updated;
      });
    }
  };

  const deleteDownload = async (id: string) => {
    await StorageService.removeDownload(id);
    setDownloads(StorageService.getDownloads());
  };

  const clearAllDownloads = async () => {
    await StorageService.clearAllDownloads();
    setDownloads([]);
  };

  const isDownloaded = (id: string): boolean => {
    return downloads.some(d => d.id === id);
  };

  const updateSettings = (newSettings: Partial<PlayerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
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
        updateSettings
      }}
    >
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
