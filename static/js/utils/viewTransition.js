/**
 * @module utils/viewTransition
 * Envuelve la View Transitions API del navegador.
 *
 * Aísla la dependencia del navegador en un solo lugar (Inversión de
 * Dependencias): el resto del código depende de esta abstracción y no
 * conoce `document.startViewTransition`. Si algún día cambia la API o se
 * quiere desactivar la animación, solo se toca este archivo.
 */

/**
 * Ejecuta una mutación del DOM dentro de una View Transition cuando el
 * navegador la soporta; en caso contrario la ejecuta directamente, de modo
 * que la funcionalidad nunca se rompe (degradación elegante).
 *
 * @param {() => void} mutate - Callback que aplica el cambio en el DOM.
 * @returns {void}
 */
export function withViewTransition(mutate) {
    if (typeof document.startViewTransition !== "function") {
        mutate();
        return;
    }

    document.startViewTransition(mutate);
}