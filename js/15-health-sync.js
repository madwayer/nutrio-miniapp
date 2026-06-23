// ═══════════════════════════════════════════════════════════════
// СИНХРОНИЗАЦИЯ ЗДОРОВЬЯ  (15-health-sync.js)
// Ручной ввод + визуализация данных с трекеров.
// Шаги, сон, пульс, активность.
// ═══════════════════════════════════════════════════════════════

(function(){

var _hsyncData  = null;
var _hsyncLoaded = false;
var _hsyncDate  = null;

// ── Инициализация ────────────────────────────────────────────────
async function initHealthSyncPage() {
  _hsyncDate = new Date().toISOString().slice(0, 10);
  if (!_hsyncLoaded) {
    _hsyncLoaded = true;
    await _hsyncLoad();
  }
}
window.initHealthSyncPage = initHealthSyncPage;

async function _hsyncLoad() {
  try {
    var d = await apiGet('/api/health_sync', {date: _hsyncDate, range: 7});
    if (d && d.ok) {
      // today
      // days массив: [6 дней назад ... сегодня], берём последний элемент = сегодня
      _hsyncData = (d.days && d.days[d.days.length - 1]) || d.data || {};
      _hsyncRenderToday(_hsyncData);
      // history
      if (d.days) _hsyncRenderHistory(d.days);
    }
  } catch(e) { console.warn('[hsync] load failed', e); }
}

// ── Рендер сегодня ───────────────────────────────────────────────
function _hsyncRenderToday(data) {
  data = data || {};
  var ru = _hsyncIsRu();

  // Шаги
  _hsyncRenderMetric('hsync-steps', {
    value:   data.steps ? data.steps.toLocaleString('ru-RU') : '—',
    unit:    ru ? 'шагов' : 'steps',
    max:     10000,
    current: data.steps || 0,
    label:   ru ? '🎯 Цель 10 000' : '🎯 Goal 10,000',
    color:   data.steps >= 10000 ? 'var(--green)' : data.steps >= 7500 ? '#2563eb' : 'var(--accent)',
    sub:     data.distance_m ? (data.distance_m/1000).toFixed(1) + (ru?' км':' km') : '',
  });

  // Сон
  var sleepH = data.sleep_minutes ? (data.sleep_minutes / 60).toFixed(1) : null;
  _hsyncRenderMetric('hsync-sleep', {
    value:   sleepH ? sleepH + (ru ? ' ч' : ' h') : '—',
    unit:    ru ? 'сна' : 'sleep',
    max:     9 * 60,
    current: data.sleep_minutes || 0,
    label:   ru ? '🎯 Норма 7–9 ч' : '🎯 Target 7–9 h',
    color:   data.sleep_minutes >= 7*60 ? 'var(--green)' : data.sleep_minutes >= 6*60 ? '#d97706' : 'var(--accent2)',
    sub:     data.sleep_quality ? '⭐'.repeat(data.sleep_quality) : '',
  });

  // Пульс
  var hrEl = document.getElementById('hsync-hr');
  if (hrEl) {
    hrEl.innerHTML = data.heart_rate_avg
      ? '<span style="font-size:28px;font-weight:800;color:#ef4444">' + data.heart_rate_avg + '</span>'
        + '<span style="font-size:13px;color:var(--text2);margin-left:4px">' + (ru ? 'уд/мин' : 'bpm') + '</span>'
        + (data.heart_rate_rest ? '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + (ru ? 'в покое: ' : 'resting: ') + data.heart_rate_rest + (ru ? ' уд/мин' : ' bpm') + '</div>' : '')
      : '<span style="font-size:22px;color:var(--text2)">—</span>'
        + '<div style="font-size:11px;color:var(--text2);margin-top:4px">' + (ru ? 'не указан' : 'not set') + '</div>';
  }

  // Активность
  var actEl = document.getElementById('hsync-activity');
  if (actEl) {
    var kcal = data.calories_burned || 0;
    var actMin = data.active_minutes || 0;
    actEl.innerHTML = kcal
      ? '<span style="font-size:28px;font-weight:800;color:var(--accent2)">-' + Math.round(kcal) + '</span>'
        + '<span style="font-size:13px;color:var(--text2);margin-left:4px">' + (ru ? 'ккал' : 'kcal') + '</span>'
        + (actMin ? '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + actMin + (ru ? ' акт. мин' : ' active min') + '</div>' : '')
      : '<span style="font-size:22px;color:var(--text2)">—</span>'
        + '<div style="font-size:11px;color:var(--text2);margin-top:4px">' + (ru ? 'не указана' : 'not set') + '</div>';
  }
}

function _hsyncRenderMetric(id, cfg) {
  var el = document.getElementById(id);
  if (!el) return;
  var pct = cfg.max > 0 ? Math.min(100, Math.round(cfg.current / cfg.max * 100)) : 0;
  el.innerHTML =
    '<span style="font-size:28px;font-weight:800;color:' + cfg.color + '">' + cfg.value + '</span>'
    + '<span style="font-size:13px;color:var(--text2);margin-left:4px">' + cfg.unit + '</span>'
    + (cfg.sub ? '<span style="font-size:12px;color:var(--text2);margin-left:8px">' + cfg.sub + '</span>' : '')
    + '<div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-top:6px">'
    +   '<div style="height:100%;width:' + pct + '%;background:' + cfg.color + ';border-radius:2px;transition:width .8s ease"></div>'
    + '</div>'
    + '<div style="font-size:10px;color:var(--text2);margin-top:3px">' + cfg.label + '</div>';
}

// ── История 7 дней (мини-бар-чарт) ──────────────────────────────
function _hsyncRenderHistory(days) {
  var el = document.getElementById('hsync-history');
  if (!el || !days || !days.length) return;
  var ru = _hsyncIsRu();

  // Шаги за 7 дней
  var maxSteps = 1;
  days.forEach(function(d){ if (d.steps && d.steps > maxSteps) maxSteps = d.steps; });
  maxSteps = Math.max(maxSteps, 10000);

  var bars = days.slice().reverse().map(function(d){
    var dateLabel = d.date ? d.date.slice(5) : '';
    var pct = d.steps ? Math.min(100, Math.round(d.steps / maxSteps * 100)) : 0;
    var color = d.steps >= 10000 ? 'var(--green)' : d.steps >= 7500 ? '#2563eb' : d.steps ? 'var(--accent)' : 'var(--surface2)';
    return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">'
      + '<div style="font-size:10px;color:var(--text2)">' + (d.steps ? Math.round(d.steps/1000*10)/10 + 'к' : '—') + '</div>'
      + '<div style="width:100%;background:var(--surface2);border-radius:4px;height:60px;position:relative;overflow:hidden">'
      +   '<div style="position:absolute;bottom:0;left:0;right:0;height:' + pct + '%;background:' + color + ';border-radius:4px;transition:height .6s ease"></div>'
      + '</div>'
      + '<div style="font-size:9px;color:var(--text2)">' + dateLabel + '</div>'
      + '</div>';
  }).join('');

  el.innerHTML =
    '<div style="font-size:11px;font-weight:700;color:var(--text2);letter-spacing:.5px;margin-bottom:8px">'
    + '👟 ' + (ru ? 'ШАГИ ЗА 7 ДНЕЙ' : 'STEPS LAST 7 DAYS')
    + '</div>'
    + '<div style="display:flex;gap:4px;align-items:flex-end">' + bars + '</div>';
}

// ── Форма ввода ──────────────────────────────────────────────────
async function hsyncSave() {
  var ru = _hsyncIsRu();
  var steps    = parseInt(document.getElementById('hsync-inp-steps').value || '0') || null;
  var sleepH   = parseFloat(document.getElementById('hsync-inp-sleep').value || '0') || null;
  var quality  = parseInt(document.querySelector('.hsync-quality-btn.active')?.dataset?.q || '0') || null;
  var hr       = parseInt(document.getElementById('hsync-inp-hr').value || '0') || null;

  var payload = {date: _hsyncDate, source: 'manual'};
  if (steps)   { payload.steps = steps; payload.distance_m = Math.round(steps / 1312 * 1000); }
  if (sleepH)  { payload.sleep_minutes = Math.round(sleepH * 60); }
  if (quality) { payload.sleep_quality = quality; }
  if (hr)      { payload.heart_rate_avg = hr; }

  if (Object.keys(payload).length <= 2) {
    showToast(ru ? 'Введи хотя бы один показатель' : 'Enter at least one metric', 'var(--accent2)');
    return;
  }

  var btn = document.getElementById('hsync-save-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }

  try {
    var d = await apiPost('/api/health_sync', payload);
    if (d && d.ok) {
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
      showToast(ru ? '✅ Данные сохранены! +10 XP' : '✅ Data saved! +10 XP', 'var(--green)');
      _hsyncLoaded = false;
      await _hsyncLoad();
    } else {
      showToast((d && d.error) || (ru ? 'Ошибка' : 'Error'), 'var(--accent2)');
    }
  } catch(e) {
    showToast(ru ? 'Ошибка соединения' : 'Connection error', 'var(--accent2)');
  }
  if (btn) { btn.disabled = false; btn.textContent = ru ? '💾 Сохранить' : '💾 Save'; }
}
window.hsyncSave = hsyncSave;

function hsyncQuality(btn, q) {
  document.querySelectorAll('.hsync-quality-btn').forEach(function(b){
    b.style.background = 'var(--surface2)'; b.style.color = 'var(--text)';
    b.style.border = '1px solid var(--glass-border)';
  });
  btn.style.background = 'var(--accent)';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.classList.add('active');
  document.querySelectorAll('.hsync-quality-btn').forEach(function(b){
    if (b !== btn) b.classList.remove('active');
  });
}
window.hsyncQuality = hsyncQuality;

function _hsyncIsRu() {
  try {
    var lang = (typeof i18n !== 'undefined' && i18n._lang) || navigator.language || 'ru';
    return lang.startsWith('ru') || lang.startsWith('uk') || lang.startsWith('be');
  } catch(e){ return true; }
}

// switchTab
// Принудительный сброс кеша (вызывается из onclick на кнопке Обновить)
window._hsyncForceRefresh = function() {
  _hsyncLoaded = false;
  initHealthSyncPage();
};

(function(){
  var _orig = window.switchTab;
  if (typeof _orig === 'function') {
    window.switchTab = function(name) {
      _orig(name);
      if (name === 'healthsync') initHealthSyncPage();
    };
  }
})();

})();

// ════ ТОКЕН И ТАБЫ — дополнение к существующему коду ════

var _hsyncToken   = null;
var _hsyncWebhook = 'https://147.45.162.38/api/health_sync';

async function _hsyncLoadToken() {
  try {
    var d = await apiGet('/api/health_sync/token');
    if (d && d.ok && d.token) {
      _hsyncToken = d.token;
      if (d.webhook_url) _hsyncWebhook = d.webhook_url;
      // Обновляем отображение
      var els = ['hsync-token-ios','hsync-token-android'];
      els.forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.textContent = d.token;
      });
      var wu = document.getElementById('hsync-webhook-android');
      if (wu) wu.textContent = _hsyncWebhook;
    }
  } catch(e) { console.warn('[hsync] token load failed', e); }
}

function hsyncShowTab(tab) {
  ['ios','android','manual'].forEach(function(t){
    var btn = document.getElementById('hsync-tab-' + t);
    var cnt = document.getElementById('hsync-content-' + t);
    var active = t === tab;
    if (btn) {
      btn.style.background = active ? 'var(--accent)' : 'transparent';
      btn.style.color      = active ? '#fff' : 'var(--text2)';
    }
    if (cnt) cnt.style.display = active ? 'block' : 'none';
  });
  // Загружаем токен при первом показе iOS/Android таба
  if ((tab === 'ios' || tab === 'android') && !_hsyncToken) {
    _hsyncLoadToken();
  }
}
window.hsyncShowTab = hsyncShowTab;

function hsyncCopyToken() {
  if (!_hsyncToken) { showToast('Токен загружается...', 'var(--text2)'); _hsyncLoadToken(); return; }
  try {
    navigator.clipboard.writeText(_hsyncToken).then(function(){
      showToast('✅ Токен скопирован', 'var(--green)');
    }).catch(function(){ _hsyncFallbackCopy(_hsyncToken); });
  } catch(e) { _hsyncFallbackCopy(_hsyncToken); }
}
window.hsyncCopyToken = hsyncCopyToken;

function hsyncCopyWebhook() {
  try {
    navigator.clipboard.writeText(_hsyncWebhook).then(function(){
      showToast('✅ URL скопирован', 'var(--green)');
    }).catch(function(){ _hsyncFallbackCopy(_hsyncWebhook); });
  } catch(e) { _hsyncFallbackCopy(_hsyncWebhook); }
}
window.hsyncCopyWebhook = hsyncCopyWebhook;

function _hsyncFallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showToast('✅ Скопировано', 'var(--green)'); }
  catch(e) { showToast('Не удалось скопировать', 'var(--accent2)'); }
  document.body.removeChild(ta);
}

// Агрегаты за 7 дней
function _hsyncRenderAggregates(agg) {
  if (!agg) return;
  var el  = document.getElementById('hsync-aggregates');
  var grid= document.getElementById('hsync-agg-grid');
  if (!el || !grid) return;
  var ru  = _hsyncIsRu();
  var items = [
    agg.avg_steps    != null ? {v: (agg.avg_steps||0).toLocaleString('ru-RU'), l: ru?'Среднее шагов':'Avg steps', e:'👟'} : null,
    agg.avg_sleep_h  != null ? {v: agg.avg_sleep_h + (ru?' ч':' h'),        l: ru?'Средний сон':'Avg sleep',  e:'😴'} : null,
    agg.avg_hr       != null ? {v: agg.avg_hr + ' bpm',                     l: ru?'Средний пульс':'Avg HR',   e:'❤️'} : null,
    agg.best_steps   != null ? {v: (agg.best_steps||0).toLocaleString('ru-RU'), l:ru?'Рекорд шагов':'Best steps', e:'🏆'} : null,
    agg.days_with_data != null ? {v: agg.days_with_data, l: ru?'Дней данных':'Days tracked', e:'📅'} : null,
  ].filter(Boolean);
  if (!items.length) return;
  el.style.display = 'block';
  grid.innerHTML = items.map(function(i){
    return '<div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">'
      + '<div style="font-size:18px;margin-bottom:4px">' + i.e + '</div>'
      + '<div style="font-size:16px;font-weight:800;color:var(--accent)">' + i.v + '</div>'
      + '<div style="font-size:10px;color:var(--text2);margin-top:2px">' + i.l + '</div>'
      + '</div>';
  }).join('');
}

// Перехватываем initHealthSyncPage чтобы добавить загрузку агрегатов и токена
var _origInitHealthSync = window.initHealthSyncPage;
window.initHealthSyncPage = async function() {
  if (_origInitHealthSync) await _origInitHealthSync();
  // Агрегаты уже приходят в _hsyncLoad через range:7 ответ
  // Загружаем токен в фоне
  if (!_hsyncToken) _hsyncLoadToken();
};
