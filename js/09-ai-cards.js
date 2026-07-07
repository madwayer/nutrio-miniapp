// Phase 3B — Markdown→HTML for AI replies + heatmap auto-load.
(function(){

  // ── tiny markdown renderer (safe, supports basic syntax) ────────────────
  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function renderMarkdown(text) {
    if (!text) return '';
    var src = String(text).replace(/\r\n/g,'\n');
    // Protect code spans first
    var codes = [];
    src = src.replace(/`([^`\n]+)`/g, function(_, c){ codes.push(c); return '\u0001CODE'+(codes.length-1)+'\u0001'; });

    var lines = src.split('\n');
    var out = [];
    var i = 0;
    function isHeading(l){ var m = l.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/); return m; }
    function isHr(l){ return /^(\s*[-*_]\s*){3,}$/.test(l) || /^---+$/.test(l.trim()); }
    function inlineFmt(s){
      // escape, then inject formatting (bold/italic/links)
      s = escapeHtml(s);
      // bold ** **
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // italic * *  (avoid eating ** already replaced)
      s = s.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
      // links [t](u)
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, t, u){
        var safeU = u.replace(/"/g,'%22');
        return '<a href="'+safeU+'" target="_blank" rel="noopener">'+t+'</a>';
      });
      return s;
    }
    while (i < lines.length) {
      var line = lines[i];
      var trim = line.trim();
      if (!trim) { i++; continue; }
      var h = isHeading(line);
      if (h) { var lvl = Math.min(3, h[1].length); out.push('<h'+lvl+'>'+inlineFmt(h[2])+'</h'+lvl+'>'); i++; continue; }
      if (isHr(line)) { out.push('<hr>'); i++; continue; }
      // unordered list (tolerant of blank lines between items)
      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < lines.length) {
          var cl = lines[i];
          if (/^\s*[-*+]\s+/.test(cl)) {
            items.push('<li>' + inlineFmt(cl.replace(/^\s*[-*+]\s+/, '')) + '</li>');
            i++;
          } else if (!cl.trim()) {
            var k = i + 1;
            while (k < lines.length && !lines[k].trim()) k++;
            if (k < lines.length && /^\s*[-*+]\s+/.test(lines[k])) { i++; }
            else break;
          } else break;
        }
        out.push('<ul>' + items.join('') + '</ul>');
        continue;
      }
      // ordered list (tolerant of blank lines between items)
      if (/^\s*\d+\.\s+/.test(line)) {
        var items2 = [];
        while (i < lines.length) {
          var cl = lines[i];
          if (/^\s*\d+\.\s+/.test(cl)) {
            items2.push('<li>' + inlineFmt(cl.replace(/^\s*\d+\.\s+/, '')) + '</li>');
            i++;
          } else if (!cl.trim()) {
            // Пустая строка — пропускаем если дальше ещё цифра
            var k = i + 1;
            while (k < lines.length && !lines[k].trim()) k++;
            if (k < lines.length && /^\s*\d+\.\s+/.test(lines[k])) { i++; }
            else break;
          } else break;
        }
        out.push('<ol>' + items2.join('') + '</ol>');
        continue;
      }
      // blockquote
      if (/^\s*>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quote.push(inlineFmt(lines[i].replace(/^\s*>\s?/, '')));
          i++;
        }
        out.push('<blockquote>' + quote.join('<br>') + '</blockquote>');
        continue;
      }
      // paragraph (collect until blank/heading)
      var para = [];
      while (i < lines.length) {
        var ln = lines[i];
        if (!ln.trim()) break;
        if (isHeading(ln) || isHr(ln) || /^\s*[-*+]\s+/.test(ln) || /^\s*\d+\.\s+/.test(ln) || /^\s*>\s?/.test(ln)) break;
        para.push(inlineFmt(ln));
        i++;
      }
      out.push('<p>' + para.join('<br>') + '</p>');
    }
    var html = out.join('\n');
    // restore codes
    html = html.replace(/\u0001CODE(\d+)\u0001/g, function(_, idx){
      return '<code>' + escapeHtml(codes[+idx]) + '</code>';
    });
    return html;
  }
  window.renderMarkdown = renderMarkdown;

  // ── AI result card framing ──────────────────────────────────────────────
  var AI_META = {
    'nutri-result':  { ic: '🤖', title: (window.T?T('ai_nutri_title','Персональный анализ'):'Персональный анализ'), sub: (window.T?T('ai_nutri_sub','Нутрициолог AI · последние 14 дней'):'Нутрициолог AI · последние 14 дней') },
    'plan-result':   { ic: '📅', title: (window.T?T('ai_plan_title','План питания'):'План питания'), sub: (window.T?T('ai_card_sub','Сгенерировано AI'):'Сгенерировано AI') },
    'recipe-result': { ic: '👨‍🍳', title: (window.T?T('ai_recipe_title','Рецепт от шефа'):'Рецепт от шефа'), sub: (window.T?T('ai_card_sub','Сгенерировано AI'):'Сгенерировано AI') }
  };

// Phase 3J — clean AI text before rendering
function cleanAiText(text) {
  if (!text) return text;
  // Remove recipe/рецепт numbers: "рецепт #1234:" / "recipe #1234:"
  text = text.replace(/рецепт\s*#\d+\s*:?\s*/gi, '');
  text = text.replace(/recipe\s*#\d+\s*:?\s*/gi, '');
  text = text.replace(/\u0440\u0435\u0446\u0435\u043f\u0442\s*#\d+\s*:?\s*/gi, '');
  // Фикс КБЖУ на порцию → На порцию (матчим полное слово, не обрезаем)
  text = text.replace(/\u041a[\u0411\u0431][\u0416\u0436]?[\u0423\u0443]\s+[Нн]а\s+порцию\s*:?/gi, '\u041d\u0430 \u043f\u043e\u0440\u0446\u0438\u044e:');
  text = text.replace(/\u041a[\u0411\u0431][\u0416\u0436]?[\u0423\u0443]\s+[Нн]а\s+\u043f\u043e\u0440\u0446\u0438\u044e\s*:?/gi, '\u041d\u0430 \u043f\u043e\u0440\u0446\u0438\u044e:');
  // Убрать двойное двоеточие если осталось
  text = text.replace(/::\s*/g, ': ');
  text = text.replace(/:\s*ию\s*:/gi, ':');
  text = text.replace(/\u041a[\u0411\u0431][\u0416\u0436]?[\u0423\u0443]/g, '\u041a\u0411\u0416\u0423');
  text = text.replace(/KBZhU/gi, '\u041a\u0411\u0416\u0423');
  text = text.replace(/KBZU/gi, '\u041a\u0411\u0416\u0423');
  var _sects = ['\u0418\u043d\u0433\u0440\u0435\u0434\u0438\u0435\u043d\u0442\u044b','Ingredients','\u0418\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438','Instructions','\u041f\u0440\u0438\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u0435','Preparation','Directions','Steps','Nutrition','\u041d\u0430 \u043f\u043e\u0440\u0446\u0438\u044e','\u041a\u0411\u0416\u0423'];
  _sects.forEach(function(s){ text = text.replace(new RegExp('(' + s + '[:\\s]*)\\n{2,}', 'g'), '$1\n'); });
  text = text.replace(/(#{1,3}[^\n]+)\n{2,}/g, '$1\n');
  text = text.replace(/(\*\*[^*\n]+\*\*)\n{2,}/g, '$1\n');
  return text;
}
window.cleanAiText = cleanAiText;

  function wrapResult(elId, htmlContent) {
    var el = document.getElementById(elId);
    if (!el) return;
    var meta = AI_META[elId] || { ic: '✨', title: 'Результат', sub: 'AI' };
    el.classList.add('show');
    el.innerHTML =
      '<div class="ai-result-inner">' +
        '<div class="ai-result-header">' +
          '<div class="ai-result-header-icon">' + meta.ic + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="ai-result-header-title">' + meta.title + '</div>' +
            '<div class="ai-result-header-sub">' + meta.sub + '</div>' +
          '</div>' +
          '<button class="ai-result-copy" onclick="_aiCopy(this, \'' + elId + '\')">' + (window.T?T('ai_copy','📋 Копир.'):'📋 Копир.') + '</button>' +
        '</div>' +
        '<div class="ai-content">' + htmlContent + '</div>' +
      '</div>';
  }
  window._aiCopy = function(btn, elId) {
    var c = document.getElementById(elId);
    if (!c) return;
    var contentEl = c.querySelector('.ai-content');
    if (!contentEl) return;
    var text = contentEl.innerText || contentEl.textContent || '';
    try {
      navigator.clipboard.writeText(text);
      btn.textContent = T('ai_copied','✓ Скопир.');
      setTimeout(function(){ btn.textContent = T('ai_copy','📋 Копир.'); }, 1600);
    } catch(e) {
      if (typeof showToast === 'function') showToast(T('ai_copy_fail','Не удалось скопировать'), 'var(--accent2)');
    }
  };

  // Patch the three result-setting paths.
  // The original code uses `res.textContent = data.text;` — we hijack the
  // `textContent` assignment by wrapping the three runners (already exposed
  // on window). We monkey-patch by post-rendering after each call completes.
  ['runNutritionist','runMealPlan','runRecipe'].forEach(function(fnName){
    var orig = window[fnName];
    if (typeof orig !== 'function') return;
    window[fnName] = async function(){
      await orig.apply(this, arguments);
      // After the original sets textContent, convert to formatted HTML
      var map = { runNutritionist: 'nutri-result', runMealPlan: 'plan-result', runRecipe: 'recipe-result' };
      var elId = map[fnName];
      var el = document.getElementById(elId);
      if (!el) return;
      // If original wrote raw markdown via textContent, the element will have only text content (no nested elements).
      if (el.children.length === 0 && el.textContent.trim().length > 0) {
        var md = el.textContent;
        wrapResult(elId, renderMarkdown(cleanAiText(md)));
      } else if (el.children.length === 1 && el.firstElementChild.classList && el.firstElementChild.classList.contains('ai-loading')) {
        // still loading — leave it
      } else if (el.querySelector('.ai-content')) {
        // already wrapped — nothing to do
      }
    };
  });

  // ── Meal plan: days picker UI ──────────────────────────────────────────
  function ensurePlanDaysPicker() {
    var planResult = document.getElementById('plan-result');
    if (!planResult) return;
    if (document.getElementById('plan-days-picker')) return;
    var row = document.createElement('div');
    row.id = 'plan-days-picker';
    row.className = 'plan-days-row';
    row.innerHTML =
      '<button class="plan-days-btn" data-d="3"><span class="pd-n">3</span><span class="pd-l">дня</span></button>' +
      '<button class="plan-days-btn active" data-d="5"><span class="pd-n">5</span><span class="pd-l">дней</span></button>' +
      '<button class="plan-days-btn" data-d="7"><span class="pd-n">7</span><span class="pd-l">дней</span></button>';
    // Insert right before the run button
    var btn = document.getElementById('plan-btn');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(row, btn);
    window.planDays = 5;
    row.querySelectorAll('.plan-days-btn').forEach(function(b){
      b.addEventListener('click', function(){
        row.querySelectorAll('.plan-days-btn').forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
        window.planDays = parseInt(b.getAttribute('data-d'), 10);
        try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.selectionChanged(); } catch(e){}
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensurePlanDaysPicker);
  else ensurePlanDaysPicker();

  // ── Heatmap auto-load on Progress tab open ─────────────────────────────
  var origSwitch = window.switchTab;
  if (typeof origSwitch === 'function') {
    window.switchTab = function(tab){
      var r = origSwitch.apply(this, arguments);
      if (tab === 'progress' && window.NutrioHeatmap && window.NutrioHeatmap.load && !window._hmAutoLoaded) {
        window._hmAutoLoaded = true;
        setTimeout(function(){
          try { window.NutrioHeatmap.load(); } catch(e){}
        }, 250);
      }
      return r;
    };
  }
})();

// ── Help page: rebuild content (rewrite) ──────────────────────────────────
(function(){
  function buildHelp() {
    var page = document.getElementById('page-helppage');
    if (!page) return;
    page.innerHTML =
      '<div class="help-hero">' +
        '<div class="help-hero-icon">🥗</div>' +
        '<div class="help-hero-title">Чем тебе помочь?</div>' +
        '<div class="help-hero-sub">Открой бота, напиши в поддержку или загляни в канал NutriO</div>' +
      '</div>' +
      '<div class="help-btn-row">' +
        '<button class="help-btn help-btn-primary" onclick="_openBotChat()">' +
          '<span class="help-btn-ic">🤖</span><span class="help-btn-lbl">Открыть бота</span>' +
        '</button>' +
        '<button class="help-btn help-btn-support" onclick="_helpSupport()">' +
          '<span class="help-btn-ic">💬</span><span class="help-btn-lbl">Техподдержка</span>' +
        '</button>' +
        '<button class="help-btn help-btn-channel" onclick="_openTg(\'NutriO_official\')">' +
          '<span class="help-btn-ic">📢</span><span class="help-btn-lbl">Канал</span>' +
        '</button>' +
        '<button class="help-btn help-btn-rate" onclick="_helpDonate()">' +
          '<span class="help-btn-ic">❤️</span><span class="help-btn-lbl">Поддержать проект</span>' +
        '</button>' +
      '</div>' +
      '<div class="section-title" style="margin-top:8px">Частые вопросы</div>' +
      '<div class="faq-section">' +
        _faq('Как считаются калории?', 'AI распознаёт состав блюда по фото или штрихкоду, считает КБЖУ на указанный вес. Можно отредактировать порцию — пересчёт мгновенный. Также доступен ввод вручную, голосом или через базу из 5 млн штрихкодов.') +
        _faq('Сколько фото можно распознавать?', 'Free — 5 фото в день, Basic — 20, Standard — 40, Premium — 80. Лимит сбрасывается каждые сутки.') +
        _faq('Чем отличаются тарифы?', 'Basic (449₽/мес), Standard (1199₽/3мес), Premium (3990₽/год) отличаются лимитами фото, AI-нутрициолога, планов питания и рецептов. Полный PDF-отчёт (30 и 90 дней) доступен на любом платном тарифе.') +
        _faq('Что входит в платные тарифы?', 'Больше фото-распознаваний в день (до 80 на Premium), расширенный лимит AI-нутрициолога, планов питания и рецептов, полный PDF-отчёт с графиками на 30 и 90 дней, приоритет в техподдержке.') +
        _faq('Как добавить тренировку?', 'Вкладка «Спорт» → выбери упражнение или введи своё → укажи длительность. Сожжённые калории видны в Дневнике. Хочешь чтобы они прибавлялись к дневной норме — включи опцию «Тренировки в норме» в Настройках (по умолчанию выключена).') +
        _faq('Что такое Health Score?', 'Индекс здоровья 0–100 на основе 7 компонентов: калории, белок, вода, разнообразие питания, клетчатка, баланс КБЖУ и стрик. Обновляется каждый день в 21:00. Найти в вкладке «Score».') +
        _faq('Как работает интервальное голодание?', 'Вкладка «Голодание» → выбери протокол (16:8, 18:6, 20:4 или 24ч) → нажми «Начать». Таймер покажет сколько осталось. По завершению приходит уведомление в бот.') +
        _faq('Как добавить свой продукт?', 'В нижней панели «Ещё» → «Мои продукты» → «Добавить». Сохранённое всегда под рукой в калькуляторе.') +
        _faq('Не работает сканер штрихкода', 'Проверь что Telegram имеет доступ к камере (Настройки телефона → Telegram → Камера). База содержит 5 млн штрихкодов — если продукт не найден, можно добавить вручную.') +
        _faq('Как сменить цель калорий?', 'Открой «Ещё» → ⚙️ Настройки → раздел Профиль. Поменяй вес, рост или цель — норма пересчитается автоматически.') +
        _faq('Как настроить часовой пояс?', 'Часовой пояс определяется автоматически с твоего устройства при открытии приложения. Если что-то не так — поменяй вручную в Настройках или командой /timezone в боте.') +
        _faq('Могу я удалить запись воды?', 'Да. Во вкладке «Вода» рядом с каждой записью за сегодня есть крестик ✕ — нажми чтобы удалить, если ошибся с объёмом.') +
        _faq('Можно ли импортировать данные?', 'Да. «Ещё» → 📥 Импорт. Поддерживаются CSV из MyFitnessPal, FatSecret, Yazio, Cronometer и любой CSV с колонками Food, Calories, Protein, Fat, Carbs. До 5000 записей за раз.') +
        _faq('Где мой дневник за прошлые дни?', 'На вкладке «Дневник» стрелочки ← → перелистывают дни. Тапни по дате — откроется календарь.') +
        _faq('Что такое стрик?', 'Количество дней подряд когда ты записывал еду. Стрик виден в Дневнике и влияет на Health Score. Не прерывай — за длинные стрики начисляются достижения.') +
        _faq('Как получить бонус за рефералку?', 'Отправь другу свою реферальную ссылку из раздела Premium. Когда он пройдёт регистрацию и добавит первую запись еды — тебе автоматически начислится Basic на 7 дней.') +
        _faq('Что будет когда закончится подписка?', 'Тариф автоматически переключится на Free, придёт уведомление в бот. Все твои записи, история и достижения сохранятся — доступ к ним не теряется.') +
        _faq('Не приходят напоминания', 'Зайди в «Ещё» → Настройки → Напоминания. Включи нужные и выбери время. Бот должен быть не заблокирован в Telegram.') +
        _faq('Как скачать PDF-отчёт?', 'На Free доступен бесплатный отчёт за 7 дней и превью Premium-версии с водяным знаком. На любом платном тарифе — полный отчёт за 30 или 90 дней с графиками, диаграммой БЖУ и историей веса.') +
        _faq('Как поддержать проект?', 'Помощь → «❤️ Поддержать проект». Принимаем Telegram Stars, TON/крипту или перевод на карту (РФ). Любая сумма помогает развитию.') +
      '</div>' +
      '<div class="help-footer">NutriO · версия Mini App ' + (document.querySelector('meta[name="nutrio-version"]')||{}).content + '</div>';
  }
  function _faq(q, a) {
    return '<div class="faq-item" onclick="this.classList.toggle(\'open\')">' +
      '<div class="faq-q"><span>' + q + '</span><span class="faq-arrow">⌄</span></div>' +
      '<div class="faq-a">' + a + '</div>' +
    '</div>';
  }
  window._openTg = function(username) {
    var url = 'https://t.me/' + username;
    try {
      if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(url); return;
      }
    } catch(e){}
    window.open(url, '_blank');
  };
  // Открыть чат с ботом и закрыть Mini App, чтобы юзер увидел чат на основном слое.
  // openTelegramLink сам по себе НЕ сворачивает миниапп — он открывает поверх, и
  // юзер не понимает что произошло. Закрытие миниаппа после короткой паузы решает это.
  window._openBotChat = function() {
    var url = 'https://t.me/CaloriePilotAI_Bot';
    try {
      if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch(e) { window.open(url, '_blank'); }
    // Даём Telegram время начать переход — потом закрываемся.
    setTimeout(function(){
      try {
        // minimize() сворачивает миниапп вместо закрытия (Bot API 8.0+);
        // если недоступен — просто не закрываем, приложение остаётся открытым.
        if (window.Telegram && Telegram.WebApp) {
          var tgwa = Telegram.WebApp;
          if (tgwa.minimize) tgwa.minimize();
          // если minimize нет — не делаем ничего, юзер сам вернётся
        }
      } catch(e){}
    }, 250);
  };
  // Универсальная функция: послать /api/help_action и закрыть Mini App.
  async function _helpAction(action, toastOk, toastErr) {
    try {
      if (typeof apiPost === 'function') {
        var d = await apiPost('/api/help_action', { action: action });
        if (d && d.ok) {
          if (typeof showToast === 'function') showToast(toastOk, 'var(--green)');
          // Даём Telegram время доставить пуш — потом закрываем Mini App
          setTimeout(function(){
            try { // minimize() сворачивает миниапп вместо закрытия (Bot API 8.0+);
        // если недоступен — просто не закрываем, приложение остаётся открытым.
        if (window.Telegram && Telegram.WebApp) {
          var tgwa = Telegram.WebApp;
          if (tgwa.minimize) tgwa.minimize();
          // если minimize нет — не делаем ничего, юзер сам вернётся
        } } catch(e){}
          }, 400);
          return;
        }
      }
      if (typeof showToast === 'function') showToast(toastErr, 'var(--accent2)');
    } catch(e) {
      if (typeof showToast === 'function') showToast(toastErr, 'var(--accent2)');
    }
  }
  // Открывает inline-модал «Опиши проблему» прямо в Mini App.
  // Так не зависим от Telegram navigation и юзеру не нужно прыгать между окнами.
  window._helpSupport = function(){
    try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
    var existing = document.getElementById('nutrio-support-modal');
    if (existing) document.body.removeChild(existing);
    var overlay = document.createElement('div');
    overlay.id = 'nutrio-support-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:flex-end;justify-content:center;padding:0';
    overlay.innerHTML =
      '<div style="background:var(--surface);border-radius:18px 18px 0 0;padding:20px 18px 24px;width:100%;max-width:520px;box-shadow:0 -8px 30px rgba(0,0,0,.4);max-height:90vh;overflow-y:auto">' +
        '<div style="width:36px;height:4px;background:var(--text2);opacity:.35;border-radius:2px;margin:0 auto 14px"></div>' +
        '<div style="font-weight:800;font-size:17px;margin-bottom:6px">💬 Техподдержка NutriO</div>' +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:14px">Опиши проблему или вопрос. Мы получим сообщение и ответим тебе в чат с ботом.</div>' +
        '<textarea id="nsup-msg" placeholder="Например: При сохранении продукта появляется ошибка..." rows="5"' +
          ' style="width:100%;box-sizing:border-box;padding:12px;background:var(--surface2);color:var(--text);border:1px solid var(--glass-border);border-radius:12px;font:inherit;font-size:14px;resize:vertical;min-height:90px"></textarea>' +
        '<input id="nsup-email" type="email" placeholder="Email (опционально, для обратной связи)"' +
          ' style="width:100%;box-sizing:border-box;padding:10px 12px;margin-top:8px;background:var(--surface2);color:var(--text);border:1px solid var(--glass-border);border-radius:10px;font:inherit;font-size:13px">' +
        '<div style="display:flex;gap:8px;margin-top:10px;align-items:center">' +
          '<label for="nsup-file" style="display:flex;align-items:center;gap:6px;padding:10px 12px;background:var(--surface2);border:1px solid var(--glass-border);border-radius:10px;cursor:pointer;font-size:13px;color:var(--text2);font-weight:600">📎 Скриншот</label>' +
          '<input id="nsup-file" type="file" accept="image/*" style="display:none">' +
          '<span id="nsup-file-name" style="font-size:12px;color:var(--text2);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>' +
          '<button id="nsup-file-clear" type="button" style="display:none;background:transparent;border:none;color:var(--accent2);font-size:18px;cursor:pointer;padding:0 6px">×</button>' +
        '</div>' +
        '<img id="nsup-preview" alt="" style="display:none;max-width:100%;max-height:220px;border-radius:10px;margin-top:10px;object-fit:contain;background:var(--surface2)">' +
        '<div style="display:flex;gap:10px;margin-top:14px">' +
          '<button id="nsup-cancel" style="flex:1;padding:13px;background:var(--surface2);color:var(--text);border:none;border-radius:11px;font:inherit;font-size:14px;font-weight:700;cursor:pointer">Отмена</button>' +
          '<button id="nsup-send"   style="flex:2;padding:13px;background:var(--accent);color:#fff;border:none;border-radius:11px;font:inherit;font-size:14px;font-weight:700;cursor:pointer">📤 Отправить</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var attachedBase64 = '';
    var fileInput = document.getElementById('nsup-file');
    var fileName  = document.getElementById('nsup-file-name');
    var fileClear = document.getElementById('nsup-file-clear');
    var preview   = document.getElementById('nsup-preview');

    fileInput.addEventListener('change', function(){
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      // Сжимаем картинку на клиенте: max 1280px по большей стороне, JPEG 80%.
      // Это даёт 100-400 КБ вместо 2-5 МБ исходника телефонной камеры.
      var reader = new FileReader();
      reader.onload = function(ev){
        var img = new Image();
        img.onload = function(){
          var maxDim = 1280;
          var w = img.naturalWidth, h = img.naturalHeight;
          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.round(w * scale), ch = Math.round(h * scale);
          var canvas = document.createElement('canvas');
          canvas.width = cw; canvas.height = ch;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, cw, ch);
          try {
            attachedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            var approxKb = Math.round(attachedBase64.length * 0.75 / 1024);
            fileName.textContent = f.name + ' · сжато до ~' + approxKb + ' КБ';
            fileClear.style.display = 'inline-block';
            preview.src = attachedBase64;
            preview.style.display = 'block';
          } catch(e) {
            if (typeof showToast === 'function') showToast('Не удалось обработать картинку', 'var(--accent2)');
            console.error('[support] image compress failed', e);
          }
        };
        img.onerror = function(){
          if (typeof showToast === 'function') showToast('Не удалось прочитать картинку', 'var(--accent2)');
        };
        img.src = ev.target.result;
      };
      reader.onerror = function(){
        if (typeof showToast === 'function') showToast('Не удалось открыть файл', 'var(--accent2)');
      };
      reader.readAsDataURL(f);
    });
    fileClear.addEventListener('click', function(){
      attachedBase64 = ''; fileInput.value = '';
      fileName.textContent = ''; fileClear.style.display = 'none';
      preview.src = ''; preview.style.display = 'none';
    });

    document.getElementById('nsup-cancel').onclick = function(){ document.body.removeChild(overlay); };
    document.getElementById('nsup-send').onclick = async function(){
      var msg   = (document.getElementById('nsup-msg').value || '').trim();
      var email = (document.getElementById('nsup-email').value || '').trim();
      if (msg.length < 5) {
        if (typeof showToast === 'function') showToast('Опиши проблему чуть подробнее', 'var(--accent2)');
        return;
      }
      var btn = document.getElementById('nsup-send');
      btn.disabled = true; btn.textContent = '⏳ Отправляю...';
      try {
        var payload = { message: msg, email: email };
        if (attachedBase64) payload.image_base64 = attachedBase64;
        console.log('[support] sending, payload size ~' + Math.round(JSON.stringify(payload).length/1024) + ' КБ');
        var d = (typeof apiPost === 'function')
          ? await apiPost('/api/support_send', payload)
          : {error: 'no api'};
        console.log('[support] response:', d);
        if (d && d.ok) {
          document.body.removeChild(overlay);
          if (typeof showToast === 'function') showToast('✅ Сообщение отправлено! Ответ придёт в чат с ботом.', 'var(--green)');
        } else {
          btn.disabled = false; btn.textContent = '📤 Отправить';
          if (typeof showToast === 'function') showToast('Ошибка: ' + (d && d.error ? d.error : 'не удалось'), 'var(--accent2)');
        }
      } catch(e) {
        btn.disabled = false; btn.textContent = '📤 Отправить';
        console.error('[support] send error:', e);
        if (typeof showToast === 'function') showToast('Ошибка соединения: ' + e.message, 'var(--accent2)');
      }
    };
  };
  window._helpDonate = function() {
    try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
    // Открываем бота с deep-link donate — WebApp закрывается автоматически
    if (typeof openTgLink === 'function') {
      openTgLink('https://t.me/CaloriePilotAI_Bot?start=donate');
    } else {
      try { window.Telegram.WebApp.openTelegramLink('https://t.me/CaloriePilotAI_Bot?start=donate'); } catch(e) {}
    }
  };
  window._helpRate = function() {
    _openTg('CaloriePilotAI_Bot?start=rate');
    if (typeof showToast === 'function') showToast('Спасибо за оценку! ⭐', 'var(--green)');
    try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
  };
  // Patch initHelpPage so the rewrite is applied when Help is opened
  var origInit = window.initHelpPage;
  window.initHelpPage = function(){
    try { if (typeof origInit === 'function') origInit.apply(this, arguments); } catch(e){}
    buildHelp();
  };
})();
