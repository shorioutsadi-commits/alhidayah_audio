import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'orange' | 'badge';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'orange', 
  showText = false 
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const dimension = iconSizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div 
        className={`relative flex items-center justify-center rounded-2xl shadow-sm transition-transform active:scale-95 ${sizeMap[size]} ${
          variant === 'white' 
            ? 'bg-white text-orange-600 shadow-md' 
            : 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-orange-500/25 shadow-lg'
        }`}
      >
        {/* Islamic Audio Logo Icon: Crescent + Minaret/Audio Soundwave Waves + Play Triangle */}
        <svg 
          width={dimension * 0.72} 
          height={dimension * 0.72} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Islamic Crescent geometry */}
          <path 
            d="M34 22 C56 22 72 35 72 50 C72 65 56 78 34 78 C42 67 46 56 46 50 C46 44 42 33 34 22 Z" 
            fill="currentColor" 
          />
          {/* Star/Audio dot */}
          <circle cx="64" cy="36" r="5" fill="currentColor" />
          {/* Audio sound waves / Minaret arch */}
          <path 
            d="M26 68 L26 32 C26 29 29 27 32 29 L60 47 C63 49 63 53 60 55 L32 73 C29 75 26 73 26 70 Z" 
            fill="currentColor" 
            opacity="0.9" 
          />
          {/* Sound wave rings */}
          <path 
            d="M74 38 C79 42 82 46 82 50 C82 54 79 58 74 62" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            opacity="0.8" 
          />
          <path 
            d="M82 30 C89 36 92 43 92 50 C92 57 89 64 82 70" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            opacity="0.6" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight tracking-tight text-white drop-shadow-sm">
            আল হিদায়াহ
          </span>
          <span className="text-[11px] font-medium tracking-wide text-orange-100/90">
            অডিও লাইব্রেরি
          </span>
        </div>
      )}
    </div>
  );
};
