/* =========================================================
   Ejercicio 4 — Cache API + Estrategia Cache-First
   ========================================================= */
const CACHE_NAME = 'app-shell-v1';
const CACHE_VERSION = 'v1';

/* ---- Lista de recursos estáticos del App Shell ---- */
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './icons/carafeliz.png',
  './icons/persona5.png'
];

/* ---------- INSTALL: precache del App Shell ---------- */
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

/* ---------- ACTIVATE: limpieza de versiones antiguas ---------- */
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

/* ---------- FETCH: estrategia Cache-First ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo GET y mismo origen
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  // 1) Buscar en caché
  const cached = await caches.match(request);
  if (cached) {
    console.log('[SW] 🟢 CACHE HIT:', request.url);
    return cached;
  }

  // 2) No está en caché → red
  console.log('[SW] 🔴 CACHE MISS → red:', request.url);
  try {
    const response = await fetch(request);
    // Cachear dinámicamente respuestas válidas del mismo origen
    if (response && response.status === 200 && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Fallo de red:', err);
    // En Ejercicio 5 añadiremos aquí el fallback offline
    return new Response('Recurso no disponible', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}