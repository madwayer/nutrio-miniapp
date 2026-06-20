// ═══════════════════════════════════════════════════════════════
// ТРЕКИНГ УПРАЖНЕНИЙ  (13-exercise.js)
// Поиск упражнений, добавление с интенсивностью, история дня,
// сожжённые калории и как они влияют на дневной баланс.
// ═══════════════════════════════════════════════════════════════

(function(){

var _exDate    = null;
var _exData    = null;
var _exLoaded  = false;
var _exSearchTimeout = null;
var _exSelectedKey   = null;
var _exSelectedName  = '';
var _exSelectedEmoji = '🏃';

// ── Загрузка данных дня ──────────────────────────────────────────
async function exLoad(dateStr) {
  _exLoaded = true;
  _exDate = dateStr || new Date().toISOString().slice(0, 10);
  try {
    var d = await apiGet('/api/exercise', {date: _exDate});
    if (d && d.ok) {
      _exData = d;
      _renderExSummary(d);
      _renderExList(d.entries || []);
    }
  } catch(e) { console.warn('[exercise] load failed', e); }
}
window.exLoad = exLoad;

function initExercisePage() {
  _renderExSearch();
  if (!_exLoaded) exLoad();
}
window.initExercisePage = initExercisePage;

// ── Итоговая карточка ────────────────────────────────────────────
function _renderExSummary(d) {
  var el = document.getElementById('ex-summary');
  if (!el) return;
  var burned = d.total_burned || 0;
  var net    = d.net_goal    || 0;
  var ru     = _exIsRu();

  el.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + '<div style="background:rgba(219,39,119,.10);border-radius:12px;padding:12px;text-align:center">'
    +   '<div style="font-size:22px;font-weight:800;color:var(--accent2)">-' + Math.round(burned) + '</div>'
    +   '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + (ru ? 'ккал сожжено' : 'kcal burned') + '</div>'
    + '</div>'
    + '<div style="background:rgba(22,163,74,.10);border-radius:12px;padding:12px;text-align:center">'
    +   '<div style="font-size:22px;font-weight:800;color:var(--green)">' + Math.round(net) + '</div>'
    +   '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + (ru ? 'чистая цель' : 'net goal') + '</div>'
    + '</div>'
    + '</div>'
    + (burned > 0
      ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);text-align:center">'
        + (ru ? '💡 Чистая цель = дневная норма − сожжённые калории' : '💡 Net goal = daily target − calories burned')
        + '</div>'
      : '');
}

// ── Список тренировок дня ─────────────────────────────────────────
function _renderExList(entries) {
  var el = document.getElementById('ex-list');
  if (!el) return;
  var ru = _exIsRu();

  if (!entries.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text2)">'
      + '<div style="font-size:40px;margin-bottom:10px">🏃</div>'
      + '<div>' + (ru ? 'Тренировок пока нет — добавь первую!' : 'No workouts yet — add your first!') + '</div>'
      + '</div>';
    return;
  }

  el.innerHTML = entries.map(function(e){
    var intLabel = ru
      ? ({low:'лёгкая', medium:'средняя', high:'высокая'}[e.intensity] || '')
      : ({low:'light', medium:'moderate', high:'high'}[e.intensity] || '');
    return '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;'
      + 'background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;margin-bottom:8px">'
      + '<span style="font-size:24px;flex-shrink:0">' + e.emoji + '</span>'
      + '<div style="flex:1;min-width:0">'
      +   '<div style="font-weight:700;font-size:14px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + e.name + '</div>'
      +   '<div style="font-size:12px;color:var(--text2);margin-top:2px">'
      +     e.minutes + (ru ? ' мин' : ' min') + ' · ' + intLabel + ' · ' + e.time
      +   '</div>'
      + '</div>'
      + '<div style="text-align:right;flex-shrink:0">'
      +   '<div style="font-size:16px;font-weight:800;color:var(--accent2)">-' + Math.round(e.kcal_burned) + '</div>'
      +   '<div style="font-size:10px;color:var(--text2)">' + (ru ? 'ккал' : 'kcal') + '</div>'
      + '</div>'
      + '<button onclick="exDelete(' + e.id + ')" style="background:transparent;border:none;font-size:18px;cursor:pointer;color:var(--text2);padding:4px;min-width:32px;min-height:32px;flex-shrink:0">×</button>'
      + '</div>';
  }).join('');
}

// ── Поиск и форма добавления ─────────────────────────────────────
function _renderExSearch() {
  var el = document.getElementById('ex-search-results');
  if (!el) return;
  el.innerHTML = '';
}

function exSearchInput(val) {
  clearTimeout(_exSearchTimeout);
  if (val.length < 1) {
    _clearExSearchResults();
    return;
  }
  _exSearchTimeout = setTimeout(function(){ _doExSearch(val); }, 300);
}
window.exSearchInput = exSearchInput;

async function _doExSearch(q) {
  try {
    var ru = _exIsRu();
    var d  = await apiGet('/api/exercise/search', {q: q, lang: ru ? 'ru' : 'en'});
    var el = document.getElementById('ex-search-results');
    if (!el) return;
    if (!d || !d.results || !d.results.length) {
      el.innerHTML = '<div style="padding:10px 14px;font-size:13px;color:var(--text2)">'
        + (ru ? 'Не найдено. Попробуй по-другому или введи вручную.' : 'Not found. Try a different query.')
        + '</div>';
      return;
    }
    el.innerHTML = d.results.map(function(r){
      return '<button onclick="exSelectExercise(\'' + r.key + '\',\'' + r.name.replace(/'/g,"\\'") + '\',\'' + r.emoji + '\')" style="'
        + 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:transparent;border:none;'
        + 'border-bottom:1px solid var(--glass-border);font:inherit;cursor:pointer;text-align:left;width:100%">'
        + '<span style="font-size:20px">' + r.emoji + '</span>'
        + '<span style="font-size:14px;color:var(--text);font-weight:600">' + r.name + '</span>'
        + '</button>';
    }).join('');
  } catch(e) { _clearExSearchResults(); }
}

function _clearExSearchResults() {
  var el = document.getElementById('ex-search-results');
  if (el) el.innerHTML = '';
}

function exSelectExercise(key, name, emoji) {
  _exSelectedKey   = key;
  _exSelectedName  = name;
  _exSelectedEmoji = emoji;

  // Обновляем инпут
  var inp = document.getElementById('ex-search-input');
  if (inp) inp.value = emoji + ' ' + name;
  _clearExSearchResults();

  // Показываем форму добавления
  var form = document.getElementById('ex-add-form');
  if (form) form.style.display = 'block';

  // Фокус на минуты
  var min = document.getElementById('ex-minutes');
  if (min) { min.focus(); min.select(); }
}
window.exSelectExercise = exSelectExercise;

// ── Добавление тренировки ─────────────────────────────────────────
async function exAdd() {
  var ru       = _exIsRu();
  var minutes  = parseFloat(document.getElementById('ex-minutes').value || '0');
  var intensity = document.querySelector('.ex-int-btn.active')?.dataset?.int || 'medium';
  var note     = (document.getElementById('ex-note')?.value || '').trim();

  if (!_exSelectedKey && !_exSelectedName) {
    showToast(ru ? 'Выбери упражнение' : 'Select an exercise', 'var(--accent2)'); return;
  }
  if (minutes <= 0 || minutes > 600) {
    showToast(ru ? 'Укажи время (1–600 мин)' : 'Enter duration (1–600 min)', 'var(--accent2)'); return;
  }

  var btn = document.getElementById('ex-add-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }

  try {
    var d = await apiPost('/api/exercise', {
      exercise_key: _exSelectedKey || 'custom',
      name_custom:  _exSelectedKey ? '' : _exSelectedName,
      minutes:      minutes,
      intensity:    intensity,
      note:         note,
    });
    if (d && d.ok) {
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
      var kcal = Math.round(d.kcal_burned);
      showToast((d.emoji || '🏃') + ' ' + (d.name || '') + ' −' + kcal + (ru ? ' ккал' : ' kcal'), 'var(--green)');

      // Сбрасываем форму
      _exSelectedKey = null; _exSelectedName = ''; _exSelectedEmoji = '🏃';
      var inp = document.getElementById('ex-search-input');
      if (inp) inp.value = '';
      var form = document.getElementById('ex-add-form');
      if (form) form.style.display = 'none';
      var noteEl = document.getElementById('ex-note');
      if (noteEl) noteEl.value = '';
      document.getElementById('ex-minutes').value = '30';

      await exLoad(_exDate);
    } else {
      showToast((d && d.error) || (ru ? 'Ошибка' : 'Error'), 'var(--accent2)');
    }
  } catch(e) {
    showToast(ru ? 'Ошибка соединения' : 'Connection error', 'var(--accent2)');
  }
  if (btn) { btn.disabled = false; btn.textContent = ru ? '+ Добавить' : '+ Add'; }
}
window.exAdd = exAdd;

// Кнопки интенсивности
function exSetIntensity(btn, val) {
  document.querySelectorAll('.ex-int-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
}
window.exSetIntensity = exSetIntensity;

// ── Удаление записи ──────────────────────────────────────────────
async function exDelete(entryId) {
  var ru = _exIsRu();
  showConfirm(
    ru ? 'Удалить запись тренировки?' : 'Delete workout entry?',
    async function() {
      try {
        var d = await apiPost('/api/exercise', {entry_id: entryId}, 'DELETE');
        if (d && d.ok) { showToast(ru ? 'Удалено' : 'Deleted', 'var(--green)'); exLoad(_exDate); }
        else showToast(ru ? 'Ошибка' : 'Error', 'var(--accent2)');
      } catch(e) { showToast(ru ? 'Ошибка' : 'Error', 'var(--accent2)'); }
    },
    null,
    {yes: ru ? '🗑 Удалить' : '🗑 Delete', yesColor: 'var(--accent2)'}
  );
}
window.exDelete = exDelete;

// ── Util ─────────────────────────────────────────────────────────
function _exIsRu() {
  try {
    var lang = (typeof i18n !== 'undefined' && i18n._lang) || navigator.language || 'ru';
    return lang.startsWith('ru') || lang.startsWith('uk') || lang.startsWith('be');
  } catch(e){ return true; }
}

// ── Интеграция в switchTab ────────────────────────────────────────
(function(){
  var _orig = window.switchTab;
  if (typeof _orig === 'function') {
    window.switchTab = function(name) {
      _orig(name);
      if (name === 'exercise') initExercisePage();
    };
  }
})();

// Расширяем apiPost для поддержки DELETE
var _origPost = window.apiPost;
if (_origPost) {
  window.apiPost = async function(url, body, method) {
    if (method === 'DELETE') {
      return apiDelete(url, body);
    }
    return _origPost(url, body);
  };
}

})();
