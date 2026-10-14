// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// সেকেন্ড থেকে বাংলা সময় ফরম্যাট (যেমন: ১৪:২০)
export function formatDurationBengali(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '০০:০০';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  return toBengaliNumber(`${minsStr}:${secsStr}`);
}

// ঘণ্টার সহ ফরম্যাট (যেমন: ০১:১৪:২০)
export function formatFullDurationBengali(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '০০:০০';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    const hrsStr = hrs < 10 ? `0${hrs}` : `${hrs}`;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
    return toBengaliNumber(`${hrsStr}:${minsStr}:${secsStr}`);
  }

  return formatDurationBengali(seconds);
}

// ফাইল সাইজ বাংলায় ফরম্যাট
export function formatFileSizeBengali(megabytes: number): string {
  return `${toBengaliNumber(megabytes.toFixed(1))} মেগাবাইট`;
}

// ভিউ/প্লে সংখ্যা বাংলায় সংক্ষিপ্ত রূপ (যেমন: ৩৫.২ হাজার)
export function formatPlayCountBengali(count: number): string {
  if (count >= 100000) {
    return `${toBengaliNumber((count / 100000).toFixed(1))} লাখ`;
  }
  if (count >= 1000) {
    return `${toBengaliNumber((count / 1000).toFixed(1))} হাজার`;
  }
  return toBengaliNumber(count);
}
