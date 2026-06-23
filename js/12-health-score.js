// ═══════════════════════════════════════════════════════════════
// HEALTH SCORE UI  (12-health-score.js)
// Кольцо + паутина в одном SVG — никакого разрыва и overflow
// ═══════════════════════════════════════════════════════════════
(function(){

var _hsData   = null;
var _hsDate   = null;
var _hsLoaded = false;
var RING_CIRC = 440; // 2π×70

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
  if (mn) mn.style.display = on ? 'none' : 'block';
}

function _setHsEmpty() {
  var mn = document.getElementById('hs-main');
  if (!mn) return;
  mn.style.display = 'block';
  mn.innerHTML =
    '<div style="text-align:center;padding:48px 20px">'
    + '<div style="font-size:64px;margin-bottom:12px">🏅</div>'
    + '<div style="font-weight:800;font-size:18px;color:var(--text);margin-bottom:8px">Нет данных за сегодня</div>'
    + '<div style="font-size:13px;color:var(--text2);line-height:1.5">Запиши еду и воду — индекс рассчитается автоматически</div>'
    + '</div>';
}

function _gradeColor(grade) {
  return {A:'#10b981',B:'#6366f1',C:'#f59e0b',D:'#f97316',F:'#ef4444'}[grade] || '#6366f1';
}

function _hsIsRu() {
  try {
    var l = (typeof i18n!=='undefined' && i18n._lang) || navigator.language || 'ru';
    return l.startsWith('ru')||l.startsWith('uk')||l.startsWith('be');
  } catch(e){ return true; }
}

// ── ГЛАВНЫЙ РЕНДЕР — всё в одном большом SVG ────────────────────
function _renderHs(sc) {
  var wrap = document.getElementById('hs-ring-wrap');
  if (!wrap) return;

  var c      = _gradeColor(sc.grade);
  var offset = RING_CIRC - (sc.total / 100) * RING_CIRC;
  var isRu   = _hsIsRu();
  var gDesc  = isRu
    ? {A:'Превосходно',B:'Хорошо',C:'Средне',D:'Слабо',F:'Плохо'}
    : {A:'Excellent',  B:'Good',  C:'Fair',  D:'Poor', F:'Low'  };

  // ── Кольцо: центр (195, 130), r=70 ──────────────────────────
  var RCX = 195, RCY = 130, RR = 70;

  // Точки вдоль дуги (внутри g rotate(-90) → angle=0 = верх экрана)
  var n = 12, fc = Math.round(n * sc.total / 100), dotsSvg = '';
  for (var i = 0; i < n; i++) {
    var a = (i / n) * 2 * Math.PI;
    var dx = (RR + 18) * Math.cos(a);
    var dy = (RR + 18) * Math.sin(a);
    var ok = i < fc;
    if (ok) {
      // Заполненные — цвет акцента с равномерным glow
      dotsSvg += '<circle cx="'+dx+'" cy="'+dy+'" r="3" fill="var(--accent)" filter="url(#dg)" opacity="0.9"/>';
    } else {
      dotsSvg += '<circle cx="'+dx+'" cy="'+dy+'" r="2.5" fill="rgba(255,255,255,.07)"/>';
    }
  }

  // ── Паутина: центр (195, 370), r=100 ────────────────────────
  var PCX = 195, PCY = 380, PR = 100;
  var comps = sc.components || [];
  var NC = comps.length;
  var PSTEP = NC > 0 ? (2 * Math.PI) / NC : 0;

  function pt(i, pct, rr) {
    var a = i * PSTEP - Math.PI / 2;
    var d = (rr !== undefined ? rr : PR) * pct / 100;
    return { x: PCX + d * Math.cos(a), y: PCY + d * Math.sin(a) };
  }

  // Сетка паутины
  var grid = [20,40,60,80,100].map(function(g){
    var pts = comps.map(function(_,i){ var p=pt(i,g); return p.x+','+p.y; }).join(' ');
    var op = g === 100 ? 0.18 : 0.07;
    return '<polygon points="'+pts+'" fill="none" stroke="rgba(255,255,255,'+op+')" stroke-width="'+(g===100?0.9:0.6)+'"/>';
  }).join('');

  // Оси
  var axes = comps.map(function(_,i){
    var p = pt(i,100);
    return '<line x1="'+PCX+'" y1="'+PCY+'" x2="'+p.x+'" y2="'+p.y+'" stroke="rgba(255,255,255,.07)" stroke-width="0.7"/>';
  }).join('');

  // Заливка данных
  var dataPts = comps.map(function(c2,i){ var p=pt(i,c2.pct); return p.x+','+p.y; }).join(' ');

  // Точки со свечением + интерактивность
  var radarDots = comps.map(function(c2,i){
    var p   = pt(i, c2.pct);
    var col = c2.pct>=80?'#10b981':c2.pct>=50?'#6366f1':c2.pct>=30?'#f59e0b':'#ef4444';
    var lbl = isRu ? c2.label_ru : c2.label_en;
    var detail = isRu ? c2.detail_ru : c2.detail_en;
    var tipTitle = escTip(lbl);
    var tipBody  = escTip(c2.pct + '% — ' + detail);
    return '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="'+col+'" stroke="#111" stroke-width="1"'
      + ' filter="url(#pg)" style="cursor:pointer"'
      + ' onmouseover="hsShowTip(this,&apos;'+tipTitle+'&apos;,&apos;'+tipBody+'&apos;)"'
      + ' ontouchstart="hsShowTip(this,&apos;'+tipTitle+'&apos;,&apos;'+tipBody+'&apos;)"'
      + ' onmouseout="hsHideTip()">'
      + '<title>'+lbl+': '+c2.pct+'%</title>'
      + '</circle>';
  }).join('');

  // Лейблы эмодзи паутины
  var labels = comps.map(function(c2,i){
    var p  = pt(i, 100, PR + 26);
    var ta = p.x < PCX-10 ? 'end' : p.x > PCX+10 ? 'start' : 'middle';
    return '<text x="'+p.x+'" y="'+(p.y+5)+'" text-anchor="'+ta+'" font-size="15" font-family="inherit">'+c2.emoji+'</text>';
  }).join('');

  // Итоговый SVG
  var svgH = PCY + PR + 40; // высота под содержимое
  wrap.innerHTML =
    '<svg width="100%" viewBox="-15 -10 420 '+(svgH+20)+'" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:400px;margin:0 auto;overflow:visible">'
    + '<defs>'
    +   '<filter id="rg" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +   '<filter id="dg" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +   '<filter id="pg" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +   '<linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="'+c+'"/><stop offset="100%" stop-color="'+c+'88"/></linearGradient>'
    +   '<radialGradient id="bg" cx="50%" cy="33%" r="35%"><stop offset="0%" stop-color="'+c+'" stop-opacity=".12"/><stop offset="100%" stop-color="'+c+'" stop-opacity="0"/></radialGradient>'
    +   '<radialGradient id="rg2" cx="50%" cy="50%"><stop offset="0%" stop-color="#6366f1" stop-opacity=".35"/><stop offset="100%" stop-color="#a78bfa" stop-opacity=".06"/></radialGradient>'
    + '</defs>'
    // Фоновое свечение кольца
    + '<ellipse cx="'+RCX+'" cy="'+RCY+'" rx="90" ry="90" fill="url(#bg)"/>'
    // Кольцо (вращаем группу -90°)
    + '<g transform="translate('+RCX+','+RCY+') rotate(-90)">'
    +   '<circle cx="0" cy="0" r="'+RR+'" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="14"/>'
    +   dotsSvg
    +   '<circle cx="0" cy="0" r="'+RR+'" fill="none" stroke="url(#hg)" stroke-width="14"'
    +   ' stroke-linecap="round" filter="url(#rg)"'
    +   ' stroke-dasharray="'+RING_CIRC+'" stroke-dashoffset="'+RING_CIRC+'"'
    +   ' id="hs-ring-arc" style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"/>'
    + '</g>'
    // Контент кольца (не повёрнут)
    + '<text x="'+RCX+'" y="'+(RCY-26)+'" text-anchor="middle" font-size="30" font-family="inherit">'+sc.emoji+'</text>'
    + '<text x="'+RCX+'" y="'+(RCY+16)+'" text-anchor="middle" font-size="44" font-weight="900" fill="'+c+'" filter="url(#rg)">'+sc.total+'</text>'
    + '<text x="'+RCX+'" y="'+(RCY+34)+'" text-anchor="middle" font-size="12" fill="rgba(255,255,255,.38)">/ 100</text>'
    + '<rect x="'+(RCX-36)+'" y="'+(RCY+44)+'" width="72" height="24" rx="12" fill="'+c+'22" stroke="'+c+'44" stroke-width="1.2"/>'
    + '<text x="'+(RCX-14)+'" y="'+(RCY+60)+'" text-anchor="middle" font-size="13" font-weight="900" fill="'+c+'">'+sc.grade+'</text>'
    + '<text x="'+(RCX+4)+'" y="'+(RCY+60)+'" text-anchor="start" font-size="11" fill="rgba(255,255,255,.5)">'+(gDesc[sc.grade]||'')+'</text>'
    // Паутина
    + grid + axes
    + '<polygon points="'+dataPts+'" fill="url(#rg2)" stroke="#6366f1" stroke-width="2" filter="url(#pg)"/>'
    + radarDots + labels
    // Tooltip overlay
    + '<g id="hs-svgtip" style="display:none">'
    +   '<rect id="hs-tip-bg" x="0" y="0" width="160" height="48" rx="10" fill="rgba(20,20,35,.9)" stroke="rgba(255,255,255,.12)" stroke-width="1"/>'
    +   '<text id="hs-tip-title" x="10" y="18" font-size="11" font-weight="800" fill="white" font-family="inherit"></text>'
    +   '<text id="hs-tip-body"  x="10" y="36" font-size="10" fill="rgba(255,255,255,.65)" font-family="inherit"></text>'
    + '</g>'
    + '</svg>';

  // Запуск анимации кольца
  setTimeout(function(){
    var arc = document.getElementById('hs-ring-arc');
    if (arc) arc.style.strokeDashoffset = String(offset);
  }, 150);

  // Карточки и совет рендерим отдельно
  _renderComponents(comps, isRu);
  _renderTip(sc.tip_ru, sc.tip_en, isRu);
}

function escTip(s) {
  return String(s).replace(/'/g,'&apos;').replace(/"/g,'&quot;').slice(0,80);
}

// Tooltip для точек паутины
window.hsShowTip = function(el, title, body) {
  var tip = document.getElementById('hs-svgtip');
  var tbg = document.getElementById('hs-tip-bg');
  var tt  = document.getElementById('hs-tip-title');
  var tb  = document.getElementById('hs-tip-body');
  if (!tip || !tt || !tb) return;
  tt.textContent = title;
  tb.textContent = body;
  var cx = parseFloat(el.getAttribute('cx'));
  var cy = parseFloat(el.getAttribute('cy'));
  var tx = Math.min(cx - 80, 220);
  var ty = cy - 58;
  if (ty < 5) ty = cy + 14;
  tip.setAttribute('transform','translate('+tx+','+ty+')');
  tip.style.display = 'block';
};
window.hsHideTip = function() {
  var tip = document.getElementById('hs-svgtip');
  if (tip) tip.style.display = 'none';
};

// ── Карточки ─────────────────────────────────────────────────────
function _renderComponents(comps, isRu) {
  var el = document.getElementById('hs-components');
  if (!el || !comps) return;
  el.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + comps.map(function(c2){
        var lbl    = isRu ? c2.label_ru : c2.label_en;
        var detail = isRu ? c2.detail_ru : c2.detail_en;
        var pct    = c2.pct;
        var col    = pct>=80?'#10b981':pct>=50?'#6366f1':pct>=30?'#f59e0b':'#ef4444';
        var bg     = pct>=80?'rgba(16,185,129,.07)':pct>=50?'rgba(99,102,241,.07)':pct>=30?'rgba(245,158,11,.07)':'rgba(239,68,68,.07)';
        return '<div style="background:'+bg+';border:1px solid '+col+'33;border-radius:14px;padding:12px">'
          + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:7px">'
          +   '<span style="font-size:20px">'+c2.emoji+'</span>'
          +   '<span style="font-weight:700;font-size:12px;color:var(--text);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+lbl+'</span>'
          +   '<span style="font-size:13px;font-weight:900;color:'+col+'">'+pct+'%</span>'
          + '</div>'
          + '<div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-bottom:5px">'
          +   '<div style="height:100%;width:'+pct+'%;background:'+col+';border-radius:2px;transition:width 1s ease;box-shadow:0 0 6px '+col+'66"></div>'
          + '</div>'
          + '<div style="font-size:10px;color:var(--text2);line-height:1.4">'+detail+'</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

// ── Совет дня ────────────────────────────────────────────────────
function _renderTip(tipRu, tipEn, isRu) {
  var el = document.getElementById('hs-tip');
  if (!el) return;
  var tip = isRu ? tipRu : tipEn;
  el.innerHTML =
    '<div style="background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(167,139,250,.06));border:1px solid rgba(99,102,241,.2);border-radius:14px;padding:14px;margin-top:4px">'
    + '<div style="display:flex;align-items:flex-start;gap:10px">'
    +   '<span style="font-size:22px">💡</span>'
    +   '<div><div style="font-size:10px;font-weight:800;color:var(--accent);letter-spacing:1.2px;margin-bottom:4px">'+(isRu?'СОВЕТ ДНЯ':'TIP')+'</div>'
    +   '<div style="font-size:13px;color:var(--text);line-height:1.55">'+tip+'</div></div>'
    + '</div></div>';
}

// ── Экспорты ─────────────────────────────────────────────────────
window._hsForceRefresh = function() { _hsLoaded = false; hsLoad(); };

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
