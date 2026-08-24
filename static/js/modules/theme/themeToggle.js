/**
 * @module modules/theme/ThemeToggle
 * Enlaza el botón de la interfaz con el gestor de tema.
 */

import { withViewTransition } from "../../utils/viewTransition.js";

/**
 * Responsabilidad única: traducir el evento de UI (click) en una acción de
 * dominio (alternar tema), ejecutándola dentro de una View Transition.
 *
 * Depende de una abstracción con el método `toggle()`, no de una
 * implementación concreta: cualquier objeto que lo exponga es válido
 * (Sustitución de Liskov / Inversión de Dependencias).
 */
export class ThemeToggle {
    /**
     * @param {HTMLElement} button - Botón que dispara el cambio de tema.
     * @param {{ toggle: () => void }} manager - Gestor que aplica el cambio.
     */
    constructor(button, manager) {
        /** @private */
        this.button = button;
        /** @private */
        this.manager = manager;
    }

    /**
     * Registra el listener de click sobre el botón.
     * @returns {void}
     */
    init() {
        this.button.addEventListener("click", () => {
            withViewTransition(() => this.manager.toggle());
        });
    }
}