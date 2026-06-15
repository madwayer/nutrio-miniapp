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
    if (!uid) {
      // Retry once — user may have just loaded
      setTimeout(function(){ try { loadWeightChart(); } catch(e){} }, 800);
      return;
    }
    var base = window.API_BASE || '/api/proxy';
    var entries = [];
    try {
      var r = await fetch(base + '/api/weight_history?user_id=' + uid + '&limit=30', {headers:(window._authHeaders?window._authHeaders():{})});
      if (r.ok) {
        var j = await r.json(); entries = (j && j.entries) || [];
      }
      if (!entries.length) {
        try {
          var r2 = await fetch(base + '/api/stats?user_id=' + uid, {headers:(window._authHeaders?window._authHeaders():{})});
          if (r2.ok) {
            var j2 = await r2.json();
            if (j2 && j2.weight_history) {
              // stats отдаёт ISO в weight_history_iso (новый ключ) или dd.mm (старый)
              var src2 = j2.weight_history_iso || j2.weight_history;
              entries = src2.map(function(w){ return {date:w.date,weight:parseFloat(w.weight)||0}; })
                            .filter(function(e){ return !isNaN(new Date(e.date).getTime()); });
            }
          }
        } catch(e){}
      }
    } catch(e){}
    var ctx = document.getElementById('chart-weight');
    if (!ctx) return;
    if (!entries.length) {
      ctx.parentElement.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">' + T('chart_weight_no_data','Нет данных о весе. Добавь запись через бота') + ' ⚖️</div>';
      return;
    }
    entries.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
    // Одна точка на день — последнее взвешивание дня (иначе график шумит)
    var byDay = {};
    entries.forEach(function(e){ byDay[ymd(new Date(e.date))] = e; });
    entries = Object.keys(byDay).sort().map(function(k){ return byDay[k]; });
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
        label: T('chart_weight_label','Вес, кг'),
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
    if (!uid) {
      setTimeout(function(){ try { loadCalsChart(); } catch(e){} }, 800);
      return;
    }
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
    var gotData = false;
    // Один вызов /api/stats (бэк отдаёт 30 дней). Кэш heatmap не используем —
    // пустой объект кэша давал нулевой график (ловушка truthy {}).
    try {
      var sData = await fetch(base + '/api/stats?user_id=' + uid, {headers:(window._authHeaders?window._authHeaders():{})}).then(function(r){ return r.ok ? r.json() : null; });
      if (sData && sData.week_days && sData.week_days.length) {
        goalRef = sData.daily_goal || 2000;
        labels = []; values = [];
        sData.week_days.forEach(function(d){
          var dt = new Date(d.date);
          labels.push(isNaN(dt.getTime()) ? String(d.date) : shortDay(dt));
          values.push(Math.round(d.kcal || 0));
        });
        gotData = values.some(function(v){ return v > 0; });
      }
    } catch(e){ console.error('stats fetch', e); }
    var avg = Math.round(values.filter(function(v){return v>0;}).reduce(function(a,b){return a+b;},0)
              / Math.max(1, values.filter(function(v){return v>0;}).length));
    var sub = document.getElementById('chart-cals-sub');
    if (sub) sub.textContent = T('chart_cal_avg','среднее') + ': ' + avg + ' ' + (LANG==='ru'?'ккал':'kcal') + ' · ' + T('chart_cal_goal','цель') + ' ' + goalRef;

    var ctx = document.getElementById('chart-cals');
    if (!ctx) return;
    if (!gotData) {
      ctx.parentElement.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">' + T('chart_cal_no_data','Пока нет записей еды за 30 дней. Добавь еду — график оживёт') + ' 🍽</div>';
      return;
    }
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
  // Trigger charts when switching to progress; use event-based approach
  // to avoid conflicts with multiple switchTab wrappers in other modules.
  var _chartsTriggered = false;
  document.addEventListener('nutrio:tab', function(ev){
    if (ev.detail && (ev.detail.tab === 'statpage' || ev.detail.tab === 'progress')) {
      if (!_chartsTriggered) {
        _chartsTriggered = true;
        setTimeout(function(){ try { loadWeightChart(); loadCalsChart(); } catch(e){ console.error(e); } }, 300);
      } else {
        // Re-render on theme change or manual refresh
        try { loadWeightChart(); loadCalsChart(); } catch(e){}
      }
    }
  });
  // Also hook switchTab for backward compatibility (single wrap, no chain)
  if (typeof window._chartsHooked === 'undefined') {
    window._chartsHooked = true;
    var _origSwitchForCharts = window.switchTab;
    window.switchTab = function(tab){
      var r = _origSwitchForCharts ? _origSwitchForCharts.apply(this, arguments) : undefined;
      if (tab === 'statpage' || tab === 'progress') {
        document.dispatchEvent(new CustomEvent('nutrio:tab', { detail: { tab: tab } }));
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
      var r = await fetch(base + '/api/ai_archive?user_id=' + uid + '&limit=50' + (currentKind ? '&kind=' + currentKind : ''), {headers:(window._authHeaders?window._authHeaders():{})});
      var j = await r.json();
      if (!j.ok) throw new Error(j.error || 'failed');
      if (!j.items || !j.items.length) {
        box.innerHTML = '<div class="ai-arch-empty">' + T('arch_empty','Пока пусто. Сгенерируй что-нибудь!') + '</div>';
        return;
      }
      box.innerHTML = j.items.map(function(it){
        var meta = kindMeta(it.kind);
        // Экранируем title и snippet — title из AI-генерации, может содержать любые символы.
        var esc = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
        var safeTitle = esc(it.title || meta.name);
        var safeSnippet = esc((it.snippet || '').slice(0, 300));
        return '<button class="ai-arch-item" onclick="openAiItem(' + it.id + ')">'
          + '<span class="ai-arch-ic" style="background:' + meta.color + '">' + meta.ic + '</span>'
          + '<div class="ai-arch-body">'
          +   '<div class="ai-arch-row1"><span class="ai-arch-title">' + safeTitle + '</span>'
          +   '<span class="ai-arch-date">' + fmtDate(it.created_at) + '</span></div>'
          +   '<div class="ai-arch-snippet">' + safeSnippet + '</div>'
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
      var r = await fetch(base + '/api/ai_archive_item?user_id=' + uid + '&id=' + id, {headers:(window._authHeaders?window._authHeaders():{})});
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
      var r = await fetch(base + '/api/ai_archive_item?user_id=' + uid + '&id=' + id, { method:'DELETE', headers:(window._authHeaders?window._authHeaders():{}) });
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
