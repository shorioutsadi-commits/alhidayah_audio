import { AudioItem, Speaker, Category } from '../types/audio';
import { AUDIOS_DATA, SPEAKERS_DATA, CATEGORIES_DATA } from '../data/mockAudioData';

export interface AudioCatalog {
  version: string;
  lastUpdated: string;
  totalAudios: number;
  categories: Category[];
  speakers: Speaker[];
  audios: AudioItem[];
}

export interface CatalogMeta {
  fetchedAt: number;
  version: string;
  lastUpdated: string;
}

export const REMOTE_CATALOG_URL = 'https://shorioutsadi-commits.github.io/alhidayah_audio/audio-catalog.json';
export const LOCAL_BUNDLED_CATALOG_URL = './audio-catalog.json';

const CATALOG_CACHE_KEY = 'al_hidayah_catalog_cache_v1';
const CATALOG_META_KEY = 'al_hidayah_catalog_meta_v1';

// Initial bundled fallback catalog ensuring 100% offline reliability
export const INITIAL_FALLBACK_CATALOG: AudioCatalog = {
  version: '1.1.0',
  lastUpdated: '2026-10-20T08:00:00.000Z',
  totalAudios: AUDIOS_DATA.length,
  categories: CATEGORIES_DATA,
  speakers: SPEAKERS_DATA,
  audios: AUDIOS_DATA,
};

// URL Sanitizer and normalizer ensuring direct valid streaming from Internet Archive & other hosts
export function normalizeAudioUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  let normalized = url.trim();

  // 1. If it is an Archive.org details page URL (/details/), convert to direct download URL (/download/)
  if (normalized.includes('archive.org/details/')) {
    normalized = normalized.replace('archive.org/details/', 'archive.org/download/');
  }

  // 2. Internet Archive subfolder repair for item 20261020_20261020_0602
  // Files in this archive item are stored inside the scholar subdirectory
  if (
    normalized.includes('20261020_20261020_0602') &&
    !normalized.includes('%E0%A6%86%E0%A6%AC%E0%A7%81') &&
    !normalized.includes('আবু')
  ) {
    const subfolder = '%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/';
    normalized = normalized.replace('20261020_20261020_0602/', `20261020_20261020_0602/${subfolder}`);
  }

  // 3. Fix '+' to '%20' for spaces in URL path (Archive.org 404s when paths have '+' instead of '%20')
  if (normalized.includes('+')) {
    const [pathPart, ...queryParts] = normalized.split('?');
    const queryPart = queryParts.join('?');
    const fixedPath = pathPart.replace(/\+/g, '%20');
    normalized = queryPart ? `${fixedPath}?${queryPart}` : fixedPath;
  }

  // 4. Ensure URI path encoding is compliant
  try {
    const parsed = new URL(normalized);
    normalized = encodeURI(decodeURI(parsed.href));
  } catch {
    // Keep normalized as-is if URL object parse fails
  }

  return normalized;
}

// Sanitize, harmonize and auto-update speaker & category counts
export function normalizeCatalog(raw: any): AudioCatalog {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid catalog object');
  }

  const rawAudios: AudioItem[] = Array.isArray(raw.audios) ? raw.audios : [];
  if (rawAudios.length === 0) {
    throw new Error('Catalog audios array is empty');
  }

  // Filter valid audios with minimal required fields and normalize audio URLs
  const audios: AudioItem[] = rawAudios
    .filter(
      (item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.audioUrl === 'string'
    )
    .map((item) => ({
      ...item,
      audioUrl: normalizeAudioUrl(item.audioUrl),
    }));

  const rawCategories: Category[] = Array.isArray(raw.categories) ? raw.categories : CATEGORIES_DATA;
  const rawSpeakers: Speaker[] = Array.isArray(raw.speakers) ? raw.speakers : SPEAKERS_DATA;

  // Clone speakers and dynamically update totalAudios based on actual items in catalog
  const speakers: Speaker[] = rawSpeakers.map((spk) => {
    const count = audios.filter(
      (a) => a.speakerId === spk.id || a.speakerName.trim() === spk.name.trim()
    ).length;
    return {
      ...spk,
      totalAudios: count > 0 ? count : (spk.totalAudios || 0),
    };
  });

  // Ensure any speaker appearing in an audio but not in speakers list is added
  for (const a of audios) {
    if (a.speakerName && !speakers.some((s) => s.id === a.speakerId || s.name.trim() === a.speakerName.trim())) {
      speakers.push({
        id: a.speakerId || `spk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: a.speakerName,
        title: 'ইসলামিক আলোচক',
        image: a.speakerImage || './speakers/speaker_1_abu_bakar_zakaria.jpg',
        bio: `${a.speakerName} এর গুরুত্বপূর্ণ ইসলামিক আলোচনা ও বয়ান।`,
        totalAudios: audios.filter((item) => item.speakerName === a.speakerName).length,
        category: a.category || 'সাধারণ আলোচনা',
      });
    }
  }

  // Clone categories and dynamically update audioCount
  const categories: Category[] = rawCategories.map((cat) => {
    const count = audios.filter((a) => a.category.trim() === cat.name.trim()).length;
    return {
      ...cat,
      audioCount: count > 0 ? count : (cat.audioCount || 0),
    };
  });

  // Ensure any category appearing in an audio is listed
  for (const a of audios) {
    if (a.category && !categories.some((c) => c.name.trim() === a.category.trim())) {
      categories.push({
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: a.category,
        iconName: 'Bookmark',
        description: `${a.category} সম্পর্কিত সকল অডিও আলোচনা`,
        audioCount: audios.filter((item) => item.category === a.category).length,
        color: 'from-amber-500 to-orange-600',
      });
    }
  }

  return {
    version: typeof raw.version === 'string' ? raw.version : '1.0.0',
    lastUpdated: typeof raw.lastUpdated === 'string' ? raw.lastUpdated : new Date().toISOString(),
    totalAudios: audios.length,
    categories,
    speakers,
    audios,
  };
}

export const CatalogService = {
  /**
   * Load the best available catalog synchronously from cache or fallback.
   * Ensures instant rendering on app open without blank screens or waiting.
   */
  getCachedCatalog(): AudioCatalog {
    try {
      const cached = localStorage.getItem(CATALOG_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return normalizeCatalog(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse cached catalog, using fallback:', e);
    }
    return normalizeCatalog(INITIAL_FALLBACK_CATALOG);
  },

  /**
   * Get metadata regarding last fetch time and version.
   */
  getCatalogMeta(): CatalogMeta | null {
    try {
      const meta = localStorage.getItem(CATALOG_META_KEY);
      if (meta) return JSON.parse(meta);
    } catch {
      // ignore
    }
    return null;
  },

  /**
   * Fetch the latest catalog from remote HTTPS endpoint (GitHub Pages).
   * Falls back to bundled local copy or cached copy if remote network fails.
   */
  async fetchRemoteCatalog(): Promise<{ catalog: AudioCatalog; isNew: boolean; fromRemote: boolean }> {
    const currentCached = this.getCachedCatalog();
    let fetchedRaw: any = null;
    let fromRemote = false;

    // 1. Attempt remote fetch from absolute GitHub Pages URL
    try {
      const cacheBuster = `?t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

      const response = await fetch(`${REMOTE_CATALOG_URL}${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        fetchedRaw = await response.json();
        fromRemote = true;
      } else {
        console.warn(`Remote catalog returned HTTP ${response.status}`);
      }
    } catch (remoteErr) {
      console.warn('Remote catalog fetch failed (network or offline), trying local bundled fallback:', remoteErr);
    }

    // 2. If remote fetch failed, try bundled local copy (helpful for offline fresh install)
    if (!fetchedRaw) {
      try {
        const localResponse = await fetch(LOCAL_BUNDLED_CATALOG_URL, {
          cache: 'no-cache',
        });
        if (localResponse.ok) {
          fetchedRaw = await localResponse.json();
        }
      } catch (localErr) {
        console.warn('Bundled catalog fetch failed:', localErr);
      }
    }

    // 3. If no fetch succeeded, keep current cached/bundled catalog
    if (!fetchedRaw) {
      return {
        catalog: currentCached,
        isNew: false,
        fromRemote: false,
      };
    }

    // 4. Validate and normalize the fetched catalog
    try {
      const normalized = normalizeCatalog(fetchedRaw);

      // Check if catalog has new audios or updated timestamp
      const isNew =
        normalized.totalAudios !== currentCached.totalAudios ||
        normalized.lastUpdated !== currentCached.lastUpdated ||
        normalized.version !== currentCached.version;

      // Save valid catalog into persistent localStorage
      try {
        localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(normalized));
        localStorage.setItem(
          CATALOG_META_KEY,
          JSON.stringify({
            fetchedAt: Date.now(),
            version: normalized.version,
            lastUpdated: normalized.lastUpdated,
          })
        );
      } catch (storageErr) {
        console.warn('Failed to cache catalog to localStorage:', storageErr);
      }

      return {
        catalog: normalized,
        isNew,
        fromRemote,
      };
    } catch (normErr) {
      console.error('Invalid catalog format received:', normErr);
      return {
        catalog: currentCached,
        isNew: false,
        fromRemote: false,
      };
    }
  },
};
