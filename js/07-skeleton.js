// Phase 2B — skeleton loaders override.
(function(){
  function skelGeneric() {
    return '<div class="skeleton-block">'
      + '<div class="skeleton-line h-18 w-70"></div>'
      + '<div class="skeleton-line h-14 w-90"></div>'
      + '<div class="skeleton-line h-14 w-50"></div>'
      + '<div class="skeleton-line h-14 w-80"></div>'
      + '<div class="skeleton-line h-14 w-60"></div>'
      + '</div>';
  }
  function skelDiary() {
    return ''
      + '<div class="skeleton-card">'
        + '<div class="skeleton-line h-24 w-30" style="margin-bottom:10px"></div>'
        + '<div class="skeleton-line h-14 w-90" style="margin-bottom:14px;border-radius:7px"></div>'
        + '<div style="display:flex;gap:8px">'
          + '<div class="skeleton-line h-40" style="flex:1"></div>'
          + '<div class="skeleton-line h-40" style="flex:1"></div>'
          + '<div class="skeleton-line h-40" style="flex:1"></div>'
        + '</div>'
      + '</div>'
      + '<div class="skeleton-card">'
        + '<div class="skeleton-line h-18 w-50" style="margin-bottom:8px"></div>'
        + '<div class="skeleton-line h-14 w-70"></div>'
      + '</div>'
      + '<div class="skeleton-card">'
        + '<div class="skeleton-line h-18 w-60" style="margin-bottom:8px"></div>'
        + '<div class="skeleton-line h-14 w-50"></div>'
      + '</div>';
  }
  function skelList() {
    return ''
      + '<div class="skeleton-card"><div class="skeleton-line h-18 w-70" style="margin-bottom:8px"></div><div class="skeleton-line h-14 w-50"></div></div>'
      + '<div class="skeleton-card"><div class="skeleton-line h-18 w-90" style="margin-bottom:8px"></div><div class="skeleton-line h-14 w-60"></div></div>'
      + '<div class="skeleton-card"><div class="skeleton-line h-18 w-50" style="margin-bottom:8px"></div><div class="skeleton-line h-14 w-70"></div></div>'
      + '<div class="skeleton-card"><div class="skeleton-line h-18 w-80" style="margin-bottom:8px"></div><div class="skeleton-line h-14 w-40"></div></div>';
  }
  function skelChart() {
    return ''
      + '<div class="skeleton-card" style="min-height:160px">'
        + '<div class="skeleton-line h-18 w-40" style="margin-bottom:14px"></div>'
        + '<div class="skeleton-line" style="height:120px;border-radius:12px"></div>'
      + '</div>'
      + '<div style="display:flex;gap:8px;margin-top:10px">'
        + '<div class="skeleton-line h-40" style="flex:1"></div>'
        + '<div class="skeleton-line h-40" style="flex:1"></div>'
      + '</div>';
  }

  window.showPageLoading = function(id, txt) {
    var el = document.getElementById(id);
    if (!el) return;
    var key = (id||'').toLowerCase();
    var html;
    if (key.indexOf('meal') >= 0 || key.indexOf('diary') >= 0) html = skelDiary();
    else if (key.indexOf('chart') >= 0 || key.indexOf('stat') >= 0 || key.indexOf('progress') >= 0) html = skelChart();
    else if (key.indexOf('food') >= 0 || key.indexOf('product') >= 0 || key.indexOf('lb') >= 0 || key.indexOf('list') >= 0 || key.indexOf('history') >= 0) html = skelList();
    else html = skelGeneric();
    el.innerHTML = html;
  };
})();
