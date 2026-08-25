/**
 * @module modules/gallery/scrollProgress
 * Barra e indicador de progreso de lectura de la página.
 *
 * Responsabilidad única: reflejar el avance del scroll en una barra y un
 * porcentaje. Usa requestAnimationFrame para no saturar el hilo principal
 * y un listener pasivo (buenas prácticas de rendimiento).
 */
export class ScrollProgress {
    /**
     * @param {string} barId - id del elemento cuya anchura refleja el avance.
     * @param {string} textId - id del elemento que muestra el porcentaje.
     */
    constructor(barId = "scroll-progress", textId = "scroll-percentage") {
        this.bar = document.getElementById(barId);
        this.text = document.getElementById(textId);
        this.ticking = false;
        this.onScroll = this.onScroll.bind(this);
    }

    /** Calcula y pinta el progreso actual. */
    update() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;

        if (this.bar) this.bar.style.width = `${pct}%`;
        if (this.text) this.text.textContent = `${Math.round(pct)}%`;
        this.ticking = false;
    }

    /** Throttle con rAF: agenda un único repintado por frame. */
    onScroll() {
        if (this.ticking) return;
        this.ticking = true;
        window.requestAnimationFrame(() => this.update());
    }

    /** Arranca. Falla de forma segura si la página no tiene barra. */
    init() {
        if (!this.bar && !this.text) return;
        window.addEventListener("scroll", this.onScroll, { passive: true });
        this.update();
    }
}

/** Inicializa la barra de progreso si existe en la página. */
export function initScrollProgress() {
    new ScrollProgress().init();
}
