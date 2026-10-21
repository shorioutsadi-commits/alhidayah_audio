export interface AudioItem {
  id: string;
  title: string;           // বাংলা শিরোনাম (যেমন: তাওবার ফযিলত ও সঠিক নিয়ম)
  speakerId: string;
  speakerName: string;     // বক্তার নাম (যেমন: ড. মিজানুর রহমান আজহারী)
  speakerImage: string;    // বক্তার ছবি বা থিম ছবি
  category: string;        // ক্যাটাগরি (যেমন: ঈমান ও আকীদা)
  description: string;     // সংক্ষিপ্ত বিবরণ
  duration: number;        // সেকেন্ডে সময় (যেমন: 720 = 12 মিনিট)
  audioUrl: string;        // স্ট্রিমিং অডিও লিংক (MP3)
  fileSizeMb: number;      // ফাইলের সাইজ (যেমন: 12.4 MB)
  playCount: number;       // শোনার সংখ্যা
  publishDate?: string;    // প্রকাশের তারিখ (বাংলায়)
  isFeatured?: boolean;    // নির্বাচিত অডিও কিনা
  seriesName?: string;     // সিরিজ/প্লেলিস্ট নাম (যদি থাকে)
}

export interface Speaker {
  id: string;
  name: string;            // নাম বাংলায়
  title: string;           // উপাধি (যেমন: ইসলামি গবেষক ও চিন্তাবিদ)
  image: string;           // ছবি
  bio: string;             // সংক্ষিপ্ত পরিচিতি
  totalAudios: number;     // মোট অডিও সংখ্যা
  category: string;
}

export interface Category {
  id: string;
  name: string;            // ক্যাটাগরির নাম বাংলায়
  iconName: string;
  description: string;
  audioCount: number;
  color: string;
}

export interface DownloadedAudio extends AudioItem {
  downloadedAt: number;    // টাইমস্ট্যাম্প
  blobUrl?: string;        // অফলাইন প্লেব্যাকের জন্য ব্লব ইউআরএল
  nativePath?: string;     // ডিভাইস ফাইলসিস্টেম পাথ (Android)
  storageType?: 'native' | 'indexeddb';
  localSize: number;       // বাইটে সাইজ
}

export type PlayMode = 'normal' | 'repeat-one' | 'repeat-all';

export interface PlayerSettings {
  audioQuality: 'low' | 'medium' | 'high';
  autoPlayNext: boolean;
  driveMode: boolean;
  theme: 'light' | 'dark' | 'system';
  downloadOverWifiOnly: boolean;
  notificationEnabled: boolean;
}

export interface PlaybackDiagnosticLog {
  timestamp: string;
  audioId: string;
  audioTitle: string;
  urlAttempted: string;
  errorCode?: number;
  errorName?: string;
  errorMessage?: string;
  networkOnline: boolean;
  isDownloaded: boolean;
  httpStatus?: number | string;
}
