/**
 * @module modules/theme
 * Punto de composición del módulo de tema: resuelve las dependencias
 * internas y arranca la funcionalidad. El resto de la aplicación solo
 * necesita llamar a `initTheme()`.
 */

import { ThemeManager } from "./themeManager.js";
import { ThemeToggle } from "./themeToggle.js";

/**
 * Inicializa el cambio de tema. Falla de forma segura (no lanza error) si el
 * botón no existe en la página, de modo que el andamiaje sigue funcionando.
 *
 * @returns {void}
 */
export function initTheme() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const manager = new ThemeManager();
    new ThemeToggle(button, manager).init();
}