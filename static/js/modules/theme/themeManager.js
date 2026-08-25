/**
 * @module modules/theme/ThemeManager
 * Gestiona el estado del tema (claro / oscuro) y su persistencia.
 */

/** Clase CSS que activa el modo oscuro sobre el elemento raíz. */
const DARK_CLASS = "dark";

/** Clave de almacenamiento de la preferencia del usuario. */
const STORAGE_KEY = "theme";

/**
 * Responsabilidad única: leer, aplicar y PERSISTIR el tema sobre el elemento
 * raíz. No conoce la UI (botones) ni cómo se anima el cambio.
 *
 * La aplicación *inicial* del tema ocurre en un script síncrono en el <head>
 * (anti-parpadeo, antes del primer render). Este gestor se ocupa del cambio
 * en tiempo de ejecución y de guardar la elección, compartiendo la misma
 * clave (`STORAGE_KEY`).
 */
export class ThemeManager {
    /**
     * @param {HTMLElement} [root=document.documentElement] - Elemento sobre el
     *   que se conmuta la clase de tema.
     */
    constructor(root = document.documentElement) {
        /** @private */
        this.root = root;
    }

    /**
     * @returns {boolean} `true` si el tema oscuro está activo.
     */
    isDark() {
        return this.root.classList.contains(DARK_CLASS);
    }

    /**
     * Persiste la preferencia actual. Tolerante a fallos: si el navegador
     * bloquea `localStorage` (p. ej. modo privado), no rompe la app.
     * @param {boolean} dark
     * @returns {void}
     * @private
     */
    persist(dark) {
        try {
            localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
        } catch (e) {
            /* almacenamiento no disponible: se ignora silenciosamente */
        }
    }

    /**
     * Alterna entre claro y oscuro y guarda la elección del usuario.
     * @returns {void}
     */
    toggle() {
        const dark = this.root.classList.toggle(DARK_CLASS);
        this.persist(dark);
    }
}