/**
 * tailwind.config.js — Natalia Martínez · Orfebrería Sustentable
 *
 * Configuración de Tailwind CSS v3.4 en ESM (el proyecto es "type": "module").
 * Documentación del sistema de diseño: ver DESIGN.md (lectura obligatoria).
 *
 * REGLAS CRÍTICAS
 *  - Usar SIEMPRE `export default` (nunca module.exports ni extensión .cjs).
 *  - `content` debe cubrir todas las páginas y scripts; si no, no se genera ninguna utilidad.
 *  - Los roles semánticos (background, main, title, secondary, accent, ornament) leen
 *    variables CSS definidas en static/css/input/styles.css (:root y .dark).
 */
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./*.html", "./static/**/*.js"], // toda página nueva debe quedar cubierta por este glob
    theme: {
        extend: {
            colors: {
                /* ── Capa 2 · roles semánticos (valores en styles.css :root/.dark) ── */
                background: "rgb(var(--color-background) / <alpha-value>)",
                main: "rgb(var(--color-main) / <alpha-value>)",
                title: "rgb(var(--color-title) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                accent: "rgb(var(--color-accent) / <alpha-value>)",
                ornament: "rgb(var(--color-ornament) / <alpha-value>)", // v2 · solo decorativo

                /* ── Capa 1 · paleta cruda v2 ── */
                brand: {
                    light: "#f5efe8",  // arena claro / crema
                    base: "#b69a74",   // camel tostado
                    dark: "#9e815d",   // sombra cálida
                    accent: "#c9b496", // arena / beige medio
                    deep: "#7d6340",   // PROPUESTA · camel profundo apto para texto (AA sobre crema)
                },
                surface: {
                    light: "#ffffff",
                    "light-secondary": "#f9f8f6",
                    dark: "#202020",            // fondo oscuro predominante
                    "dark-secondary": "#181818",
                    "dark-elevated": "#2a2a2a",
                },
                content: {
                    light: {primary: "#202020", secondary: "#6b665f", muted: "#9c958a"},
                    dark: {primary: "#f5f5f5", secondary: "#d1cfc9", muted: "#807e7b"},
                },
                metallic: {silver: "#e2e4e6", platinum: "#cbd2d9"},
            },
            fontFamily: {
                /* Legacy (en uso hoy) — se mantienen */
                primary: ['"Playfair Display"', "serif"],   // títulos, en itálica
                secondary: ["Cinzel", "serif"],             // rótulos en mayúsculas
                body: ["Montserrat", "sans-serif"],         // texto corrido (light/regular)
                /* v2 — adoptados de la config sugerida, solo con fuentes cargables */
                script: ['"Pinyon Script"', '"Great Vibes"', "cursive"], // logotipo. Requiere cargarla en el <link> de Google Fonts.
                nav: ["Montserrat", "Jost", '"Tenor Sans"', "sans-serif"],
                sans: ["Montserrat", "Inter", "-apple-system", "sans-serif"],
                // Inspiración comercial NO usable sin licencia: 'Shelley Script', 'Werdet Script', 'Brilliant Cut Pro'
            },
            letterSpacing: {
                luxury: "0.15em",
                "luxury-wide": "0.25em",
                "luxury-ultrawide": "0.35em",
            },
            animation: {"fade-in-up": "fadeInUp 1.5s ease-out forwards"},
            keyframes: {
                fadeInUp: {
                    "0%": {opacity: "0", transform: "translateY(30px)"},
                    "100%": {opacity: "1", transform: "translateY(0)"},
                },
            },
        },
    },
    plugins: [],
};