/* =========================================================
   Ejercicio 2 — App Shell + Splash Screen
   ========================================================= */

// --- Menú responsive ---
const navToggle = document.getElementById('navToggle');
const appNav    = document.getElementById('appNav');

navToggle.addEventListener('click', () => {
  const open = appNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Cerrar menú al navegar 
appNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    appNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    appNav.querySelectorAll('a').forEach(x => x.classList.remove('is-active'));
    a.classList.add('is-active');
  });
});

// --- Botón de instalación (habilita el flujo de instalación → Splash nativa) ---
let deferredPrompt = null;
const btnInstall  = document.getElementById('btnInstall');
const installHint = document.getElementById('installHint');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.hidden = false;
  installHint.textContent = 'Antes de instalar, Chrome leerá el manifest y mostrará el icono + splash al abrir.';
});

btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] Resultado instalación:', outcome);
  deferredPrompt = null;
  btnInstall.hidden = true;
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App instalada ✔');
  installHint.textContent = '¡App instalada! Ábrela desde el sistema para ver la Splash Screen nativa.';
});

// Si ya está instalada / standalone
if (window.matchMedia('(display-mode: standalone)').matches) {
  installHint.textContent = 'Ejecutándose en modo standalone (Splash Screen activa).';
}