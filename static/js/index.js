/**
 * @module index
 * Punto de entrada único de todo el andamiaje JavaScript, compartido por
 * todas las páginas del sitio. Su única labor es orquestar la
 * inicialización de los módulos cuando el DOM está listo.
 *
 * Cada `init*` se auto-protege (no hace nada si su HTML no está presente),
 * de modo que una misma entrada sirve a todas las páginas sin ramificar por
 * ruta: añadir una funcionalidad = importar su init y añadir una línea.
 */

import { initTheme } from "./modules/theme/indexTheme.js";
import { initReveal } from "./modules/reveal/revealOnScroll.js";
import { initScrollProgress } from "./modules/gallery/scrollProgress.js";
import { initHoverReveal } from "./modules/contact/hoverReveal.js";
import { initMobileMenu } from "./modules/menu/mobileMenu.js";

/** Arranca los módulos de la aplicación. */
function bootstrap() {
    initTheme();
    initReveal();
    initScrollProgress();
    initHoverReveal();
    initMobileMenu();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
    bootstrap();
}