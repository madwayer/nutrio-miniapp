// ═══════════════════════════════════════════════════════════════
// ФАСТИНГ — Mini App  (11-fasting.js)
// Анимированный SVG-круг прогресса, выбор протокола, история.
// ═══════════════════════════════════════════════════════════════

(function(){

var _fastActive  = null;  // объект активной сессии с сервера
var _fastTimer   = null;  // setInterval для обратного отсчёта
var _fastLoaded  = false; // уже загрузили

// ───── Протоколы ────────────────────────────────────────────────
var PROTOCOLS = [
  { key:"16:8",  hours:16, emoji:"⏱", name_ru:"16:8 — Классика",     desc_ru:"16ч голодание / 8ч еда",  name_en:"16:8 — Classic",   desc_en:"16h fast / 8h eating" },
  { key:"18:6",  hours:18, emoji:"🔥", name_ru:"18:6 — Продвинутый", desc_ru:"18ч голодание / 6ч еда",  name_en:"18:6 — Advanced",  desc_en:"18h fast / 6h eating" },
  { key:"20:4",  hours:20, emoji:"⚡", name_ru:"20:4 — Воин",        desc_ru:"20ч голодание / 4ч еда",  name_en:"20:4 — Warrior",   desc_en:"20h fast / 4h eating" },
  { key:"24",    hours:24, emoji:"💎", name_ru:"24ч — OMAD",          desc_ru:"Один приём пищи в день",  name_en:"24h — OMAD",       desc_en:"One meal a day" },
];

// ───── Helpers ───────────────────────────────────────────────────
function _isRu() {
  try {
    var lang = (typeof i18n !== 'undefined' && i18n._lang) || navigator.language || 'ru';
    return lang.startsWith('ru') || lang.startsWith('uk') || lang.startsWith('be') || lang.startsWith('kk');
  } catch(e){ return true; }
}

function _fmtLeft(secs) {
  if (secs <= 0) return '0:00:00';
  var h = Math.floor(secs / 3600);
  var m = Math.floor((secs % 3600) / 60);
  var s = Math.floor(secs % 60);
  return h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function _fmtDate(isoStr) {
  if (!isoStr) return '';
  var d = new Date(isoStr);
  return d.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit'}) + ' '
       + d.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
}

// ───── Кольцо прогресса ─────────────────────────────────────────
var RING_CIRC = 553; // 2π×88

function _setRing(pct) {
  var ring = document.getElementById('fast-ring');
  if (!ring) return;
  var offset = RING_CIRC - (pct / 100) * RING_CIRC;
  ring.style.strokeDashoffset = offset;
}

function _setRingState(active) {
  var emoji  = document.getElementById('fast-ring-emoji');
  var time   = document.getElementById('fast-ring-time');
  var label  = document.getElementById('fast-ring-label');
  var pctEl  = document.getElementById('fast-ring-pct');
  var status = document.getElementById('fast-status-row');
  var startEl = document.getElementById('fast-status-start');
  var endEl   = document.getElementById('fast-status-end');
  var btnStart = document.getElementById('fast-btn-start-wrap');
  var btnStop  = document.getElementById('fast-btn-stop-wrap');

  if (!active) {
    _setRing(0);
    if (emoji)  emoji.textContent  = '⏱';
    if (time)   time.textContent   = '--:--:--';
    if (label)  label.textContent  = _isRu() ? 'Нет голодания' : 'No active fast';
    if (pctEl)  pctEl.textContent  = '';
    if (status) status.style.display = 'none';
    if (btnStart) btnStart.style.display = 'block';
    if (btnStop)  btnStop.style.display  = 'none';
    if (_fastTimer) { clearInterval(_fastTimer); _fastTimer = null; }
    return;
  }

  // Есть активная сессия — запускаем тик
  if (btnStart) btnStart.style.display = 'none';
  if (btnStop)  btnStop.style.display  = 'block';
  if (status)   status.style.display   = 'block';

  var proto = PROTOCOLS.find(function(p){ return p.key === active.protocol; });
  if (emoji) emoji.textContent = proto ? proto.emoji : '⏱';

  if (startEl) startEl.textContent = (_isRu() ? 'Начало: ' : 'Started: ') + _fmtDate(active.started_at);
  if (endEl)   endEl.textContent   = (_isRu() ? 'Еда с: ' : 'Eating from: ') + _fmtDate(active.end_at);

  function tick() {
    var now = Date.now();
    var startMs  = new Date(active.started_at).getTime();
    var endMs    = new Date(active.end_at).getTime();
    var totalMs  = endMs - startMs;
    var elapsed  = now - startMs;
    var leftMs   = Math.max(0, endMs - now);
    var pct      = Math.min(100, Math.round(elapsed / totalMs * 100));

    _setRing(pct);
    if (time)  time.textContent  = _fmtLeft(leftMs / 1000);
    if (label) label.textContent = _isRu() ? 'осталось' : 'remaining';
    if (pctEl) pctEl.textContent = pct + '%';

    if (leftMs <= 0) {
      // Цель достигнута!
      clearInterval(_fastTimer); _fastTimer = null;
      if (emoji) emoji.textContent = '🎉';
      if (time)  time.textContent  = '0:00:00';
      if (label) label.textContent = _isRu() ? 'Цель достигнута!' : 'Goal reached!';
      if (pctEl) pctEl.textContent = '100%';
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
    }
  }
  tick();
  if (_fastTimer) clearInterval(_fastTimer);
  _fastTimer = setInterval(tick, 1000);
}

// ───── Загрузка данных ───────────────────────────────────────────
async function fastLoad() {
  _fastLoaded = true;
  try {
    var d = await apiGet('/api/fast');
    if (!d || !d.ok) return;
    _fastActive = d.active || null;
    _setRingState(_fastActive);
    _renderStats(d.stats);
    _renderHistory(d.history);
  } catch(e) {
    console.warn('[fast] load failed', e);
  }
}
window.fastLoad = fastLoad;

function initFastPage() {
  _renderProtocols();
  if (!_fastLoaded) fastLoad();
}
window.initFastPage = initFastPage;

// ───── Рендер протоколов ─────────────────────────────────────────
function _renderProtocols() {
  var cont = document.getElementById('fast-protocols');
  if (!cont || cont.children.length > 0) return;
  var ru = _isRu();
  cont.innerHTML = PROTOCOLS.map(function(p){
    return '<button onclick="fastStart(\'' + p.key + '\',' + p.hours + ')" style="'
      + 'display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface2);'
      + 'border:1px solid var(--glass-border);border-radius:14px;font:inherit;cursor:pointer;'
      + 'touch-action:manipulation;text-align:left;width:100%">'
      + '<span style="font-size:24px">' + p.emoji + '</span>'
      + '<div style="flex:1">'
      +   '<div style="font-weight:700;font-size:14px;color:var(--text)">' + (ru ? p.name_ru : p.name_en) + '</div>'
      +   '<div style="font-size:12px;color:var(--text2);margin-top:2px">' + (ru ? p.desc_ru : p.desc_en) + '</div>'
      + '</div>'
      + '<span style="font-size:18px;color:var(--accent)">→</span>'
      + '</button>';
  }).join('');
}

function fastShowProtocols() {
  var sheet = document.getElementById('fast-protocol-sheet');
  if (sheet) { sheet.style.display = 'block'; _renderProtocols(); }
}
window.fastShowProtocols = fastShowProtocols;

function fastHideProtocols() {
  var sheet = document.getElementById('fast-protocol-sheet');
  if (sheet) sheet.style.display = 'none';
}
window.fastHideProtocols = fastHideProtocols;

// ───── Старт сессии ──────────────────────────────────────────────
async function fastStart(protocol, hours) {
  fastHideProtocols();
  try {
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback)
      Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  } catch(e){}

  try {
    var d = await apiPost('/api/fast', {action:'start', protocol:protocol, target_hours:hours});
    if (d && d.ok) {
      showToast('⏱ ' + (protocol) + ' — ' + (_isRu() ? 'голодание начато!' : 'fast started!'), 'var(--accent)');
      await fastLoad();
    } else if (d && d.error === 'already_active') {
      showToast(_isRu() ? 'Уже есть активное голодание' : 'Already fasting', 'var(--accent2)');
    } else {
      showToast(_isRu() ? 'Ошибка, попробуй снова' : 'Error, try again', 'var(--accent2)');
    }
  } catch(e) {
    showToast(_isRu() ? 'Ошибка соединения' : 'Connection error', 'var(--accent2)');
  }
}
window.fastStart = fastStart;

// ───── Стоп сессии ───────────────────────────────────────────────
async function fastStop() {
  showConfirm(
    _isRu() ? 'Завершить голодание?' : 'Stop fast?',
    async function() {
      try {
        var d = await apiPost('/api/fast', {action:'stop'});
        if (d && d.ok) {
          var h = (d.actual_hours || 0).toFixed(1);
          var msg = d.completed
            ? '🏆 ' + (_isRu() ? 'Цель достигнута! ' + h + 'ч' : 'Goal reached! ' + h + 'h')
            : '⏸ ' + (_isRu() ? 'Завершено: ' + h + 'ч' : 'Stopped: ' + h + 'h');
          showToast(msg, d.completed ? 'var(--green)' : 'var(--text2)');
          _fastActive = null;
          _setRingState(null);
          await fastLoad();
        }
      } catch(e) {
        showToast(_isRu() ? 'Ошибка' : 'Error', 'var(--accent2)');
      }
    },
    null,
    {yes: _isRu() ? '⛔ Завершить' : '⛔ Stop', yesColor:'var(--accent2)'}
  );
}
window.fastStop = fastStop;

// ───── Статистика ────────────────────────────────────────────────
function _renderStats(stats) {
  if (!stats || !stats.total) return;
  var card = document.getElementById('fast-stats-card');
  var grid = document.getElementById('fast-stats-grid');
  if (!card || !grid) return;
  card.style.display = 'block';
  var ru = _isRu();
  var items = [
    { v: stats.total,     l: ru ? 'Сессий' : 'Sessions' },
    { v: stats.completed, l: ru ? 'Завершено' : 'Completed' },
    { v: stats.avg_h + (ru ? ' ч' : ' h'),  l: ru ? 'Среднее' : 'Average' },
    { v: stats.best_h + (ru ? ' ч' : ' h'), l: ru ? 'Рекорд' : 'Best' },
    { v: stats.streak + (ru ? ' дн' : ' d'), l: ru ? 'Серия 🔥' : 'Streak 🔥' },
  ];
  grid.innerHTML = items.map(function(it){
    return '<div style="background:var(--surface2);border-radius:12px;padding:12px;text-align:center">'
      + '<div style="font-size:18px;font-weight:800;color:var(--accent)">' + it.v + '</div>'
      + '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + it.l + '</div>'
      + '</div>';
  }).join('');
}

// ───── История ───────────────────────────────────────────────────
function _renderHistory(history) {
  if (!history || !history.length) return;
  var card = document.getElementById('fast-history-card');
  var list = document.getElementById('fast-history-list');
  if (!card || !list) return;
  card.style.display = 'block';
  var ru = _isRu();
  list.innerHTML = history.slice(0, 10).map(function(s){
    var icon  = s.completed ? '✅' : '⏸';
    var color = s.completed ? 'var(--green)' : 'var(--text2)';
    var date  = _fmtDate(s.ended_at).split(' ')[0];
    var prot  = PROTOCOLS.find(function(p){ return p.key === s.protocol; });
    var emoji = prot ? prot.emoji : '⏱';
    var pct   = s.target_hours > 0 ? Math.min(100, Math.round(s.actual_hours / s.target_hours * 100)) : 0;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;'
      + 'background:var(--surface2);border-radius:12px">'
      + '<span style="font-size:20px">' + emoji + '</span>'
      + '<div style="flex:1;min-width:0">'
      +   '<div style="font-weight:700;font-size:13px;color:var(--text)">' + s.protocol + ' · ' + s.actual_hours + (ru ? ' ч' : ' h') + '</div>'
      +   '<div style="height:4px;background:var(--surface);border-radius:2px;margin-top:4px;overflow:hidden">'
      +     '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:2px"></div>'
      +   '</div>'
      + '</div>'
      + '<div style="text-align:right">'
      +   '<div style="font-size:11px;color:var(--text2)">' + date + '</div>'
      +   '<div style="font-size:13px;color:' + color + ';font-weight:700">' + icon + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ───── Подключение к switchTab ────────────────────────────────────
(function(){
  var _orig = window.switchTab;
  if (typeof _orig === 'function') {
    window.switchTab = function(name) {
      _orig(name);
      if (name === 'fast') initFastPage();
    };
  }
})();

})();
