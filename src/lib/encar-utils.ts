/**
 * Build Encar CDN image URL for high-res carousel (rh=1920)
 * @param photoPath - Raw photo path from API (e.g., "carpicture04/pic4114/41148093_" or full URL)
 * @returns Full CDN URL with high-res image processing parameters and watermark
 */
export function buildEncarImageUrlHighRes(photoPath: string): string {
  if (!photoPath) return '';
  if (photoPath.startsWith('http') && photoPath.includes('?')) {
    return photoPath;
  }
  let cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
  if (!cleanPath.includes('.jpg') && !cleanPath.includes('.png')) {
    cleanPath = `${cleanPath}001.jpg`;
  }
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `https://ci.encar.com/${cleanPath}?impolicy=heightRate&rh=1920&cw=3200&ch=1920&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&wtmkg=SouthEast&wtmkw=70&wtmkh=30&t=${timestamp}`;
}
/**
 * Korean to English translation map for car models and terms
 * Words are sorted by usage - compound words first, then individual words
 */
const koreanToEnglish: Record<string, string> = {

  '시리즈': 'Series',
  '클래스': 'Class',
  '뉴': 'New',
  '더': 'The',
  '올': 'All',
  '그란': 'Gran',
  '투리스모': 'Turismo',
  '그란쿠페': 'Gran Coupe',
  '그란투리스모': 'Gran Turismo',
  '쿠페': 'Coupe',
  '쿠폐': 'Coupe',
  '컨버터블': 'Convertible',
  '카브리올레': 'Cabriolet',
  '카브리올렛': 'Cabriolet',
  '로드스터': 'Roadster',
  '세단': 'Sedan',
  '왜건': 'Wagon',
  '투어링': 'Touring',
  '해치백': 'Hatchback',
  '리무진': 'Limousine',
  '숏바디': 'Short Body',
  '롱바디': 'Long Body',
  '스포츠백': 'Sportback',
  '아반트': 'Avant',
  '올로드': 'Allroad',
  '콰트로': 'Quattro',
  '이트론': 'e-tron',
  '슈팅브레이크': 'Shooting Brake',
  '올테레인': 'All-Terrain',
  '크로스컨트리': 'Cross Country',
  
  // === TRIM/VARIANT WORDS ===
  '프리미엄': 'Premium',
  '럭셔리': 'Luxury',
  '익스클루시브': 'Exclusive',
  '아방가르드': 'Avantgarde',
  '스탠다드': 'Standard',
  '컴포트': 'Comfort',
  '엘레강스': 'Elegance',
  '어반': 'Urban',
  '스포츠': 'Sport',
  '스포츠라인': 'Sport Line',
  '엠스포츠': 'M Sport',
  '에스라인': 'S Line',
  '알라인': 'R-Line',
  '인스크립션': 'Inscription',
  '모멘텀': 'Momentum',
  '리차지': 'Recharge',
  '플러스': 'Plus',
  '프로': 'Pro',
  '에디션': 'Edition',
  '리미티드': 'Limited',
  '스페셜': 'Special',
  '퍼스트': 'First',
  '라인': 'Line',
  '패키지': 'Package',
  '옵션': 'Option',
  '풀옵션': 'Full Option',
  '하이라인': 'Highline',
  '컴포트라인': 'Comfortline',
  '트렌드라인': 'Trendline',
  '퍼포먼스': 'Performance',
  '다이나믹': 'Dynamic',
  '디자인': 'Design',
  '어드밴스드': 'Advanced',
  '시그니처': 'Signature',
  '프레스티지': 'Prestige',
  '울트라': 'Ultra',
  
  // === DRIVETRAIN ===
  '사륜구동': '4WD',
  '사륜': '4WD',
  '후륜구동': 'RWD',
  '후륜': 'RWD',
  '전륜구동': 'FWD',
  '전륜': 'FWD',
  '엑스드라이브': 'xDrive',
  '포매틱': '4MATIC',
  '포모션': '4Motion',
  '이드라이브': 'eDrive',
  
  // === BODY/SIZE ===
  '롱': 'Long',
  '숏': 'Short',
  '롱휠베이스': 'Long Wheelbase',
  '숏휠베이스': 'Short Wheelbase',
  '익스텐디드': 'Extended',
  '컴팩트': 'Compact',
  '그랜드': 'Grand',
  
  // === HYBRID/ELECTRIC ===
  '하이브리드': 'Hybrid',
  '플러그인하이브리드': 'Plug-in Hybrid',
  '플러그인': 'Plug-in',
  '액티브하이브리드': 'ActiveHybrid',
  '일렉트릭': 'Electric',
  '전기': 'Electric',
  
  // === PERFORMANCE ===
  '터보': 'Turbo',
  '슈퍼차저': 'Supercharged',
  '트윈터보': 'Twin Turbo',
  '바이터보': 'Biturbo',
  '컴프레서': 'Kompressor',
  '블루텍': 'BlueTEC',
  '블루모션': 'BlueMotion',
  '티에스아이': 'TSI',
  '티디아이': 'TDI',
  '씨디아이': 'CDI',
  '지티에스': 'GTS',
  '에스': 'S',
  '알에스': 'RS',
  '엠': 'M',
  '에이엠지': 'AMG',
  '폴스타': 'Polestar',
  '에프스포츠': 'F Sport',
  
  // === BMW MODELS ===
  '1시리즈': '1 Series',
  '2시리즈': '2 Series',
  '3시리즈': '3 Series',
  '4시리즈': '4 Series',
  '5시리즈': '5 Series',
  '6시리즈': '6 Series',
  '7시리즈': '7 Series',
  '8시리즈': '8 Series',
  '액티브투어러': 'Active Tourer',
  '그란투어러': 'Gran Tourer',
  
  // === MERCEDES-BENZ MODELS ===
  'A-클래스': 'A-Class',
  'B-클래스': 'B-Class',
  'C-클래스': 'C-Class',
  'E-클래스': 'E-Class',
  'S-클래스': 'S-Class',
  'G-클래스': 'G-Class',
  'V-클래스': 'V-Class',
  'A클래스': 'A-Class',
  'B클래스': 'B-Class',
  'C클래스': 'C-Class',
  'CLA클래스': 'CLA-Class',
  'CLK클래스': 'CLK-Class',
  'CLS클래스': 'CLS-Class',
  'E클래스': 'E-Class',
  'S클래스': 'S-Class',
  'G클래스': 'G-Class',
  'V클래스': 'V-Class',
  'SL클래스': 'SL-Class',
  'SLC클래스': 'SLC-Class',
  'SLK클래스': 'SLK-Class',
  '마이바흐': 'Maybach',
  
  // === PORSCHE MODELS ===
  '박스터': 'Boxster',
  '카이맨': 'Cayman',
  '카이엔': 'Cayenne',
  '마칸': 'Macan',
  '파나메라': 'Panamera',
  '타이칸': 'Taycan',
  '카레라': 'Carrera',
  
  // === LAND ROVER MODELS ===
  '레인지로버스포츠': 'Range Rover Sport',
  '레인지로버벨라': 'Range Rover Velar',
  '레인지로버이보크': 'Range Rover Evoque',
  '레인지로버': 'Range Rover',
  '디스커버리스포츠': 'Discovery Sport',
  '디스커버리': 'Discovery',
  '디펜더': 'Defender',
  '프리랜더': 'Freelander',
  '벨라': 'Velar',
  '이보크': 'Evoque',
  '오토바이오그래피': 'Autobiography',
  
  // === VOLKSWAGEN MODELS ===
  '골프': 'Golf',
  '제타': 'Jetta',
  '파사트': 'Passat',
  '티구안': 'Tiguan',
  '투아렉': 'Touareg',
  '아테온': 'Arteon',
  '폴로': 'Polo',
  '투란': 'Touran',
  '샤란': 'Sharan',
  '티록': 'T-Roc',
  '아이디': 'ID',
  '비틀': 'Beetle',
  '더비틀': 'The Beetle',
  '뉴비틀': 'New Beetle',
  '시로코': 'Scirocco',
  '페이톤': 'Phaeton',
  
  // === AUDI MODELS ===
  'A1': 'A1',
  'A3': 'A3',
  'A4': 'A4',
  'A5': 'A5',
  'A6': 'A6',
  'A7': 'A7',
  'A8': 'A8',
  'Q2': 'Q2',
  'Q3': 'Q3',
  'Q4': 'Q4',
  'Q5': 'Q5',
  'Q7': 'Q7',
  'Q8': 'Q8',
  'TT': 'TT',
  'R8': 'R8',
  'e-tron': 'e-tron',
  
  // === HYUNDAI MODELS ===
  '소나타': 'Sonata',
  '그랜저': 'Grandeur',
  '아반떼': 'Avante',
  '엘란트라': 'Elantra',
  '투싼': 'Tucson',
  '싼타페': 'Santa Fe',
  '팰리세이드': 'Palisade',
  '코나': 'Kona',
  '베뉴': 'Venue',
  '벨로스터': 'Veloster',
  '아이오닉': 'Ioniq',
  '넥쏘': 'Nexo',
  '스타리아': 'Staria',
  '스타렉스': 'Starex',
  '캐스퍼': 'Casper',
  '아슬란': 'Aslan',
  '에쿠스': 'Equus',
  '센테니얼': 'Centennial',
  '제네시스쿠페': 'Genesis Coupe',
  
  // === KIA MODELS ===
  'K3': 'K3',
  'K5': 'K5',
  'K7': 'K7',
  'K8': 'K8',
  'K9': 'K9',
  '스팅어': 'Stinger',
  '쏘렌토': 'Sorento',
  '스포티지': 'Sportage',
  '셀토스': 'Seltos',
  '니로': 'Niro',
  '카니발': 'Carnival',
  '모하비': 'Mohave',
  'EV6': 'EV6',
  'EV9': 'EV9',
  '레이': 'Ray',
  '모닝': 'Morning',
  '쏘울': 'Soul',
  '옵티마': 'Optima',
  '카덴자': 'Cadenza',
  '포르테': 'Forte',
  '씨드': 'Ceed',
  '프로씨드': 'ProCeed',
  '스토닉': 'Stonic',
  '텔루라이드': 'Telluride',
  
  // === GENESIS MODELS ===
  '제네시스': 'Genesis',
  'G70': 'G70',
  'G80': 'G80',
  'G90': 'G90',
  'GV60': 'GV60',
  'GV70': 'GV70',
  'GV80': 'GV80',
  
  // === SSANGYONG MODELS ===
  '렉스턴': 'Rexton',
  '토레스': 'Torres',
  '코란도': 'Korando',
  '티볼리': 'Tivoli',
  '무쏘': 'Musso',
  '액티언': 'Actyon',
  '카이런': 'Kyron',
  '로디우스': 'Rodius',
  '체어맨': 'Chairman',
  
  // === CHEVROLET MODELS ===
  '트레일블레이저': 'Trailblazer',
  '이쿼녹스': 'Equinox',
  '트래버스': 'Traverse',
  '타호': 'Tahoe',
  '콜로라도': 'Colorado',
  '말리부': 'Malibu',
  '스파크': 'Spark',
  '트랙스': 'Trax',
  '볼트': 'Bolt',
  '임팔라': 'Impala',
  '카마로': 'Camaro',
  '콜벳': 'Corvette',
  '크루즈': 'Cruze',
  '캡티바': 'Captiva',
  '올란도': 'Orlando',
  
  // === RENAULT/SAMSUNG MODELS ===
  'SM3': 'SM3',
  'SM5': 'SM5',
  'SM6': 'SM6',
  'SM7': 'SM7',
  'QM3': 'QM3',
  'QM5': 'QM5',
  'QM6': 'QM6',
  'XM3': 'XM3',
  '클리오': 'Clio',
  '캡처': 'Captur',
  '아르카나': 'Arkana',
  '메간': 'Megane',
  '탈리스만': 'Talisman',
  
  // === JAGUAR MODELS ===
  'F타입': 'F-Type',
  'F페이스': 'F-Pace',
  'E페이스': 'E-Pace',
  'I페이스': 'I-Pace',
  
  // === MASERATI MODELS ===
  '기블리': 'Ghibli',
  '콰트로포르테': 'Quattroporte',
  '르반떼': 'Levante',
  '그란카브리오': 'GranCabrio',
  
  // === BENTLEY MODELS ===
  '컨티넨탈': 'Continental',
  '플라잉스퍼': 'Flying Spur',
  '벤테이가': 'Bentayga',
  '뮬산': 'Mulsanne',
  
  // === ROLLS-ROYCE MODELS ===
  '팬텀': 'Phantom',
  '고스트': 'Ghost',
  '레이스': 'Wraith',
  '던': 'Dawn',
  '컬리넌': 'Cullinan',
  
  // === FERRARI MODELS ===
  '포르토피노': 'Portofino',
  '로마': 'Roma',
  '푸로산게': 'Purosangue',
  
  // === LAMBORGHINI MODELS ===
  '우라칸': 'Huracan',
  '아벤타도르': 'Aventador',
  '우루스': 'Urus',
  
  // === MINI MODELS ===
  '쿠퍼': 'Cooper',
  '클럽맨': 'Clubman',
  '컨트리맨': 'Countryman',
  '페이스맨': 'Paceman',
  '3도어': '3 Door',
  '5도어': '5 Door',
  
  // === TOYOTA MODELS ===
  '캠리': 'Camry',
  '아발론': 'Avalon',
  '코롤라': 'Corolla',
  '프리우스': 'Prius',
  '라브4': 'RAV4',
  '하이랜더': 'Highlander',
  '포러너': '4Runner',
  '랜드크루저': 'Land Cruiser',
  '시에나': 'Sienna',
  '수프라': 'Supra',
  '크라운': 'Crown',
  
  // === HONDA MODELS ===
  '어코드': 'Accord',
  '시빅': 'Civic',
  'CR-V': 'CR-V',
  '파일럿': 'Pilot',
  '오딧세이': 'Odyssey',
  '인사이트': 'Insight',
  'HR-V': 'HR-V',
  '피트': 'Fit',
  '재즈': 'Jazz',
  
  // === FUEL TYPES ===
  '가솔린': 'Gasoline',
  '디젤': 'Diesel',
  'LPG': 'LPG',
  '가솔린+전기': 'Hybrid',
  '디젤+전기': 'Diesel Hybrid',
  '가솔린+LPG': 'Gasoline+LPG',
  '수소': 'Hydrogen',
  
  // === TRANSMISSION ===
  '오토': 'Automatic',
  '자동': 'Automatic',
  '수동': 'Manual',
  '세미오토': 'Semi-Auto',
  'CVT': 'CVT',
};

/**
 * Translate Korean car terms to English
 * @param text - Korean text to translate
 * @returns Translated English text
 */
export function translateKoreanToEnglish(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(koreanToEnglish).sort((a, b) => b.length - a.length);
  
  for (const korean of sortedKeys) {
    const english = koreanToEnglish[korean];
    result = result.replace(new RegExp(korean, 'g'), english);
  }
  
  return result.trim();
}

/**
 * Build Encar CDN image URL from photo path
 * @param photoPath - Raw photo path from API (e.g., "carpicture04/pic4114/41148093_" or full URL)
 * @returns Full CDN URL with image processing parameters and watermark
 */
export function buildEncarImageUrl(photoPath: string): string {
  if (!photoPath) return '';
  
  // If it's already a full URL with parameters, return as is
  if (photoPath.startsWith('http') && photoPath.includes('?')) {
    return photoPath;
  }
  
  // Clean the path - remove leading slash if present
  let cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
  
  // Add _001.jpg suffix if not present
  if (!cleanPath.includes('.jpg') && !cleanPath.includes('.png')) {
    cleanPath = `${cleanPath}001.jpg`;
  }
  
  // Build CDN URL with image processing parameters and watermark
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `https://ci.encar.com/${cleanPath}?impolicy=heightRate&rh=192&cw=320&ch=192&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&wtmkg=SouthEast&wtmkw=70&wtmkh=30&t=${timestamp}`;
}
