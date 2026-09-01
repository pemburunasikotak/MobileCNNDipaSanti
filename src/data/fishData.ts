export interface NutritionValue {
  label: string;
  value: string;
  percentage: number; // For progress bar (0 - 100)
  color: string;
}

export interface FishNutrition {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  tips: string;
  nutrients: NutritionValue[];
  calories: string;
  protein: string;
  omega3: string;
}

export const fishDatabase: Record<string, FishNutrition> = {
  salmon: {
    id: 'salmon',
    name: 'Ikan Salmon',
    scientificName: 'Salmo salar',
    description: 'Salmon terkenal sebagai sumber asam lemak omega-3 yang sangat kaya, protein berkualitas tinggi, serta berbagai vitamin dan mineral yang penting untuk menjaga kesehatan jantung dan fungsi otak.',
    benefits: [
      'Mendukung kesehatan fungsi otak dan memori',
      'Mengurangi risiko penyakit jantung koroner',
      'Menjaga kesehatan mata dan mencegah degenerasi makula',
      'Sumber antioksidan astaxanthin yang baik untuk kulit'
    ],
    tips: 'Paling baik disajikan dengan cara dipanggang (grilled) atau dikukus sebentar agar kandungan lemak baik omega-3 tidak rusak karena suhu yang terlalu panas.',
    calories: '208 kkal',
    protein: '22g',
    omega3: '2.5g',
    nutrients: [
      { label: 'Protein', value: '22g', percentage: 44, color: '#3b82f6' },
      { label: 'Omega-3', value: '2.5g', percentage: 95, color: '#10b981' },
      { label: 'Lemak Sehat', value: '13g', percentage: 20, color: '#f59e0b' },
      { label: 'Vitamin D', value: '12mcg', percentage: 80, color: '#ec4899' },
      { label: 'Kalsium', value: '15mg', percentage: 2, color: '#8b5cf6' }
    ]
  },
  tuna: {
    id: 'tuna',
    name: 'Ikan Tuna',
    scientificName: 'Thunnus',
    description: 'Tuna merupakan jenis ikan laut dengan kandungan protein yang sangat tinggi namun sangat rendah lemak. Sangat populer di kalangan olahragawan untuk membangun otot.',
    benefits: [
      'Membantu pembentukan otot tubuh secara maksimal',
      'Meningkatkan metabolisme tubuh',
      'Kaya zat besi untuk mencegah anemia',
      'Mengandung kalium untuk mengatur tekanan darah'
    ],
    tips: 'Tuna sangat cepat matang. Masak dengan teknik pan-sear (setengah matang di bagian tengah jika tuna segar kualitas sashimi) agar tetap juicy.',
    calories: '130 kkal',
    protein: '28g',
    omega3: '0.5g',
    nutrients: [
      { label: 'Protein', value: '28g', percentage: 56, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.5g', percentage: 20, color: '#10b981' },
      { label: 'Lemak Baik', value: '0.6g', percentage: 1, color: '#f59e0b' },
      { label: 'Zat Besi', value: '1.2mg', percentage: 10, color: '#ec4899' },
      { label: 'Vitamin B12', value: '2.2mcg', percentage: 90, color: '#8b5cf6' }
    ]
  },
  gurame: {
    id: 'gurame',
    name: 'Ikan Gurame',
    scientificName: 'Osphronemus goramy',
    description: 'Gurame adalah ikan air tawar favorit di Indonesia karena tekstur dagingnya yang padat, empuk, dan rasanya yang gurih lezat serta kaya akan protein dan asam amino esensial.',
    benefits: [
      'Membantu pertumbuhan anak karena protein tinggi',
      'Mempercepat penyembuhan luka pasca operasi',
      'Menjaga sistem imun dengan asam amino lengkap',
      'Mudah dicerna oleh anak-anak maupun lansia'
    ],
    tips: 'Lezat jika diolah dengan cara dibakar bumbu madu atau dibuat sup bening kemangi agar rendah kolesterol.',
    calories: '125 kkal',
    protein: '19g',
    omega3: '0.2g',
    nutrients: [
      { label: 'Protein', value: '19g', percentage: 38, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.2g', percentage: 8, color: '#10b981' },
      { label: 'Lemak', value: '5.5g', percentage: 8, color: '#f59e0b' },
      { label: 'Fosfor', value: '150mg', percentage: 21, color: '#ec4899' },
      { label: 'Kalsium', value: '41mg', percentage: 4, color: '#8b5cf6' }
    ]
  },
  nila: {
    id: 'nila',
    name: 'Ikan Nila',
    scientificName: 'Oreochromis niloticus',
    description: 'Nila adalah ikan air tawar yang ekonomis, mudah didapat, dan sangat sehat karena tinggi selenium, fosfor, serta potasium untuk menjaga kepadatan tulang.',
    benefits: [
      'Bagus untuk kesehatan tulang dan gigi',
      'Kandungan selenium mencegah kanker dan menunda penuaan',
      'Rendah kalori, cocok untuk menu diet',
      'Menyuplai kebutuhan protein harian dengan harga bersahabat'
    ],
    tips: 'Masak dengan cara dibakar dengan olesan kecap ketumbar, atau ditim dengan jahe dan bawang putih.',
    calories: '128 kkal',
    protein: '20g',
    omega3: '0.15g',
    nutrients: [
      { label: 'Protein', value: '20g', percentage: 40, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.15g', percentage: 6, color: '#10b981' },
      { label: 'Lemak', value: '2.7g', percentage: 4, color: '#f59e0b' },
      { label: 'Selenium', value: '42mcg', percentage: 60, color: '#ec4899' },
      { label: 'Fosfor', value: '170mg', percentage: 24, color: '#8b5cf6' }
    ]
  },
  lele: {
    id: 'lele',
    name: 'Ikan Lele',
    scientificName: 'Clarias',
    description: 'Lele merupakan sumber protein hewani yang sangat tinggi dan murah. Lele juga kaya akan vitamin B12 yang sangat melimpah untuk menunjang sistem saraf.',
    benefits: [
      'Menjaga kesehatan sel saraf otak',
      'Membantu memproduksi sel darah merah (B12)',
      'Sumber protein yang mudah diserap tubuh',
      'Rasio nutrisi per harga yang sangat baik'
    ],
    tips: 'Hindari menggoreng lele dengan minyak bekas (deep-fry berulang-ulang) agar tidak menambah kadar lemak jenuh tinggi. Sebaiknya gunakan air fryer atau bumbu kuning kukus.',
    calories: '105 kkal',
    protein: '18g',
    omega3: '0.3g',
    nutrients: [
      { label: 'Protein', value: '18g', percentage: 36, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.3g', percentage: 12, color: '#10b981' },
      { label: 'Lemak', value: '2.9g', percentage: 4, color: '#f59e0b' },
      { label: 'Vitamin B12', value: '2.9mcg', percentage: 120, color: '#ec4899' },
      { label: 'Natrium', value: '60mg', percentage: 3, color: '#8b5cf6' }
    ]
  },
  kembung: {
    id: 'kembung',
    name: 'Ikan Kembung',
    scientificName: 'Rastrelliger',
    description: 'Ikan Kembung adalah superfood lokal asli Indonesia! Kandungan omega-3 di dalam ikan kembung terbukti bahkan lebih tinggi dibandingkan ikan salmon impor dengan harga jauh lebih terjangkau.',
    benefits: [
      'Mengandung Omega-3 super tinggi untuk jantung dan otak',
      'Meningkatkan daya tahan tubuh dan kecerdasan anak',
      'Sumber vitamin D alami yang melimpah',
      'Membantu menstabilkan tekanan darah'
    ],
    tips: 'Sangat nikmat dimasak bumbu pesmol khas Sunda atau dipanggang teflon dengan lumuran air jeruk nipis dan garam.',
    calories: '167 kkal',
    protein: '21.4g',
    omega3: '2.6g',
    nutrients: [
      { label: 'Protein', value: '21.4g', percentage: 43, color: '#3b82f6' },
      { label: 'Omega-3', value: '2.6g', percentage: 100, color: '#10b981' },
      { label: 'Lemak Sehat', value: '9g', percentage: 14, color: '#f59e0b' },
      { label: 'Kalsium', value: '136mg', percentage: 14, color: '#ec4899' },
      { label: 'Zat Besi', value: '1.9mg', percentage: 16, color: '#8b5cf6' }
    ]
  },
  gerabah: {
    id: 'gerabah',
    name: 'Ikan Gerabah',
    scientificName: 'Epinephelus spp',
    description: 'Ikan Gerabah memiliki daging yang tebal dan kaya akan protein. Sangat baik untuk pemulihan tubuh dan pembentukan sel-sel baru.',
    benefits: [
      'Mempercepat penyembuhan luka',
      'Membantu pembentukan masa otot',
      'Menjaga sistem kekebalan tubuh',
      'Kaya akan kolagen untuk kesehatan kulit'
    ],
    tips: 'Sangat nikmat jika dimasak dengan cara dikukus (tim) atau sup bening untuk menjaga kualitas proteinnya.',
    calories: '118 kkal',
    protein: '24.8g',
    omega3: '0.4g',
    nutrients: [
      { label: 'Protein', value: '24.8g', percentage: 50, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.4g', percentage: 16, color: '#10b981' },
      { label: 'Lemak', value: '1.2g', percentage: 2, color: '#f59e0b' },
      { label: 'Kalsium', value: '27mg', percentage: 3, color: '#ec4899' },
      { label: 'Zat Besi', value: '0.9mg', percentage: 5, color: '#8b5cf6' }
    ]
  },
  kuniran: {
    id: 'kuniran',
    name: 'Ikan Kuniran',
    scientificName: 'Upeneus sulphureus',
    description: 'Ikan Kuniran atau Goatfish dikenal dengan rasanya yang gurih dan daging yang lembut. Merupakan sumber protein dan mineral yang baik.',
    benefits: [
      'Menjaga kesehatan tulang dan gigi',
      'Mencegah anemia karena kandungan zat besi',
      'Membantu perkembangan otak',
      'Menjaga kesehatan jantung'
    ],
    tips: 'Cocok untuk digoreng kering atau dijadikan ikan bakar dengan bumbu kuning kaya rempah.',
    calories: '105 kkal',
    protein: '19.5g',
    omega3: '0.3g',
    nutrients: [
      { label: 'Protein', value: '19.5g', percentage: 39, color: '#3b82f6' },
      { label: 'Omega-3', value: '0.3g', percentage: 12, color: '#10b981' },
      { label: 'Lemak', value: '2.1g', percentage: 3, color: '#f59e0b' },
      { label: 'Fosfor', value: '150mg', percentage: 15, color: '#ec4899' },
      { label: 'Kalsium', value: '45mg', percentage: 5, color: '#8b5cf6' }
    ]
  }
};

export const defaultFish: FishNutrition = {
  id: 'unknown',
  name: 'Ikan Laut Segar',
  scientificName: 'Pisces',
  description: 'Ikan laut segar merupakan sumber protein berkualitas tinggi yang mudah dicerna, rendah lemak jenuh, dan kaya asam lemak esensial untuk metabolisme tubuh.',
  benefits: [
    'Menyediakan protein pembangun jaringan tubuh',
    'Mengandung vitamin dan mineral esensial',
    'Menjaga metabolisme tubuh tetap aktif'
  ],
  tips: 'Masak dengan cara dikukus, dibakar, atau ditim dengan rempah segar untuk menjaga kualitas nutrisi terbaik.',
  calories: '120 kkal',
  protein: '18g',
  omega3: '0.4g',
  nutrients: [
    { label: 'Protein', value: '18g', percentage: 36, color: '#3b82f6' },
    { label: 'Omega-3', value: '0.4g', percentage: 16, color: '#10b981' },
    { label: 'Lemak', value: '3g', percentage: 5, color: '#f59e0b' },
    { label: 'Mineral', value: '1.2g', percentage: 12, color: '#ec4899' }
  ]
};

export function getFishNutrition(nameOrId: string): FishNutrition {
  const normalized = nameOrId.toLowerCase();
  
  // Try direct match
  if (fishDatabase[normalized]) {
    return fishDatabase[normalized];
  }
  
  // Try partial match
  for (const key of Object.keys(fishDatabase)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return fishDatabase[key];
    }
  }
  
  return {
    ...defaultFish,
    name: nameOrId.charAt(0).toUpperCase() + nameOrId.slice(1)
  };
}
