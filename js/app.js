/**
 * 아기한끼 계산기 (BabyMeal Calculator)
 * 분량 · 영양 · 철분 · 성장곡선
 */
(function () {
  'use strict';

  // 전환 계측 정상화: 실사용자 입력/클릭 후 + 버스트당 1회만 agihanki_calc 발화 (페이지로드/입력 부풀림 방지)
  var __ac_acted = false, __ac_t = null;
  document.addEventListener('input', function(){ __ac_acted = true; }, true);
  document.addEventListener('change', function(){ __ac_acted = true; }, true);
  document.addEventListener('click', function(){ __ac_acted = true; }, true);
  function __fireAgihankiCalc(){
    if (!__ac_acted || typeof gtag !== "function") return;
    clearTimeout(__ac_t);
    __ac_t = setTimeout(function(){ try { gtag("event", "agihanki_calc", {}); } catch(e){} }, 1200);
  }

  /**
   * 월령별 참고치. perMeal/kcalDaily/kcalPerMeal = 이유식(고형식) 몫에 대한
   * 본 계산기의 자체 정리 참고치 (2025 한국인 영양소 섭취기준의 일일 총
   * 에너지필요추정량: 0~5개월 500 / 6~11개월 600 / 1~2세 900 kcal).
   * ironDaily·proteinDaily = 2025 한국인 영양소 섭취기준 권장섭취량(일일 총량).
   */
  const AGE_GUIDE = [
    { id: '6m', label: '6개월', months: 6, perMeal: 70, mealsPerDay: 1, kcalDaily: 200, kcalPerMeal: 100, ironDaily: 6, proteinDaily: 15, consistency: '묽은 미음', refWeightKg: 7.3 },
    { id: '7-8m', label: '7~8개월', months: 7, perMeal: 90, mealsPerDay: 2, kcalDaily: 350, kcalPerMeal: 120, ironDaily: 6, proteinDaily: 15, consistency: '미음~죽', refWeightKg: 8.0 },
    { id: '9-11m', label: '9~11개월', months: 10, perMeal: 125, mealsPerDay: 2, kcalDaily: 500, kcalPerMeal: 180, ironDaily: 6, proteinDaily: 15, consistency: '죽~진죽', refWeightKg: 8.9 },
    { id: '12-18m', label: '12~18개월', months: 15, perMeal: 175, mealsPerDay: 3, kcalDaily: 900, kcalPerMeal: 250, ironDaily: 6, proteinDaily: 20, consistency: '진죽~무른밥', refWeightKg: 9.5 },
    { id: '19-24m', label: '19~24개월', months: 21, perMeal: 225, mealsPerDay: 3, kcalDaily: 900, kcalPerMeal: 300, ironDaily: 6, proteinDaily: 20, consistency: '무른밥·반찬', refWeightKg: 10.0 },
  ];

  const UNITS = ['g', 'ml', '개', '작은술', '큰술'];
  const UNIT_TO_G = { g: 1, ml: 1, 개: 50, '작은술': 5, '큰술': 15 };
  /** 묽은 죽~진죽의 일반적 추정 밀도 (약 1.0~1.05 g/ml, 자체 적용 대표값) */
  const BABY_FOOD_DENSITY = 1.03;

  const PRESETS = [
    { id: 'beef-veg', name: '소고기야채죽', emoji: '🥩', ironStar: true, servings: 3, age: '9-11m',
      ingredients: [{ db: '멥쌀', amount: 60 }, { db: '소고기_다짐육', amount: 45 }, { db: '당근', amount: 30 }, { db: '애호박', amount: 30 }] },
    { id: 'chicken-broccoli', name: '닭가슴살 브로콜리죽', emoji: '🍗', ironStar: true, servings: 3, age: '9-11m',
      ingredients: [{ db: '멥쌀', amount: 50 }, { db: '닭가슴살', amount: 40 }, { db: '브로콜리', amount: 40 }] },
    { id: 'pumpkin', name: '단호박죽', emoji: '🎃', servings: 3, age: '6m',
      ingredients: [{ db: '멥쌀', amount: 30 }, { db: '단호박_찐', amount: 80 }] },
    { id: 'tofu-spinach', name: '두부시금치죽', emoji: '🥬', ironStar: true, servings: 3, age: '9-11m',
      ingredients: [{ db: '멥쌀', amount: 40 }, { db: '두부', amount: 50 }, { db: '시금치', amount: 25 }] },
    { id: 'oat-banana-kiwi', name: '오트밀바나나키위', emoji: '🍌', ironStar: true, servings: 3, age: '7-8m',
      ingredients: [{ db: '오트밀', amount: 30 }, { db: '바나나', amount: 50 }, { db: '키위', amount: 30 }] },
    { id: 'salmon-broccoli', name: '연어브로콜리', emoji: '🐟', servings: 3, age: '9-11m',
      ingredients: [{ db: '연어', amount: 40 }, { db: '브로콜리', amount: 40 }, { db: '감자', amount: 60 }] },
    { id: 'sweet-potato', name: '고구마죽', emoji: '🍠', servings: 3, age: '6m',
      ingredients: [{ db: '멥쌀', amount: 25 }, { db: '고구마_찐', amount: 80 }] },
    { id: 'egg-yolk-rice', name: '달걀노른자죽', emoji: '🥚', ironStar: true, servings: 3, age: '7-8m',
      ingredients: [{ db: '멥쌀', amount: 40 }, { db: '달걀노른자', amount: 18 }] },
    { id: 'seaweed-rice', name: '미역죽', emoji: '🌊', ironStar: true, servings: 3, age: '12-18m',
      ingredients: [{ db: '멥쌀', amount: 50 }, { db: '미역', amount: 5 }, { db: '소고기_다짐육', amount: 30 }] },
    { id: 'apple-pear', name: '사과배퓨레', emoji: '🍎', servings: 3, age: '6m',
      ingredients: [{ db: '사과', amount: 80 }, { db: '바나나', amount: 40 }] },
    { id: 'bean-sprout', name: '콩나물밥죽', emoji: '🌱', servings: 3, age: '12-18m',
      ingredients: [{ db: '멥쌀', amount: 50 }, { db: '콩나물', amount: 40 }] },
    { id: 'zucchini-carrot', name: '애호박당근죽', emoji: '🥕', servings: 3, age: '6m',
      ingredients: [{ db: '멥쌀', amount: 30 }, { db: '애호박', amount: 40 }, { db: '당근', amount: 30 }] },
  ];

  const STORAGE_KEY = 'babyMealCalc_v2';
  const CUSTOM_NUTRIENT_KEY = 'babyMealCustomNutrients';
  const FORM_STATE_KEY = 'babyMealFormState';
  let macroChart = null;
  let showTabFn = null;
  let customNutrients = {};
  let activeModalRow = null;
  let dbEntriesCache = null;
  let chartJsPromise = null;
  let lastCalcSnapshot = null;
  let syncingWeight = false;

  // ─── 유틸 ───────────────────────────────────────────────

  const FRACTIONS = [[1,8],[1,6],[1,5],[1,4],[1,3],[1,2],[2,3],[3,4]];

  function parseNum(v) { const n = parseFloat(String(v).replace(/,/g, '')); return isNaN(n) ? 0 : n; }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function invalidateDbCache() { dbEntriesCache = null; }

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.from((c || document).querySelectorAll(s)); }

  function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function escapeAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

  function formatAmount(value, unit) {
    if (value == null || isNaN(value)) return '—';
    const v = Math.round(value * 1000) / 1000;
    if (unit === '개') return (Math.abs(v - Math.round(v)) < 0.1 ? Math.round(v) : formatPretty(v)) + unit;
    const intP = Math.floor(v), frac = v - intP;
    if (frac < 0.02) return intP + unit;
    for (const [n, d] of FRACTIONS) {
      if (Math.abs(frac - n/d) < 0.04) {
        const fs = (n===1&&d===2?'1/2':n+'/'+d);
        return intP > 0 ? intP + ' ' + fs + unit : fs + unit;
      }
    }
    return (v < 10 ? formatPretty(v) : Math.round(v*10)/10) + unit;
  }

  function formatPretty(n) { const r = Math.round(n*10)/10; return r%1===0 ? String(r) : r.toFixed(1); }

  function normalize(str) {
    return String(str).toLowerCase().replace(/\s+/g,'').replace(/_/g,'');
  }

  function toGrams(amount, unit) {
    return amount * (UNIT_TO_G[unit] || 1);
  }

  function toMlFromPortion(total, unit) {
    return unit === 'ml' ? total : total / BABY_FOOD_DENSITY;
  }

  function toGFromPortion(total, unit) {
    return unit === 'g' ? total : total * BABY_FOOD_DENSITY;
  }

  // ─── DB 매칭 (fuzzy) ─────────────────────────────────────

  function getAllDbEntries() {
    if (dbEntriesCache) return dbEntriesCache;
    const entries = [];
    Object.keys(nutrientDB).forEach((key) => {
      entries.push({ key, label: key.replace(/_/g,' '), data: nutrientDB[key] });
      (nutrientDB[key].aliases || []).forEach((a) => entries.push({ key, label: a, data: nutrientDB[key] }));
    });
    Object.keys(customNutrients).forEach((key) => {
      entries.push({ key: '__custom__'+key, label: key, data: customNutrients[key], custom: true });
    });
    dbEntriesCache = entries;
    return entries;
  }

  function fuzzyScore(query, target) {
    const q = normalize(query), t = normalize(target);
    if (!q) return 0;
    if (t === q) return 100;
    if (t.includes(q)) return 80 - (t.length - q.length);
    let score = 0;
    for (const ch of q) if (t.includes(ch)) score += 5;
    return score;
  }

  function findBestMatch(name) {
    if (!name) return null;
    let best = null, bestScore = 0;
    getAllDbEntries().forEach((e) => {
      const s = Math.max(fuzzyScore(name, e.label), fuzzyScore(name, e.key));
      if (s > bestScore) { bestScore = s; best = e; }
    });
    return bestScore >= 20 ? best : null;
  }

  function getNutrientData(row) {
    const dbKey = row.dataset.dbKey;
    const customName = row.dataset.customName;
    if (dbKey && nutrientDB[dbKey]) return { ...nutrientDB[dbKey], _key: dbKey };
    if (customName && customNutrients[customName]) return { ...customNutrients[customName], _key: customName, custom: true };
    const name = $('.ing-name', row)?.value.trim();
    const match = findBestMatch(name);
    if (match) {
      row.dataset.dbKey = match.custom ? '' : match.key;
      row.dataset.customName = match.custom ? match.label : '';
      return { ...match.data, _key: match.key };
    }
    return null;
  }

  // ─── 영양 계산 ───────────────────────────────────────────

  function calcNutrientsForRow(row, ratio) {
    const amount = parseNum($('.ing-amount', row)?.value);
    const unit = $('.ing-unit', row)?.value || 'g';
    const grams = toGrams(amount, unit) * ratio;
    const data = getNutrientData(row);
    if (!data || grams <= 0) return null;
    const f = grams / 100;
    return {
      name: $('.ing-name', row)?.value.trim() || data._key,
      grams,
      kcal: data.kcal * f,
      protein: data.protein * f,
      carbs: data.carbs * f,
      fat: data.fat * f,
      fiber: data.fiber * f,
      iron: data.iron * f,
      note: data.note || '',
      vitC: data.vitC || VIT_C_KEYWORDS.some((k) => normalize($('.ing-name', row)?.value).includes(normalize(k))),
      inhibitor: data.inhibitor || IRON_INHIBITORS.some((k) => ($('.ing-name', row)?.value || '').includes(k)),
      heme: (data.note || '').includes('헴철'),
    };
  }

  function estimateAbsorbedIron(items, hasVitC, hasInhibitor) {
    let absorbed = 0;
    items.forEach((it) => {
      if (!it) return;
      let rate = it.heme ? 0.25 : 0.05;
      if (!it.heme && (hasVitC || it.vitC)) rate = 0.15;
      if (hasInhibitor) rate *= 0.5;
      absorbed += it.iron * rate;
    });
    return absorbed;
  }

  function getWeightFactor() {
    const w = parseNum($('#baby-weight')?.value);
    const age = getAgeGuide($('#age-select')?.value);
    if (!w || w <= 0) return 1;
    return Math.min(Math.max(w / age.refWeightKg, 0.75), 1.25);
  }

  function getAgeGuide(id) {
    return AGE_GUIDE.find((a) => a.id === id) || AGE_GUIDE[2];
  }

  /**
   * 월령 기반 철분 권장량 — 2025 한국인 영양소 섭취기준 (보건복지부·한국영양학회)
   * 0~5개월 충분섭취량 0.3 / 6~11개월 권장섭취량 6 / 1~2세 권장섭취량 6 mg/일
   * 1끼 목표 = (일일 권장 × 45%) ÷ 월령별 끼 수 — 45%는 "이유식으로 충당하는
   * 비율"에 대한 본 계산기의 자체 가정이며 공식 기준이 아님.
   * (weightKg 인자는 호환을 위해 유지하나 권장량 산정에 사용하지 않음 —
   *  체중×1.0mg 보정은 공식 기준에 없는 휴리스틱이라 제거됨)
   */
  function calculateIronNeeds(ageMonths, weightKg, mealsPerDay) {
    const ref = typeof IRON_DRI_REFERENCE !== 'undefined' ? IRON_DRI_REFERENCE : null;
    let dailyIron = ageMonths < 6 ? 0.3 : 6;
    if (ref) {
      dailyIron = ageMonths < 6 ? ref.under6.mg : (ageMonths <= 11 ? ref.infant.mg : ref.toddler.mg);
    }
    const ratio = ref ? ref.mealRatio : 0.45;
    const meals = Math.max(mealsPerDay || (ref ? ref.mealsPerDay : 3), 1);
    const oneMealIron = (dailyIron * ratio) / meals;
    return {
      dailyIron: Math.round(dailyIron * 100) / 100,
      oneMealIron: Math.round(oneMealIron * 100) / 100,
      mealsPerDay: meals,
    };
  }

  function getBabyWeightKg(age) {
    const w = parseNum($('#baby-weight')?.value);
    return w > 0 ? w : age.refWeightKg;
  }

  function getIronNeedsForAge(age, weightKg) {
    const w = weightKg > 0 ? weightKg : age.refWeightKg;
    return calculateIronNeeds(age.months, w, age.mealsPerDay);
  }

  function getRecommended(age, wf) {
    const meals = age.mealsPerDay;
    const iron = getIronNeedsForAge(age, getBabyWeightKg(age));
    return {
      kcal: Math.round(age.kcalPerMeal * wf),
      protein: Math.round((age.proteinDaily / meals) * wf * 10) / 10,
      iron: iron.oneMealIron,
      ironDaily: iron.dailyIron,
      volume: Math.round(age.perMeal * wf),
    };
  }

  // ─── 성장 백분위 ─────────────────────────────────────────

  function getGrowthTable(metric, gender) {
    if (metric === 'height') {
      return gender === 'girl' ? GROWTH_HEIGHT_GIRL : GROWTH_HEIGHT_BOY;
    }
    return gender === 'girl' ? GROWTH_WEIGHT_GIRL : GROWTH_WEIGHT_BOY;
  }

  function getGrowthData(months, gender, metric) {
    const table = getGrowthTable(metric || 'weight', gender);
    if (!table) return null;
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
    let closest = keys[0];
    keys.forEach((k) => { if (Math.abs(k - months) <= Math.abs(closest - months)) closest = k; });
    return table[closest];
  }

  function estimatePercentile(value, months, gender, metric) {
    const g = getGrowthData(months, gender, metric);
    if (!g || !value) return null;
    const pts = [
      { p: 3, w: g.p3 }, { p: 15, w: g.p15 }, { p: 50, w: g.p50 },
      { p: 85, w: g.p85 }, { p: 97, w: g.p97 },
    ];
    if (value <= pts[0].w) return 3;
    if (value >= pts[4].w) return 97;
    for (let i = 0; i < pts.length - 1; i++) {
      if (value >= pts[i].w && value <= pts[i + 1].w) {
        const t = (value - pts[i].w) / (pts[i + 1].w - pts[i].w);
        return Math.round(pts[i].p + t * (pts[i + 1].p - pts[i].p));
      }
    }
    return 50;
  }

  function growthStatus(p, metric) {
    if (p == null) return { label: '—', color: 'text-gray-500' };
    const low = metric === 'height' ? '저신장' : '저체중';
    const high = metric === 'height' ? '고신장' : '과체중';
    const lowBorder = metric === 'height' ? '경계 저신장' : '경계 저체중';
    const highBorder = metric === 'height' ? '경계 고신장' : '경계 과체중';
    if (p < 3) return { label: `${low} (P<3)`, color: 'text-red-600' };
    if (p < 15) return { label: `${lowBorder} (P3~15)`, color: 'text-amber-600' };
    if (p > 97) return { label: `${high} (P>97)`, color: 'text-red-600' };
    if (p > 85) return { label: `${highBorder} (P85~97)`, color: 'text-amber-600' };
    return { label: '정상 범위 (P15~85)', color: 'text-green-600' };
  }

  function getRefHeightCm(months, gender) {
    const g = getGrowthData(months, gender, 'height');
    return g ? g.p50 : null;
  }

  // ─── DOM refs ─────────────────────────────────────────────

  const els = {
    ingredientBody: $('#ingredient-body'),
    resultSection: $('#result-section'),
    resultBody: $('#result-body'),
    resultSummary: $('#result-summary'),
    nutritionPanel: $('#nutrition-panel'),
    ironHighlight: $('#iron-highlight'),
    macroCanvas: $('#macro-chart'),
    progressBars: $('#progress-bars'),
    absorptionBadge: $('#absorption-badge'),
    recentList: $('#recent-list'),
    guideTableBody: $('#guide-table-body'),
    growthResult: $('#growth-result'),
    cubeResult: $('#cube-result'),
    presetGrid: $('#preset-grid'),
    allergyList: $('#allergy-list'),
    ironGuideTable: $('#iron-guide-table'),
    ironCombosGood: $('#iron-combos-good'),
    ironCombosBad: $('#iron-combos-bad'),
    ironAgeFacts: $('#iron-age-facts'),
    ironDeficiencySigns: $('#iron-deficiency-signs'),
    growthChartTable: $('#growth-chart-table'),
    dbVersionBadge: $('#db-version-badge'),
    ironMealPlanTabs: $('#iron-meal-plan-tabs'),
    ironMealPlanBody: $('#iron-meal-plan-body'),
    ironMealPlanMeta: $('#iron-meal-plan-meta'),
    nutrientModal: $('#nutrient-modal'),
    mobileMenuBtn: $('#mobile-menu-btn'),
    mobileNav: $('#mobile-nav'),
    ironGradeBadge: $('#iron-grade-badge'),
  };

  // ─── 탭 ─────────────────────────────────────────────────

  function initTabs() {
    const tabs = $$('.nav-tab');
    function showTab(id) {
      tabs.forEach((t) => {
        const on = t.dataset.tab === id;
        t.classList.toggle('active', on);
        if (t.hasAttribute('aria-selected')) t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      $$('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + id));
      els.mobileNav?.classList.add('hidden');
      history.replaceState(null, '', '#' + id);
    }
    showTabFn = showTab;
    tabs.forEach((t) => t.addEventListener('click', (e) => { e.preventDefault(); showTab(t.dataset.tab); }));
    document.addEventListener('click', (e) => {
      const l = e.target.closest('[data-tab]');
      if (l && !l.classList.contains('nav-tab')) { e.preventDefault(); showTab(l.dataset.tab); }
    });
    const valid = ['calculator','growth','portion','presets','iron','faq'];
    const hash = location.hash.slice(1);
    showTab(valid.includes(hash) ? hash : 'calculator');
  }

  function switchTab(id) { if (showTabFn) showTabFn(id); }

  // ─── 재료 행 ─────────────────────────────────────────────

  function unitOptions(sel) {
    return UNITS.map((u) => `<option value="${u}"${u===sel?' selected':''}>${u}</option>`).join('');
  }

  function createIngredientRow(data) {
    data = data || { name: '', amount: '', unit: 'g', db: '' };
    const tr = document.createElement('tr');
    tr.className = 'ingredient-row border-b border-orange-100';
    if (data.db) tr.dataset.dbKey = data.db;
    tr.innerHTML = `
      <td class="py-2 pr-1 relative">
        <input type="text" class="ing-name w-full px-3 py-2 rounded-lg border border-orange-200 text-sm" placeholder="재료명" value="${escapeAttr(data.name || (data.db ? data.db.replace(/_/g,' ') : ''))}" autocomplete="off">
        <div class="autocomplete-list hidden absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"></div>
      </td>
      <td class="py-2 pr-1"><input type="number" inputmode="decimal" class="ing-amount w-full px-2 py-2 rounded-lg border border-orange-200 text-sm" min="0" step="any" value="${data.amount !== '' ? data.amount : ''}"></td>
      <td class="py-2 pr-1"><select class="ing-unit w-full px-2 py-2 rounded-lg border border-orange-200 text-sm">${unitOptions(data.unit || 'g')}</select></td>
      <td class="py-2 text-center whitespace-nowrap">
        <button type="button" class="custom-nutrient-btn text-xs text-teal-600 hover:underline px-1 py-2" title="영양값 직접입력" aria-label="영양값 직접입력"><span class="hidden sm:inline">직접입력</span><span class="sm:hidden">✎</span></button>
        <button type="button" class="remove-row text-red-400 hover:text-red-600 p-2" aria-label="삭제">✕</button>
      </td>`;

    const nameInput = $('.ing-name', tr);
    const acList = $('.autocomplete-list', tr);

    nameInput.addEventListener('input', () => {
      delete tr.dataset.dbKey; delete tr.dataset.customName;
      showAutocomplete(nameInput, acList);
      calculateDebounced();
    });
    nameInput.addEventListener('blur', () => setTimeout(() => acList.classList.add('hidden'), 200));
    nameInput.addEventListener('focus', () => showAutocomplete(nameInput, acList));

    tr.querySelectorAll('.ing-amount, .ing-unit').forEach((el) => {
      el.addEventListener('input', calculateDebounced);
      el.addEventListener('change', calculate);
    });
    $('.remove-row', tr).addEventListener('click', () => { tr.remove(); calculate(); });
    $('.custom-nutrient-btn', tr).addEventListener('click', () => openNutrientModal(tr));
    return tr;
  }

  function showAutocomplete(input, listEl) {
    const q = input.value.trim();
    if (q.length < 1) { listEl.classList.add('hidden'); return; }
    const matches = getAllDbEntries()
      .map((e) => ({ ...e, score: Math.max(fuzzyScore(q, e.label), fuzzyScore(q, e.key)) }))
      .filter((e) => e.score >= 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    if (!matches.length) { listEl.classList.add('hidden'); return; }
    listEl.innerHTML = matches.map((m) =>
      `<button type="button" class="ac-item w-full text-left px-3 py-2 text-sm hover:bg-orange-50 border-b border-orange-50 last:border-0" data-key="${escapeAttr(m.custom ? '' : m.key)}" data-label="${escapeAttr(m.label)}" data-custom="${m.custom ? '1' : '0'}">${escapeHtml(m.label)}${m.data.iron ? ` <span class="text-xs text-gray-400">철 ${m.data.iron}mg/100g</span>` : ''}</button>`
    ).join('');
    listEl.classList.remove('hidden');
    listEl.querySelectorAll('.ac-item').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const row = input.closest('.ingredient-row');
        input.value = btn.dataset.label;
        if (btn.dataset.custom === '1') {
          row.dataset.customName = btn.dataset.label;
          delete row.dataset.dbKey;
        } else {
          row.dataset.dbKey = btn.dataset.key;
          delete row.dataset.customName;
        }
        listEl.classList.add('hidden');
        calculate();
      });
    });
  }

  function getIngredients() {
    return $$('.ingredient-row', els.ingredientBody).map((row) => ({
      name: $('.ing-name', row).value.trim(),
      amount: parseNum($('.ing-amount', row).value),
      unit: $('.ing-unit', row).value,
      dbKey: row.dataset.dbKey,
    })).filter((i) => i.name || i.amount > 0);
  }

  function setIngredients(list) {
    els.ingredientBody.innerHTML = '';
    (list.length ? list : [{ name: '', amount: '', unit: 'g' }]).forEach((ing) => {
      const row = createIngredientRow({
        name: ing.db ? undefined : ing.name,
        db: ing.db || ing.dbKey,
        amount: ing.amount,
        unit: ing.unit || 'g',
      });
      els.ingredientBody.appendChild(row);
    });
  }

  // ─── 영양 모달 ───────────────────────────────────────────

  function loadCustomNutrients() {
    try { customNutrients = JSON.parse(localStorage.getItem(CUSTOM_NUTRIENT_KEY) || '{}'); }
    catch (_) { customNutrients = {}; }
    invalidateDbCache();
  }

  function openNutrientModal(row) {
    activeModalRow = row;
    const name = $('.ing-name', row).value.trim() || '새 재료';
    $('#modal-food-name').value = name;
    const existing = customNutrients[name];
    $('#modal-kcal').value = existing?.kcal ?? '';
    $('#modal-protein').value = existing?.protein ?? '';
    $('#modal-carbs').value = existing?.carbs ?? '';
    $('#modal-fat').value = existing?.fat ?? '';
    $('#modal-fiber').value = existing?.fiber ?? '';
    $('#modal-iron').value = existing?.iron ?? '';
    els.nutrientModal?.classList.remove('hidden');
  }

  function closeNutrientModal() {
    els.nutrientModal?.classList.add('hidden');
    activeModalRow = null;
  }

  function saveCustomNutrient() {
    const name = $('#modal-food-name').value.trim();
    if (!name) return;
    customNutrients[name] = {
      kcal: parseNum($('#modal-kcal').value),
      protein: parseNum($('#modal-protein').value),
      carbs: parseNum($('#modal-carbs').value),
      fat: parseNum($('#modal-fat').value),
      fiber: parseNum($('#modal-fiber').value),
      iron: parseNum($('#modal-iron').value),
      note: '직접입력',
    };
    localStorage.setItem(CUSTOM_NUTRIENT_KEY, JSON.stringify(customNutrients));
    invalidateDbCache();
    if (activeModalRow) {
      $('.ing-name', activeModalRow).value = name;
      activeModalRow.dataset.customName = name;
      delete activeModalRow.dataset.dbKey;
    }
    closeNutrientModal();
    calculate();
  }

  // ─── Chart.js (lazy load) ─────────────────────────────────

  function loadChartJs() {
    if (typeof Chart !== 'undefined') return Promise.resolve();
    if (chartJsPromise) return chartJsPromise;
    chartJsPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { chartJsPromise = null; reject(new Error('Chart.js load failed')); };
      document.head.appendChild(s);
    });
    return chartJsPromise;
  }

  function renderMacroChart(protein, carbs, fat) {
    if (!els.macroCanvas) return;
    loadChartJs().then(() => {
      if (typeof Chart === 'undefined') return;
      const pK = protein * 4, cK = carbs * 4, fK = fat * 9;
      const total = pK + cK + fK || 1;
      if (macroChart) macroChart.destroy();
      macroChart = new Chart(els.macroCanvas, {
        type: 'pie',
        data: {
          labels: ['단백질', '탄수화물', '지방'],
          datasets: [{ data: [pK, cK, fK], backgroundColor: ['#7eb89a', '#ffd4b8', '#e8d4f0'], borderWidth: 2 }],
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${Math.round(ctx.raw/total*100)}%` } },
          },
        },
      });
    }).catch(() => {});
  }

  function getIronGrade(ironPct, absPct) {
    const score = Math.max(ironPct, Math.round(absPct * 0.85));
    if (score >= 80) return { grade: 'A', label: '철분 우수', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 60) return { grade: 'B', label: '철분 양호', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 40) return { grade: 'C', label: '철분 보통', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { grade: 'D', label: '철분 부족', color: 'bg-red-100 text-red-800 border-red-200' };
  }

  function renderProgressBars(totals, rec) {
    if (!els.progressBars) return;
    const items = [
      { label: '열량', val: totals.kcal, rec: rec.kcal, unit: 'kcal', color: 'bg-orange-400' },
      { label: '단백질', val: totals.protein, rec: rec.protein, unit: 'g', color: 'bg-sage' },
      { label: '철분', val: totals.iron, rec: rec.iron, unit: 'mg', color: 'bg-red-400', highlight: true },
      { label: '식이섬유', val: totals.fiber, rec: 3, unit: 'g', color: 'bg-mint' },
    ];
    els.progressBars.innerHTML = items.map((it) => {
      const pct = it.rec > 0 ? Math.min(Math.round(it.val / it.rec * 100), 150) : 0;
      const w = Math.min(pct, 100);
      return `<div class="${it.highlight ? 'ring-2 ring-red-200 rounded-xl p-3 bg-red-50/50' : ''}">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-medium${it.highlight ? ' text-red-700' : ''}">${it.label}</span>
          <span>${formatPretty(it.val)}${it.unit} / ${it.rec}${it.unit} <strong>(${pct}%)</strong></span>
        </div>
        <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div class="${it.color} h-full rounded-full transition-all" style="width:${w}%"></div>
        </div>
      </div>`;
    }).join('');
  }

  // ─── 메인 계산 ───────────────────────────────────────────

  function calculate() {
    const orig = Math.max(parseNum($('#original-servings')?.value), 0.1);
    const target = Math.max(parseNum($('#target-servings')?.value), 0.1);
    const ratio = target / orig;
    const age = getAgeGuide($('#age-select')?.value);
    const wf = getWeightFactor();
    const rec = getRecommended(age, wf);
    const rows = $$('.ingredient-row', els.ingredientBody);

    if (!rows.length) { els.resultSection?.classList.add('hidden'); return; }

    const nutItems = [];
    els.resultBody.innerHTML = rows.map((row) => {
      const name = $('.ing-name', row).value.trim() || '(재료)';
      const amount = parseNum($('.ing-amount', row).value);
      const unit = $('.ing-unit', row).value;
      const scaled = amount * ratio;
      const ni = calcNutrientsForRow(row, ratio);
      if (ni) nutItems.push(ni);
      const ironBadge = ni?.iron > 0.3 ? '<span class="text-xs text-red-500 ml-1">Fe</span>' : '';
      return `<tr class="border-b border-orange-50 hover:bg-orange-50/40">
        <td class="py-2 px-2 font-medium">${escapeHtml(name)}${ironBadge}</td>
        <td class="py-2 px-2 text-gray-500">${formatAmount(amount, unit)}</td>
        <td class="py-2 px-2 text-orange-600 font-semibold">${formatAmount(scaled, unit)}</td>
        <td class="py-2 px-2 text-xs text-gray-500 hidden sm:table-cell">${ni ? formatPretty(ni.iron)+'mg' : '—'}</td>
      </tr>`;
    }).join('');

    const totals = nutItems.reduce((a, it) => ({
      kcal: a.kcal + it.kcal, protein: a.protein + it.protein, carbs: a.carbs + it.carbs,
      fat: a.fat + it.fat, fiber: a.fiber + it.fiber, iron: a.iron + it.iron,
    }), { kcal:0, protein:0, carbs:0, fat:0, fiber:0, iron:0 });

    const hasVitC = nutItems.some((it) => it.vitC);
    const hasInhibitor = nutItems.some((it) => it.inhibitor);
    const absorbedIron = estimateAbsorbedIron(nutItems, hasVitC, hasInhibitor);
    const totalGrams = nutItems.reduce((s, i) => s + i.grams, 0);
    const totalMl = totalGrams / BABY_FOOD_DENSITY;

    els.resultSummary.innerHTML = `
      <div class="grid sm:grid-cols-3 gap-3 text-sm mb-4">
        <div class="bg-white rounded-xl p-4 border border-orange-100">
          <span class="text-gray-500">1끼 총량(추정)</span>
          <p class="text-xl font-bold text-orange-600 mt-1" data-meal-grams="${totalGrams}">${formatPretty(totalGrams)}g</p>
          <p class="text-xs text-gray-400 mt-1">약 ${formatPretty(totalMl)}ml · 밀도 ${BABY_FOOD_DENSITY}g/ml</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-orange-100">
          <span class="text-gray-500">${age.label} 권장 1끼</span>
          <p class="text-xl font-bold text-sage mt-1">${rec.volume}g · ${rec.kcal}kcal</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-red-100 bg-red-50/30">
          <span class="text-gray-500">1끼 철분</span>
          <p class="text-xl font-bold text-red-600 mt-1">${formatPretty(totals.iron)}mg <span class="text-sm font-normal">/ ${rec.iron}mg</span></p>
        </div>
      </div>`;

    if (els.nutritionPanel) {
      els.nutritionPanel.innerHTML = `
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-sm mb-4">
          ${[['열량', totals.kcal, 'kcal'], ['단백질', totals.protein, 'g'], ['탄수화물', totals.carbs, 'g'],
             ['지방', totals.fat, 'g'], ['식이섬유', totals.fiber, 'g'], ['철분', totals.iron, 'mg']].map(([l,v,u]) =>
            `<div class="bg-white rounded-lg p-3 border ${l==='철분'?'border-red-200 bg-red-50/40':'border-orange-100'}">
              <p class="text-gray-500 text-xs">${l}</p><p class="font-bold ${l==='철분'?'text-red-600':'text-gray-800'}">${formatPretty(v)}${u}</p>
            </div>`).join('')}
        </div>`;
    }

    if (els.ironHighlight) {
      const weightKg = getBabyWeightKg(age);
      const ironNeeds = getIronNeedsForAge(age, weightKg);
      const ironPct = rec.iron > 0 ? Math.round(totals.iron / rec.iron * 100) : 0;
      const absPct = rec.iron > 0 ? Math.round(absorbedIron / rec.iron * 100) : 0;
      const ironDeficit = Math.max(0, rec.iron - totals.iron);
      els.ironHighlight.innerHTML = `
        <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border-2 border-red-200">
          <h3 class="font-bold text-red-800 text-lg mb-2">🩸 1끼 철분 분석</h3>
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p>아기 체중 <strong>${weightKg}kg</strong> · ${age.label} (${age.months}개월)</p>
              <p class="mt-1">1끼 철분 함량: <strong class="text-red-600 text-lg">${formatPretty(totals.iron)}mg</strong> (1끼 목표 대비 ${ironPct}%)</p>
              <p>추정 흡수 철분: <strong>${formatPretty(absorbedIron)}mg</strong> (흡수율 반영 ${absPct}%)</p>
            </div>
            <div>
              <p class="text-gray-600">일일 권장섭취량: <strong>${ironNeeds.dailyIron}mg/일</strong> <span class="text-xs">(2025 한국인 영양소 섭취기준)</span></p>
              <p class="text-gray-600">이유식 1끼 목표: <strong class="text-red-700">${ironNeeds.oneMealIron}mg</strong> <span class="text-xs">(일일 × 45% ÷ ${ironNeeds.mealsPerDay}끼 — 자체 산정)</span></p>
              ${hasVitC ? '<p class="mt-2 text-green-700 font-medium">✓ 비타민C 식품 포함 → 비헴철 흡수율 ↑</p>' : ''}
              ${hasInhibitor ? '<p class="mt-1 text-amber-700 font-medium">⚠ 칼슘/우유 성분 포함 → 철 흡수 저해 가능</p>' : ''}
            </div>
          </div>
          ${totals.iron >= rec.iron
            ? `<div class="mt-3 pt-3 border-t border-green-200">
                 <p class="font-semibold text-green-800 text-sm">✓ 1끼 철분 목표(${rec.iron}mg)를 충족했어요. 비타민C 과일을 곁들이면 흡수가 더 좋아집니다.</p>
               </div>`
            : `<div class="mt-3 pt-3 border-t border-red-200">
                 <p class="font-semibold text-red-800 mb-2 text-sm">🔻 1끼 목표보다 철분이 ${formatPretty(ironDeficit)}mg 부족 — 이렇게 보충하세요</p>
                 <ul class="text-sm space-y-1 text-gray-700 leading-relaxed">
                   <li>① <strong>소고기 다짐육 약 ${Math.ceil(ironDeficit / 2.6 * 100)}g</strong> 추가 — 헴철 2.6mg/100g, 흡수율이 가장 높은 1순위 식품</li>
                   <li>② 또는 <strong>달걀 노른자 약 ${Math.ceil(ironDeficit / 4.85 * 100)}g</strong> (4.85mg/100g, 7개월 이후 소량·알레르기 관찰)</li>
                   <li>③ ${hasVitC
                        ? '<span class="text-green-700 font-medium">비타민C 과일이 이미 포함돼 흡수에 도움 ✓</span>'
                        : '<strong>비타민C 과일</strong>(키위·딸기·브로콜리·파프리카)을 곁들이면 비헴철 흡수율이 약 3배로 상승'}</li>
                   ${hasInhibitor
                      ? '<li>④ <span class="text-amber-700 font-medium">우유·치즈·두유는 철 흡수를 방해하니 이 끼니와 1~2시간 간격을 두세요</span></li>'
                      : '<li>④ 우유·치즈는 철 흡수를 방해하니 철분 끼니와 시간 간격을 두는 것이 좋아요</li>'}
                 </ul>
                 <p class="text-xs text-gray-400 mt-2">※ 철분 함량은 농촌진흥청 국가표준식품성분표 기준. 보충량은 함량 목표 기준 추정치이며, 실제 필요량은 소아과 상담을 권장합니다.</p>
               </div>`}
        </div>`;
    }

    if (els.absorptionBadge) {
      let badges = [];
      if (hasVitC) badges.push('<span class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">흡수율 ↑ 비타민C</span>');
      if (hasInhibitor) badges.push('<span class="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">흡수 주의 칼슘/우유</span>');
      if (nutItems.some((i) => i.heme)) badges.push('<span class="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">헴철 포함</span>');
      els.absorptionBadge.innerHTML = badges.join(' ') || '<span class="text-gray-400 text-sm">재료를 추가하면 흡수 팁이 표시됩니다</span>';
    }

    const ironPct = rec.iron > 0 ? Math.round(totals.iron / rec.iron * 100) : 0;
    const absPct = rec.iron > 0 ? Math.round(absorbedIron / rec.iron * 100) : 0;
    const grade = getIronGrade(ironPct, absPct);
    if (els.ironGradeBadge) {
      els.ironGradeBadge.innerHTML =
        `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${grade.color}">
          <span class="text-lg">${grade.grade}</span> ${grade.label} · 함량 ${ironPct}% · 흡수추정 ${absPct}%
        </span>`;
    }

    lastCalcSnapshot = {
      name: $('#recipe-name')?.value || '레시피',
      age: age.label,
      weight: getBabyWeightKg(age),
      orig, target, totals, rec, absorbedIron, ironPct, absPct, grade: grade.label, gradeLetter: grade.grade,
      totalGrams, totalMl,
      items: nutItems.map((it) => ({ name: it.name, grams: it.grams, iron: it.iron })),
    };

    renderMacroChart(totals.protein, totals.carbs, totals.fat);
    renderProgressBars(totals, rec);
    els.resultSection?.classList.remove('hidden');
    __fireAgihankiCalc();
    saveFormState();
  }

  const calculateDebounced = debounce(calculate, 180);

  // ─── 성장 · 권장량 ───────────────────────────────────────

  function renderGuideTable() {
    if (!els.guideTableBody) return;
    els.guideTableBody.innerHTML = AGE_GUIDE.map((a) => {
      const iron = getIronNeedsForAge(a, a.refWeightKg);
      return `<tr class="border-b border-orange-50 hover:bg-orange-50/30">
        <td class="py-3 px-3 font-medium">${a.label}</td>
        <td class="py-3 px-3 text-orange-600 font-semibold">${a.perMeal}g</td>
        <td class="py-3 px-3">${a.kcalPerMeal}kcal</td>
        <td class="py-3 px-3">${a.mealsPerDay}회 / ${a.kcalDaily}kcal</td>
        <td class="py-3 px-3 text-red-600 font-medium">${iron.dailyIron}mg/일</td>
        <td class="py-3 px-3 text-red-500">${iron.oneMealIron}mg</td>
        <td class="py-3 px-3 text-sm text-gray-600">${a.consistency}</td>
      </tr>`;
    }).join('');
  }

  function updateGrowth() {
    if (!els.growthResult) return;
    const age = getAgeGuide($('#growth-age')?.value || $('#age-select')?.value);
    const weight = parseNum($('#growth-weight')?.value || $('#baby-weight')?.value);
    const height = parseNum($('#growth-height')?.value);
    const gender = $('#growth-gender')?.value || 'boy';
    const weightPct = estimatePercentile(weight, age.months, gender, 'weight');
    const heightPct = height > 0 ? estimatePercentile(height, age.months, gender, 'height') : null;
    const weightStatus = growthStatus(weightPct, 'weight');
    const heightStatus = growthStatus(heightPct, 'height');
    const w = weight > 0 ? weight : age.refWeightKg;
    const refH = getRefHeightCm(age.months, gender);
    const ironNeeds = getIronNeedsForAge(age, w);
    const gd = getGrowthData(age.months, gender, 'weight');
    const gh = getGrowthData(age.months, gender, 'height');

    els.growthResult.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-orange-100">
        <h3 class="font-bold text-lg mb-3">📈 우리 아이 성장 추정</h3>
        <p class="text-sm text-gray-500 mb-3">질병관리청 소아청소년 성장도표(2017, 현행 최신판) · 체중·신장 백분위</p>
        <div class="grid sm:grid-cols-3 gap-4">
          <div class="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
            <p class="text-sm text-gray-600">체중 <strong>${weight || '—'}kg</strong> ${gd ? `<span class="text-xs text-gray-400">(P50 ${gd.p50}kg)</span>` : ''}</p>
            <p class="mt-1 text-xl font-bold">${weightPct != null ? 'P' + weightPct : '—'}</p>
            <p class="${weightStatus.color} text-sm font-medium mt-1">${weightStatus.label}</p>
          </div>
          <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p class="text-sm text-gray-600">신장 <strong>${height > 0 ? height + 'cm' : '—'}</strong> ${gh ? `<span class="text-xs text-gray-400">(P50 ${gh.p50}cm)</span>` : ''}</p>
            <p class="mt-1 text-xl font-bold">${heightPct != null ? 'P' + heightPct : height > 0 ? '—' : '입력하세요'}</p>
            <p class="${heightStatus.color} text-sm font-medium mt-1">${height > 0 ? heightStatus.label : '신장 입력 시 백분위 표시'}</p>
          </div>
          <div class="bg-red-50 rounded-xl p-4 border border-red-100">
            <p class="font-medium text-red-800 text-sm">체중 기반 철분 권장</p>
            <p class="text-lg mt-1">하루 <strong class="text-red-600">${ironNeeds.dailyIron}mg</strong></p>
            <p class="text-xl font-bold text-red-600">1끼 ${ironNeeds.oneMealIron}mg</p>
          </div>
        </div>
        ${refH ? `<p class="mt-3 text-xs text-gray-500">${age.label} ${gender === 'girl' ? '여아' : '남아'} 평균 신장 P50: ${refH}cm</p>` : ''}
        <p class="mt-2 text-xs text-gray-400">P3/P15/P50/P85/P97 기준 · 정확한 진단은 소아과 상담 필수</p>
      </div>`;
  }

  // ─── 큐브 계산 ───────────────────────────────────────────

  function calculateCube() {
    const total = parseNum($('#cube-total')?.value);
    const unit = $('#cube-unit')?.value || 'ml';
    const size = parseInt($('#cube-size')?.value, 10) || 15;
    const meals = Math.max(parseInt($('#cube-meals')?.value, 10) || 5, 1);
    if (!els.cubeResult) return;
    if (total <= 0) {
      els.cubeResult.innerHTML = '<p class="text-gray-400">총량을 입력하세요.</p>';
      return;
    }

    const totalMl = toMlFromPortion(total, unit);
    const totalG = toGFromPortion(total, unit);
    const cubes = Math.ceil(totalMl / size);
    const perMealMl = totalMl / meals;
    const perMealG = totalG / meals;
    const cubesPerMeal = perMealMl / size;
    const age = getAgeGuide($('#age-select')?.value || $('#growth-age')?.value);
    const recVol = Math.round(age.perMeal * getWeightFactor());

    const warnings = [];
    if (meals === 1) {
      warnings.push('나눌 끼 수가 <strong>1</strong>이면 전량이 1끼로 계산됩니다. 냉동 소분은 보통 <strong>5끼</strong> 이상으로 나눕니다.');
    }
    if (perMealMl > recVol * 1.35) {
      warnings.push(`1끼 <strong>${formatPretty(perMealMl)}ml</strong>는 ${age.label} 권장 1끼(약 ${recVol}ml)보다 많습니다.`);
    }
    if (cubesPerMeal < 0.5) {
      warnings.push('1끼당 큐브가 0.5개 미만입니다. 큐브 용량을 줄이거나 총량을 확인하세요.');
    }

    const perMealMain = unit === 'ml'
      ? `${formatPretty(perMealMl)}<span class="text-lg text-gray-500">ml/끼</span>`
      : `${formatPretty(perMealG)}<span class="text-lg text-gray-500">g/끼</span>`;
    const perMealSub = unit === 'ml'
      ? `약 ${formatPretty(perMealG)}g`
      : `약 ${formatPretty(perMealMl)}ml`;

    els.cubeResult.innerHTML = `
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-5 border border-mint/50">
          <p class="text-gray-500 text-sm">총 큐브 개수</p>
          <p class="text-3xl font-bold text-teal-600">${cubes}<span class="text-lg text-gray-500">개</span></p>
          <p class="text-sm text-gray-500 mt-1">${size}ml 큐브 · 총 ${formatPretty(totalMl)}ml</p>
          <p class="text-xs text-gray-400">(약 ${formatPretty(totalG)}g)</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-mint/50">
          <p class="text-gray-500 text-sm">${meals}끼 분할 · 1끼 분량</p>
          <p class="text-3xl font-bold text-teal-600">${perMealMain}</p>
          <p class="text-sm text-gray-500 mt-1">${perMealSub} · 권장 ${recVol}ml/끼</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-mint/50">
          <p class="text-gray-500 text-sm">1끼당 큐브</p>
          <p class="text-3xl font-bold text-teal-600">${formatPretty(cubesPerMeal)}<span class="text-lg text-gray-500">개/끼</span></p>
          <p class="text-sm text-gray-500 mt-1">${formatPretty(perMealMl)}ml = ${size}ml × ${formatPretty(cubesPerMeal)}</p>
        </div>
      </div>
      ${warnings.length ? `<div class="mt-4 p-4 bg-amber-50 rounded-xl text-sm text-amber-900 border border-amber-200 space-y-1">
        ${warnings.map((w) => `<p>⚠ ${w}</p>`).join('')}
      </div>` : ''}
      <div class="mt-4 p-4 bg-mint/20 rounded-xl text-sm text-teal-900 border border-mint/40">
        <strong>계산 기준:</strong> 큐브는 <strong>ml(부피)</strong> 기준 · 이유식 밀도 약 <strong>${BABY_FOOD_DENSITY}g/ml</strong> 적용
        <br>예) 총 300ml ÷ 5끼 = <strong>60ml/끼</strong> (약 62g) · 30ml 큐브면 <strong>2개/끼</strong>
      </div>
      <div class="mt-3 p-4 bg-amber-50 rounded-xl text-sm text-amber-900 border border-amber-100">
        <strong>보관:</strong> 냉장 48~72시간 · 냉동 2주 · 해동 후 재냉동 금지 (질병관리청)
      </div>`;
  }

  // ─── 프리셋 · FAQ · 철분가이드 ───────────────────────────

  function renderPresets() {
    if (!els.presetGrid) return;
    els.presetGrid.innerHTML = PRESETS.map((p) => {
      const ironIng = p.ingredients.filter((i) => {
        const d = nutrientDB[i.db];
        return d && (d.iron >= 1 || (d.note || '').includes('헴철'));
      });
      return `<button type="button" class="preset-card bg-white rounded-2xl p-5 border border-orange-100 text-left shadow-sm hover:border-orange-300 transition" data-id="${p.id}">
        <span class="text-3xl">${p.emoji}</span>
        ${p.ironStar ? '<span class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">철분↑</span>' : ''}
        <h3 class="font-bold mt-2">${escapeHtml(p.name)}</h3>
        <p class="text-sm text-gray-500">${p.servings}인분 · ${getAgeGuide(p.age).label}</p>
        <p class="text-xs text-red-400 mt-1">${ironIng.map((i) => i.db.replace(/_/g,' ')).join(', ') || '철분 보통'}</p>
      </button>`;
    }).join('');
    els.presetGrid.querySelectorAll('.preset-card').forEach((c) => {
      c.addEventListener('click', () => {
        const p = PRESETS.find((x) => x.id === c.dataset.id);
        if (!p) return;
        $('#recipe-name').value = p.name;
        $('#original-servings').value = p.servings;
        $('#original-slider').value = p.servings;
        $('#target-servings').value = 1;
        $('#target-slider').value = 1;
        $('#age-select').value = p.age;
        setIngredients(p.ingredients.map((i) => ({ db: i.db, amount: i.amount, unit: i.unit || 'g', name: i.db.replace(/_/g,' ') })));
        switchTab('calculator');
        calculate();
        saveRecent();
      });
    });
  }

  function renderIronGuide() {
    if (els.dbVersionBadge && typeof NUTRIENT_DB_VERSION !== 'undefined') {
      els.dbVersionBadge.textContent = '영양 DB: ' + NUTRIENT_DB_VERSION;
    }
    if (els.ironGuideTable) {
      els.ironGuideTable.innerHTML = IRON_GUIDE_FOODS.map((f) =>
        `<tr class="border-b border-orange-50 hover:bg-red-50/30"><td class="py-2 px-3 font-medium">${f.name}</td>
          <td class="py-2 px-3 text-red-600 font-bold">${f.iron}mg</td>
          <td class="py-2 px-3">${f.type}</td><td class="py-2 px-3 text-sm">${f.absorb}</td>
          <td class="py-2 px-3 text-sm text-gray-600">${f.tip}</td></tr>`).join('');
    }
    if (els.ironCombosGood) {
      els.ironCombosGood.innerHTML = IRON_COMBOS_GOOD.map((c) =>
        `<div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">${c.badge}</span>
          <p class="font-bold mt-2">${c.combo}</p>
          <p class="text-sm text-gray-600 mt-1">${c.effect}</p>
          ${c.timing ? `<p class="text-xs text-green-700 mt-1">⏱ ${c.timing}</p>` : ''}</div>`).join('');
    }
    if (els.ironCombosBad) {
      els.ironCombosBad.innerHTML = IRON_COMBOS_BAD.map((c) =>
        `<div class="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <span class="text-xs ${c.severity === '높음' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-900'} px-2 py-0.5 rounded-full">${c.severity || '주의'}</span>
          <p class="font-bold text-amber-900 mt-2">${c.combo}</p>
          <p class="text-sm text-amber-800 mt-1">${c.reason}</p>
          <p class="text-xs text-gray-600 mt-1">💡 ${c.tip}</p></div>`).join('');
    }
    if (els.ironAgeFacts && typeof IRON_AGE_FACTS !== 'undefined') {
      els.ironAgeFacts.innerHTML = IRON_AGE_FACTS.map((f) =>
        `<div class="bg-white rounded-xl p-4 border border-orange-100">
          <p class="font-bold text-red-700">${f.age}</p>
          <p class="text-sm text-gray-600 mt-1"><strong>위험:</strong> ${f.risk}</p>
          <p class="text-sm text-sage mt-1"><strong>대응:</strong> ${f.action}</p></div>`).join('');
    }
    if (els.ironDeficiencySigns && typeof IRON_DEFICIENCY_SIGNS !== 'undefined') {
      els.ironDeficiencySigns.innerHTML = IRON_DEFICIENCY_SIGNS.map((s) =>
        `<li class="flex gap-2 text-sm text-gray-700"><span class="text-red-400">•</span>${s}</li>`).join('');
    }
  }

  function renderGrowthChartTable() {
    if (!els.growthChartTable) return;
    const months = Object.keys(GROWTH_WEIGHT_BOY).map(Number).sort((a, b) => a - b);
    els.growthChartTable.innerHTML = months.map((m) => {
      const bw = GROWTH_WEIGHT_BOY[m];
      const gw = GROWTH_WEIGHT_GIRL[m];
      const bh = GROWTH_HEIGHT_BOY[m];
      const gh = GROWTH_HEIGHT_GIRL[m];
      return `<tr class="border-b border-orange-50 text-xs sm:text-sm hover:bg-orange-50/20">
        <td class="py-2 px-2 font-medium whitespace-nowrap">${m}개월</td>
        <td class="py-2 px-2">${bw.p50}kg <span class="text-gray-400">(${bw.p3}~${bw.p97})</span></td>
        <td class="py-2 px-2">${gw.p50}kg <span class="text-gray-400">(${gw.p3}~${gw.p97})</span></td>
        <td class="py-2 px-2">${bh ? bh.p50 : '—'}cm <span class="text-gray-400">${bh ? `(${bh.p3}~${bh.p97})` : ''}</span></td>
        <td class="py-2 px-2">${gh ? gh.p50 : '—'}cm <span class="text-gray-400">${gh ? `(${gh.p3}~${gh.p97})` : ''}</span></td>
      </tr>`;
    }).join('');
  }

  let activeMealPlanId = '9-11m';

  function renderIronMealPlan(planId) {
    if (!els.ironMealPlanBody || typeof IRON_MEAL_PLANS_7DAY === 'undefined') return;
    const plan = IRON_MEAL_PLANS_7DAY.find((p) => p.id === planId) || IRON_MEAL_PLANS_7DAY[2];
    activeMealPlanId = plan.id;

    if (els.ironMealPlanMeta) {
      els.ironMealPlanMeta.innerHTML =
        `<span class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2">하루 ${plan.mealsPerDay}끼</span>` +
        `<span class="text-sm text-gray-600">철분 1끼 목표: <strong class="text-red-600">${plan.ironTarget}</strong></span>` +
        `<span class="text-xs text-gray-400 ml-2">★ = 헴철·고철분 식품</span>`;
    }

    els.ironMealPlanBody.innerHTML = plan.days.map((d) => {
      const hasPreset = d.presetId && PRESETS.find((p) => p.id === d.presetId);
      const loadBtn = hasPreset
        ? `<button type="button" class="meal-plan-load text-xs text-orange-600 hover:underline ml-2" data-preset="${d.presetId}">계산기 로드</button>`
        : '';
      const ironBadge = (d.ironSource || '').includes('★')
        ? 'text-red-600 font-semibold' : 'text-gray-600';
      return `<tr class="border-b border-orange-50 hover:bg-orange-50/30">
        <td class="py-3 px-3 font-bold text-orange-600">${d.dow}</td>
        <td class="py-3 px-3">${escapeHtml(d.meal)}${loadBtn}</td>
        <td class="py-3 px-3 text-sm ${ironBadge}">${escapeHtml(d.ironSource || '—')}</td>
        <td class="py-3 px-3 text-sm text-green-700">${escapeHtml(d.vc || '—')}</td>
        <td class="py-3 px-3 text-xs text-gray-500">${escapeHtml(d.note || '')}</td>
      </tr>`;
    }).join('');

    els.ironMealPlanBody.querySelectorAll('.meal-plan-load').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = PRESETS.find((x) => x.id === btn.dataset.preset);
        if (!p) return;
        $('#recipe-name').value = p.name;
        $('#original-servings').value = p.servings;
        $('#original-slider').value = p.servings;
        $('#target-servings').value = 1;
        $('#target-slider').value = 1;
        $('#age-select').value = p.age;
        setIngredients(p.ingredients.map((i) => ({ db: i.db, amount: i.amount, unit: i.unit || 'g' })));
        switchTab('calculator');
        calculate();
        saveRecent();
      });
    });

    if (els.ironMealPlanTabs) {
      els.ironMealPlanTabs.querySelectorAll('.meal-plan-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.plan === plan.id);
      });
    }
  }

  function initIronMealPlans() {
    if (!els.ironMealPlanTabs || typeof IRON_MEAL_PLANS_7DAY === 'undefined') return;
    els.ironMealPlanTabs.innerHTML = IRON_MEAL_PLANS_7DAY.map((p) =>
      `<button type="button" class="meal-plan-tab px-3 py-2 rounded-full text-sm bg-orange-50 hover:bg-orange-100 transition" data-plan="${p.id}">${p.label}</button>`
    ).join('');
    els.ironMealPlanTabs.querySelectorAll('.meal-plan-tab').forEach((tab) => {
      tab.addEventListener('click', () => renderIronMealPlan(tab.dataset.plan));
    });
    renderIronMealPlan(activeMealPlanId);
  }

  // FAQ는 SEO를 위해 index.html에 정적 렌더 (FAQPage JSON-LD 포함)

  // ─── localStorage · 폼 상태 · 복사/인쇄 ─────────────────

  function saveFormState() {
    const state = {
      age: $('#age-select')?.value,
      weight: parseNum($('#baby-weight')?.value),
      recipeName: $('#recipe-name')?.value,
      orig: parseNum($('#original-servings')?.value),
      target: parseNum($('#target-servings')?.value),
      growthAge: $('#growth-age')?.value,
      growthWeight: parseNum($('#growth-weight')?.value),
      growthHeight: parseNum($('#growth-height')?.value),
      growthGender: $('#growth-gender')?.value,
      cubeTotal: parseNum($('#cube-total')?.value),
      cubeUnit: $('#cube-unit')?.value,
      cubeSize: $('#cube-size')?.value,
      cubeMeals: parseNum($('#cube-meals')?.value),
      ingredients: getIngredients(),
    };
    try { localStorage.setItem(FORM_STATE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function loadFormState() {
    try {
      const state = JSON.parse(localStorage.getItem(FORM_STATE_KEY) || 'null');
      if (!state) return false;
      if (state.age) $('#age-select').value = state.age;
      if (state.weight) $('#baby-weight').value = state.weight;
      if (state.recipeName) $('#recipe-name').value = state.recipeName;
      if (state.orig) { $('#original-servings').value = state.orig; $('#original-slider').value = state.orig; }
      if (state.target) { $('#target-servings').value = state.target; $('#target-slider').value = state.target; }
      if (state.growthAge) $('#growth-age').value = state.growthAge;
      if (state.growthWeight) $('#growth-weight').value = state.growthWeight;
      if (state.growthHeight) $('#growth-height').value = state.growthHeight;
      if (state.growthGender) $('#growth-gender').value = state.growthGender;
      if (state.cubeTotal) $('#cube-total').value = state.cubeTotal;
      if (state.cubeUnit) $('#cube-unit').value = state.cubeUnit;
      if (state.cubeSize) $('#cube-size').value = state.cubeSize;
      if (state.cubeMeals) $('#cube-meals').value = state.cubeMeals;
      if (state.ingredients?.length) setIngredients(state.ingredients);
      return true;
    } catch (_) { return false; }
  }

  function syncWeightFields(fromId, toId) {
    if (syncingWeight) return;
    const from = $(fromId), to = $(toId);
    if (!from || !to) return;
    syncingWeight = true;
    to.value = from.value;
    syncingWeight = false;
  }

  function buildCopyText() {
    if (!lastCalcSnapshot) return '';
    const s = lastCalcSnapshot;
    const lines = [
      `[아기한끼] ${s.name}`,
      `월령: ${s.age} · 체중: ${s.weight}kg · ${s.orig}인분 → ${s.target}끼`,
      `열량 ${formatPretty(s.totals.kcal)}kcal · 단백질 ${formatPretty(s.totals.protein)}g · 철분 ${formatPretty(s.totals.iron)}mg (권장 ${s.rec.iron}mg, ${s.ironPct}%)`,
      `흡수 추정 철분: ${formatPretty(s.absorbedIron)}mg (${s.absPct}%) · ${s.grade}`,
      '재료:',
      ...s.items.map((it) => `  - ${it.name}: ${formatPretty(it.grams)}g (철 ${formatPretty(it.iron)}mg)`),
      'https://agihanki.matchiq.co.kr/',
    ];
    return lines.join('\n');
  }

  async function copyResult() {
    const text = buildCopyText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const btn = $('#copy-result-btn');
      if (btn) { const orig = btn.textContent; btn.textContent = '✓ 복사됨'; setTimeout(() => { btn.textContent = orig; }, 2000); }
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  function printResult() { window.print(); }

  // ─── 결과 공유 카드 (Canvas) ──────────────────────────────
  // 이미 계산된 lastCalcSnapshot 값을 그대로 그리기만 한다 (재계산 없음).

  const SHARE_CARD_FONT = "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  const GRADE_CARD_COLORS = {
    A: { bg: '#dcfce7', fg: '#166534' },
    B: { bg: '#dbeafe', fg: '#1e40af' },
    C: { bg: '#fef3c7', fg: '#92400e' },
    D: { bg: '#fee2e2', fg: '#991b1b' },
  };

  function roundRectPath(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /** maxWidth에 맞게 폰트 크기를 줄이고, 그래도 넘치면 말줄임 처리한 텍스트를 돌려준다. */
  function fitCardText(ctx, text, weight, baseSize, minSize, maxWidth) {
    let size = baseSize;
    ctx.font = `${weight} ${size}px ${SHARE_CARD_FONT}`;
    while (size > minSize && ctx.measureText(text).width > maxWidth) {
      size -= 4;
      ctx.font = `${weight} ${size}px ${SHARE_CARD_FONT}`;
    }
    let t = String(text);
    if (ctx.measureText(t).width > maxWidth) {
      while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
      t += '…';
    }
    return t;
  }

  function buildShareCardCanvas(s) {
    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 배경: 크림 → 피치 그라데이션
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#fff7ed');
    bg.addColorStop(1, '#ffedd5');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 상단 포인트 바 (주황 #f97316 계열)
    const accent = ctx.createLinearGradient(0, 0, W, 0);
    accent.addColorStop(0, '#fb923c');
    accent.addColorStop(1, '#f97316');
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, W, 16);

    ctx.textBaseline = 'middle';

    // 브랜드 + 날짜
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ea580c';
    ctx.font = `bold 54px ${SHARE_CARD_FONT}`;
    ctx.fillText('🍼 아기한끼', 72, 108);
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#9ca3af';
    ctx.font = `32px ${SHARE_CARD_FONT}`;
    ctx.fillText(dateStr, W - 72, 110);

    // 중앙 흰색 카드
    roundRectPath(ctx, 72, 176, W - 144, 716, 48);
    ctx.save();
    ctx.shadowColor = 'rgba(249, 115, 22, 0.18)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
    roundRectPath(ctx, 72, 176, W - 144, 716, 48);
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    const cx = W / 2;

    // 메뉴명 (사용자 입력)
    ctx.fillStyle = '#1f2937';
    const menuText = fitCardText(ctx, s.name || '이유식', 'bold', 72, 40, 800);
    ctx.fillText(menuText, cx, 288);

    // 메타 (월령 · 인분 변환)
    ctx.fillStyle = '#6b7280';
    ctx.font = `34px ${SHARE_CARD_FONT}`;
    ctx.fillText(`${s.age} · ${s.orig}인분 → ${s.target}끼`, cx, 360);

    // 1끼 분량 (계산된 값 그대로)
    ctx.fillStyle = '#9ca3af';
    ctx.font = `34px ${SHARE_CARD_FONT}`;
    ctx.fillText('1끼 분량 (추정)', cx, 446);
    ctx.fillStyle = '#f97316';
    ctx.font = `bold 136px ${SHARE_CARD_FONT}`;
    ctx.fillText(`${formatPretty(s.totalGrams)}g`, cx, 552);

    // 구분선
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(192, 642);
    ctx.lineTo(W - 192, 642);
    ctx.stroke();

    // 철분 등급 배지 (기존 등급 로직 결과값 그대로)
    const letter = s.gradeLetter || '';
    const gc = GRADE_CARD_COLORS[letter] || { bg: '#f3f4f6', fg: '#374151' };
    const pillText = letter ? `${letter} · ${s.grade}` : s.grade || '';
    ctx.font = `bold 44px ${SHARE_CARD_FONT}`;
    const pillW = ctx.measureText(pillText).width + 120;
    const pillH = 88;
    roundRectPath(ctx, cx - pillW / 2, 716 - pillH / 2, pillW, pillH, pillH / 2);
    ctx.fillStyle = gc.bg;
    ctx.fill();
    ctx.fillStyle = gc.fg;
    ctx.fillText(pillText, cx, 718);

    // 철분 mg (계산된 값 그대로)
    ctx.fillStyle = '#dc2626';
    const ironText = fitCardText(ctx, `🩸 철분 ${formatPretty(s.totals.iron)}mg (1끼 목표 대비 ${s.ironPct}%)`, 'bold', 50, 34, 820);
    ctx.fillText(ironText, cx, 812);

    // 하단 워터마크 + 면책
    ctx.fillStyle = '#9ca3af';
    ctx.font = `34px ${SHARE_CARD_FONT}`;
    ctx.fillText('agihanki.matchiq.co.kr', cx, 952);
    ctx.fillStyle = '#a8a29e';
    ctx.font = `26px ${SHARE_CARD_FONT}`;
    ctx.fillText('교육·참고용 추정치 · 의료 상담을 대체하지 않습니다', cx, 1006);

    return canvas;
  }

  function flashButton(btn, msg) {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function shareResultImage() {
    const s = lastCalcSnapshot;
    if (!s) return;
    const btn = $('#share-image-btn');
    try {
      const canvas = buildShareCardCanvas(s);
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const fileName = `agihanki_${stamp}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: '아기한끼 계산 결과',
            text: `[아기한끼] ${s.name} — 1끼 ${formatPretty(s.totalGrams)}g · 철분 ${formatPretty(s.totals.iron)}mg`,
          });
          flashButton(btn, '✓ 공유됨');
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return; // 사용자가 공유 취소
          // 공유 실패 시 다운로드 폴백으로 진행
        }
      }
      downloadBlob(blob, fileName);
      flashButton(btn, '✓ 저장됨');
    } catch (_) {
      flashButton(btn, '⚠ 실패');
    }
  }

  function saveRecent() {
    const entry = {
      name: $('#recipe-name')?.value || '레시피',
      orig: parseNum($('#original-servings')?.value),
      target: parseNum($('#target-servings')?.value),
      age: $('#age-select')?.value,
      weight: parseNum($('#baby-weight')?.value),
      ingredients: getIngredients(),
      time: Date.now(),
    };
    let list = [];
    try { list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) {}
    const sameAsTop = list[0] && list[0].name === entry.name
      && list[0].orig === entry.orig && list[0].target === entry.target
      && JSON.stringify(list[0].ingredients) === JSON.stringify(entry.ingredients);
    if (sameAsTop) list[0] = entry;
    else list.unshift(entry);
    list = list.slice(0, 8);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (_) {}
    renderRecent();
  }

  function renderRecent() {
    if (!els.recentList) return;
    let list = [];
    try { list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) {}
    els.recentList.innerHTML = list.length ? list.map((e, i) =>
      `<button type="button" class="recent-item w-full text-left px-3 py-2 rounded-lg border border-orange-100 text-sm hover:bg-orange-50" data-i="${i}">
        ${escapeHtml(e.name)} <span class="text-gray-400">${e.orig}→${e.target}끼</span></button>`).join('') :
      '<p class="text-gray-400 text-sm">저장된 기록 없음</p>';
    els.recentList.querySelectorAll('.recent-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const e = list[parseInt(btn.dataset.i, 10)];
        $('#recipe-name').value = e.name;
        $('#original-servings').value = e.orig;
        $('#original-slider').value = e.orig;
        $('#target-servings').value = e.target;
        $('#target-slider').value = e.target;
        if (e.age) $('#age-select').value = e.age;
        if (e.weight) $('#baby-weight').value = e.weight;
        setIngredients(e.ingredients);
        calculate();
      });
    });
  }

  function syncSliders() {
    [['#original-servings','#original-slider'],['#target-servings','#target-slider']].forEach(([a,b]) => {
      const inp = $(a), sl = $(b);
      if (!inp || !sl) return;
      inp.addEventListener('input', () => { sl.value = inp.value; calculateDebounced(); });
      sl.addEventListener('input', () => { inp.value = sl.value; calculateDebounced(); });
    });
    ['#age-select','#recipe-name'].forEach((id) => {
      const el = $(id);
      if (el) { el.addEventListener('input', calculateDebounced); el.addEventListener('change', calculate); }
    });
    const babyWeight = $('#baby-weight');
    if (babyWeight) {
      babyWeight.addEventListener('input', () => {
        syncWeightFields('#baby-weight', '#growth-weight');
        calculateDebounced();
      });
      babyWeight.addEventListener('change', () => {
        syncWeightFields('#baby-weight', '#growth-weight');
        calculate();
        updateGrowth();
      });
    }
    const growthWeight = $('#growth-weight');
    if (growthWeight) {
      growthWeight.addEventListener('input', () => {
        syncWeightFields('#growth-weight', '#baby-weight');
        updateGrowth();
      });
      growthWeight.addEventListener('change', () => {
        syncWeightFields('#growth-weight', '#baby-weight');
        updateGrowth();
        calculate();
      });
    }
    const ageSelect = $('#age-select');
    if (ageSelect) {
      ageSelect.addEventListener('change', () => {
        $('#growth-age').value = ageSelect.value;
        updateGrowth();
      });
    }
    ['#growth-age','#growth-height','#growth-gender'].forEach((id) => {
      const el = $(id);
      if (el) { el.addEventListener('input', updateGrowth); el.addEventListener('change', updateGrowth); }
    });
    ['#cube-total','#cube-unit','#cube-size','#cube-meals'].forEach((id) => {
      const el = $(id);
      if (el) { el.addEventListener('input', calculateCube); el.addEventListener('change', calculateCube); }
    });
  }

  // ─── init ─────────────────────────────────────────────────

  function init() {
    loadCustomNutrients();
    initTabs();
    syncSliders();
    renderGuideTable();
    renderPresets();
    renderIronGuide();
    renderGrowthChartTable();
    initIronMealPlans();
    renderRecent();

    const restored = loadFormState();
    if (!restored) {
      setIngredients([
        { db: '멥쌀', amount: 60, name: '멥쌀' },
        { db: '소고기_다짐육', amount: 45, name: '소고기 다짐육' },
        { db: '당근', amount: 30, name: '당근' },
        { db: '브로콜리', amount: 30, name: '브로콜리' },
      ]);
      const bw = parseNum($('#baby-weight')?.value);
      if (bw > 0 && $('#growth-weight')) $('#growth-weight').value = bw;
    }

    $('#add-ingredient')?.addEventListener('click', () => els.ingredientBody.appendChild(createIngredientRow()));
    $('#calc-btn')?.addEventListener('click', () => { calculate(); saveRecent(); });
    $('#copy-result-btn')?.addEventListener('click', copyResult);
    $('#print-result-btn')?.addEventListener('click', printResult);
    $('#share-image-btn')?.addEventListener('click', shareResultImage);
    $('#cube-btn')?.addEventListener('click', () => {
      const gramsEl = els.resultSummary?.querySelector('[data-meal-grams]');
      const grams = gramsEl
        ? parseNum(gramsEl.dataset.mealGrams || gramsEl.textContent)
        : (lastCalcSnapshot?.totalGrams || 0);
      if ($('#cube-total') && grams > 0) {
        $('#cube-total').value = formatPretty(grams * 5);
        $('#cube-unit').value = 'g';
      }
      $('#cube-meals').value = 5;
      switchTab('portion');
      calculateCube();
      saveFormState();
    });
    $('#modal-save')?.addEventListener('click', saveCustomNutrient);
    $('#modal-cancel')?.addEventListener('click', closeNutrientModal);
    els.nutrientModal?.addEventListener('click', (e) => { if (e.target === els.nutrientModal) closeNutrientModal(); });
    els.mobileMenuBtn?.addEventListener('click', () => els.mobileNav?.classList.toggle('hidden'));

    calculate();
    updateGrowth();
    calculateCube();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();