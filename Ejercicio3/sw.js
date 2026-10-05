/* =========================================================
   Ejercicio 3 — Ciclo de vida del Service Worker
   - Escucha install, activate y fetch
   ========================================================= */

const SW_VERSION = 'v1';
console.log(`[SW] Script cargado (${SW_VERSION})`);

/* ---------- INSTALL ---------- */
self.addEventListener('install', (event) => {
  console.log('[SW] ➜ Evento INSTALL');
  event.waitUntil(
    Promise.resolve().then(() => {
      console.log('[SW] INSTALL completado. Forzando activación…');
      return self.skipWaiting(); // activa el nuevo SW sin esperar
    })
  );
});

/* ---------- ACTIVATE ---------- */
self.addEventListener('activate', (event) => {
  console.log('[SW] ➜ Evento ACTIVATE');
  event.waitUntil(
    Promise.resolve().then(() => {
      console.log('[SW] Tomando control de los clientes…');
      return self.clients.claim();
    })
  );
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', (event) => {
  console.log('[SW] ➜ Evento FETCH:', event.request.method, event.request.url);
  // Sin estrategia de caché todavía → passthrough a la red
});

/* ---------- MESSAGE (por si necesitas forzar skipWaiting) ---------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});