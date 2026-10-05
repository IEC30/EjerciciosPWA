/* =========================================================
   Ejercicio 4 — App Shell + registro del Service Worker
   ========================================================= */

   // (dentro de index.html, opcional)
document.getElementById('btnCacheInfo')?.addEventListener('click', async () => {
  const keys = await caches.keys();
  const out = [];
  for (const k of keys) {
    const c = await caches.open(k);
    const reqs = await c.keys();
    out.push(`${k} (${reqs.length} recursos)`);
  }
  alert('Cachés:\n' + out.join('\n'));
});

/* ---------- 1) Menú responsive  ---------- */
const navToggle = document.getElementById('navToggle');
const appNav    = document.getElementById('appNav');

navToggle?.addEventListener('click', () => {
  const open = appNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

appNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    appNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    appNav.querySelectorAll('a').forEach(x => x.classList.remove('is-active'));
    a.classList.add('is-active');
  });
});

/* ---------- 2) Botón de instalación  ---------- */
let deferredPrompt = null;
const btnInstall  = document.getElementById('btnInstall');
const installHint = document.getElementById('installHint');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstall) btnInstall.hidden = false;
  if (installHint) installHint.textContent =
    'Chrome puede instalar la app (manifest + SW activo).';
});

btnInstall?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] Instalación:', outcome);
  deferredPrompt = null;
  btnInstall.hidden = true;
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App instalada ✔');
  if (installHint) installHint.textContent =
    '¡Instalada! Ábrela desde el sistema para ver la Splash nativa.';
});

if (window.matchMedia('(display-mode: standalone)').matches) {
  if (installHint) installHint.textContent = 'Modo standalone activo (Splash nativa).';
}

/* ---------- 3) 🆕 Registro asíncrono del SW ---------- */
const swStatus = document.getElementById('swStatus');

async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[App] Service Worker no soportado');
    if (swStatus) swStatus.textContent = '❌ Service Worker no soportado';
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js', {
      scope: './'
    });
    console.log('[App] SW registrado. Scope:', registration.scope);
    if (swStatus) swStatus.textContent = `✅ SW registrado — scope: ${registration.scope}`;

    // Seguir el estado de la instancia actual
    if (registration.installing) trackState(registration.installing);
    else if (registration.waiting)  trackState(registration.waiting);
    else if (registration.active)   trackState(registration.active);

    // Detectar nuevas versiones del SW
    registration.addEventListener('updatefound', () => {
      console.log('[App] updatefound — nueva versión del SW');
      trackState(registration.installing);
    });

  } catch (err) {
    console.error('[App] Error registrando SW:', err);
    if (swStatus) swStatus.textContent = `❌ Error: ${err.message}`;
  }
}

function trackState(worker) {
  if (!worker) return;
  console.log(`[App] SW estado inicial: ${worker.state}`);
  worker.addEventListener('statechange', (e) => {
    console.log(`[App] SW statechange → ${e.target.state}`);
    if (swStatus) swStatus.textContent = `SW: ${e.target.state}`;
  });
}

window.addEventListener('load', registerSW);
