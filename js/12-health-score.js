// ═══════════════════════════════════════════════════════════════
// HEALTH SCORE UI  (12-health-score.js)
// Радарная диаграмма (SVG паук), анимированный total-круг,
// цветные карточки по компонентам, совет дня.
// ═══════════════════════════════════════════════════════════════

(function(){

var _hsData  = null;
var _hsDate  = null;
var _hsLoaded = false;

// ── Загрузка ────────────────────────────────────────────────────
async function hsLoad(dateStr) {
  _hsLoaded = true;
  _hsDate = dateStr || new Date().toISOString().slice(0, 10);
  _setHsLoading(true);
  try {
    var d = await apiGet('/api/health_score', {date: _hsDate});
    if (d && d.ok && d.score) {
      _hsData = d.score;
      _renderHs(_hsData);
    } else {
      _setHsEmpty();
    }
  } catch(e) {
    _setHsEmpty();
  }
  _setHsLoading(false);
}
window.hsLoad = hsLoad;

function initHealthScorePage() {
  if (!_hsLoaded) hsLoad();
}
window.initHealthScorePage = initHealthScorePage;

function _setHsLoading(on) {
  var el = document.getElementById('hs-loading');
  if (el) el.style.display = on ? 'flex' : 'none';
  var main = document.getElementById('hs-main');
  if (main) {
    main.style.display  = on ? 'none' : 'block';
    main.style.opacity  = on ? '0' : '1';
  }
}

function _setHsEmpty() {
  var main = document.getElementById('hs-main');
  if (!main) return;
  main.style.display = 'block';
  main.innerHTML = '<div style="text-align:center;padding:40px 20px">'
    + '<div style="font-size:60px;margin-bottom:16px">📝</div>'
    + '<div style="font-weight:700;font-size:18px;color:var(--text);margin-bottom:8px">Нет данных за этот день</div>'
    + '<div style="font-size:13px;color:var(--text2);line-height:1.5">Запиши еду и воду в дневник — Health Score рассчитается автоматически</div>'
    + '</div>';
}

// ── Рендер ──────────────────────────────────────────────────────
function _renderHs(sc) {
  _renderTotalRing(sc.total, sc.grade, sc.color, sc.emoji);
  _renderRadar(sc.components);
  _renderComponents(sc.components);
  _renderTip(sc.tip_ru, sc.tip_en);
}

// ── Большой круг с оценкой ───────────────────────────────────────
var RING2_CIRC = 440; // 2π×70

function _renderTotalRing(total, grade, color, emoji) {
  var wrap = document.getElementById('hs-ring-wrap');
  if (!wrap) return;

  var pct = total;
  var offset = RING2_CIRC - (pct / 100) * RING2_CIRC;

  // Описание оценки
  var isRuG = _hsIsRu();
  var gradeDescs = isRuG
    ? { A: 'Превосходно', B: 'Хорошо', C: 'Средне', D: 'Слабо', F: 'Плохо' }
    : { A: 'Excellent',   B: 'Good',   C: 'Fair',   D: 'Poor',  F: 'Low'   };

  wrap.innerHTML =
    '<svg width="180" height="180" viewBox="0 0 180 180" style="display:block;margin:0 auto;transform:rotate(-90deg)">'
    + '<circle cx="90" cy="90" r="70" fill="none" stroke="var(--surface2)" stroke-width="12"/>'
    + '<circle cx="90" cy="90" r="70" fill="none" stroke="' + color + '" stroke-width="12"'
    + ' stroke-linecap="round"'
    + ' stroke-dasharray="' + RING2_CIRC + '" stroke-dashoffset="' + RING2_CIRC + '"'
    + ' id="hs-ring-arc" style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>'
    + '</svg>'
    + '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">'
    +   '<div style="font-size:28px;line-height:1">' + emoji + '</div>'
    +   '<div style="font-size:32px;font-weight:900;color:' + color + ';line-height:1.1;margin-top:4px">' + total + '</div>'
    +   '<div style="font-size:11px;color:var(--text2);margin-top:2px">/ 100</div>'
    +   '<div style="font-size:18px;font-weight:800;color:' + color + ';margin-top:2px">' + grade + '</div>'
    +   '<div style="font-size:10px;color:var(--text2)">' + (gradeDescs[grade] || '') + '</div>'
    + '</div>';

  // Анимируем с небольшой задержкой
  setTimeout(function(){
    var arc = document.getElementById('hs-ring-arc');
    if (arc) arc.style.strokeDashoffset = offset;
  }, 150);
}

// ── Радарная диаграмма (паук) ────────────────────────────────────
function _renderRadar(components) {
  var el = document.getElementById('hs-radar');
  if (!el || !components || !components.length) return;

  var n     = components.length;
  var cx    = 150, cy = 150, r = 110;
  var step  = (2 * Math.PI) / n;
  var grids = [20, 40, 60, 80, 100];

  function polar(i, pct) {
    var angle = i * step - Math.PI / 2;
    var dist  = r * pct / 100;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  }

  // Сетка
  var gridLines = '';
  grids.forEach(function(g){
    var pts = components.map(function(_, i){ var p = polar(i, g); return p.x + ',' + p.y; }).join(' ');
    var opacity = g === 100 ? 0.2 : 0.1;
    gridLines += '<polygon points="' + pts + '" fill="none" stroke="var(--text2)" stroke-width="0.8" opacity="' + opacity + '"/>';
  });

  // Оси
  var axes = components.map(function(c, i){
    var p = polar(i, 100);
    return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p.x + '" y2="' + p.y + '" stroke="var(--text2)" stroke-width="0.8" opacity="0.2"/>';
  }).join('');

  // Данные — заполнение
  var dataPts = components.map(function(c, i){ var p = polar(i, c.pct); return p.x + ',' + p.y; }).join(' ');

  // Подписи
  var labels = components.map(function(c, i){
    var p  = polar(i, 118);
    var ta = (p.x < cx - 5) ? 'end' : (p.x > cx + 5) ? 'start' : 'middle';
    return '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="' + ta + '"'
         + ' fill="var(--text2)" font-size="11" font-family="inherit">' + c.emoji + '</text>';
  }).join('');

  el.innerHTML = '<svg viewBox="0 0 300 300" style="width:100%;max-width:300px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><radialGradient id="hsg" cx="50%" cy="50%">'
    + '<stop offset="0%" stop-color="#6366f1" stop-opacity="0.5"/>'
    + '<stop offset="100%" stop-color="#a78bfa" stop-opacity="0.15"/>'
    + '</radialGradient></defs>'
    + gridLines + axes
    + '<polygon points="' + dataPts + '" fill="url(#hsg)" stroke="#6366f1" stroke-width="2" opacity="0.9"/>'
    + labels
    + '</svg>';
}

// ── Карточки компонентов ─────────────────────────────────────────
function _renderComponents(components) {
  var el = document.getElementById('hs-components');
  if (!el || !components) return;

  var isRu = _hsIsRu();

  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    + components.map(function(c){
        var lbl    = isRu ? c.label_ru : c.label_en;
        var detail = isRu ? c.detail_ru : c.detail_en;
        var pct    = c.pct;
        // Цвет карточки по проценту
        var barColor = pct >= 80 ? '#16a34a' : pct >= 50 ? '#2563eb' : pct >= 30 ? '#d97706' : '#dc2626';
        return '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:14px;padding:12px">'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">'
          +   '<span style="font-size:20px">' + c.emoji + '</span>'
          +   '<span style="font-weight:700;font-size:13px;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + lbl + '</span>'
          +   '<span style="font-size:13px;font-weight:800;color:' + barColor + '">' + pct + '%</span>'
          + '</div>'
          + '<div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:5px">'
          +   '<div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:3px;transition:width .8s ease"></div>'
          + '</div>'
          + '<div style="font-size:10px;color:var(--text2);line-height:1.3">' + detail + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

// ── Совет дня ────────────────────────────────────────────────────
function _renderTip(tipRu, tipEn) {
  var el = document.getElementById('hs-tip');
  if (!el) return;
  var isRu = _hsIsRu();
  var tip  = isRu ? tipRu : tipEn;
  el.innerHTML = ''
    + '<div style="display:flex;align-items:flex-start;gap:10px">'
    +   '<span style="font-size:24px;flex-shrink:0">💡</span>'
    +   '<div>'
    +     '<div style="font-weight:700;font-size:12px;color:var(--text2);letter-spacing:.5px;margin-bottom:4px">' + (isRu ? 'СОВЕТ ДНЯ' : 'TIP OF THE DAY') + '</div>'
    +     '<div style="font-size:14px;color:var(--text);line-height:1.5">' + tip + '</div>'
    +   '</div>'
    + '</div>';
}

function _hsIsRu() {
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
      if (name === 'healthscore') initHealthScorePage();
    };
  }
})();

})();
