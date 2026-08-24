/**
 * @module index
 * Punto de entrada de todo el andamiaje JavaScript.
 *
 * Actúa como raíz de composición: su única labor es orquestar la
 * inicialización de los módulos cuando el DOM está listo. Para añadir una
 * nueva funcionalidad, se importa su `init*` y se invoca dentro de
 * `bootstrap()`; ningún módulo se inicializa a sí mismo.
 */

import { initTheme } from "./modules/theme/indexTheme.js";

/**
 * Arranca los módulos de la aplicación.
 * @returns {void}
 */
function bootstrap() {
    initTheme();
}

// Los módulos ES se difieren por defecto, por lo que el DOM suele estar
// disponible al ejecutarse. Este guard cubre ambos casos de forma robusta.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
    bootstrap();
}