// ── Calc helper functions ─────────────────────────────────────────
function calcSetWeight(w) {
  var inp = document.getElementById('calc-weight-input');
  if (inp) { inp.value = w; calcUpdateWeight(); }
  // Highlight selected button
  document.querySelectorAll('#calc-weight-section button').forEach(function(b) {
    b.style.background = (parseInt(b.textContent) === w) ? 'var(--accent)' : 'var(--surface)';
    b.style.color = (parseInt(b.textContent) === w) ? '#fff' : 'var(--text)';
  });
}

function calcUpdateWeight() {
  if (!calcCurrentResult) return;
  var w = parseFloat(document.getElementById('calc-weight-input').value) || 100;
  var base = calcCurrentResult._base_cal || (calcCurrentResult.calories / (calcCurrentResult.weight||100) * 100);
  var factor = w / 100;
  var kcal = Math.round(base * factor);
  var wk = document.getElementById('calc-weight-kcal');
  if (wk) wk.textContent = kcal + ' ккал';
  // Update result
  document.getElementById('calc-r-kcal').textContent = kcal;
  document.getElementById('calc-r-prot').textContent = Math.round((calcCurrentResult._base_prot||calcCurrentResult.protein)*factor*10)/10;
  document.getElementById('calc-r-fat').textContent  = Math.round((calcCurrentResult._base_fat ||calcCurrentResult.fat)    *factor*10)/10;
  document.getElementById('calc-r-carb').textContent = Math.round((calcCurrentResult._base_carb||calcCurrentResult.carbs)  *factor*10)/10;
  var he = Math.round((calcCurrentResult._base_carb||calcCurrentResult.carbs)*factor/12*10)/10;
  document.getElementById('calc-r-he').textContent = he > 0 ? he + ' ХЕ' : '';
  // Update current result
  calcCurrentResult.weight    = w;
  calcCurrentResult.calories  = kcal;
  calcCurrentResult.protein   = parseFloat(document.getElementById('calc-r-prot').textContent);
  calcCurrentResult.fat       = parseFloat(document.getElementById('calc-r-fat').textContent);
  calcCurrentResult.carbs     = parseFloat(document.getElementById('calc-r-carb').textContent);
  calcCurrentResult.he        = he;
}

var _calcSelectedMeal = 'обед';
var _calcUserPickedMeal = false; // юзер сам выбрал → не перезаписывать авто-логикой по времени
function calcSelectMeal(meal, btn) {
  _calcSelectedMeal = meal;
  _calcUserPickedMeal = true;
  var inp = document.getElementById('calc-meal-select');
  if (inp) inp.value = meal;
  document.querySelectorAll('#calc-meal-btns button').forEach(function(b) {
    b.style.borderColor = 'transparent';
    b.style.background  = 'var(--surface)';
    b.style.color       = 'var(--text)';
    b.style.fontWeight  = '400';
  });
  if (btn) {
    btn.style.borderColor = 'var(--green)';
    btn.style.background  = 'rgba(67,233,123,.15)';
    btn.style.fontWeight  = '700';
  }
}
// Exports — deferred until after all modules load, so referenced functions exist
function _calcExports() {
  ['calcSetWeight','calcUpdateWeight','calcSelectMeal',
   'openDatePicker','dpPick','dpClose','dpRender','dpPrevMonth','dpNextMonth','dpClose2',
   'editDiaryEntry','deditSave','deditDelete','statAddWeight'
  ].forEach(function(n){
    try {
      var fn = (typeof window[n] !== 'undefined') ? window[n] : null;
      if (fn) window[n] = fn;
    } catch(e){}
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _calcExports);
else _calcExports();
