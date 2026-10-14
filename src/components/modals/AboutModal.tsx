import React from 'react';
import { X, Info, Heart, ShieldCheck, ExternalLink, BookOpen, Layers, Compass, Star } from 'lucide-react';
import { Logo } from '../common/Logo';
import { OTHER_APPS_DATA } from '../../data/mockAudioData';
import { toBengaliNumber } from '../../utils/bengaliUtils';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'apps';
}

export const AboutModal: React.FC<AboutModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'about'
}) => {
  const [activeTab, setActiveTab] = React.useState<'about' | 'apps'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              আমাদের সম্পর্কে
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'apps'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              অন্যান্য অ্যাপ
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          {activeTab === 'about' ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center my-2">
                <Logo size="lg" variant="orange" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  আল হিদায়াহ অডিও
                </h3>
                <p className="text-xs text-orange-600 font-semibold mt-0.5">
                  একটি সমৃদ্ধ ইসলামিক অডিও লাইব্রেরি
                </p>
                <span className="inline-block mt-1 text-[11px] text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full font-mono">
                  সংস্করণ {toBengaliNumber('1.4.0')}
                </span>
              </div>

              <div className="text-left bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs text-stone-700 space-y-2.5 leading-relaxed">
                <p>
                  <strong>‘আল হিদায়াহ অডিও’</strong> অ্যাপটি মুসলিম সেন্ট্রাল প্ল্যাটফর্মের অনুপ্রেরণায় বাংলাভাষী মুসলিমদের জন্য তৈরি একটি পূর্ণাঙ্গ অডিও লাইব্রেরি।
                </p>
                <p>
                  এখানে সহীহ আকিদা, সীরাতুন্নবী (সা:), পরিবার ও সমাজ সংস্কার, তাওবা এবং প্রখ্যাত ক্বারীগণের মিষ্টি কণ্ঠের কুরআন তিলাওয়াত সহজ ও সুন্দরভাবে শোনার সুবিধা দেওয়া হয়েছে।
                </p>
                <p className="text-stone-500 text-[11px]">
                  ইন্টারনেট ছাড়াও যেকোনো সময়ে শোনার জন্য এতে রয়েছে স্মার্ট অফলাইন ডাউনলোড সুবিধা।
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3.5 text-xs text-orange-950 flex items-center gap-3 text-left">
                <div className="p-2 bg-orange-500 text-white rounded-xl shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-bold block text-stone-900">সদকায়ে জারিয়া</span>
                  <span className="text-[11px] text-stone-600">
                    দাওয়াহ প্রচার ও মানবকল্যাণের উদ্দেশ্যে নিবেদিত। আপনাদের দোয়ায় আমাদের স্মরণ রাখবেন।
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center mb-2">
                <h3 className="text-sm font-bold text-stone-900">
                  আমাদের অন্যান্য ইসলামিক অ্যাপসমূহ
                </h3>
                <p className="text-[11px] text-stone-500">
                  আপনার দৈনন্দিন ইসলামিক জীবনের জন্য প্রয়োজনীয় মোবাইল অ্যাপ
                </p>
              </div>

              {OTHER_APPS_DATA.map((app, index) => (
                <div
                  key={index}
                  className="bg-stone-50 hover:bg-orange-50/50 border border-stone-200/80 hover:border-orange-300 rounded-2xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {index === 0 && <BookOpen className="w-5 h-5" />}
                      {index === 1 && <Layers className="w-5 h-5" />}
                      {index === 2 && <Heart className="w-5 h-5" />}
                      {index === 3 && <Compass className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 truncate mt-0.5">
                        {app.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400">
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                          {app.rating}
                        </span>
                        <span>•</span>
                        <span>{app.downloads} ডাউনলোড</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`'${app.name}' অ্যাপটি গুগল প্লে স্টোরে শীঘ্রই আসছে!`)}
                    className="p-2 text-stone-400 hover:text-orange-600 hover:bg-white rounded-xl transition-colors shrink-0"
                    title="ইনস্টল করুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
          >
            ঠিক আছে
          </button>
        </div>

      </div>
    </div>
  );
};
