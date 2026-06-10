/**
 * 식품영양성분 DB — 식약처 국가표준식품성분표(제10차, 2023~2024 반영) 기준
 * 100g edible portion | iron 단위: mg
 * @see https://various.foodsafetykorea.go.kr/nutrient/
 */
const NUTRIENT_DB_VERSION = '2024-식약처제10차';

const nutrientDB = {
  '소고기_다짐육': {
    kcal: 187, protein: 18.7, carbs: 0.6, fat: 12.0, fiber: 0, iron: 2.6,
    note: '헴철', source: '쇠고기_다짐육_생것',
    aliases: ['소고기', '소고기 다진것', '다진소고기', '쇠고기', '소고기다짐육'],
  },
  '닭가슴살': {
    kcal: 106, protein: 23.0, carbs: 0, fat: 1.0, fiber: 0, iron: 0.28,
    note: '헴철', source: '닭고기_가슴_껍질제거_생것',
    aliases: ['닭', '닭고기', '닭가슴', '닭가슴살살'],
  },
  '돼지고기_다짐육': {
    kcal: 218, protein: 17.2, carbs: 0, fat: 16.2, fiber: 0, iron: 0.94,
    note: '헴철', source: '돼지고기_앞다리_다짐육_생것',
    aliases: ['돼지고기', '돼지 다짐육', '돼지고기 다짐'],
  },
  '연어': {
    kcal: 142, protein: 20.1, carbs: 0, fat: 6.5, fiber: 0, iron: 0.34,
    note: '헴철', source: '연어_생것',
    aliases: ['연어살', '생연어', '연어필렛'],
  },
  '달걀노른자': {
    kcal: 322, protein: 15.9, carbs: 0.6, fat: 28.8, fiber: 0, iron: 4.85,
    note: '헴철', source: '달걀_노른자',
    aliases: ['계란노른자', '노른자', '달걀 노른자', '계란 노른자'],
  },
  '시금치': {
    kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, iron: 2.03,
    note: '비헴철', source: '시금치_생것',
    aliases: ['시금치잎', '데친시금치'],
  },
  '브로콜리': {
    kcal: 28, protein: 3.0, carbs: 4.0, fat: 0.4, fiber: 3.3, iron: 0.67,
    note: '비헴철', vitC: true, source: '브로콜리_생것',
    aliases: ['브로콜리송이', '브로콜리'],
  },
  '단호박_찐': {
    kcal: 66, protein: 1.7, carbs: 15.5, fat: 0.8, fiber: 2.5, iron: 0.56,
    source: '단호박_찜',
    aliases: ['단호박', '찐단호박', '호박', '단호박찜'],
  },
  '고구마_찐': {
    kcal: 128, protein: 1.2, carbs: 30.0, fat: 0.2, fiber: 2.5, iron: 0.39,
    source: '고구마_찜',
    aliases: ['고구마', '찐고구마', '고구마찜'],
  },
  '당근': {
    kcal: 37, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 2.4, iron: 0.3,
    source: '당근_생것', aliases: ['당근채', '당근'],
  },
  '애호박': {
    kcal: 19, protein: 1.2, carbs: 3.5, fat: 0.1, fiber: 1.0, iron: 0.27,
    source: '애호박_생것', aliases: ['주키니', '쥬키니', '애호박'],
  },
  '감자': {
    kcal: 65, protein: 1.8, carbs: 14.5, fat: 0.1, fiber: 1.8, iron: 0.38,
    source: '감자_생것', aliases: ['감자살', '감자'],
  },
  '멥쌀': {
    kcal: 365, protein: 6.8, carbs: 79.2, fat: 0.5, fiber: 0.5, iron: 0.33,
    source: '멥쌀_백미_생것', aliases: ['쌀', '백미', '쌀쌀', '밥'],
  },
  '두부': {
    kcal: 53, protein: 5.5, carbs: 1.2, fat: 3.0, fiber: 0.5, iron: 1.41,
    note: '칼슘↑ 흡수↓', source: '두부_단단한것',
    aliases: ['순두부', '연두부', '두부'],
  },
  '사과': {
    kcal: 50, protein: 0.2, carbs: 13.0, fat: 0.2, fiber: 1.8, iron: 0.09,
    vitC: true, source: '사과_생것', aliases: ['사과퓨레', '사과즙', '사과'],
  },
  '바나나': {
    kcal: 90, protein: 1.1, carbs: 22.0, fat: 0.2, fiber: 1.7, iron: 0.26,
    source: '바나나_생것', aliases: ['바나나퓨레', '바나나'],
  },
  '키위': {
    kcal: 46, protein: 0.8, carbs: 11.0, fat: 0.3, fiber: 2.1, iron: 0.19,
    vitC: true, source: '키위_생것', aliases: ['참다래', '키위과일', '키위'],
  },
  '딸기': {
    kcal: 36, protein: 0.7, carbs: 8.5, fat: 0.4, fiber: 1.8, iron: 0.35,
    vitC: true, source: '딸기_생것', aliases: ['딸기퓨레', '딸기'],
  },
  '오트밀': {
    kcal: 367, protein: 13.5, carbs: 66.0, fat: 6.5, fiber: 9.0, iron: 4.25,
    note: '비헴철', source: '귀리_완두통곡물_생것',
    aliases: ['귀리', '오트', '오트밀'],
  },
  '콩나물': {
    kcal: 30, protein: 3.0, carbs: 5.0, fat: 0.2, fiber: 1.5, iron: 0.67,
    source: '콩나물_생것', aliases: ['대두나물', '콩나물'],
  },
  '우유': {
    kcal: 65, protein: 3.3, carbs: 4.8, fat: 3.6, fiber: 0, iron: 0.03,
    note: '철흡수 저해', inhibitor: true, source: '우유_일반',
    aliases: ['전유', '우유', '일반우유'],
  },
  '치즈': {
    kcal: 300, protein: 22.0, carbs: 2.0, fat: 23.0, fiber: 0, iron: 0.48,
    note: '칼슘↑ 흡수↓', inhibitor: true, source: '치즈_체다',
    aliases: ['슬라이스치즈', '체다치즈', '치즈'],
  },
  '두유': {
    kcal: 54, protein: 3.3, carbs: 6.0, fat: 2.0, fiber: 0.5, iron: 0.49,
    inhibitor: true, source: '두유_일반',
    aliases: ['대두유', '두유'],
  },
  '콩': {
    kcal: 125, protein: 11.0, carbs: 15.0, fat: 3.5, fiber: 5.0, iron: 2.03,
    note: '비헴철', source: '완두콩_삶은것',
    aliases: ['완두콩', '강낭콩', '콩'],
  },
  '미역': {
    kcal: 30, protein: 1.7, carbs: 5.0, fat: 0.2, fiber: 3.5, iron: 2.81,
    note: '비헴철', source: '미역_마른것',
    aliases: ['마른미역', '미역줄기', '미역'],
  },
};

const VIT_C_KEYWORDS = ['키위', '딸기', '사과', '오렌지', '브로콜리', '피망', '토마토', '파프리카', '레몬', '감귤', '배'];

const IRON_INHIBITORS = ['우유', '치즈', '두유', '요거트', '커피', '홍차', '분유'];

const IRON_GUIDE_FOODS = [
  { name: '소고기 (다짐육)', iron: 2.6, type: '헴철', absorb: '15~35%', tip: '이유식 철분 1순위', source: '식약처' },
  { name: '달걀 노른자', iron: 4.85, type: '헴철', absorb: '15~35%', tip: '7개월~ 소량, 알레르기 주의', source: '식약처' },
  { name: '오트밀 (귀리)', iron: 4.25, type: '비헴철', absorb: '3~8%', tip: '비헴철이나 함량 높음', source: '식약처' },
  { name: '미역 (마른것)', iron: 2.81, type: '비헴철', absorb: '3~8%', tip: '나트륨·요오드 주의', source: '식약처' },
  { name: '시금치', iron: 2.03, type: '비헴철', absorb: '3~8%', tip: '비타민C·헴철과 함께', source: '식약처' },
  { name: '콩 (완두)', iron: 2.03, type: '비헴철', absorb: '3~8%', tip: '12개월 이후 권장', source: '식약처' },
  { name: '두부', iron: 1.41, type: '비헴철', absorb: '3~8%', tip: '칼슘 많아 철 흡수↓', source: '식약처' },
  { name: '닭가슴살', iron: 0.28, type: '헴철', absorb: '15~35%', tip: '철은 적지만 소화 쉬움', source: '식약처' },
  { name: '브로콜리', iron: 0.67, type: '비헴철', absorb: '3~8%', tip: '비타민C 동시 함유', source: '식약처' },
];

const IRON_COMBOS_GOOD = [
  { combo: '소고기죽 + 키위 퓨레', effect: '헴철 2.6mg + VC → 흡수 2~3배', badge: '최우선', timing: '같은 끼 또는 직후' },
  { combo: '시금치죽 + 딸기 + 닭고기', effect: '비헴철·VC·헴철 3종 시너지', badge: '추천', timing: '한 끼에 구성' },
  { combo: '오트밀 + 바나나 + 키위', effect: '철 4mg대 + VC 보충 아침', badge: '추천', timing: '우유와 분리' },
  { combo: '브로콜리 + 소고기 진밥', effect: 'VC·철 동시, 12개월+', badge: '좋음', timing: '저녁 이유식' },
  { combo: '달걀노른자 + 사과퓨레', effect: '헴철 고함량 + VC', badge: '좋음', timing: '7개월 이후 소량' },
  { combo: '미역국 + 소고기', effect: '비헴철+헴철, 12개월+', badge: '주의', timing: '나트륨 제한·소량' },
];

const IRON_COMBOS_BAD = [
  { combo: '철분 이유식 + 우유/치즈', reason: '칼슘 300mg대가 철 흡수 50% 이상 저해', tip: '우유·치즈는 1~2시간 후', severity: '높음' },
  { combo: '시금치죽 + 두유', reason: '칼슘·비헴철 경쟁 흡수', tip: '간식으로 분리', severity: '중간' },
  { combo: '고기 이유식 직후 분유', reason: '철분 흡수율 급감', tip: '이유식 60분 후 수유', severity: '높음' },
  { combo: '철분 식품 + 고칼슘 두부 대량', reason: '두부 1.4mg 철 + 칼슘 흡수 방해', tip: '두부는 별 끼, 고기 중심 끼 유지', severity: '중간' },
];

/** 월령별 철분 결핍 위험 & 대응 (교육용) */
const IRON_AGE_FACTS = [
  { age: '6개월~', risk: '태아 철 저장 고갈 시기', action: '철강화 미음·소고기 Early 도입 검토' },
  { age: '7~12개월', risk: '일일 11mg 필요 — 가장 높은 시기', action: '주 3~4회 헴철, VC 과일 동반' },
  { age: '12~24개월', risk: '우유 의존 시 철 결핍 흔함', action: '우유 500ml 이하, 고기·콩 유지' },
  { age: '24개월+', risk: '일일 7mg, 편식 시작', action: '오트밀·달걀·적색육 골고루' },
];

/** 철 결핍 의심 신호 (참고용, YMYL) */
const IRON_DEFICIENCY_SIGNS = [
  '피부 창백, 입술·잇몸 색 연함',
  '활력 저하, 쉽게 피로함',
  '식욕 감소, 성장 정체',
  '손톱 변형(反勺甲), 빈번한 감염',
];

/**
 * 2017 질병관리청 소아청소년 성장도표 — 체중(kg) 백분위
 * 월령 6~24개월, 남녀 각 P3/P15/P50/P85/P97
 */
const GROWTH_WEIGHT_BOY = {
  6:  { p3: 6.40, p15: 7.00, p50: 7.90, p85: 8.80, p97: 9.60 },
  7:  { p3: 6.80, p15: 7.40, p50: 8.30, p85: 9.20, p97: 10.00 },
  8:  { p3: 7.10, p15: 7.70, p50: 8.60, p85: 9.50, p97: 10.30 },
  9:  { p3: 7.30, p15: 7.90, p50: 8.80, p85: 9.70, p97: 10.50 },
  10: { p3: 7.50, p15: 8.10, p50: 9.00, p85: 9.90, p97: 10.70 },
  11: { p3: 7.60, p15: 8.20, p50: 9.10, p85: 10.00, p97: 10.80 },
  12: { p3: 7.70, p15: 8.30, p50: 9.20, p85: 10.10, p97: 10.90 },
  13: { p3: 7.80, p15: 8.40, p50: 9.30, p85: 10.20, p97: 11.00 },
  14: { p3: 7.90, p15: 8.50, p50: 9.40, p85: 10.30, p97: 11.10 },
  15: { p3: 8.00, p15: 8.60, p50: 9.50, p85: 10.40, p97: 11.20 },
  16: { p3: 8.10, p15: 8.70, p50: 9.60, p85: 10.50, p97: 11.30 },
  17: { p3: 8.20, p15: 8.80, p50: 9.70, p85: 10.60, p97: 11.40 },
  18: { p3: 8.30, p15: 8.90, p50: 9.80, p85: 10.70, p97: 11.50 },
  19: { p3: 8.40, p15: 9.00, p50: 9.90, p85: 10.80, p97: 11.60 },
  20: { p3: 8.45, p15: 9.05, p50: 9.95, p85: 10.85, p97: 11.65 },
  21: { p3: 8.50, p15: 9.10, p50: 10.00, p85: 10.90, p97: 11.70 },
  22: { p3: 8.60, p15: 9.20, p50: 10.10, p85: 11.00, p97: 11.80 },
  23: { p3: 8.65, p15: 9.25, p50: 10.15, p85: 11.05, p97: 11.85 },
  24: { p3: 8.70, p15: 9.30, p50: 10.20, p85: 11.10, p97: 11.90 },
};

const GROWTH_WEIGHT_GIRL = {
  6:  { p3: 5.80, p15: 6.40, p50: 7.30, p85: 8.20, p97: 9.00 },
  7:  { p3: 6.10, p15: 6.70, p50: 7.60, p85: 8.50, p97: 9.30 },
  8:  { p3: 6.40, p15: 7.00, p50: 7.90, p85: 8.80, p97: 9.60 },
  9:  { p3: 6.60, p15: 7.20, p50: 8.10, p85: 9.00, p97: 9.80 },
  10: { p3: 6.80, p15: 7.40, p50: 8.30, p85: 9.20, p97: 10.00 },
  11: { p3: 6.90, p15: 7.50, p50: 8.40, p85: 9.30, p97: 10.10 },
  12: { p3: 7.00, p15: 7.60, p50: 8.50, p85: 9.40, p97: 10.20 },
  13: { p3: 7.10, p15: 7.70, p50: 8.60, p85: 9.50, p97: 10.30 },
  14: { p3: 7.20, p15: 7.80, p50: 8.70, p85: 9.60, p97: 10.40 },
  15: { p3: 7.30, p15: 7.90, p50: 8.80, p85: 9.70, p97: 10.50 },
  16: { p3: 7.40, p15: 8.00, p50: 8.90, p85: 9.80, p97: 10.60 },
  17: { p3: 7.50, p15: 8.10, p50: 9.00, p85: 9.90, p97: 10.70 },
  18: { p3: 7.60, p15: 8.20, p50: 9.10, p85: 10.00, p97: 10.80 },
  19: { p3: 7.70, p15: 8.30, p50: 9.20, p85: 10.10, p97: 10.90 },
  20: { p3: 7.75, p15: 8.35, p50: 9.25, p85: 10.15, p97: 10.95 },
  21: { p3: 7.80, p15: 8.40, p50: 9.30, p85: 10.20, p97: 11.00 },
  22: { p3: 7.90, p15: 8.50, p50: 9.40, p85: 10.30, p97: 11.10 },
  23: { p3: 7.95, p15: 8.55, p50: 9.45, p85: 10.35, p97: 11.15 },
  24: { p3: 8.00, p15: 8.60, p50: 9.50, p85: 10.40, p97: 11.20 },
};

/**
 * 2017 KDCA 성장도표 — 신장(cm) 백분위, 6~24개월
 */
const GROWTH_HEIGHT_BOY = {
  6:  { p3: 63.5, p15: 66.0, p50: 68.4, p85: 70.7, p97: 72.8 },
  7:  { p3: 65.2, p15: 67.8, p50: 70.6, p85: 73.2, p97: 75.5 },
  8:  { p3: 66.8, p15: 69.5, p50: 72.5, p85: 75.2, p97: 77.5 },
  9:  { p3: 68.0, p15: 70.9, p50: 74.0, p85: 76.8, p97: 79.2 },
  10: { p3: 69.2, p15: 72.2, p50: 75.4, p85: 78.2, p97: 80.6 },
  11: { p3: 70.2, p15: 73.3, p50: 76.6, p85: 79.5, p97: 82.0 },
  12: { p3: 71.2, p15: 74.4, p50: 77.8, p85: 80.8, p97: 83.4 },
  13: { p3: 72.0, p15: 75.3, p50: 78.8, p85: 81.9, p97: 84.6 },
  14: { p3: 72.8, p15: 76.2, p50: 79.8, p85: 83.0, p97: 85.8 },
  15: { p3: 73.5, p15: 77.0, p50: 80.8, p85: 84.1, p97: 87.0 },
  16: { p3: 74.2, p15: 77.8, p50: 81.7, p85: 85.1, p97: 88.1 },
  17: { p3: 74.8, p15: 78.5, p50: 82.5, p85: 86.0, p97: 89.1 },
  18: { p3: 75.4, p15: 79.2, p50: 83.3, p85: 86.9, p97: 90.1 },
  19: { p3: 75.9, p15: 79.8, p50: 84.0, p85: 87.7, p97: 91.0 },
  20: { p3: 76.4, p15: 80.4, p50: 84.6, p85: 88.4, p97: 91.8 },
  21: { p3: 76.8, p15: 80.9, p50: 85.2, p85: 89.1, p97: 92.5 },
  22: { p3: 77.2, p15: 81.4, p50: 85.8, p85: 89.7, p97: 93.2 },
  23: { p3: 77.6, p15: 81.8, p50: 86.3, p85: 90.3, p97: 93.8 },
  24: { p3: 78.0, p15: 82.2, p50: 86.8, p85: 90.8, p97: 94.4 },
};

const GROWTH_HEIGHT_GIRL = {
  6:  { p3: 61.8, p15: 64.2, p50: 66.8, p85: 69.3, p97: 71.5 },
  7:  { p3: 63.4, p15: 66.0, p50: 68.8, p85: 71.4, p97: 73.8 },
  8:  { p3: 65.0, p15: 67.7, p50: 70.6, p85: 73.3, p97: 75.8 },
  9:  { p3: 66.2, p15: 69.0, p50: 72.2, p85: 75.0, p97: 77.5 },
  10: { p3: 67.4, p15: 70.3, p50: 73.6, p85: 76.5, p97: 79.1 },
  11: { p3: 68.4, p15: 71.4, p50: 74.9, p85: 77.9, p97: 80.6 },
  12: { p3: 69.4, p15: 72.5, p50: 76.1, p85: 79.2, p97: 82.0 },
  13: { p3: 70.2, p15: 73.4, p50: 77.2, p85: 80.4, p97: 83.3 },
  14: { p3: 71.0, p15: 74.3, p50: 78.2, p85: 81.5, p97: 84.5 },
  15: { p3: 71.8, p15: 75.2, p50: 79.2, p85: 82.6, p97: 85.7 },
  16: { p3: 72.5, p15: 76.0, p50: 80.1, p85: 83.6, p97: 86.8 },
  17: { p3: 73.1, p15: 76.7, p50: 80.9, p85: 84.5, p97: 87.8 },
  18: { p3: 73.7, p15: 77.4, p50: 81.7, p85: 85.4, p97: 88.8 },
  19: { p3: 74.2, p15: 78.0, p50: 82.4, p85: 86.2, p97: 89.7 },
  20: { p3: 74.7, p15: 78.5, p50: 83.0, p85: 86.9, p97: 90.5 },
  21: { p3: 75.1, p15: 79.0, p50: 83.6, p85: 87.6, p97: 91.2 },
  22: { p3: 75.5, p15: 79.4, p50: 84.1, p85: 88.2, p97: 91.9 },
  23: { p3: 75.9, p15: 79.8, p50: 84.6, p85: 88.8, p97: 92.5 },
  24: { p3: 76.2, p15: 80.2, p50: 85.0, p85: 89.3, p97: 93.1 },
};

/**
 * 월령별 철분 중심 7일 식단 예시 (교육용, 1끼 기준)
 * presetId: 프리셋 연동 (있으면 계산기 로드)
 */
const IRON_MEAL_PLANS_7DAY = [
  {
    id: '6m', label: '6개월', mealsPerDay: 1, ironTarget: '0.4mg/끼',
    days: [
      { dow: '월', meal: '쌀미음 + 단호박', ironSource: '단호박(비헴철)', vc: '—', note: '첫 이유식·알레르기 관찰' },
      { dow: '화', meal: '쌀미음 + 애호박', ironSource: '저철', vc: '—', note: '묽기 5단계' },
      { dow: '수', meal: '쌀미음 + 고구마', ironSource: '고구마(비헴철)', vc: '—', note: '변 상태 확인' },
      { dow: '목', meal: '쌀미음 + 당근', ironSource: '당근(비헴철)', vc: 'β카로틴', note: '당근 소량' },
      { dow: '금', meal: '쌀미음 + 소고기 5g', ironSource: '소고기(헴철)★', vc: '—', note: '철분 도입 시작', presetId: 'beef-veg' },
      { dow: '토', meal: '사과배퓨레', ironSource: '저철', vc: '사과 VC', note: '과일 단독·오후' },
      { dow: '일', meal: '쌀미음 + 브로콜리', ironSource: '브로콜리', vc: '브로콜리 VC', note: 'VC로 철 흡수 보조' },
    ],
  },
  {
    id: '7-8m', label: '7~8개월', mealsPerDay: 2, ironTarget: '1.65mg/끼',
    days: [
      { dow: '월', meal: '닭가슴살죽', ironSource: '닭(헴철)', vc: '—', note: '부드러운 육류 도입', presetId: 'chicken-broccoli' },
      { dow: '화', meal: '오트밀바나나키위', ironSource: '오트밀(4mg)★', vc: '키위 VC', note: '철분 강한 아침', presetId: 'oat-banana-kiwi' },
      { dow: '수', meal: '달걀노른자죽', ironSource: '노른자(헴철)★', vc: '—', note: '7M+ 소량·알레르기 주의', presetId: 'egg-yolk-rice' },
      { dow: '목', meal: '단호박죽 + 사과', ironSource: '단호박', vc: '사과 VC', note: 'VC 동반' },
      { dow: '금', meal: '소고기야채죽', ironSource: '소고기(헴철)★', vc: '—', note: '주 2회 헴철', presetId: 'beef-veg' },
      { dow: '토', meal: '닭가슴살 브로콜리죽', ironSource: '닭+브로콜리', vc: '브로콜리 VC', presetId: 'chicken-broccoli' },
      { dow: '일', meal: '고구마죽 + 바나나', ironSource: '고구마', vc: '바나나', note: '우유·분유 1시간 후' },
    ],
  },
  {
    id: '9-11m', label: '9~11개월', mealsPerDay: 2, ironTarget: '1.65mg/끼',
    days: [
      { dow: '월', meal: '소고기야채죽 + 키위', ironSource: '소고기★', vc: '키위 VC', note: '최적 조합', presetId: 'beef-veg' },
      { dow: '화', meal: '닭가슴살 브로콜리죽', ironSource: '닭+브로콜리', vc: '브로콜리 VC', presetId: 'chicken-broccoli' },
      { dow: '수', meal: '두부시금치죽 + 딸기', ironSource: '시금치(비헴철)', vc: '딸기 VC', note: '두부 소량·칼슘 주의', presetId: 'tofu-spinach' },
      { dow: '목', meal: '연어브로콜리', ironSource: '연어(헴철)', vc: '브로콜리', presetId: 'salmon-broccoli' },
      { dow: '금', meal: '오트밀 + 바나나 + 키위', ironSource: '오트밀★', vc: '키위 VC', presetId: 'oat-banana-kiwi' },
      { dow: '토', meal: '소고기진밥 + 애호박', ironSource: '소고기★', vc: '—', note: '진밥 단계' },
      { dow: '일', meal: '달걀노른자밥 + 사과', ironSource: '노른자★', vc: '사과 VC', presetId: 'egg-yolk-rice' },
    ],
  },
  {
    id: '12-18m', label: '12~18개월', mealsPerDay: 3, ironTarget: '1.05mg/끼',
    days: [
      { dow: '월', meal: '미역죽 + 소고기', ironSource: '미역+소고기★', vc: '—', note: '나트륨 제한', presetId: 'seaweed-rice' },
      { dow: '화', meal: '콩나물밥죽 + 키위', ironSource: '콩나물', vc: '키위 VC', presetId: 'bean-sprout' },
      { dow: '수', meal: '소고기야채진밥', ironSource: '소고기★', vc: '—', presetId: 'beef-veg' },
      { dow: '목', meal: '닭가슴살 브로콜리밥', ironSource: '닭+브로콜리', vc: 'VC', presetId: 'chicken-broccoli' },
      { dow: '금', meal: '오트밀아침 + 딸기', ironSource: '오트밀★', vc: '딸기 VC', presetId: 'oat-banana-kiwi' },
      { dow: '토', meal: '두부시금치밥 (두부 소량)', ironSource: '시금치', vc: '—', presetId: 'tofu-spinach' },
      { dow: '일', meal: '연어야채밥 + 사과', ironSource: '연어', vc: '사과 VC', presetId: 'salmon-broccoli' },
    ],
  },
  {
    id: '19-24m', label: '19~24개월', mealsPerDay: 3, ironTarget: '1.05mg/끼',
    days: [
      { dow: '월', meal: '소고기야채무른밥', ironSource: '소고기★', vc: '—', note: '우유 500ml 이하', presetId: 'beef-veg' },
      { dow: '화', meal: '달걀노른자밥 + 키위', ironSource: '노른자★', vc: '키위 VC', presetId: 'egg-yolk-rice' },
      { dow: '수', meal: '콩나물밥 + 시금치', ironSource: '콩+시금치', vc: '—', presetId: 'bean-sprout' },
      { dow: '목', meal: '닭고기브로콜리밥', ironSource: '닭+브로콜리', vc: 'VC', presetId: 'chicken-broccoli' },
      { dow: '금', meal: '오트밀 + 바나나 (우유 X)', ironSource: '오트밀★', vc: '—', note: '철분 식사와 우유 분리', presetId: 'oat-banana-kiwi' },
      { dow: '토', meal: '미역국밥 + 소고기', ironSource: '미역+소고기★', vc: '—', presetId: 'seaweed-rice' },
      { dow: '일', meal: '연어야채밥 + 딸기', ironSource: '연어', vc: '딸기 VC', presetId: 'salmon-broccoli' },
    ],
  },
];

/** 철분 권장 기준 출처 (한국영양학회 2020) */
const IRON_DRI_REFERENCE = {
  under7: { mg: 0.27, note: '0~6개월 AI (모유)' },
  infant: { mg: 11, note: '7~12개월 RDA' },
  toddler: { mg: 7, note: '1~3세 RDA' },
  mealRatio: 0.45,
  mealsPerDay: 3,
};