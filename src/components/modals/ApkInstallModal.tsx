import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share2, 
  Layers, 
  Cpu, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { toBengaliNumber } from '../../utils/bengaliUtils';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useAudioPlayer();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        showToast('আল হিদায়াহ অ্যাপ সফলভাবে ইনস্টল করা হয়েছে!', 'success');
      }
    } else {
      setShowManualGuide(true);
      showToast('নিচের ৩টি ধাপ অনুসরণ করে অ্যাপটি হোমস্ক্রিনে যুক্ত করুন', 'info');
    }
  };

  const handleDownloadManifest = () => {
    // Generate web app manifest download package
    const manifestData = {
      name: "আল হিদায়াহ অডিও - Al Hidayah Audio",
      short_name: "আল হিদায়াহ",
      description: "একটি সমৃদ্ধ ইসলামিক অডিও লাইব্রেরি - বয়ান, কুরআন তিলাওয়াত ও তাফসীর",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ea580c",
      icons: [
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23ea580c'/><path d='M35 28 C55 28 68 40 68 52 C68 64 55 76 35 76 C42 66 45 55 45 52 C45 49 42 38 35 28 Z' fill='white'/><circle cx='62' cy='40' r='5' fill='white'/><path d='M26 65 L26 35 C26 32 29 30 32 32 L58 48 C61 50 61 54 58 56 L32 72 C29 74 26 72 26 69 Z' fill='white' opacity='0.9'/></svg>",
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'al-hidayah-audio-manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">অ্যান্ড্রয়েড অ্যাপ ও APK</h3>
              <p className="text-[11px] text-stone-500">আপনার মোবাইলে সরাসরি ইনস্টল করুন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          
          {/* App Preview Badge */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-4 text-white text-center flex flex-col items-center">
            <div className="mb-2">
              <Logo size="lg" variant="white" />
            </div>
            <h4 className="text-base font-bold">আল হিদায়াহ অডিও</h4>
            <span className="text-xs text-orange-100">সংস্করণ {toBengaliNumber('1.4.0')} • Android WebAPK</span>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] bg-black/20 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>সম্পূর্ণ নিরাপদ ও বিজ্ঞাপনমুক্ত</span>
            </div>
          </div>

          {/* Direct Install Button */}
          <div>
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isInstalled ? 'ইতোমধ্যেই ইনস্টল করা হয়েছে' : 'অ্যান্ড্রয়েড ফোনে এক ক্লিকে ইনস্টল করুন'}</span>
            </button>
          </div>

          {/* Step by step manual guide */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2.5 text-xs">
            <span className="font-bold text-stone-800 block">
              📲 মোবাইলে সরাসরি ইনস্টল করার সহজ নিয়ম:
            </span>

            <div className="space-y-2 text-stone-600 leading-snug">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  ১
                </span>
                <span>ক্রোম বা যেকোনো অ্যান্ড্রয়েড ব্রাউজারের উপরের <strong>থ্রি-ডট (⋮)</strong> মেনুতে চাপুন।</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  ২
                </span>
                <span>তালিকা থেকে <strong>&quot;Install app&quot;</strong> বা <strong>&quot;Add to Home screen&quot;</strong> সিলেক্ট করুন।</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  ৩
                </span>
                <span>আপনার ফোনের অ্যাপ মেনুতে ‘আল হিদায়াহ’ আইকন যুক্ত হয়ে যাবে এবং এটি একটি পূর্ণাঙ্গ নেটিভ অ্যাপের মতো অফলাইনেও চলবে!</span>
              </div>
            </div>
          </div>

          {/* WebAPK / PWABuilder developer note */}
          <div className="border border-stone-200 rounded-2xl p-3 text-stone-600 text-[11px] space-y-1.5">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-orange-600" />
              <span>স্বতন্ত্র APK তৈরি করতে চান?</span>
            </span>
            <p className="leading-relaxed">
              এই অ্যাপের ব্যাকগ্রাউন্ড পিডব্লিউএ ফাইল ব্যবহার করে <strong>PWABuilder.com</strong> অথবা <strong>Capacitor</strong> দিয়ে যেকোনো সময় গুগল প্লে স্টোরের জন্য সাইনড APK/AAB তৈরি করা যায়।
            </p>
            <button
              onClick={handleDownloadManifest}
              className="text-orange-600 font-bold hover:underline flex items-center gap-1 pt-1"
            >
              <Download className="w-3 h-3" />
              <span>অ্যাপ ম্যানিফেস্ট ফাইল ডাউনলোড করুন</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
