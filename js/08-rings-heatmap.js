// Phase 3A — sync theme picker UI on DOMContentLoaded
(function(){
  function init(){
    var cur = (typeof NutrioTheme !== 'undefined' && NutrioTheme.get) ? NutrioTheme.get() : 'dark';
    if (window._syncThemePicker) window._syncThemePicker(cur);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// Phase 3A — Goal Rings on Diary page
(function(){
  // Defaults if backend doesn't supply per-macro goals
  function deriveMacroGoals(kcalGoal) {
    return {
      protein: Math.round(kcalGoal * 0.30 / 4),
      fat:     Math.round(kcalGoal * 0.30 / 9),
      carbs:   Math.round(kcalGoal * 0.40 / 4)
    };
  }
  function setRing(cellEl, pct) {
    pct = Math.max(0, Math.min(150, pct || 0));
    var fill = cellEl.querySelector('.gring-fill');
    if (!fill) return;
    var r = parseFloat(fill.getAttribute('r')) || 28;
    var circ = 2 * Math.PI * r;
    fill.setAttribute('stroke-dasharray', circ.toFixed(2));
    var displayPct = Math.min(100, pct);
    fill.setAttribute('stroke-dashoffset', (circ * (1 - displayPct/100)).toFixed(2));
  }
  function readNum(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var n = parseFloat((el.textContent || '0').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  function readGoalKcal() {
    var el = document.getElementById('diary-kcal-goal');
    if (!el) return 2000;
    var m = (el.textContent || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 2000;
  }
  function syncRings() {
    var card = document.getElementById('gring-card');
    if (!card) return;
    var kcal = readNum('diary-kcal-eaten');
    var prot = readNum('diary-prot');
    var fat  = readNum('diary-fat');
    var carb = readNum('diary-carb');
    var kcalGoal = readGoalKcal();
    var goals = deriveMacroGoals(kcalGoal);

    var cells = card.querySelectorAll('.gring-cell');
    var data = [
      { val: kcal, goal: kcalGoal,    unit: 'ккал' },
      { val: prot, goal: goals.protein, unit: 'г' },
      { val: fat,  goal: goals.fat,    unit: 'г' },
      { val: carb, goal: goals.carbs,  unit: 'г' }
    ];
    cells.forEach(function(cell, i) {
      var d = data[i]; if (!d) return;
      var pct = d.goal > 0 ? (d.val / d.goal) * 100 : 0;
      setRing(cell, pct);
      var pctEl = cell.querySelector('.gring-pct');
      var valEl = cell.querySelector('.gring-value');
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      if (valEl) valEl.textContent = Math.round(d.val) + ' / ' + Math.round(d.goal) + ' ' + d.unit;
    });
  }
  window.syncGoalRings = syncRings;

  // Watch the existing macro/calorie values; sync rings on any change
  function startObserver() {
    var targets = ['diary-kcal-eaten','diary-kcal-goal','diary-prot','diary-fat','diary-carb']
      .map(function(id){ return document.getElementById(id); })
      .filter(Boolean);
    if (!targets.length) return;
    var obs = new MutationObserver(function(){ syncRings(); });
    targets.forEach(function(t){ obs.observe(t, { childList: true, characterData: true, subtree: true }); });
    syncRings();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObserver);
  else startObserver();
})();

// Phase 3A — Compliance Heatmap on Progress page
(function(){
  var DAYS    = 35;            // ~5 weeks
  var BATCH   = 5;             // parallel fetches
  var cache   = {};            // date -> {cals, goal}
  var loaded  = false;
  var loading = false;

  function ymd(d){
    return d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
  }
  function shortLabel(d){
    var mm = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    return d.getDate() + ' ' + mm[d.getMonth()];
  }
  function dayLevel(cals, goal){
    if (!cals || !goal) return '0';
    var p = cals / goal;
    if (p > 1.15) return 'over';
    if (p >= 0.90) return '4';
    if (p >= 0.65) return '3';
    if (p >= 0.35) return '2';
    if (p > 0)     return '1';
    return '0';
  }

  function buildEmpty(){
    var grid = document.getElementById('hm-grid');
    if (!grid) return;
    grid.innerHTML = '';
    var today = new Date(); today.setHours(0,0,0,0);
    var cells = [];
    for (var i = DAYS - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      var key = ymd(d);
      var lvl = '0';
      if (cache[key]) lvl = dayLevel(cache[key].cals, cache[key].goal);
      var cell = document.createElement('div');
      cell.className = 'hm-cell';
      cell.setAttribute('data-level', lvl);
      cell.setAttribute('data-date', key);
      if (key === ymd(today)) cell.classList.add('today');
      cell.innerHTML = '<span class="hm-day-num">' + d.getDate() + '</span>';
      cell.addEventListener('click', onCellTap);
      cells.push(cell);
      grid.appendChild(cell);
    }
  }

  function onCellTap(e){
    var t = e.currentTarget;
    var key = t.getAttribute('data-date');
    var c = cache[key];
    // Single tap → tooltip; double-tap (≤1.2s on same cell) → open Diary on that date
    var now = Date.now();
    var lastKey = window._hmLastKey;
    var lastT   = window._hmLastT || 0;
    var isDouble = (key === lastKey) && (now - lastT < 1200);
    window._hmLastKey = key; window._hmLastT = now;

    if (isDouble) {
      try {
        // Navigate to that day in diary: parse date string, set global diaryDate, reload
        var parts2 = key.split('-');
        var targetDate = new Date(parseInt(parts2[0],10), parseInt(parts2[1],10)-1, parseInt(parts2[2],10));
        if (typeof window.diaryDate !== 'undefined') window.diaryDate = targetDate;
        if (typeof switchTab === 'function') switchTab('diary');
        setTimeout(function(){
          if (typeof window.loadDiary === 'function') {
            try { window.loadDiary(); } catch(__) {}
          }
        }, 60);
        try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback)
          Telegram.WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
      } catch(err) { console.warn(err); }
      return;
    }

    var tip = document.getElementById('hm-tip') || (function(){
      var el = document.createElement('div'); el.id = 'hm-tip'; el.className = 'hm-tip';
      document.body.appendChild(el); return el;
    })();
    var parts = key.split('-');
    var dd = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10));
    var noData = (typeof T==='function') ? T('hm_no_data','нет данных') : 'нет данных';
    var kcalLbl = (typeof T==='function') ? T('kcal_short','ккал') : 'ккал';
    var hint    = (typeof T==='function') ? T('hm_dbl_hint','· двойной тап — открыть в дневнике')
                                          : '· двойной тап — открыть';
    var line = shortLabel(dd) + ' · ';
    if (c) line += Math.round(c.cals) + ' / ' + Math.round(c.goal) + ' ' + kcalLbl;
    else   line += noData;
    line += ' ' + hint;
    tip.textContent = line;
    var rect = t.getBoundingClientRect();
    tip.style.left = (rect.left + rect.width/2) + 'px';
    tip.style.top  = rect.top + 'px';
    tip.classList.add('show');
    clearTimeout(window._hmTipT);
    window._hmTipT = setTimeout(function(){ tip.classList.remove('show'); }, 2400);
  }

  function setProgress(done, total){
    var p = document.getElementById('hm-progress-fill');
    if (!p) return;
    p.style.width = total ? Math.round(done/total*100) + '%' : '0%';
  }
  function setStatus(msg){
    var s = document.getElementById('hm-status');
    if (s) s.textContent = msg || '';
  }

  function fetchDay(dateStr){
    // Оставлено для совместимости — одиночный фетч больше не используется,
    // loadAll() дёргает /api/calendar_summary один раз на весь диапазон.
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return Promise.resolve(null);
    var base = (window.API_BASE || '/api/proxy');
    return fetch(base + '/api/diary?user_id=' + uid + '&date=' + dateStr, {headers:(window._authHeaders?window._authHeaders():{})})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (!d || d.error) return null;
        return { cals: (d.total && d.total.calories) || 0, goal: d.daily_goal || 2000 };
      })
      .catch(function(){ return null; });
  }

  async function loadAll(){
    if (loading) return;
    loading = true;
    setStatus(T('hm_loading','Загружаю данные...'));

    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    var base = (window.API_BASE || '/api/proxy');
    var ok = false;

    if (uid) {
      try {
        var r = await fetch(base + '/api/calendar_summary?user_id=' + uid + '&days=' + DAYS, {
          headers: (window._authHeaders ? window._authHeaders() : {}),
        });
        if (r.ok) {
          var d = await r.json();
          if (d && d.ok && Array.isArray(d.days)) {
            var goal = d.daily_goal || 2000;
            d.days.forEach(function(row){
              cache[row.date] = { cals: row.kcal || 0, goal: goal };
            });
            setProgress(DAYS, DAYS);
            buildEmpty();
            ok = true;
          }
        }
      } catch(e) { /* fallback ниже */ }
    }

    // Фоллбэк на старый поштучный фетч (если бэк ещё не обновлён до /api/calendar_summary)
    if (!ok && uid) {
      var today = new Date(); today.setHours(0,0,0,0);
      var dates = [];
      for (var i = 0; i < DAYS; i++) {
        var dd = new Date(today); dd.setDate(today.getDate() - i);
        dates.push(ymd(dd));
      }
      var done = 0;
      for (var i = 0; i < dates.length; i += BATCH) {
        var batch = dates.slice(i, i + BATCH);
        var results = await Promise.all(batch.map(fetchDay));
        results.forEach(function(r, idx){
          if (r) cache[batch[idx]] = r;
          done++; setProgress(done, dates.length);
        });
        buildEmpty();
      }
    }

    setStatus('');
    var btn = document.getElementById('hm-load-btn');
    if (btn) { btn.textContent = T('hm_refresh','🔄 Обновить'); btn.disabled = false; }
    loaded = true;
    loading = false;
  }

  window.NutrioHeatmap = {
    init: function(){
      if (!document.getElementById('hm-grid')) return;
      buildEmpty();
      var btn = document.getElementById('hm-load-btn');
      if (btn) btn.addEventListener('click', loadAll);
    },
    load: loadAll
  };

  // Auto-build empty grid + bind button when Progress page initializes
  function tryInit(){
    if (document.getElementById('hm-grid')) window.NutrioHeatmap.init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryInit);
  else tryInit();
})();
