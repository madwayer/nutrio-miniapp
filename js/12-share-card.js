// NutriO — Share Card (Phase: Growth)
// Рисует premium-карточку дня на canvas и шерит в Stories / чат / скачивание.
(function(){
  'use strict';

  var W = 1080, H = 1920;

  // ── Палитра карточки (в тон elite-теме) ──────────────────────────────
  var C = {
    bg0:   '#0a0a10',
    bg1:   '#15151e',
    accent:'#7c6cff',
    accent2:'#9a8cff',
    pink:  '#ff5d7e',
    green: '#3ddc84',
    gold:  '#d8b66a',
    text:  '#f2f2f7',
    text2: '#9292b0',
    ring_bg:'rgba(255,255,255,0.08)',
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Кольцо прогресса с градиентом
  function drawRing(ctx, cx, cy, radius, lineW, pct, colorA, colorB) {
    // фон
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = lineW;
    ctx.strokeStyle = C.ring_bg;
    ctx.stroke();
    // прогресс
    var frac = Math.max(0, Math.min(1, pct / 100));
    if (frac > 0) {
      var grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.strokeStyle = grad;
      ctx.shadowColor = colorA;
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  function fmtDate(d) {
    try {
      var dt = new Date(d);
      var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
      var L = (typeof LANG !== 'undefined') ? LANG : 'ru';
      if (L !== 'ru' && typeof MINI_I18N !== 'undefined' && MINI_I18N[L] && MINI_I18N[L].months_full) {
        months = MINI_I18N[L].months_full.split('|').map(function(m){ return m.toLowerCase(); });
      }
      return dt.getDate() + ' ' + (months[dt.getMonth()] || '');
    } catch(e) { return ''; }
  }

  function T(key, fb) { return (typeof window.T === 'function') ? window.T(key, fb) : fb; }

  // ── Главный рендер ───────────────────────────────────────────────────
  function renderCard() {
    var cv = document.getElementById('share-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var d = window._shareDay || { eaten:0, goal:2000, pct:0, protein:0, fat:0, carbs:0, streak:0, date:new Date(), water:0, waterGoal:2000, mealCount:0, topFoods:[] };

    // ── Фон: глубокий градиент ───────────────────────────────────────
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#12101d');
    bg.addColorStop(0.4, '#0c0a14');
    bg.addColorStop(1, '#07060b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Aurora
    function blob(x, y, r, color, alpha) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    }
    blob(W*0.5, 60, 650, '#7c6cff', 0.2);
    blob(W*0.9, 0, 400, '#d8b66a', 0.08);
    blob(0, H*0.6, 500, '#ff5d7e', 0.05);
    blob(W*0.5, H, 600, '#7c6cff', 0.08);

    // ── Шапка ────────────────────────────────────────────────────────
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f2f2f7';
    ctx.font = '800 56px -apple-system, system-ui, sans-serif';
    ctx.fillText('\u{1F957} NutriO', 80, 130);
    ctx.fillStyle = '#9292b0';
    ctx.font = '500 32px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_subtitle','Умный дневник питания'), 80, 178);
    // Дата
    ctx.textAlign = 'right';
    ctx.fillStyle = '#d8b66a';
    ctx.font = '700 36px -apple-system, system-ui, sans-serif';
    ctx.fillText(fmtDate(d.date), W - 80, 130);

    // ── Мотивационный текст ──────────────────────────────────────────
    var motiv = '';
    if (d.pct >= 95 && d.pct <= 105) motiv = '\u{1F3AF} Идеальный баланс!';
    else if (d.pct >= 85) motiv = '\u{1F4AA} Отличный день!';
    else if (d.pct >= 50) motiv = '\u{26A1} На верном пути';
    else if (d.pct > 0) motiv = '\u{1F331} Хорошее начало';
    else motiv = '\u{1F37D}\u{FE0F} Новый день';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b8b4d4';
    ctx.font = '600 38px -apple-system, system-ui, sans-serif';
    ctx.fillText(motiv, W/2, 270);

    // ── Кольцо калорий (ЦЕНТР) ───────────────────────────────────────
    var cx = W/2, cy = 580, R = 240;
    var calColor = d.pct > 115 ? C.pink : (d.pct >= 85 ? C.green : C.accent);
    var calColorB = d.pct > 115 ? '#ff8fa3' : (d.pct >= 85 ? '#5ef0a0' : C.accent2);
    drawRing(ctx, cx, cy, R, 36, Math.min(d.pct, 100), calColor, calColorB);

    // Калории — внутри кольца
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f2f2f7';
    ctx.font = '900 150px -apple-system, system-ui, sans-serif';
    ctx.fillText(String(d.eaten), cx, cy + 10);
    // Процент — ВНУТРИ кольца, под калориями
    ctx.fillStyle = calColor;
    ctx.font = '800 52px -apple-system, system-ui, sans-serif';
    ctx.fillText(d.pct + '%', cx, cy + 80);
    // Подпись цели
    ctx.fillStyle = '#6a6a88';
    ctx.font = '500 34px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_of_goal','из') + ' ' + d.goal + ' ' + T('kcal_short','ккал'), cx, cy + 130);

    // ── Три макро-плитки ─────────────────────────────────────────────
    var tileY = 920, tileH = 170, gap = 28;
    var tileW = (W - 160 - gap*2) / 3;
    var macros = [
      { lbl: T('macro_prot','Белки'), val: d.protein, unit:'г', col: C.green, ic:'\u{1F4AA}' },
      { lbl: T('macro_fat','Жиры'),   val: d.fat,     unit:'г', col: C.gold,  ic:'\u{1F9C8}' },
      { lbl: T('macro_carb','Углев.'),val: d.carbs,   unit:'г', col: C.accent2, ic:'\u{1F35E}' },
    ];
    macros.forEach(function(m, i) {
      var x = 80 + i*(tileW + gap);
      // Фон плитки
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      roundRect(ctx, x, tileY, tileW, tileH, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, tileY, tileW, tileH, 28);
      ctx.stroke();
      // Иконка
      ctx.textAlign = 'center';
      ctx.font = '32px -apple-system, system-ui, sans-serif';
      ctx.fillText(m.ic, x + tileW/2, tileY + 42);
      // Значение
      ctx.fillStyle = m.col;
      ctx.font = '900 64px -apple-system, system-ui, sans-serif';
      ctx.fillText(String(Math.round(m.val)), x + tileW/2, tileY + 112);
      // Подпись
      ctx.fillStyle = '#80809c';
      ctx.font = '600 28px -apple-system, system-ui, sans-serif';
      ctx.fillText(m.lbl + ', ' + m.unit, x + tileW/2, tileY + 150);
    });

    // ── Инфо-полоса: вода + приёмов пищи ─────────────────────────────
    var infoY = 1150;
    var items = [];
    if (d.mealCount > 0) items.push('\u{1F37D}\u{FE0F} ' + d.mealCount + ' ' + (d.mealCount === 1 ? 'приём' : (d.mealCount < 5 ? 'приёма' : 'приёмов')));
    if (d.water > 0) items.push('\u{1F4A7} ' + d.water + ' / ' + d.waterGoal + ' мл');
    if (items.length) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7a7a96';
      ctx.font = '500 34px -apple-system, system-ui, sans-serif';
      ctx.fillText(items.join('     '), W/2, infoY);
    }

    // ── Топ-продукты ─────────────────────────────────────────────────
    if (d.topFoods && d.topFoods.length) {
      var listY = 1230;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      roundRect(ctx, 80, listY, W - 160, Math.min(d.topFoods.length, 4) * 56 + 70, 28);
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#9292b0';
      ctx.font = '700 30px -apple-system, system-ui, sans-serif';
      ctx.fillText('\u{1F4DD} ' + T('share_eaten_today', 'Сегодня в дневнике'), 112, listY + 42);
      ctx.font = '500 30px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = '#b8b4d4';
      var shown = d.topFoods.slice(0, 4);
      shown.forEach(function(food, i) {
        var name = food.charAt(0).toUpperCase() + food.slice(1);
        if (name.length > 35) name = name.slice(0, 33) + '...';
        ctx.fillText('\u{2022} ' + name, 128, listY + 88 + i * 56);
      });
      if (d.topFoods.length > 4) {
        ctx.fillStyle = '#6a6a88';
        ctx.fillText('...и ещё ' + (d.topFoods.length - 4), 128, listY + 88 + 4 * 56);
      }
    }

    // ── Стрик ────────────────────────────────────────────────────────
    if (d.streak && d.streak > 0) {
      var sY = d.topFoods && d.topFoods.length ? 1580 : 1350;
      ctx.textAlign = 'center';
      // Огненный градиент-полоса
      var sGrad = ctx.createLinearGradient(200, sY, W - 200, sY);
      sGrad.addColorStop(0, 'rgba(255,140,50,0.22)');
      sGrad.addColorStop(1, 'rgba(255,80,100,0.18)');
      ctx.fillStyle = sGrad;
      roundRect(ctx, 200, sY, W - 400, 100, 50);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,140,50,0.25)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, 200, sY, W - 400, 100, 50);
      ctx.stroke();
      ctx.fillStyle = '#f2f2f7';
      ctx.font = '800 42px -apple-system, system-ui, sans-serif';
      ctx.fillText('\u{1F525} ' + d.streak + ' ' + T('share_streak_days','дней подряд'), W/2, sY + 62);
    }

    // ── Низ: CTA ─────────────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6a6a88';
    ctx.font = '500 34px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_cta','Считай калории по фото в Telegram'), W/2, 1750);
    // Кнопка-бейдж
    var linkW = 540, linkH = 88, lx = (W - linkW)/2, ly = 1786;
    var lg = ctx.createLinearGradient(lx, ly, lx + linkW, ly);
    lg.addColorStop(0, C.accent);
    lg.addColorStop(1, C.gold);
    ctx.fillStyle = lg;
    roundRect(ctx, lx, ly, linkW, linkH, 44);
    ctx.fill();
    // Свечение кнопки
    ctx.shadowColor = C.accent;
    ctx.shadowBlur = 30;
    roundRect(ctx, lx, ly, linkW, linkH, 44);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Текст кнопки
    ctx.fillStyle = '#0a0a10';
    ctx.font = '800 38px -apple-system, system-ui, sans-serif';
    ctx.fillText('@CaloriePilotAI_Bot', W/2, ly + 56);
  }

  function cardDataURL() {
    var cv = document.getElementById('share-canvas');
    return cv ? cv.toDataURL('image/jpeg', 0.9) : null;
  }

  // ── Публичные действия ───────────────────────────────────────────────
  window.openShareCard = function() {
    if (!window._shareDay) {
      // если дневник ещё не открывали — пробуем подгрузить
      if (typeof loadDiary === 'function') { try { loadDiary(); } catch(e){} }
    }
    var sheet = document.getElementById('share-sheet');
    if (!sheet) return;
    sheet.classList.add('show');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // рендерим после показа (canvas должен быть в DOM)
    setTimeout(renderCard, 50);
    try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
  };

  window.closeShareCard = function() {
    var sheet = document.getElementById('share-sheet');
    if (!sheet) return;
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Поделиться в Stories через Telegram API (нужен публичный URL картинки)
  window.shareToStory = async function() {
    var tg = window.Telegram && window.Telegram.WebApp;
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    var img = cardDataURL();
    if (!img || !uid) { if (typeof showToast==='function') showToast('Открой из Telegram', 'var(--accent2)'); return; }
    if (typeof showToast === 'function') showToast('Готовлю карточку...', 'var(--accent)');
    try {
      var base = window.API_BASE || '/api/proxy';
      console.log('[share] sending to /api/share_card, uid=', uid, 'img size=', img.length);
      var r = await fetch(base + '/api/share_card', {
        method:'POST',
        headers: (window._authHeaders ? window._authHeaders({'Content-Type':'application/json'}) : {'Content-Type':'application/json'}),
        body: JSON.stringify({ user_id: uid, image: img, mode: 'url' })
      });
      console.log('[share] response status:', r.status);
      var text = await r.text();
      console.log('[share] response body:', text.slice(0, 300));
      var data;
      try { data = JSON.parse(text); } catch(pe) { data = { error: 'parse error: ' + text.slice(0, 80) }; }
      if (data.ok && data.url) {
        console.log('[share] got url:', data.url);
        if (tg && tg.shareToStory) {
          tg.shareToStory(data.url, {
            text: '🥗 Мой день в NutriO! @CaloriePilotAI_Bot'
          });
          closeShareCard();
        } else {
          // Telegram-клиент без shareToStory — fallback на чат
          if (typeof showToast === 'function') showToast('Stories недоступны в этой версии TG, отправляю в чат', 'var(--accent2)');
          await shareToChat();
        }
      } else {
        var errMsg = (data && data.error) ? data.error : ('HTTP ' + r.status);
        console.error('[share] error:', errMsg);
        if (typeof showToast === 'function') showToast('Ошибка: ' + errMsg, 'var(--accent2)');
      }
    } catch(e) {
      console.error('[share] exception:', e);
      if (typeof showToast === 'function') showToast('Ошибка соединения: ' + (e.message || e), 'var(--accent2)');
    }
  };

  // Отправить карточку в чат с ботом (бот пришлёт фото с кнопкой)
  window.shareToChat = async function() {
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    var img = cardDataURL();
    if (!img || !uid) { if (typeof showToast==='function') showToast('Открой из Telegram', 'var(--accent2)'); return; }
    if (typeof showToast === 'function') showToast('Отправляю...', 'var(--accent)');
    try {
      var base = window.API_BASE || '/api/proxy';
      console.log('[share-chat] sending, uid=', uid, 'img size=', img.length);
      var r = await fetch(base + '/api/share_card', {
        method:'POST',
        headers: (window._authHeaders ? window._authHeaders({'Content-Type':'application/json'}) : {'Content-Type':'application/json'}),
        body: JSON.stringify({ user_id: uid, image: img, mode: 'chat' })
      });
      console.log('[share-chat] status:', r.status);
      var text = await r.text();
      console.log('[share-chat] body:', text.slice(0, 300));
      var data;
      try { data = JSON.parse(text); } catch(pe) { data = { error: 'parse error: ' + text.slice(0, 80) }; }
      if (data.ok) {
        if (data.sent) {
          if (typeof showToast === 'function') showToast('✅ Отправлено в чат с ботом!', 'var(--green)');
          closeShareCard();
        } else {
          // Файл сохранён но не отправлен в чат (бот не смог send_photo)
          if (typeof showToast === 'function') showToast('Карточка сохранена, но не удалось отправить в чат', 'var(--accent2)');
        }
      } else {
        var errMsg = (data && data.error) ? data.error : ('HTTP ' + r.status);
        console.error('[share-chat] error:', errMsg);
        if (typeof showToast === 'function') showToast('Ошибка: ' + errMsg, 'var(--accent2)');
      }
    } catch(e) {
      console.error('[share-chat] exception:', e);
      if (typeof showToast === 'function') showToast('Ошибка соединения: ' + (e.message || e), 'var(--accent2)');
    }
  };

  // Скачать картинку локально
  window.shareDownload = function() {
    var img = cardDataURL();
    if (!img) return;
    try {
      var a = document.createElement('a');
      a.href = img;
      a.download = 'nutrio_day.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof showToast === 'function') showToast('Картинка сохранена', 'var(--green)');
    } catch(e) {
      if (typeof showToast === 'function') showToast('Ошибка сохранения', 'var(--accent2)');
    }
  };

  window._renderShareCard = renderCard;
})();
