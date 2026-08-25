/**
 * @module modules/contact/hoverReveal
 * Revela una imagen de fondo al posar el cursor —o el foco— sobre un enlace.
 *
 * Responsabilidad única: enlazar los eventos de puntero/teclado con el
 * estado visual (.is-revealed), que se define en CSS. Incluye foco/blur
 * para accesibilidad por teclado.
 */
export class HoverReveal {
    /**
     * @param {string} triggerId - id del elemento que dispara el efecto.
     * @param {string} targetId - id del elemento que se revela.
     * @param {string} [revealedClass] - clase de estado visible.
     */
    constructor(triggerId = "main-email-link", targetId = "hover-reveal-img", revealedClass = "is-revealed") {
        this.trigger = document.getElementById(triggerId);
        this.target = document.getElementById(targetId);
        this.revealedClass = revealedClass;
    }

    show() { this.target.classList.add(this.revealedClass); }
    hide() { this.target.classList.remove(this.revealedClass); }

    /** Registra los listeners. Falla de forma segura si faltan nodos. */
    init() {
        if (!this.trigger || !this.target) return;
        this.trigger.addEventListener("mouseenter", () => this.show());
        this.trigger.addEventListener("mouseleave", () => this.hide());
        this.trigger.addEventListener("focus", () => this.show());
        this.trigger.addEventListener("blur", () => this.hide());
    }
}

/** Inicializa el efecto si el disparador existe en la página. */
export function initHoverReveal() {
    new HoverReveal().init();
}
