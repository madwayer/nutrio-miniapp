// NutriO Service Worker v1
const CACHE_NAME = 'nutrio-v10a';
const STATIC_ASSETS = [
  '/',
  '/js/01-calc.js?v=3x',
  '/js/02-datepicker.js?v=3x',
  '/js/03-main-a.js?v=10a',
  '/js/04-main-b.js?v=3x',
  '/js/05-scanner.js?v=3x',
  '/js/06-nav.js?v=6a',
  '/js/07-skeleton.js?v=3x',
  '/js/08-rings-heatmap.js?v=3x',
  '/js/09-ai-cards.js?v=3x',
  '/js/10-charts-archive.js?v=3x',
  '/js/11-fasting.js?v=6a',
  '/js/11-i18n-ext.js?v=6a',
  '/js/12-health-score.js?v=6a',
  '/js/12-share-card.js?v=3x',
  '/js/13-exercise.js?v=6a',
  '/js/14-ai-chat.js?v=6a',
  '/js/15-health-sync.js?v=6a',
  '/styles.css',
];

// Установка — кэшируем все статические файлы
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Активация — удаляем старые кэши
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — Cache First для статики, Network First для API
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  
  // API запросы — всегда сеть
  if (url.includes('/api/') || url.includes('telegram.org')) {
    e.respondWith(fetch(e.request).catch(function() {
      return new Response(JSON.stringify({error: 'offline'}), {
        headers: {'Content-Type': 'application/json'}
      });
    }));
    return;
  }
  
  // Статика — сначала кэш, потом сеть
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Кэшируем только успешные ответы
        if (response.ok && e.request.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    })
  );
});
