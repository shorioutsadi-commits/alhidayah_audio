import { DownloadedAudio, AudioItem, PlayerSettings } from '../types/audio';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const FAVORITES_KEY = 'al_hidayah_favorites';
const HISTORY_KEY = 'al_hidayah_history';
const SETTINGS_KEY = 'al_hidayah_settings';
const DOWNLOADS_KEY = 'al_hidayah_downloads_meta';
const DB_NAME = 'AlHidayahAudioDB';
const DB_STORE = 'audio_blobs';
const CACHE_NAME = 'alhidayah-audio-cache-v1';

// In-memory fallback if localStorage is disabled/restricted
let inMemoryDownloads: DownloadedAudio[] | null = null;
let inMemoryFavorites: string[] | null = null;
let inMemorySettings: PlayerSettings | null = null;

// IndexedDB Helper for browser offline blobs
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Convert Blob to Base64 helper for native filesystem write
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 part
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const StorageService = {
  // Favorites
  getFavorites(): string[] {
    if (inMemoryFavorites !== null) return inMemoryFavorites;
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      if (!data) return ['aud-abz-1', 'aud-mrm-1'];
      const parsed = JSON.parse(data);
      const list = Array.isArray(parsed) ? parsed : ['aud-abz-1', 'aud-mrm-1'];
      inMemoryFavorites = list;
      return list;
    } catch {
      return inMemoryFavorites || ['aud-abz-1', 'aud-mrm-1'];
    }
  },

  toggleFavorite(id: string): string[] {
    const favorites = this.getFavorites();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    inMemoryFavorites = updated;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
    return updated;
  },

  saveFavorites(favorites: string[]): void {
    inMemoryFavorites = favorites;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  savePlaybackPosition(audioId: string, position: number): void {
    try {
      localStorage.setItem(`playback_pos_${audioId}`, String(position));
    } catch {
      // ignore
    }
  },

  getPlaybackPosition(audioId: string): number {
    try {
      const val = localStorage.getItem(`playback_pos_${audioId}`);
      return val ? parseFloat(val) : 0;
    } catch {
      return 0;
    }
  },

  // Downloads Metadata
  getDownloads(): DownloadedAudio[] {
    if (inMemoryDownloads !== null) return inMemoryDownloads;
    try {
      const data = localStorage.getItem(DOWNLOADS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      const list = Array.isArray(parsed) ? parsed : [];
      inMemoryDownloads = list;
      return list;
    } catch {
      return inMemoryDownloads || [];
    }
  },

  async saveDownload(audio: AudioItem, blob?: Blob, nativePath?: string): Promise<DownloadedAudio> {
    const downloads = this.getDownloads();
    let blobUrl: string | undefined = undefined;
    const isNative = Capacitor.isNativePlatform();

    // 1. Android Native Storage (Capacitor Filesystem)
    if (isNative && blob) {
      try {
        const fileName = `audio_${audio.id}.mp3`;
        const base64Data = await blobToBase64(blob);
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });
        const uriResult = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        nativePath = fileName;
        blobUrl = Capacitor.convertFileSrc(uriResult.uri);
      } catch (nativeErr) {
        console.warn('Native filesystem write failed, falling back to blob/IndexedDB', nativeErr);
      }
    }

    // 2. Web Browser Storage (IndexedDB + Cache API)
    if (blob && !blobUrl) {
      try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(DB_STORE, 'readwrite');
          const store = tx.objectStore(DB_STORE);
          const putReq = store.put(blob, audio.id);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        });
        blobUrl = URL.createObjectURL(blob);
      } catch (err) {
        console.warn('Failed to store audio blob in IndexedDB', err);
      }

      // Also store in Cache API if supported
      try {
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(audio.audioUrl, new Response(blob));
        }
      } catch (cacheErr) {
        console.warn('Cache API storage note:', cacheErr);
      }
    }

    const downloadedItem: DownloadedAudio = {
      ...audio,
      downloadedAt: Date.now(),
      blobUrl,
      nativePath,
      storageType: isNative && nativePath ? 'native' : 'indexeddb',
      localSize: blob ? blob.size : (audio.fileSizeMb * 1024 * 1024),
    };

    const existingIndex = downloads.findIndex(d => d.id === audio.id);
    if (existingIndex >= 0) {
      downloads[existingIndex] = downloadedItem;
    } else {
      downloads.unshift(downloadedItem);
    }

    inMemoryDownloads = downloads;

    try {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads.map(d => ({
        ...d,
        blobUrl: undefined, // URLs need re-instantiation per session
      }))));
    } catch (e) {
      console.warn('Could not save downloads meta to localStorage', e);
    }

    return downloadedItem;
  },

  async getOfflineAudioUrl(audioId: string): Promise<string | null> {
    const downloads = this.getDownloads();
    const download = downloads.find(d => d.id === audioId);
    if (!download) return null;

    // 1. Android Native Check
    if (Capacitor.isNativePlatform()) {
      try {
        const fileName = download.nativePath || `audio_${audioId}.mp3`;
        const uriResult = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        if (uriResult && uriResult.uri) {
          return Capacitor.convertFileSrc(uriResult.uri);
        }
      } catch (e) {
        console.warn('Native audio file lookup failed:', e);
      }
    }

    // 2. Web IndexedDB Check
    try {
      const db = await openDB();
      const blob = await new Promise<Blob | null>((resolve) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(audioId);
        req.onsuccess = () => {
          if (req.result instanceof Blob) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });

      if (blob) {
        return URL.createObjectURL(blob);
      }
    } catch {
      // IndexedDB query failed
    }

    // 3. Cache API Check
    try {
      if ('caches' in window && download.audioUrl) {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(download.audioUrl);
        if (match) {
          const blob = await match.blob();
          return URL.createObjectURL(blob);
        }
      }
    } catch {
      // Cache query failed
    }

    return null;
  },

  async removeDownload(audioId: string): Promise<void> {
    const downloads = this.getDownloads();
    const target = downloads.find(d => d.id === audioId);
    const updated = downloads.filter(d => d.id !== audioId);
    inMemoryDownloads = updated;

    try {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated.map(d => ({ ...d, blobUrl: undefined }))));
    } catch (e) {
      console.warn('Error saving updated downloads after remove', e);
    }

    // Remove from Native Filesystem if on device
    if (Capacitor.isNativePlatform() && target) {
      try {
        const fileName = target.nativePath || `audio_${audioId}.mp3`;
        await Filesystem.deleteFile({
          path: fileName,
          directory: Directory.Data,
        });
      } catch (e) {
        console.warn('Could not delete native file', e);
      }
    }

    // Remove from IndexedDB
    try {
      const db = await openDB();
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(audioId);
    } catch (e) {
      console.warn('Error removing download from IndexedDB', e);
    }

    // Remove from Cache API
    try {
      if ('caches' in window && target?.audioUrl) {
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(target.audioUrl);
      }
    } catch {
      // Cache delete ignored
    }
  },

  async clearAllDownloads(): Promise<void> {
    const current = this.getDownloads();
    inMemoryDownloads = [];
    try {
      localStorage.removeItem(DOWNLOADS_KEY);
    } catch (e) {
      console.warn('Error clearing localStorage downloads', e);
    }

    // Clear native files
    if (Capacitor.isNativePlatform()) {
      for (const item of current) {
        try {
          const fileName = item.nativePath || `audio_${item.id}.mp3`;
          await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Data,
          });
        } catch {}
      }
    }

    // Clear IndexedDB
    try {
      const db = await openDB();
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).clear();
    } catch (e) {
      console.warn('Error clearing IndexedDB store', e);
    }

    // Clear Cache
    try {
      if ('caches' in window) {
        await caches.delete(CACHE_NAME);
      }
    } catch {}
  },

  isDownloaded(audioId: string): boolean {
    return this.getDownloads().some(d => d.id === audioId);
  },

  // Settings
  getSettings(): PlayerSettings {
    const defaultSettings: PlayerSettings = {
      audioQuality: 'high',
      autoPlayNext: true,
      driveMode: false,
      theme: 'light',
      downloadOverWifiOnly: false,
      notificationEnabled: true,
    };
    if (inMemorySettings !== null) return inMemorySettings;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (!saved) {
        inMemorySettings = defaultSettings;
        return defaultSettings;
      }
      const parsed = JSON.parse(saved);
      const settings = (typeof parsed === 'object' && parsed !== null)
        ? { ...defaultSettings, ...parsed }
        : defaultSettings;
      inMemorySettings = settings;
      return settings;
    } catch {
      inMemorySettings = defaultSettings;
      return defaultSettings;
    }
  },

  saveSettings(settings: PlayerSettings): void {
    inMemorySettings = settings;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage', e);
    }
  },

  // Recently played history
  getHistory(): string[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addToHistory(audioId: string): void {
    const history = this.getHistory().filter(id => id !== audioId);
    history.unshift(audioId);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  },
};
