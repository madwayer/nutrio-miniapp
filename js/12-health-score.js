// ═══════════════════════════════════════════════════════════════
// HEALTH SCORE UI  (12-health-score.js)  — Exotic redesign
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
  var el = document.getElementById('hs-loading');
  if (el) el.style.display = on ? 'flex' : 'none';
  var main = document.getElementById('hs-main');
  if (main) { main.style.display = on ? 'none' : 'block'; main.style.opacity = on ? '0' : '1'; }
}

function _setHsEmpty() {
  var main = document.getElementById('hs-main');
  if (!main) return;
  main.style.display = 'block';
  main.innerHTML =
    '<div style="text-align:center;padding:48px 20px">'
    + '<div style="font-size:72px;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(99,102,241,.6))">🏅</div>'
    + '<div style="font-weight:800;font-size:20px;color:var(--text);margin-bottom:10px">Нет данных за сегодня</div>'
    + '<div style="font-size:14px;color:var(--text2);line-height:1.6;max-width:260px;margin:0 auto">Запиши еду, воду и активность — индекс здоровья рассчитается автоматически</div>'
    + '</div>';
}

function _renderHs(sc) {
  _renderTotalRing(sc.total, sc.grade, sc.color, sc.emoji);
  _renderRadar(sc.components);
  _renderComponents(sc.components);
  _renderTip(sc.tip_ru, sc.tip_en);
}

// ── Большой круг с оценкой — неоновый стиль ─────────────────────
var RING2_CIRC = 440;

function _getGradeColor(grade) {
  var map = { A:'#10b981', B:'#6366f1', C:'#f59e0b', D:'#f97316', F:'#ef4444' };
  return map[grade] || '#6366f1';
}

function _renderTotalRing(total, grade, color, emoji) {
  var wrap = document.getElementById('hs-ring-wrap');
  if (!wrap) return;
  wrap.innerHTML = ''; // очищаем перед ререндером
  var offset = RING2_CIRC - (total / 100) * RING2_CIRC;
  var c = _getGradeColor(grade);
  var isRu = _hsIsRu();
  var gradeDescs = isRu
    ? { A:'Превосходно', B:'Хорошо', C:'Средне', D:'Слабо', F:'Плохо' }
    : { A:'Excellent',   B:'Good',   C:'Fair',   D:'Poor',  F:'Low'   };

  wrap.innerHTML =
    // Внешнее свечение
    '<div style="position:absolute;inset:-20px;border-radius:50%;background:radial-gradient(circle,'+c+'22 0%,transparent 70%);pointer-events:none"></div>'
    // SVG кольцо
    + '<svg width="200" height="200" viewBox="0 0 200 200" style="display:block;margin:0 auto;transform:rotate(-90deg);position:relative;z-index:1">'
    + '<defs>'
    + '<filter id="hs-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    + '<linearGradient id="hs-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+c+'"/><stop offset="100%" stop-color="'+c+'88"/></linearGradient>'
    + '</defs>'
    // Фоновый трек
    + '<circle cx="100" cy="100" r="70" fill="none" stroke="var(--surface2)" stroke-width="14"/>'
    // Декоративные точки по кругу
    + _dotRing(100, 100, 70, total)
    // Основной прогресс
    + '<circle cx="100" cy="100" r="70" fill="none" stroke="url(#hs-grad)" stroke-width="14"'
    + ' stroke-linecap="round" filter="url(#hs-glow)"'
    + ' stroke-dasharray="'+RING2_CIRC+'" stroke-dashoffset="'+RING2_CIRC+'"'
    + ' id="hs-ring-arc" style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>'
    + '</svg>'
    // Контент в центре
    + '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2">'
    +   '<div style="font-size:32px;line-height:1;filter:drop-shadow(0 0 8px '+c+'88)">'+emoji+'</div>'
    +   '<div style="font-size:38px;font-weight:900;color:'+c+';line-height:1.1;margin-top:6px;text-shadow:0 0 20px '+c+'66">'+total+'</div>'
    +   '<div style="font-size:11px;color:var(--text2);margin-top:1px">/ 100</div>'
    +   '<div style="margin-top:6px;background:'+c+'22;border:1px solid '+c+'44;border-radius:20px;padding:3px 12px">'
    +     '<span style="font-size:15px;font-weight:900;color:'+c+'">'+grade+'</span>'
    +     '<span style="font-size:11px;color:var(--text2);margin-left:5px">'+(gradeDescs[grade]||'')+'</span>'
    +   '</div>'
    + '</div>';

  setTimeout(function(){
    var arc = document.getElementById('hs-ring-arc');
    if (arc) arc.style.strokeDashoffset = String(offset);
  }, 200);
}

function _dotRing(cx, cy, r, total) {
  // Светящиеся точки по направлению дуги кольца
  // SVG повёрнут на -90deg, поэтому начало дуги (верх экрана) = правая сторона math coords
  // Чтобы точки совпадали с дугой: начинаем с angle = 0 (правая сторона в math = верх на экране)
  var dots = '';
  var n = 12;
  var filled_count = Math.round(n * total / 100);
  dots += '<defs><filter id="dot-glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  for (var i = 0; i < n; i++) {
    // angle=0 = правая сторона в SVG coords = верх экрана после rotate(-90deg)
    // идём по часовой = увеличиваем angle
    var angle = (i / n) * 2 * Math.PI;
    var x = cx + (r + 22) * Math.cos(angle);
    var y = cy + (r + 22) * Math.sin(angle);
    var filled = i < filled_count;
    var isEdge = (i === filled_count - 1) && filled_count > 0;
    if (filled) {
      dots += '<circle cx="'+x+'" cy="'+y+'" r="'+(isEdge?4.5:3)+'" fill="var(--accent)" filter="url(#dot-glow)" opacity="'+(isEdge?1:0.75)+'"/>';
    } else {
      dots += '<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="rgba(255,255,255,0.07)"/>';
    }
  }
  return dots;
}

// ── Радарная диаграмма — улучшенная ─────────────────────────────
function _renderRadar(components) {
  var el = document.getElementById('hs-radar');
  if (!el || !components || !components.length) return;
  el.innerHTML = ''; // очищаем перед ререндером
  var n = components.length, cx = 170, cy = 170, r = 110;
  var step = (2 * Math.PI) / n;

  function polar(i, pct, extraR) {
    var angle = i * step - Math.PI / 2;
    var dist  = (extraR || r) * pct / 100;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  }

  // Сетка — несколько уровней с разной прозрачностью
  var gridLines = [20,40,60,80,100].map(function(g){
    var pts = components.map(function(_,i){ var p = polar(i,g); return p.x+','+p.y; }).join(' ');
    return '<polygon points="'+pts+'" fill="none" stroke="var(--text2)" stroke-width="'+(g===100?1:0.7)+'" opacity="'+(g===100?0.18:0.08)+'"/>';
  }).join('');

  // Оси с градиентом
  var axes = components.map(function(_,i){
    var p = polar(i,100);
    return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p.x+'" y2="'+p.y+'" stroke="var(--accent)" stroke-width="0.8" opacity="0.15"/>';
  }).join('');

  // Данные
  var dataPts = components.map(function(c,i){ var p=polar(i,c.pct); return p.x+','+p.y; }).join(' ');

  // Точки на вершинах
  var dots = components.map(function(c,i){
    var p = polar(i, c.pct);
    var col = c.pct>=80?'#10b981':c.pct>=50?'#6366f1':c.pct>=30?'#f59e0b':'#ef4444';
    return '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="'+col+'" stroke="#fff" stroke-width="1.5" opacity="0.9"/>';
  }).join('');

  // Подписи с эмодзи
  var labels = components.map(function(c,i){
    var p  = polar(i, 100, r+30);
    var ta = p.x < cx-8 ? 'end' : p.x > cx+8 ? 'start' : 'middle';
    return '<text x="'+p.x+'" y="'+(p.y+4)+'" text-anchor="'+ta+'" fill="var(--text2)" font-size="13" font-family="inherit">'+c.emoji+'</text>';
  }).join('');

  // Числа процентов убраны из паутины — они есть в карточках ниже
  var pctLabels = '';

  el.innerHTML =
    '<svg viewBox="0 0 340 340" style="width:100%;max-width:320px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<radialGradient id="hsg2" cx="50%" cy="50%"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.45"/><stop offset="100%" stop-color="#a78bfa" stop-opacity="0.1"/></radialGradient>'
    + '<filter id="radar-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    + '</defs>'
    + gridLines + axes
    + '<polygon points="'+dataPts+'" fill="url(#hsg2)" stroke="#6366f1" stroke-width="2.5" opacity="0.92" filter="url(#radar-glow)"/>'
    + dots + labels
    + '</svg>';
}

// ── Карточки компонентов — неоновые ─────────────────────────────
function _renderComponents(components) {
  var el = document.getElementById('hs-components');
  if (!el || !components) return;
  el.innerHTML = '';
  var isRu = _hsIsRu();

  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + components.map(function(c){
        var lbl    = isRu ? c.label_ru : c.label_en;
        var detail = isRu ? c.detail_ru : c.detail_en;
        var pct    = c.pct;
        var col    = pct>=80?'#10b981':pct>=50?'#6366f1':pct>=30?'#f59e0b':'#ef4444';
        var bgGlow = pct>=80?'rgba(16,185,129,.07)':pct>=50?'rgba(99,102,241,.07)':pct>=30?'rgba(245,158,11,.07)':'rgba(239,68,68,.07)';
        return '<div style="background:'+bgGlow+';border:1px solid '+col+'33;border-radius:16px;padding:13px;position:relative;overflow:hidden">'
          + '<div style="position:absolute;top:0;right:0;width:60px;height:60px;background:radial-gradient(circle at 70% 30%,'+col+'22,transparent);pointer-events:none"></div>'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">'
          +   '<span style="font-size:22px;filter:drop-shadow(0 0 6px '+col+'66)">'+c.emoji+'</span>'
          +   '<span style="font-weight:700;font-size:12px;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+lbl+'</span>'
          +   '<span style="font-size:14px;font-weight:900;color:'+col+';text-shadow:0 0 10px '+col+'66">'+pct+'%</span>'
          + '</div>'
          + '<div style="height:4px;background:var(--surface2);border-radius:2px;overflow:hidden;margin-bottom:6px">'
          +   '<div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,'+col+','+col+'88);border-radius:2px;transition:width 1s ease;box-shadow:0 0 8px '+col+'66"></div>'
          + '</div>'
          + '<div style="font-size:10px;color:var(--text2);line-height:1.4">'+detail+'</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

// ── Совет дня — premium блок ─────────────────────────────────────
function _renderTip(tipRu, tipEn) {
  var el = document.getElementById('hs-tip');
  if (!el) return;
  var isRu = _hsIsRu();
  var tip  = isRu ? tipRu : tipEn;
  el.innerHTML =
    '<div style="background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(167,139,250,.08));border:1px solid rgba(99,102,241,.25);border-radius:16px;padding:16px;position:relative;overflow:hidden">'
    + '<div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:radial-gradient(circle,rgba(99,102,241,.2),transparent);pointer-events:none"></div>'
    + '<div style="display:flex;align-items:flex-start;gap:12px">'
    +   '<div style="font-size:28px;flex-shrink:0;filter:drop-shadow(0 0 8px rgba(99,102,241,.5))">💡</div>'
    +   '<div>'
    +     '<div style="font-weight:800;font-size:10px;color:var(--accent);letter-spacing:1.5px;margin-bottom:5px">'+(isRu?'СОВЕТ ДНЯ':'TIP OF THE DAY')+'</div>'
    +     '<div style="font-size:13px;color:var(--text);line-height:1.6">'+tip+'</div>'
    +   '</div>'
    + '</div>'
    + '</div>';
}

function _hsIsRu() {
  try { var l=(typeof i18n!=='undefined'&&i18n._lang)||navigator.language||'ru'; return l.startsWith('ru')||l.startsWith('uk')||l.startsWith('be'); }
  catch(e){ return true; }
}

// Принудительное обновление — вызывается кнопкой Обновить из HTML
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
