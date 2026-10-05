/* =========================================================
   Ejercicio 5 — Interceptor + Fallback Offline
   ========================================================= */
const CACHE_NAME = 'app-shell-v1';
const CACHE_VERSION = 'v1';
const OFFLINE_URL = './offline.html';   // ✅ CORREGIDO

/* ---- Lista de recursos estáticos del App Shell ---- */
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',                     // ✅ CORREGIDO
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './icons/carafeliz.png',
  './icons/persona5.png'
];

/* ---------- INSTALL ---------- */
self.addEventListener('install', (event) => {
  console.log('[SW] INSTALL — precacheando App Shell…');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      console.log('[SW] App Shell cacheado ✔');
      await self.skipWaiting();
    })()
  );
});

/* ---------- ACTIVATE ---------- */
self.addEventListener('activate', (event) => {
  console.log('[SW] ACTIVATE — limpiando cachés antiguas…');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Eliminando caché obsoleta:', k);
            return caches.delete(k);
          })
      );
      await self.clients.claim();
      console.log('[SW] ACTIVATE completado ✔');
    })()
  );
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1) Navegaciones → Network-First con fallback a offline.html
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }

  // 2) Resto → Cache-First con fallback offline
  event.respondWith(handleAsset(request));
});

/* --- Navegaciones --- */
async function handleNavigate(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    console.warn('[SW] Offline → sirviendo offline.html');
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response('Sin conexión', { status: 503 });
  }
}

/* --- Recursos estáticos --- */
async function handleAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Asset no cacheado y sin red:', request.url);
    const accept = request.headers.get('accept') || '';
    if (accept.includes('text/html')) {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    return new Response('Recurso no disponible sin conexión', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}