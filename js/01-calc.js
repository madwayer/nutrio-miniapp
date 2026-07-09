// ── Calc helper functions ─────────────────────────────────────────
function calcSetWeight(w) {
  var inp = document.getElementById('calc-weight-input');
  if (inp) inp.value = w;
  if (typeof _calcRenderResult === 'function') _calcRenderResult(w);
  else if (typeof calcUpdateWeight === 'function') calcUpdateWeight();
  // Подсвечиваем выбранный чипс веса
  document.querySelectorAll('#calc-result-preview .calc2-chip').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.textContent) === w);
  });
}

function calcUpdateWeight() {
  var w = parseFloat(document.getElementById('calc-weight-input').value) || 100;
  if (typeof _calcRenderResult === 'function') _calcRenderResult(w);
}

var _calcSelectedMeal = 'обед';
var _calcUserPickedMeal = false; // юзер сам выбрал → не перезаписывать авто-логикой по времени
function calcSelectMeal(meal, btn) {
  _calcSelectedMeal = meal;
  _calcUserPickedMeal = true;
  var inp = document.getElementById('calc-meal-select');
  if (inp) inp.value = meal;
  document.querySelectorAll('#calc-meal-btns .calc2-meal-btn').forEach(function(b) {
    b.classList.remove('picked');
  });
  if (btn) btn.classList.add('picked');
  try { if (typeof haptic === 'function') haptic('select'); } catch(e){}
}
// Exports — deferred until after all modules load, so referenced functions exist
function _calcExports() {
  ['calcSetWeight','calcUpdateWeight','calcSelectMeal',
   'openDatePicker','dpPick','dpClose','dpRender','dpPrevMonth','dpNextMonth','dpClose2',
   'editDiaryEntry','deditSave','deditDelete','statAddWeight'
  ].forEach(function(n){
    try {
      var fn = eval('typeof ' + n + ' !== "undefined" ? ' + n + ' : null');
      if (fn) window[n] = fn;
    } catch(e){}
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _calcExports);
else _calcExports();
