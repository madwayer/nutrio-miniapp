// ═══════════════════════════════════════════════════════════════
// AI НУТРИЦИОЛОГ — диалоговый чат  (14-ai-chat.js)
// Multi-turn, история из БД, typing indicator, контекст дневника.
// ═══════════════════════════════════════════════════════════════

(function(){

var _chatHistory  = [];
var _chatLoaded   = false;
var _chatSending  = false;

// ── Инициализация ────────────────────────────────────────────────
async function initAiChatPage() {
  if (!_chatLoaded) {
    _chatLoaded = true;
    await _chatLoadHistory();
  }
  // Скролл вниз
  _chatScrollToBottom();
  // Фокус на инпут
  var inp = document.getElementById('chat-input');
  if (inp) inp.focus();
}
window.initAiChatPage = initAiChatPage;

// ── Загрузка истории ─────────────────────────────────────────────
async function _chatLoadHistory() {
  try {
    var d = await apiGet('/api/chat/history');
    if (d && d.ok && d.messages) {
      _chatHistory = d.messages;
      _chatRenderAll();
    } else {
      _chatShowWelcome();
    }
  } catch(e) {
    _chatShowWelcome();
  }
}

function _chatShowWelcome() {
  var ru = _chatIsRu();
  _chatHistory = [];
  var list = document.getElementById('chat-messages');
  if (!list) return;
  list.innerHTML =
    '<div class="chat-welcome">'
    + '<div style="font-size:48px;margin-bottom:12px">🥗</div>'
    + '<div style="font-weight:800;font-size:17px;color:var(--text);margin-bottom:8px">'
    +   (ru ? 'Привет! Я твой AI-нутрициолог' : 'Hi! I\'m your AI nutritionist')
    + '</div>'
    + '<div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:16px">'
    +   (ru
        ? 'Задавай любые вопросы о питании, здоровье, весе и рецептах. Я вижу твой дневник и дам персональные рекомендации.'
        : 'Ask me anything about nutrition, health, weight and recipes. I can see your food diary and give personalized advice.')
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px">'
    + _chatSuggestBtn(ru ? '🔥 Разбери мой вчерашний день' : '🔥 Analyze my yesterday\'s eating')
    + _chatSuggestBtn(ru ? '💪 Как набрать мышечную массу?' : '💪 How to build muscle?')
    + _chatSuggestBtn(ru ? '🥗 Что съесть после тренировки?' : '🥗 What to eat after workout?')
    + _chatSuggestBtn(ru ? '💧 Достаточно ли я пью воды?' : '💧 Am I drinking enough water?')
    + '</div>'
    + '</div>';
}

function _chatSuggestBtn(text) {
  return '<button onclick="chatSuggest(\'' + text.replace(/'/g,"\\'") + '\')" style="'
    + 'padding:12px 14px;background:var(--surface2);border:1px solid var(--glass-border);'
    + 'border-radius:12px;font:inherit;font-size:13px;color:var(--text);cursor:pointer;'
    + 'text-align:left;touch-action:manipulation">' + text + '</button>';
}

function chatSuggest(text) {
  var inp = document.getElementById('chat-input');
  if (inp) { inp.value = text; inp.focus(); }
  chatSend();
}
window.chatSuggest = chatSuggest;

// ── Рендер всех сообщений ────────────────────────────────────────
function _chatRenderAll() {
  var list = document.getElementById('chat-messages');
  if (!list) return;
  if (!_chatHistory.length) { _chatShowWelcome(); return; }
  list.innerHTML = _chatHistory.map(_chatMsgHtml).join('');
  _chatScrollToBottom();
}

function _chatMsgHtml(msg) {
  var isUser = msg.role === 'user';
  var text   = _chatEscape(msg.content || '');
  // Заменяем переносы строк
  text = text.replace(/\n/g, '<br>');

  return '<div class="chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-ai') + '">'
    + (isUser ? '' : '<div class="chat-msg-avatar">🥗</div>')
    + '<div class="chat-msg-bubble" style="'
    +   (isUser
        ? 'background:var(--accent);color:#fff;margin-left:auto;border-radius:18px 18px 4px 18px;'
        : 'background:var(--surface);border:1px solid var(--glass-border);border-radius:18px 18px 18px 4px;')
    +   'padding:12px 14px;max-width:82%;font-size:14px;line-height:1.5;word-wrap:break-word;'
    + '">' + text + '</div>'
    + '</div>';
}

// ── Отправка сообщения ───────────────────────────────────────────
async function chatSend() {
  if (_chatSending) return;
  var inp  = document.getElementById('chat-input');
  var text = (inp && inp.value || '').trim();
  if (!text) return;

  _chatSending = true;
  inp.value = '';
  inp.style.height = 'auto';

  var ru = _chatIsRu();

  // Добавляем сообщение юзера
  _chatHistory.push({role: 'user', content: text});
  _chatAppendMsg({role: 'user', content: text});

  // Typing indicator
  var typingId = 'chat-typing-' + Date.now();
  _chatAppendTyping(typingId);

  try {
    var d = await apiPost('/api/chat', {message: text, lang: ru ? 'ru' : 'en'});

    // Удаляем typing
    var typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    if (d && d.ok && d.reply) {
      _chatHistory.push({role: 'assistant', content: d.reply});
      _chatAppendMsg({role: 'assistant', content: d.reply});
    } else if (d && d.error === 'limit') {
      // Лимит исчерпан
      var limitMsg = d.tip_ru || d.tip_en || (ru ? 'Лимит запросов исчерпан' : 'Query limit reached');
      _chatAppendSystem(limitMsg, 'var(--accent2)');
      // Кнопка Premium
      _chatAppendSystem(
        '<button onclick="switchTab(\'prempage\')" style="padding:10px 16px;background:var(--accent);color:#fff;border:none;border-radius:10px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;margin-top:6px">'
        + '⭐ ' + (ru ? 'Открыть Premium' : 'Get Premium')
        + '</button>',
        ''
      );
    } else {
      _chatAppendSystem(ru ? 'Ошибка. Попробуй ещё раз.' : 'Error. Please try again.', 'var(--accent2)');
    }
  } catch(e) {
    var typingEl2 = document.getElementById(typingId);
    if (typingEl2) typingEl2.remove();
    _chatAppendSystem(ru ? 'Нет соединения' : 'Connection error', 'var(--accent2)');
  }

  _chatSending = false;
  _chatScrollToBottom();

  // Haptic
  try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
}
window.chatSend = chatSend;

// Отправка по Enter (Shift+Enter = новая строка)
function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatSend();
  }
  // Авторесайз textarea
  var ta = e.target;
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
}
window.chatKeydown = chatKeydown;

// ── Очистить историю ─────────────────────────────────────────────
async function chatClear() {
  var ru = _chatIsRu();
  showConfirm(
    ru ? 'Начать новый диалог? История будет удалена.' : 'Start new conversation? History will be cleared.',
    async function() {
      try {
        await apiPost('/api/chat', {reset: true});
        _chatHistory = [];
        _chatLoaded  = false;
        _chatShowWelcome();
      } catch(e) {}
    },
    null,
    {yes: ru ? '🗑 Очистить' : '🗑 Clear', yesColor: 'var(--accent2)'}
  );
}
window.chatClear = chatClear;

// ── DOM helpers ──────────────────────────────────────────────────
function _chatAppendMsg(msg) {
  var list = document.getElementById('chat-messages');
  if (!list) return;
  // Если там было welcome — очищаем
  var welcome = list.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  var div = document.createElement('div');
  div.innerHTML = _chatMsgHtml(msg);
  list.appendChild(div.firstChild);
  _chatScrollToBottom();
}

function _chatAppendTyping(id) {
  var list = document.getElementById('chat-messages');
  if (!list) return;
  var div = document.createElement('div');
  div.id = id;
  div.className = 'chat-msg chat-msg-ai';
  div.innerHTML =
    '<div class="chat-msg-avatar">🥗</div>'
    + '<div class="chat-msg-bubble" style="background:var(--surface);border:1px solid var(--glass-border);'
    + 'border-radius:18px 18px 18px 4px;padding:12px 14px;font-size:20px">'
    + '<span class="chat-typing-dot">●</span>'
    + '<span class="chat-typing-dot">●</span>'
    + '<span class="chat-typing-dot">●</span>'
    + '</div>';
  list.appendChild(div);
  _chatScrollToBottom();
}

function _chatAppendSystem(html, color) {
  var list = document.getElementById('chat-messages');
  if (!list) return;
  var div = document.createElement('div');
  div.style.cssText = 'text-align:center;padding:8px 16px;font-size:12px;' + (color ? 'color:' + color + ';' : '');
  div.innerHTML = html;
  list.appendChild(div);
}

function _chatScrollToBottom() {
  var list = document.getElementById('chat-messages');
  if (list) list.scrollTop = list.scrollHeight;
  var cont = document.getElementById('page-aichat');
  if (cont) cont.scrollTop = cont.scrollHeight;
}

function _chatEscape(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _chatIsRu() {
  try {
    var lang = (typeof i18n !== 'undefined' && i18n._lang) || navigator.language || 'ru';
    return lang.startsWith('ru') || lang.startsWith('uk') || lang.startsWith('be');
  } catch(e){ return true; }
}

// ── Интеграция в switchTab ────────────────────────────────────────
(function(){
  var _orig = window.switchTab;
  if (typeof _orig === 'function') {
    window.switchTab = function(name) {
      _orig(name);
      if (name === 'aichat') initAiChatPage();
    };
  }
})();

})();
