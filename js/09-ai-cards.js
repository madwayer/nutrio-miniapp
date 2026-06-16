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
        '<button class="help-btn help-btn-support" onclick="_openTg(\'CaloriePilotAI_Bot?start=support\')">' +
          '<span class="help-btn-ic">💬</span><span class="help-btn-lbl">Техподдержка</span>' +
        '</button>' +
        '<button class="help-btn help-btn-channel" onclick="_openTg(\'NutriO_official\')">' +
          '<span class="help-btn-ic">📢</span><span class="help-btn-lbl">Канал</span>' +
        '</button>' +
        '<button class="help-btn help-btn-rate" onclick="_helpDonate()">' +
          '<span class="help-btn-ic">❤️</span><span class="help-btn-lbl">Поддержать</span>' +
        '</button>' +
      '</div>' +
      '<div class="section-title" style="margin-top:8px">Частые вопросы</div>' +
      '<div class="faq-section">' +
        _faq('Как считаются калории?', 'AI определяет состав блюда по фото или штрихкоду, затем рассчитывает КБЖУ на указанную порцию. Можно отредактировать вес — пересчёт мгновенный.') +
        _faq('Сколько фото в день можно?', 'Бесплатно — 10 фото в день. С Premium — без ограничений.') +
        _faq('Что в Premium?', 'Безлимит фото-распознавания, голосовых, AI-нутрициолога (3 раза/мес у free), генератор рецептов (10 у free), планировщик питания, PDF-отчёты до 90 дней, без рекламы.') +
        _faq('Как добавить свой продукт?', 'В нижней панели нажми "+" → Мои продукты → "Добавить". Сохранённое будет в быстром доступе.') +
        _faq('Не работает сканер штрихкода', 'Проверь что в браузере/Telegram разрешён доступ к камере. На некоторых старых устройствах сканер запускается медленно — подержи штрихкод неподвижно 2-3 секунды.') +
        _faq('Как сменить цель калорий?', 'Открой Настройки (Ещё → ⚙️) → раздел Профиль → вес, цель, активность. Норма пересчитается автоматически.') +
        _faq('Можно ли импортировать данные?', 'Да. Ещё → Импорт. Поддерживаются CSV из MyFitnessPal, FatSecret, Yazio. До 5000 записей за раз.') +
        _faq('Где мой дневник за прошлые дни?', 'На вкладке Дневник стрелочки ← → перелистывают дни. Тапни по дате — откроется календарь.') +
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
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.close) Telegram.WebApp.close();
      } catch(e){}
    }, 250);
  };
  window._helpDonate = function() {
    var url = 'https://t.me/CaloriePilotAI_Bot?start=donate';
    try {
      if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(url);
      } else { window.open(url, '_blank'); }
      if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light');
    } catch(e) { window.open(url, '_blank'); }
    setTimeout(function(){
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.close) Telegram.WebApp.close(); } catch(e){}
    }, 250);
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
