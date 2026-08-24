/**
 * @module modules/theme/ThemeManager
 * Gestiona el estado del tema (claro / oscuro).
 */

/** Clase CSS que activa el modo oscuro sobre el elemento raíz. */
const DARK_CLASS = "dark";

/**
 * Responsabilidad única: leer y aplicar el tema sobre el elemento raíz.
 * No conoce la UI (botones) ni cómo se anima el cambio. Es la "costura"
 * donde en el futuro se añadirá persistencia (localStorage) o detección de
 * preferencia del sistema, sin tocar el resto de módulos (Abierto/Cerrado).
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
     * Alterna entre el tema claro y el oscuro.
     * @returns {void}
     */
    toggle() {
        this.root.classList.toggle(DARK_CLASS);
    }
}