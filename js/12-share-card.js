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
    var d = window._shareDay || { eaten:0, goal:2000, pct:0, protein:0, fat:0, carbs:0, streak:0, date:new Date() };

    // Фон — вертикальный градиент + aurora
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#101018');
    bg.addColorStop(0.5, C.bg0);
    bg.addColorStop(1, '#08080d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Aurora-пятна
    function blob(x, y, r, color, alpha) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    blob(W * 0.5, 120, 600, C.accent, 0.18);
    blob(W * 0.95, 80, 420, C.gold, 0.07);
    blob(W * 0.05, H * 0.55, 500, C.pink, 0.06);

    // ── Шапка: логотип ───────────────────────────────────────────────
    ctx.textAlign = 'left';
    ctx.fillStyle = C.text;
    ctx.font = '800 64px -apple-system, system-ui, sans-serif';
    ctx.fillText('🥗 NutriO', 80, 160);
    ctx.fillStyle = C.text2;
    ctx.font = '500 36px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_subtitle','Умный дневник питания'), 80, 215);

    // Дата справа
    ctx.textAlign = 'right';
    ctx.fillStyle = C.gold;
    ctx.font = '700 40px -apple-system, system-ui, sans-serif';
    ctx.fillText(fmtDate(d.date), W - 80, 160);

    // ── Центральное кольцо калорий ───────────────────────────────────
    var cx = W / 2, cy = 640, R = 290;
    var calColor = d.pct > 115 ? C.pink : (d.pct >= 85 ? C.green : C.accent);
    var calColorB = d.pct > 115 ? '#ff8fa3' : (d.pct >= 85 ? '#5ef0a0' : C.accent2);
    drawRing(ctx, cx, cy, R, 44, d.pct, calColor, calColorB);

    // Цифра калорий
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = '900 180px -apple-system, system-ui, sans-serif';
    ctx.fillText(String(d.eaten), cx, cy + 40);
    ctx.fillStyle = C.text2;
    ctx.font = '600 46px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_of_goal','из') + ' ' + d.goal + ' ' + T('kcal_short','ккал'), cx, cy + 120);

    // Процент-бейдж над кольцом
    var badgeY = cy - R - 10;
    ctx.font = '800 52px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = calColor;
    ctx.fillText(d.pct + '%', cx, badgeY);

    // ── Три макро-плитки ─────────────────────────────────────────────
    var tileY = 1080, tileH = 200, gap = 36;
    var tileW = (W - 160 - gap * 2) / 3;
    var macros = [
      { lbl: T('macro_prot','Белки'), val: d.protein, unit:'г', col: C.green },
      { lbl: T('macro_fat','Жиры'),   val: d.fat,     unit:'г', col: C.gold },
      { lbl: T('macro_carb','Углев.'),val: d.carbs,   unit:'г', col: C.accent2 },
    ];
    macros.forEach(function(m, i) {
      var x = 80 + i * (tileW + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.045)';
      roundRect(ctx, x, tileY, tileW, tileH, 32);
      ctx.fill();
      // верхняя кромка-свет
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 2;
      roundRect(ctx, x, tileY, tileW, tileH, 32);
      ctx.stroke();
      // значение
      ctx.textAlign = 'center';
      ctx.fillStyle = m.col;
      ctx.font = '900 88px -apple-system, system-ui, sans-serif';
      ctx.fillText(String(Math.round(m.val)), x + tileW / 2, tileY + 110);
      // подпись
      ctx.fillStyle = C.text2;
      ctx.font = '600 38px -apple-system, system-ui, sans-serif';
      ctx.fillText(m.lbl + ', ' + m.unit, x + tileW / 2, tileY + 165);
    });

    // ── Стрик-плашка ─────────────────────────────────────────────────
    if (d.streak && d.streak > 0) {
      var sY = 1380;
      var sGrad = ctx.createLinearGradient(80, sY, W - 80, sY);
      sGrad.addColorStop(0, 'rgba(255,159,67,0.18)');
      sGrad.addColorStop(1, 'rgba(255,93,126,0.14)');
      ctx.fillStyle = sGrad;
      roundRect(ctx, 80, sY, W - 160, 150, 36);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,159,67,0.3)';
      ctx.lineWidth = 2;
      roundRect(ctx, 80, sY, W - 160, 150, 36);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = C.text;
      ctx.font = '800 66px -apple-system, system-ui, sans-serif';
      ctx.fillText('🔥 ' + d.streak + ' ' + T('share_streak_days','дней подряд'), W / 2, sY + 95);
    }

    // ── Низ: призыв ──────────────────────────────────────────────────
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text2;
    ctx.font = '500 40px -apple-system, system-ui, sans-serif';
    ctx.fillText(T('share_cta','Считай калории по фото в Telegram'), W / 2, 1660);
    // ссылка-бейдж
    var linkW = 560, linkH = 96, lx = (W - linkW) / 2, ly = 1710;
    var lg = ctx.createLinearGradient(lx, ly, lx + linkW, ly);
    lg.addColorStop(0, C.accent);
    lg.addColorStop(1, C.gold);
    ctx.fillStyle = lg;
    roundRect(ctx, lx, ly, linkW, linkH, 48);
    ctx.fill();
    ctx.fillStyle = '#0a0a10';
    ctx.font = '800 44px -apple-system, system-ui, sans-serif';
    ctx.fillText('@CaloriePilotAI_Bot', W / 2, ly + 62);
  }

  // ── Получить data URL карточки ───────────────────────────────────────
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
      var r = await fetch(base + '/api/share_card', {
        method:'POST',
        headers: (window._authHeaders ? window._authHeaders({'Content-Type':'application/json'}) : {'Content-Type':'application/json'}),
        body: JSON.stringify({ user_id: uid, image: img, mode: 'url' })
      });
      var data = await r.json();
      if (data.ok && data.url && tg && tg.shareToStory) {
        tg.shareToStory(data.url, {
          text: '🥗 Мой день в NutriO — считай калории по фото! @CaloriePilotAI_Bot'
        });
        closeShareCard();
      } else if (data.ok && data.url) {
        // Telegram-клиент без shareToStory (старая версия) — fallback на чат
        if (typeof showToast === 'function') showToast('Stories недоступны, отправляю в чат', 'var(--accent2)');
        await shareToChat();
      } else {
        if (typeof showToast === 'function') showToast('Не удалось подготовить', 'var(--accent2)');
      }
    } catch(e) {
      if (typeof showToast === 'function') showToast('Ошибка: ' + e.message, 'var(--accent2)');
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
      var r = await fetch(base + '/api/share_card', {
        method:'POST',
        headers: (window._authHeaders ? window._authHeaders({'Content-Type':'application/json'}) : {'Content-Type':'application/json'}),
        body: JSON.stringify({ user_id: uid, image: img, mode: 'chat' })
      });
      var data = await r.json();
      if (data.ok && data.sent) {
        if (typeof showToast === 'function') showToast('✅ Отправлено в чат с ботом!', 'var(--green)');
        closeShareCard();
        var tg = window.Telegram && window.Telegram.WebApp;
        if (tg && tg.close) setTimeout(function(){ tg.close(); }, 800);
      } else {
        if (typeof showToast === 'function') showToast('Не удалось отправить', 'var(--accent2)');
      }
    } catch(e) {
      if (typeof showToast === 'function') showToast('Ошибка: ' + e.message, 'var(--accent2)');
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
