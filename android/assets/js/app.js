/* 车牌通 · 核心逻辑（城市级地图点亮版 + 扁平化图标） */
(function () {
  'use strict';

  // ---------- 扁平化 SVG 图标 ----------
  const ICONS = {
    map: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    cards: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    target: '<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
    rotate: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>',
    landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    speed: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
    sparkle: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>',
    hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    chevron: '<polyline points="6 9 12 15 18 9"/>',
    circle: '<circle cx="12" cy="12" r="10"/>'
  };
  function icon(name, size) {
    const s = size || 20;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.circle) + '</svg>';
  }
  function hydrateIcons() {
    $$('.ic[data-icon]').forEach(el => {
      el.innerHTML = icon(el.dataset.icon, parseInt(el.dataset.size || '20', 10));
    });
  }

  // ---------- 数据扁平化 ----------
  function isQuizable(c) {
    const l = c.l !== undefined ? c.l : c.letter;
    return l !== '—' && c.city !== '港澳入出境' && c.city !== '莱芜(并入济南)';
  }
  function cityKey(p, c) {
    const l = c.l !== undefined ? c.l : c.letter;
    return l === '—' ? p.abbr + '—' + c.city : p.abbr + l;
  }
  function allCities() {
    const list = [];
    PLATES.forEach(p => p.cities.forEach(c => {
      list.push({
        key: cityKey(p, c), province: p.name, abbr: p.abbr, region: p.region, type: p.type,
        letter: c.l, city: c.city, h: c.h, s: c.s, f: c.f, tip: c.tip || '', desc: c.desc || ''
      });
    }));
    return list;
  }
  const CITIES = allCities();
  const QUIZABLE = CITIES.filter(isQuizable);
  const BY_KEY = {};
  CITIES.forEach(c => BY_KEY[c.key] = c);

  // ---------- 状态 ----------
  const LS_KEY = 'chepai_state_v1';
  const defaultState = {
    mastered: {}, review: {}, xp: 0, answered: 0, correct: 0,
    streak: 0, lastDate: '', badges: {}, sound: true, dark: false
  };
  let state = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      return Object.assign({}, JSON.parse(JSON.stringify(defaultState)), s || {});
    } catch (e) { return JSON.parse(JSON.stringify(defaultState)); }
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function yesterdayStr() {
    const d = new Date(Date.now() - 86400000);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // ---------- 工具 ----------
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function chips(str, iconName, max) {
    if (!str) return '<span class="chip-empty">—</span>';
    let parts = str.split('·').map(x => x.trim()).filter(Boolean);
    if (max) parts = parts.slice(0, max);
    return parts.map(x => `<span class="chip">${icon(iconName || 'circle', 13)} ${esc(x)}</span>`).join('');
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
  }

  // 声音
  let audioCtx = null;
  function beep(freq, dur) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.value = 0.08;
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }
  const okSound = () => beep(880, 0.12);
  const noSound = () => beep(220, 0.22);

  // ---------- 二次确认弹窗 ----------
  function showConfirm(title, msg, okText, onOk) {
    $('#confirmTitle').textContent = title;
    $('#confirmMsg').textContent = msg;
    $('#confirmOk').textContent = okText || '确认';
    $('#confirmModal').classList.remove('hidden');
    const ok = $('#confirmOk');
    const cancel = $('#confirmCancel');
    const backdrop = $('#confirmBackdrop');
    const close = () => {
      $('#confirmModal').classList.add('hidden');
      ok.onclick = null; cancel.onclick = null; backdrop.onclick = null;
    };
    ok.onclick = () => { close(); if (onOk) onOk(); };
    cancel.onclick = close;
    backdrop.onclick = close;
  }

  // ---------- 等级 ----------
  const LEVELS = [
    { name: '车牌学徒', badge: '学徒', min: 0, desc: '刚上路，先点亮几座城' },
    { name: '新手司机', badge: '新手', min: 100, desc: '有点感觉了，继续！' },
    { name: '熟手司机', badge: '熟手', min: 300, desc: '过半中国你都认得' },
    { name: '老司机', badge: '老司机', min: 600, desc: '路上车牌一眼认出' },
    { name: '车神', badge: '车神', min: 1000, desc: '全国车牌如数家珍' },
    { name: '车牌大师', badge: '大师', min: 1600, desc: '行走的全国车牌数据库' },
    { name: '车牌传奇', badge: '传奇', min: 2400, desc: '你就是传说本人' }
  ];
  function curLevel() {
    let lv = LEVELS[0];
    for (const l of LEVELS) if (state.xp >= l.min) lv = l;
    return lv;
  }
  function nextLevel() {
    const lv = curLevel();
    return LEVELS[LEVELS.indexOf(lv) + 1] || null;
  }

  // ---------- 徽章 ----------
  const BADGES = [
    { id: 'first', icon: 'car', name: '初次上路', desc: '掌握第 1 城' },
    { id: 'ten', icon: 'car', name: '十城达人', desc: '掌握 10 城' },
    { id: 'fifty', icon: 'speed', name: '五十城', desc: '掌握 50 城' },
    { id: 'hundred', icon: 'rocket', name: '百城高手', desc: '掌握 100 城' },
    { id: 'half', icon: 'moon', name: '半壁江山', desc: '掌握 50%' },
    { id: 'all', icon: 'trophy', name: '全国通', desc: '掌握全部城市' },
    { id: 'prov1', icon: 'map', name: '一省大满贯', desc: '集齐任意 1 省' },
    { id: 'prov5', icon: 'compass', name: '五省巡游', desc: '集齐 5 省' },
    { id: 'prov10', icon: 'route', name: '十省巡游', desc: '集齐 10 省' },
    { id: 'streak3', icon: 'flame', name: '三日连签', desc: '连续打卡 3 天' },
    { id: 'streak7', icon: 'zap', name: '一周连签', desc: '连续打卡 7 天' },
    { id: 'streak30', icon: 'crown', name: '满月连签', desc: '连续打卡 30 天' },
    { id: 'q100', icon: 'target', name: '百题斩', desc: '累计答题 100 题' },
    { id: 'q1000', icon: 'target', name: '千题斩', desc: '累计答题 1000 题' },
    { id: 'perfect', icon: 'sparkle', name: '满分日', desc: '每日挑战全对' }
  ];
  function masteredCount() { return QUIZABLE.filter(c => state.mastered[c.key]).length; }
  function completedProvinces() {
    let n = 0;
    PLATES.forEach(p => {
      const q = p.cities.filter(isQuizable);
      if (q.length && q.every(c => state.mastered[cityKey(p, c)])) n++;
    });
    return n;
  }
  function checkBadges() {
    const m = masteredCount();
    const cp = completedProvinces();
    const earned = {};
    const add = (id, cond) => { if (cond && !state.badges[id]) { state.badges[id] = Date.now(); earned[id] = true; } };
    add('first', m >= 1);
    add('ten', m >= 10);
    add('fifty', m >= 50);
    add('hundred', m >= 100);
    add('half', m >= QUIZABLE.length * 0.5);
    add('all', m >= QUIZABLE.length);
    add('prov1', cp >= 1);
    add('prov5', cp >= 5);
    add('prov10', cp >= 10);
    add('streak3', state.streak >= 3);
    add('streak7', state.streak >= 7);
    add('streak30', state.streak >= 30);
    add('q100', state.answered >= 100);
    add('q1000', state.answered >= 1000);
    const newIds = Object.keys(earned);
    if (newIds.length) {
      save();
      newIds.forEach(id => {
        const b = BADGES.find(x => x.id === id);
        if (b) toast('解锁徽章：' + b.name);
      });
      renderBadges();
    }
  }
  function addXP(n) { state.xp += n; }

  // ---------- 顶栏与进度 ----------
  function renderTop() {
    $('#streakTop').textContent = state.streak;
    $('#xpTop').textContent = state.xp;
  }
  function renderHero() {
    const m = masteredCount();
    $('#masteredCount').textContent = m;
    $('#totalCount').textContent = QUIZABLE.length;
    const pct = QUIZABLE.length ? Math.round(m / QUIZABLE.length * 100) : 0;
    $('#ringPct').textContent = pct + '%';
    const c = 213.6;
    $('#ringFg').style.strokeDashoffset = c - (c * pct / 100);
  }

  // ---------- 城市级地图（点亮） ----------
  let mapChart = null;
  function cityStatus(key) {
    if (state.mastered[key]) return 'done';
    if (state.review[key]) return 'review';
    return 'new';
  }
  function mapUnlitColor() {
    return document.body.classList.contains('dark') ? '#3c4356' : '#e2e6ef';
  }
  function colorFor(st) {
    if (st === 'done') return '#16a34a';
    if (st === 'review') return '#f59e0b';
    return mapUnlitColor();
  }
  function statusText(st) {
    return st === 'done' ? '已点亮' : st === 'review' ? '待巩固' : '未点亮';
  }
  function initMap() {
    const el = document.getElementById('chinaMap');
    if (!el || !window.echarts || !window.CHINA_CITY_GEO) return;
    if (!mapChart) {
      mapChart = echarts.init(el);
      echarts.registerMap('china_city', window.CHINA_CITY_GEO);
      mapChart.on('click', onMapClick);
      window.addEventListener('resize', () => { if (mapChart) mapChart.resize(); });
    }
    updateMap();
  }
  function onMapClick(params) {
    const key = params.data && params.data.key;
    if (key && BY_KEY[key]) openCity(key);
  }
  function updateMap() {
    if (!mapChart || !window.CHINA_CITY_GEO) return;
    const feats = window.CHINA_CITY_GEO.features;
    const data = feats.map(f => {
      const key = f.properties.key;
      const st = cityStatus(key);
      const c = BY_KEY[key];
      return {
        name: f.properties.name,
        value: st === 'done' ? 100 : st === 'review' ? 50 : 0,
        key: key,
        city: c ? c.city : f.properties.name,
        letter: c ? (c.abbr + c.letter) : '',
        status: st,
        itemStyle: { areaColor: colorFor(st) }
      };
    });
    mapChart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15,23,42,.94)',
        borderWidth: 0, padding: [8, 12],
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: p => {
          const d = p.data || {};
          return `<b style="font-size:14px">${esc(d.city)}</b>` +
            (d.letter ? `<br>${esc(d.letter)}` : '') +
            `<br>${statusText(d.status)}`;
        }
      },
      series: [{
        type: 'map',
        map: 'china_city',
        roam: true,
        scaleLimit: { min: 0.8, max: 5 },
        selectedMode: false,
        label: { show: false },
        itemStyle: { borderColor: document.body.classList.contains('dark') ? '#232838' : '#ffffff', borderWidth: 0.5 },
        emphasis: {
          label: { show: true, color: document.body.classList.contains('dark') ? '#e2e8f0' : '#1f2937', fontSize: 10 },
          itemStyle: { areaColor: '#3b82f6', borderColor: '#1d4ed8', borderWidth: 1 }
        },
        data: data
      }]
    });
  }

  // ---------- 地图视图 ----------
  let currentRegion = '全部';
  function renderRegionTabs() {
    const regions = ['全部', ...new Set(PLATES.map(p => p.region))];
    $('#regionTabs').innerHTML = regions.map(r =>
      `<button class="region-tab ${r === currentRegion ? 'active' : ''}" data-region="${esc(r)}">${esc(r)}</button>`
    ).join('');
  }
  function cityItemHtml(p, c) {
    const key = cityKey(p, c);
    const done = !!state.mastered[key];
    const letter = c.l;
    return `<button class="city-item ${done ? 'mastered' : ''}" data-key="${esc(key)}">
      <span class="city-letter">${esc(p.abbr)}${esc(letter)}</span>
      <span class="ci-name">${esc(c.city)}</span>
      ${done ? '<span class="ci-done">' + icon('check', 13) + '</span>' : ''}
    </button>`;
  }
  function provinceCardHtml(p) {
    const q = p.cities.filter(isQuizable);
    const done = q.filter(c => state.mastered[cityKey(p, c)]).length;
    const full = q.length && done === q.length;
    return `<div class="province-card" data-abbr="${esc(p.abbr)}">
      <button class="province-head">
        <span class="province-abbr">${esc(p.abbr)}</span>
        <span>
          <span class="ph-name">${esc(p.name)}</span>
          <span class="ph-sub">${esc(p.type)}</span>
        </span>
        <span class="ph-right">
          <span class="ph-progress">${full ? icon('trophy', 13) + ' 集齐' : (q.length ? done + '/' + q.length : '')}</span>
          <span class="ph-arrow">${icon('chevron', 16)}</span>
        </span>
      </button>
      <div class="city-grid">${p.cities.map(c => cityItemHtml(p, c)).join('')}</div>
    </div>`;
  }
  function renderProvinceList() {
    const list = PLATES.filter(p => currentRegion === '全部' || p.region === currentRegion);
    $('#provinceList').innerHTML = list.map(provinceCardHtml).join('');
  }
  function renderSearch(q) {
    const list = $('#provinceList');
    if (!q) { renderProvinceList(); return; }
    const kw = q.toLowerCase();
    const hits = CITIES.filter(c =>
      c.city.includes(kw) || (c.abbr + c.letter).toLowerCase().includes(kw) || c.abbr.includes(kw)
    );
    if (!hits.length) {
      list.innerHTML = '<div style="text-align:center;color:var(--muted);padding:30px">没找到，换个关键词试试</div>';
      return;
    }
    list.innerHTML = hits.map(c => {
      const done = !!state.mastered[c.key];
      return `<button class="city-item ${done ? 'mastered' : ''}" data-key="${esc(c.key)}" style="grid-column:1/-1">
        <span class="city-letter">${esc(c.abbr)}${esc(c.letter)}</span>
        <span class="ci-name">${esc(c.city)}</span>
        <span style="font-size:11px;color:var(--muted);margin-left:auto">${esc(c.province)}</span>
        ${done ? '<span class="ci-done">' + icon('check', 13) + '</span>' : ''}
      </button>`;
    }).join('');
  }
  function renderMap() {
    renderRegionTabs();
    const q = $('#searchInput').value.trim();
    if (q) renderSearch(q); else renderProvinceList();
  }

  // ---------- 城市详情弹层 ----------
  function openCity(key) {
    const c = BY_KEY[key];
    if (!c) return;
    const done = !!state.mastered[key];
    const inReview = !!state.review[key];
    $('#modalCard').innerHTML = `
      <div class="mc-plate">
        <span class="big-letter">${esc(c.abbr)}${esc(c.letter)}</span>
        <div>
          <div class="mc-city">${esc(c.city)}</div>
          <div class="mc-province">${esc(c.province)} · ${esc(c.region)}</div>
        </div>
        <span class="mc-status ${done ? 'lit' : inReview ? 'rev' : ''}">${done ? '已点亮' : inReview ? '待巩固' : '未点亮'}</span>
      </div>
      ${c.desc ? `<div class="mc-desc">${esc(c.desc)}</div>` : ''}
      <div class="mc-body">
        <div class="row"><span class="k k-landmark">${icon('landmark', 15)} 人文</span><span class="v">${esc(c.h || '—')}</span></div>
        <div class="row"><span class="k k-mountain">${icon('mountain', 15)} 风景</span><span class="v chips-wrap">${chips(c.s, 'mountain')}</span></div>
        <div class="row"><span class="k k-food">${icon('food', 15)} 美食</span><span class="v chips-wrap">${chips(c.f, 'food')}</span></div>
      </div>
      ${c.tip ? `<div class="mc-tip">${icon('bulb', 15)} 记忆点：${esc(c.tip)}</div>` : ''}
      <div class="mc-actions" style="margin-top:14px">
        <button class="btn ${done ? 'ghost' : 'success'}" id="mcToggle">${done ? icon('rotate', 16) + ' 取消掌握' : icon('check', 16) + ' 标记已掌握'}</button>
        <button class="btn ghost" id="mcClose">关闭</button>
      </div>`;
    $('#cityModal').classList.remove('hidden');
    $('#mcToggle').addEventListener('click', () => {
      if (done) {
        delete state.mastered[key];
        toast('已取消掌握');
      } else {
        state.mastered[key] = Date.now();
        delete state.review[key];
        if (!state.badges.first) addXP(5);
        toast('已点亮 ' + c.city);
      }
      save(); refreshAll();
      openCity(key);
    });
    $('#mcClose').addEventListener('click', closeModal);
    $('#modalBackdrop').addEventListener('click', closeModal);
  }
  function closeModal() { $('#cityModal').classList.add('hidden'); }

  // ---------- 闪卡 ----------
  let flashDeck = [];
  let flashIdx = 0;
  function buildFlashProvinceSelect() {
    const opts = ['<option value="全部">全部省份</option>'];
    PLATES.forEach(p => opts.push(`<option value="${esc(p.abbr)}">${esc(p.name)} (${esc(p.abbr)})</option>`));
    $('#flashProvince').innerHTML = opts.join('');
    $('#quizProvince').innerHTML = opts.join('');
  }
  function initFlash() {
    const abbr = $('#flashProvince').value;
    const pool = QUIZABLE.filter(c => abbr === '全部' || c.abbr === abbr);
    flashDeck = shuffle(pool);
    flashIdx = 0;
    renderFlashCard();
  }
  function renderFlashCard() {
    const stack = $('#flashStack');
    if (flashIdx >= flashDeck.length) {
      stack.innerHTML = `<div class="flash-card" style="aspect-ratio:auto;height:200px;flex-direction:column;align-items:center;justify-content:center">
        <div class="fc-icon">${icon('trophy', 40)}</div>
        <div style="font-weight:800;font-size:18px;margin-top:6px">本组学完啦</div>
        <div style="color:var(--muted);font-size:13px;margin-top:6px">点下方按钮再学一轮</div>
      </div>`;
      $('#flashHint').textContent = '已完成本组闪卡';
      return;
    }
    const c = flashDeck[flashIdx];
    stack.innerHTML = `
      <div class="flash-card" id="flashCard">
        <div class="flash-inner">
          <div class="flash-face flash-front">
            <div class="flash-plate">${esc(c.abbr)}${esc(c.letter)}</div>
            <div class="fp-tip">${esc(c.province)} · 点击翻面</div>
          </div>
          <div class="flash-face flash-back">
            <div class="fb-city">${esc(c.city)}</div>
            <div class="fb-tags">${chips(c.s, 'mountain', 2)}${chips(c.f, 'food', 2)}</div>
            ${c.tip ? '<div class="fb-tip">' + icon('bulb', 13) + ' ' + esc(c.tip) + '</div>' : ''}
          </div>
        </div>
      </div>`;
    $('#flashCard').addEventListener('click', () => {
      $('#flashCard').classList.toggle('flipped');
    });
  }
  function flashNext(got) {
    if (flashIdx >= flashDeck.length) { initFlash(); return; }
    const c = flashDeck[flashIdx];
    const key = c.key;
    if (got) {
      if (!state.mastered[key]) { state.mastered[key] = Date.now(); delete state.review[key]; addXP(5); okSound(); toast('记住了 ' + c.city); }
      else { okSound(); }
    } else {
      state.review[key] = { wrong: (state.review[key]?.wrong || 0) + 1, last: Date.now() };
      if (state.mastered[key]) { delete state.mastered[key]; toast('已取消掌握：' + c.city); }
      else { toast('已加入复习队列'); }
      noSound();
    }
    flashIdx++;
    save();
    checkBadges(); refreshAll();
    renderFlashCard();
  }

  // ---------- 练习 ----------
  let quiz = null;
  function startQuiz(mode, pool) {
    quiz = {
      mode, pool: shuffle(pool), idx: 0, correct: 0, wrong: 0,
      daily: mode === 'daily', answered: 0
    };
    $('#quizSetup').classList.add('hidden');
    $('#quizResult').classList.add('hidden');
    $('#quizBody').classList.remove('hidden');
    renderQuizQuestion();
  }
  function quizDistractors(c) {
    const same = QUIZABLE.filter(x => x.abbr === c.abbr && x !== c);
    const others = QUIZABLE.filter(x => x.abbr !== c.abbr && x !== c);
    let opts = shuffle(same).slice(0, 3);
    if (opts.length < 3) opts = opts.concat(shuffle(others).slice(0, 3 - opts.length));
    return opts;
  }
  function renderQuizQuestion() {
    if (!quiz) return;
    if (quiz.idx >= quiz.pool.length) return endQuiz();
    const c = quiz.pool[quiz.idx];
    const isP2C = quiz.mode === 'plate2city' || (quiz.mode === 'daily' && Math.random() < 0.5);
    const dist = quizDistractors(c);
    const options = shuffle([c, ...dist]);
    const question = $('#quizQuestion');
    if (isP2C) {
      question.innerHTML = `<div class="qq-plate">${esc(c.abbr)}${esc(c.letter)}</div>
        <div class="qq-hint">这是哪个城市的车牌？</div>`;
    } else {
      question.innerHTML = `<div class="qq-city">${esc(c.city)}</div>
        <div class="qq-hint">${esc(c.province)} · 它的车牌是？</div>`;
    }
    const optsHtml = options.map(o => {
      const label = isP2C ? o.city : (o.abbr + o.letter);
      return `<button class="option" data-ok="${o === c}" data-key="${esc(c.key)}" data-isP2C="${isP2C}">${esc(label)}</button>`;
    }).join('');
    $('#quizOptions').innerHTML = optsHtml;
    $('#quizProgress').textContent = (quiz.idx + 1) + ' / ' + quiz.pool.length;
    $('#quizScore').textContent = '答对 ' + quiz.correct + ' · 答错 ' + quiz.wrong;
    $$('#quizOptions .option').forEach(btn => btn.addEventListener('click', onQuizAnswer));
  }
  function onQuizAnswer(e) {
    const btn = e.currentTarget;
    const isCorrect = btn.dataset.ok === 'true';
    const key = btn.dataset.key;
    state.answered++;
    const c = BY_KEY[key];
    if (isCorrect) {
      quiz.correct++;
      state.correct++;
      if (!state.mastered[key]) { state.mastered[key] = Date.now(); delete state.review[key]; addXP(10); }
      else addXP(5);
      okSound();
      btn.classList.add('correct');
    } else {
      quiz.wrong++;
      state.review[key] = { wrong: (state.review[key]?.wrong || 0) + 1, last: Date.now() };
      if (state.mastered[key]) { delete state.mastered[key]; toast('已取消掌握：' + c.city); }
      noSound();
      btn.classList.add('wrong');
      $$('#quizOptions .option').forEach(b => { if (b.dataset.ok === 'true') b.classList.add('correct'); });
    }
    $$('#quizOptions .option').forEach(b => b.disabled = true);
    save();
    setTimeout(() => {
      quiz.idx++;
      renderQuizQuestion();
    }, isCorrect ? 420 : 900);
  }
  function endQuiz() {
    $('#quizBody').classList.add('hidden');
    $('#quizResult').classList.remove('hidden');
    const total = quiz.pool.length;
    const pct = Math.round(quiz.correct / total * 100);
    let bonus = 0;
    if (quiz.daily) {
      const today = todayStr();
      if (state.lastDate !== today) {
        if (state.lastDate === yesterdayStr()) state.streak++;
        else state.streak = 1;
        state.lastDate = today;
      }
      bonus = 50;
      addXP(bonus);
      if (quiz.correct === total && total > 0) state.badges.perfect = state.badges.perfect || Date.now();
    }
    save();
    checkBadges();
    const bigIcon = pct >= 90 ? 'trophy' : pct >= 60 ? 'sparkle' : 'refresh';
    $('#quizResult').innerHTML = `
      <div class="qr-big">${icon(bigIcon, 44)}</div>
      <h3>${quiz.daily ? '每日挑战完成！' : '练习完成！'}</h3>
      <p>答对 <b style="color:var(--green)">${quiz.correct}</b> / ${total}（${pct}%）</p>
      ${bonus ? `<p>打卡奖励 <b style="color:#f59e0b">+${bonus} XP</b> · 连续 ${state.streak} 天</p>` : ''}
      <button class="btn primary block" id="quizAgain">再来一轮</button>
      <button class="btn ghost block" id="quizBackSetup">返回</button>`;
    $('#quizAgain').addEventListener('click', () => startQuiz(quiz.mode, quiz.pool));
    $('#quizBackSetup').addEventListener('click', showQuizSetup);
    refreshAll();
  }
  function showQuizSetup() {
    quiz = null;
    $('#quizSetup').classList.remove('hidden');
    $('#quizBody').classList.add('hidden');
    $('#quizResult').classList.add('hidden');
  }
  function getQuizPool(mode, abbr) {
    let pool = QUIZABLE.filter(c => abbr === '全部' || c.abbr === abbr);
    if (mode === 'daily') {
      pool = shuffle(pool).slice(0, Math.min(20, pool.length));
    }
    return pool;
  }

  // ---------- 复习 ----------
  function startReview() {
    const keys = Object.keys(state.review);
    if (!keys.length) { toast('暂无待复习城市，先去练习吧'); return; }
    const pool = keys.map(k => BY_KEY[k]).filter(Boolean);
    if (!pool.length) { toast('暂无待复习城市'); return; }
    switchTab('quiz');
    startQuiz('plate2city', pool);
  }

  // ---------- 我的 ----------
  function renderMe() {
    const lv = curLevel();
    const nxt = nextLevel();
    $('#levelName').textContent = lv.name;
    $('#levelDesc').textContent = lv.desc;
    const cur = state.xp - lv.min;
    const span = nxt ? (nxt.min - lv.min) : 1;
    const pct = nxt ? Math.min(100, Math.round(cur / span * 100)) : 100;
    $('#levelBarFill').style.width = pct + '%';
    $('#levelXp').textContent = nxt ? `${cur} / ${span} XP · 下一级「${nxt.name}」` : `${state.xp} XP · 已达最高等级`;
    $('#statStreak').textContent = state.streak;
    $('#statMastered').textContent = masteredCount();
    $('#statBadges').textContent = Object.keys(state.badges).length;
    $('#statAnswered').textContent = state.answered;
    renderBadges();
    const rc = Object.keys(state.review).length;
    $('#reviewCount').textContent = rc ? `(${rc} 个)` : '(空)';
  }
  function renderBadges() {
    $('#badgeGrid').innerHTML = BADGES.map(b => `
      <div class="badge-item ${state.badges[b.id] ? 'earned' : ''}">
        <div class="bi-icon">${icon(b.icon, 26)}</div>
        <div class="bi-name">${esc(b.name)}</div>
        <div class="bi-desc">${esc(b.desc)}</div>
      </div>`).join('');
  }

  // ---------- 全局刷新 ----------
  function refreshAll() {
    renderTop(); renderHero(); renderMap(); updateMap(); renderMe();
  }

  // ---------- Tab 切换 ----------
  function switchTab(name) {
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    ['map', 'flash', 'quiz', 'me'].forEach(v => {
      $('#view-' + v).classList.toggle('hidden', v !== name);
    });
    if (name === 'map') {
      renderHero(); renderMap(); initMap();
      setTimeout(() => { if (mapChart) mapChart.resize(); }, 60);
    }
    if (name === 'flash') initFlash();
    if (name === 'me') renderMe();
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    $$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

    $('#regionTabs').addEventListener('click', e => {
      const btn = e.target.closest('.region-tab');
      if (!btn) return;
      currentRegion = btn.dataset.region;
      renderRegionTabs(); renderProvinceList();
    });

    $('#provinceList').addEventListener('click', e => {
      const item = e.target.closest('.city-item');
      if (item) { openCity(item.dataset.key); return; }
      const head = e.target.closest('.province-head');
      if (head) head.closest('.province-card').classList.toggle('open');
    });

    $('#searchInput').addEventListener('input', () => {
      const q = $('#searchInput').value.trim();
      if (q) renderSearch(q); else renderProvinceList();
    });

    $('#flashProvince').addEventListener('change', initFlash);
    $('#flashShuffle').addEventListener('click', initFlash);
    $('#flashGot').addEventListener('click', () => flashNext(true));
    $('#flashForgot').addEventListener('click', () => flashNext(false));

    $$('.mode-card').forEach(c => c.addEventListener('click', () => {
      const mode = c.dataset.mode;
      const abbr = $('#quizProvince').value || '全部';
      const pool = getQuizPool(mode, abbr);
      if (!pool.length) { toast('该范围内暂无城市'); return; }
      startQuiz(mode, pool);
    }));
    $('#quizQuit').addEventListener('click', showQuizSetup);

    $('#reviewBtn').addEventListener('click', startReview);
    $('#soundToggle').addEventListener('change', e => {
      state.sound = e.target.checked; save();
    });
    $('#darkToggle').addEventListener('change', e => {
      state.dark = e.target.checked;
      document.body.classList.toggle('dark', state.dark);
      save();
      if (mapChart) updateMap();
    });
    $('#resetBtn').addEventListener('click', () => {
      showConfirm('确认重置', '将清空所有学习进度、经验和徽章。', '继续', () => {
        showConfirm('最后确认', '此操作不可恢复，确定要清空全部数据吗？', '确认重置', () => {
          state = JSON.parse(JSON.stringify(defaultState));
          save(); refreshAll(); switchTab('map');
          document.body.classList.toggle('dark', state.dark);
          $('#darkToggle').checked = state.dark;
          $('#soundToggle').checked = state.sound;
          toast('已重置全部进度');
        });
      });
    });
  }

  // ---------- 启动 ----------
  function init() {
    document.body.classList.toggle('dark', !!state.dark);
    $('#darkToggle').checked = !!state.dark;
    $('#soundToggle').checked = !!state.sound;
    hydrateIcons();
    buildFlashProvinceSelect();
    bindEvents();
    renderTop(); renderHero(); renderMap(); renderMe();
    initMap();
    switchTab('map');
  }
  init();

  // 注册离线缓存（仅在 https / localhost 下生效）
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
