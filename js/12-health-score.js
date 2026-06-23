// ═══════════════════════════════════════════════════════════════
// HEALTH SCORE UI  (12-health-score.js)
// ═══════════════════════════════════════════════════════════════
(function(){

var _hsData   = null;
var _hsDate   = null;
var _hsLoaded = false;

async function hsLoad(dateStr) {
  _hsLoaded = true;
  _hsDate = dateStr || new Date().toISOString().slice(0,10);
  _setHsLoading(true);
  try {
    var d = await apiGet('/api/health_score', {date: _hsDate});
    if (d && d.ok && d.score) { _hsData = d.score; _renderHs(_hsData); }
    else _setHsEmpty();
  } catch(e) { _setHsEmpty(); }
  _setHsLoading(false);
}
window.hsLoad = hsLoad;

function initHealthScorePage() { if (!_hsLoaded) hsLoad(); }
window.initHealthScorePage = initHealthScorePage;

function _setHsLoading(on) {
  var ld = document.getElementById('hs-loading');
  var mn = document.getElementById('hs-main');
  if (ld) ld.style.display = on ? 'block' : 'none';
  if (mn) mn.style.display = on ? 'none'  : 'block';
}

function _setHsEmpty() {
  var mn = document.getElementById('hs-main');
  if (!mn) return;
  mn.style.display = 'block';
  mn.innerHTML =
    '<div style="text-align:center;padding:48px 20px">'
    + '<div style="font-size:72px;margin-bottom:16px">🏅</div>'
    + '<div style="font-weight:800;font-size:20px;color:var(--text);margin-bottom:10px">Нет данных за сегодня</div>'
    + '<div style="font-size:14px;color:var(--text2);line-height:1.6">Запиши еду и воду — индекс рассчитается автоматически</div>'
    + '</div>';
}

function _renderHs(sc) {
  _renderTotalRing(sc.total, sc.grade, sc.color, sc.emoji);
  _renderRadar(sc.components);
  _renderComponents(sc.components);
  _renderTip(sc.tip_ru, sc.tip_en);
}

// ── Цвет по оценке ───────────────────────────────────────────────
var RING_CIRC = 440; // 2π×70

function _gradeColor(grade) {
  return {A:'#10b981',B:'#6366f1',C:'#f59e0b',D:'#f97316',F:'#ef4444'}[grade] || '#6366f1';
}

// ── Кольцо — чистый SVG в фиксированном контейнере ──────────────
function _renderTotalRing(total, grade, color, emoji) {
  var wrap = document.getElementById('hs-ring-wrap');
  if (!wrap) return;
  var c      = _gradeColor(grade);
  var offset = RING_CIRC - (total / 100) * RING_CIRC;
  var isRu   = _hsIsRu();
  var gDesc  = isRu
    ? {A:'Превосходно',B:'Хорошо',C:'Средне',D:'Слабо',F:'Плохо'}
    : {A:'Excellent',  B:'Good',  C:'Fair',  D:'Poor', F:'Low'  };

  // Точки по дуге — внутри g rotate(-90) совпадают с кольцом
  var n = 12, fc = Math.round(n * total / 100), dotsSvg = '';
  for (var i = 0; i < n; i++) {
    var a  = (i / n) * 2 * Math.PI;
    var dx = (70 + 18) * Math.cos(a);
    var dy = (70 + 18) * Math.sin(a);
    var ok = i < fc;
    var edge = ok && i === fc - 1;
    if (ok) {
      dotsSvg += '<circle cx="'+dx+'" cy="'+dy+'" r="'+(edge?4.5:3)+'" fill="'+c+'" filter="url(#dg)" opacity="'+(edge?1:0.75)+'"/>';
    } else {
      dotsSvg += '<circle cx="'+dx+'" cy="'+dy+'" r="2.5" fill="rgba(255,255,255,.07)"/>';
    }
  }

  wrap.innerHTML =
    '<svg width="220" height="260" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    +   '<filter id="rg"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +   '<filter id="dg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +   '<linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+c+'"/><stop offset="100%" stop-color="'+c+'88"/></linearGradient>'
    +   '<radialGradient id="bg" cx="50%" cy="45%" r="45%"><stop offset="0%" stop-color="'+c+'" stop-opacity=".15"/><stop offset="100%" stop-color="'+c+'" stop-opacity="0"/></radialGradient>'
    + '</defs>'
    // Фоновое свечение
    + '<ellipse cx="110" cy="108" rx="85" ry="85" fill="url(#bg)"/>'
    // Кольцо + точки (всё повёрнуто -90°)
    + '<g transform="translate(110,108) rotate(-90)">'
    +   '<circle cx="0" cy="0" r="70" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="14"/>'
    +   dotsSvg
    +   '<circle cx="0" cy="0" r="70" fill="none" stroke="url(#hg)" stroke-width="14"'
    +   ' stroke-linecap="round" filter="url(#rg)"'
    +   ' stroke-dasharray="'+RING_CIRC+'" stroke-dashoffset="'+RING_CIRC+'"'
    +   ' id="hs-ring-arc" style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>'
    + '</g>'
    // Эмодзи
    + '<text x="110" y="88" text-anchor="middle" font-size="32" font-family="inherit">'+emoji+'</text>'
    // Число
    + '<text x="110" y="130" text-anchor="middle" font-size="44" font-weight="900" fill="'+c+'" filter="url(#rg)">'+total+'</text>'
    // / 100
    + '<text x="110" y="148" text-anchor="middle" font-size="12" fill="rgba(255,255,255,.4)">/ 100</text>'
    // Бейдж
    + '<rect x="76" y="158" width="68" height="26" rx="13" fill="'+c+'22" stroke="'+c+'55" stroke-width="1.5"/>'
    + '<text x="91" y="176" text-anchor="middle" font-size="14" font-weight="900" fill="'+c+'">'+grade+'</text>'
    + '<text x="117" y="176" text-anchor="start" font-size="11" fill="rgba(255,255,255,.55)">'+(gDesc[grade]||'')+'</text>'
    + '</svg>';

  setTimeout(function(){
    var arc = document.getElementById('hs-ring-arc');
    if (arc) arc.style.strokeDashoffset = String(offset);
  }, 150);
}

// ── Паутина ───────────────────────────────────────────────────────
function _renderRadar(components) {
  var el = document.getElementById('hs-radar');
  if (!el || !components || !components.length) return;
  el.innerHTML = '';
  var n = components.length;
  var cx = 150, cy = 150, r = 100;
  var step = (2 * Math.PI) / n;

  function pt(i, pct, rr) {
    var a = i * step - Math.PI / 2;
    var d = (rr !== undefined ? rr : r) * pct / 100;
    return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) };
  }

  // Сетка
  var grid = [20,40,60,80,100].map(function(g) {
    var pts = components.map(function(_,i){ var p=pt(i,g); return p.x+','+p.y; }).join(' ');
    return '<polygon points="'+pts+'" fill="none" stroke="rgba(255,255,255,'+(g===100?.15:.06)+')" stroke-width="'+(g===100?.8:.5)+'"/>';
  }).join('');

  // Оси
  var axes = components.map(function(_,i){
    var p = pt(i,100);
    return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p.x+'" y2="'+p.y+'" stroke="rgba(255,255,255,.08)" stroke-width="0.8"/>';
  }).join('');

  // Данные
  var dataPts = components.map(function(c,i){ var p=pt(i,c.pct); return p.x+','+p.y; }).join(' ');

  // Цветные точки на вершинах
  var dots = components.map(function(c,i){
    var p   = pt(i, c.pct);
    var col = c.pct>=80?'#10b981':c.pct>=50?'#6366f1':c.pct>=30?'#f59e0b':'#ef4444';
    return '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="'+col+'" stroke="#111" stroke-width="1.5"/>';
  }).join('');

  // Лейблы эмодзи — с достаточным отступом
  var labels = components.map(function(c,i){
    var p  = pt(i, 100, r + 28);
    var ta = p.x < cx-10 ? 'end' : p.x > cx+10 ? 'start' : 'middle';
    return '<text x="'+p.x+'" y="'+(p.y+5)+'" text-anchor="'+ta+'" font-size="14" font-family="inherit">'+c.emoji+'</text>';
  }).join('');

  el.innerHTML =
    '<svg viewBox="0 0 300 300" style="width:100%;max-width:280px;display:block;margin:0 auto;overflow:visible" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    +   '<radialGradient id="rg2" cx="50%" cy="50%"><stop offset="0%" stop-color="#6366f1" stop-opacity=".4"/><stop offset="100%" stop-color="#a78bfa" stop-opacity=".08"/></radialGradient>'
    +   '<filter id="pg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    + '</defs>'
    + grid + axes
    + '<polygon points="'+dataPts+'" fill="url(#rg2)" stroke="#6366f1" stroke-width="2" filter="url(#pg)"/>'
    + dots + labels
    + '</svg>';
}

// ── Карточки компонентов ─────────────────────────────────────────
function _renderComponents(components) {
  var el = document.getElementById('hs-components');
  if (!el || !components) return;
  var isRu = _hsIsRu();
  el.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + components.map(function(c){
        var lbl    = isRu ? c.label_ru : c.label_en;
        var detail = isRu ? c.detail_ru : c.detail_en;
        var pct    = c.pct;
        var col    = pct>=80?'#10b981':pct>=50?'#6366f1':pct>=30?'#f59e0b':'#ef4444';
        var bg     = pct>=80?'rgba(16,185,129,.07)':pct>=50?'rgba(99,102,241,.07)':pct>=30?'rgba(245,158,11,.07)':'rgba(239,68,68,.07)';
        return '<div style="background:'+bg+';border:1px solid '+col+'33;border-radius:14px;padding:12px">'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">'
          +   '<span style="font-size:20px">'+c.emoji+'</span>'
          +   '<span style="font-weight:700;font-size:12px;color:var(--text);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+lbl+'</span>'
          +   '<span style="font-size:13px;font-weight:900;color:'+col+'">'+pct+'%</span>'
          + '</div>'
          + '<div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:5px">'
          +   '<div style="height:100%;width:'+pct+'%;background:'+col+';border-radius:2px;transition:width 1s ease"></div>'
          + '</div>'
          + '<div style="font-size:10px;color:var(--text2);line-height:1.4">'+detail+'</div>'
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
  el.innerHTML =
    '<div style="background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(167,139,250,.06));border:1px solid rgba(99,102,241,.2);border-radius:14px;padding:14px;margin-top:4px">'
    + '<div style="display:flex;align-items:flex-start;gap:10px">'
    +   '<span style="font-size:24px">💡</span>'
    +   '<div>'
    +     '<div style="font-size:10px;font-weight:800;color:var(--accent);letter-spacing:1.2px;margin-bottom:4px">'+(isRu?'СОВЕТ ДНЯ':'TIP')+'</div>'
    +     '<div style="font-size:13px;color:var(--text);line-height:1.55">'+tip+'</div>'
    +   '</div>'
    + '</div>'
    + '</div>';
}

function _hsIsRu() {
  try {
    var l = (typeof i18n!=='undefined' && i18n._lang) || navigator.language || 'ru';
    return l.startsWith('ru') || l.startsWith('uk') || l.startsWith('be');
  } catch(e) { return true; }
}

// Кнопка Обновить
window._hsForceRefresh = function() {
  _hsLoaded = false;
  hsLoad();
};

(function(){
  var _orig = window.switchTab;
  if (typeof _orig === 'function') {
    window.switchTab = function(name) {
      _orig(name);
      if (name === 'healthscore') { _hsLoaded = false; initHealthScorePage(); }
    };
  }
})();

})();
