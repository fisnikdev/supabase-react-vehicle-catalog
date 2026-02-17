import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EncarSearchResult {
  Id: string;
  Model: string;
  Badge: string;
  BadgeDetail: string;
  Year: number;
  Price: number;
  Mileage: number;
  Displacement: number;
  Photo: string;
  FuelType: string;
  Transmission: string;
}



const STATIC_MODELS: Record<string, string[]> = {

  "BMW": [
    "1 Series", "2 Series", "3 Series", "3 Series GT", "4 Series", 
    "5 Series", "5 Series GT", "6 Series", "6 Series GT", "7 Series", "8 Series",
    "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "XM",
    "Z4", "M2", "M3", "M4", "M5", "M8",
    "i3", "i4", "i5", "i7", "i8", "iX", "iX1", "iX3"
  ],
  "Mercedes-Benz": [
    "A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "Maybach S-Class",
    "CLA-Class", "CLS-Class", "CLE-Class", "CLK-Class", "CL-Class",
    "GLA-Class", "GLB-Class", "GLC-Class", "GLE-Class", "GLS-Class", "G-Class", "GL-Class", "GLK-Class",
    "SL-Class", "SLC-Class", "SLK-Class", "AMG GT", "SLS AMG",
    "EQA", "EQB", "EQC", "EQE", "EQS", "EQS SUV", "EQE SUV", "EQV"
  ],
  "Audi": [
    "A1", "A3", "A4", "A5", "A6", "A7", "A8",
    "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ8",
    "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "RS e-tron GT",
    "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8",
    "TT", "R8", "e-tron", "e-tron GT", "e-tron Sportback"
  ],
  "Volkswagen": [
    "Golf", "Polo", "Passat", "Arteon", "Jetta", "Beetle", "Scirocco", "Phaeton",
    "Tiguan", "Touareg", "T-Roc", "T-Cross", "ID.3", "ID.4", "ID.5", "ID.Buzz"
  ],
  "Porsche": [
    "911", "Boxster", "Cayman", "718 Boxster", "718 Cayman",
    "Cayenne", "Cayenne Coupe", "Macan", "Panamera", "Taycan"
  ],
  "Land Rover": [
    "Discovery", "Discovery Sport", "Defender", "Freelander",
    "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar"
  ],
  "Tesla": [
    "Model S", "Model 3", "Model X", "Model Y", "Cybertruck"
  ],
  "Volvo": [
    "S60", "S80", "S90", "V40", "V60", "V90", 
    "XC40", "XC60", "XC70", "XC90", "C30", "C40", "EX30", "EX90"
  ],
  "MINI": [
    "Hatch", "Clubman", "Countryman", "Convertible", "Paceman", "Roadster", "Coupe"
  ],
  "Ford": [
    "Mustang", "Explorer", "Bronco", "Ranger", "Mondeo", "Taurus", "F-150", "Expedition", "Maverick"
  ],
  "Jeep": [
    "Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"
  ],
  "Hyundai": [
    "Avante", "Sonata", "Grandeur", "Tucson", "Santa Fe", "Palisade", 
    "Ioniq 5", "Ioniq 6", "Casper", "Venue", "Kona", "Staria", "Nexo"
  ],
  "Kia": [
    "K3", "K5", "K8", "K9", "Sportage", "Sorento", "Carnival", "Mohave", 
    "EV6", "EV9", "Niro", "Seltos", "Ray", "Morning"
  ],
  "Genesis": [
    "G70", "G80", "G90", "GV60", "GV70", "GV80"
  ],
  "Toyota": ["Camry", "Prius", "RAV4", "Sienna", "Supra", "GR86", "Avalon", "Crown", "Highlander"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Odyssey", "HR-V"],
  "Lexus": ["ES", "LS", "IS", "NX", "RX", "UX", "LC", "RC", "GX", "LX"],
  "Bentley": ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne"],
  "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan"],
  "Lamborghini": ["Aventador", "Huracan", "Urus", "Gallardo", "Murcielago", "Revuelto"],
  "Ferrari": ["488", "F8", "Roma", "Portofino", "812", "SF90", "296", "California"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "Grecale", "GranTurismo", "MC20"],


  "Jaguar": ["XE", "XF", "XJ", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  "Aston Martin": ["DB11", "DBS", "Vantage", "DBX", "Vanquish"],
  "McLaren": ["720S", "570S", "GT", "Artura", "P1"],
  "Lotus": ["Emira", "Evija", "Eletre"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C"],
  "Fiat": ["500", "500X", "Panda"],
  "Chevrolet": ["Camaro", "Corvette", "Tahoe", "Suburban", "Silverado", "Colorado", "Trax", "Trailblazer"],
  "Cadillac": ["Escalade", "CT4", "CT5", "XT4", "XT5", "XT6", "Lyriq"],
  "Lincoln": ["Navigator", "Aviator", "Corsair", "Nautilus"],
  "Dodge": ["Challenger", "Charger", "Durango", "Ram"],
  "GMC": ["Sierra", "Yukon", "Canyon", "Hummer EV"],
  "Chrysler": ["300", "Pacifica"],
  "Rivian": ["R1T", "R1S"],
  "Lucid": ["Air", "Gravity"],
  "Nissan": ["Altima", "Sentra", "GT-R", "Z", "Leaf", "Pathfinder", "Rogue"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
  "Mazda": ["Mazda3", "Mazda6", "CX-30", "CX-5", "CX-9", "MX-5 Miata"],
  "Subaru": ["Impreza", "WRX", "Outback", "Forester", "Crosstrek", "BRZ"],
  "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage"],
  "Suzuki": ["Jimny", "Swift", "Vitara"],
  "Acura": ["Integra", "TLX", "RDX", "MDX"],
  "SsangYong": ["Tivoli", "Korando", "Rexton", "Torres", "Musso"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008"],
  "Renault": ["Clio", "Megane", "Captur", "Arkana", "Austral", "QM6", "XM3"],
  "Citroën": ["C3", "C4", "C5 Aircross"],
  "Polestar": ["Polestar 2", "Polestar 3", "Polestar 4"],
  "BYD": ["Seal", "Dolphin", "Atto 3", "Han"],
  "Geely": ["Monjaro", "Coolray", "Emgrand"]
};

// 2. ENGLISH -> KOREAN MAPPING (Query Logic)
const EN_KO: Record<string, string> = {
  // === BRANDS ===
  "BMW": "BMW", "Mercedes-Benz": "벤츠", "Audi": "아우디", "Volkswagen": "폭스바겐",
  "Porsche": "포르쉐", "Land Rover": "랜드로버", "Tesla": "테슬라", "Volvo": "볼보",
  "MINI": "미니", "Ford": "포드", "Jeep": "지프", 
  "Hyundai": "현대", "Kia": "기아", "Genesis": "제네시스",
  "Toyota": "도요타", "Honda": "혼다", "Lexus": "렉서스", "Bentley": "벤틀리",
  "Rolls-Royce": "롤스로이스", "Lamborghini": "람보르기니", "Ferrari": "페라리", "Maserati": "마세라티",

 
  "1 Series": "1시리즈", "2 Series": "2시리즈", "3 Series": "3시리즈", "4 Series": "4시리즈",
  "5 Series": "5시리즈", "6 Series": "6시리즈", "7 Series": "7시리즈", "8 Series": "8시리즈",
  "3 Series GT": "3시리즈 GT", "5 Series GT": "5시리즈 GT", "6 Series GT": "6시리즈 GT",
  "X1": "X1", "X2": "X2", "X3": "X3", "X4": "X4", "X5": "X5", "X6": "X6", "X7": "X7", "XM": "XM",
  "X3 M": "X3 M", "X4 M": "X4 M", "X5 M": "X5 M", "X6 M": "X6 M",
  "M2": "M2", "M3": "M3", "M4": "M4", "M5": "M5", "M8": "M8",
  "Z4": "Z4", "i3": "i3", "i4": "i4", "i5": "i5", "i7": "i7", "i8": "i8", 
  "iX": "iX", "iX1": "iX1", "iX3": "iX3",

  "A-Class": "A-클래스", "B-Class": "B-클래스", "C-Class": "C-클래스", "E-Class": "E-클래스", "S-Class": "S-클래스",
  "Maybach S-Class": "마이바흐 S-클래스",
  "CLA-Class": "CLA-클래스", "CLS-Class": "CLS-클래스", "CLE-Class": "CLE-클래스",
  "CLK-Class": "CLK-클래스", "CL-Class": "CL-클래스",
  "GLA-Class": "GLA-클래스", "GLB-Class": "GLB-클래스", "GLC-Class": "GLC-클래스",
  "GLE-Class": "GLE-클래스", "GLS-Class": "GLS-클래스", "G-Class": "G-클래스",
  "GL-Class": "GL-클래스", "GLK-Class": "GLK-클래스",
  "SL-Class": "SL-클래스", "SLK-Class": "SLK-클래스", "SLC-Class": "SLC-클래스", 
  "AMG GT": "AMG GT", "SLS AMG": "SLS AMG",
  "EQA": "EQA", "EQB": "EQB", "EQC": "EQC", "EQE": "EQE", "EQS": "EQS", 
  "EQS SUV": "EQS SUV", "EQE SUV": "EQE SUV", "EQV": "EQV",

  "A1": "A1", "A3": "A3", "A4": "A4", "A5": "A5", "A6": "A6", "A7": "A7", "A8": "A8",
  "S3": "S3", "S4": "S4", "S5": "S5", "S6": "S6", "S7": "S7", "S8": "S8", 
  "SQ5": "SQ5", "SQ8": "SQ8",
  "RS3": "RS3", "RS4": "RS4", "RS5": "RS5", "RS6": "RS6", "RS7": "RS7", 
  "RS Q3": "RS Q3", "RS Q8": "RS Q8", "RS e-tron GT": "RS e-트론 GT",
  "Q2": "Q2", "Q3": "Q3", "Q4 e-tron": "Q4 e-트론", "Q5": "Q5", "Q7": "Q7", "Q8": "Q8",
  "TT": "TT", "R8": "R8", "e-tron": "e-트론", "e-tron GT": "e-트론 GT", "e-tron Sportback": "e-트론 스포트백",

  "Golf": "골프", "Polo": "폴로", "Passat": "파사트", "Arteon": "아테온", "Scirocco": "시로코", "Phaeton": "페이톤",
  "Jetta": "제타", "Beetle": "비틀", "Tiguan": "티구안", "Touareg": "투아렉",
  "T-Roc": "티록", "T-Cross": "티크로스", "ID.3": "ID.3", "ID.4": "ID.4", "ID.5": "ID.5", "ID.Buzz": "ID.버즈",

  "911": "911", "Boxster": "박스터", "Cayman": "카이맨", "718 Boxster": "718 박스터", "718 Cayman": "718 카이맨",
  "Cayenne": "카이엔", "Cayenne Coupe": "카이엔 쿠페", "Macan": "마칸", "Panamera": "파나메라", "Taycan": "타이칸",

  "Discovery": "디스커버리", "Discovery Sport": "디스커버리 스포츠", "Defender": "디펜더", "Freelander": "프리랜더",
  "Range Rover": "레인지로버", "Range Rover Sport": "레인지로버 스포츠",
  "Range Rover Evoque": "레인지로버 이보크", "Range Rover Velar": "레인지로버 벨라",

  "Model S": "모델S", "Model 3": "모델3", "Model X": "모델X", "Model Y": "모델Y", "Cybertruck": "사이버트럭",

  "S60": "S60", "S80": "S80", "S90": "S90", "V40": "V40", "V60": "V60", "V90": "V90",
  "XC40": "XC40", "XC60": "XC60", "XC70": "XC70", "XC90": "XC90", 
  "C30": "C30", "C40": "C40", "EX30": "EX30", "EX90": "EX90",

  "Avante": "아반떼", "Sonata": "쏘나타", "Grandeur": "그랜저", "Tucson": "투싼", "Santa Fe": "싼타페", "Palisade": "팰리세이드",
  "K3": "K3", "K5": "K5", "K8": "K8", "K9": "K9", "Sportage": "스포티지", "Sorento": "쏘렌토", "Carnival": "카니발",
  "G70": "G70", "G80": "G80", "G90": "G90", "GV60": "GV60", "GV70": "GV70", "GV80": "GV80",
  "Mustang": "머스탱", "Explorer": "익스플로러", "Bronco": "브롱코", "F-150": "F-150",
  "Wrangler": "랭글러", "Grand Cherokee": "그랜드 체로키", "Gladiator": "글래디에이터",
  
  "Gasoline": "가솔린", "Diesel": "디젤", "Hybrid": "하이브리드", "Electric": "전기",
  "Automatic": "오토", "Manual": "수동",


  "Jaguar": "재규어", "Aston Martin": "애스턴마틴", "McLaren": "맥라렌", "Lotus": "로터스",
  "Alfa Romeo": "알파로메오", "Fiat": "피아트",
  "Chevrolet": "쉐보레", "Cadillac": "캐딜락", "Lincoln": "링컨", "Dodge": "닷지", 
  "GMC": "GMC", "Chrysler": "크라이슬러", "Rivian": "리비안", "Lucid": "루시드",
  "Nissan": "닛산", "Infiniti": "인피니티", "Mazda": "마쯔다", "Subaru": "스바루", 
  "Mitsubishi": "미쓰비시", "Suzuki": "스즈키", "Acura": "아큐라",
  "SsangYong": "쌍용", "Peugeot": "푸조", "Renault": "르노", "Citroën": "시트로엥", "Citroen": "시트로엥",
  "Polestar": "폴스타", "BYD": "비야디", "Geely": "지리"
};

const EXTERIOR_COLOR_MAP: Record<string, string> = {
  "White": "흰색", "Black": "검정색", "Grey": "쥐색", "Blue": "청색",
  "Silver": "은색", "Red": "빨간색", "Light Blue": "하늘색", "Brown": "갈색",
  "Orange": "주황색", "Yellow": "노란색", "Green": "녹색", "Purple": "보라색",
  "Pink": "분홍색", "Beige": "베이지색"
};


const KO_EN: Record<string, string> = {


  // Aston Martin
  "밴티지": "Vantage",
  "DBX": "DBX",
  "DB11": "DB11",
  "DBS": "DBS",
  "라피드": "Rapide",

  // Generations 
  "1세대": "Gen 1",
  "2세대": "Gen 2",
  "3세대": "Gen 3",
  "4세대": "Gen 4",
  "5세대": "Gen 5",
  "6세대": "Gen 6",
  "7세대": "Gen 7",

  // Audi 
  "A3": "A3",
  "A4": "A4",
  "A5": "A5",
  "A6": "A6",
  "A7": "A7",
  "A8": "A8",
  "Q2": "Q2",
  "Q3": "Q3",
  "Q5": "Q5",
  "Q7": "Q7",
  "Q8": "Q8",
  "e-트론": "e-tron",
  "더 뉴 A4": "New A4",
  "더 뉴 A6": "New A6",
  "더 뉴 Q5": "New Q5",
  "더 뉴 Q7": "New Q7",

  // Bentley
"컨티넨탈 GT": "Continental GT",
"컨티넨탈 GTC": "Continental GTC",
"플라잉스퍼": "Flying Spur",
"벤테이가": "Bentayga",
"뮬산": "Mulsanne",
"벤테이가 EWB": "Bentayga EWB",
"컨티넨탈 GT 아주르": "Continental GT Azure",
"컨티넨탈 GT 뮬리너": "Continental GT Mulliner",
"컨티넨탈 GT S": "Continental GT S",
"플라잉 스퍼 아주르": "Flying Spur Azure",
"플라잉 스퍼 S": "Flying Spur S",
"벤테이가 아주르": "Bentayga Azure",
"벤테이가 S": "Bentayga S",
"벤테이가 뮬리너": "Bentayga Mulliner",
"컨티넨탈 GTC 아주르": "Continental GTC Azure",
"컨티넨탈 GTC 뮬리너": "Continental GTC Mulliner",
"컨티넨탈 GTC S": "Continental GTC S",
"바투르": "Batur",

  // BMW 
  "1시리즈": "1 Series",
  "2시리즈": "2 Series",
  "3시리즈": "3 Series",
  "4시리즈": "4 Series",
  "5시리즈": "5 Series",
  "6시리즈": "6 Series",
  "7시리즈": "7 Series",
  "X1": "X1",
  "X3": "X3",
  "X4": "X4",
  "X5": "X5",
  "X6": "X6",
  "X7": "X7",
  "iX": "iX",
  "i4": "i4",
  "i5": "i5",
  "i7": "i7",
  "더 뉴 5시리즈": "New 5 Series",
  "더 뉴 X3": "New X3",
  "G30": "G30",  // 5 Series code
  "G31": "G31",  // Touring

  // Cadillac
  "CT5": "CT5",
  "CT6": "CT6",
  "에스컬레이드": "Escalade",
  "XT5": "XT5",
  "XT6": "XT6",

  // Chevrolet (GM imports)
  "카마로": "Camaro",
  "콜벳": "Corvette",
  "트래버스": "Traverse",
  "볼트": "Bolt",
  "이쿼녹스": "Equinox",

  // Chrysler

"300": "300",
"300C": "300C",
"퍼시피카": "Pacifica",
"타운 앤 컨트리": "Town & Country",
"그랜드 보이저": "Grand Voyager",
"보이저": "Voyager",
"세브링": "Sebring",
"200": "200",
"PT 크루저": "PT Cruiser",
"네온": "Neon",
"스트라투스": "Stratus",
"시러스": "Cirrus",
"콘코드": "Concorde",
"인티피드": "Intrepid",
"크로스파이어": "Crossfire",

  //  Dodge 
 "챌린저": "Challenger",
"차저": "Charger",
"듀랑고": "Durango",
"램": "Ram",
"램픽업": "Ram Pickup",
"바이퍼": "Viper",
"다코타": "Dakota",
"니트로": "Nitro",
"캘리버": "Caliber",
"저니": "Journey",
"아벤저": "Avenger",
"그랜드 캐러밴": "Grand Caravan",
"캐러밴": "Caravan",
"인트레피드": "Intrepid",  

  // Ferrari
  "488": "488",
  "812": "812",
  "로마": "Roma",
  "296": "296",
  "SF90": "SF90",
  "488 GTB": "488 GTB",
"SF90 스트라달레": "SF90 Stradale",
"488 스파이더": "488 Spider",
"488 피스타": "488 Pista",
"488 피스타 스파이더": "488 Pista Spider",
"812 슈퍼패스트": "812 Superfast",
"812 GTS": "812 GTS",
"812 컴페티치오네": "812 Competizione",
"812 컴페티치오네 A": "812 Competizione A",
"로마 스파이더": "Roma Spider",
"296 GTB": "296 GTB",
"296 GTS": "296 GTS",
"SF90 스파이더": "SF90 Spider",
"SF90 XX 스트라달레": "SF90 XX Stradale",
"SF90 XX 스파이더": "SF90 XX Spider",
"12 실린더": "12Cilindri",
"12 실린더 스파이더": "12Cilindri Spider",
"F8 트리뷰토": "F8 Tributo",
"F8 스파이더": "F8 Spider",
"포르토피노": "Portofino",
"포르토피노 M": "Portofino M",
"458 이탈리아": "458 Italia",
"458 스파이더": "458 Spider",
"458 스페치알레": "458 Speciale",
"458 스페치알레 A": "458 Speciale A",
"FF": "FF",
"GTC4루쏘": "GTC4Lusso",
"GTC4루쏘 T": "GTC4Lusso T",
"라 페라리": "LaFerrari",
"라 페라리 아페르타": "LaFerrari Aperta",
"엔초": "Enzo",
"FXX": "FXX",
"FXX K": "FXX K",
"FXX K 에볼루치오네": "FXX K Evoluzione",
"푸로산게": "Purosangue",
"켈리포니아": "California",
"켈리포니아 T": "California T",
"캘리포니아": "California",
"GT C4 루쏘": "GTC4Lusso",  

  // Ford
  "머스탱": "Mustang",
  "익스플로러": "Explorer",
  "브롱코": "Bronco",
  "F-150": "F-150",

  // Genesis 
  "G70": "G70",
  "G80": "G80",
  "G90": "G90",
  "GV70": "GV70",
  "GV80": "GV80",

// Hyundai

"아반떼": "Avante",
"쏘나타": "Sonata",
"그랜저": "Grandeur",
"아이오닉 5": "IONIQ 5",
"아이오닉 6": "IONIQ 6",
"캐스퍼": "Casper",
"코나": "Kona",
"투싼": "Tucson",
"싼타페": "Santa Fe",
"팰리세이드": "Palisade",
"스타리아": "Staria",
"넥쏘": "NEXO",
"베뉴": "Venue",
"아이오닉": "IONIQ",  
"아반떼 N": "Avante N",
"소나타": "Sonata",  
"그랜저 IG": "Grandeur IG",
"더 뉴 그랜저": "New Grandeur",
"아이오닉 5 N": "IONIQ 5 N",
"코나 N": "Kona N",
"투싼 하이브리드": "Tucson Hybrid",
"싼타페 하이브리드": "Santa Fe Hybrid",

  // Honda
  "어코드": "Accord",
  "CR-V": "CR-V",
  "파일럿": "Pilot",
  "오디세이": "Odyssey",
"시빅": "Civic",
"HR-V": "HR-V",
"패스포트": "Passport",
"인사이트": "Insight",
"어코드 하이브리드": "Accord Hybrid",
"CR-V 하이브리드": "CR-V Hybrid",
"시빅 타입 R": "Civic Type R",
"파일럿 블랙 에디션": "Pilot Black Edition",
"뉴 CR-V": "New CR-V",
"어코드 11세대": "Accord 11th Gen",
"시빅 11세대": "Civic 11th Gen",

  // Infiniti
  "Q50": "Q50",
  "QX50": "QX50",
  "QX60": "QX60",

  // Jaguar / Land Rover
  "F-페이스": "F-Pace",
  "E-페이스": "E-Pace",
  "I-페이스": "I-Pace",
  "XF": "XF",
  "XJ": "XJ",
  "레인지로버": "Range Rover",
  "레인지로버 스포츠": "Range Rover Sport",
  "디스커버리": "Discovery",
  "디펜더": "Defender",

  // Jeep 
  "컴패스": "Compass",
  "레니게이드": "Renegade",

  // KIA

  "카니발": "Carnival",
"쏘렌토": "Sorento",
"K5": "K5",
"스포티지": "Sportage",
"모닝": "Morning",
"레이": "Ray",
"K3": "K3",
"K7": "K7",
"K8": "K8",
"K9": "K9",
"EV3": "EV3",
"EV4": "EV4",
"EV5": "EV5",
"EV6": "EV6",
"EV9": "EV9",
"PV5": "PV5",
"X-TREK": "X-TREK",
"니로": "Niro",
"델타": "Delta",
"레토나": "Retona",
"로체": "Lotze",
"록스타": "Rockstaff",
"리갈": "Regal",
"리오": "Rio",
"모하비": "Mohave",
"베스타": "Bestar",
"봉고III 미니버스": "Bongo III Minibus",
"브리샤": "Brisa",
"비스토": "Visto",
"세피아": "Sephia",
"셀토스": "Seltos",
"슈마": "Shuma",
"스토닉": "Stonic",
"스팅어": "Stinger",
"스펙트라": "Spectra",
"쎄라토": "Cerato",
"쏘울": "Soul",
"씨드": "Ceed",
"아벨라": "Avella",
"엔터프라이즈": "Enterprise",
"엘란": "Elan",
"오피러스": "Opirus",
"옵티마": "Optima",
"카렌스": "Carens",
"카스타": "Carstar",
"캐피탈": "Capital",
"콩코드": "Concord",
"크레도스": "Credos",
"타스만": "Tasman",
"타우너": "Towner",
"토픽": "Topic",
"텔루라이드": "Telluride",
"파크타운": "Parktown",
"포르테": "Forte",
"포텐샤": "Potentia",
"프라이드": "Pride",
"프레지오": "Pregio",
"피아트132": "Fiat 132",

  // Lamborghini
  "우루스": "Urus",
  "아벤타도르": "Aventador",
  "우라칸": "Huracan",

  // Lexus
  "ES": "ES",
  "IS": "IS",
  "NX": "NX",
  "RX": "RX",
  "LX": "LX",
  "UX": "UX",
  "LS": "LS",
"ES300h": "ES300h",
"IS300h": "IS300h",
"IS350": "IS350",
"IS500 F 스포츠 퍼포먼스": "IS500 F Sport Performance",
"LS500": "LS500",
"LS500h": "LS500h",
"LS460": "LS460",
"LS600h": "LS600h",
"NX350h": "NX350h",
"NX450h+": "NX450h+",
"NX300h": "NX300h",
"RX350": "RX350",
"RX350h": "RX350h",
"RX450h+": "RX450h+",
"RX500h F 스포츠 퍼포먼스": "RX500h F Sport Performance",
"LX600": "LX600",
"LX570": "LX570",
"UX250h": "UX250h",
"UX300e": "UX300e",
"LC": "LC",
"LC500": "LC500",
"LC500h": "LC500h",
"LC500 컨버터블": "LC500 Convertible",
"RC": "RC",
"RC F": "RC F",
"RC350": "RC350",
"RC300h": "RC300h",
"GS": "GS",
"GS350": "GS350",
"GS450h": "GS450h",
"CT": "CT",
"CT200h": "CT200h",
"LM": "LM",
"LM300h": "LM300h",
"LM350h": "LM350h",

  // Maserati
  "기블리": "Ghibli",
  "레반테": "Levante",
  "콰트로포르테": "Quattroporte",

  // Mazda
  "마쯔다3": "Mazda3",
  "CX-5": "CX-5",
  "CX-30": "CX-30",
  "MX-5": "MX-5",

  // McLaren
  "720S": "720S",
  "570S": "570S",
  "Artura": "Artura",

  // Mercedes-Benz 
  "A클래스": "A-Class",
  "C클래스": "C-Class",
  "E클래스": "E-Class",
  "S클래스": "S-Class",
  "GLA": "GLA",
  "GLB": "GLB",
  "GLC": "GLC",
  "GLE": "GLE",
  "GLS": "GLS",
  "G클래스": "G-Class",
  "CLA": "CLA",
  "CLS": "CLS",
  "AMG GT": "AMG GT",
  "더 뉴 E클래스": "New E-Class",
  "W213": "W213",  // E-Class code
  "W206": "W206",  // New C-Class

  // MINI
  "쿠퍼": "Cooper",
  "컨트리맨": "Countryman",
  "컨버터블": "Convertible",

  // Mitsubishi
  "아웃랜더": "Outlander",
  "파제로": "Pajero",

  // Nissan
  "알티마": "Altima",
"맥시마": "Maxima",
"큐브": "Cube",
"쥬크": "Juke",
"무라노": "Murano",
"패스파인더": "Pathfinder",
"노트": "Note",
"로그": "Rogue",
"로렐": "Laurel",
"리프": "Leaf",
"마치": "March",
"모코": "Moco",
"버사": "Versa",
"베르사": "Versa",
"블루버드 실피": "Bluebird Sylphy",
"블루버드": "Bluebird",
"세드릭": "Cedric",
"세레나": "Serena",
"세피로": "Cefiro",
"센트라": "Sentra",
"스카이라인": "Skyline",
"시마": "Cima",
"실비아": "Silvia",
"알마다": "Armada",
"엑스테라": "Xterra",
"엑스트레일": "X-Trail",
"엘그란드": "Elgrand",
"윙로드": "Wingroad",
"캐시카이": "Qashqai",
"퀘스트": "Quest",
"타이탄": "Titan",
"티아나": "Teana",
"파오": "Pao",
"펄사": "Pulsar",
"푸가": "Fuga",
"프레리": "Prairie",
"프레지던트": "President",
"프론티어": "Frontier",
"휘가로": "Figaro",
"라페스타": "Lafesta",
"스테이지아": "Stagea",


  // Porsche 
  "타이칸": "Taycan",
  "박스터": "Boxster",
  "카이맨": "Cayman",
  "파나메라": "Panamera",
  "카이엔": "Cayenne",
  "마칸": "Macan",
  "911": "911",
  "718": "718",

  // Rivian / Lucid 
  "R1T": "R1T",
  "R1S": "R1S",
  "에어": "Air",

 // Rolls Royce

  "고스트": "Ghost",
"던": "Dawn",
"레이스": "Wraith",
"실버스퍼": "Silver Spur",
"스펙터": "Spectre",
"컬리넌": "Cullinan",
"코니쉬": "Corniche",
"팬텀": "Phantom",

// Suzuki

"짐니": "Jimny",
"허슬러": "Hustler",
"알토라팡": "Alto Lapin",
"알토": "Alto",
"이그니스": "Ignis",
"X-90": "X-90",
"그랜드 비타라": "Grand Vitara",
"사이드킥": "Sidekick",
"스위프트": "Swift",
"스페이시아": "Spacia",
"웨건 R": "Wagon R",
"카푸치노": "Cappuccino",
"트윈": "Twin",

  // Subaru
  "포레스터": "Forester",
  "아웃백": "Outback",
  "임프레자": "Impreza",

  // Tesla 
 "모델 3": "Model 3",
"모델 S": "Model S",
"모델 X": "Model X",
"모델 Y": "Model Y",
"사이버트럭": "Cybertruck",

  // Toyota:

  "캠리": "Camry",
"RAV4": "RAV4",
"시에나": "Sienna",
"프리우스": "Prius",
"86": "86",
"알파드": "Alphard",
"4Runner": "4Runner",
"C-HR": "C-HR",
"FJ 크루져": "FJ Cruiser",
"MR-2": "MR-2",
"MR-S": "MR-S",
"WiLL": "WiLL",
"bB": "bB",
"iQ": "iQ",
"가이아": "Gaia",
"노아": "Noah",
"라움": "Raum",
"락티스": "Ractis",
"루미": "Roomy",
"랜드크루저": "Land Cruiser",
"마크2": "Mark II",
"마크X": "Mark X",
"매트릭스": "Matrix",
"복시": "Voxy",
"베르소": "Verso",
"벤자": "Venza",
"벨파이어": "Vellfire",
"비스타": "Vista",
"사이": "Sai",
"세라": "Sera",
"세콰이어": "Sequoia",
"셀리카": "Celica",
"셀시오": "Celsior",
"소아라": "Soarer",
"솔라라": "Solara",
"수프라": "Supra",
"시엔타": "Sienta",
"아리스토": "Aristo",
"아발론": "Avalon",
"아이고": "Aygo",
"아이시스": "Isis",
"알테자": "Altezza",
"액스트라캡": "Xtra Cab",
"야리스(비츠)": "Yaris (Vitz)",
"에스콰이어": "Esquire",
"에스티마": "Estima",
"위시": "Wish",
"이스트": "Ist",
"입섬": "Ipsum",
"체이서": "Chaser",
"카미": "Cami",
"카리나": "Carina",
"코로나": "Corona",
"코롤라": "Corolla",
"코르사": "Corsa",
"크라운": "Crown",
"타코마": "Tacoma",
"툰드라": "Tundra",
"파쏘": "Passo",
"펀 카고": "Fun Cargo",
"프레미오": "Premio",
"프리비아": "Previa",
"픽업": "Pickup",
"하이랜더": "Highlander",
"하이럭스 써프": "Hilux Surf",
"하이에이스": "Hiace",
"해리어": "Harrier",

  // Volkswagen (including your Tiguan request)
  "티구안": "Tiguan",
"골프": "Golf",
"제타": "Jeta",
"아테온": "Arteon",
"파사트": "Passat",
"투아렉": "Touareg",
"CC": "CC",
"EOS": "EOS",
"ID.4": "ID.4",
"ID.5": "ID.5",
"리알타": "Rialta",
"마이크로버스": "Microbus",
"멀티밴": "Multivan",
"벤토": "Vento",
"보라": "Bora",
"비틀": "Beetle",
"사란": "Sharan",
"시로코": "Scirocco",
"아틀라스": "Atlas",
"업": "Up!",
"코라도": "Corrado",
"트랜스포터": "Transporter",
"티록": "T-Roc",
"페이톤": "Phaeton",
"폴로": "Polo",


  // Volvo
  "XC40": "XC40",
  "XC60": "XC60",
  "XC90": "XC90",
  "S60": "S60",
  "S90": "S90",

  // Others


"올스페이스": "Allspace",
"뉴 CC": "New CC",
"뉴 Tiguan": "New Tiguan",
"더 뉴 Passat": "The New Passat",
"V90 크로스컨트리": "V90 Cross Country",
"C40 리차지": "C40 Recharge",
"V60 크로스컨트리 Gen 2": "V60 Cross Country Gen 2",
"르반떼": "Levante",


  "흰색": "White", 
  "검정색": "Black", 
  "진주색": "Pearl White",     
  "아이보리색": "Ivory",
  "쥐색": "Grey", 
  "은색": "Silver", 
  "은회색": "Silver Grey",      
  "다크그레이": "Dark Grey",    
  "명은색": "Bright Silver",
  "연회색": "Light Grey",
  "진회색": "Dark Grey",       
  "청색": "Blue", 
  "남색": "Navy Blue",        
  "진청색": "Dark Blue",
  "하늘색": "Light Blue",      
  "청옥색": "Turquoise",
  "빨간색": "Red", 
  "갈색": "Brown", 
  "밤색": "Dark Brown",
  "주황색": "Orange", 
  "자주색": "Magenta",          
  "다홍색": "Crimson",
  "와인색": "Wine Red",
  "베이지색": "Beige",
  "금색": "Gold",
  "노란색": "Yellow", 
  "녹색": "Green",
  "연두색": "Light Green",
  "보라색": "Purple", 
  "분홍색": "Pink", 
  "초록색": "Green",
  "가솔린": "Gasoline", "디젤": "Diesel", "하이브리드": "Hybrid", "전기": "Electric", "LPG": "LPG",
  "오토": "Automatic", "수동": "Manual", "세미오토": "Semi-Auto", "CVT": "CVT",
  "벤츠": "Mercedes-Benz", "BMW": "BMW", "아우디": "Audi", "폭스바겐": "Volkswagen", 
  "쉐보레": "Chevrolet", "쌍용": "SsangYong", "르노삼성": "Renault Samsung", "제네시스": "Genesis",
  "재규어": "Jaguar", "애스턴마틴": "Aston Martin", "맥라렌": "McLaren", "로터스": "Lotus",
  "알파로메오": "Alfa Romeo", "피아트": "Fiat", "캐딜락": "Cadillac", "링컨": "Lincoln",
  "닷지": "Dodge", "크라이슬러": "Chrysler", "리비안": "Rivian", "루시드": "Lucid",
  "닛산": "Nissan", "인피니티": "Infiniti", "마쯔다": "Mazda", "스바루": "Subaru",
  "미쓰비시": "Mitsubishi", "스즈키": "Suzuki", "아큐라": "Acura", "푸조": "Peugeot",
  "르노": "Renault", "시트로엥": "Citroën", "폴스타": "Polestar", "비야디": "BYD", "지리": "Geely"
};


const KO_SQ_OPTIONS: Record<string, string> = {
  "썬루프": "Tavan Xhami", "파노라마썬루프": "Tavan Panoramik",
  "내비게이션": "Navigacion", "스마트키": "Çelës i Mençur",
  "오토라이트": "Drita Automatike", "주차감지센서": "Sensorë Parkimi",
  "가죽시트": "Ulëse Lëkure", "열선시트": "Ulëse me Ngrohje", "통풍시트": "Ulëse me Ftohje",
  "전동시트": "Ulëse Elektrike", "메모리시트": "Ulëse me Memorie",
  "후방카메라": "Kamerë Mbrapa", "어라운드뷰": "Kamera 360°",
  "헤드업디스플레이": "Head-Up Display (HUD)", "전동트렁크": "Bagazh Elektrik",
  "후측방경보": "Sensorë Këndi të Vdekur", "차선이탈경보": "Asistent Korsie",
  "크루즈컨트롤": "Cruise Control", "스마트크루즈컨트롤": "Distronic",
  "LED헤드램프": "Drita LED", "하이패스": "High Pass", "ABS": "ABS",
  "열선스티어링휠": "Timon me Ngrohje", "커튼에어백": "Airbag Anësor",
  "차체자세제어장치": "ESP (Stabilitet)", "레인센서": "Sensor Shiu",
  "알루미늄휠": "Disqe Alumini", "루프랙": "Mbajtëse Çatie",
  "블루투스": "Bluetooth", "타이어공기압감지": "Sensor Presioni Gomash",
  "패들시프트": "Marsh në Timon (F1)", "전자식주차브레이크": "Frenë Dore Elektrike"
};


function getKoreanBrandName(englishBrand: string): string {
  return EN_KO[englishBrand] || englishBrand;
}

function encodeQuery(str: string): string {
  let decoded = str;
  try { if (str.includes('%')) decoded = decodeURIComponent(str); } catch (e) { decoded = str; }
  return encodeURIComponent(decoded)
    .replace(/%28/g, '(').replace(/%29/g, ')').replace(/%5F/g, '_').replace(/%2E/g, '.');
}

async function fetchFromEncar(url: string): Promise<Response> {
  console.log("Fetching URL:", url);
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      'Referer': 'https://m.encar.com/'
    }
  });
}

async function getExchangeRate(): Promise<number> { return 0.00067; }


async function translateToEnglish(text: string): Promise<string> {
  if (!text) return text;
  let result = text;
  if (/[가-힣]/.test(result)) {
    const replacements = Object.entries(EN_KO).sort((a, b) => b[1].length - a[1].length);
    for (const [eng, kor] of replacements) {
      if (result.includes(kor)) {
        result = result.split(kor).join(eng);
      }
    }
    for (const [ko, en] of Object.entries(KO_EN)) {
      result = result.split(ko).join(en);
    }
  }
  return result;
}


function translateOptionToAlbanian(koreanOption: string): string {
  if (KO_SQ_OPTIONS[koreanOption]) return KO_SQ_OPTIONS[koreanOption];
  for (const [kor, sq] of Object.entries(KO_SQ_OPTIONS)) {
    if (koreanOption.includes(kor)) return sq;
  }
  return koreanOption;
}

function buildImageUrl(photoPath: string): string {
  if (!photoPath) return '';
  let cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
  if (!cleanPath.includes('.jpg') && !cleanPath.includes('.png')) cleanPath += '001.jpg';
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  return `https://ci.encar.com/${cleanPath}?impolicy=heightRate&rh=276&cw=460&ch=276&cg=Center&wtmk=https://ci.encar.com/wt_mark/w_mark_04.png&wtmkg=SouthEast&wtmkw=70&wtmkh=30&t=${timestamp}`;
}


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    
    if (action === 'send-reservation') {
      const { reservation } = await req.json();
      
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (!RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
      }

      const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL'); 
      if (!ADMIN_EMAIL) {
        console.error("Missing ADMIN_EMAIL");
        return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Vetrix Auto <onboarding@resend.dev>',
          subject: `Rezervim i Ri: ${reservation.car_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #e11d48;">Rezervim i Ri për Veturë</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Vetura:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${reservation.car_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>Çmimi:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${reservation.car_price}</td>
                </tr>
                <tr style="background-color: #f3f4f6;">
                  <td style="padding: 10px; border: 1px solid #ddd;"><strong>ID e Veturës:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${reservation.car_id}</td>
                </tr>
              </table>
              
              <h3 style="border-bottom: 2px solid #e11d48; padding-bottom: 5px;">Të dhënat e Klientit:</h3>
              <p><strong>Emri:</strong> ${reservation.user_name}</p>
              <p><strong>Email:</strong> <a href="mailto:${reservation.user_email}">${reservation.user_email}</a></p>
              <p><strong>Tel:</strong> ${reservation.user_phone}</p>
              
              <div style="background-color: #fff1f2; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <strong>Mesazhi:</strong><br/>
                ${reservation.message || "Asnjë mesazh shtesë."}
              </div>
              
              <br/>
              <p style="text-align: center;">
                <a href="${reservation.car_image}" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shiko Foton e Veturës</a>
              </p>
            </div>
          `,
        }),
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

   
    if (action === 'brands') {
      const brands = Object.keys(STATIC_MODELS).sort();
      return new Response(JSON.stringify({ brands }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

 
    if (action === 'models') {
      const manufacturer = url.searchParams.get('manufacturer');
      if (!manufacturer) return new Response(JSON.stringify({ error: "Required" }), { status: 400, headers: corsHeaders });
      const models = STATIC_MODELS[manufacturer] || [];
      return new Response(JSON.stringify({ models: models.sort() }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    
    if (action === 'list') {
      const manufacturer = url.searchParams.get('manufacturer');
      const modelGroup = url.searchParams.get('modelGroup') || url.searchParams.get('model');
      const count = parseInt(url.searchParams.get('count') || '20');
      const page = parseInt(url.searchParams.get('page') || '0');
      const exteriorColor = url.searchParams.get('exteriorColor'); 
      const keyword = url.searchParams.get('keyword');
      
      const sortParam = url.searchParams.get('sort');
      let sortStr = 'ModifiedDate'; 

      console.log(`Debug: Received sortParam: ${sortParam}, mapping to sortStr: ${sortStr}`);
  
      if (sortParam === 'price-asc') sortStr = 'PriceAsc';
      else if (sortParam === 'price-desc') sortStr = 'PriceDesc';
      else if (sortParam === 'year-asc') sortStr = 'YearAsc';   
      else if (sortParam === 'year-desc') sortStr = 'YearDesc'; 
      else if (sortParam === 'mileage-asc') sortStr = 'MileageAsc';

      if (!manufacturer) return new Response(JSON.stringify({ error: "Required" }), { status: 400, headers: corsHeaders });

      const koreanBrand = getKoreanBrandName(manufacturer);
      
      const domesticBrands = ['현대', '기아', '제네시스', '쌍용', '르노', '르노삼성', '쉐보레', 'GM대우'];
      const carType = domesticBrands.includes(koreanBrand) ? 'Y' : 'N';
      
      const offset = page * count;

      let manufacturerPart;
      if (modelGroup) {
        const koreanModel = EN_KO[modelGroup] || modelGroup;
        manufacturerPart = `(C.Manufacturer.${koreanBrand}._.ModelGroup.${koreanModel}.)`;
      } else {
        manufacturerPart = `Manufacturer.${koreanBrand}.`;
      }

      const filters = [];

      const pf = url.searchParams.get('priceFrom'), pt = url.searchParams.get('priceTo');
      if (pf || pt) filters.push(`Price.range(${pf || '0'}..${pt || '999999'})`);


      const yf = url.searchParams.get('yearFrom'), yt = url.searchParams.get('yearTo');
      if (yf || yt) {

        const from = yf ? parseInt(yf) * 100 : 190000;
        const to = yt ? parseInt(yt) * 100 + 99 : 202612;
        filters.push(`Year.range(${from}..${to})`);
      }

      const fuel = url.searchParams.get('fuelType');
      if (fuel) filters.push(`FuelType.${EN_KO[fuel] || fuel}`);

      const transmission = url.searchParams.get('transmission');
      if (transmission) filters.push(`Transmission.${EN_KO[transmission] || transmission}`);

      const mileageFrom = url.searchParams.get('mileageFrom'), mileageTo = url.searchParams.get('mileageTo');
      if (mileageFrom || mileageTo) filters.push(`Mileage.range(${mileageFrom || '0'}..${mileageTo || '9999999'})`);

      if (exteriorColor && EXTERIOR_COLOR_MAP[exteriorColor]) {
        filters.push(`Color.${EXTERIOR_COLOR_MAP[exteriorColor]}`);
      }

      if (keyword) {
         const cleanKeyword = keyword.replace(/[^a-zA-Z0-9\s-]/g, '');
         if (cleanKeyword) {
           filters.push(`BadgeDetail.wildcard(*${cleanKeyword}*)`);
         }
      }

      const filterStr = filters.length > 0 ? `_.${filters.join('._.')}.` : '';
      const queryString = `(And.(And.Hidden.N._.(C.CarType.${carType}._.${manufacturerPart}))${filterStr}_.AdType.B.)`;
      
      const encodedQuery = encodeQuery(queryString);
      

      const sr = `%7C${sortStr}%7C${offset}%7C${count}`;
      
      let response = await fetchFromEncar(`https://api.encar.com/search/car/list/premium?count=true&q=${encodedQuery}&sr=${sr}`);
      if (!response.ok) {
        response = await fetchFromEncar(`https://api.encar.com/search/car/list/general?count=true&q=${encodedQuery}&sr=${sr}`);
      }

      const data = await response.json();
      const rate = await getExchangeRate();
      const cars = await Promise.all((data.SearchResults || []).map(async (car: any) => ({
        id: car.Id,
        manufacturer: manufacturer,
        model: await translateToEnglish(String(car.Model || '')),
        badge: await translateToEnglish(String(car.Badge || '') + ' ' + String(car.BadgeDetail || '')),
        year: car.Year,
        priceEur: Math.round((Number(car.Price) || 0) * 10000 * rate),
        mileage: car.Mileage || 0,
        displacement: car.Displacement || 0, 
        image: car.Photo ? buildImageUrl(String(car.Photo)) : '',
        fuelType: await translateToEnglish(String(car.FuelType || '')),
        transmission: await translateToEnglish(String(car.Transmission || ''))
      })));

      return new Response(JSON.stringify({ cars, total: data.Count || 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ACTION: detail
    if (action === 'detail') {
      const carId = url.searchParams.get('id');
      if (!carId) return new Response(JSON.stringify({ error: "ID required" }), { status: 400, headers: corsHeaders });

      try {
        const response = await fetch(`https://api.encar.com/v1/readside/vehicle/${carId}?include=ADVERTISEMENT,CATEGORY,CONDITION,CONTACT,MANAGE,OPTIONS,PHOTOS,SPEC,PARTNERSHIP,CENTER,VIEW`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            'Referer': `https://m.encar.com/dc/dc_cardetailview.do?carid=${carId}`
          }
        });

        if (!response.ok) return new Response(JSON.stringify({ error: "API Error" }), { status: response.status, headers: corsHeaders });

        const data = await response.json();
        const rate = await getExchangeRate();
        const photosArr = Array.isArray(data.photos) ? data.photos.filter((p: any) => p.path || p.location) : [];
        
        const standardOptions = Array.isArray(data.options?.standard) ? data.options.standard : [];
        const additionalOptions = Array.isArray(data.options?.options) ? data.options.options : [];
        const allOptions = [...standardOptions, ...additionalOptions];

        
        const translatedOptions = allOptions.map((o: any) => 
          translateOptionToAlbanian(String(o.name || o))
        );

        const detail = {
          id: data.id || carId,
          manufacturer: await translateToEnglish(data.category?.manufacturerEnglishName || ''),
          model: await translateToEnglish(data.category?.modelGroupEnglishName || ''),
          badge: await translateToEnglish(data.category?.gradeEnglishName || ''),
          year: data.category?.formYear || 0,
          priceKrw: (data.advertisement?.price || 0) * 10000,
          priceEur: Math.round((data.advertisement?.price || 0) * 10000 * rate),
          mileage: data.spec?.mileage || 0,
          displacement: data.spec?.displacement || 0,
          fuelType: await translateToEnglish(data.spec?.fuelName || ''),
          transmission: await translateToEnglish(data.spec?.transmissionName || ''),
          images: photosArr.map((p: any) => buildImageUrl(p.location || p.path)),
          color: await translateToEnglish(data.spec?.colorName || ''),
          options: translatedOptions,
          description: await translateToEnglish(data.advertisement?.description || '')
        };

        return new Response(JSON.stringify(detail), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Failed to fetch details" }), { status: 500, headers: corsHeaders });
      }
    }
    
    return new Response(JSON.stringify({ message: "OK" }), { headers: corsHeaders });

 } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});