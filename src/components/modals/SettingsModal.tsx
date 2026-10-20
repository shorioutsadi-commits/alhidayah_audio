import React from 'react';
import { X, Settings, Volume2, Car, Bell, Wifi, Trash2, CheckCircle2, RefreshCw, Music } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { toBengaliNumber } from '../../utils/bengaliUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    updateSettings, 
    clearAllDownloads, 
    showToast,
    catalog,
    isCatalogLoading,
    refreshCatalog
  } = useAudioPlayer();
  const [confirmClear, setConfirmClear] = React.useState(false);

  if (!isOpen) return null;

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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">অ্যাপ সেটিংস</h3>
              <p className="text-[11px] text-stone-500">আপনার পছন্দ অনুযায়ী কাস্টমাইজ করুন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="py-4 space-y-4">
          
          {/* Audio Quality */}
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-orange-600" />
              <span>অডিও স্ট্রিমিং কোয়ালিটি</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: 'উচ্চ মান (HD)' },
                { id: 'medium', label: 'স্ট্যান্ডার্ড' },
                { id: 'low', label: 'ডাটা সেভার' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateSettings({ audioQuality: opt.id as any })}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                    settings.audioQuality === opt.id
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Play Next */}
          <div className="flex items-center justify-between py-2 border-t border-stone-100">
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                পরবর্তী অডিও স্বয়ংক্রিয় প্লে
              </span>
              <span className="text-[11px] text-stone-500">
                বর্তমান অডিও শেষ হলে পরবর্তী অডিও চালু হবে
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoPlayNext}
              onChange={(e) => updateSettings({ autoPlayNext: e.target.checked })}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          {/* Drive Mode */}
          <div className="flex items-center justify-between py-2 border-t border-stone-100">
            <div className="flex items-start gap-2">
              <Car className="w-4 h-4 text-stone-500 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  গাড়িতে ড্রাইভ মোড
                </span>
                <span className="text-[11px] text-stone-500">
                  সহজে ব্যবহারের জন্য বড় বাটন ও মিনিমাল ইন্টারফেস
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.driveMode}
              onChange={(e) => updateSettings({ driveMode: e.target.checked })}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          {/* Lock screen notification */}
          <div className="flex items-center justify-between py-2 border-t border-stone-100">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-stone-500 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  লক স্ক্রিন প্লেয়ার কন্ট্রোল
                </span>
                <span className="text-[11px] text-stone-500">
                  মোবাইল লক থাকা অবস্থায় বা নোটিফিকেশনে প্লেয়ার বাটন
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationEnabled}
              onChange={(e) => updateSettings({ notificationEnabled: e.target.checked })}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          {/* Data Saver for Downloads */}
          <div className="flex items-center justify-between py-2 border-t border-stone-100">
            <div className="flex items-start gap-2">
              <Wifi className="w-4 h-4 text-stone-500 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  শুধুমাত্র ওয়াইফাই-এ ডাউনলোড
                </span>
                <span className="text-[11px] text-stone-500">
                  মোবাইল ডাটা খরচ কমাতে সহায়তা করে
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.downloadOverWifiOnly}
              onChange={(e) => updateSettings({ downloadOverWifiOnly: e.target.checked })}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          {/* Audio Library Sync / Refresh */}
          <div className="pt-3 border-t border-stone-100">
            <div className="bg-orange-50/70 border border-orange-150 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">অডিও লাইব্রেরি ক্যাটালগ</h4>
                    <p className="text-[10px] text-stone-500">
                      মোট {toBengaliNumber(catalog.totalAudios)}টি অডিও • সংস্করণ {toBengaliNumber(catalog.version)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                নতুন ওয়াজ বা তিলাওয়াত যোগ হলে অ্যাপ স্বয়ংক্রিয়ভাবে আপডেট নেয়। আপনি চাইলে এখনি রিমোট সার্ভার থেকে নতুন অডিও চেক করতে পারেন।
              </p>

              <button
                onClick={() => refreshCatalog(true)}
                disabled={isCatalogLoading}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCatalogLoading ? 'animate-spin' : ''}`} />
                <span>{isCatalogLoading ? 'আপডেট খোঁজা হচ্ছে...' : 'নতুন অডিওর আপডেট পরীক্ষা করুন'}</span>
              </button>
            </div>
          </div>

          {/* Clear Storage */}
          <div className="pt-2 border-t border-stone-100">
            {confirmClear ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center space-y-2">
                <p className="text-[11px] font-semibold text-rose-800">
                  আপনি কি সমস্ত অফলাইন ডাটা মুছে ফেলতে চান?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={() => {
                      clearAllDownloads();
                      setConfirmClear(false);
                      showToast('ডাটা পরিষ্কার করা হয়েছে', 'success');
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                  >
                    হ্যাঁ, মুছুন
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>ক্যাশ ও অফলাইন মেমোরি পরিষ্কার করুন</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            সম্পন্ন
          </button>
        </div>

      </div>
    </div>
  );
};
