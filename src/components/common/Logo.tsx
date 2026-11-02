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
        {/* Audio Soundwave Equalizer Logo with 7 rounded vertical pill bars */}
        <svg 
          width={dimension * 0.72} 
          height={dimension * 0.72} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bar 1 */}
          <rect x="11" y="37" width="8" height="26" rx="4" fill="currentColor" />
          {/* Bar 2 */}
          <rect x="23" y="31" width="8" height="38" rx="4" fill="currentColor" />
          {/* Bar 3 */}
          <rect x="35" y="21" width="8" height="58" rx="4" fill="currentColor" />
          {/* Bar 4 (Center - Tallest) */}
          <rect x="46" y="8" width="8" height="84" rx="4" fill="currentColor" />
          {/* Bar 5 */}
          <rect x="58" y="21" width="8" height="58" rx="4" fill="currentColor" />
          {/* Bar 6 */}
          <rect x="70" y="31" width="8" height="38" rx="4" fill="currentColor" />
          {/* Bar 7 */}
          <rect x="81" y="37" width="8" height="26" rx="4" fill="currentColor" />
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
