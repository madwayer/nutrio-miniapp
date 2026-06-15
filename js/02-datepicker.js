// ── Diary date picker ─────────────────────────────────────────────
// ── Full calendar picker ─────────────────────────────────────────
var _dpYear, _dpMonth;

function openDatePicker() {
  var existing = document.getElementById('datepicker-modal');
  if (existing) { document.body.removeChild(existing); return; }
  var now = diaryDate || new Date();
  _dpYear  = now.getFullYear();
  _dpMonth = now.getMonth();
  var modal = document.createElement('div');
  modal.id = 'datepicker-modal';
  modal.className = 'datepicker-modal';
  modal.innerHTML = '<div class="datepicker-box"><div id="dp-inner"></div></div>';
  modal.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('[data-ds]') : null;
    if (btn && btn.getAttribute('data-ds')) { dpPick(btn.getAttribute('data-ds')); return; }
    if (e.target===modal) dpClose();
  });
  document.body.appendChild(modal);
  dpRender();
}

function dpRender() {
  var el = document.getElementById('dp-inner');
  if (!el) return;
  var _dpL = (typeof LANG!=='undefined'?LANG:'ru');
  var _dpI = (typeof MINI_I18N!=='undefined' && MINI_I18N[_dpL]) ? MINI_I18N[_dpL] : null;
  var mN=( _dpI && _dpI.months_full ) ? _dpI.months_full.split('|')
        : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  var dN=( _dpI && _dpI.weekdays_short ) ? _dpI.weekdays_short.split('|')
        : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  var today=new Date(); today.setHours(0,0,0,0);
  var selStr=diaryDateStr(diaryDate||new Date());
  var todayStr=diaryDateStr(today);
  var first=new Date(_dpYear,_dpMonth,1);
  var startDow=(first.getDay()+6)%7;
  var dim=new Date(_dpYear,_dpMonth+1,0).getDate();

  var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
    +'<button onclick="dpPrevMonth()" style="background:var(--surface);border:none;color:var(--text);font-size:20px;cursor:pointer;padding:6px 12px;border-radius:8px;touch-action:manipulation">‹</button>'
    +'<div style="font-weight:700;font-size:15px">'+mN[_dpMonth]+' '+_dpYear+'</div>'
    +'<button onclick="dpNextMonth()" style="background:var(--surface);border:none;color:var(--text);font-size:20px;cursor:pointer;padding:6px 12px;border-radius:8px;touch-action:manipulation">›</button>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:6px">'
    +dN.map(function(d){ return '<div style="font-size:11px;color:var(--text2);font-weight:700;padding:4px 0">'+d+'</div>'; }).join('')
    +'</div>'
    +'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';

  for(var i=0;i<startDow;i++) html+='<div></div>';

  for(var d=1;d<=dim;d++){
    var dt=new Date(_dpYear,_dpMonth,d);
    var ds=diaryDateStr(dt);
    var isFuture=dt>today;
    var isSel=ds===selStr;
    var isToday=ds===todayStr;
    var bg=isSel?'var(--accent)':isToday?'var(--accent2)':'transparent';
    var col=(isSel||isToday)?'#fff':isFuture?'var(--bg2)':'var(--text)';
    var click = isFuture ? '' : ' data-ds="'+ds+'"';
    html += '<button'+click+' style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:'+bg
      +';color:'+col+';border:none;border-radius:50%;font-size:14px;font-weight:'+(isSel||isToday?700:400)
      +';cursor:'+(isFuture?'default':'pointer')+';touch-action:manipulation;padding:0;width:100%">'+d+'</button>';
  }

  html+='</div>'
    +'<div style="display:flex;gap:8px;margin-top:14px">'
    +'<button data-ds="'+todayStr+'" style="flex:1;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:10px;cursor:pointer;touch-action:manipulation;font-size:13px;font-weight:700">Сегодня</button>'
    +'<button onclick="dpClose()" style="flex:1;padding:10px;background:var(--surface);color:var(--muted);border:none;border-radius:10px;cursor:pointer;touch-action:manipulation;font-size:13px">Закрыть</button>'
    +'</div>';

  el.innerHTML=html;
}

function dpPrevMonth(){ _dpMonth--; if(_dpMonth<0){_dpMonth=11;_dpYear--;} dpRender(); }
function dpNextMonth(){ _dpMonth++; if(_dpMonth>11){_dpMonth=0;_dpYear++;} dpRender(); }

function dpPick(dateStr) {
  dpClose();
  diaryDate = new Date(dateStr + 'T12:00:00');
  loadDiary();
}

function dpClose() {
  var modal = document.getElementById('datepicker-modal');
  if (modal) document.body.removeChild(modal);
}

// ── Diary edit entry ──────────────────────────────────────────────
function editDiaryEntry(id) {
  id = parseInt(id);
  var entry = null;
  var mealKey = 'другое';
  if (diaryData && diaryData.meals) {
    Object.keys(diaryData.meals).forEach(function(meal) {
      if (!Array.isArray(diaryData.meals[meal])) return;
      diaryData.meals[meal].forEach(function(e) {
        if (parseInt(e.id) === id) { entry = e; mealKey = meal; }
      });
    });
  }
  if (!entry) entry = {id:id, name:'', calories:0, protein:0, fat:0, carbs:0};

  var existing = document.getElementById('diary-edit-modal');
  if (existing) document.body.removeChild(existing);

  var mealOpts = ['завтрак','обед','ужин','перекус','другое'];
  var mealLabels = {'завтрак':'🌅 Завтрак','обед':'☀️ Обед','ужин':'🌙 Ужин','перекус':'🍎 Перекус','другое':'🍽 Другое'};
  var mealSelHTML = '<select id="dedit-meal" style="width:100%;padding:10px;background:var(--bg2);border:none;border-radius:10px;color:var(--text);font-size:14px;margin-bottom:10px">'
    + mealOpts.map(function(m){ return '<option value="'+m+'"'+(m===mealKey?' selected':'')+'>'+mealLabels[m]+'</option>'; }).join('')
    + '</select>';

  var modal = document.createElement('div');
  modal.id = 'diary-edit-modal';
  modal.className = 'diary-edit-modal';
  modal.innerHTML = '<div class="diary-edit-box">'
    + '<div class="diary-edit-title">✏️ Редактировать запись</div>'
    + '<div class="diary-edit-lbl">Продукт</div>'
    + '<div class="diary-edit-field"><input id="dedit-name" value="' + escHtml(entry.name||'') + '"></div>'
    + '<div class="diary-edit-lbl" style="margin-top:4px">Приём пищи</div>'
    + mealSelHTML
    + '<div style="display:flex;gap:8px">'
    + '<div style="flex:1"><div class="diary-edit-lbl">Калории</div><div class="diary-edit-field"><input type="number" id="dedit-cal" value="' + (entry.calories||0) + '"></div></div>'
    + '<div style="flex:1"><div class="diary-edit-lbl">Белки</div><div class="diary-edit-field"><input type="number" id="dedit-prot" step="0.1" value="' + (entry.protein||0) + '"></div></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px">'
    + '<div style="flex:1"><div class="diary-edit-lbl">Жиры</div><div class="diary-edit-field"><input type="number" id="dedit-fat" step="0.1" value="' + (entry.fat||0) + '"></div></div>'
    + '<div style="flex:1"><div class="diary-edit-lbl">Углеводы</div><div class="diary-edit-field"><input type="number" id="dedit-carb" step="0.1" value="' + (entry.carbs||0) + '"></div></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:8px">'
    + '<button onclick="deditSave(' + id + ')" style="flex:2;padding:12px;background:var(--green);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;touch-action:manipulation">💾 Сохранить</button>'
    + '<button onclick="deditDelete(' + id + ')" style="flex:1;padding:12px;background:var(--accent2);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;touch-action:manipulation">🗑</button>'
    + '<button onclick="dpClose2()" style="flex:1;padding:12px;background:var(--bg2);color:var(--muted);border:none;border-radius:10px;cursor:pointer;touch-action:manipulation">✕</button>'
    + '</div></div>';
  document.body.appendChild(modal);
}
function dpClose2() {
  var m = document.getElementById('diary-edit-modal');
  if (m) document.body.removeChild(m);
}

async function deditSave(id) {
  var userId = getUserId();
  if (!userId) return;
  var name = document.getElementById('dedit-name').value.trim();
  var cal  = parseFloat(document.getElementById('dedit-cal').value) || 0;
  var prot = parseFloat(document.getElementById('dedit-prot').value) || 0;
  var fat  = parseFloat(document.getElementById('dedit-fat').value) || 0;
  var carb = parseFloat(document.getElementById('dedit-carb').value) || 0;
  if (!name) { showToast('Введи название', 'var(--accent2)'); return; }
  var meal = document.getElementById('dedit-meal') ? document.getElementById('dedit-meal').value : 'другое';

  // Атомарный апдейт через новый PATCH /api/diary/edit.
  // Раньше тут был DELETE + INSERT, что приводило к потере записи если второй запрос падал.
  // Если бэк ещё старый (нет ручки edit) — фоллбэк на старую логику.
  var res;
  try {
    res = await fetch(API_BASE + '/api/diary/edit', {
      method: 'PATCH',
      headers: _authHeaders({'Content-Type':'application/json'}),
      body: JSON.stringify({
        user_id:  parseInt(userId),
        entry_id: id,
        name:     name.charAt(0).toUpperCase()+name.slice(1),
        calories: cal,
        protein:  prot,
        fat:      fat,
        carbs:    carb,
        meal_type: meal,
      }),
    });
  } catch(e) { res = null; }

  var modal = document.getElementById('diary-edit-modal');
  var ok = false;
  if (res && (res.status === 200 || res.status === 304)) {
    try { var d = await res.json(); ok = !!d.ok; } catch(e) { ok = false; }
  }

  // Фоллбэк на старую логику если ручка edit не отвечает (например, бэк ещё не обновлён)
  if (!ok && res && (res.status === 404 || res.status === 405)) {
    var del = await apiPost('/api/diary/delete', {entry_id: id});
    if (del.ok) {
      var add = await apiPost('/api/calculator/save', {
        meal_type: meal,
        items: [{name: name.charAt(0).toUpperCase()+name.slice(1), calories: cal, protein: prot, fat: fat, carbs: carb, weight: 0, he: carb/12}]
      });
      ok = !!add.ok;
    }
  }

  if (modal) document.body.removeChild(modal);
  if (ok) { showToast('✅ Обновлено!', 'var(--green)'); loadDiary(); }
  else showToast('Ошибка сохранения', 'var(--accent2)');
}

async function deditDelete(id) {
  var userId = getUserId();
  if (!userId) return;
  showConfirm('Удалить запись?', async function() {
    var modal = document.getElementById('diary-edit-modal');
    if (modal) document.body.removeChild(modal);
    var data = await apiPost('/api/diary/delete', {entry_id: id});
    if (data.ok) { showToast('Удалено', 'var(--green)'); loadDiary(); }
    else showToast('Ошибка', 'var(--accent2)');
  });
}


// ── Calc history ─────────────────────────────────────────────────
var calcHistory = [];
try { calcHistory = JSON.parse(localStorage.getItem('nutrio_calc_history')||'[]'); } catch(e){}

function calcSaveHistory(name, data) {
  calcHistory = calcHistory.filter(function(h){ return h.name !== name; });
  calcHistory.unshift({name:name, calories:data.calories, protein:data.protein, fat:data.fat, carbs:data.carbs, he:data.he, _base_cal: data._base_cal||data.calories});
  if (calcHistory.length > 12) calcHistory = calcHistory.slice(0,12);
  try { localStorage.setItem('nutrio_calc_history', JSON.stringify(calcHistory)); } catch(e){}
  renderCalcHistory();
}

function renderCalcHistory() {
  var el = document.getElementById('calc-history');
  if (!el || !calcHistory.length) return;
  el.innerHTML = '<div style="font-size:11px;color:var(--text2);margin-bottom:5px">НЕДАВНИЕ</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:5px">'
    + calcHistory.map(function(h) {
      return '<button onclick="calcQuickAdd(' + JSON.stringify(h).replace(/"/g,"'") + ')" '
        + 'style="padding:5px 10px;background:var(--surface);border:none;border-radius:8px;color:var(--text);font-size:12px;cursor:pointer;touch-action:manipulation">'
        + escHtml((h.name||'').split(' ').slice(0,2).join(' ')) + ' <span style="color:var(--accent)">' + h.calories + '</span></button>';
    }).join('') + '</div>';
}

function calcQuickAdd(h) {
  var w = parseFloat(document.getElementById('calc-weight-input').value)||100;
  var factor = w / 100;
  calcCurrentResult = {
    name: h.name, weight: w,
    calories: Math.round(h._base_cal * factor),
    protein:  Math.round(h.protein * factor * 10)/10,
    fat:      Math.round(h.fat     * factor * 10)/10,
    carbs:    Math.round(h.carbs   * factor * 10)/10,
    he:       Math.round(h.carbs   * factor / 12 * 10)/10,
    _base_cal: h._base_cal,
  };
  var dname = (h.name||'').charAt(0).toUpperCase()+(h.name||'').slice(1);
  document.getElementById('calc-result-name').textContent = dname + ' — ' + w + 'г';
  document.getElementById('calc-r-kcal').textContent = calcCurrentResult.calories;
  document.getElementById('calc-r-prot').textContent = calcCurrentResult.protein;
  document.getElementById('calc-r-fat').textContent  = calcCurrentResult.fat;
  document.getElementById('calc-r-carb').textContent = calcCurrentResult.carbs;
  document.getElementById('calc-r-he').textContent   = calcCurrentResult.he;
  document.getElementById('calc-result-preview').style.display = 'block';
}

// ── Sugar log ──────────────────────────────────────────────────────
var sugarLog = [];

function sugarLogAdd() {
  var val  = parseFloat(document.getElementById('sugar-value-input').value);
  var time = document.getElementById('sugar-time-select').value;
  if (!val || val < 1 || val > 30) { showToast('Введи значение 1-30 ммоль/л', 'var(--accent2)'); return; }
  var now = new Date();
  var entry = {
    value: val, time: time,
    ts: now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0')
  };
  sugarLog.unshift(entry);
  if (sugarLog.length > 20) sugarLog = sugarLog.slice(0,20);
  document.getElementById('sugar-value-input').value = '';
  renderSugarLog();
}

function renderSugarLog() {
  var el = document.getElementById('sugar-log-list');
  if (!el || !sugarLog.length) return;
  el.innerHTML = sugarLog.map(function(e) {
    var color = e.value < 4 ? '#64b5f6' : e.value <= 7.8 ? 'var(--green)' : e.value <= 10 ? '#ffb74d' : 'var(--accent2)';
    var label = e.value < 4 ? 'Низкий' : e.value <= 7.8 ? 'Норма' : e.value <= 10 ? 'Высокий' : 'Очень высокий';
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bg2)">'
      + '<div style="font-size:20px;font-weight:800;color:' + color + ';min-width:40px">' + e.value + '</div>'
      + '<div style="flex:1"><div style="font-size:12px">' + e.time + '</div><div style="font-size:11px;color:var(--text2)">' + e.ts + '</div></div>'
      + '<div style="font-size:11px;font-weight:700;color:' + color + '">' + label + '</div>'
      + '</div>';
  }).join('');
}


// ── Add weight from stats page ────────────────────────────────────
function statAddWeight() {
  var cur = document.getElementById('stat-weight-val');
  var curVal = (cur && cur.textContent !== '—') ? cur.textContent : '';

  var existing = document.getElementById('weight-input-modal');
  if (existing) document.body.removeChild(existing);

  var overlay = document.createElement('div');
  overlay.id = 'weight-input-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:16px;padding:24px;width:100%;max-width:280px;text-align:center">'
    + '<div style="font-size:32px;margin-bottom:8px">⚖️</div>'
    + '<div style="font-weight:700;font-size:16px;margin-bottom:16px">Введи текущий вес</div>'
    + '<input id="weight-modal-input" type="number" min="20" max="500" step="0.1" value="' + curVal + '" placeholder="кг"'
    + ' style="width:100%;box-sizing:border-box;padding:14px;background:var(--bg2);border:none;border-radius:12px;color:var(--text);font-size:24px;text-align:center;font-weight:700;margin-bottom:16px">'
    + '<button onclick="statSaveWeight()" style="width:100%;padding:12px;background:var(--green);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:15px;cursor:pointer;touch-action:manipulation;margin-bottom:8px">💾 Сохранить</button>'
    + '<button onclick="wModalClose()" style="width:100%;padding:10px;background:var(--bg2);color:var(--text2);border:none;border-radius:10px;cursor:pointer;touch-action:manipulation">Отмена</button>'
    + '</div>';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
  setTimeout(function(){ var inp=document.getElementById('weight-modal-input'); if(inp)inp.focus(); }, 100);
}

async function statSaveWeight() {
  var inp = document.getElementById('weight-modal-input');
  if (!inp) return;
  var w = parseFloat(inp.value);
  if (!w || w < 20 || w > 500) { showToast('Некорректный вес', 'var(--accent2)'); return; }
  var overlay = document.getElementById('weight-input-modal');
  if (overlay) document.body.removeChild(overlay);
  var data = await apiPost('/api/settings', {weight: w});
  if (data.ok) {
    showToast('✅ Вес ' + w + ' кг сохранён', 'var(--green)');
    initStatPage();
  } else {
    showToast('Ошибка: ' + (data.error||'?'), 'var(--accent2)');
  }
}
window.statAddWeight = statAddWeight;
window.statSaveWeight = statSaveWeight;
window.wModalClose = function(){ var m=document.getElementById("weight-input-modal"); if(m) document.body.removeChild(m); };


// ── Custom confirm dialog (replaces browser confirm) ─────────────
function showConfirm(msg, onYes, onNo) {
  var existing = document.getElementById('nutrio-confirm');
  if (existing) document.body.removeChild(existing);
  var overlay = document.createElement('div');
  overlay.id = 'nutrio-confirm';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:16px;padding:24px;width:100%;max-width:300px;text-align:center">'
    + '<div style="font-size:32px;margin-bottom:12px">⚠️</div>'
    + '<div style="font-weight:700;font-size:16px;margin-bottom:20px">' + msg + '</div>'
    + '<div style="display:flex;gap:10px">'
    + '<button id="nc-no"  style="flex:1;padding:12px;background:var(--surface2);color:var(--text);border:none;border-radius:10px;font-size:14px;cursor:pointer;touch-action:manipulation">Отмена</button>'
    + '<button id="nc-yes" style="flex:1;padding:12px;background:var(--accent2);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;touch-action:manipulation">Удалить</button>'
    + '</div></div>';
  document.body.appendChild(overlay);
  document.getElementById('nc-yes').onclick = function(){ document.body.removeChild(overlay); if(onYes) onYes(); };
  document.getElementById('nc-no').onclick  = function(){ document.body.removeChild(overlay); if(onNo)  onNo();  };
}
window.showConfirm = showConfirm;
