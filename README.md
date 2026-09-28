# Natalia Martínez - Orfebrería Sustentable

Un proyecto web estático diseñado para exhibir el portafolio, la filosofía y los servicios de clases de la orfebre Natalia Martínez. La interfaz ha sido construida con un enfoque minimalista y de alta gama, respetando la esencia orgánica y sustentable de sus piezas de joyería.

## Stack Tecnológico

El proyecto está desarrollado bajo una arquitectura web estática moderna, priorizando el rendimiento, el diseño fluido y la mantenibilidad a largo plazo:

- HTML5: Estructura semántica y accesible.
- Tailwind CSS v3.4 (+ PostCSS y Autoprefixer): Framework de estilos para la construcción de una interfaz a medida, integrando una paleta de colores estricta y tipografía premium.
- JavaScript (Vanilla, ES Modules): Lógica de micro-interacciones y manejo del estado de la interfaz, con un punto de entrada único (`static/js/index.js`).
- View Transitions API: Implementación nativa para un cambio de tema (Light/Dark) inmersivo y geométrico.
- Node.js & pnpm 11.5: Gestión de paquetes y compilación/minificación de los estilos de Tailwind (el proyecto exige pnpm; no usar npm ni yarn).

## Características del Proyecto

- Diseño completamente responsivo adaptado a dispositivos móviles, tablets y pantallas de escritorio.
- Sistema tipográfico que combina fuentes Serif (Playfair Display en itálica para títulos, Cinzel para rótulos) con una Sans-serif limpia (Montserrat) para el texto corrido.
- Paleta de colores dinámica gestionada mediante variables CSS nativas (RGB) para soportar opacidades en el modo claro y oscuro de Tailwind.
- Estructura de navegación moderna con transiciones fluidas y animaciones de entrada controladas.

## Configuración y Desarrollo Local

Para trabajar en este proyecto y compilar los estilos de Tailwind localmente:

1. Clonar este repositorio en tu máquina local.
2. Abrir la terminal en el directorio del proyecto y ejecutar `pnpm install` para instalar las dependencias.
3. Compilar los estilos: `pnpm run dev` (Tailwind en modo watch) o `pnpm run build` (compila y minifica). La entrada es `./static/css/input/styles.css` y la salida `./static/css/output/tailwind.css`, que se versiona porque GitHub Pages la sirve tal cual.
4. Servir el sitio por HTTP (Live Server de WebStorm o `python -m http.server`). Abrir los `.html` con `file://` bloquea los ES Modules y el contenido animado queda invisible.

El sistema de diseño (tokens, paleta, componentes, accesibilidad) está documentado en `DESIGN.md`, y las reglas de trabajo en `AGENTS.md`.

## Autor

Diseñado y desarrollado por Felipe Cuevas.