// Phase 3C — Chart.js + AI archive UI
(function(){
  var charts = { weight: null, cals: null };

  function themeColors(){
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      text:   isLight ? '#15151c' : '#e6e6f0',
      text2:  isLight ? '#6a6c80' : '#a0a0b8',
      grid:   isLight ? 'rgba(20,22,40,0.06)' : 'rgba(255,255,255,0.06)',
      accent: '#6c63ff',
      green:  '#43e97b',
      pink:   '#ff6584',
      orange: '#ff9f43',
    };
  }

  function makeGradient(ctx, color, a1, a2){
    var g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, color + a1);
    g.addColorStop(1, color + a2);
    return g;
  }

  function shortDay(d){
    var mm = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    return d.getDate() + ' ' + mm[d.getMonth()];
  }
  function ymd(d){
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  async function loadWeightChart(){
    if (typeof Chart === 'undefined') return;
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return;
    var base = window.API_BASE || '/api/proxy';
    var entries = [];
    try {
      var r = await fetch(base + '/api/weight_history?user_id=' + uid + '&limit=30');
      if (r.ok) { var j = await r.json(); entries = (j && j.entries) || []; }
    } catch(e){}
    var ctx = document.getElementById('chart-weight');
    if (!ctx) return;
    if (!entries.length) {
      ctx.parentElement.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">' + T('chart_weight_no_data','Нет данных о весе. Добавь запись через бота') + ' ⚖️</div>';
      return;
    }
    entries.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
    var labels = entries.map(function(e){ return shortDay(new Date(e.date)); });
    var data   = entries.map(function(e){ return Number(e.weight) || 0; });
    var sub = document.getElementById('chart-weight-sub');
    if (sub && entries.length >= 2) {
      var diff = data[data.length-1] - data[0];
      sub.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' ' + (LANG==='ru'?'кг':'kg') + ' · ' + entries.length;
    }
    var c = themeColors();
    var gctx = ctx.getContext('2d');
    if (charts.weight) charts.weight.destroy();
    charts.weight = new Chart(ctx, {
      type: 'line',
      data: { labels: labels, datasets: [{
        label: T('ring_cal','Вес'),
        data: data,
        borderColor: c.accent,
        backgroundColor: makeGradient(gctx, '#6c63ff', '55', '00'),
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: c.accent,
        borderWidth: 2.5,
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: c.text2, maxTicksLimit: 7, font:{size:10} }, grid: { color: c.grid } },
          y: { ticks: { color: c.text2, font:{size:10} }, grid: { color: c.grid }, beginAtZero: false },
        },
      }
    });
  }

  async function loadCalsChart(){
    if (typeof Chart === 'undefined') return;
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return;
    var base = window.API_BASE || '/api/proxy';
    var today = new Date(); today.setHours(0,0,0,0);
    var dates = [];
    for (var i = 29; i >= 0; i--) {
      var d = new Date(today); d.setDate(today.getDate()-i);
      dates.push(d);
    }
    var labels = dates.map(shortDay);
    var values = new Array(dates.length).fill(0);
    var goalRef = 2000;
    // Reuse heatmap cache if present
    var cache = (window.NutrioHeatmap && window.NutrioHeatmap._cache) || null;
    if (cache) {
      for (var i = 0; i < dates.length; i++) {
        var k = ymd(dates[i]);
        if (cache[k]) { values[i] = Math.round(cache[k].cals); goalRef = cache[k].goal || goalRef; }
      }
    } else {
      // Fetch in batches
      var fetched = await Promise.all(dates.map(function(d){
        return fetch(base + '/api/diary?user_id=' + uid + '&date=' + ymd(d))
          .then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; });
      }));
      fetched.forEach(function(j, i){
        if (j && j.total) { values[i] = Math.round(j.total.calories || 0); goalRef = j.daily_goal || goalRef; }
      });
    }
    var avg = Math.round(values.filter(function(v){return v>0;}).reduce(function(a,b){return a+b;},0)
              / Math.max(1, values.filter(function(v){return v>0;}).length));
    var sub = document.getElementById('chart-cals-sub');
    if (sub) sub.textContent = T('chart_cal_avg','среднее') + ': ' + avg + ' ' + (LANG==='ru'?'ккал':'kcal') + ' · ' + T('chart_cal_goal','цель') + ' ' + goalRef;

    var ctx = document.getElementById('chart-cals');
    if (!ctx) return;
    var c = themeColors();
    var gctx = ctx.getContext('2d');
    var bg = values.map(function(v){
      if (!v) return c.grid;
      var p = v / goalRef;
      if (p > 1.15) return c.pink;
      if (p >= 0.85) return c.green;
      return c.orange;
    });
    if (charts.cals) charts.cals.destroy();
    charts.cals = new Chart(ctx, {
      type: 'bar',
      data: { labels: labels, datasets: [{
        label: 'Ккал', data: values,
        backgroundColor: bg, borderRadius: 4, borderSkipped: false,
      }]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: c.text2, maxTicksLimit: 8, font:{size:10} }, grid: { display: false } },
          y: { ticks: { color: c.text2, font:{size:10} }, grid: { color: c.grid } },
        },
      }
    });
  }

  window.NutrioCharts = { weight: loadWeightChart, cals: loadCalsChart };

  // Hook into Progress tab — load charts once when opened
  var origSwitch = window.switchTab;
  if (typeof origSwitch === 'function') {
    window.switchTab = function(tab){
      var r = origSwitch.apply(this, arguments);
      if (tab === 'progress' && !window._chartsLoaded) {
        window._chartsLoaded = true;
        setTimeout(function(){ try { loadWeightChart(); loadCalsChart(); } catch(e){ console.error(e); } }, 400);
      }
      return r;
    };
  }
  // Re-render charts on theme change to recolor
  var mo = new MutationObserver(function(muts){
    muts.forEach(function(m){
      if (m.attributeName === 'data-theme' && window._chartsLoaded) {
        setTimeout(function(){ try { loadWeightChart(); loadCalsChart(); } catch(e){} }, 50);
      }
    });
  });
  try { mo.observe(document.documentElement, { attributes: true }); } catch(e){}
})();

// AI Archive sheet logic
(function(){
  var currentKind = '';
  function fmtDate(iso){
    if (!iso) return '';
    var d = new Date(iso);
    var hh = String(d.getHours()).padStart(2,'0'), mm = String(d.getMinutes()).padStart(2,'0');
    var mn = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][d.getMonth()];
    return d.getDate() + ' ' + mn + ' · ' + hh + ':' + mm;
  }
  function kindMeta(k){
    return ({
      nutri:  { ic:'🤖', name:(window.T?T('arch_kind_nutri','Анализ'):'Анализ'),   color:'rgba(108,99,255,0.18)' },
      recipe: { ic:'👨‍🍳', name:(window.T?T('arch_kind_recipe','Рецепт'):'Рецепт'),  color:'rgba(67,233,123,0.18)' },
      plan:   { ic:'📅', name:(window.T?T('arch_kind_plan','План'):'План'),     color:'rgba(255,159,67,0.18)' },
    })[k] || { ic:'✨', name:'AI', color:'rgba(120,120,150,0.18)' };
  }

  async function loadList(){
    var box = document.getElementById('ai-arch-list');
    if (!box) return;
    box.innerHTML = '<div class="ai-arch-empty">' + T('arch_loading','Загрузка...') + '</div>';
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) { box.innerHTML = '<div class="ai-arch-empty">' + T('arch_open_telegram','Открой Mini App из Telegram') + '</div>'; return; }
    var base = window.API_BASE || '/api/proxy';
    try {
      var r = await fetch(base + '/api/ai_archive?user_id=' + uid + '&limit=50' + (currentKind ? '&kind=' + currentKind : ''));
      var j = await r.json();
      if (!j.ok) throw new Error(j.error || 'failed');
      if (!j.items || !j.items.length) {
        box.innerHTML = '<div class="ai-arch-empty">' + T('arch_empty','Пока пусто. Сгенерируй что-нибудь!') + '</div>';
        return;
      }
      box.innerHTML = j.items.map(function(it){
        var meta = kindMeta(it.kind);
        return '<button class="ai-arch-item" onclick="openAiItem(' + it.id + ')">'
          + '<span class="ai-arch-ic" style="background:' + meta.color + '">' + meta.ic + '</span>'
          + '<div class="ai-arch-body">'
          +   '<div class="ai-arch-row1"><span class="ai-arch-title">' + (it.title || meta.name) + '</span>'
          +   '<span class="ai-arch-date">' + fmtDate(it.created_at) + '</span></div>'
          +   '<div class="ai-arch-snippet">' + (it.snippet || '').replace(/[<>]/g,'') + '</div>'
          + '</div></button>';
      }).join('');
    } catch(e) {
      box.innerHTML = '<div class="ai-arch-empty">' + T('arch_load_error','Ошибка загрузки') + '</div>';
    }
  }

  window.openAiArchive = function(){
    var s = document.getElementById('ai-archive-sheet');
    if (!s) return;
    s.classList.add('show'); s.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    loadList();
  };
  window.closeAiArchive = function(){
    var s = document.getElementById('ai-archive-sheet');
    if (!s) return;
    s.classList.remove('show'); s.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };
  window.aiArchSetKind = function(k, btn){
    currentKind = k;
    document.querySelectorAll('.ai-arch-tab').forEach(function(b){ b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    loadList();
  };

  window.openAiItem = async function(id){
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return;
    var base = window.API_BASE || '/api/proxy';
    var titleEl = document.getElementById('ai-view-title');
    var body    = document.getElementById('ai-view-body');
    if (titleEl) titleEl.textContent = T('arch_loading','Загрузка...');
    if (body)    body.innerHTML = '<div class="ai-loading">' + T('arch_view_loading','Открываю запись') + '</div>';
    var sheet = document.getElementById('ai-view-sheet');
    if (sheet) { sheet.classList.add('show'); sheet.setAttribute('aria-hidden','false'); }
    try {
      var r = await fetch(base + '/api/ai_archive_item?user_id=' + uid + '&id=' + id);
      var j = await r.json();
      if (!j.ok) throw new Error(j.error || 'failed');
      var meta = kindMeta(j.kind);
      if (titleEl) titleEl.textContent = meta.ic + ' ' + meta.name + ' · ' + fmtDate(j.created_at);
      if (body) {
        var rendered = (typeof renderMarkdown === 'function') ? renderMarkdown(j.text) : ('<pre style="white-space:pre-wrap">' + j.text.replace(/[<>]/g,'') + '</pre>');
        body.innerHTML = '<div class="ai-content">' + rendered + '</div>';
      }
      var del = document.getElementById('ai-view-del');
      if (del) del.onclick = function(){ deleteAiItem(id); };
    } catch(e) {
      if (titleEl) titleEl.textContent = T('arch_view_error','Ошибка');
      if (body) body.innerHTML = '<div class="ai-arch-empty">' + T('arch_view_open_fail','Не удалось открыть') + '</div>';
    }
  };
  window.closeAiView = function(){
    var s = document.getElementById('ai-view-sheet');
    if (!s) return;
    s.classList.remove('show'); s.setAttribute('aria-hidden','true');
  };
  async function deleteAiItem(id){
    if (!confirm(T('arch_delete_confirm','Удалить запись?'))) return;
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return;
    var base = window.API_BASE || '/api/proxy';
    try {
      var r = await fetch(base + '/api/ai_archive_item?user_id=' + uid + '&id=' + id, { method:'DELETE' });
      var j = await r.json();
      if (j.ok) {
        closeAiView();
        if (typeof showToast === 'function') showToast(T('arch_deleted','Удалено'), 'var(--green)');
        loadList();
      } else {
        if (typeof showToast === 'function') showToast(T('arch_delete_err','Ошибка удаления'), 'var(--accent2)');
      }
    } catch(e){
      if (typeof showToast === 'function') showToast(T('save_food_conn_err','Ошибка соединения'), 'var(--accent2)');
    }
  }
})();
