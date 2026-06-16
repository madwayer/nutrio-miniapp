// Phase 2A — sheet controllers + bnav state sync
(function(){
  // Pages that map to the 4 bottom nav slots (diary, progress, ai, scanner via FAB).
  // Anything else opens via FAB or 'Ещё', no nav highlight.
  var BNAV_TABS = { diary:'bnav-diary', progress:'bnav-progress', aipage:'bnav-ai' };

  function setActive(tab){
    document.querySelectorAll('.bnav-item').forEach(function(b){b.classList.remove('active');});
    var id = BNAV_TABS[tab];
    if (id){ var el=document.getElementById(id); if(el) el.classList.add('active'); }
  }

  // Wrap existing switchTab to sync bottom nav state & lock body scroll on sheets
  var _origSwitchTab = window.switchTab;
  window.switchTab = function(tab){
    try { _origSwitchTab.apply(this, arguments); } catch(e){ console.error(e); }
    setActive(tab);
    // ensure content scrolls to top on tab change for natural feel
    try { document.querySelector('.content').scrollTop = 0; window.scrollTo(0,0); } catch(e){}
  };

  function openSheet(id){
    var s = document.getElementById(id); if(!s) return;
    s.classList.add('show');
    s.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
  }
  function closeSheet(id){
    var s = document.getElementById(id); if(!s) return;
    s.classList.remove('show');
    s.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  window.openAddSheet   = function(){ openSheet('add-sheet'); };
  window.closeAddSheet  = function(){ closeSheet('add-sheet'); };
  window.openMoreSheet  = function(){
    // toggle admin row visibility based on admin status; rely on existing logic if any
    try {
      var admTab = document.getElementById('tab-adminpage');
      var admRow = document.getElementById('sheet-admin-row');
      if (admTab && admRow) admRow.style.display = (admTab.style.display === 'none' ? 'none' : 'flex');
    } catch(e){}
    openSheet('more-sheet');
  };
  window.closeMoreSheet = function(){ closeSheet('more-sheet'); };

  // Close sheets on Escape & on Telegram back button
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ closeSheet('add-sheet'); closeSheet('more-sheet'); }
  });
  try {
    var tg = window.Telegram && Telegram.WebApp;
    if (tg && tg.BackButton){
      tg.BackButton.onClick(function(){
        var a = document.getElementById('add-sheet');
        var m = document.getElementById('more-sheet');
        if (a && a.classList.contains('show')) { closeSheet('add-sheet'); return; }
        if (m && m.classList.contains('show')) { closeSheet('more-sheet'); return; }
        // else, navigate to Diary as 'home'
        if (typeof switchTab === 'function') switchTab('diary');
      });
    }
  } catch(e){}

  // On initial load — always init Diary so date label and data are populated.
  // Раньше initDiaryPage вызывался ТОЛЬКО если page-scanner был active в HTML.
  // Теперь HTML дефолтно открывает page-diary → условие не срабатывало → пустой
  // календарь. Гарантированно вызываем switchTab('diary'), он сам и пересохранит
  // активный класс, и вызовет initDiaryPage().
  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
      try {
        if (typeof switchTab === 'function') {
          switchTab('diary');
        } else if (typeof initDiaryPage === 'function') {
          initDiaryPage();
        }
      } catch(e){}
    }, 0);
  });
})();
