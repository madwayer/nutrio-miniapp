// ── UX polish: тактильный слой (Telegram HapticFeedback) ─────────────────
// Один делегированный обработчик даёт отклик на осмысленные нажатия во всём
// приложении — без правок в остальных файлах. Вкусно и не навязчиво.
(function () {
  var TG = window.Telegram && window.Telegram.WebApp;
  var HF = TG && TG.HapticFeedback;

  // Универсальный помощник — доступен как window.haptic('light'|'success'|'error'|'select'…)
  function haptic(kind) {
    if (!HF) return;
    try {
      if (kind === 'success' || kind === 'error' || kind === 'warning') {
        HF.notificationOccurred(kind);
      } else if (kind === 'select') {
        HF.selectionChanged();
      } else {
        HF.impactOccurred(kind || 'light'); // light | medium | heavy | rigid | soft
      }
    } catch (e) {}
  }
  window.haptic = haptic;

  // Осмысленные интерактивные элементы (action-контролы, не каждый тап подряд).
  var ACTION_SEL =
    'button, .btn, .btn-primary, .btn-secondary, .btn-danger, .btn-prem,' +
    ' .action-btn, .fab, .bnav-fab, .chip, .sheet-card, .sheet-row,' +
    ' [role="button"]';
  // Переключатели вкладок/навигации — им приятнее «тик» выбора.
  var NAV_SEL = '.bnav-item, .tab, .adm-nav-btn, .ai-arch-tab';

  document.addEventListener(
    'click',
    function (e) {
      var target = e.target;
      if (!target || !target.closest) return;
      var nav = target.closest(NAV_SEL);
      if (nav) { haptic('select'); return; }
      var el = target.closest(ACTION_SEL);
      if (!el) return;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      haptic('light');
    },
    true // capture — срабатывает даже если обработчик элемента вызывает stopPropagation
  );
})();
