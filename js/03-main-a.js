// ===== ДНЕВНИК =====
function getUserId() {
  var tg = window.Telegram && window.Telegram.WebApp;
  var id = tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id;
  if (!id) {
    try {
      var p = new URLSearchParams(window.location.search);
      id = p.get('user_id') || localStorage.getItem('nutrio_user_id');
    } catch(e) {}
  }
  // Save for reuse across sessions
  if (id) {
    try { localStorage.setItem('nutrio_user_id', String(id)); } catch(e) {}
  }
  return id || 0;
}

var API_BASE = '/api/proxy';
window.API_BASE = API_BASE;

// Telegram initData — cryptographically signed, used by backend to verify identity.
function _tgInitData() {
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    return (tg && tg.initData) ? tg.initData : '';
  } catch(e) { return ''; }
}
function _authHeaders(extra) {
  var h = extra || {};
  var id = _tgInitData();
  if (id) h['X-Telegram-Init-Data'] = id;
  return h;
}
window._authHeaders = _authHeaders;

async function apiGet(path, params) {
  var uid = getUserId();
  var url = API_BASE + path + '?user_id=' + uid;
  if (params) { for(var k in params) url += '&'+k+'='+encodeURIComponent(params[k]); }
  try {
    var r = await fetch(url, { headers: _authHeaders() });
    if (r.status === 429) return { error: 'rate_limited', _rate: true };
    return await r.json();
  } catch(e) { return {error: e.message}; }
}
async function apiPost(path, body) {
  if (!body) body = {};
  if (!body.user_id) body.user_id = parseInt(getUserId());
  try {
    var r = await fetch(API_BASE + path, {method:'POST', headers:_authHeaders({'Content-Type':'application/json'}), body:JSON.stringify(body)});
    if (r.status === 429) return { error: 'rate_limited', _rate: true };
    var d = await r.json();
    if (r.status === 402) d._limit = true;
    return d;
  } catch(e) { return {error: e.message}; }
}
async function apiDelete(path, body) {
  if (!body) body = {};
  if (!body.user_id) body.user_id = parseInt(getUserId());
  try {
    var r = await fetch(API_BASE + path, {method:'DELETE', headers:_authHeaders({'Content-Type':'application/json'}), body:JSON.stringify(body)});
    return await r.json();
  } catch(e) { return {error: e.message}; }
}
function showPageError(id, msg) {
  var el=document.getElementById(id); if(!el)return;
  el.innerHTML='<div class="diary-empty" style="padding:24px"><div style="font-size:32px">⚠️</div>'
    +'<div style="color:var(--accent2);margin-top:8px">'+(msg||'Ошибка загрузки')+'</div>'
    +'<div style="font-size:11px;color:var(--muted);margin-top:6px">Убедись что бот запущен</div></div>';
}
function showPageLoading(id, txt) {
  var el=document.getElementById(id);
  if(el) el.innerHTML='<div class="ai-loading">'+(txt||'⏳ Загрузка...')+'</div>';
}

var diaryDate = new Date();
var diaryData = null;

function diaryDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function diaryDateLabel(d) {
  var today = new Date(); today.setHours(0,0,0,0);
  var yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  var dd = new Date(d); dd.setHours(0,0,0,0);
  var days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  var months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  var label = dd.getDate() + ' ' + months[dd.getMonth()];
  if (dd.getTime() === today.getTime()) label += ' (сегодня)';
  else if (dd.getTime() === yesterday.getTime()) label += ' (вчера)';
  else label += ', ' + days[dd.getDay()];
  return label;
}

function diaryPrevDay() {
  diaryDate.setDate(diaryDate.getDate() - 1);
  loadDiary();
}
function diaryNextDay() {
  var today = new Date(); today.setHours(23,59,59,999);
  if (diaryDate < today) {
    diaryDate.setDate(diaryDate.getDate() + 1);
    loadDiary();
  }
}

function initDiaryPage() {
  // Сбрасываем на сегодня при первом открытии
  var today = new Date();
  if (diaryDateStr(diaryDate) !== diaryDateStr(today) && !diaryData) {
    diaryDate = new Date();
  }
  loadDiary();
}

async function loadDiary() {
  var userId = getUserId();
  if (!userId) {
    var container = document.getElementById('diary-meals-container');
    if (container) container.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">📔</div><div>Открой из Telegram</div></div>';
    return;
  }

  // Обновляем заголовок
  var lbl = document.getElementById('diary-date-label');
  if (lbl) lbl.textContent = diaryDateLabel(diaryDate);

  // Скрываем кнопку "вперёд" если уже сегодня
  var nextBtn = document.getElementById('diary-next-btn');
  var today = new Date(); today.setHours(0,0,0,0);
  var dd = new Date(diaryDate); dd.setHours(0,0,0,0);
  if (nextBtn) nextBtn.style.opacity = dd.getTime() >= today.getTime() ? '0.3' : '1';

  try {
    showPageLoading('diary-meals-container', '📔 Загрузка...');
    var data = await apiGet('/api/diary', {date: diaryDateStr(diaryDate)});
    if (data.error) { showPageError('diary-meals-container', data.error); return; }
    diaryData = data;
    renderDiary(data);
  } catch(e) {
    showToast('Ошибка загрузки', 'var(--accent2)');
  }
}

function renderDiary(data) {
  // Прогресс-бар
  var eaten = data.total.calories;
  var goal  = data.daily_goal || 2000;
  var pct   = Math.min(100, Math.round(eaten / goal * 100));
  // Сохраняем снимок дня для шеринг-карточки
  var mealCount = 0, foodNames = [];
  if (data.meals) {
    Object.values(data.meals).forEach(function(arr){
      if (arr && arr.length) { mealCount += arr.length; arr.forEach(function(e){ if(e.name) foodNames.push(e.name); }); }
    });
  }
  window._shareDay = {
    eaten: eaten, goal: goal, pct: Math.round(eaten / goal * 100),
    protein: data.total.protein, fat: data.total.fat, carbs: data.total.carbs,
    streak: data.streak || 0, date: diaryDate,
    water: data.water_ml || 0, waterGoal: data.water_goal || 2000,
    mealCount: mealCount,
    topFoods: foodNames.slice(0, 5),
  };
  var el = document.getElementById('diary-kcal-eaten'); if(el) el.textContent = eaten;
  var gl = document.getElementById('diary-kcal-goal');  if(gl) gl.textContent = '/ ' + goal + ' ккал';
  var fill = document.getElementById('diary-prog-fill');
  if (fill) {
    fill.style.width = pct + '%';
    fill.className = 'diary-prog-fill' + (eaten > goal ? ' over' : '');
  }
  var pr = document.getElementById('diary-prot'); if(pr) pr.textContent = data.total.protein;
  var fa = document.getElementById('diary-fat');  if(fa) fa.textContent = data.total.fat;
  var ca = document.getElementById('diary-carb'); if(ca) ca.textContent = data.total.carbs;

  // Приёмы пищи
  var container = document.getElementById('diary-meals-container');
  if (!container) return;

  var mealOrder = ['завтрак','обед','ужин','перекус','другое'];
  var mealEmoji = {'завтрак':'🌅','обед':'☀️','ужин':'🌙','перекус':'🍎','другое':'🍽'};
  var meals = data.meals || {};
  var hasEntries = Object.keys(meals).length > 0;

  if (!hasEntries) {
    var today = new Date(); today.setHours(0,0,0,0);
    var dd = new Date(diaryDate); dd.setHours(0,0,0,0);
    var isToday = dd.getTime() === today.getTime();
    container.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">🍽</div><div>' +
      (isToday ? 'Пока ничего не добавлено' : 'Нет записей за этот день') + '</div></div>';
    return;
  }

  var html = '';
  // Сначала в нужном порядке, потом всё остальное
  var keys = mealOrder.filter(k => meals[k]);
  Object.keys(meals).forEach(k => { if (!keys.includes(k)) keys.push(k); });

  keys.forEach(function(meal) {
    var entries = meals[meal];
    if (!entries || !entries.length) return;
    var mealKcal = entries.reduce(function(s,e){return s+e.calories;}, 0);
    var emoji = mealEmoji[meal] || '🍽';
    var name = meal.charAt(0).toUpperCase() + meal.slice(1);
    html += '<div class="diary-meal-block">';
    html += '<div class="diary-meal-header" onclick="toggleMeal(this)">';
    html += '<span class="diary-meal-name">' + emoji + ' ' + name + '</span>';
    html += '<span class="diary-meal-kcal">' + mealKcal + ' ккал</span>';
    html += '<span class="diary-meal-arrow">▼</span></div>';
    html += '<div class="diary-meal-body">';
    entries.forEach(function(e) {
      html += '<div class="diary-entry" data-id="' + e.id + '">';
      html += '<div class="diary-entry-info">';
      html += '<div class="diary-entry-name">' + escHtml((e.name||'').charAt(0).toUpperCase()+(e.name||'').slice(1)) + '</div>';
      html += '<div class="diary-entry-meta">Б ' + e.protein + ' · Ж ' + e.fat + ' · У ' + e.carbs;
      if (e.time) html += ' · ' + e.time;
      html += '</div></div>';
      html += '<div class="diary-entry-kcal">' + e.calories + '</div>';
      html += '<button class="diary-entry-edit" onclick="editDiaryEntry(' + e.id + ')" title="Редактировать">✏️</button>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  container.innerHTML = html;
}

function toggleMeal(header) {
  var body = header.nextElementSibling;
  var arrow = header.querySelector('.diary-meal-arrow');
  var collapsed = body.style.display === 'none';
  body.style.display = collapsed ? 'block' : 'none';
  header.classList.toggle('collapsed', !collapsed);
  if (arrow) arrow.style.transform = collapsed ? '' : 'rotate(-90deg)';
}

// deleteDiaryEntry удалена: она была сломана (return сразу после showConfirm + ссылки
// на калькуляторные переменные idx/calcItems). В реальном UI удаление идёт через
// editDiaryEntry → модалка → deditDelete (см. 02-datepicker.js).
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


// ===== КАЛЬКУЛЯТОР + ХЕ =====
var calcMode = 'kbzu';
var calcItems = [];
var calcCurrentResult = null;

function initCalcPage() {
  setCalcMode(calcMode);
  if (calcMode === 'he') loadHeDailyData();
  renderCalcHistory();
}

function setCalcMode(mode) {
  calcMode = mode;
  var kb = document.getElementById('calc-mode-kbzu');
  var he = document.getElementById('calc-mode-he');
  if (kb) { kb.style.background = mode==='kbzu'?'var(--accent)':'transparent'; kb.style.color = mode==='kbzu'?'#fff':'var(--text2)'; }
  if (he) { he.style.background = mode==='he'  ?'var(--accent)':'transparent'; he.style.color = mode==='he'  ?'#fff':'var(--text2)'; }
  var ks = document.getElementById('calc-kbzu-section');
  var hs = document.getElementById('calc-he-section');
  if (ks) ks.style.display = mode==='kbzu'?'block':'none';
  if (hs) hs.style.display = mode==='he'  ?'block':'none';
  if (mode==='he') loadHeDailyData();
}

// ---- КБЖУ калькулятор ----
async function calcSearch() {
  var food   = (document.getElementById('calc-food-input').value || '').trim();
  var weight = parseFloat(document.getElementById('calc-weight-input').value) || 100;
  if (!food) { showToast('Введи название продукта', 'var(--accent2)'); return; }

  var btn = document.querySelector('#calc-kbzu-section .calc-add-btn');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  try {
    var data = await apiGet('/api/search', {food: food, weight: weight});
    if (!data.ok) { showToast('Не найдено: ' + (data.error||''), 'var(--accent2)'); return; }
    calcCurrentResult = data;
    var dname = (data.name||'').charAt(0).toUpperCase()+(data.name||'').slice(1);
    document.getElementById('calc-result-name').textContent = dname + ' — ' + weight + 'г';
    document.getElementById('calc-r-kcal').textContent = data.calories;
    document.getElementById('calc-r-prot').textContent = data.protein;
    document.getElementById('calc-r-fat').textContent  = data.fat;
    document.getElementById('calc-r-carb').textContent = data.carbs;
    document.getElementById('calc-r-he').textContent   = data.he;
    document.getElementById('calc-result-preview').style.display = 'block';
    document.getElementById('calc-weight-section').style.display = 'block';
    calcSetWeight(100);
    // Update weight-based kcal preview on weight change
    var wi = document.getElementById('calc-weight-input');
    var wk = document.getElementById('calc-weight-kcal');
    if (wi && wk) {
      wi.oninput = function() {
        var w2 = parseFloat(this.value)||100;
        if (calcCurrentResult) {
          var baseCal = calcCurrentResult._base_cal || calcCurrentResult.calories;
          var kcal2   = Math.round(baseCal * w2 / weight);
          wk.textContent = kcal2 + ' ккал';
        }
      };
    }
    data._base_cal = data.calories / weight * 100;
    // Save to history
    calcSaveHistory(data.name, data);
  } catch(e) {
    showToast('Ошибка поиска', 'var(--accent2)');
  } finally {
    if (btn) { btn.textContent = '🔍 Найти'; btn.disabled = false; }
  }
}

function calcAddItem() {
  if (!calcCurrentResult) return;
  calcItems.push(Object.assign({}, calcCurrentResult));
  calcCurrentResult = null;
  document.getElementById('calc-result-preview').style.display = 'none';
  document.getElementById('calc-food-input').value = '';
  calcRenderItems();
  showToast('Добавлено!', 'var(--green)');
}

function calcRemoveItem(idx) {
  calcItems.splice(idx, 1);
  calcRenderItems();
}

function calcRenderItems() {
  var list = document.getElementById('calc-items-list');
  var total = document.getElementById('calc-total-card');
  var saveSection = document.getElementById('calc-save-section');

  if (!calcItems.length) {
    list.innerHTML = '';
    total.style.display = 'none';
    saveSection.style.display = 'none';
    return;
  }

  var html = '';
  var totKcal = 0, totProt = 0, totFat = 0, totCarb = 0, totHe = 0;
  calcItems.forEach(function(item, i) {
    totKcal += item.calories; totProt += item.protein;
    totFat  += item.fat;      totCarb += item.carbs;
    totHe   += item.he;
    html += '<div class="calc-item">';
    html += '<div class="calc-item-info">';
    html += '<div class="calc-item-name">' + escHtml(item.name) + ' — ' + item.weight + 'г</div>';
    html += '<div class="calc-item-sub">' + item.calories + ' ккал · ХЕ: ' + item.he + '</div>';
    html += '</div>';
    html += '<button class="calc-item-del" onclick="calcRemoveItem(' + i + ')">✕</button>';
    html += '</div>';
  });
  list.innerHTML = html;

  document.getElementById('calc-total-kcal').textContent = Math.round(totKcal) + ' ккал';
  document.getElementById('calc-total-he').textContent   = 'ХЕ: ' + Math.round(totHe * 10) / 10;
  document.getElementById('calc-total-prot').textContent = Math.round(totProt * 10) / 10;
  document.getElementById('calc-total-fat').textContent  = Math.round(totFat  * 10) / 10;
  document.getElementById('calc-total-carb').textContent = Math.round(totCarb * 10) / 10;
  total.style.display = 'block';
  saveSection.style.display = 'block';
  // Auto-highlight meal by time
  var h = new Date().getHours();
  var autoMeal = h<10 ? 'завтрак' : h<14 ? 'обед' : h<18 ? 'обед' : h<21 ? 'ужин' : 'перекус';
  var mealBtn = document.querySelector('[onclick*="calcSelectMeal(\''+autoMeal+'\'"]');
  // Не перезаписываем выбор юзера; авто-логика срабатывает только если он сам ничего не нажимал.
  if (!_calcUserPickedMeal) {
    _calcSelectedMeal = autoMeal;
    document.querySelectorAll('#calc-meal-btns button').forEach(function(b) {
      var isSel = b.textContent.trim().toLowerCase().indexOf(autoMeal) !== -1 || b.getAttribute('onclick').indexOf(autoMeal) !== -1;
      b.style.borderColor = isSel ? 'var(--green)' : 'transparent';
      b.style.background  = isSel ? 'rgba(67,233,123,.15)' : 'var(--surface)';
      b.style.fontWeight  = isSel ? '700' : '400';
    });
  }
}

async function calcSave() {
  if (!calcItems.length) return;
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  // Авто-выбор приёма пищи только если юзер не выбирал явно
  if (!_calcUserPickedMeal) {
    var h = new Date().getHours();
    _calcSelectedMeal = h<10 ? 'завтрак' : h<14 ? 'обед' : h<18 ? 'обед' : h<21 ? 'ужин' : 'перекус';
  }
  var meal = _calcSelectedMeal;
  var btn = document.getElementById('calc-save-btn') || document.querySelector('.calc-save-btn');
  if (btn) { btn.textContent = '⏳ Сохраняю...'; btn.disabled = true; }
  try {
    var data = await apiPost('/api/calculator/save', {meal_type: meal, items: calcItems});
    if (data.ok) {
      showToast('✅ Сохранено в дневник!', 'var(--green)');
      calcClear();
    } else {
      showToast('Ошибка: ' + (data.error || '?'), 'var(--accent2)');
    }
  } catch(e) {
    showToast('Ошибка: ' + e.message, 'var(--accent2)');
  } finally {
    if (btn) { btn.textContent = '💾 Сохранить в дневник'; btn.disabled = false; }
  }
}

function calcClear() {
  calcItems = [];
  calcCurrentResult = null;
  _calcUserPickedMeal = false;
  document.getElementById('calc-items-list').innerHTML = '';
  document.getElementById('calc-result-preview').style.display = 'none';
  document.getElementById('calc-total-card').style.display = 'none';
  document.getElementById('calc-save-section').style.display = 'none';
  document.getElementById('calc-food-input').value = '';
}

// ---- ХЕ калькулятор ----
async function loadHeDailyData() {
  var userId = getUserId();
  if (!userId) return;
  try {
    var data = await apiGet('/api/diary');
    if (data.error) return;
    var totalHe = Math.round(data.total.carbs / 12 * 10) / 10;
    var heNorm  = 21; // средняя норма 17-25
    var pct     = Math.min(100, Math.round(totalHe / heNorm * 100));
    document.getElementById('he-today-val').textContent = totalHe + ' ХЕ';
    document.getElementById('he-today-prog').style.width = pct + '%';
  } catch(e) {}
}

async function heSearch() {
  var food   = (document.getElementById('he-food-input').value || '').trim();
  var weight = parseFloat(document.getElementById('he-weight-input').value) || 100;
  if (!food) { showToast('Введи название продукта', 'var(--accent2)'); return; }

  var btn = document.querySelector('#calc-he-section .calc-add-btn');
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  try {
    var data = await apiGet('/api/search', {food: food, weight: weight});
    if (!data.ok) { showToast('Не найдено', 'var(--accent2)'); return; }

    var he    = data.he;
    var label = he <= 2 ? '🟢 Норма' : (he <= 4 ? '🟡 Умеренно' : '🔴 Много');
    var cls   = he <= 2 ? 'he-safe' : (he <= 4 ? 'he-medium' : 'he-high');

    document.getElementById('he-result-name').textContent  = data.name + ' — ' + weight + 'г';
    document.getElementById('he-result-val').textContent   = he;
    document.getElementById('he-result-val').className     = 'he-result-val ' + cls;
    document.getElementById('he-result-label').textContent = 'ХЕ · ' + label;
    document.getElementById('he-result-carbs').textContent = 'Углеводы: ' + data.carbs + 'г';
    document.getElementById('he-result-card').style.display = 'block';
  } catch(e) {
    showToast('Ошибка поиска', 'var(--accent2)');
  } finally {
    if (btn) { btn.textContent = 'Рассчитать ХЕ'; btn.disabled = false; }
  }
}


// ===== МОИ ПРОДУКТЫ =====
var mfData = [];
var mfEditId = null;
var mfUseItem = null;

async function initMyFoodsPage() {
  await loadMyFoods();
  document.getElementById('mf-search').oninput = function() { mfRender(this.value); };
}

async function loadMyFoods() {
  var userId = getUserId();
  if (!userId) return;
  try {
    showPageLoading('mf-list', '⭐ Загрузка...');
    var data = await apiGet('/api/myfoods');
    if (data.ok) { mfData = data.foods || []; mfRender(''); }
    else showPageError('mf-list', data.error || 'Ошибка загрузки');
  } catch(e) { showToast('Ошибка загрузки', 'var(--accent2)'); }
}

function mfRender(filter) {
  var list = document.getElementById('mf-list');
  if (!list) return;
  var items = filter ? mfData.filter(function(f) {
    return f.name.toLowerCase().includes(filter.toLowerCase());
  }) : mfData;
  if (!items.length) {
    list.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">⭐</div>'
      + '<div>' + (filter ? 'Ничего не найдено' : 'Нет продуктов') + '</div></div>';
    return;
  }
  list.innerHTML = items.map(function(f) {
    var fname = (f.name||'').charAt(0).toUpperCase()+(f.name||'').slice(1);
    return '<div style="background:var(--surface);border-radius:14px;padding:14px;margin-bottom:8px">'
      + '<div style="display:flex;align-items:center;gap:10px">'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-weight:700;font-size:14px;margin-bottom:5px">' + escHtml(fname) + '</div>'
      + '<div style="display:flex;gap:10px;font-size:12px">'
      + '<span style="color:var(--accent)">🔥 ' + f.calories + '</span>'
      + '<span style="color:#81c784">Б ' + f.protein + '</span>'
      + '<span style="color:#ffb74d">Ж ' + f.fat + '</span>'
      + '<span style="color:#64b5f6">У ' + f.carbs + '</span>'
      + '<span style="color:var(--text2);font-size:10px">/100г</span>'
      + '</div></div>'
      + '<button onclick="mfUse(' + f.id + ')" style="padding:8px 12px;background:var(--green);color:#fff;border:none;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;touch-action:manipulation;white-space:nowrap;flex-shrink:0">+ Добавить</button>'
      + '</div>'
      + '<div style="display:flex;gap:6px;margin-top:8px">'
      + '<button onclick="mfShowForm(' + f.id + ')" style="flex:1;padding:7px;background:var(--bg2);color:var(--text2);border:none;border-radius:8px;font-size:12px;cursor:pointer;touch-action:manipulation">✏️ Изменить</button>'
      + '<button onclick="mfDelete(' + f.id + ')" style="flex:1;padding:7px;background:rgba(255,80,80,.1);color:var(--accent2);border:none;border-radius:8px;font-size:12px;cursor:pointer;touch-action:manipulation">🗑 Удалить</button>'
      + '</div></div>';
  }).join('');
}

function mfShowForm(id) {
  mfEditId = id;
  var overlay = document.getElementById('mf-form-overlay');
  var title   = document.getElementById('mf-form-title');
  var hint    = document.getElementById('mf-form-hint');
  if (id) {
    var f = mfData.find(function(x) { return x.id === id; });
    if (!f) return;
    document.getElementById('mf-f-name').value = f.name;
    document.getElementById('mf-f-cal').value  = f.calories;
    document.getElementById('mf-f-prot').value = f.protein;
    document.getElementById('mf-f-fat').value  = f.fat;
    document.getElementById('mf-f-carb').value = f.carbs;
    if (title) title.textContent = 'Редактировать продукт';
    if (hint)  hint.textContent  = '';
  } else {
    ['mf-f-name','mf-f-cal','mf-f-prot','mf-f-fat','mf-f-carb'].forEach(function(id) {
      var el = document.getElementById(id); if(el) el.value='';
    });
    if (title) title.textContent = 'Новый продукт';
    if (hint)  hint.textContent  = 'КБЖУ вводится на 100г продукта';
  }
  if (overlay) { overlay.style.display = 'flex'; }
  setTimeout(function(){ var n=document.getElementById('mf-f-name'); if(n)n.focus(); }, 100);
}

function mfHideForm() {
  var overlay = document.getElementById('mf-form-overlay');
  if (overlay) overlay.style.display = 'none';
  mfEditId = null;
}

async function mfSave() {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  var name = document.getElementById('mf-f-name').value.trim();
  var cal  = parseFloat(document.getElementById('mf-f-cal').value) || 0;
  var prot = parseFloat(document.getElementById('mf-f-prot').value) || 0;
  var fat  = parseFloat(document.getElementById('mf-f-fat').value) || 0;
  var carb = parseFloat(document.getElementById('mf-f-carb').value) || 0;
  if (!name) { showToast('Введи название', 'var(--accent2)'); return; }
  if (cal <= 0) { showToast('Укажи калории', 'var(--accent2)'); return; }

  var body = {user_id: parseInt(userId), name: name, calories: cal,
               protein: prot, fat: fat, carbs: carb};
  if (mfEditId) body.id = mfEditId;

  try {
    var data = await apiPost('/api/myfoods', body);
    if (data.ok) {
      showToast(mfEditId ? '✅ Обновлено!' : '✅ Добавлено!', 'var(--green)');
      mfHideForm();
      await loadMyFoods();
    } else {
      showToast(data.error || 'Ошибка', 'var(--accent2)');
    }
  } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
}

async function mfDelete(id) {
  var userId = getUserId();
  if (!userId) return;
  showConfirm('Удалить продукт?', async function() {
    try {
      var data = await apiDelete('/api/myfoods', {food_id: id});
      if (data.ok) { showToast('Удалено', 'var(--green)'); await loadMyFoods(); }
      else showToast(data.error || 'Ошибка', 'var(--accent2)');
    } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
  });
}

function mfUse(id) {
  mfUseItem = mfData.find(function(x) { return x.id === id; });
  if (!mfUseItem) return;
  document.getElementById('mf-use-name').textContent = mfUseItem.name;
  document.getElementById('mf-use-weight').value = '100';
  document.getElementById('mf-use-popup').style.display = 'flex';
  mfUpdateKcalPreview();
  document.getElementById('mf-use-weight').oninput = mfUpdateKcalPreview;
}
function mfUpdateKcalPreview() {
  if (!mfUseItem) return;
  var w = parseFloat(document.getElementById('mf-use-weight').value) || 100;
  var kcal = Math.round(mfUseItem.calories * w / 100);
  var preview = document.getElementById('mf-use-kcal-preview');
  if (preview) preview.textContent = kcal + ' ккал';
}

function mfHideUse() {
  var p = document.getElementById('mf-use-popup');
  if (p) p.style.display = 'none';
  mfUseItem = null;
}

async function mfUseConfirm() {
  var userId = getUserId();
  if (!userId || !mfUseItem) return;
  var weight = parseFloat(document.getElementById('mf-use-weight').value) || 100;
  var meal   = document.getElementById('mf-use-meal').value;
  var factor = weight / 100;
  var item = {
    name:     mfUseItem.name,
    weight:   weight,
    calories: Math.round(mfUseItem.calories * factor),
    protein:  Math.round(mfUseItem.protein * factor * 10) / 10,
    fat:      Math.round(mfUseItem.fat     * factor * 10) / 10,
    carbs:    Math.round(mfUseItem.carbs   * factor * 10) / 10,
  };
  try {
    var data = await apiPost('/api/calculator/save', {meal_type: meal, items: [item]});
    if (data.ok) {
      showToast('✅ Добавлено в дневник!', 'var(--green)');
      mfHideUse();
    } else {
      showToast(data.error || 'Ошибка', 'var(--accent2)');
    }
  } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
}

// ===== СТАТИСТИКА =====
async function initStatPage() {
  var userId = getUserId();
  if (!userId) {
    document.getElementById('stat-streak').textContent = '?';
    return;
  }
  try {
    var data = await apiGet('/api/stats');
    if (data.error) { showToast('Ошибка: ' + data.error, 'var(--accent2)'); return; }
    renderStats(data);
  } catch(e) { showToast('Ошибка загрузки', 'var(--accent2)'); }
}

function renderStats(data) {
  // Стрик
  var el = document.getElementById('stat-streak');
  if (el) el.textContent = data.streak || 0;

  // KPI
  var goal    = data.daily_goal || 2000;
  var avgKcal = data.avg_week_kcal || 0;
  var pct     = avgKcal ? Math.round(avgKcal / goal * 100) : 0;
  var avgEl   = document.getElementById('stat-avg-kcal');   if (avgEl) avgEl.textContent = avgKcal || '—';
  var pctEl   = document.getElementById('stat-goal-pct');   if (pctEl) pctEl.textContent = avgKcal ? pct + '%' : '—';
  var daysEl  = document.getElementById('stat-days-logged'); if (daysEl) daysEl.textContent = data.days_logged || 0;

  // Bar chart 7 дней
  var chart = document.getElementById('stat-bar-chart');
  if (chart && data.week_days) {
    // Бэк отдаёт 30 дней в week_days. Для бар-чарта "Последние 7 дней" берём только последние 7.
    var last7 = data.week_days.slice(-7);
    var maxKcal = Math.max.apply(null, last7.map(function(d) { return d.kcal; })) || goal;
    var today   = new Date().toISOString().split('T')[0];
    var days    = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    chart.innerHTML = last7.map(function(d) {
      var pct2   = d.kcal ? Math.round(d.kcal / maxKcal * 100) : 3;
      var isToday = d.date === today;
      var over   = d.kcal > goal;
      var cls    = isToday ? ' today' : (over ? ' over' : '');
      var dObj   = new Date(d.date);
      var lbl    = days[dObj.getDay()];
      return '<div class="stat-bar-col">'
        + '<div class="stat-bar-val">' + (d.kcal || '') + '</div>'
        + '<div class="stat-bar' + cls + '" style="height:' + pct2 + '%"></div>'
        + '<div class="stat-bar-lbl">' + lbl + '</div>'
        + '</div>';
    }).join('');
  }

  // ИМТ
  if (data.bmi) {
    var bmiCard = document.getElementById('stat-bmi-card');
    if (bmiCard) bmiCard.style.display = 'block';
    var bmiVal = document.getElementById('stat-bmi-val');
    if (bmiVal) bmiVal.textContent = data.bmi;
    // Pin position: BMI 15=0% .. 40=100%
    var pin = document.getElementById('stat-bmi-pin');
    if (pin) {
      var pctBmi = Math.max(0, Math.min(100, Math.round((data.bmi - 15) / 25 * 100)));
      pin.style.left = pctBmi + '%';
    }
    var bmiCat = document.getElementById('stat-bmi-cat');
    if (bmiCat) {
      var bmi = data.bmi;
      bmiCat.textContent = bmi < 18.5 ? '📉 Дефицит веса' :
                           bmi < 25   ? '✅ Норма' :
                           bmi < 30   ? '⚠️ Избыточный вес' : '🔴 Ожирение';
    }
  }

  // Топ продукты
  if (data.top_foods && data.top_foods.length) {
    var topCard = document.getElementById('stat-top-card');
    var topList = document.getElementById('stat-top-list');
    if (topCard) topCard.style.display = 'block';
    if (topList) {
      topList.innerHTML = data.top_foods.map(function(f, i) {
        return '<div class="stat-top-item">'
          + '<span class="stat-top-name">' + (i+1) + '. ' + escHtml((f.name||'').charAt(0).toUpperCase()+(f.name||'').slice(1)) + '</span>'
          + '<span class="stat-top-count">' + f.count + ' раз</span>'
          + '</div>';
      }).join('');
    }
  }

  var wVal = document.getElementById('stat-weight-val');
  if (wVal) wVal.textContent = data.current_weight ? data.current_weight + '' : '—';
  
  if (data.weight_history && data.weight_history.length > 0) {
    var wh = data.weight_history;
    // Show change vs first entry
    var wChange = document.getElementById('stat-weight-change');
    if (wChange && wh.length > 1) {
      var diff = Math.round((wh[wh.length-1].weight - wh[0].weight) * 10) / 10;
      wChange.textContent = diff > 0 ? '▲ +'+diff+' кг' : diff < 0 ? '▼ '+diff+' кг' : '→ без изм.';
      wChange.style.color = diff < 0 ? 'var(--green)' : diff > 0 ? 'var(--accent2)' : 'var(--text2)';
    }
    
    var emptyEl = document.getElementById('stat-weight-empty');
    var wrapEl  = document.getElementById('stat-weight-chart-wrap');
    if (emptyEl) emptyEl.style.display = 'none';
    if (wrapEl && wh.length > 1) {
      wrapEl.style.display = 'block';
      var maxW  = Math.max.apply(null, wh.map(function(w){ return w.weight; }));
      var minW  = Math.min.apply(null, wh.map(function(w){ return w.weight; }));
      var range = maxW - minW || 1;
            var chart = document.getElementById('stat-wh-chart');
      if (chart) {
        chart.innerHTML = wh.slice().reverse().map(function(w, idx) {
          var pct   = Math.round((w.weight-minW)/range*70+15);
          var isNew = idx === 0;
          return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
            + '<div style="font-size:11px;color:var(--text2);min-width:32px">'+w.date+'</div>'
            + '<div style="flex:1;height:16px;background:var(--bg2);border-radius:4px;overflow:hidden">'
            +   '<div style="height:100%;width:'+pct+'%;background:'+(isNew?'var(--accent)':'var(--text2)')+';border-radius:4px"></div>'
            + '</div>'
            + '<div style="font-size:12px;font-weight:700;color:'+(isNew?'var(--accent)':'var(--text)')+';min-width:40px;text-align:right">'+w.weight+' кг</div>'
            + '</div>';
        }).join('');
      }
    }
  }
}


// ===== AI PAGE =====
var aiMode = 'nutri';
var planDays = 3;
var recipeFilter = 'random';
var recipeHistory = []

function initAiPage() { setAiMode(aiMode); }

function setAiMode(mode) {
  aiMode = mode;
  ['nutri','plan','recipe'].forEach(function(m) {
    document.getElementById('ai-btn-' + m).className =
      'ai-mode-btn' + (m === mode ? ' active' : '');
    document.getElementById('ai-section-' + m).className =
      'ai-section' + (m === mode ? ' active' : '');
  });
}

function selectPlanDays(n) {
  planDays = n;
  document.querySelectorAll('.plan-day-btn').forEach(function(b) {
    b.className = 'plan-day-btn' + (parseInt(b.textContent) === n ? ' selected' : '');
  });
}

function selectRecipeFilter(btn) {
  recipeFilter = btn.getAttribute('data-key');
  document.querySelectorAll('.recipe-filter-btn').forEach(function(b) {
    b.className = 'recipe-filter-btn' + (b === btn ? ' selected' : '');
  });
}

function _aiLimitMsg(data) {
  var isPremium = data.premium;
  return '<div class="ai-limit-card">'
    + '<div class="ai-limit-icon">⭐</div>'
    + '<div style="font-weight:700;margin-bottom:6px">Лимит исчерпан</div>'
    + '<div style="font-size:13px;color:var(--muted)">Использовано ' + data.used + '/' + data.limit + '</div>'
    + (isPremium ? '' :
       '<button class="ai-action-btn" style="background:var(--accent);margin-top:10px" '
       + 'onclick="switchTab(&apos;prempage&apos;)">'
       + '⭐ Купить Premium</button>')
    + '</div>';
}

async function runNutritionist() {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  var lang = window._appLang || 'ru';
  var btn  = document.getElementById('nutri-btn');
  var res  = document.getElementById('nutri-result');
  btn.disabled = true; btn.textContent = '⏳ Анализирую...';
  res.className = 'ai-result-card show';
  res.innerHTML = '<div class="ai-loading">🤖 Анализирую питание за 14 дней...</div>';
  try {
    var data = await apiPost('/api/nutritionist', {lang: lang});
    if (data._limit || data.error === 'limit') {
      res.innerHTML = _aiLimitMsg(data);
    } else if (data.error === 'no_data') {
      res.innerHTML = '<div style="text-align:center;padding:16px;color:var(--muted)">'
        + '📝 Нет данных о питании. Начни записывать еду в дневник!</div>';
    } else if (data.ok) {
      res.textContent = data.text;
    } else {
      res.innerHTML = '<div style="color:var(--accent2)">Ошибка: ' + (data.error||'?') + '</div>';
    }
  } catch(e) {
    res.innerHTML = '<div style="color:var(--accent2)">Ошибка соединения</div>';
  } finally {
    btn.disabled = false; btn.textContent = '🔍 Проанализировать питание';
  }
}

async function runMealPlan() {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  var lang  = window._appLang || 'ru';
  var restr = (document.getElementById('plan-restrictions').value || '').trim();
  var btn   = document.getElementById('plan-btn');
  var res   = document.getElementById('plan-result');
  btn.disabled = true; btn.textContent = '⏳ Составляю план...';
  res.className = 'ai-result-card show';
  res.innerHTML = '<div class="ai-loading">📅 Генерирую план на ' + planDays + ' дней...</div>';
  try {
    var data = await apiPost('/api/meal_plan', {lang: lang, days: planDays, restrictions: restr});
    if (data._limit || data.error === 'limit') {
      res.innerHTML = _aiLimitMsg(data);
    } else if (data.ok) {
      res.textContent = data.text;
    } else {
      res.innerHTML = '<div style="color:var(--accent2)">Ошибка: ' + (data.error||'?') + '</div>';
    }
  } catch(e) {
    res.innerHTML = '<div style="color:var(--accent2)">Ошибка соединения</div>';
  } finally {
    btn.disabled = false; btn.textContent = '📅 Создать план питания';
  }
}

async function runRecipe() {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  var lang    = window._appLang || 'ru';
  var btn     = document.getElementById('recipe-btn');
  var nextBtn = document.getElementById('recipe-next-btn');
  var res     = document.getElementById('recipe-result');
  btn.disabled = true; nextBtn.disabled = true;
  btn.textContent = '⏳ Генерирую...';
  res.className = 'ai-result-card show';
  res.innerHTML = '<div class="ai-loading">👨‍🍳 Генерирую рецепт...</div>';
  try {
    var data = await apiPost('/api/recipe', {lang: lang, filter: recipeFilter, history: recipeHistory});
    if (data._limit || data.error === 'limit') {
      res.innerHTML = _aiLimitMsg(data);
      nextBtn.style.display = 'none';
    } else if (data.ok) {
      res.textContent = data.text;
      // Сохраняем название в историю
      // Достаём название рецепта надёжно: первая непустая строка очищенная от
      // markdown/эмодзи/служебных префиксов. Старая регулярка `/🍽\s*(.+?)\n/`
      // ломалась если AI отвечал без 🍽 или без \n в нужном месте.
      var firstLine = (data.text || '').split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean)[0] || '';
      var title = firstLine
        .replace(/^[#*>•\-—–\s]+/, '')                        // markdown/маркеры списка
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // эмодзи
        .replace(/\*\*([^*]+)\*\*/g, '$1')                     // bold
        .replace(/\*/g, '')                                    // оставшиеся *
        .trim();
      if (title) recipeHistory.push(title);
      if (recipeHistory.length > 5) recipeHistory = recipeHistory.slice(-5);
      nextBtn.style.display = 'block';
      btn.style.display = 'none';
    } else {
      res.innerHTML = '<div style="color:var(--accent2)">Ошибка: ' + (data.error||'?') + '</div>';
    }
  } catch(e) {
    res.innerHTML = '<div style="color:var(--accent2)">Ошибка соединения</div>';
  } finally {
    btn.disabled = false; nextBtn.disabled = false;
    if (btn.style.display !== 'none') btn.textContent = '👨‍🍳 Сгенерировать рецепт';
    else nextBtn.textContent = '🔄 Другой рецепт';
  }
}


// ===== МИКРОНУТРИЕНТЫ =====
async function initMicroPage() {
  var userId = getUserId();
  if (!userId) return;
  var container = document.getElementById('micro-container');
  var note      = document.getElementById('micro-note');
  container.innerHTML = '<div class="ai-loading">🔬 Загружаю данные...</div>';

  if (!userId) {
    container.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">🔬</div><div>Открой из Telegram чтобы увидеть данные</div></div>';
    return;
  }
  try {
    showPageLoading('micro-container', '🔬 Загрузка...');
    var today = new Date().toISOString().split('T')[0];
    var data  = await apiGet('/api/micronutrients', {date: today});
    if (data.error) { showPageError('micro-container', data.error); return; }

    if (!data.entries_count || data.entries_count === 0) {
      container.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">🔬</div>'
        + '<div>Нет записей еды сегодня.<br>Сначала добавь еду в дневник.</div></div>';
      var noteEl = document.getElementById('micro-note');
      if (noteEl) noteEl.textContent = '';
      return;
    }

    var hasAnyData = data.nutrients.some(function(n) { return n.has_data; });
    if (!hasAnyData) {
      container.innerHTML = '<div class="micro-explain">'
        + '<div style="font-size:42px;text-align:center;margin-bottom:8px">📊</div>'
        + '<div style="font-weight:700;text-align:center;margin-bottom:10px">Для этих записей данных пока нет</div>'
        + '<div style="font-size:13px;color:var(--text2);line-height:1.5">'
        +   'Микронутриенты (витамины, минералы, клетчатка) сейчас приходят только с расширенными источниками:'
        +   '<ul style="margin:8px 0;padding-left:18px;color:var(--text2);font-size:12px;line-height:1.6">'
        +     '<li><b>Штрихкоды</b> — большая часть товаров отдаёт состав через OpenFoodFacts</li>'
        +     '<li><b>Поиск в Калькуляторе</b> с английскими названиями — попадание в базу USDA</li>'
        +   '</ul>'
        +   '<div style="margin-top:8px"><b>Российские продукты</b> в локальной базе сейчас имеют только КБЖУ. Мы постепенно расширяем покрытие — спасибо за терпение.</div>'
        + '</div></div>';
      return;
    }

    var groups = {macro: [], vitamins: [], minerals: []};
    var groupNames = {macro: '🌾 Макро / Другое', vitamins: '💊 Витамины', minerals: '⛏ Минералы'};
    data.nutrients.forEach(function(n) { if (groups[n.group]) groups[n.group].push(n); });

    var html = '';
    Object.keys(groups).forEach(function(g) {
      var items = groups[g].filter(function(n) { return n.has_data || n.pct > 0; });
      if (!items.length) return;
      html += '<div class="micro-group-title">' + (groupNames[g] || g) + '</div>';
      items.forEach(function(n) {
        var cls = n.pct >= 100 ? 'over' : (n.pct >= 70 ? 'ok' : (n.pct > 0 ? 'warn' : 'none'));
        html += '<div class="micro-item">'
          + '<div class="micro-item-row">'
          + '<span class="micro-item-name">' + n.emoji + ' ' + n.name_ru + '</span>'
          + '<span class="micro-item-val">' + n.val + ' / ' + n.norm + ' ' + n.unit
          + ' (' + n.pct + '%)</span>'
          + '</div>'
          + '<div class="micro-bar-wrap"><div class="micro-bar-fill ' + cls + '" style="width:' + Math.min(n.pct,100) + '%"></div></div>'
          + '</div>';
      });
    });
    container.innerHTML = html || '<div class="lb-empty">Нет данных</div>';
    if (note) note.textContent = 'Данные из ' + data.entries_count + ' записей за сегодня';
  } catch(e) {
    container.innerHTML = '<div class="lb-empty">Ошибка загрузки</div>';
  }
}

// ===== РЕЙТИНГ =====
var lbType = 'streak';

async function initLbPage() { await loadLb(lbType); }

async function loadLb(type) {
  lbType = type;
  ['streak','achievements'].forEach(function(t) {
    var el = document.getElementById('lb-btn-' + t);
    if (!el) return;
    el.style.background = t === type ? 'var(--accent)' : 'var(--surface)';
    el.style.color      = t === type ? '#fff' : 'var(--text2)';
  });

  var userId    = getUserId() || 0;
  var container = document.getElementById('lb-container');
  container.innerHTML = '<div class="ai-loading">🏆 Загружаю рейтинг...</div>';

  try {
    showPageLoading('lb-container', '🏆 Загрузка...');
    var data  = await apiGet('/api/leaderboard', {type: type});
    if (!data.ok || !data.entries || !data.entries.length) {
      container.innerHTML = '<div class="lb-empty"><div style="font-size:40px">🏆</div><div>Пока нет данных</div></div>';
      return;
    }
    container.innerHTML = data.entries.map(function(e) {
      var medal = e.rank===1?'🥇':e.rank===2?'🥈':e.rank===3?'🥉':'';
      var rankLabel = e.rank && e.rank > 0 ? (medal || ('#'+e.rank)) : (e.is_me ? '👤' : '—');
      var bg = e.is_me ? 'background:rgba(108,99,255,.15);border:1px solid var(--accent)' : 'background:var(--surface)';
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;margin-bottom:6px;' + bg + '">'
        + '<div style="font-size:' + (medal?'22':'13') + 'px;min-width:30px;text-align:center;font-weight:700;color:var(--text2)">' + rankLabel + '</div>'
        + '<div style="flex:1;font-weight:' + (e.is_me?'800':'600') + ';font-size:14px">' + escHtml(e.name) + (e.is_me?'&nbsp;<span style="font-size:10px;background:var(--accent);color:#fff;padding:2px 6px;border-radius:5px">ты</span>':'') + '</div>'
        + '<div style="font-weight:800;font-size:16px;color:var(--accent)">' + e.value + '&nbsp;<span style="font-size:10px;color:var(--text2);font-weight:400">' + (e.unit||'') + '</span></div>'
        + '</div>';
    }).join('');
    if (data.my_rank && !data.entries.find(function(e){ return e.is_me; })) {
      container.innerHTML += '<div style="text-align:center;padding:10px;font-size:13px;color:var(--text2)">Ты на #' + data.my_rank + ' месте</div>';
    }
  } catch(e) {
    container.innerHTML = '<div class="lb-empty">Ошибка загрузки</div>';
  }
}

// ===== PDF =====
var pdfDays = 7;

function initPdfPage() { /* nothing on init */ }

function selectPdfDays(days, el) {
  pdfDays = days;
  document.querySelectorAll('.pdf-option-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
}

async function downloadPdf() { return _downloadPdf(false); }
async function downloadPdfPreview() { return _downloadPdf(true); }

async function _downloadPdf(preview) {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }
  var btn = document.getElementById(preview ? 'pdf-preview-btn' : 'pdf-dl-btn');
  var origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = preview ? '⏳ Генерирую превью...' : '⏳ Генерирую PDF...'; }
  try {
    // PDF доставляется как документ в чат с ботом — это надёжнее чем blob-скачка,
    // которая на мобильном Telegram WebView молча игнорируется.
    var payload = { days: pdfDays };
    if (preview) payload.preview = true;
    var data = await apiPost('/api/pdf_send', payload);
    if (!data || !data.ok) {
      showToast('Ошибка: ' + ((data && data.error) || 'не удалось отправить'), 'var(--accent2)');
      return;
    }
    showToast(preview ? '✅ Превью отправлено в чат' : '✅ PDF отправлен в чат', 'var(--green)');
    setTimeout(function(){
      try {
        var tg = window.Telegram && window.Telegram.WebApp;
        if (tg && tg.openTelegramLink) tg.openTelegramLink('https://t.me/CaloriePilotAI_Bot');
      } catch(e) {}
    }, 600);
  } catch(e) {
    showToast('Ошибка генерации', 'var(--accent2)');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}


// ===== ИМПОРТ =====
var importParsed = [];

function initImportPage() {
  var drop  = document.getElementById('imp-drop');
  var input = document.getElementById('imp-file-input');

  input.onchange = function(e) {
    if (e.target.files[0]) importHandleFile(e.target.files[0]);
  };
  drop.ondragover = function(e) { e.preventDefault(); drop.classList.add('drag-over'); };
  drop.ondragleave = function() { drop.classList.remove('drag-over'); };
  drop.ondrop = function(e) {
    e.preventDefault(); drop.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) importHandleFile(e.dataTransfer.files[0]);
  };
}

function importHandleFile(file) {
  if (!file.name.endsWith('.csv')) { showToast('Нужен CSV файл', 'var(--accent2)'); return; }
  var reader = new FileReader();
  reader.onload = function(e) { importParseCSV(e.target.result); };
  reader.readAsText(file, 'UTF-8');
}

function importParseCSV(text) {
  var lines = text.split(/\r?\n/).filter(function(l) { return l.trim(); });
  if (lines.length < 2) { showToast('Файл пустой', 'var(--accent2)'); return; }

  var headers = lines[0].split(',').map(function(h) { return h.trim().toLowerCase().replace(/["\']/g,''); });
  var format  = importDetectFormat(headers);
  var entries = [];

  for (var i = 1; i < lines.length; i++) {
    var row = importParseCSVRow(lines[i]);
    var entry = null;
    if (format === 'mfp')       entry = importParseMFP(row, headers);
    else if (format === 'fat')  entry = importParseFat(row, headers);
    else                         entry = importParseGeneric(row, headers);
    if (entry) entries.push(entry);
  }

  importParsed = entries;
  var prog  = document.getElementById('imp-progress');
  var conf  = document.getElementById('imp-confirm-section');
  var title = document.getElementById('imp-progress-title');
  var stats = document.getElementById('imp-stats');
  var bar   = document.getElementById('imp-progress-bar');
  var prev  = document.getElementById('imp-preview');
  var prevList = document.getElementById('imp-preview-list');

  prog.style.display = 'block';
  conf.style.display = entries.length > 0 ? 'block' : 'none';
  bar.style.width = '100%';

  if (entries.length === 0) {
    title.textContent = '❌ Не удалось разобрать файл';
    stats.textContent = 'Проверь формат файла. Поддерживаются даты: 2024-12-31, 31.12.2024, 31/12/2024, 12/31/2024.';
    if (prev) prev.style.display = 'none';
  } else {
    title.textContent = '✅ Файл обработан';
    var dateSet = new Set(entries.map(function(e){return e.date.split('T')[0];}));
    stats.textContent = 'Найдено: ' + entries.length + ' записей за ' + dateSet.size + ' дней · Формат: ' + format.toUpperCase();
    document.getElementById('imp-confirm-btn').textContent = '✅ Импортировать ' + entries.length + ' записей';
    // Превью первых 5 записей чтобы юзер мог визуально проверить
    if (prev && prevList) {
      var esc = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
      prevList.innerHTML = entries.slice(0, 5).map(function(e){
        var dt = '';
        try { dt = new Date(e.date).toISOString().slice(0,10); } catch(_) { dt = e.date.slice(0,10); }
        return '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;padding:8px 10px;font-size:12px;display:flex;justify-content:space-between;gap:8px">'
          + '<div style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><b>' + esc(e.name) + '</b> · ' + esc(e.meal) + '</div>'
          + '<div style="color:var(--text2);white-space:nowrap">' + Math.round(e.calories) + ' ккал · ' + dt + '</div>'
          + '</div>';
      }).join('');
      prev.style.display = 'block';
    }
  }
}

// Универсальный парсер даты:
//   2024-12-31, 2024-12-31T08:00, 2024-12-31 08:00:00
//   31.12.2024,  31.12.2024 08:00
//   31/12/2024,  12/31/2024 (US)
// Возвращает ISO-строку. Если ничего не распарсилось — текущая дата.
function importParseDate(ds) {
  if (!ds) return new Date().toISOString();
  ds = String(ds).trim();
  // Чистый ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(ds)) {
    var dt = new Date(ds);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }
  // DD.MM.YYYY [HH:MM]
  var m = ds.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:[ T](\d{1,2}):(\d{1,2}))?/);
  if (m) {
    var dt2 = new Date(parseInt(m[3]), parseInt(m[2])-1, parseInt(m[1]),
                       parseInt(m[4]||0), parseInt(m[5]||0));
    if (!isNaN(dt2.getTime())) return dt2.toISOString();
  }
  // DD/MM/YYYY или MM/DD/YYYY — пробуем оба варианта, берём валидный
  var m2 = ds.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{1,2}))?/);
  if (m2) {
    var p1 = parseInt(m2[1]), p2 = parseInt(m2[2]), y = parseInt(m2[3]);
    var hh = parseInt(m2[4]||0), mm = parseInt(m2[5]||0);
    // Если первое > 12 — точно DD/MM. Иначе пробуем MM/DD (более частый формат CSV из US-приложений)
    var dd, mo;
    if (p1 > 12) { dd = p1; mo = p2; }
    else { mo = p1; dd = p2; }
    var dt3 = new Date(y, mo-1, dd, hh, mm);
    if (!isNaN(dt3.getTime())) return dt3.toISOString();
  }
  // Фоллбэк: системный парсер
  var dtf = new Date(ds);
  if (!isNaN(dtf.getTime())) return dtf.toISOString();
  return new Date().toISOString();
}

function importDetectFormat(h) {
  if (h.includes('meal') && h.includes('food name')) return 'mfp';
  if (h.includes('food name') && h.includes('time'))  return 'fat';
  return 'generic';
}

function importParseCSVRow(line) {
  var result = [], cur = '', inQ = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { result.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  result.push(cur.trim());
  return result;
}

function importParseMFP(row, headers) {
  var get = function(key) { var i = headers.indexOf(key); return i>=0 ? (row[i]||'') : ''; };
  var name = get('food name'); var cal = parseFloat(get('calories')) || 0;
  if (!name || !cal) return null;
  var mealMap = {breakfast:'завтрак',lunch:'обед',dinner:'ужин',snack:'перекус'};
  var meal = mealMap[get('meal').toLowerCase()] || 'другое';
  return {name:name, calories:cal, protein:parseFloat(get('protein (g)'))||0,
          fat:parseFloat(get('fat (g)'))||0, carbs:parseFloat(get('carbohydrates (g)'))||0,
          meal:meal, date:importParseDate(get('date'))};
}

function importParseFat(row, headers) {
  var get = function(key) { var i = headers.indexOf(key); return i>=0 ? (row[i]||'') : ''; };
  var name = get('food name'); var cal = parseFloat(get('calories')) || 0;
  if (!name || !cal) return null;
  return {name:name, calories:cal, protein:parseFloat(get('protein (g)'))||0,
          fat:parseFloat(get('fat (g)'))||0, carbs:parseFloat(get('carbohydrate (g)'))||0,
          meal:'другое', date:importParseDate(get('date'))};
}

function importParseGeneric(row, headers) {
  var get = function(key) { var i = headers.indexOf(key); return i>=0 ? (row[i]||'') : ''; };
  var name = get('food') || get('name') || get('product'); var cal = parseFloat(get('calories') || get('kcal')) || 0;
  if (!name || !cal) return null;
  return {name:name, calories:cal, protein:parseFloat(get('protein'))||0,
          fat:parseFloat(get('fat'))||0, carbs:parseFloat(get('carbs')||get('carbohydrates'))||0,
          meal:get('meal')||'другое', date:importParseDate(get('date'))};
}

async function importConfirm() {
  var userId = getUserId();
  if (!userId || !importParsed.length) return;
  var btn = document.getElementById('imp-confirm-btn');
  btn.disabled = true; btn.textContent = '⏳ Импортирую...';
  try {
    // Отправляем батчами по 500
    var total = 0, skip = 0;
    var batch = 500;
    for (var i = 0; i < importParsed.length; i += batch) {
      var chunk = importParsed.slice(i, i + batch);
      var pct   = Math.round((i + chunk.length) / importParsed.length * 100);
      document.getElementById('imp-progress-bar').style.width = pct + '%';
      var data = await apiPost('/api/import', {entries: chunk});
      if (data.ok) { total += data.saved; skip += data.skipped; }
    }
    showToast('✅ Импортировано: ' + total + ' записей', 'var(--green)');
    document.getElementById('imp-stats').textContent = 'Сохранено: ' + total + ' · Пропущено: ' + skip;
    importReset();
  } catch(e) {
    showToast('Ошибка импорта', 'var(--accent2)');
  } finally {
    btn.disabled = false;
  }
}

function importReset() {
  importParsed = [];
  document.getElementById('imp-progress').style.display = 'none';
  document.getElementById('imp-confirm-section').style.display = 'none';
  document.getElementById('imp-file-input').value = '';
  var prev = document.getElementById('imp-preview');
  if (prev) prev.style.display = 'none';
}

// ===== НАСТРОЙКИ =====
var settData = {};

async function initSettingsPage() {
  var userId = getUserId();
  if (!userId) return;
  try {
    var data = await apiGet('/api/settings');
    if (!data.ok) { showToast('Настройки не загружены', 'var(--accent2)'); return; }
    settData = data;

    document.getElementById('sett-kcal').value   = data.daily_goal || 2000;
    document.getElementById('sett-water').value  = data.water_goal || 2000;
    if (data.weight) document.getElementById('sett-weight').value = data.weight;

    // Load goal/lang/tz
    var goalSel = document.getElementById('sett-goal');
    var langSel = document.getElementById('sett-lang');
    var tzSel   = document.getElementById('sett-tz');
    if (goalSel && data.goal) {
      var gv = data.goal.toLowerCase();
      goalSel.value = gv.includes('похуд') || gv.includes('loss') ? 'похудение'
                    : gv.includes('набор') || gv.includes('gain') ? 'набор массы'
                    : 'поддержание веса';
    }
    if (langSel && data.language) langSel.value = data.language;
    if (tzSel   && data.timezone_offset !== undefined) tzSel.value = String(data.timezone_offset);

    // Заполняем часы в селектах
    ['food','water'].forEach(function(type) {
      var sel = document.getElementById('sett-' + type + '-time');
      sel.innerHTML = '<option value="">выкл</option>';
      for (var h = 6; h <= 23; h++) {
        sel.innerHTML += '<option value="' + h + '">' + String(h).padStart(2,'0') + ':00</option>';
      }
      var remTime = type === 'food' ? data.food_reminder_time : data.water_reminder_time;
      var toggle  = document.getElementById('sett-' + type + '-toggle');
      if (remTime !== null && remTime !== undefined) {
        sel.value = remTime;
        sel.style.display = 'block';
        toggle.className = 'sett-toggle on';
      }
    });
  } catch(e) {}
}

function toggleReminder(type) {
  var toggle = document.getElementById('sett-' + type + '-toggle');
  var sel    = document.getElementById('sett-' + type + '-time');
  var isOn   = toggle.classList.contains('on');
  if (isOn) {
    toggle.className = 'sett-toggle';
    sel.style.display = 'none';
  } else {
    toggle.className = 'sett-toggle on';
    sel.style.display = 'block';
    if (!sel.value) sel.value = type === 'food' ? '12' : '10';
  }
}

async function saveSettings() {
  var userId = getUserId();
  if (!userId) { showToast('Открой из Telegram', 'var(--accent2)'); return; }

  var foodToggle  = document.getElementById('sett-food-toggle').classList.contains('on');
  var waterToggle = document.getElementById('sett-water-toggle').classList.contains('on');
  var foodSel     = document.getElementById('sett-food-time').value;
  var waterSel    = document.getElementById('sett-water-time').value;

  var goalSel2 = document.getElementById('sett-goal');
  var langSel2 = document.getElementById('sett-lang');
  var tzSel2   = document.getElementById('sett-tz');
  var body = {
    user_id:            parseInt(userId),
    daily_goal:         parseInt(document.getElementById('sett-kcal').value)  || 2000,
    water_goal:         parseInt(document.getElementById('sett-water').value) || 2000,
    food_reminder_time: foodToggle  && foodSel  ? parseInt(foodSel)  : null,
    water_reminder_time: waterToggle && waterSel ? parseInt(waterSel) : null,
    goal:     goalSel2 ? goalSel2.value : undefined,
    language: langSel2 ? langSel2.value : undefined,
    timezone_offset: tzSel2 ? parseInt(tzSel2.value) : undefined,
  };
  var w = document.getElementById('sett-weight').value;
  if (w) body.weight = parseFloat(w);

  var btn = document.querySelector('.sett-save-btn');
  btn.disabled = true; btn.textContent = '⏳ Сохраняю...';
  try {
      var data = await apiPost('/api/settings', body);
    if (data.ok) {
      showToast('✅ Настройки сохранены', 'var(--green)');
      // Apply language change in the Mini App immediately (was only persisted server-side before)
      if (body.language && typeof applyLang === 'function') {
        try {
          applyLang(body.language);
          try { localStorage.setItem('nutrio_lang', LANG); } catch(e){}
          if (typeof applyTranslations === 'function') applyTranslations();
          if (typeof window._applyT3 === 'function') window._applyT3();
        } catch(e) { console.warn('lang refresh failed', e); }
      }
    } else {
      showToast('Ошибка: ' + (data.error||'?'), 'var(--accent2)');
    }
  } catch(e) {
    showToast('Ошибка', 'var(--accent2)');
  } finally {
    btn.disabled = false; btn.textContent = '💾 Сохранить';
  }
}


// ===== ПРИГЛАСИТЬ ДРУГА =====
var refLink = '';

async function initRefPage() {
  var userId = getUserId();
  if (!userId) {
    document.getElementById('ref-link-box').textContent = 'Открой из Telegram';
    return;
  }
  refLink = 'https://t.me/CaloriePilotAI_Bot?start=ref_' + userId;
  document.getElementById('ref-link-box').textContent = refLink;
  // Загружаем статистику через settings
  try {
    var data = await apiGet('/api/settings');
    if (data.ok) {
      var count = data.referral_count || 0;
      document.getElementById('ref-count').textContent  = count;
      document.getElementById('ref-earned').textContent = count * 7 + ' дн.';
    }
  } catch(e) {}
}

function refCopyLink() {
  if (!refLink) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(refLink).then(function() {
      showToast('✅ Ссылка скопирована!', 'var(--green)');
    });
  } else {
    var ta = document.createElement('textarea');
    ta.value = refLink; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    showToast('✅ Ссылка скопирована!', 'var(--green)');
  }
}

function refShare() {
  var shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(refLink)
    + '&text=' + encodeURIComponent('Считаю калории в NutriO — удобно и без заморочек! Попробуй бесплатно 🥗');
  var tg = window.Telegram && window.Telegram.WebApp;
  if (tg && tg.openTelegramLink) { tg.openTelegramLink(shareUrl); }
  else window.open(shareUrl, '_blank');
}

// ===== КУПИТЬ PREMIUM =====
var selectedPlan = '1m';

async function initPremPage() {
  var userId = getUserId();
  if (!userId) return;
  try {
    var data = await apiGet('/api/settings');
    if (!data.ok) { showToast('Настройки не загружены', 'var(--accent2)'); return; }

    var card  = document.getElementById('prem-status-card');
    var icon  = document.getElementById('prem-icon');
    var title = document.getElementById('prem-title');
    var sub   = document.getElementById('prem-sub');
    var buySect = document.getElementById('prem-buy-section');

    if (data.is_premium) {
      if (card)  card.className  = 'prem-status-card premium';
      if (icon)  icon.textContent  = '⭐';
      if (title) title.textContent = 'Premium активен';
      if (sub)   sub.textContent   = data.premium_until ? 'До ' + data.premium_until : 'Активен';
      if (buySect) buySect.style.display = 'none';
    } else {
      // Премиум закончился или его не было — возвращаем дефолтное состояние карточки.
      if (card)  card.className  = 'prem-status-card free';
      if (icon)  icon.textContent  = '⭐';
      if (title) title.textContent = 'NutriO Premium';
      if (sub)   sub.textContent   = 'Разблокируй полный потенциал';
      if (buySect) buySect.style.display = '';
    }
    // Load referral data too
    var rc = document.getElementById('ref-count');
    var re = document.getElementById('ref-earned');
    if (rc) rc.textContent = data.referral_count || 0;
    if (re) re.textContent = (data.referral_count||0) * 7 + ' дн.';
    // Load ref link
    if (data.telegram_id) {
      refLink = 'https://t.me/CaloriePilotAI_Bot?start=ref_' + data.telegram_id;
      var rbText = document.getElementById('ref-link-text');
      if (rbText) rbText.textContent = refLink;
      var rb = document.getElementById('ref-link-box');
      if (rb) rb.title = refLink;
    }
  } catch(e) {}
}

function selectPlan(plan, el) {
  selectedPlan = plan;
  document.querySelectorAll('.prem-plan-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
}

function premBuyStars() {
  var url = 'https://t.me/CaloriePilotAI_Bot?start=buy_' + selectedPlan;
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openLink) tg.openLink(url, {try_instant_view: false});
    else if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, '_blank');
  } catch(e) { window.open(url, '_blank'); }
}

function premBuyCard() {
  var url = 'https://t.me/CaloriePilotAI_Bot?start=pay_' + selectedPlan;
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openLink) tg.openLink(url, {try_instant_view: false});
    else if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, '_blank');
  } catch(e) { window.open(url, '_blank'); }
}

// ===== ПОМОЩЬ =====
function initHelpPage() {}

function toggleFaq(header) {
  var answer = header.nextElementSibling;
  var arrow  = header.querySelector('span');
  var isOpen = answer.classList.contains('open');
  // Закрываем все
  document.querySelectorAll('.help-faq-a').forEach(function(a) { a.classList.remove('open'); });
  document.querySelectorAll('.help-faq-q span').forEach(function(s) { s.textContent = '▼'; });
  if (!isOpen) {
    answer.classList.add('open');
    if (arrow) arrow.textContent = '▲';
  }
}

function helpOpenBot() {
  openTgLink('https://t.me/CaloriePilotAI_Bot');
}
function helpOpenSupport() {
  openTgLink('https://t.me/CaloriePilotAI_Bot?start=support');
}
function openTgLink(url) {
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openLink) tg.openLink(url, {try_instant_view: false});
    else if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, '_blank');
  } catch(e) { window.open(url, '_blank'); }
}

// Extended settings fields loaded in initSettingsPage directly


// ═══════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════
var ADMIN_IDS_JS = [1031925588, 6836630993];
var admCurrentPage = 0;
var admSearchQ = '';

function _adminHeaders() {
  var h = {'Content-Type':'application/json', 'X-Admin-Id': String(getUserId())};
  var id = (typeof _tgInitData === 'function') ? _tgInitData() : '';
  if (id) h['X-Telegram-Init-Data'] = id;
  return h;
}

async function _admFetch(action, extra) {
  var body = Object.assign({action: action}, extra || {});
  var res  = await fetch('/api/proxy/api/admin', {
    method:'POST', headers:_adminHeaders(), body:JSON.stringify(body)
  });
  if (res.status === 403) { showToast('Нет доступа', 'var(--accent2)'); throw new Error('forbidden'); }
  return await res.json();
}

async function initAdminPage() {
  var uid = parseInt(getUserId());
  if (!ADMIN_IDS_JS.includes(uid)) {
    document.getElementById('page-adminpage').innerHTML =
      '<div class="lb-empty" style="padding:40px"><div style="font-size:48px">🔒</div><div>Нет доступа</div></div>';
    return;
  }
  document.getElementById('adm-admin-label').textContent = 'ID: ' + uid;
  admSection('dash');
  admLoadDash();
}

// Show admin tab only for admins
(function() {
  function checkAdminTab() {
    var uid = parseInt(getUserId());
    var btn = document.getElementById('tab-adminpage');
    if (btn && ADMIN_IDS_JS.includes(uid)) btn.style.display = '';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkAdminTab);
  else setTimeout(checkAdminTab, 500);
})();

function admSection(name) {
  ['dash','users','payments','broadcast','admstats'].forEach(function(s) {
    var btn = document.getElementById('adm-btn-' + s);
    var sec = document.getElementById('adm-section-' + s);
    if (btn) btn.className = 'adm-nav-btn' + (s===name?' active':'');
    if (sec) sec.className = 'adm-section' + (s===name?' active':'');
  });
  if (name==='users')    admLoadUsers(0,'');
  if (name==='payments') admLoadPayments();
  if (name==='admstats') admLoadStats();
}

// ── BROADCAST (рассылка) ────────────────────────────────
function admBcPreview() {
  var ta = document.getElementById('adm-bc-text');
  var text = (ta && ta.value || '').trim();
  if (!text) { showToast('Введи текст', 'var(--accent2)'); return; }
  var p = document.getElementById('adm-bc-preview');
  if (p) {
    p.style.display = 'block';
    p.innerHTML = '<strong>Превью:</strong><br>' + text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/\n/g,'<br>')
      .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g,'<em>$1</em>');
  }
}
async function admBcSend() {
  var ta = document.getElementById('adm-bc-text');
  var text = (ta && ta.value || '').trim();
  var audSel = document.getElementById('adm-bc-audience');
  var audience = (audSel && audSel.value) || 'all';
  if (!text) { showToast('Введи текст', 'var(--accent2)'); return; }
  if (!confirm('Отправить рассылку аудитории «' + audience + '»? Отменить будет нельзя.')) return;
  var status = document.getElementById('adm-bc-status');
  if (status) status.textContent = '⏳ Отправляю... (может занять минуты при большой базе)';
  try {
    var res = await fetch('/api/proxy/api/admin', {
      method:'POST', headers:_adminHeaders(),
      body: JSON.stringify({ action:'broadcast', audience:audience, text:text })
    });
    var data = await res.json();
    if (data.ok) {
      if (status) status.textContent = '✅ Отправлено: ' + (data.sent||0) + ' · ошибок: ' + (data.errors||0);
      showToast('Рассылка отправлена!', 'var(--green)');
      if (ta) ta.value = '';
    } else {
      if (status) status.textContent = '❌ ' + (data.error||'Ошибка');
      showToast('Ошибка рассылки', 'var(--accent2)');
    }
  } catch(e) {
    if (status) status.textContent = '❌ Ошибка соединения';
  }
}

// ── РАСШИРЕННАЯ СТАТИСТИКА ──────────────────────────────
async function admLoadStats() {
  var box = document.getElementById('adm-stats-content');
  if (!box) return;
  box.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">⏳ Загрузка...</div>';
  try {
    var res = await fetch('/api/proxy/api/admin?action=detailed_stats', {headers:_adminHeaders()});
    var data = await res.json();
    if (!data.ok) { box.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка: ' + (data.error||'?') + '</div>'; return; }
    var s = data.stats || {};
    function kpi(v,l){ return '<div class="adm-kpi"><div class="adm-kpi-val">'+v+'</div><div class="adm-kpi-lbl">'+l+'</div></div>'; }
    var langs = (s.lang_breakdown||[]).map(function(l){
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">'
        + '<div style="min-width:34px;font-weight:700;font-size:12px">' + (l.lang||'?') + '</div>'
        + '<div style="flex:1;height:7px;background:var(--surface2);border-radius:4px;overflow:hidden">'
        +   '<div style="height:100%;width:' + Math.min(100, l.pct||0) + '%;background:var(--accent);border-radius:4px"></div>'
        + '</div>'
        + '<div style="min-width:38px;text-align:right;font-size:12px;color:var(--text2)">' + (l.count||0) + '</div>'
        + '</div>';
    }).join('');
    box.innerHTML =
      '<div class="adm-kpi-row">' + kpi(s.total_users||0,'Всего') + kpi(s.premium_users||0,'Premium') + kpi(s.active_7d||0,'Актив 7д') + kpi(s.new_7d||0,'Новых 7д') + '</div>'
      + '<div class="adm-kpi-row" style="margin-top:8px">' + kpi(s.total_entries||0,'Записей еды') + kpi(s.avg_entries||0,'Сред/юзер') + kpi(s.ai_generations||0,'AI генер.') + kpi(s.water_entries||0,'Вода') + '</div>'
      + '<div style="margin-top:14px"><div class="adm-label">🌍 Языки (топ-10)</div>' + (langs||'<div style="color:var(--muted);font-size:12px">нет данных</div>') + '</div>';
  } catch(e) {
    box.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка загрузки</div>';
  }
}

// ── DASHBOARD ──────────────────────────────────────────
async function admLoadDash() {
  try {
    var res  = await fetch('/api/proxy/api/admin?action=dashboard', {headers:_adminHeaders()});
    var data = await res.json();
    if (!data.ok) return;
    document.getElementById('adm-total').textContent   = data.total_users   || 0;
    document.getElementById('adm-premium').textContent = data.premium_users || 0;
    document.getElementById('adm-active').textContent  = data.active_today  || 0;
    document.getElementById('adm-entries').textContent = (data.total_entries||0).toLocaleString();
    var pend = data.pending_payments || 0;
    var pc   = document.getElementById('adm-pending-card');
    var pn   = document.getElementById('adm-pending-cnt');
    if (pend > 0) {
      pc.style.display = 'block'; if (pn) pn.textContent = pend;
    } else { pc.style.display = 'none'; }
  } catch(e) { showToast('Ошибка загрузки', 'var(--accent2)'); }
}

// ── USERS ──────────────────────────────────────────────
async function admLoadUsers(page, q) {
  admCurrentPage = page; admSearchQ = q;
  var list = document.getElementById('adm-users-list');
  list.innerHTML = '<div class="ai-loading">Загружаю...</div>';
  try {
    var data = await _admFetch('users', {page:page, q:q});
    if (!data.ok) return;
    var total = data.total; var per = data.per; var pages = Math.ceil(total/per);
    if (!data.users.length) { list.innerHTML = '<div class="lb-empty">Пусто</div>'; return; }
    list.innerHTML = data.users.map(function(u) {
      var badge = u.premium
        ? '<span class="adm-badge adm-badge-prem">⭐ Premium' + (u.premium_until ? ' до '+u.premium_until : '') + '</span>'
        : '<span class="adm-badge adm-badge-free">Бесплатный</span>';
      return '<div class="adm-user-card" id="adm-user-'+u.id+'">'
        + '<div class="adm-user-row">'
        + '<div><div class="adm-user-name">' + escHtml((u.name||'') + (u.username ? ' @'+u.username : '')) + '</div>'
        + '<div class="adm-user-meta">ID: ' + u.id + ' · 🔥 ' + u.streak + ' дн.' + (u.is_banned?' · 🔴 БАН':'') + '</div></div>'
        + badge + '</div>'
        + '<div class="adm-user-btns">'
        + (u.premium
           ? '<button class="adm-btn adm-btn-unprem" onclick="admSetPremium('+u.id+',false)">Снять Premium</button>'
           : '<button class="adm-btn adm-btn-prem" onclick="admSetPremium('+u.id+',true)">⭐ +30 дней</button>')
        + '<button class="adm-btn" style="background:var(--bg2)" onclick="admUserDetail('+u.id+')">Подробнее</button>'
        + '</div></div>';
    }).join('');
    var pag = document.getElementById('adm-pagination');
    var pi  = document.getElementById('adm-page-info');
    pag.style.display = pages>1 ? 'flex' : 'none';
    if (pi) pi.textContent = 'Стр. '+(page+1)+' / '+pages+' ('+total+' юзеров)';
  } catch(e) { list.innerHTML = '<div class="lb-empty">Ошибка</div>'; }
}

function admSearchUsers() {
  var q = document.getElementById('adm-search-input').value.trim();
  admLoadUsers(0, q);
}

function admUsersPage(dir) {
  admLoadUsers(Math.max(0, admCurrentPage+dir), admSearchQ);
}

async function admSetPremium(uid, give) {
  var days = give ? (parseInt(prompt('Дней Premium:', '30')) || 30) : 0;
  try {
    var data = await _admFetch('set_premium', {user_id:uid, days:days, give:give});
    if (data.ok) {
      showToast(data.message || (give?'Premium выдан':'Premium снят'), 'var(--green)');
      admLoadUsers(admCurrentPage, admSearchQ);
    }
  } catch(e) {}
}

async function admUserDetail(uid) {
  try {
    var res  = await fetch('/api/proxy/api/admin?action=user_detail&id='+uid, {headers:_adminHeaders()});
    var data = await res.json();
    if (!data.ok) return;
    var u = data.user;
    alert(
      'ID: ' + u.id + '\n' +
      '@' + (u.username||'—') + ' / ' + (u.name||'—') + '\n' +
      'Язык: ' + u.lang + ' · Цель: ' + u.goal + '\n' +
      'Норма: ' + u.daily_goal + ' ккал · Вес: ' + (u.weight||'—') + ' кг\n' +
      'Стрик: ' + u.streak + ' дн. · Записей: ' + u.entries_total + '\n' +
      'За неделю: ' + u.entries_week + ' записей · ' + u.achievements + ' ачивок\n' +
      'Рефералов: ' + u.referral_count + '\n' +
      'Premium: ' + (u.premium ? ('до '+u.premium_until) : 'нет')
    );
  } catch(e) {}
}

// ── PAYMENTS ───────────────────────────────────────────
async function admLoadPayments() {
  var list = document.getElementById('adm-payments-list');
  list.innerHTML = '<div class="ai-loading">Загружаю заявки...</div>';
  try {
    var data = await _admFetch('payments');
    if (!data.ok) return;
    if (!data.payments.length) {
      list.innerHTML = '<div class="lb-empty">✅ Нет активных заявок</div>';
      return;
    }
    var planNames = {'1m':'1 мес','3m':'3 мес','12m':'12 мес'};
    var statusNames = {'pending':'⏳ Ожидает скриншота','screenshot_received':'📸 Скриншот получен'};
    list.innerHTML = data.payments.map(function(p) {
      return '<div class="adm-pay-card" id="adm-pay-'+p.id+'">'
        + '<div class="adm-pay-row">'
        + '<div class="adm-pay-name">@' + escHtml(p.username||String(p.user_id)) + ' ' + (p.name||'') + '</div>'
        + '<div style="font-size:12px;color:var(--muted)">' + p.created_at + '</div>'
        + '</div>'
        + '<div style="font-size:13px;margin:4px 0">'
        + '📦 ' + (planNames[p.plan]||p.plan) + ' · ' + p.amount + '₽ · ' + (statusNames[p.status]||p.status)
        + '</div>'
        + (p.screenshot ? '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">📸 Скриншот есть</div>' : '')
        + '<div class="adm-pay-btns">'
        + '<button class="adm-btn adm-btn-confirm" onclick="admConfirmPay('+p.id+')">✅ Подтвердить</button>'
        + '<button class="adm-btn adm-btn-reject"  onclick="admRejectPay('+p.id+')">❌ Отклонить</button>'
        + '</div></div>';
    }).join('');
  } catch(e) { list.innerHTML = '<div class="lb-empty">Ошибка загрузки</div>'; }
}

async function admConfirmPay(payId) {
  showConfirm('Подтвердить оплату #'+payId+'?', async function() {
    try {
      var data = await _admFetch('confirm_payment', {payment_id:payId});
      if (data.ok) {
        showToast('✅ Оплата подтверждена, Premium выдан до '+data.until, 'var(--green)');
        document.getElementById('adm-pay-'+payId).remove();
      }
    } catch(e) {}
  });
}

async function admRejectPay(payId) {
  showConfirm('Отклонить оплату #'+payId+'?', async function() {
    try {
      var data = await _admFetch('reject_payment', {payment_id:payId});
      if (data.ok) {
        showToast('❌ Отклонено', 'var(--accent2)');
        document.getElementById('adm-pay-'+payId).remove();
      }
    } catch(e) {}
  });
}


// Ripple effect on buttons
document.addEventListener('click', function(e) {
  var btn = e.target.closest('button');
  if (!btn || btn.classList.contains('sett-toggle')) return;
  btn.classList.remove('rippling');
  void btn.offsetWidth;
  btn.classList.add('rippling');
  setTimeout(function(){ btn.classList.remove('rippling'); }, 600);
});


// ── Global scope exports ─────────────────────────────────────────
window.openDatePicker=openDatePicker; window.dpPick=dpPick; window.dpClose=dpClose; window.dpRender=dpRender; window.dpPrevMonth=dpPrevMonth; window.dpNextMonth=dpNextMonth; window.dpClose2=dpClose2;
window.editDiaryEntry = editDiaryEntry; window.deditSave = deditSave; window.deditDelete = deditDelete;
window.statAddWeight = statAddWeight; window.calcSearch=calcSearch; window.calcSetWeight=calcSetWeight; window.calcUpdateWeight=calcUpdateWeight; window.calcSelectMeal=calcSelectMeal; window.calcAddItem = calcAddItem;
window.calcSave = calcSave; window.calcClear = calcClear; window.calcQuickAdd = calcQuickAdd;
window.sugarLogAdd = sugarLogAdd; window.mfShowForm = mfShowForm; window.mfHideForm = mfHideForm;
window.mfSave = mfSave; window.mfDelete = mfDelete; window.mfUse = mfUse;
window.mfHideUse = mfHideUse; window.mfUseConfirm = mfUseConfirm;
window.selectPdfDays = selectPdfDays; window.downloadPdf = downloadPdf; window.downloadPdfPreview = downloadPdfPreview;
window.refCopyLink = refCopyLink; window.refShare = refShare;
window.selectPlan = selectPlan; window.premBuyStars = premBuyStars; window.premBuyCard = premBuyCard;
window.toggleFaq = toggleFaq; window.helpOpenBot = helpOpenBot; window.helpOpenSupport = helpOpenSupport;
window.openTgLink = openTgLink; window.admSection = admSection; window.admLoadDash = admLoadDash;
window.admSearchUsers = admSearchUsers; window.admUsersPage = admUsersPage;
window.admSetPremium = admSetPremium; window.admUserDetail = admUserDetail;
window.admConfirmPay = admConfirmPay; window.admRejectPay = admRejectPay;
window.heSearch = heSearch; window.loadLb = loadLb;

// ── Init page exports (needed by switchTab in block 3) ───────────
window.initStatPage     = initStatPage;
window.initCalcPage     = initCalcPage;
window.initDiaryPage    = initDiaryPage;
window.initAiPage       = initAiPage;
window.initMicroPage    = initMicroPage;
window.initLbPage       = initLbPage;
window.initPdfPage      = initPdfPage;
window.initImportPage   = initImportPage;
window.initSettingsPage = initSettingsPage;
window.initPremPage     = initPremPage;
window.initHelpPage     = initHelpPage;
window.initAdminPage    = initAdminPage;
window.initRefPage      = typeof initRefPage !== 'undefined' ? initRefPage : function(){};
window.initWaterPage    = typeof initWaterPage !== 'undefined' ? initWaterPage : function(){};
window.initProgressPage = typeof initProgressPage !== 'undefined' ? initProgressPage : function(){};
window.loadDiary        = loadDiary;
window.loadMyFoods      = loadMyFoods;
window.loadLb           = loadLb;
window.runNutritionist  = runNutritionist;
window.runMealPlan      = runMealPlan;
window.runRecipe        = runRecipe;
window.admLoadDash      = admLoadDash;
window.admLoadUsers     = admLoadUsers;
window.admSearchUsers   = admSearchUsers;
window.admUsersPage     = admUsersPage;
window.admSetPremium    = admSetPremium;
window.admUserDetail    = admUserDetail;
window.admLoadPayments  = admLoadPayments;
window.admConfirmPay    = admConfirmPay;
window.admRejectPay     = admRejectPay;
window.admSection       = admSection;
window.selectPdfDays    = selectPdfDays;
window.downloadPdf      = downloadPdf;
window.refCopyLink      = refCopyLink;
window.refShare         = refShare;
window.selectPlan       = selectPlan;
window.premBuyStars     = premBuyStars;
window.premBuyCard      = premBuyCard;
window.toggleFaq        = toggleFaq;
window.helpOpenBot      = helpOpenBot;
window.helpOpenSupport  = helpOpenSupport;
window.openTgLink       = openTgLink;
window.heSearch         = heSearch;
window.mfUseConfirm     = mfUseConfirm;
window.mfShowForm       = mfShowForm;
window.mfHideForm       = mfHideForm;
window.mfSave           = mfSave;
window.mfDelete         = mfDelete;
window.mfUse            = mfUse;
window.mfHideUse        = mfHideUse;
window.calcSave         = calcSave;
window.calcClear        = calcClear;
window.calcSearch       = calcSearch;
window.calcAddItem      = calcAddItem;
window.calcQuickAdd     = calcQuickAdd;
window.sugarLogAdd      = sugarLogAdd;
window.showConfirm      = showConfirm;
