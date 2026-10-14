import { DownloadedAudio, AudioItem, PlayerSettings } from '../types/audio';

const FAVORITES_KEY = 'al_hidayah_favorites';
const HISTORY_KEY = 'al_hidayah_history';
const SETTINGS_KEY = 'al_hidayah_settings';
const DOWNLOADS_KEY = 'al_hidayah_downloads_meta';
const DB_NAME = 'AlHidayahAudioDB';
const DB_STORE = 'audio_blobs';

// IndexedDB Helper for offline blobs
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
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

export const StorageService = {
  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      if (!data) return ['aud-abz-1', 'aud-mrm-1'];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : ['aud-abz-1', 'aud-mrm-1'];
    } catch {
      return ['aud-abz-1', 'aud-mrm-1'];
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
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
    return updated;
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  // Downloads Metadata
  getDownloads(): DownloadedAudio[] {
    try {
      const data = localStorage.getItem(DOWNLOADS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async saveDownload(audio: AudioItem, blob?: Blob): Promise<DownloadedAudio> {
    const downloads = this.getDownloads();
    let blobUrl: string | undefined = undefined;

    if (blob) {
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
    }

    const downloadedItem: DownloadedAudio = {
      ...audio,
      downloadedAt: Date.now(),
      blobUrl,
      localSize: audio.fileSizeMb * 1024 * 1024
    };

    const existingIndex = downloads.findIndex(d => d.id === audio.id);
    if (existingIndex >= 0) {
      downloads[existingIndex] = downloadedItem;
    } else {
      downloads.unshift(downloadedItem);
    }

    try {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads.map(d => ({ ...d, blobUrl: undefined }))));
    } catch (e) {
      console.warn('Could not save downloads meta', e);
    }

    return downloadedItem;
  },

  async getOfflineAudioUrl(audioId: string): Promise<string | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(audioId);
        req.onsuccess = () => {
          if (req.result instanceof Blob) {
            resolve(URL.createObjectURL(req.result));
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async removeDownload(audioId: string): Promise<void> {
    const downloads = this.getDownloads().filter(d => d.id !== audioId);
    try {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
      const db = await openDB();
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(audioId);
    } catch (e) {
      console.warn('Error removing download', e);
    }
  },

  async clearAllDownloads(): Promise<void> {
    try {
      localStorage.removeItem(DOWNLOADS_KEY);
      const db = await openDB();
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).clear();
    } catch (e) {
      console.warn('Error clearing downloads', e);
    }
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
      notificationEnabled: true
    };
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (!saved) return defaultSettings;
      const parsed = JSON.parse(saved);
      return (typeof parsed === 'object' && parsed !== null)
        ? { ...defaultSettings, ...parsed }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  saveSettings(settings: PlayerSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings', e);
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
      console.warn('Could not save history', e);
    }
  }
};
