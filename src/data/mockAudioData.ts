import { AudioItem, Speaker, Category } from '../types/audio';

export const SPEAKERS_DATA: Speaker[] = [
  // User requested prominent scholars & Da'is
  {
    id: 'spk-abu-bakar-zakaria',
    name: 'শাইখ ড. আবু বকর মুহাম্মদ জাকারিয়া',
    title: 'প্রফেসর, আল-ফিকহ ও ল’ বিভাগ, ইসলামী বিশ্ববিদ্যালয়',
    image: './speakers/speaker_1_abu_bakar_zakaria.jpg',
    bio: 'মদিনা ইসলামিক বিশ্ববিদ্যালয় থেকে পিএইচডি ডিগ্রিধারী। তাফসীরে তাওযীহুল কুরআনের প্রণেতা এবং আন্তর্জাতিক খ্যাতিসম্পন্ন ইসলামিক স্কলার।',
    totalAudios: 4,
    category: 'আকীদা ও তাফসীর'
  },
  {
    id: 'spk-motiur-rahman-madani',
    name: 'শাইখ মতিউর রাহমান মাদানি',
    title: 'মুহাদ্দিস ও বিশিষ্ট ইসলামিক দাঈ (জুবাইল, কেএসএ)',
    image: './speakers/speaker_2_motiur_rahman_madani.jpg',
    bio: 'মদিনা ইসলামিক বিশ্ববিদ্যালয় থেকে উচ্চশিক্ষা সম্পন্নকারী। সহীহ সুন্নাহ প্রচার ও বেদআত বর্জনে তিন দশকেরও বেশি সময় ধরে নিবেদিত।',
    totalAudios: 1,
    category: 'সহীহ হাদিস ও সুন্নাহ'
  },
  {
    id: 'spk-abdul-hamid-faizi',
    name: 'শাইখ আব্দুল হামিদ ফাইযি',
    title: 'প্রখ্যাত লেখক, গবেষক ও অনুবাদক',
    image: './speakers/speaker_3_abdul_hamid_faizi.jpg',
    bio: 'সহীহ বুখারী ও রিয়াযুস স্বালেহীনের নির্ভরযোগ্য বাংলা ব্যাখ্যাকারক এবং অসংখ্য গবেষণাধর্মী ইসলামিক গ্রন্থের প্রণেতা।',
    totalAudios: 52,
    category: 'হাদিস ও গ্রন্থ পর্যালোচনা'
  },
  {
    id: 'spk-manzoor-e-elahi',
    name: 'শাইখ ড. মুহাম্মাদ মানজুরে ইলাহি',
    title: 'সহযোগী অধ্যাপক ও ইসলামিক চিন্তাবিদ',
    image: './speakers/speaker_4_manzoor_e_elahi.png',
    bio: 'মদিনা বিশ্ববিদ্যালয় থেকে ইসলামিক স্টাডিজে পিএইচডি ডিগ্রিধারী। জাতীয় বিশ্ববিদ্যালয়ের শিক্ষক ও প্রাঞ্জল উপস্থাপক।',
    totalAudios: 47,
    category: 'ফিকহ ও পারিবারিক বিধান'
  },
  {
    id: 'spk-saifullah-madani',
    name: 'শাইখ ড. সাইফুল্লাহ আল মাদানি',
    title: 'বিশিষ্ট গবেষক ও ফতোয়া বিশেষজ্ঞ',
    image: './speakers/speaker_5_saifullah_madani.png',
    bio: 'মদিনা ইসলামিক বিশ্ববিদ্যালয় থেকে ডিগ্রিপ্রাপ্ত। সমসাময়িক প্রশ্নোত্তর ও ফিকহি জটিল বিষয়ে গবেষণালব্ধ বক্তব্য প্রদান করেন।',
    totalAudios: 73,
    category: 'প্রশ্নোত্তর ও ফিকহ'
  },
  {
    id: 'spk-shahidullah-khan-madani',
    name: 'শাইখ শহিদুল্লাহ খান মাদানি',
    title: 'প্রখ্যাত মুহাদ্দিস ও ইসলামিক গবেষক',
    image: './speakers/speaker_6_shahidullah_khan.jpg',
    bio: 'শান্ত-শিষ্ট ভাবগাম্ভীর্যপূর্ণ আলোচনার জন্য সুপরিচিত। সহীহ আকিদা ও ইবাদতের বিশুদ্ধতার বিষয়ে নিবেদিতপ্রাণ।',
    totalAudios: 39,
    category: 'সহীহ আকিদা'
  },
  {
    id: 'spk-mustafizur-rahman-madani',
    name: 'শাইখ মুস্তাফিজুর রাহমান মাদানি',
    title: 'বিশিষ্ট দাঈ ও মিডিয়া ব্যক্তিত্ব',
    image: './speakers/speaker_7_mostafizur_rahman.jpg',
    bio: 'সহজ-সরল ভাষায় সাধারণ মানুষের কাছে সহীহ দ্বীন পৌঁছে দিতে সুপরিচিত ইসলামিক ব্যক্তিত্ব।',
    totalAudios: 36,
    category: 'দ্বীনী জীবনযাপন'
  },
  {
    id: 'spk-saifuddin-bilal-madani',
    name: 'শাইখ সাইফুদ্দিন বিলাল মাদানি',
    title: 'ইসলামিক চিন্তাবিদ ও খতীব',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'মদিনা বিশ্ববিদ্যালয় থেকে শিক্ষা সমাপনকারী। খুতবা ও দরসের মাধ্যমে সহীহ সুন্নাহর দাওয়াত প্রচারক।',
    totalAudios: 41,
    category: 'জুমার খুতবা ও বয়ান'
  },
  {
    id: 'spk-abdullah-shahed-madani',
    name: 'শাইখ আব্দুল্লাহ শাহেদ আল মাদানি',
    title: 'ইসলামিক আলোচক ও শিক্ষাবিদ',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'পবিত্র কুরআন ও হাদিসের আলোকে যুবসমাজের চরিত্র গঠন ও জীবনোপযোগী আলোচনা করে থাকেন।',
    totalAudios: 33,
    category: 'নৈতিকতা ও চরিত্র'
  },
  {
    id: 'spk-abdur-razzaq-bin-yousuf',
    name: 'শাইখ আব্দুর রাজ্জাক বিন ইউসুফ',
    title: 'প্রতিষ্ঠাতা, আল-জামিআহ আস-সালাফিয়্যাহ, রাজশাহী',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'হৃদয়কাঁপানো জোরালো বক্তব্য ও সহীহ সুন্নাহ বাস্তবায়নের আহ্বানে দেশের সর্বত্র বিপুল জনপ্রিয় ইসলামিক বক্তা।',
    totalAudios: 98,
    category: 'আমল ও নসীহত'
  },
  {
    id: 'spk-muzaffar-bin-mohsin',
    name: 'ড. মোজাফফর বিন মহসিন',
    title: 'ইসলামিক গবেষক, শিক্ষক ও গ্রন্থকার',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'জাল হাদিসের বিরুদ্ধে গবেষণা ও সহীহ সুন্নাহভিত্তিক সালাতের সঠিক নিয়ম বর্ণনায় অনন্য অবদান রেখেছেন।',
    totalAudios: 45,
    category: 'জাল হাদিস ও সহীহ সুন্নাহ'
  },
  {
    id: 'spk-abdullah-faruq',
    name: 'অধ্যাপক ড. আব্দুল্লাহ ফারুক',
    title: 'শিক্ষাবিদ, গবেষক ও ইসলামিক চিন্তাবিদ',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'আধুনিক জ্ঞান-বিজ্ঞান ও ইসলামী শিক্ষার সমন্বয়ে গবেষণাধর্মী আলোচনার জন্য সমাদৃত ব্যক্তিত্ব।',
    totalAudios: 31,
    category: 'ইসলাম ও সমকালীন সমাজ'
  },
  {
    id: 'spk-akramuzzaman-bin-abdus-salam',
    name: 'শাইখ আকরামুজ্জামান বিন আবদুস সালাম',
    title: 'বিশিষ্ট দাঈ ও ইসলামিক আলোচক',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'শুদ্ধ উচ্চারণে দলীলভিত্তিক বক্তব্য প্রদানকারী অন্যতম সুবক্তা ও ইসলামিক গবেষক।',
    totalAudios: 42,
    category: 'আকীদা ও আমল'
  },
  {
    id: 'spk-imam-hossain',
    name: 'শাইখ ড. ইমাম হুসাইন',
    title: 'গবেষক, শিক্ষাবিদ ও ইসলামিক স্কলার',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'ইসলামী অনুশাসন ও সামাজিক উন্নয়নে প্রাজ্ঞ বিশ্লেষণের অধিকারী গবেষক আলেম।',
    totalAudios: 28,
    category: 'সমাজ সংস্কার'
  },
  {
    id: 'spk-ahmadullah-salafi',
    name: 'শাইখ আহমাদুল্লাহ সালাফি',
    title: 'মুহাদ্দিস ও বিশিষ্ট দাঈ',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'সহীহ হাদিসের প্রামাণিক ব্যাখ্যা এবং সালাফদের আদর্শ অনুযায়ী জীবন পরিচালনার দিকনির্দেশক।',
    totalAudios: 35,
    category: 'হাদিস পাঠ ও ব্যাখ্যা'
  },
  {
    id: 'spk-abdus-samad-salafi',
    name: 'শাইখ আবদুস সামাদ সালাফী',
    title: 'শিক্ষক, গ্রন্থকার ও স্কলার',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'ইসলামী শিক্ষার প্রচার ও গবেষণায় নিবেদিত অভিজ্ঞ ইসলামিক শিক্ষাবিদ।',
    totalAudios: 27,
    category: 'তাওহীদ ও সুন্নাহ'
  },
  {
    id: 'spk-amanullah-bin-ismail',
    name: 'শাইখ আমানুল্লাহ বিন ইসমাইল',
    title: 'বিশিষ্ট দাঈ ও আলোচক',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'মানুষের মাঝে ধর্মীয় মূল্যবোধ ও পরকালমুখিতা জাগাতে নিয়মিত আলোচনা করে থাকেন।',
    totalAudios: 30,
    category: 'পরকাল ও আত্মশুদ্ধি'
  },
  {
    id: 'spk-ali-hasan-tayyab',
    name: 'শাইখ আলী হাসান তৈয়ব',
    title: 'লেখক, গবেষক ও অনুবাদক',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'ইসলামিক ফাউণ্ডেশন ও দেশ-বিদেশের বিভিন্ন ইসলামিক জার্নালে অসংখ্য নিবন্ধের রচয়িতা।',
    totalAudios: 38,
    category: 'ইসলামিক সাহিত্য ও দাওয়াহ'
  },
  {
    id: 'spk-abdullah-al-kafi',
    name: 'শাইখ আব্দুল্লাহ আল কাফি',
    title: 'প্রখ্যাত দাঈ ও খতীব',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'কুরআন ও সহীহ হাদিসের দাওয়াত তরুণদের মাঝে ছড়িয়ে দিতে নিরলস পরিশ্রমী এক দাঈ।',
    totalAudios: 34,
    category: 'যুবসমাজ ও দ্বীন'
  },
  {
    id: 'spk-akhtarul-aman',
    name: 'শাইখ আখতারুল আমান',
    title: 'বিশিষ্ট আলেম ও গবেষক',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'সুন্নাহর সঠিক পথ ও বেদআতের ভয়াবহতা নিয়ে দলীলভিত্তিক আলোচনা করেন।',
    totalAudios: 26,
    category: 'সুন্নাহ ও বিদআত'
  },
  {
    id: 'spk-mukarram-bin-mohsin',
    name: 'শাইখ মুকাররম বিন মুহসিন',
    title: 'দাঈ ও ইসলামিক শিক্ষক',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'সহজ ভাষায় কোরআনের দাওয়াত ও মাসনূন আমল শিক্ষা প্রদানে জনপ্রিয়।',
    totalAudios: 29,
    category: 'মাসনূন আমল'
  },
  {
    id: 'spk-mahmud-bin-qasim',
    name: 'মাহমুদ বিন ক্বাসীম',
    title: 'ইসলামিক আলোচক ও দাঈ',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'হৃদয়গ্রাহী নসীহত ও সমকালীন বিষয় নিয়ে বাস্তবভিত্তিক আলোচনা উপস্থাপন করেন।',
    totalAudios: 31,
    category: 'নসীহত ও ওয়াজ'
  },
  {
    id: 'spk-abdullahil-hadi',
    name: 'শাইখ আব্দুল্লাহিল হাদি',
    title: 'বিশিষ্ট ইসলামিক চিন্তাবিদ ও দাঈ',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'জুবাইল ইসলামিক সেন্টারের সাবেক দাঈ। প্রাঞ্জল বাংলা উপস্থাপনায় ইসলামের সৌন্দর্য তুলে ধরেন।',
    totalAudios: 44,
    category: 'দাওয়াহ ও জীবনযাপন'
  },
  {
    id: 'spk-abdur-rob-affan',
    name: 'শাইখ আব্দুর রব আফফান',
    title: 'গবেষক ও ইসলামিক স্কলার',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'কুরআন-হাদিসের আলোকে পরিবার ও ব্যক্তি জীবনের সংশোধন নিয়ে আলোকপাত করেন।',
    totalAudios: 25,
    category: 'পরিবার সংস্কার'
  },
  {
    id: 'spk-shahadat-faisal',
    name: 'শাহাদত ফয়সাল',
    title: 'তরুণ লেখক ও ইসলামিক আলোচক',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'আধুনিক প্রেক্ষাপটে তরুণ প্রজন্মের আত্মশুদ্ধি ও দ্বীনদারিতার ওপর মনোজ্ঞ আলোচনা করেন।',
    totalAudios: 22,
    category: 'আত্মশুদ্ধি ও যুবসমাজ'
  },
  {
    id: 'spk-abdullah-al-baqi',
    name: 'শাইখ আবদুল্লাহ আল বাকি',
    title: 'মুহাদ্দিস ও ইসলামিক গবেষক',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'হাদিস শাস্ত্রের বিশদ অধ্যয়ন ও প্রামাণ্য আলোচনার জন্য সমাদৃত ব্যক্তিত্ব।',
    totalAudios: 28,
    category: 'হাদিস শাস্ত্র'
  },
  {
    id: 'spk-abdun-noor-madani',
    name: 'শাইখ আব্দুন নুর মাদানী',
    title: 'প্রখ্যাত দাঈ ও খতীব',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'মদিনা বিশ্ববিদ্যালয় থেকে ফারেগ। বিশুদ্ধ আমল ও পরকালীন মুক্তির বিষয়ে গুরুত্বারোপ করেন।',
    totalAudios: 37,
    category: 'আমল ও আখলাক'
  },
  {
    id: 'spk-musleh-uddin',
    name: 'ড. মুসলেহ উদ্দীন',
    title: 'ইসলামিক গবেষক ও শিক্ষাবিদ',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'উচ্চতর ইসলামিক জ্ঞান ও গবেষক ঘরানার গভীর বিশ্লেষণের জন্য পরিচিত।',
    totalAudios: 33,
    category: 'গবেষণা ও ফিকহ'
  },
  {
    id: 'spk-abdur-rahman-bin-abdur-rahim',
    name: 'আব্দুর রহমান বিন আব্দুর রহিম',
    title: 'বিশিষ্ট দাঈ ও আলোচক',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'সহীহ পথ ও বিশুদ্ধ আমলের দিকে মানুষকে উদ্বুদ্ধ করতে নিরবচ্ছিন্ন আলোচনা করেন।',
    totalAudios: 24,
    category: 'সহীহ পথ'
  },
  {
    id: 'spk-akhtar-madani',
    name: 'শায়েখ আখতার মাদানি',
    title: 'ইসলামিক স্কলার ও দাঈ',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'দ্বীনের মৌলিক জ্ঞান ও ঈমানী দৃঢ়তার ওপর বিশেষ আলোকপাতকারী।',
    totalAudios: 32,
    category: 'ঈমান ও তাকওয়া'
  },
  {
    id: 'spk-asadullah-al-ghalib',
    name: 'ড. আসাদুল্লাহ আল গালিব',
    title: 'আমীর, আহলেহাদীছ আন্দোলন বাংলাদেশ ও সাবেক প্রফেসর, রাবি',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'রাজশাহী বিশ্ববিদ্যালয়ের আরবি বিভাগের সাবেক প্রফেসর ও বিভাগীয় প্রধান। তাফসীরুল কুরআন ও সালাতুর রাসূল (ছা:) এর সুখ্যাত রচয়িতা।',
    totalAudios: 110,
    category: 'তাফসীর ও সংস্কার আন্দোলন'
  },
  {
    id: 'spk-harun-hossain',
    name: 'শাইখ ড. মুহাম্মদ হারুন হুসাইন',
    title: 'শিক্ষাবিদ ও ইসলামিক গবেষক',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'কুরআন ও হাদিসের আলোকে আধুনিক সমাজচিন্তা ও সমাধানের প্রবক্তা।',
    totalAudios: 29,
    category: 'সমকালীন চিন্তা'
  },
  {
    id: 'spk-ahmadullah-trishali',
    name: 'ড. আহমাদুল্লাহ ত্রিশালী',
    title: 'বিশিষ্ট আলেম, লেখক ও গবেষক',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'ধর্মীয় সহনশীলতা ও সহীহ সুন্নাহর ভিত্তিতে জীবন গড়ার প্রবক্তা।',
    totalAudios: 31,
    category: 'সীরাত ও ইতিহাস'
  },
  {
    id: 'spk-azmal-hossain-madani',
    name: 'শাইখ মুহাম্মদ আজমল হোসেন মাদানী',
    title: 'দাঈ ও খতীব',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'মদিনা ইসলামিক বিশ্ববিদ্যালয় থেকে স্নাতক। সুললিত কণ্ঠে কোরআন-সুন্নাহর জ্ঞান ছড়িয়ে দেন।',
    totalAudios: 35,
    category: 'খুতবা ও বয়ান'
  },
  {
    id: 'spk-masudul-alam-umari',
    name: 'শাইখ মাসউদুল আলম উমরী',
    title: 'গবেষক ও শিক্ষক',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bio: 'জামিয়া সালাফিয়্যা থেকে গ্র্যাজুয়েট। দ্বীনি গবেষণায় সুপ্রতিষ্ঠিত ব্যক্তিত্ব।',
    totalAudios: 28,
    category: 'ইসলামী শিক্ষা'
  },
  {
    id: 'spk-abdun-noor-bin-abu-sayeed',
    name: 'শাইখ আব্দুন নূর বিন আবু সাঈদ মাদানী',
    title: 'শিক্ষক ও ইসলামিক স্কলার',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'সহীহ হাদিস ও আকিদা শিক্ষাদানে দীর্ঘদিনের শিক্ষকতার অভিজ্ঞতা সম্পন্ন।',
    totalAudios: 33,
    category: 'হাদিস ও দরস'
  },
  {
    id: 'spk-hedayet-ullah',
    name: 'শাইখ ড. মোহাম্মদ হেদায়েত উল্লাহ',
    title: 'ইসলামিক চিন্তাবিদ ও গবেষক',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'উচ্চতর ইসলামিক গবেষণায় নিবেদিত এবং জাতীয় ও আন্তর্জাতিক পরিমণ্ডলে সুপরিচিত।',
    totalAudios: 30,
    category: 'ইসলাম ও দর্শন'
  },
  {
    id: 'spk-sanaullah-nazir-ahmad',
    name: 'শাইখ সানাউল্লাহ নজির আহমদ',
    title: 'লেখক, গবেষক ও দাঈ',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'ইসলাম হাউজসহ বহু আর্ন্তজাতিক ইসলামিক ওয়েবসাইটে বহু মূল্যবান গ্রন্থের লেখক ও গবেষক।',
    totalAudios: 40,
    category: 'অনুবাদ ও প্রবন্ধ'
  },

  {
    id: 'spk-3',
    name: 'ড. খোন্দকার আব্দুল্লাহ জাহাঙ্গীর',
    title: 'প্রখ্যাত হাদিস বিশারদ (রহ.)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'রিয়াদের ইমাম মুহাম্মদ ইবনে সউদ বিশ্ববিদ্যালয় থেকে পিএইচডি ডিগ্রিধারী। বই ও বয়ানের মাধ্যমে সহীহ সুন্নাহ প্রচারের পুরোধা ব্যক্তিত্ব।',
    totalAudios: 35,
    category: 'হাদিস ও আকীদা'
  }
];

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-1',
    name: 'ঈমান ও আকীদা',
    iconName: 'ShieldCheck',
    description: 'সহীহ আকিদা, তাওহীদ ও ঈমান মজবুত করার মূলনীতি',
    audioCount: 48,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'cat-2',
    name: 'কুরআন তিলাওয়াত ও অর্থ',
    iconName: 'BookOpen',
    description: 'মধুর কণ্ঠে কুরআন তেলাওয়াত ও প্রাঞ্জল বাংলা অনুবাদ',
    audioCount: 114,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'cat-3',
    name: 'সীরাতুন্নবী (সা:) ও সাহাবা',
    iconName: 'Compass',
    description: 'রাসূলুল্লাহ (সা:) এর পুণ্যময় জীবনী ও সাহাবাদের আদর্শ',
    audioCount: 36,
    color: 'from-orange-400 to-amber-600'
  },
  {
    id: 'cat-4',
    name: 'পরিবার ও সমাজ সংস্কার',
    iconName: 'Users',
    description: 'পিতা-মাতার হক, দাম্পত্য জীবন ও সন্তান লালন-পালন',
    audioCount: 52,
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'cat-5',
    name: 'তাওবা ও আত্মশুদ্ধি',
    iconName: 'Heart',
    description: 'গুনাহ বর্জন, ইস্তিগফার ও কলবের প্রশান্তি',
    audioCount: 40,
    color: 'from-orange-600 to-rose-600'
  },
  {
    id: 'cat-6',
    name: 'মাসনুন দোয়া ও জিকির',
    iconName: 'Sparkles',
    description: 'দৈনন্দিন জীবনের সহীহ দোয়া ও গুরুত্বপূর্ণ জিকির',
    audioCount: 28,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'cat-7',
    name: 'রমজান ও রোজা',
    iconName: 'Moon',
    description: 'সিয়ামের ফজিলত, মাসআলা ও লাইলাতুল কদর',
    audioCount: 32,
    color: 'from-orange-500 to-amber-700'
  },
  {
    id: 'cat-8',
    name: 'প্রশ্ন ও উত্তর পর্ব',
    iconName: 'HelpCircle',
    description: 'সাধারণ মানুষের নিত্যদিনের জীবনঘনিষ্ঠ প্রশ্নের জবাব',
    audioCount: 65,
    color: 'from-amber-500 to-orange-500'
  }
];

export const AUDIOS_DATA: AudioItem[] = [
  // Dr. Abu Bakar Muhammad Zakaria - Kitabut Tawheed Series (4 Episodes)
  {
    id: 'aud-abz-1',
    title: 'কিতাবুত তাওহীদের ব্যাখ্যা — পর্ব ১',
    speakerId: 'spk-abu-bakar-zakaria',
    speakerName: 'শাইখ ড. আবু বকর মুহাম্মদ জাকারিয়া',
    speakerImage: './speakers/speaker_1_abu_bakar_zakaria.jpg',
    category: 'ঈমান ও আকীদা',
    description: 'শাইখুল ইসলাম মুহাম্মাদ ইবন আব্দুল ওয়াহহাব রহ.-এর প্রখ্যাত গ্রন্থ কিতাবুত তাওহীদের প্রামাণ্য ও বিস্তারিত ব্যাখ্যা — ১ম পর্ব।',
    duration: 5348,
    audioUrl: 'https://archive.org/download/20261020_20261020_0602/%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/%E0%A6%95%E0%A6%BF%E0%A6%A4%E0%A6%BE%E0%A6%AC%E0%A7%81%E0%A6%A4%20%E0%A6%A4%E0%A6%BE%E0%A6%93%E0%A6%B9%E0%A7%80%E0%A6%A6%E0%A7%87%E0%A6%B0%20%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%96%E2%80%8C%E0%A7%8D%E0%A6%AF%E0%A6%BE%201.mp3',
    fileSizeMb: 20.5,
    playCount: 41200,
    publishDate: '২০ অক্টোবর, ২০২৬',
    isFeatured: true,
    seriesName: 'কিতাবুত তাওহীদের ব্যাখ্যা'
  },
  {
    id: 'aud-abz-2',
    title: 'কিতাবুত তাওহীদের ব্যাখ্যা — পর্ব ২',
    speakerId: 'spk-abu-bakar-zakaria',
    speakerName: 'শাইখ ড. আবু বকর মুহাম্মদ জাকারিয়া',
    speakerImage: './speakers/speaker_1_abu_bakar_zakaria.jpg',
    category: 'ঈমান ও আকীদা',
    description: 'কিতাবুত তাওহীদের প্রামাণ্য ও বিস্তারিত ব্যাখ্যা — ২য় পর্ব।',
    duration: 4615,
    audioUrl: 'https://archive.org/download/20261020_20261020_0602/%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/%E0%A6%95%E0%A6%BF%E0%A6%A4%E0%A6%BE%E0%A6%AC%E0%A7%81%E0%A6%A4%20%E0%A6%A4%E0%A6%BE%E0%A6%93%E0%A6%B9%E0%A7%80%E0%A6%A6%E0%A7%87%E0%A6%B0%20%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%96%E2%80%8C%E0%A7%8D%E0%A6%AF%E0%A6%BE%202.mp3',
    fileSizeMb: 17.7,
    playCount: 32600,
    publishDate: '২০ অক্টোবর, ২০২৬',
    isFeatured: false,
    seriesName: 'কিতাবুত তাওহীদের ব্যাখ্যা'
  },
  {
    id: 'aud-abz-3',
    title: 'কিতাবুত তাওহীদের ব্যাখ্যা — পর্ব ৩',
    speakerId: 'spk-abu-bakar-zakaria',
    speakerName: 'শাইখ ড. আবু বকর মুহাম্মদ জাকারিয়া',
    speakerImage: './speakers/speaker_1_abu_bakar_zakaria.jpg',
    category: 'ঈমান ও আকীদা',
    description: 'কিতাবুত তাওহীদের প্রামাণ্য ও বিস্তারিত ব্যাখ্যা — ৩য় পর্ব।',
    duration: 4418,
    audioUrl: 'https://archive.org/download/20261020_20261020_0602/%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/%E0%A6%95%E0%A6%BF%E0%A6%A4%E0%A6%BE%E0%A6%AC%E0%A7%81%E0%A6%A4%20%E0%A6%A4%E0%A6%BE%E0%A6%93%E0%A6%B9%E0%A7%80%E0%A6%A6%E0%A7%87%E0%A6%B0%20%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%96%E2%80%8C%E0%A7%8D%E0%A6%AF%E0%A6%BE%203.mp3',
    fileSizeMb: 16.9,
    playCount: 27900,
    publishDate: '২০ অক্টোবর, ২০২৬',
    isFeatured: false,
    seriesName: 'কিতাবুত তাওহীদের ব্যাখ্যা'
  },
  {
    id: 'aud-abz-4',
    title: 'কিতাবুত তাওহীদের ব্যাখ্যা — পর্ব ৪',
    speakerId: 'spk-abu-bakar-zakaria',
    speakerName: 'শাইখ ড. আবু বকর মুহাম্মদ জাকারিয়া',
    speakerImage: './speakers/speaker_1_abu_bakar_zakaria.jpg',
    category: 'ঈমান ও আকীদা',
    description: 'কিতাবুত তাওহীদের প্রামাণ্য ও বিস্তারিত ব্যাখ্যা — ৪র্থ পর্ব।',
    duration: 4449,
    audioUrl: 'https://archive.org/download/20261020_20261020_0602/%E0%A6%86%E0%A6%AC%E0%A7%81%20%E0%A6%AC%E0%A6%95%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%B9%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%A6%20%E0%A6%AF%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%E0%A7%9F%E0%A6%BE/%E0%A6%95%E0%A6%BF%E0%A6%A4%E0%A6%BE%E0%A6%AC%E0%A7%81%E0%A6%A4%20%E0%A6%A4%E0%A6%BE%E0%A6%93%E0%A6%B9%E0%A7%80%E0%A6%A6%E0%A7%87%E0%A6%B0%20%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%96%E2%80%8C%E0%A7%8D%E0%A6%AF%E0%A6%BE%204.mp3',
    fileSizeMb: 17.0,
    playCount: 25400,
    publishDate: '২০ অক্টোবর, ২০২৬',
    isFeatured: false,
    seriesName: 'কিতাবুত তাওহীদের ব্যাখ্যা'
  },

  // Sheikh Motiur Rahman Madani
  {
    id: 'aud-mrm-1',
    title: 'বাংলা তাফসীর — কুরআনের সূরার ফযিলত',
    speakerId: 'spk-motiur-rahman-madani',
    speakerName: 'শাইখ মতিউর রাহমান মাদানি',
    speakerImage: './speakers/speaker_2_motiur_rahman_madani.jpg',
    category: 'কুরআন তিলাওয়াত ও অর্থ',
    description: 'শাইখ মতিউর রাহমান মাদানি কর্তৃক পবিত্র কুরআনের বিভিন্ন সূরার গুরুত্ব, তাৎপর্য ও ফযিলত সম্পর্কিত বিশদ তাফসীর ও আলোচনা।',
    duration: 3344,
    audioUrl: 'https://archive.org/download/bangla-tafseer-000-quraner-surar-fozilat-by-motiur-rahman-madani/Bangla%20Tafseer%20000%20Quraner%20Surar%20Fozilat%20by%20Motiur%20Rahman%20Madani.mp3',
    fileSizeMb: 24.9,
    playCount: 52400,
    publishDate: '২০ অক্টোবর, ২০২৬',
    isFeatured: true,
    seriesName: 'বাংলা তাফসীর সিরিজ'
  },

  // Sheikh Abdur Razzaq Bin Yousuf
  {
    id: 'aud-arby-1',
    title: 'আদর্শ পরিবার গঠনে পিতা-মাতা ও সন্তানের করণীয়',
    speakerId: 'spk-abdur-razzaq-bin-yousuf',
    speakerName: 'শাইখ আব্দুর রাজ্জাক বিন ইউসুফ',
    speakerImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    category: 'পরিবার ও সমাজ সংস্কার',
    description: 'পরিবারে ইসলামী অনুশাসন কায়েম, সন্তানদের দ্বীনি তরবিয়ত ও পিতামাতার হক আদায়ের জোরালো নসীহত।',
    duration: 1420,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
    fileSizeMb: 19.4,
    playCount: 62000,
    publishDate: '০৫ অক্টোবর, ২০২৬',
    isFeatured: true,
    seriesName: 'আদর্শ পরিবার'
  },
  {
    id: 'aud-arby-2',
    title: 'কবরের কঠিন আযাব ও জাহান্নাম থেকে মুক্তির পথ',
    speakerId: 'spk-abdur-razzaq-bin-yousuf',
    speakerName: 'শাইখ আব্দুর রাজ্জাক বিন ইউসুফ',
    speakerImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    category: 'তাওবা ও আত্মশুদ্ধি',
    description: 'মৃত্যুর পরবর্তী জীবনের বিভীষিকা ও ক্ষমা পাওয়ার প্রকৃত আমল নিয়ে হৃদয়গ্রাহী বক্তৃতা।',
    duration: 1150,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
    fileSizeMb: 15.8,
    playCount: 48300,
    publishDate: '২০ সেপ্টেম্বর, ২০২৬'
  },

  // Dr. Asadullah Al Ghalib
  {
    id: 'aud-aag-1',
    title: 'সালাতুর রাসূল (ছা:) - রাসুলুল্লাহর নামাজ ও খুশু',
    speakerId: 'spk-asadullah-al-ghalib',
    speakerName: 'ড. আসাদুল্লাহ আল গালিব',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    category: 'সহীহ হাদিস ও সুন্নাহ',
    description: 'বিশুদ্ধ সনদের আলোকে রাসুলুল্লাহ (সা:) এর সালাতের চুলচেরা বিশ্লেষণ ও শিক্ষা।',
    duration: 1340,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 18.2,
    playCount: 38900,
    publishDate: '০২ অক্টোবর, ২০২৬',
    isFeatured: true,
    seriesName: 'সালাতুর রাসূল সিরিজ'
  },
  {
    id: 'aud-aag-2',
    title: 'তাওহীদ রিসালাত ও আখেরাতের প্রামাণ্য বিশ্লেষণ',
    speakerId: 'spk-asadullah-al-ghalib',
    speakerName: 'ড. আসাদুল্লাহ আল গালিব',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    category: 'ঈমান ও আকীদা',
    description: 'কুরআনুল কারীমের মূল তিনটি স্তম্ভ নিয়ে গভীর ও প্রজ্ঞাপূর্ণ বক্তব্য।',
    duration: 1220,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
    fileSizeMb: 16.5,
    playCount: 27500,
    publishDate: '১৮ সেপ্টেম্বর, ২০২৬'
  },

  // Dr. Muhammad Manzoor-E-Elahi
  {
    id: 'aud-mme-1',
    title: 'মুসলিম জীবনে হালাল উপার্জনের গুরুত্ব ও সুদের ক্ষতি',
    speakerId: 'spk-manzoor-e-elahi',
    speakerName: 'শাইখ ড. মুহাম্মাদ মানজুরে ইলাহি',
    speakerImage: './speakers/speaker_4_manzoor_e_elahi.png',
    category: 'পরিবার ও সমাজ সংস্কার',
    description: 'অর্থনৈতিক জীবনে ইসলামী শরীয়তের বিধান ও বরকত হাসিলের উপায়।',
    duration: 990,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
    fileSizeMb: 13.5,
    playCount: 24100,
    publishDate: '২২ সেপ্টেম্বর, ২০২৬'
  },

  // Dr. Saifullah Al Madani
  {
    id: 'aud-sam-1',
    title: 'দৈনন্দিন জীবনের জরুরি ৫০টি জটিল প্রশ্নের ফতোয়া',
    speakerId: 'spk-saifullah-madani',
    speakerName: 'শাইখ ড. সাইফুল্লাহ আল মাদানি',
    speakerImage: './speakers/speaker_5_saifullah_madani.png',
    category: 'প্রশ্ন ও উত্তর পর্ব',
    description: 'বিবাহ, তালাক, উত্তরাধিকার ও আর্থিক লেনদেনের আধুনিক শরয়ী সমাধান।',
    duration: 1180,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 16.1,
    playCount: 33400,
    publishDate: '২৬ সেপ্টেম্বর, ২০২৬'
  },

  // Sheikh Abdul Hamid Faizi
  {
    id: 'aud-ahf-1',
    title: 'রিয়াযুস স্বালেহীন থেকে নির্বাচিত গুরুত্বপূর্ণ হাদিস পাঠ',
    speakerId: 'spk-abdul-hamid-faizi',
    speakerName: 'শাইখ আব্দুল হামিদ ফাইযি',
    speakerImage: './speakers/speaker_3_abdul_hamid_faizi.jpg',
    category: 'সহীহ হাদিস ও সুন্নাহ',
    description: 'নৈতিকতা, সততা ও মানুষের সাথে সদ্ব্যবহারের বিষয়ে ইমাম নববীর সংকলন থেকে আলোচনা।',
    duration: 1040,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
    fileSizeMb: 14.0,
    playCount: 21800,
    publishDate: '১৫ সেপ্টেম্বর, ২০২৬'
  },

  // Dr. Muzaffar Bin Mohsin
  {
    id: 'aud-mbm-1',
    title: 'প্রচলিত জাল ও যয়ীফ হাদিসের স্বরূপ উন্মোচন',
    speakerId: 'spk-muzaffar-bin-mohsin',
    speakerName: 'ড. মোজাফফর বিন মহসিন',
    speakerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    category: 'সহীহ হাদিস ও সুন্নাহ',
    description: 'আমাদের সমাজে প্রচলিত ভিত্তিহীন কিচ্ছা-কাহিনী বর্জন ও সহীহ হাদিস গ্রহণের আহ্বান।',
    duration: 1110,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
    fileSizeMb: 15.0,
    playCount: 29500,
    publishDate: '১৭ সেপ্টেম্বর, ২০২৬'
  },

  // Sheikh Shahidullah Khan Madani
  {
    id: 'aud-skm-1',
    title: 'কলবের ব্যাধি ও তা থেকে আত্মরক্ষার কুরআনিক পথ',
    speakerId: 'spk-shahidullah-khan-madani',
    speakerName: 'শাইখ শহিদুল্লাহ খান মাদানি',
    speakerImage: './speakers/speaker_6_shahidullah_khan.jpg',
    category: 'তাওবা ও আত্মশুদ্ধি',
    description: 'অহংকার, রিয়া ও হিংসা দূর করে প্রশান্ত আত্মা অর্জনের উপায়।',
    duration: 950,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 12.8,
    playCount: 18700,
    publishDate: '১০ সেপ্টেম্বর, ২০২৬'
  },

  // Sheikh Mustafizur Rahman Madani
  {
    id: 'aud-mrmad-1',
    title: 'দ্বীনের পথে অবিচল থাকার উপায় ও সালাফের আদর্শ',
    speakerId: 'spk-mustafizur-rahman-madani',
    speakerName: 'শাইখ মুস্তাফিজুর রাহমান মাদানি',
    speakerImage: './speakers/speaker_7_mostafizur_rahman.jpg',
    category: 'দ্বীনী জীবনযাপন',
    description: 'দৈনন্দিন জীবনে ফিতনার মাঝে কীভাবে ঈমান ও তাকওয়া রক্ষা করবেন তার বাস্তবমুখী নসীহত।',
    duration: 1080,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
    fileSizeMb: 14.5,
    playCount: 21500,
    publishDate: '১২ সেপ্টেম্বর, ২০২৬',
    isFeatured: true,
    seriesName: 'ঈমান ও তাকওয়া'
  },

  // Sheikh Abdullahil Hadi
  {
    id: 'aud-ahh-1',
    title: 'প্রবাসে দ্বীন রক্ষা ও হালাল উপার্জনের বরকত',
    speakerId: 'spk-abdullahil-hadi',
    speakerName: 'শাইখ আব্দুল্লাহিল হাদি',
    speakerImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    category: 'পরিবার ও সমাজ সংস্কার',
    description: 'প্রবাসী ভাইদের জন্য বিশেষ নসীহত ও আল্লাহর ওপর তাওয়াক্কুল।',
    duration: 890,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3',
    fileSizeMb: 12.2,
    playCount: 22100,
    publishDate: '০৮ সেপ্টেম্বর, ২০২৬'
  },

  // Sheikh Akramuzzaman Bin Abdus Salam
  {
    id: 'aud-abas-1',
    title: 'মুমিনের জীবনের চূড়ান্ত লক্ষ্য জান্নাত অর্জন',
    speakerId: 'spk-akramuzzaman-bin-abdus-salam',
    speakerName: 'শাইখ আকরামুজ্জামান বিন আবদুস সালাম',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    category: 'ঈমান ও আকীদা',
    description: 'জান্নাতের অতুলনীয় নিয়ামত ও জান্নাতীদের দৈনন্দিন গুণাবলী।',
    duration: 1020,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
    fileSizeMb: 13.9,
    playCount: 19800,
    publishDate: '০৬ সেপ্টেম্বর, ২০২৬'
  },

  // Sheikh Sanaullah Nazir Ahmad
  {
    id: 'aud-sna-1',
    title: 'ইসলামের সোনালী ইতিহাস ও আধুনিক মুসলিমের দায়িত্ব',
    speakerId: 'spk-sanaullah-nazir-ahmad',
    speakerName: 'শাইখ সানাউল্লাহ নজির আহমদ',
    speakerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    category: 'সীরাতুন্নবী (সা:) ও সাহাবা',
    description: 'সাহাবীদের ত্যাগ ও কুরবানির ইতিহাস থেকে শিক্ষা নিয়ে আমাদের চলার পথ।',
    duration: 940,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 12.6,
    playCount: 16400,
    publishDate: '০৩ সেপ্টেম্বর, ২০২৬'
  },

  // Dr. Khandaker Abdullah Jahangir
  {
    id: 'aud-5',
    title: 'সহীহ হাদিসের আলোকে তাওহীদ ও শিরক বর্জনের গুরুত্ব',
    speakerId: 'spk-3',
    speakerName: 'ড. খোন্দকার আব্দুল্লাহ জাহাঙ্গীর',
    speakerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    category: 'ঈমান ও আকীদা',
    description: 'ঈমানের বিশুদ্ধতা ও দৈনন্দিন জীবনে অজান্তেই ঘটে যাওয়া শিরক থেকে আত্মরক্ষার উপায় নিয়ে প্রামাণ্য আলোচনা।',
    duration: 1120,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 15.4,
    playCount: 16400,
    publishDate: '০৮ সেপ্টেম্বর, ২০২৬',
    isFeatured: false,
    seriesName: 'রাহে বেলায়াত সিরিজ'
  },

  {
    id: 'aud-quran-2',
    title: 'সূরা আল-মুলক - কবরের আযাব থেকে সুরক্ষার তাফসীর',
    speakerId: 'spk-asadullah-al-ghalib',
    speakerName: 'ড. আসাদুল্লাহ আল গালিব',
    speakerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    category: 'কুরআন তিলাওয়াত ও অর্থ',
    description: 'প্রতিরাতে সূরা আল-মুলক পাঠের ফযিলত ও আখেরাতের বিচার দিবসের বর্ণনা।',
    duration: 860,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/036.mp3',
    fileSizeMb: 11.8,
    playCount: 29800,
    publishDate: '০৯ সেপ্টেম্বর, ২০২৬',
    isFeatured: true
  },

  {
    id: 'aud-seerah-1',
    title: 'রাসূলুল্লাহ (সা:)-এর ক্ষমা ও মহানুভবতার অনন্য দৃষ্টান্ত',
    speakerId: 'spk-abdullah-faruq',
    speakerName: 'অধ্যাপক ড. আব্দুল্লাহ ফারুক',
    speakerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    category: 'সীরাতুন্নবী (সা:) ও সাহাবা',
    description: 'মক্কা বিজয়ের দিনে রাসুলুল্লাহর অনুপম চরিত্র ও আমাদের ব্যক্তিগত জীবনে ক্ষমার অনুশীলন।',
    duration: 940,
    audioUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    fileSizeMb: 12.9,
    playCount: 18700,
    publishDate: '০১ সেপ্টেম্বর, ২০২৬'
  }
];

export const OTHER_APPS_DATA = [
  {
    name: 'আল-কুরআনুল কারীম বাংলা',
    desc: 'পূর্ণাঙ্গ কুরআন অডিও, তাফসীর ও অনুবাদ',
    icon: 'BookOpen',
    rating: '4.9 ★',
    downloads: '১ মিলিয়নের বেশি'
  },
  {
    name: 'সহীহ হাদিস সম্ভার',
    desc: 'বুখারী, মুসলিম, তিরমিযী সহ ৬টি কিতাব',
    icon: 'Layers',
    rating: '4.8 ★',
    downloads: '৫০০ হাজার+'
  },
  {
    name: 'হিসনুল মুসলিম (দোয়ার ভাণ্ডার)',
    desc: 'দৈনন্দিন জীবনের সহীহ দোয়া ও আমল',
    icon: 'Heart',
    rating: '4.9 ★',
    downloads: '৮০০ হাজার+'
  },
  {
    name: 'নামাজের সময় ও কিবলা কম্পাস',
    desc: 'সঠিক নামাজের সময় ও আজান নোটিফিকেশন',
    icon: 'Compass',
    rating: '4.7 ★',
    downloads: '২ মিলিয়নের বেশি'
  }
];
