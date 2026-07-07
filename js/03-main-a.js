setTimeout(function(){ alert('hash=' + location.hash.substring(0,100) + ' | search=' + location.search.substring(0,100)); }, 1000);
// ===== ДНЕВНИК =====

// ────────────────────────────────────────────────────────────────
// XP-бар
// ────────────────────────────────────────────────────────────────
var LEVELS_XP = [0,0,200,500,1000,2000,3500,5500,8000,11000,15000,20000,26000,33000,41000,50000];
var LEVELS_NAME = ['','🌱 Новичок','🥗 Любитель','🍎 Осознанный','💪 Дисциплинированный',
  '🔥 Мотивированный','⚡ Продвинутый','🏃 Атлет','💎 Эксперт','🌟 Мастер',
  '👑 Легенда','🏆 Чемпион','🦁 Воин здоровья','🚀 Суперчеловек','🌍 Посол NutriO','✨ Гуру питания'];

function _renderXpBar(xp, level) {
  xp = xp || 0; level = level || 1;
  var container = document.getElementById('diary-xp-bar');
  if (!container) return;
  var maxLvl = 15;
  var name = LEVELS_NAME[Math.min(level, maxLvl)] || '🌱 Новичок';
  var pct = 0, xpNext = 0;
  if (level < maxLvl) {
    var curBase = LEVELS_XP[level] || 0;
    xpNext = LEVELS_XP[level + 1] || curBase + 1000;
    var xpNeeded = xpNext - curBase;
    var xpInLevel = xp - curBase;
    pct = xpNeeded > 0 ? Math.min(100, Math.round(xpInLevel / xpNeeded * 100)) : 100;
  } else { pct = 100; }

  container.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px">'
    +  '<span style="font-size:13px;font-weight:700;color:var(--text);flex:1">' + name + '</span>'
    +  '<span style="font-size:10px;color:var(--text2);white-space:nowrap">'
    +    (level < maxLvl ? xp + ' / ' + xpNext + ' XP · ' + pct + '%' : '✨ MAX') + '</span>'
    + '</div>'
    + '<div style="height:5px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-top:6px">'
    +   '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--accent),#818cf8);border-radius:3px;transition:width .5s ease"></div>'
    + '</div>';
}
window._renderXpBar = _renderXpBar;

// ────────────────────────────────────────────────────────────────
// Photo quota UI (Free: 5 фото/день, Premium: безлимит)
// ────────────────────────────────────────────────────────────────
function updatePhotoQuotaUI(quota) {
  if (!quota) return;
  var el = document.getElementById('scan-quota');
  if (!el) return;
  if (quota.unlimited) {
    el.textContent = '⭐ Безлимит фото (Premium)';
    el.style.color = 'var(--green)';
    el.style.display = 'block';
    return;
  }
  var left = Math.max(0, (quota.limit || 5) - (quota.used || 0));
  el.textContent = '📷 Сегодня: ' + (quota.used || 0) + '/' + (quota.limit || 5) +
                   ' фото · осталось ' + left;
  el.style.color = left <= 1 ? 'var(--accent2)' : 'var(--text2)';
  el.style.display = 'block';
}

function showPhotoLimitModal() {
  var existing = document.getElementById('nutrio-photolim-modal');
  if (existing) document.body.removeChild(existing);
  var overlay = document.createElement('div');
  overlay.id = 'nutrio-photolim-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px';
  overlay.innerHTML =
    '<div style="background:var(--surface);border-radius:18px;padding:24px;max-width:340px;text-align:center;box-shadow:0 16px 50px rgba(0,0,0,.5)">' +
      '<div style="font-size:48px;margin-bottom:10px">📸</div>' +
      '<div style="font-weight:800;font-size:18px;margin-bottom:8px">Лимит на сегодня</div>' +
      '<div style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:20px">' +
        'Ты использовал все 5 распознаваний фото на сегодня. Лимит обновится завтра.<br><br>' +
        'С <b>Premium</b> распознавание без ограничений + другие бонусы.' +
      '</div>' +
      '<button onclick="switchTab(\'prempage\');document.body.removeChild(this.parentNode.parentNode)" style="width:100%;padding:13px;background:var(--accent);color:#fff;border:none;border-radius:11px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px">⭐ Открыть Premium</button>' +
      '<button onclick="document.body.removeChild(this.parentNode.parentNode)" style="width:100%;padding:11px;background:var(--surface2);color:var(--text);border:none;border-radius:11px;font:inherit;font-size:13px;font-weight:600;cursor:pointer">Понял</button>' +
    '</div>';
  document.body.appendChild(overlay);
}
window.updatePhotoQuotaUI = updatePhotoQuotaUI;
window.showPhotoLimitModal = showPhotoLimitModal;

function getUserId() {
  var tg = window.Telegram && window.Telegram.WebApp;
  var id = tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id;
  if (!id) {
    try {
      var p = new URLSearchParams(window.location.search);
      id = p.get('user_id');
    } catch(e) {}
  }
  // Сохраняем для переиспользования — без этого дневник не грузится при первом открытии
  if (id) {
    try { localStorage.setItem('nutrio_user_id', String(id)); } catch(e) {}
  } else {
    try { id = localStorage.getItem('nutrio_user_id'); } catch(e) {}
  }
  return id || 0;
}

// Автоматически определяем и сохраняем timezone с устройства юзера
// Вызывается один раз при загрузке — юзер ничего не делает вручную
function _syncTimezone() {
  try {
    var uid = getUserId();
    if (!uid) return;
    var tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // Вычисляем offset в часах (учитываем летнее время)
    var offsetMin = -new Date().getTimezoneOffset();
    var offsetH   = Math.round(offsetMin / 60 * 2) / 2; // с шагом 0.5 для India/Иран
    var body = {user_id: parseInt(uid), tz_name: tzName, tz_offset: offsetH};
    var initData = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData;
    if (initData) body.initData = initData;
    // fire-and-forget: не ждём ответа, не блокируем загрузку
    fetch('/api/proxy/api/tz', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Telegram-User-Id': String(uid)},
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(function(){});
  } catch(e) {}
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
  // Перед загрузкой дневника убедимся что юзер прошёл онбординг в боте.
  // Если нет — показываем блокирующий экран и не даём пользоваться приложением.
  checkOnboardingAndLoad();
}

async function refreshPhotoQuota() {
  try {
    var data = await apiGet('/api/settings');
    if (data && data.ok && typeof data.photo_today_used === 'number') {
      updatePhotoQuotaUI({
        used: data.photo_today_used,
        limit: data.photo_today_limit || 5,
        unlimited: false,
      });
    }
  } catch(e) {}
}
window.refreshPhotoQuota = refreshPhotoQuota;

async function checkOnboardingAndLoad() {
  // Отправляем timezone автоматически — юзер ничего не делает
  _syncTimezone();
  try {
    var data = await apiGet('/api/settings');
    if (data && data.ok && data.is_onboarded === false) {
      showOnboardingBlocker();
      return;
    }
    // Подтянем счётчик фото при загрузке (для UI на странице сканера)
    if (data && data.ok && typeof data.photo_today_used === 'number') {
      updatePhotoQuotaUI({
        used: data.photo_today_used,
        limit: data.photo_today_limit || 5,
        unlimited: false,
      });
    }
  } catch(e) { /* при ошибке всё равно пробуем загрузить */ }
  loadDiary();
}

function showOnboardingBlocker() {
  if (document.getElementById('nutrio-onb-blocker')) return;
  var overlay = document.createElement('div');
  overlay.id = 'nutrio-onb-blocker';
  overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg);z-index:99998;display:flex;align-items:center;justify-content:center;padding:24px';
  overlay.innerHTML =
    '<div style="max-width:360px;text-align:center">' +
      '<div style="font-size:64px;margin-bottom:14px">🥗</div>' +
      '<div style="font-weight:800;font-size:22px;margin-bottom:10px">Сначала зарегистрируйся</div>' +
      '<div style="font-size:14px;color:var(--text2);line-height:1.5;margin-bottom:22px">' +
        'Чтобы приложение работало корректно, пройди короткую регистрацию в боте: укажи рост, вес и цель. Это займёт минуту.' +
      '</div>' +
      '<button onclick="_startOnboardingInBot()"' +
      ' style="width:100%;padding:14px;background:var(--accent);color:#fff;border:none;border-radius:12px;font:inherit;font-size:15px;font-weight:700;cursor:pointer">' +
        '🤖 Открыть бота' +
      '</button>' +
    '</div>';
  document.body.appendChild(overlay);
}
function _startOnboardingInBot() {
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openTelegramLink) tg.openTelegramLink('https://t.me/CaloriePilotAI_Bot');
  } catch(e){}
  setTimeout(function(){
    try { // minimize() сворачивает миниапп вместо закрытия (Bot API 8.0+);
        // если недоступен — просто не закрываем, приложение остаётся открытым.
        if (window.Telegram && Telegram.WebApp) {
          var tgwa = Telegram.WebApp;
          if (tgwa.minimize) tgwa.minimize();
          // если minimize нет — не делаем ничего, юзер сам вернётся
        } } catch(e){}
  }, 300);
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
    // Обновим виджет воды
    if (data.water_today !== undefined) {
      _updateDiaryWaterWidget(data.water_today, data.water_goal || 2000);
    }
  } catch(e) {
    showToast('Ошибка загрузки', 'var(--accent2)');
  }
}

function renderDiary(data) {
  // Прогресс-бар
  var eaten    = data.total.calories;
  var burned   = data.kcal_burned_today || 0;
  var baseGoal = data.daily_goal || 2000;
  // Если включена настройка "учитывать тренировки в норме" — прибавляем сожжённые
  var exerciseInGoal = data.exercise_in_goal || window._exerciseInGoal || 0;
  var goal     = exerciseInGoal ? (baseGoal + burned) : baseGoal;
  var pct      = Math.min(100, Math.round(eaten / goal * 100));
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
  // Показываем подсказку про тренировку если есть сожжённые калории
  var burnedHint = document.getElementById('diary-burned-hint');
  if (burnedHint) {
    if (burned > 0) {
      var ru = (window._lang || 'ru') !== 'en';
      burnedHint.textContent = ru
        ? ('🏃 Сожжено: ' + burned + ' ккал от тренировки')
        : ('🏃 Burned: ' + burned + ' kcal from workout');
      burnedHint.style.display = '';
    } else {
      burnedHint.style.display = 'none';
    }
  }
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
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
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
  var kb  = document.getElementById('calc-mode-kbzu');
  var he  = document.getElementById('calc-mode-he');
  var rst = document.getElementById('calc-mode-rest');
  [['kbzu',kb],['he',he],['rest',rst]].forEach(function(p){
    if (p[1]) {
      var active = mode === p[0];
      p[1].style.background = active ? 'var(--accent)' : 'transparent';
      p[1].style.color      = active ? '#fff' : 'var(--text2)';
    }
  });
  var ks = document.getElementById('calc-kbzu-section');
  var hs = document.getElementById('calc-he-section');
  var rs = document.getElementById('calc-rest-section');
  if (ks) ks.style.display = mode==='kbzu' ? 'block':'none';
  if (hs) hs.style.display = mode==='he'   ? 'block':'none';
  if (rs) rs.style.display = mode==='rest' ? 'block':'none';
  if (mode==='he')   loadHeDailyData();
  if (mode==='rest') restShowPopular();
}

// ════ РЕСТОРАННЫЙ ПОИСК ════
var _restSearchTimeout = null;

async function restSearch(q) {
  clearTimeout(_restSearchTimeout);
  q = (q||'').trim().toLowerCase();
  if (q.length < 1) { restShowPopular(); return; }
  _restSearchTimeout = setTimeout(async function(){
    try {
      var d = await apiGet('/api/restaurants/search', {q:q, limit:12});
      _restRender(d && d.results || []);
    } catch(e) { _restRender([]); }
  }, 250);
}
window.restSearch = restSearch;

async function restSearchBrand(brand) {
  var inp = document.getElementById('rest-search-input');
  if (inp) inp.value = brand;
  try {
    var d = await apiGet('/api/restaurants/search', {q:brand.toLowerCase(), limit:15});
    _restRender(d && d.results || []);
  } catch(e) { _restRender([]); }
}
window.restSearchBrand = restSearchBrand;

function restShowPopular() {
  // Показываем популярные без запроса
  var popular = [
    {name:'биг мак',    brand:"McDonald's",  calories:257, protein:13, fat:13, carbs:24},
    {name:'кфс твистер',brand:'KFC',          calories:218, protein:11, fat:11, carbs:19},
    {name:'воппер',     brand:'Burger King',  calories:247, protein:11, fat:14, carbs:22},
    {name:'додо пепперони', brand:'Додо Пицца', calories:291, protein:13, fat:13, carbs:32},
    {name:'ролл калифорния',brand:'Суши',     calories:125, protein:5,  fat:4,  carbs:17},
    {name:'шаурма',     brand:'Шаурма',       calories:220, protein:12, fat:9,  carbs:23},
  ];
  _restRender(popular);
}
window.restShowPopular = restShowPopular;

function _restRender(items) {
  var el = document.getElementById('rest-results');
  if (!el) return;
  var ru = (navigator.language||'ru').startsWith('ru');
  if (!items || !items.length) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">'
      + '<div style="font-size:32px;margin-bottom:8px">🔍</div>'
      + '<div>' + (ru ? 'Не найдено. Попробуй другой запрос.' : 'Not found. Try another query.') + '</div>'
      + '</div>';
    return;
  }
  el.innerHTML = items.map(function(r){
    var rawName = (r.name||'');
    // Правим известные бренды в названии
    var name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    name = name.replace(/\bкфс\b/gi,'KFC').replace(/\bkfc\b/gi,'KFC')
               .replace(/\bмакдоналдс\b/gi,"McDonald's").replace(/\bmcd\b/gi,"McDonald's")
               .replace(/\bбк\b/gi,'BK').replace(/\bбургер кинг\b/gi,'Burger King')
               .replace(/\bдодо\b/gi,'Додо');
    var brand = r.brand || '';
    // Для добавления — строим payload с весом порции (100г стандарт)
    var payload = JSON.stringify({name:r.name,cal:r.calories,prot:r.protein,fat:r.fat,carbs:r.carbs}).replace(/"/g,'&quot;');
    return '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:14px;padding:12px 14px">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
      +   '<div style="flex:1;min-width:0">'
      +     '<div style="font-weight:700;font-size:14px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(name) + '</div>'
      +     (brand ? '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-top:1px">' + escHtml(brand) + '</div>' : '')
      +   '</div>'
      +   '<div style="text-align:right;flex-shrink:0">'
      +     '<div style="font-size:17px;font-weight:800;color:var(--accent)">' + r.calories + '</div>'
      +     '<div style="font-size:10px;color:var(--text2)">ккал/100г</div>'
      +   '</div>'
      + '</div>'
      + '<div style="display:flex;gap:8px;font-size:11px;color:var(--text2);margin-bottom:10px">'
      +   '<span>Б <b>' + r.protein + '</b></span>'
      +   '<span>Ж <b>' + r.fat + '</b></span>'
      +   '<span>У <b>' + r.carbs + '</b></span>'
      +   '<span style="opacity:.6">г/100г</span>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">'
      +   [['завтрак','🌅'],['обед','🌞'],['ужин','🌙'],['перекус','🍎']].map(function(pair){
            var mname = pair[0]; var icon = pair[1];
            return '<button onclick="restAddToMeal(' + payload.replace(/'/g,"&#39;") + ',\'' + mname + '\')" '
              + 'style="padding:9px 2px;background:var(--surface2);border:1px solid var(--glass-border);border-radius:9px;font:inherit;font-size:10px;font-weight:600;color:var(--text);cursor:pointer;min-height:38px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px">'
              + icon + '<br>' + mname
              + '</button>';
          }).join('')
      + '</div>'
      + '</div>';
  }).join('');
}

async function restAddToMeal(payloadStr, meal) {
  var p;
  try { p = typeof payloadStr === 'string' ? JSON.parse(payloadStr.replace(/&quot;/g,'"')) : payloadStr; } catch(e){ return; }
  try {
    var d = await apiPost('/api/manual', {
      food_name: p.name, weight: 100,
      calories: p.cal, protein: p.prot, fat: p.fat, carbs: p.carbs,
      meal_type: meal,
    });
    if (d && d.ok) {
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
      showToast('✅ Добавлено в ' + meal, 'var(--green)');
      // Предупреждение об аномалии КБЖУ
      if (d.warning) {
        setTimeout(function() {
          showToast('⚠️ ' + d.warning, '#f59e0b', 5000);
        }, 1500);
      }
    } else { showToast('Ошибка', 'var(--accent2)'); }
  } catch(e) { showToast('Ошибка соединения', 'var(--accent2)'); }
}
window.restAddToMeal = restAddToMeal;

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

// Сортировка для Моих продуктов
var mfSortMode = 'recent';
function mfSetSort(mode) {
  mfSortMode = mode;
  // Подсветка активной кнопки
  ['recent','name','cal'].forEach(function(k){
    var id = 'mf-sort-' + k;
    var el = document.getElementById(id);
    if (!el) return;
    var isActive = (k === mode) || (k === 'cal' && mode === 'calories');
    el.style.background = isActive ? 'var(--accent)' : 'var(--surface)';
    el.style.color = isActive ? '#fff' : 'var(--text)';
    el.style.border = isActive ? 'none' : '1px solid var(--glass-border)';
  });
  var filter = (document.getElementById('mf-search') || {}).value || '';
  mfRender(filter);
}
window.mfSetSort = mfSetSort;

function mfRender(filter) {
  var list = document.getElementById('mf-list');
  if (!list) return;
  var items = filter ? mfData.filter(function(f) {
    return f.name.toLowerCase().includes(filter.toLowerCase());
  }) : mfData.slice();

  // Сортировка
  if (mfSortMode === 'name') {
    items.sort(function(a, b){ return (a.name||'').localeCompare(b.name||''); });
  } else if (mfSortMode === 'calories') {
    items.sort(function(a, b){ return (b.calories||0) - (a.calories||0); });
  }
  // 'recent' — по умолчанию (как в БД)

  if (!items.length) {
    list.innerHTML = '<div class="diary-empty"><div class="diary-empty-icon">⭐</div>'
      + '<div>' + (filter ? 'Ничего не найдено' : 'Нет продуктов') + '</div></div>';
    return;
  }
  list.innerHTML = items.map(function(f) {
    var fname = (f.name||'').charAt(0).toUpperCase()+(f.name||'').slice(1);
    return ''
      + '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:14px;padding:14px;margin-bottom:10px">'
      +   '<div style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:8px">' + escHtml(fname) + '</div>'
      +   '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">'
      +     '<div style="background:rgba(108,99,255,.10);border-radius:10px;padding:8px 4px;text-align:center">'
      +       '<div style="font-size:16px;font-weight:800;color:var(--accent)">' + f.calories + '</div>'
      +       '<div style="font-size:10px;color:var(--text2);font-weight:600">🔥 ккал</div>'
      +     '</div>'
      +     '<div style="background:rgba(34,197,94,.10);border-radius:10px;padding:8px 4px;text-align:center">'
      +       '<div style="font-size:16px;font-weight:800;color:var(--green)">' + f.protein + '</div>'
      +       '<div style="font-size:10px;color:var(--text2);font-weight:600">Белки</div>'
      +     '</div>'
      +     '<div style="background:rgba(234,88,12,.10);border-radius:10px;padding:8px 4px;text-align:center">'
      +       '<div style="font-size:16px;font-weight:800;color:#ea580c">' + f.fat + '</div>'
      +       '<div style="font-size:10px;color:var(--text2);font-weight:600">Жиры</div>'
      +     '</div>'
      +     '<div style="background:rgba(37,99,235,.10);border-radius:10px;padding:8px 4px;text-align:center">'
      +       '<div style="font-size:16px;font-weight:800;color:#2563eb">' + f.carbs + '</div>'
      +       '<div style="font-size:10px;color:var(--text2);font-weight:600">Углев.</div>'
      +     '</div>'
      +   '</div>'
      +   '<div style="font-size:10px;color:var(--text2);text-align:center;margin-bottom:10px">указано на 100&nbsp;г</div>'
      +   '<button onclick="mfUse(' + f.id + ')" style="width:100%;padding:12px;background:var(--green);color:#fff;border:none;border-radius:11px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;touch-action:manipulation;min-height:44px;margin-bottom:6px">+ Добавить в дневник</button>'
      +   '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px">'
      +     '<button onclick="mfShowForm(' + f.id + ')" style="padding:9px 4px;background:var(--surface2);color:var(--text);border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;touch-action:manipulation;min-height:40px">✏️ Изменить</button>'
      +     '<button onclick="mfDuplicate(' + f.id + ')" style="padding:9px 4px;background:var(--surface2);color:var(--text);border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;touch-action:manipulation;min-height:40px">📋 Дубль</button>'
      +     '<button onclick="mfDelete(' + f.id + ')" style="padding:9px 4px;background:rgba(219,39,119,.12);color:var(--accent2);border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;touch-action:manipulation;min-height:40px">🗑 Удалить</button>'
      +   '</div>'
      + '</div>';
  }).join('');
}

// Дублирование продукта: открывает форму с заполненными полями (имя +" копия")
function mfDuplicate(id) {
  var f = mfData.find(function(x){ return x.id === id; });
  if (!f) return;
  mfEditId = null;  // создаём новый
  var overlay = document.getElementById('mf-form-overlay');
  var title   = document.getElementById('mf-form-title');
  var hint    = document.getElementById('mf-form-hint');
  if (title) title.textContent = '📋 Дублировать продукт';
  if (hint)  hint.textContent  = 'Скопировано из «' + f.name + '». Поправь имя и значения если нужно.';
  document.getElementById('mf-f-name').value = f.name + ' (копия)';
  document.getElementById('mf-f-cal').value  = f.calories;
  document.getElementById('mf-f-prot').value = f.protein;
  document.getElementById('mf-f-fat').value  = f.fat;
  document.getElementById('mf-f-carb').value = f.carbs;
  if (overlay) overlay.style.display = 'flex';
}
window.mfDuplicate = mfDuplicate;

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
  if (data.xp !== undefined) _renderXpBar(data.xp, data.level || 1);

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
        + (((typeof i18n !== 'undefined' && (i18n._lang === 'ru' || !i18n._lang)) || navigator.language.startsWith('ru'))
            ? '<div style="margin-top:8px"><b>Российские продукты</b> в локальной базе сейчас имеют только КБЖУ. Мы постепенно расширяем покрытие — спасибо за терпение.</div>' : '')
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
var _pdfIsPremium = false;

async function initPdfPage() {
  // При открытии страницы PDF проверяем премиум-статус и блокируем недоступные опции.
  try {
    var data = await apiGet('/api/settings');
    _pdfIsPremium = !!(data && data.is_premium);
  } catch(e) { _pdfIsPremium = false; }

  ['pdf-opt-30','pdf-opt-90'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    if (_pdfIsPremium) {
      el.classList.remove('locked');
      el.style.opacity = '';
      el.style.cursor = 'pointer';
    } else {
      el.classList.add('locked');
      el.style.opacity = '0.45';
      el.style.cursor = 'not-allowed';
    }
  });
  // Если выбрана недоступная опция — сбрасываем на 7
  if (!_pdfIsPremium && pdfDays > 7) {
    var opt7 = document.getElementById('pdf-opt-7');
    if (opt7) selectPdfDays(7, opt7);
  }
}

function selectPdfDays(days, el) {
  // Блокируем выбор премиум-опций для не-премиума
  if (days > 7 && !_pdfIsPremium) {
    if (typeof showToast === 'function') {
      showToast('Доступно с Premium. Нажми «Пример Premium» чтобы посмотреть.', 'var(--accent2)');
    }
    return;
  }
  pdfDays = days;
  document.querySelectorAll('.pdf-option-card').forEach(function(c) { c.classList.remove('selected'); });
  if (el) el.classList.add('selected');
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
  // Проверяем по расширению или MIME типу — на Android может не быть .csv
  var name = (file.name || '').toLowerCase();
  var mime = (file.type || '').toLowerCase();
  var isText = name.endsWith('.csv') || name.endsWith('.txt') ||
               mime.includes('csv') || mime.includes('text') ||
               mime.includes('excel') || mime === '';
  if (!isText) { showToast('Выбери CSV файл', 'var(--accent2)'); return; }
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
  // Показываем загрузку, прячем контент
  var loadEl = document.getElementById('sett-loading');
  var contEl = document.getElementById('sett-content');
  if (loadEl) loadEl.style.display = 'block';
  if (contEl) contEl.style.display = 'none';
  try {
    var data = await apiGet('/api/settings');
    if (!data.ok) { showToast('Настройки не загружены', 'var(--accent2)'); return; }
    settData = data;

    document.getElementById('sett-kcal').value   = data.daily_goal || 2000;
    // Вода — авторасчёт если water_goal_custom = 0
    var waterAutoOn = (data.water_goal_custom === 0);
    var waterAutoBtn = document.getElementById('sett-water-auto-toggle');
    var waterInp     = document.getElementById('sett-water');
    var waterHint    = document.getElementById('sett-water-auto-hint');
    if (waterAutoOn) {
      if (waterAutoBtn) waterAutoBtn.className = 'sett-toggle on';
      if (waterInp)  { waterInp.value = data.water_goal_auto || 2000; waterInp.disabled = true; waterInp.style.opacity = '0.4'; }
      if (waterHint) waterHint.style.display = 'block';
    } else {
      if (waterAutoBtn) waterAutoBtn.className = 'sett-toggle';
      if (waterInp)  { waterInp.value = data.water_goal_custom || data.water_goal || 2000; waterInp.disabled = false; waterInp.style.opacity = '1'; }
      if (waterHint) waterHint.style.display = 'none';
    }
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
    // Данные загружены — показываем контент
    // exercise_in_goal toggle
    window._exerciseInGoal = data.exercise_in_goal || 0;
    var exToggle = document.getElementById('sett-exercise-goal-toggle');
    if (exToggle) exToggle.className = 'sett-toggle' + (data.exercise_in_goal ? ' on' : '');
    if (loadEl) loadEl.style.display = 'none';
    if (contEl) contEl.style.display = 'block';
  } catch(e) {
    if (loadEl) loadEl.style.display = 'none';
    if (contEl) contEl.style.display = 'block';
  }
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

function toggleWaterAuto() {
  var btn  = document.getElementById('sett-water-auto-toggle');
  var inp  = document.getElementById('sett-water');
  var hint = document.getElementById('sett-water-auto-hint');
  if (!btn) return;
  var isOn = btn.classList.contains('on');
  btn.className = 'sett-toggle' + (isOn ? '' : ' on');
  if (!isOn) {
    // Включаем авто — прячем поле ввода, показываем подсказку
    inp.style.opacity = '0.4';
    inp.disabled = true;
    if (hint) hint.style.display = 'block';
    // Сохраняем 0 = авторасчёт
    apiPost('/api/settings', {water_goal: 0}).catch(function(){});
  } else {
    // Выключаем авто — показываем поле ввода
    inp.style.opacity = '1';
    inp.disabled = false;
    if (hint) hint.style.display = 'none';
  }
}
window.toggleWaterAuto = toggleWaterAuto;

function toggleExerciseInGoal() {
  var btn = document.getElementById('sett-exercise-goal-toggle');
  if (!btn) return;
  var isOn = btn.classList.contains('on');
  btn.className = 'sett-toggle' + (isOn ? '' : ' on');
  window._exerciseInGoal = isOn ? 0 : 1;
  // Сохраняем сразу
  apiPost('/api/settings', {exercise_in_goal: window._exerciseInGoal})
    .then(function(d) {
      if (d && d.ok) showToast(window._exerciseInGoal ? '🏃 Тренировки учитываются' : 'Тренировки не учитываются', 'var(--accent)');
    }).catch(function(){});
}
window.toggleExerciseInGoal = toggleExerciseInGoal;

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
  var heightEl = document.getElementById('sett-height');
  var exGoalToggle = document.getElementById('sett-exercise-goal-toggle');
  var body = {
    user_id:            parseInt(userId),
    daily_goal:         parseInt(document.getElementById('sett-kcal').value)  || 2000,
    water_goal:         parseInt(document.getElementById('sett-water').value) || 2000,
    food_reminder_time: foodToggle  && foodSel  ? parseInt(foodSel)  : null,
    water_reminder_time: waterToggle && waterSel ? parseInt(waterSel) : null,
    goal:     goalSel2 ? goalSel2.value : undefined,
    language: langSel2 ? langSel2.value : undefined,
    timezone_offset: tzSel2 ? parseInt(tzSel2.value) : undefined,
    exercise_in_goal: exGoalToggle && exGoalToggle.classList.contains('on') ? 1 : 0,
  };
  var w = document.getElementById('sett-weight').value;
  if (w) body.weight = parseFloat(w);
  if (heightEl && heightEl.value) body.height = parseInt(heightEl.value);

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
    if (!data || !data.ok) {
      // Попробуем ещё раз через 1 секунду
      setTimeout(async function(){
        try {
          var data2 = await apiGet('/api/settings');
          if (data2 && data2.ok) { initPremPage(); }
          else { showToast('Не удалось загрузить. Перезайди в раздел.', 'var(--accent2)'); }
        } catch(e) {}
      }, 1000);
      return;
    }

    var card  = document.getElementById('prem-status-card');
    var icon  = document.getElementById('prem-icon');
    var title = document.getElementById('prem-title');
    var sub   = document.getElementById('prem-sub');
    var buySect = document.getElementById('prem-buy-section');

    if (data.is_premium) {
      var tierNames = {basic:'Basic', standard:'Standard', premium:'Premium'};
      var tierName  = tierNames[data.tier] || 'Premium';
      var tierIcons = {basic:'📦', standard:'⭐', premium:'👑'};
      var tierClass = ['basic','standard','premium'].includes(data.tier) ? data.tier : 'premium';
      if (card)  card.className  = 'prem-status-card ' + tierClass;
      if (icon)  icon.textContent  = tierIcons[data.tier] || '⭐';
      if (title) title.textContent = tierName + ' активен';
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
  // Для t.me/... ссылок используем openTelegramLink — он открывает чат прямо в Telegram
  // и автоматически сворачивает Mini App (не закрывает). Юзер может вернуться обратно.
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
    else if (tg && tg.openLink) tg.openLink(url);
    else window.open(url, '_blank');
  } catch(e) { window.open(url, '_blank'); }
}

function premBuyCard() {
  var url = 'https://t.me/CaloriePilotAI_Bot?start=pay_' + selectedPlan;
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.openTelegramLink) tg.openTelegramLink(url);
    else if (tg && tg.openLink) tg.openLink(url);
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
    if (tg) {
      // Для t.me ссылок используем openTelegramLink (закрывает WebApp)
      if (url.includes('t.me') && tg.openTelegramLink) {
        tg.openTelegramLink(url);
      } else if (tg.openLink) {
        tg.openLink(url, {try_instant_view: false});
      } else {
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
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
  admLoadDashV2();
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
  ['dash','tickets','users','payments','revenue','broadcast','notif','settings','foodcand','admstats'].forEach(function(s) {
    var btn = document.getElementById('adm-btn-' + s);
    var sec = document.getElementById('adm-section-' + s);
    if (btn) btn.className = 'adm-nav-btn' + (s===name?' active':'');
    if (sec) sec.className = 'adm-section' + (s===name?' active':'');
  });
  if (name==='dash')     admLoadDashV2();
  if (name==='tickets')  admLoadTickets('');
  if (name==='users')    admLoadUsers(0,'');
  if (name==='payments') admLoadPayments();
  if (name==='revenue')  admLoadRevenue();
  if (name==='broadcast') { /* уже есть UI */ }
  if (name==='notif')     admLoadNotifSettings();
  if (name==='admstats')  admLoadStats();
  if (name==='settings')  admSettingsLoad();
  if (name==='foodcand')  admLoadFoodCandidates();
}

// ════════════════════════════════════════════════════════
// ПАКЕТ 2: ТИКЕТЫ
// ════════════════════════════════════════════════════════
var admTicketStatus = '';  // '' | new | replied | closed

async function admLoadTickets(status) {
  if (status !== undefined) admTicketStatus = status;
  var list = document.getElementById('adm-tickets-list');
  if (!list) return;
  list.innerHTML = '<div class="ai-loading">Загружаю тикеты...</div>';
  try {
    var url = '/api/proxy/api/admin?action=tickets' + (admTicketStatus ? '&status='+admTicketStatus : '');
    var r = await fetch(url, {headers: _adminHeaders()});
    var d = await r.json();
    if (!d.ok) { list.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка</div>'; return; }
    if (!d.tickets || !d.tickets.length) {
      list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)">'
        + '<div style="font-size:40px;margin-bottom:10px">📭</div>'
        + '<div>Нет тикетов в этом статусе</div></div>';
      return;
    }
    list.innerHTML = d.tickets.map(function(t){
      var statusBadge = t.status === 'new' ?
        '<span style="background:var(--accent2);color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700">НОВЫЙ</span>' :
        t.status === 'replied' ?
        '<span style="background:var(--green);color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700">ОТВЕЧЕН</span>' :
        '<span style="background:var(--surface2);color:var(--text2);padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700">ЗАКРЫТ</span>';
      var dateStr = t.created_at ? new Date(t.created_at).toLocaleString('ru-RU', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '';
      return '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:14px;margin-bottom:10px">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
        +   '<div style="font-weight:700;font-size:14px">#' + t.id + '</div>'
        +   statusBadge
        +   '<div style="margin-left:auto;font-size:11px;color:var(--text2)">' + dateStr + '</div>'
        + '</div>'
        + '<div style="font-size:12px;color:var(--text2);margin-bottom:8px">'
        +   '👤 ' + escHtml(t.first_name||'—') + ' '
        +   (t.username ? '@' + escHtml(t.username) : '')
        +   ' · <span style="opacity:.7">id=' + t.telegram_id + '</span>'
        + '</div>'
        + '<div style="background:var(--surface2);border-radius:8px;padding:10px;font-size:13px;line-height:1.5;color:var(--text);margin-bottom:10px;white-space:pre-wrap;word-wrap:break-word">' + escHtml(t.message) + '</div>'
        + (t.admin_reply ? '<div style="background:rgba(22,163,74,.08);border-radius:8px;padding:10px;font-size:12px;color:var(--text2);margin-bottom:10px"><b style="color:var(--green)">📩 Ответ:</b> ' + escHtml(t.admin_reply) + '</div>' : '')
        + '<div style="display:flex;gap:6px">'
        +   '<button onclick="admTicketReply(' + t.telegram_id + ',' + t.id + ')" style="flex:1;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:40px">📩 Ответить через бота</button>'
        +   (t.status !== 'closed' ? '<button onclick="admTicketClose(' + t.id + ')" style="padding:10px 14px;background:var(--surface2);color:var(--text);border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:40px">✅ Закрыть</button>' : '')
        + '</div>'
        + '</div>';
    }).join('');
  } catch(e) {
    list.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка загрузки</div>';
  }
}
window.admLoadTickets = admLoadTickets;

async function admTicketReply(userId, ticketId) {
  // Открываем чат с юзером в Telegram. Так как через Mini App нельзя написать
  // напрямую от имени бота — даём админу простую кнопку чтобы он использовал
  // /tickets или ответ через клавиатуру в чате.
  var msg = 'Чтобы ответить — открой чат с ботом и используй кнопку «📩 Ответить» под тикетом #' + ticketId + ', либо команду /tickets.';
  showToast(msg, 'var(--accent)');
}
window.admTicketReply = admTicketReply;

// ════════════════════════════════════════════════════════
// ПАКЕТ 2: ФИНАНСЫ
// ════════════════════════════════════════════════════════
async function admLoadRevenue() {
  var box = document.getElementById('adm-revenue-content');
  if (!box) return;
  box.innerHTML = '<div class="ai-loading">Загружаю...</div>';
  try {
    var r = await fetch('/api/proxy/api/admin?action=revenue', {headers:_adminHeaders()});
    var d = await r.json();
    if (!d.ok) { box.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка</div>'; return; }
    function rev(label, val, sub, color) {
      return '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:14px;margin-bottom:10px">'
        + '<div style="font-size:11px;color:var(--text2);font-weight:700;letter-spacing:.5px;margin-bottom:4px">' + label + '</div>'
        + '<div style="font-size:26px;font-weight:800;color:' + (color||'var(--accent)') + '">' + val + '</div>'
        + (sub ? '<div style="font-size:11px;color:var(--text2);margin-top:2px">' + sub + '</div>' : '')
        + '</div>';
    }
    box.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'
      +   '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:12px;text-align:center">'
      +     '<div style="font-size:11px;color:var(--text2);font-weight:700">📅 СЕГОДНЯ</div>'
      +     '<div style="font-size:22px;font-weight:800;color:var(--green);margin-top:4px">' + (d.cards_today_rub||0).toLocaleString('ru-RU') + ' ₽</div>'
      +   '</div>'
      +   '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:12px;text-align:center">'
      +     '<div style="font-size:11px;color:var(--text2);font-weight:700">📅 НЕДЕЛЯ</div>'
      +     '<div style="font-size:22px;font-weight:800;color:var(--green);margin-top:4px">' + (d.cards_week_rub||0).toLocaleString('ru-RU') + ' ₽</div>'
      +   '</div>'
      + '</div>'
      + rev('💰 ВЫРУЧКА ЗА МЕСЯЦ', (d.cards_month_rub||0).toLocaleString('ru-RU') + ' ₽', 'Подтверждённые карточные оплаты', 'var(--green)')
      + rev('📊 ОЦЕНОЧНЫЙ MRR', (d.estimated_mrr_rub||0).toLocaleString('ru-RU') + ' ₽', 'На основе активных Premium × 449₽', 'var(--accent)')
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'
      +   '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:12px;text-align:center">'
      +     '<div style="font-size:11px;color:var(--text2);font-weight:700">⭐ PREMIUM ЮЗЕРОВ</div>'
      +     '<div style="font-size:24px;font-weight:800;color:#facc15;margin-top:4px">' + (d.active_premium||0) + '</div>'
      +   '</div>'
      +   '<div style="background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:12px;text-align:center">'
      +     '<div style="font-size:11px;color:var(--text2);font-weight:700">⏳ ОЖИДАЮТ ОПЛАТЫ</div>'
      +     '<div style="font-size:24px;font-weight:800;color:var(--accent2);margin-top:4px">' + (d.pending_payments||0) + '</div>'
      +   '</div>'
      + '</div>'
      + '<button class="ai-action-btn" style="margin-top:12px;width:100%" onclick="admLoadRevenue()">🔄 Обновить</button>';
  } catch(e) {
    box.innerHTML = '<div style="color:var(--accent2);padding:12px">Ошибка загрузки</div>';
  }
}
window.admLoadRevenue = admLoadRevenue;

// ════════════════════════════════════════════════════════
// ПАКЕТ 2: ПРОФИЛЬ ЮЗЕРА с действиями
// ════════════════════════════════════════════════════════
async function admUserProfile(userId) {
  var existing = document.getElementById('adm-userprof-modal');
  if (existing) document.body.removeChild(existing);
  var overlay = document.createElement('div');
  overlay.id = 'adm-userprof-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:99999;display:flex;align-items:flex-end;justify-content:center;padding:0';
  overlay.innerHTML =
    '<div style="background:var(--surface);border-radius:18px 18px 0 0;padding:20px 18px 28px;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;box-shadow:0 -8px 30px rgba(0,0,0,.5)">'
    + '<div style="width:36px;height:4px;background:var(--text2);opacity:.35;border-radius:2px;margin:0 auto 14px"></div>'
    + '<div id="adm-userprof-body"><div class="ai-loading">Загружаю профиль...</div></div>'
    + '<button onclick="document.body.removeChild(document.getElementById(\'adm-userprof-modal\'))" style="width:100%;padding:13px;margin-top:14px;background:var(--surface2);color:var(--text);border:none;border-radius:11px;font:inherit;font-size:14px;font-weight:700;cursor:pointer">Закрыть</button>'
    + '</div>';
  document.body.appendChild(overlay);

  try {
    var r = await fetch('/api/proxy/api/admin?action=user_detail&id=' + userId, {headers:_adminHeaders()});
    var d = await r.json();
    var body = document.getElementById('adm-userprof-body');
    if (!d.ok) { body.innerHTML = '<div style="color:var(--accent2)">Не удалось загрузить</div>'; return; }
    var u = d.user || {};
    var name = (u.name||u.first_name||'').trim() || '—';
    var uname = u.username ? '@' + u.username : ('id' + u.id);
    var uStatus = (u.status || 'free').toLowerCase();
    var isPrem = u.premium || u.is_premium || ['basic','standard','premium','vip','tester'].includes(uStatus);
    var tierBadges = {
      basic:    '<span style="background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800">📦 BASIC</span>',
      standard: '<span style="background:linear-gradient(135deg,#a78bfa,#8b5cf6);color:#fff;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800">⭐ STANDARD</span>',
      premium:  '<span style="background:linear-gradient(135deg,#facc15,#f59e0b);color:#000;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800">👑 PREMIUM</span>',
      vip:      '<span style="background:linear-gradient(135deg,#facc15,#f59e0b);color:#000;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800">👑 PREMIUM</span>',
      tester:   '<span style="background:linear-gradient(135deg,#facc15,#f59e0b);color:#000;padding:3px 10px;border-radius:8px;font-size:11px;font-weight:800">👑 PREMIUM</span>',
    };
    var premBadge = tierBadges[uStatus] ||
      '<span style="background:var(--surface2);color:var(--text2);padding:3px 10px;border-radius:8px;font-size:11px;font-weight:700">FREE</span>';
    var uid = u.id || u.telegram_id;
    var streak = u.streak || u.streak_days || 0;
    var entries = u.entries_total || u.food_entries || 0;
    var photosToday = u.photos_today || u.photo_today_used || 0;
    var photoLimit  = u.photo_today_limit || 5;

    body.innerHTML =
      '<div style="font-weight:800;font-size:18px;margin-bottom:4px">' + escHtml(name) + ' ' + premBadge + '</div>'
      + '<div style="font-size:12px;color:var(--text2);margin-bottom:14px">'
      +   escHtml(uname) + ' · id=' + uid
      + '</div>'

      // Сводка
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:14px">'
      +   '<div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">'
      +     '<div style="font-size:16px;font-weight:800;color:var(--accent)">' + entries + '</div>'
      +     '<div style="font-size:10px;color:var(--text2)">Записей</div></div>'
      +   '<div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">'
      +     '<div style="font-size:16px;font-weight:800;color:var(--green)">' + streak + '</div>'
      +     '<div style="font-size:10px;color:var(--text2)">Стрик</div></div>'
      +   '<div style="background:var(--surface2);border-radius:10px;padding:10px;text-align:center">'
      +     '<div style="font-size:16px;font-weight:800;color:#facc15">' + photosToday + '/' + photoLimit + '</div>'
      +     '<div style="font-size:10px;color:var(--text2)">Фото сегодня</div></div>'
      + '</div>'

      // Параметры
      + '<div style="background:var(--surface2);border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;line-height:1.7">'
      +   '🎯 Цель: <b>' + escHtml(u.goal||'—') + '</b><br>'
      +   '⚖️ Вес: <b>' + (u.weight||'—') + ' кг</b> · 📏 Рост: <b>' + (u.height||'—') + ' см</b><br>'
      +   '🔥 Норма: <b>' + (u.daily_goal||'—') + ' ккал</b><br>'
      +   (u.premium_until ? '⭐ Premium до: <b>' + escHtml(u.premium_until) + '</b><br>' : '')
      +   '📊 Записей за неделю: <b>' + (u.entries_week||0) + '</b><br>'
      +   '🏆 Достижений: <b>' + (u.achievements||0) + '</b><br>'
      +   '🌍 Язык: <b>' + escHtml(u.language||u.lang||'ru') + '</b>'
      + '</div>'

      // Действия
      + '<div style="font-size:11px;color:var(--text2);font-weight:700;letter-spacing:.5px;margin-bottom:8px">⚡ ДЕЙСТВИЯ</div>'
      +   (isPrem ?
          '<button onclick="admUserSetPremium(' + uid + ',0,\'free\')" style="width:100%;padding:11px;background:var(--surface2);color:var(--text);border:none;border-radius:10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:44px;margin-bottom:8px">❌ Снять тариф</button>'
        : '')
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px">'
      +   '<button onclick="admUserSetPremium(' + uid + ',30,\'basic\')" style="padding:10px 4px;background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff;border:none;border-radius:10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer;min-height:44px">📦 Basic<br>30д</button>'
      +   '<button onclick="admUserSetPremium(' + uid + ',90,\'standard\')" style="padding:10px 4px;background:linear-gradient(135deg,#a78bfa,#8b5cf6);color:#fff;border:none;border-radius:10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer;min-height:44px">⭐ Std<br>90д</button>'
      +   '<button onclick="admUserSetPremium(' + uid + ',365,\'premium\')" style="padding:10px 4px;background:linear-gradient(135deg,#facc15,#f59e0b);color:#000;border:none;border-radius:10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer;min-height:44px">🎁 Prem<br>365д</button>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">'
      +   '<button onclick="admUserResetQuota(' + uid + ')" style="padding:11px;background:var(--surface2);color:var(--text);border:none;border-radius:10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:44px">🔄 Обнулить квоту</button>'
      +   (u.is_banned ?
          '<button onclick="admUserBan(' + uid + ',false)" style="padding:11px;background:var(--green);color:#fff;border:none;border-radius:10px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;min-height:44px">✅ Разбанить</button>'
        :
          '<button onclick="admUserBan(' + uid + ',true)" style="padding:11px;background:rgba(219,39,119,.15);color:var(--accent2);border:none;border-radius:10px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;min-height:44px">🚫 Забанить</button>')
      + '</div>'
      + '<button onclick="admUserSendMessage(' + uid + ')" style="width:100%;padding:12px;background:var(--accent);color:#fff;border:none;border-radius:10px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;min-height:44px">💬 Отправить сообщение</button>';
  } catch(e) {
    var body = document.getElementById('adm-userprof-body');
    if (body) body.innerHTML = '<div style="color:var(--accent2)">Ошибка</div>';
  }
}
window.admUserProfile = admUserProfile;

async function admUserSetPremium(userId, days, tier) {
  var tierNames = {basic:'Basic', standard:'Standard', premium:'Premium', free:'Free'};
  var tierName = tierNames[tier] || tier;
  var msg = days > 0 ? 'Выдать <b>' + tierName + '</b> на <b>' + days + ' дней</b>?' : 'Снять текущий тариф?';
  showConfirm(msg, async function() {
    try {
      var r = await fetch('/api/proxy/api/admin', {
        method:'POST', headers:_adminHeaders({'Content-Type':'application/json'}),
        body: JSON.stringify({action:'set_premium', user_id:userId, days:days, give: days > 0, tier: tier})
      });
      var d = await r.json();
      if (d.ok) { showToast(days>0?'⭐ Выдан ' + tierName:'❌ Снят', 'var(--green)'); admUserProfile(userId); }
      else showToast('Ошибка', 'var(--accent2)');
    } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
  }, null, days > 0 ? {yes:'⭐ Выдать', yesColor:'var(--accent)'} : {yes:'❌ Снять', yesColor:'var(--accent2)'});
}
window.admUserSetPremium = admUserSetPremium;

async function admUserResetQuota(userId) {
  showConfirm('Обнулить квоту фото на сегодня?', async function() {
    try {
      var r = await fetch('/api/proxy/api/admin', {
        method:'POST', headers:_adminHeaders({'Content-Type':'application/json'}),
        body: JSON.stringify({action:'reset_photo_quota', user_id:userId})
      });
      var d = await r.json();
      if (d.ok) { showToast('Квота обнулена', 'var(--green)'); admUserProfile(userId); }
      else showToast('Ошибка', 'var(--accent2)');
    } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
  }, null, {yes:'🔄 Обнулить', yesColor:'var(--accent)'});
}
window.admUserResetQuota = admUserResetQuota;

async function admUserBan(userId, ban) {
  showConfirm(ban ? 'Забанить юзера?' : 'Разбанить юзера?', async function() {
    try {
      var r = await fetch('/api/proxy/api/admin', {
        method:'POST', headers:_adminHeaders({'Content-Type':'application/json'}),
        body: JSON.stringify({action:'ban', user_id:userId, ban:ban})
      });
      var d = await r.json();
      if (d.ok) { showToast(ban?'Забанен':'Разбанен', 'var(--green)'); admUserProfile(userId); }
      else showToast('Ошибка', 'var(--accent2)');
    } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
  }, null, ban ? {yes:'🚫 Забанить', yesColor:'var(--accent2)'} : {yes:'✅ Разбанить', yesColor:'var(--green)'});
}
window.admUserBan = admUserBan;

async function admUserSendMessage(userId) {
  showPrompt(
    '💬 Сообщение юзеру',
    'Текст (до 2000 символов) уйдёт юзеру в чат с ботом:',
    '',
    async function(text) {
      if (!text || !text.trim()) return;
      try {
        var r = await fetch('/api/proxy/api/admin', {
          method:'POST', headers:_adminHeaders({'Content-Type':'application/json'}),
          body: JSON.stringify({action:'send_message', user_id:userId, text:text.trim()})
        });
        var d = await r.json();
        if (d.ok) showToast('✅ Отправлено', 'var(--green)');
        else showToast('Ошибка: ' + (d.error||'?'), 'var(--accent2)');
      } catch(e) { showToast('Ошибка соединения', 'var(--accent2)'); }
    }
  );
}
window.admUserSendMessage = admUserSendMessage;

async function admTicketClose(ticketId) {
  showConfirm('Закрыть тикет #' + ticketId + '?', async function() {
    try {
      var r = await fetch('/api/proxy/api/admin', {
        method: 'POST',
        headers: _adminHeaders({'Content-Type':'application/json'}),
        body: JSON.stringify({action:'ticket_close', ticket_id: ticketId})
      });
      var d = await r.json();
      if (d.ok) { showToast('Закрыт', 'var(--green)'); admLoadTickets(); }
      else showToast('Ошибка: ' + (d.error||'?'), 'var(--accent2)');
    } catch(e) { showToast('Ошибка соединения', 'var(--accent2)'); }
  }, null, {yes:'✅ Закрыть', yesColor:'var(--green)'});
}
window.admTicketClose = admTicketClose;

// ════════════════════════════════════════════════════════
// ПАКЕТ 2: ДАШБОРД с SVG-графиком регистраций
// ════════════════════════════════════════════════════════
var _admOriginalLoadDash = null;
if (typeof admLoadDash === 'function') {
  _admOriginalLoadDash = admLoadDash;
}
async function admLoadDashV2() {
  // Загружаем dashboard данные
  var dashEl = document.getElementById('adm-section-dash');
  if (!dashEl) return;
  
  // Сначала запускаем оригинальный загрузчик для KPI элементов
  if (typeof admLoadDash === 'function') {
    try { await admLoadDash(); } catch(e) {}
  }

  // Загружаем график регистраций
  try {
    var r = await fetch(window.API_BASE + '/api/admin?action=users_chart&days=14', {headers: _adminHeaders()});
    var d = await r.json();
    var chartEl = document.getElementById('adm-users-chart');
    if (!chartEl) return;

    if (!d.ok || !d.buckets || !d.buckets.length) {
      chartEl.style.display = 'none';
      return;
    }

    var max = Math.max.apply(null, d.buckets.map(function(b){ return b.new_users || 0; })) || 1;
    var days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];  // weekday() 0=понедельник

    var todayISO = new Date().toISOString().slice(0,10);
    var bars = d.buckets.map(function(b) {
      var cnt = b.new_users || 0;
      var pct = Math.round(cnt / max * 100);
      var dow = days[b.dow] || '?';
      var isToday = b.date === todayISO;
      var col = isToday ? '#6366f1' : 'rgba(99,102,241,0.4)';
      return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">'
        + (cnt > 0 ? '<div style="font-size:9px;color:#8e8e93">' + cnt + '</div>' : '<div style="font-size:9px;color:transparent">0</div>')
        + '<div style="width:100%;border-radius:4px 4px 0 0;background:' + col + ';height:' + Math.max(pct, cnt>0?4:0) + '%;' + (isToday ? 'box-shadow:0 0 8px rgba(99,102,241,0.5)' : '') + '"></div>'
        + '<div style="font-size:9px;color:' + (isToday ? '#6366f1' : '#8e8e93') + ';font-weight:' + (isToday ? '700' : '400') + '">' + dow + '</div>'
        + '</div>';
    }).join('');

    chartEl.innerHTML = '<div style="font-size:11px;font-weight:700;color:#8e8e93;letter-spacing:.5px;margin-bottom:10px">📈 НОВЫЕ ЮЗЕРЫ (14 ДНЕЙ)</div>'
      + '<div style="display:flex;align-items:flex-end;gap:4px;height:60px">' + bars + '</div>';
    chartEl.style.display = 'block';

  } catch(e) {
    var chartEl2 = document.getElementById('adm-users-chart');
    if (chartEl2) chartEl2.style.display = 'none';
  }
}


async function admLoadStats() {
  var box = document.getElementById('adm-stats-content');
  if (!box) return;
  box.innerHTML = '<div style="text-align:center;padding:20px;color:#8e8e93">⏳ Загружаю...</div>';
  try {
    var res = await fetch(window.API_BASE + '/api/admin?action=detailed_stats', {headers: _adminHeaders()});
    var data = await res.json();
    if (!data.ok) { box.innerHTML = '<div style="color:#ef4444;padding:12px">Ошибка: ' + (data.error||'?') + '</div>'; return; }
    var s = data.stats || {};
    function kcard(val, lbl, icon, col) {
      return '<div style="background:#2c2c2e;border-radius:12px;padding:14px;text-align:center">'
        + '<div style="font-size:20px">' + icon + '</div>'
        + '<div style="font-size:22px;font-weight:900;color:' + (col||'#6366f1') + ';margin:4px 0">' + (val||0) + '</div>'
        + '<div style="font-size:11px;color:#8e8e93">' + lbl + '</div>'
        + '</div>';
    }
    function bbar(lbl, val, max, col) {
      var pct = max > 0 ? Math.min(100, Math.round(val/max*100)) : 0;
      return '<div style="margin-bottom:8px">'
        + '<div style="display:flex;justify-content:space-between;margin-bottom:3px">'
        + '<span style="font-size:12px;color:#f2f2f7">' + lbl + '</span>'
        + '<span style="font-size:12px;font-weight:700;color:' + (col||'#6366f1') + '">' + val + '</span>'
        + '</div><div style="height:5px;background:#3a3a3c;border-radius:3px;overflow:hidden">'
        + '<div style="height:100%;width:' + pct + '%;background:' + (col||'#6366f1') + ';border-radius:3px"></div>'
        + '</div></div>';
    }
    var h = '';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">';
    h += kcard(s.total_users,'Пользователей','👥','#6366f1');
    h += kcard(s.premium_users,'Premium','⭐','#f59e0b');
    h += kcard(s.active_7d,'Активны 7д','📈','#10b981');
    h += kcard(s.new_7d,'Новых 7д','🆕','#06b6d4');
    h += '</div>';
    h += '<div style="background:#2c2c2e;border-radius:12px;padding:14px;margin-bottom:10px">';
    h += '<div style="font-size:11px;font-weight:800;color:#8e8e93;letter-spacing:.8px;margin-bottom:10px">📊 АКТИВНОСТЬ</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">';
    h += '<div style="text-align:center"><div style="font-size:18px;font-weight:900;color:#f2f2f7">'+(s.total_entries||0)+'</div><div style="font-size:10px;color:#8e8e93">Записей еды</div></div>';
    h += '<div style="text-align:center"><div style="font-size:18px;font-weight:900;color:#f2f2f7">'+(s.avg_entries_per_user||0)+'</div><div style="font-size:10px;color:#8e8e93">Средн./юзер</div></div>';
    h += '<div style="text-align:center"><div style="font-size:18px;font-weight:900;color:#f2f2f7">'+(s.ai_generations||0)+'</div><div style="font-size:10px;color:#8e8e93">AI запросов</div></div>';
    h += '</div>';
    if (s.lang_stats && s.lang_stats.length) {
      var maxL = s.lang_stats[0].count || 1;
      var cols = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4'];
      s.lang_stats.slice(0,5).forEach(function(l,i){ h += bbar(l.lang.toUpperCase(), l.count, maxL, cols[i%5]); });
    }
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">';
    h += kcard(s.achievements_total||0,'Достижений','🏆','#f59e0b');
    h += kcard(s.support_tickets||0,'Тикетов','📩','#ef4444');
    h += '</div>';
    h += '<button onclick="admLoadStats()" style="width:100%;padding:10px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer">🔄 Обновить</button>';
    box.innerHTML = h;
  } catch(e) { box.innerHTML = '<div style="color:#ef4444;padding:12px">Ошибка: ' + e.message + '</div>'; }
}


async function admLoadDash() {
  // Ждём user_id если ещё не получен
  var uid = getUserId();
  if (!uid) {
    await new Promise(function(r){ setTimeout(r, 500); });
    uid = getUserId();
  }
  if (!uid) return;
  try {
    var res  = await fetch('/api/proxy/api/admin?action=dashboard', {headers:_adminHeaders()});
    var data = await res.json();
    if (!data.ok) return;
    document.getElementById('adm-total').textContent   = data.total_users   || 0;
    document.getElementById('adm-premium').textContent = data.premium_users || 0;
    document.getElementById('adm-active').textContent  = data.active_today  || 0;
    document.getElementById('adm-entries').textContent = (data.total_entries||0).toLocaleString();
    // Новые сегодня
    var newEl = document.getElementById('adm-new-today');
    if (newEl) newEl.textContent = data.new_today || 0;
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
      var uStatus = (u.status || 'free').toLowerCase();
      var tierLabels = {basic:'📦 Basic', standard:'⭐ Standard', premium:'👑 Premium', vip:'👑 Premium', tester:'👑 Premium'};
      var badge = u.premium
        ? '<span class="adm-badge adm-badge-prem">' + (tierLabels[uStatus] || '⭐ Premium') + (u.premium_until ? ' до '+u.premium_until : '') + '</span>'
        : '<span class="adm-badge adm-badge-free">Бесплатный</span>';
      return '<div class="adm-user-card" id="adm-user-'+u.id+'">'
        + '<div class="adm-user-row">'
        + '<div><div class="adm-user-name">' + escHtml((u.name||'') + (u.username ? ' @'+u.username : '')) + '</div>'
        + '<div class="adm-user-meta">ID: ' + u.id + ' · 🔥 ' + u.streak + ' дн.' + (u.is_banned?' · 🔴 БАН':'') + '</div></div>'
        + badge + '</div>'
        + '<div class="adm-user-btns">'
        + '<button class="adm-btn" style="background:var(--surface2);color:var(--text)" onclick="admUserProfile('+u.id+')">👤 Профиль (тарифы там)</button>'
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
    var statusBadge = {
      'pending':              '<span style="background:rgba(234,88,12,.15);color:#ea580c;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">⏳ ОЖИДАЕТ СКРИНА</span>',
      'screenshot_received':  '<span style="background:rgba(22,163,74,.15);color:var(--green);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">📸 СКРИН ПОЛУЧЕН</span>',
    };
    list.innerHTML = data.payments.map(function(p) {
      var uname = p.username ? '@' + escHtml(p.username) : '';
      var name  = p.name ? escHtml(p.name) : '';
      var screenshotBlock = '';
      if (p.screenshot) {
        // Бэк хранит Telegram file_id. <img src> не может слать заголовки авторизации,
        // поэтому грузим скрин авторизованным fetch → blob → objectURL (работает в strict).
        // Ленивая загрузка: реально дёргаем ручку только при раскрытии деталей заявки.
        screenshotBlock =
          '<div style="margin-top:10px">'
          + '<img data-shot="' + p.id + '" alt="скриншот"'
          + ' style="width:100%;border-radius:10px;cursor:pointer;max-height:360px;min-height:120px;object-fit:contain;background:#000"'
          + ' onclick="if(this.src)admViewImage(this.src)">'
          + '</div>';
      } else if (p.status === 'pending') {
        screenshotBlock = '<div style="margin-top:10px;padding:12px;background:rgba(234,88,12,.08);border-radius:10px;font-size:12px;color:#ea580c;text-align:center">⏳ Юзер ещё не прислал скрин. Можешь напомнить ему кнопкой ниже.</div>';
      }

      return '<div class="adm-pay-card" id="adm-pay-'+p.id+'" style="background:var(--surface);border:1px solid var(--glass-border);border-radius:14px;padding:14px;margin-bottom:10px">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
        +   '<div style="font-weight:800;font-size:15px">#' + p.id + '</div>'
        +   statusBadge[p.status] || '<span style="background:var(--surface2);color:var(--text2);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">' + escHtml(p.status||'') + '</span>'
        +   '<div style="margin-left:auto;font-size:11px;color:var(--text2)">' + escHtml(p.created_at||'') + '</div>'
        + '</div>'
        + '<div style="font-size:13px;color:var(--text2);margin-bottom:6px">'
        +   '👤 ' + name + ' ' + uname + ' <span style="opacity:.7">· id=' + p.user_id + '</span>'
        + '</div>'
        + '<div style="display:flex;gap:10px;margin-bottom:6px;font-size:14px;font-weight:600">'
        +   '<span>📦 ' + (planNames[p.plan]||p.plan) + '</span>'
        +   '<span style="color:var(--green)">💰 ' + p.amount + ' ₽</span>'
        + '</div>'
        + '<button onclick="admTogglePayDetails('+p.id+')" id="adm-pay-toggle-'+p.id+'" style="width:100%;padding:9px;background:var(--surface2);color:var(--text);border:none;border-radius:9px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;min-height:38px;margin-bottom:8px">📂 Показать детали</button>'
        + '<div id="adm-pay-details-'+p.id+'" style="display:none">'
        +   screenshotBlock
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">'
        +   '<button onclick="admConfirmPay('+p.id+')" style="padding:11px;background:var(--green);color:#fff;border:none;border-radius:10px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;min-height:44px">✅ Подтвердить</button>'
        +   '<button onclick="admRejectPay('+p.id+')" style="padding:11px;background:rgba(219,39,119,.15);color:var(--accent2);border:none;border-radius:10px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;min-height:44px">❌ Отклонить</button>'
        + '</div>'
        + '<button onclick="admMessagePayUser('+p.user_id+','+p.id+')" style="width:100%;padding:11px;background:var(--accent);color:#fff;border:none;border-radius:10px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;min-height:44px">💬 Написать юзеру</button>'
        + '</div>';
    }).join('');
  } catch(e) { list.innerHTML = '<div class="lb-empty">Ошибка загрузки</div>'; }
}

// Грузит скрин платежа авторизованным запросом (img не умеет слать заголовки).
async function admLoadScreenshot(img) {
  if (!img || img.getAttribute('data-loaded')) return;
  var pid = img.getAttribute('data-shot');
  if (!pid) return;
  img.setAttribute('data-loaded', '1');
  try {
    var r = await fetch(window.API_BASE + '/api/admin/payment_screenshot?payment_id=' + pid, { headers: _adminHeaders() });
    if (!r.ok) throw new Error('http ' + r.status);
    var blob = await r.blob();
    if (img._objUrl) URL.revokeObjectURL(img._objUrl);
    img._objUrl = URL.createObjectURL(blob);
    img.src = img._objUrl;
  } catch (e) {
    img.removeAttribute('data-loaded'); // разрешаем повтор при следующем открытии
    if (img.parentNode) img.parentNode.innerHTML =
      '<div style="padding:12px;background:rgba(219,39,119,.08);border-radius:10px;font-size:12px;color:var(--accent2);text-align:center">⚠️ Не удалось загрузить скриншот. Попробуй ещё раз.</div>';
  }
}
window.admLoadScreenshot = admLoadScreenshot;

function admTogglePayDetails(payId) {
  var d = document.getElementById('adm-pay-details-'+payId);
  var b = document.getElementById('adm-pay-toggle-'+payId);
  if (!d) return;
  if (d.style.display === 'none' || !d.style.display) {
    d.style.display = 'block';
    if (b) b.textContent = '📁 Скрыть детали';
    // Ленивая догрузка скрина при первом раскрытии
    d.querySelectorAll('img[data-shot]').forEach(function(img){ admLoadScreenshot(img); });
  } else {
    d.style.display = 'none';
    if (b) b.textContent = '📂 Показать детали';
  }
}
window.admTogglePayDetails = admTogglePayDetails;

// Лайтбокс для скриншота
function admViewImage(src) {
  var existing = document.getElementById('adm-imgview');
  if (existing) document.body.removeChild(existing);
  var overlay = document.createElement('div');
  overlay.id = 'adm-imgview';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99999;display:flex;align-items:center;justify-content:center;padding:10px;cursor:zoom-out';
  overlay.onclick = function(){ document.body.removeChild(overlay); };
  overlay.innerHTML = '<img src="' + src + '" style="max-width:100%;max-height:100%;border-radius:8px">';
  document.body.appendChild(overlay);
}
window.admViewImage = admViewImage;

async function admConfirmPay(payId) {
  showConfirm('Подтвердить оплату #'+payId+'?', async function() {
    try {
      var data = await _admFetch('confirm_payment', {payment_id:payId});
      if (data && data.ok) {
        showToast('✅ Оплата подтверждена, Premium выдан до '+(data.until||'?'), 'var(--green)');
        var row = document.getElementById('adm-pay-'+payId);
        if (row) row.remove();
      } else {
        showToast('Ошибка: ' + (data && data.error || 'не удалось'), 'var(--accent2)');
      }
    } catch(e) { showToast('Ошибка соединения', 'var(--accent2)'); }
  }, null, {yes:'✅ Подтвердить', yesColor:'var(--green)'});
}

async function admRejectPay(payId) {
  // Открываем модал с причиной отклонения
  showPrompt(
    'Отклонить заявку #'+payId,
    'Опиши причину отклонения — она уйдёт юзеру:',
    'Не вижу платежа на нашу карту',
    async function(reason) {
      if (!reason || !reason.trim()) return;
      try {
        var data = await _admFetch('reject_payment', {payment_id:payId, reason:reason.trim()});
        if (data && data.ok) {
          showToast('❌ Отклонено, юзеру отправлено сообщение', 'var(--accent2)');
          var row = document.getElementById('adm-pay-'+payId);
          if (row) row.remove();
        } else {
          showToast('Ошибка: ' + (data && data.error || 'не удалось'), 'var(--accent2)');
        }
      } catch(e) { showToast('Ошибка соединения', 'var(--accent2)'); }
    }
  );
}

async function admMessagePayUser(userId, payId) {
  showPrompt(
    '💬 Сообщение юзеру',
    'Что написать про заявку #'+payId+'?',
    'Привет! Пришли пожалуйста скрин или чек об оплате — без него не смогу подтвердить заявку 🙏',
    async function(text) {
      if (!text || !text.trim()) return;
      try {
        var data = await _admFetch('send_message', {user_id:userId, text:text.trim()});
        if (data && data.ok) showToast('✅ Сообщение отправлено', 'var(--green)');
        else showToast('Ошибка: ' + (data && data.error || 'не удалось'), 'var(--accent2)');
      } catch(e) { showToast('Ошибка', 'var(--accent2)'); }
    }
  );
}
window.admMessagePayUser = admMessagePayUser;


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

// ── Управление рассылками (Admin) ─────────────────────────────────
var _notifSettings = null;

async function admLoadNotifSettings() {
  var list = document.getElementById('adm-notif-list');
  var status = document.getElementById('adm-notif-status');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:16px;color:#8e8e93">⏳ Загружаю...</div>';
  try {
    var d = await apiGet('/api/admin/notif_settings');
    if (!d || !d.ok) { list.innerHTML = '<div style="color:#ef4444;padding:12px">Ошибка загрузки</div>'; return; }
    var rows = d.settings.map(function(s) {
      var bg = s.enabled ? '#6366f1' : '#3a3a3c';
      var lft = s.enabled ? '21px' : '3px';
      var r = '<div style="display:flex;align-items:center;justify-content:space-between;background:#2c2c2e;border-radius:12px;padding:12px 14px;margin-bottom:8px">';
      r += '<div><div style="font-weight:700;font-size:13px;color:#f2f2f7">' + s.icon + ' ' + s.label + '</div>';
      r += '<div style="font-size:11px;color:#8e8e93;margin-top:2px">' + s.desc + '</div></div>';
      r += '<div onclick="admToggleNotif(this)" data-key="' + s.key + '" data-on="' + s.enabled + '"';
      r += ' style="cursor:pointer;width:44px;height:24px;border-radius:12px;background:' + bg + ';position:relative;border:1px solid rgba(255,255,255,0.1);transition:background .2s;flex-shrink:0">';
      r += '<div style="position:absolute;top:3px;left:' + lft + ';width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s"></div>';
      r += '</div></div>';
      return r;
    });
    list.innerHTML = rows.join('');
  } catch(e) { list.innerHTML = '<div style="color:#ef4444;padding:12px">Ошибка: ' + e.message + '</div>'; }
}


async function admToggleNotif(toggleEl) {
  var key = toggleEl.dataset.key;
  var isOn = toggleEl.dataset.on === 'true';
  var newVal = !isOn;
  // Анимация
  toggleEl.style.background = newVal ? 'var(--accent)' : 'var(--surface)';
  toggleEl.querySelector('div').style.left = newVal ? '21px' : '3px';
  toggleEl.dataset.on = String(newVal);
  try {
    var d = await apiPost('/api/admin/notif_settings', {key: key, enabled: newVal});
    var status = document.getElementById('adm-notif-status');
    if (d && d.ok) {
      if (status) status.textContent = '✅ ' + key + ' ' + (newVal ? 'включено' : 'выключено');
    } else {
      // Откатим
      toggleEl.style.background = isOn ? 'var(--accent)' : 'var(--surface)';
      toggleEl.querySelector('div').style.left = isOn ? '21px' : '3px';
      toggleEl.dataset.on = String(isOn);
      if (status) status.textContent = '❌ Ошибка сохранения';
    }
  } catch(e) {
    toggleEl.style.background = isOn ? 'var(--accent)' : 'var(--surface)';
    toggleEl.querySelector('div').style.left = isOn ? '21px' : '3px';
    toggleEl.dataset.on = String(isOn);
  }
}
window.admLoadNotifSettings = admLoadNotifSettings;

// ── ADMIN SETTINGS (цены, карта, TON) ──────────────────────────
async function admTonRefreshRate() {
  var rateEl = document.getElementById('ton-rate-hint');
  if (rateEl) rateEl.textContent = '⏳ Обновляю курс...';
  try {
    // Публичный курс TON/RUB через CoinGecko
    var r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub');
    var d = await r.json();
    var rate = d && d['the-open-network'] && d['the-open-network'].rub;
    if (!rate) throw new Error('no rate');
    rate = Math.round(rate);

    // Автопересчитываем цены TON по текущим ценам Premium в рублях
    var rub1m  = parseInt(document.getElementById('prem-price-1m').value)  || 449;
    var rub3m  = parseInt(document.getElementById('prem-price-3m').value)  || 1199;
    var rub12m = parseInt(document.getElementById('prem-price-12m').value) || 3990;

    document.getElementById('ton-price-1m').value  = (rub1m  / rate).toFixed(1);
    document.getElementById('ton-price-3m').value  = (rub3m  / rate).toFixed(1);
    document.getElementById('ton-price-12m').value = (rub12m / rate).toFixed(1);

    if (rateEl) rateEl.textContent = '✅ Курс: 1 TON ≈ ' + rate + ' ₽ · цены пересчитаны';
    showToast('Курс обновлён: ' + rate + ' ₽/TON', 'var(--accent)');
  } catch(e) {
    if (rateEl) rateEl.textContent = '❌ Не удалось получить курс, введи вручную';
    showToast('Ошибка получения курса', 'var(--accent2)');
  }
}
window.admTonRefreshRate = admTonRefreshRate;

// ── FOOD CANDIDATES ─────────────────────────────────────────────
async function admLoadFoodCandidates() {
  var listEl = document.getElementById('foodcand-list');
  if (listEl) listEl.innerHTML = '<div class="ai-loading">Загружаю...</div>';
  try {
    var r = await fetch('/api/proxy/api/admin?action=food_candidates', {headers: _adminHeaders()});
    var d = await r.json();
    if (!d.ok || !d.candidates || !d.candidates.length) {
      if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:30px 0;color:#8e8e93;font-size:13px">Нет новых кандидатов</div>';
      return;
    }
    var html = '';
    d.candidates.forEach(function(c, i) {
      html += '<div style="background:#1c1c1e;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;margin-bottom:10px">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">'
        + '<div style="font-weight:700;font-size:14px;color:#fff">' + escHtml(c.name) + '</div>'
        + '<div style="background:rgba(99,102,241,0.15);color:#a5b4fc;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700">👥 ' + c.users_count + '</div>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;font-size:11px;color:#8e8e93">'
        + '<div>🔥 ' + c.avg_calories + '</div>'
        + '<div>Б ' + c.avg_protein + '</div>'
        + '<div>Ж ' + c.avg_fat + '</div>'
        + '<div>У ' + c.avg_carbs + '</div>'
        + '</div>'
        + '<button onclick="admApproveFoodCandidate(' + i + ')" style="width:100%;padding:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer">✅ Добавить в базу</button>'
        + '</div>';
    });
    if (listEl) listEl.innerHTML = html;
    window._foodCandidates = d.candidates;
  } catch(e) {
    if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;font-size:13px">Ошибка загрузки</div>';
  }
}
window.admLoadFoodCandidates = admLoadFoodCandidates;

async function admApproveFoodCandidate(idx) {
  var c = window._foodCandidates && window._foodCandidates[idx];
  if (!c) return;
  try {
    var r = await fetch('/api/proxy/api/admin', {
      method: 'POST',
      headers: _adminHeaders({'Content-Type': 'application/json'}),
      body: JSON.stringify({
        action: 'food_candidate_approve',
        name: c.name, calories: c.avg_calories,
        protein: c.avg_protein, fat: c.avg_fat, carbs: c.avg_carbs,
      })
    });
    var d = await r.json();
    if (d.ok) {
      showToast('✅ Добавлено: ' + c.name, 'var(--accent)');
      admLoadFoodCandidates(); // обновляем список
    } else {
      showToast('❌ Ошибка', 'var(--accent2)');
    }
  } catch(e) {
    showToast('❌ Ошибка соединения', 'var(--accent2)');
  }
}
window.admApproveFoodCandidate = admApproveFoodCandidate;

async function admSettingsLoad() {
  try {
    var r = await fetch('/api/proxy/api/admin?action=settings_get', {headers: _adminHeaders()});
    var d = await r.json();
    if (!d.ok) return;

    // Цены Premium в рублях
    if (d.prices_rub) {
      var el1m  = document.getElementById('prem-price-1m');
      var el3m  = document.getElementById('prem-price-3m');
      var el12m = document.getElementById('prem-price-12m');
      if (el1m)  el1m.value  = d.prices_rub['1m']  || 449;
      if (el3m)  el3m.value  = d.prices_rub['3m']  || 1199;
      if (el12m) el12m.value = d.prices_rub['12m'] || 3990;
    }

    // Реквизиты карты
    var elNum  = document.getElementById('card-number');
    var elHold = document.getElementById('card-holder');
    var elBank = document.getElementById('card-bank');
    if (elNum)  elNum.value  = d.card_number || '';
    if (elHold) elHold.value = d.card_holder || '';
    if (elBank) elBank.value = d.card_bank   || 'OZON Bank';

    // TON цены
    if (d.prices_ton) {
      var t1m  = document.getElementById('ton-price-1m');
      var t3m  = document.getElementById('ton-price-3m');
      var t12m = document.getElementById('ton-price-12m');
      if (t1m)  t1m.value  = d.prices_ton['1m']  || 5;
      if (t3m)  t3m.value  = d.prices_ton['3m']  || 13;
      if (t12m) t12m.value = d.prices_ton['12m'] || 42;
    }

    // TON кошелёк
    var walletEl = document.getElementById('ton-wallet-display');
    if (walletEl) walletEl.textContent = d.ton_wallet || '—';

    // Подсказка по курсу TON
    var rateEl = document.getElementById('ton-rate-hint');
    if (rateEl && d.prices_rub && d.prices_ton) {
      var rate = Math.round(d.prices_rub['1m'] / (d.prices_ton['1m'] || 1));
      rateEl.textContent = '≈ ' + rate + ' ₽ за 1 TON (по ценам 1 мес). Обновляй при изменении курса.';
    }
  } catch(e) { console.warn('settings load failed', e); }
}

async function admSettingsSave(section) {
  var status = document.getElementById('status-' + section);
  var body = {action: 'settings_save', section: section};

  if (section === 'premium_prices') {
    body.prices = {
      '1m':  parseInt(document.getElementById('prem-price-1m').value)  || 449,
      '3m':  parseInt(document.getElementById('prem-price-3m').value)  || 1199,
      '12m': parseInt(document.getElementById('prem-price-12m').value) || 3990,
    };
  } else if (section === 'card') {
    body.card_number = (document.getElementById('card-number').value || '').trim();
    body.card_holder = (document.getElementById('card-holder').value || '').trim();
    body.card_bank   = (document.getElementById('card-bank').value   || '').trim();
    if (!body.card_number) { _settingsStatus(status, '❌ Введи номер карты', false); return; }
  } else if (section === 'ton') {
    body.prices = {
      '1m':  parseFloat(document.getElementById('ton-price-1m').value)  || 5,
      '3m':  parseFloat(document.getElementById('ton-price-3m').value)  || 13,
      '12m': parseFloat(document.getElementById('ton-price-12m').value) || 42,
    };
  }

  try {
    if (status) { status.textContent = '⏳ Сохраняю...'; status.style.color = 'var(--muted)'; }
    var r = await fetch('/api/proxy/api/admin', {
      method: 'POST',
      headers: _adminHeaders({'Content-Type': 'application/json'}),
      body: JSON.stringify(body)
    });
    var d = await r.json();
    if (d.ok) {
      _settingsStatus(status, '✅ Сохранено', true);
      admSettingsLoad(); // перезагружаем чтобы показать актуальные данные
    } else {
      _settingsStatus(status, '❌ ' + (d.error || 'Ошибка'), false);
    }
  } catch(e) {
    _settingsStatus(status, '❌ Ошибка соединения', false);
  }
}

function _settingsStatus(el, msg, ok) {
  if (!el) return;
  el.textContent  = msg;
  el.style.color  = ok ? 'var(--green)' : 'var(--accent2)';
  el.style.fontWeight = '700';
  setTimeout(function() { if (el) { el.textContent = ''; } }, 3000);
}

window.admSettingsLoad = admSettingsLoad;
window.admSettingsSave = admSettingsSave;

// ── WEIGHT WIDGET ────────────────────────────────────────────────
async function saveWeightToday() {
  var inp = document.getElementById('weight-input-today');
  var status = document.getElementById('weight-today-status');
  var w = parseFloat(inp && inp.value);
  if (!w || w < 20 || w > 500) {
    if (status) { status.textContent = '❌ Введи вес от 20 до 300 кг'; status.style.color = 'var(--accent2)'; }
    return;
  }
  var uid = getUserId();
  if (!uid) return;
  try {
    if (status) { status.textContent = '⏳ Сохраняю...'; status.style.color = 'var(--muted)'; }
    var r = await fetch('/api/proxy/api/weight', {
      method: 'POST',
      headers: {'Content-Type':'application/json','X-Telegram-User-Id': String(uid)},
      body: JSON.stringify({user_id: parseInt(uid), weight: w}),
    });
    var d = await r.json();
    if (d.ok) {
      if (status) { status.textContent = '✅ Вес сохранён: ' + w + ' кг'; status.style.color = 'var(--green)'; }
      // Обновляем список последних записей
      _renderWeightRecent(d.recent || []);
      // Хаптик
      try { Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e) {}
    } else {
      if (status) { status.textContent = '❌ ' + (d.error || 'Ошибка'); status.style.color = 'var(--accent2)'; }
    }
  } catch(e) {
    if (status) { status.textContent = '❌ Ошибка соединения'; status.style.color = 'var(--accent2)'; }
  }
}

function _renderWeightRecent(entries) {
  var el = document.getElementById('weight-recent-list');
  if (!el || !entries || !entries.length) return;
  var html = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">';
  entries.forEach(function(e) {
    html += '<div style="background:var(--bg2);border-radius:8px;padding:6px 10px;font-size:12px">'
      + '<span style="font-weight:700;color:var(--accent)">' + e.weight + ' кг</span>'
      + '<span style="color:var(--muted);margin-left:4px">' + e.date + '</span>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

function initWeightWidget() {
  // Подставляем текущий вес как placeholder
  var uid = getUserId();
  if (!uid) return;
  fetch('/api/proxy/api/weight_history?user_id=' + uid + '&limit=5')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.entries && d.entries.length) {
        var latest = d.entries[0];
        var inp = document.getElementById('weight-input-today');
        if (inp && latest.weight) inp.placeholder = latest.weight;
        _renderWeightRecent(d.entries.map(function(e) {
          return {weight: e.weight, date: e.date ? e.date.slice(5).replace('-','.') : '—'};
        }));
      }
    }).catch(function(){});
}
window.saveWeightToday  = saveWeightToday;
window.initWeightWidget = initWeightWidget;
window.admToggleNotif = admToggleNotif;
window.admBcSend      = admBcSend;
window.admBcPreview   = admBcPreview;
window.admLoadStats   = admLoadStats;


// ── Виджет воды в дневнике ────────────────────────────────────────
function _updateDiaryWaterWidget(amount, goal) {
  var amEl = document.getElementById('dw-amount');
  var barEl = document.getElementById('dw-bar');
  var goalEl = document.getElementById('dw-goal');
  if (!amEl) return;
  amEl.textContent = amount || 0;
  if (goalEl) goalEl.textContent = goal || 2000;
  if (barEl) barEl.style.width = Math.min(100, Math.round((amount || 0) / (goal || 2000) * 100)) + '%';
}

async function diaryAddWater(ml) {
  try {
    var d = await apiPost('/api/water', {ml: ml});
    if (d && d.ok) {
      showToast('+' + ml + ' мл 💧', '#0288d1');
      // Перезагружаем данные дневника чтобы обновить виджет
      try {
        var diary = await apiGet('/api/diary', {date: diaryDateStr(diaryDate)});
        if (diary && diary.water_today !== undefined) {
          _updateDiaryWaterWidget(diary.water_today, diary.water_goal || 2000);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

async function diaryWaterCustom() {
  var ml = parseInt(prompt('Введи объём воды (мл):'));
  if (ml && ml > 0 && ml <= 5000) await diaryAddWater(ml);
}

window.diaryAddWater   = diaryAddWater;
window.diaryWaterCustom = diaryWaterCustom;

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
