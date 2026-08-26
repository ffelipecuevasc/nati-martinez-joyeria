/**
 * @module modules/menu/mobileMenu
 * Menú de navegación desplegable para móvil.
 *
 * Responsabilidad única: abrir/cerrar el panel y mantener sincronizados el
 * estado ARIA y el icono del botón. La presentación (transición, colores)
 * vive en CSS (.mobile-menu / .is-open); aquí solo se alterna el estado.
 */
export class MobileMenu {
    /**
     * @param {string} toggleId - id del botón hamburguesa.
     * @param {string} panelId - id del panel desplegable.
     * @param {string} [openClass] - clase de estado abierto.
     */
    constructor(toggleId = "menu-toggle", panelId = "mobile-menu", openClass = "is-open") {
        this.toggle = document.getElementById(toggleId);
        this.panel = document.getElementById(panelId);
        this.openClass = openClass;
        this.icon = this.toggle ? this.toggle.querySelector("[data-icon]") : null;
        this.onKeydown = this.onKeydown.bind(this);
    }

    /** @returns {boolean} `true` si el panel está abierto. */
    isOpen() {
        return this.panel.classList.contains(this.openClass);
    }

    /** Abre el panel y refleja el estado en ARIA y en el icono. */
    open() {
        this.panel.classList.add(this.openClass);
        this.toggle.setAttribute("aria-expanded", "true");
        this.toggle.setAttribute("aria-label", "Cerrar menú");
        if (this.icon) this.icon.textContent = "close";
        document.addEventListener("keydown", this.onKeydown);
    }

    /** Cierra el panel y restaura ARIA e icono. */
    close() {
        this.panel.classList.remove(this.openClass);
        this.toggle.setAttribute("aria-expanded", "false");
        this.toggle.setAttribute("aria-label", "Abrir menú");
        if (this.icon) this.icon.textContent = "menu";
        document.removeEventListener("keydown", this.onKeydown);
    }

    /** Cierra con la tecla Escape y devuelve el foco al botón (accesibilidad). */
    onKeydown(e) {
        if (e.key === "Escape") {
            this.close();
            this.toggle.focus();
        }
    }

    /** Registra los listeners. Falla de forma segura si faltan nodos. */
    init() {
        if (!this.toggle || !this.panel) return;

        this.toggle.addEventListener("click", () => {
            this.isOpen() ? this.close() : this.open();
        });

        // Al navegar desde un enlace, cerrar el panel.
        this.panel.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => this.close());
        });
    }
}

/** Inicializa el menú móvil si su HTML está presente. */
export function initMobileMenu() {
    new MobileMenu().init();
}