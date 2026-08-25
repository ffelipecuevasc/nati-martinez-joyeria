/**
 * @module modules/reveal/revealOnScroll
 * Revelado progresivo de elementos al entrar en el viewport.
 *
 * Responsabilidad única: observar elementos `.reveal` y marcarlos como
 * visibles una sola vez. No conoce la dirección ni la duración de la
 * animación: eso vive en CSS (.reveal--up/left/right). Configurable por
 * constructor (Abierto/Cerrado) y con degradación elegante si no hay
 * soporte de IntersectionObserver.
 */
export class RevealOnScroll {
    /**
     * @param {string} selector - Selector de los elementos a revelar.
     * @param {{threshold?: number, visibleClass?: string}} [options]
     */
    constructor(selector = ".reveal", { threshold = 0.15, visibleClass = "is-visible" } = {}) {
        this.elements = Array.from(document.querySelectorAll(selector));
        this.threshold = threshold;
        this.visibleClass = visibleClass;
        this.observer = null;
    }

    /** Arranca la observación. Falla de forma segura si no hay elementos. */
    init() {
        if (this.elements.length === 0) return;

        if (!("IntersectionObserver" in window)) {
            this.elements.forEach((el) => el.classList.add(this.visibleClass));
            return;
        }

        this.observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add(this.visibleClass);
                obs.unobserve(entry.target);
            });
        }, { threshold: this.threshold });

        this.elements.forEach((el) => this.observer.observe(el));
    }
}

/** Inicializa el revelado con la configuración por defecto. */
export function initReveal() {
    new RevealOnScroll().init();
}
