# Portafolio Técnico: Infraestructura y Desarrollo de Progressive Web Apps (Mi PWA)

Repositorio que documenta la evolución técnica e implementación paso a paso de una Progressive Web App (**Mi PWA**). Cada directorio constituye un proyecto independiente donde se incorporan de manera incremental las especificaciones modernas del ecosistema web móvil y de escritorio.

---

##  Estructura y Enfoque de los Ejercicios

| Carpeta del Proyecto | Tema Central | Qué se implementa en esta fase |
| :--- | :--- | :--- |
| `ejercicio 1/` | Manifiesto y Metadatos | Creación del `manifest.json` vinculado al documento HTML base, definición de propiedades de identidad (`name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`) e integración del paquete de iconos en formato PNG (192x192 px y 512x512 px). |
| `ejercicio 2/` | App Shell y Splash Screen | Maquetado responsivo de la interfaz base (*Header*, barra de navegación y contenedor principal, reflejando el título *Mi PWA* en el HTML) y validación en DevTools de la activación de la *Splash Screen* nativa al simular la instalación. |
| `ejercicio 3/` | Ciclo de Vida del Service Worker | Desarrollo del script `sw.js` (con etiqueta *Mi PWA. E3-5* en su HTML) y registro asíncrono desde el script principal. Implementación de los escuchadores de eventos para la fase de instalación (`install`), activación (`activate`) y control de peticiones (`fetch`). |
| `ejercicio 4/` | Cache API y Estrategia Cache-First | Configuración de almacenamiento en caché mediante la Cache API durante el evento `install`. Precaché de los recursos estáticos del App Shell (HTML, CSS, JS e imágenes base) e intercepción del flujo de red para priorizar la respuesta local. |
| `ejercicio 5/` | Resiliencia y Estado Offline | Programación de una respuesta alternativa (*fallback*) en el evento `fetch` ante la pérdida de conectividad. Renderizado de una vista o plantilla HTML personalizada de "Modo Sin Conexión" cuando la red falla y el recurso solicitado no se encuentra precacheado. |

---

##  Guía de Ejecución Local

Los Service Workers requieren obligatoriamente un entorno seguro (`https://` o `http://localhost`). Para probar cualquiera de los proyectos de forma local:

1. Abre tu terminal y navega hasta la carpeta del ejercicio que desees probar (por ejemplo):
   ```bash
   cd "ejercicio 4"
   ```
2. Levanta un servidor estático ligero con Python:
   ```bash
   python -m http.server 8080
   ```
3. Abre tu navegador web e ingresa a: **`http://localhost:8080`**

*(Nota: Los proyectos también son compatibles con despliegues estáticos en plataformas como GitHub Pages gracias al uso de rutas relativas).*

---

##  Guía de Verificación en Google Chrome DevTools

* **Ejercicio 1 (Web App Manifest y Metadatos de Instalación):** 
  1. Abre DevTools (F12) y dirígete a la pestaña **Application** > **Manifest**. 
  2. Comprueba que se carguen correctamente el nombre, `short_name`, `start_url`, `display: standalone`, `theme_color` y `background_color` sin errores de sintaxis.
  3. Verifica que la sección **Installability** esté limpia de advertencias y que el icono de instalación aparezca disponible en la barra de direcciones del navegador.

* **Ejercicio 2 (Maquetado del App Shell y Splash Screen Nativa):** 
  1. Comprueba el diseño responsivo de la interfaz base (*Header*, menú de navegación y contenedor principal) redimensionando la ventana del navegador.
  2. Simula o ejecuta la instalación de la aplicación para validar la correcta integración de los parámetros visuales que conforman la *Splash Screen* nativa (`background_color`, `name` e icono de 512x512 px) a través de la plataforma o entorno de pruebas.

* **Ejercicio 3 (Registro y Ciclo de Vida del Service Worker):** 
  1. Dirígete a **Application** > **Service Workers** para confirmar que el script `sw.js` se encuentra registrado, activo y en ejecución (`activated and is running`).
  2. Revisa la pestaña **Console** para corroborar la correcta ejecución de los registros (*logs*) correspondientes a las fases del ciclo de vida: `install`, `activate` y `fetch`.

* **Ejercicio 4 (Cache API y Estrategia de Caché Estática / Cache-First):** 
  1. Explora el panel **Application** > **Cache Storage** para verificar que la memoria caché se creó exitosamente durante el evento `install` y almacena los recursos estáticos del App Shell (HTML, CSS, JS e imágenes base).
  2. Abre la pestaña **Network**, recarga la página y comprueba que las solicitudes de los recursos precacheados muestran `(ServiceWorker)` en la columna de tamaño (*Size*), indicando que se sirven desde la caché antes de consultar a la red.

* **Ejercicio 5 (Interceptor de Peticiones y Manejo de Estado Offline):** 
  1. Activa el modo **Offline** en el panel de red (*Throttling*) o en la sección de Service Workers de DevTools y recarga la página para comprobar que el App Shell carga correctamente de forma local.
  2. Navega hacia una ruta inexistente o no precacheada para verificar que el evento `fetch` intercepta la falla de red y renderiza de forma adecuada la vista o plantilla HTML de respaldo (*fallback*) para el "Modo Sin Conexión".

---

##  Historial de Commits Sugeridos

Si prefieres automatizar la creación del repositorio mediante comandos de Git, utiliza la siguiente estructura de mensajes descriptivos:

```bash
git init
git add README.md && git commit -m "docs: integrar documentación técnica y especificaciones del portafolio Mi PWA"
git add "ejercicio 1" && git commit -m "feat(ej1): incorporar manifest.json, metadatos e iconos adaptativos 192/512"
git add "ejercicio 2" && git commit -m "feat(ej2): maquetar App Shell responsivo e interfaz Mi PWA"
git add "ejercicio 3" && git commit -m "feat(ej3): implementar registro y ciclo de vida del Service Worker (Mi PWA e3-5)"
git add "ejercicio 4" && git commit -m "feat(ej4): configurar Cache API y estrategia de almacenamiento Cache-First"
git add "ejercicio 5" && git commit -m "feat(ej5): programar interceptor de red y fallback offline"
git branch -M main
