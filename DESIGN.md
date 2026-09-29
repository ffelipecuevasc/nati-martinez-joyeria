# DESIGN.md — Sistema de diseño · Natalia Martínez, Orfebrería Sustentable

> **LECTURA OBLIGATORIA** antes de tocar HTML, CSS, Tailwind o cualquier elemento visual (ver `AGENTS.md`).
> Este documento es la fuente de verdad del diseño. Si el código y este documento discrepan, **no adivines**: pregunta al responsable del proyecto antes de decidir.
>
> **Estado documentado:** Fase 9 (sobre `e4bb91b`). Tailwind CSS **v3.4**.
> La **paleta v2 está aplicada** (config canónica + roles de `styles.css` re-mapeados, §5). La tipografía se mantiene (Playfair / Cinzel / Montserrat, decisiones D-3 y D-4 en §11). Quedan pendientes las tareas de limpieza (§10).

---

## 1. Principios de diseño

1. **Contención de alta gama.** Mucho espacio, tipografía fina, pocos elementos. Se permite **un solo gesto audaz por pantalla** (hoy: el tríptico del hero). Todo lo demás es disciplina.
2. **El filete como hilo conductor.** Líneas de 1 px en color de ornamento (camel/cobre) unen todo el sitio: costuras del hero, esquinas del marco del taller, subrayados de enlaces, separadores del menú. Es la "firma de orfebre" visual. Repetirla con criterio; no inventar otros motivos decorativos.
3. **Calidez artesanal, luz en claro.** En modo claro el fondo de página es **blanco** (`surface.light` `#ffffff`, pedido expreso de la clienta: "más blanco", D-6); la calidez la aportan el acento camel, los ornamentos y los rellenos sutiles `secondary` a baja opacidad, no el fondo. En oscuro, grafito `#202020`. Sin negros puros en fondos.
4. **Modo claro y modo oscuro son ciudadanos de primera clase.** Ningún componente se considera terminado si no se verificó en ambos.
5. **Movimiento sobrio y con propósito.** Una sola curva de easing, duraciones largas y suaves, y `prefers-reduced-motion` siempre respetado.
6. **Contenido primero y accesible.** Contraste medido, foco visible, semántica correcta, funciona sin JS (mejora progresiva).
7. **Referencia, no imitación.** La estética de alta joyería (p. ej. Cartier) es *inspiración*. No se replica la identidad de otra marca: las tipografías comerciales `Shelley Script`, `Werdet Script` y `Brilliant Cut Pro` **no se usan** (no son servibles en web sin licencia y acercarían el logotipo a una marca ajena).

---

## 2. Arquitectura de tokens (3 capas)

```
Capa 1 · PALETA CRUDA        tailwind.config.js  →  brand / surface / content / metallic   (hex)
            │  alimenta
Capa 2 · ROLES SEMÁNTICOS    styles.css :root / .dark  →  --color-background, -main, ...   (RGB, cambian con .dark)
            │  se exponen como colores Tailwind:  background · main · title · secondary · accent · ornament
Capa 3 · COMPONENTES         styles.css  →  .btn-outline, .class-card, .hero-*, .reveal, ...
```

**Reglas**

- El HTML consume **roles semánticos** (`bg-background`, `text-main`, `text-accent`, `border-secondary`…). El tema cambia solo al alternar `.dark` en `<html>`: **no** duplicar con variantes `dark:` salvo casos puntuales sin rol semántico.
- Los colores de la paleta cruda (`brand-*`, `surface-*`, `content-*`, `metallic-*`) sirven para **construir la capa 2** y para casos decorativos específicos. No se usan para texto y fondos corrientes.
- **Prohibido** escribir hex/`rgb()` sueltos en HTML o en CSS de componentes. Excepciones justificadas: el velo del hero (`.hero-veil`, overlay fijo cálido sobre fotografía) y `.hero-ink` (marfil sobre fotografía).
- Las variables son **tripletes RGB sin comas** (`245 239 232`) para que Tailwind pueda aplicar opacidad: `bg-background/90`, `border-secondary/30`.
- Modo oscuro: `darkMode: "class"`. La clase `dark` vive en `<html>`; la conmuta `ThemeManager`, se persiste en `localStorage["theme"]` y se aplica **antes del primer render** con el snippet anti-parpadeo del `<head>` (no tocar la clave `"theme"`).

---

## 3. Configuración de Tailwind canónica

Es la configuración sugerida, **adaptada al stack real**. Diferencias intencionales frente a la versión sugerida original:

| Problema en la versión sugerida | Consecuencia | Corrección |
|---|---|---|
| `module.exports = {...}` | El proyecto es `"type": "module"`: el archivo no carga y Tailwind cae a su config por defecto (es exactamente el fallo silencioso ya vivido). | `export default {...}` |
| `content` con rutas de Next.js (`./pages`, `./components`, `./app`) | Tailwind no escanea nada → **cero utilidades** generadas. | `["./*.html", "./static/**/*.js"]` |
| Se eliminan `primary/secondary/body`, `background/main/...` | Rompería ~300 usos existentes en el HTML. | Se **conservan** como alias durante la migración (§10). |
| Fuentes propietarias primero en el stack | Nunca resuelven en el navegador; solo añaden ruido. | Solo fuentes cargables; las comerciales quedan como comentario. |

```js
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
          light: { primary: "#202020", secondary: "#6b665f", muted: "#9c958a" },
          dark: { primary: "#f5f5f5", secondary: "#d1cfc9", muted: "#807e7b" },
        },
        metallic: { silver: "#e2e4e6", platinum: "#cbd2d9" },
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
      animation: { "fade-in-up": "fadeInUp 1.5s ease-out forwards" },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
```

> Ojo con los nombres: `bg-accent` (rol semántico) **no** es `bg-brand-accent` (arena de la paleta cruda). Tampoco `text-secondary` (rol) es `text-content-light-secondary` (paleta). Ante la duda, usar siempre el rol semántico.

---

## 4. Paleta cruda v2 (Capa 1)

| Grupo | Token | Hex | Uso previsto |
|---|---|---|---|
| **brand** | `light` | `#f5efe8` | Arena claro / crema (ya no es el fondo de página; sin uso hoy) |
| | `base` | `#b69a74` | Camel de marca. Ornamento y acento en oscuro |
| | `dark` | `#9e815d` | Sombra cálida; texto **solo grande** |
| | `accent` | `#c9b496` | Arena decorativa |
| | `deep` | `#7d6340` | Acento de texto/interacción en claro (AA, D-1) |
| **surface** | `light` | `#ffffff` | **Fondo de página (claro)** desde Fase 8 (D-6) |
| | `light-secondary` | `#f9f8f6` | Superficie sutil (claro) |
| | `dark` | `#202020` | Fondo de página (oscuro) |
| | `dark-secondary` | `#181818` | Fondo profundo (oscuro), velos |
| | `dark-elevated` | `#2a2a2a` | Tarjetas elevadas (oscuro) |
| **content** | `light.primary / secondary / muted` | `#202020 / #6b665f / #9c958a` | Texto en claro |
| | `dark.primary / secondary / muted` | `#f5f5f5 / #d1cfc9 / #807e7b` | Texto en oscuro |
| **metallic** | `silver / platinum` | `#e2e4e6 / #cbd2d9` | Reflejos plata/platino; detalles puntuales |

---

## 5. Roles semánticos (Capa 2) — vigentes desde Fase 8

Valores **vigentes** en `static/css/input/styles.css` (`:root` y `.dark`). Entre paréntesis, el valor *legacy* anterior a la Fase 8 cuando cambió de forma notable.

| Rol (Tailwind) | Función | Claro | Oscuro |
|---|---|---|---|
| `background` | Fondo de página | `surface.light` `#ffffff` *(antes `#F5F1E8`)* | `surface.dark` `#202020` *(antes `#161412`)* |
| `main` | Texto corrido | `content.light.primary` `#202020` | `content.dark.secondary` `#d1cfc9` |
| `title` | Títulos | `content.light.primary` `#202020` *(antes `#5A4035`)* | `content.dark.primary` `#f5f5f5` |
| `secondary` | Filetes, bordes, rellenos sutiles (con alpha). **Nunca texto** | `content.light.muted` `#9c958a` | `content.dark.muted` `#807e7b` |
| `accent` | Texto/controles interactivos y rellenos con texto encima | `brand.deep` `#7d6340` *(antes `#A76545`)* | `brand.base` `#b69a74` |
| `ornament` | Solo decoración (filetes, esquinas, costuras, viñetas) | `brand.base` `#b69a74` | `brand.base` `#b69a74` |

```css
:root {
    --color-background: 255 255 255; /* surface.light #ffffff (más blanco, pedido clienta) */
    --color-main: 32 32 32;          /* content.light.primary #202020 */
    --color-title: 32 32 32;         /* content.light.primary #202020 */
    --color-secondary: 156 149 138;  /* content.light.muted #9c958a · solo decorativo */
    --color-accent: 125 99 64;       /* brand.deep #7d6340 · 5,63:1 sobre blanco */
    --color-ornament: 182 154 116;   /* brand.base #b69a74 · solo decorativo */
    --hairline-alpha: 0.6;
    --hairline-soft-alpha: 0.22;
    --hairline-faint-alpha: 0.12;
    --expo-out: cubic-bezier(0.16, 1, 0.3, 1);
}
.dark {
    --color-background: 32 32 32;    /* surface.dark #202020 */
    --color-main: 209 207 201;       /* content.dark.secondary #d1cfc9 */
    --color-title: 245 245 245;      /* content.dark.primary #f5f5f5 */
    --color-secondary: 128 126 123;  /* content.dark.muted #807e7b */
    --color-accent: 182 154 116;     /* brand.base #b69a74 · 6,10:1 */
    --color-ornament: 182 154 116;   /* brand.base #b69a74 */
    --hairline-alpha: 0.48;
    --hairline-soft-alpha: 0.16;
    --hairline-faint-alpha: 0.08;
}
```

**Regla del ornamento:** usan `ornament` los filetes y ornamentos: `.frame-craft::before/::after`, `.class-card::before`, `.hero-pane::after` (costuras), `.hero-rule`, las viñetas y el `&` del hero (`text-ornament`), y las utilidades `bg-ornament` de las líneas cortas junto a los rótulos (clases, galería) y de las viñetas cuadradas de las tarjetas de clase. Usan `accent` el texto, los enlaces, el subrayado del nav (`.nav-link::after`), los rellenos con texto encima (`.btn-outline::before`), `.link-email`, `::selection`, `:focus-visible`, la barra de progreso de galería y el subrayado del correo de contacto.

### 5.1 Filetes (hairlines) — decisión centralizada

El `secondary` v2 es más oscuro que el legacy en claro (`#9c958a` vs `#B7B4AE`) y mucho más claro en oscuro (`#807e7b` vs `#4A4540`), así que un `border-secondary` a opacidad completa se marcaba demasiado. La opacidad de los filetes se centraliza en variables por modo, **calibradas para igualar el contraste de los filetes legacy** contra su fondo:

| Clase (`styles.css`) | Reemplaza a | Alpha claro / oscuro | Contraste objetivo (legacy) |
|---|---|---|---|
| `.border-hairline` · `.bg-hairline` | `border-secondary`, `bg-secondary` (separador del nav) | `0.6` / `0.48` | 1,83:1 |
| `.border-hairline-soft` · `.bg-hairline-soft` | `border-secondary/30`, `/40`, `bg-secondary/30`, divisiones del menú móvil (`/0.35`) | `0.22` / `0.16` | ≈1,2:1 |
| `.border-hairline-faint` | `border-secondary/20` (paneles de clases) | `0.12` / `0.08` | 1,12:1 |

- Las clases solo fijan el **color**; el ancho y el lado los da Tailwind (`border`, `border-t`, `w-px`…). `hover:border-accent` y `group-hover:border-accent` siguen ganando por especificidad.
- `.btn-outline` y `.mobile-menu` usan las mismas variables en `styles.css`.
- **No** usar `border-secondary` directo en HTML nuevo: usar estas clases. Para ajustar la delicadeza de todo el sitio, cambiar solo las variables `--hairline-*`.
- Los rellenos sutiles (`bg-secondary/5` en los paneles de clases, `bg-secondary/10` en fondos de imagen y velos) se mantienen: sobre blanco dan una profundidad mínima (≈ `#fafaf9`) que evita un modo claro plano. `surface.light-secondary` no fue necesario.

---

## 6. Accesibilidad (obligatoria)

### 6.1 Contraste medido (WCAG 2.x) — recalculado en Fase 8

Umbrales: **4,5:1** texto normal · **3:1** texto grande (≥24 px, o ≥18,66 px en negrita) y controles/iconos.

| Color | Sobre fondo claro `#ffffff` | Veredicto |
|---|---|---|
| `content.light.primary` `#202020` (`main`, `title`) | 16,29:1 | AAA |
| `main` al 80 % (copyright) | 8,51:1 | AAA |
| `main` al 70 % (rótulos pequeños) | 6,02:1 | AA |
| `content.light.secondary` `#6b665f` | 5,69:1 | AA |
| `brand.deep` `#7d6340` (`accent`) | 5,63:1 | AA |
| `brand.dark` `#9e815d` | 3,65:1 | Solo texto grande / UI |
| `content.light.muted` `#9c958a` (`secondary`) | 2,97:1 | ✗ Solo decorativo |
| `brand.base` `#b69a74` (`ornament`) | 2,67:1 | ✗ Solo decorativo |
| `brand.accent` `#c9b496` | 2,01:1 | ✗ Solo decorativo |

| Color | Sobre fondo oscuro `#202020` | Veredicto |
|---|---|---|
| `content.dark.primary` `#f5f5f5` (`title`) | 14,94:1 | AAA |
| `content.dark.secondary` `#d1cfc9` (`main`) | 10,46:1 | AAA |
| `main` al 80 % | 7,18:1 | AAA |
| `main` al 70 % | 5,83:1 | AA |
| `brand.accent` `#c9b496` | 8,11:1 | AAA |
| `brand.base` `#b69a74` (`accent`, `ornament`) | 6,10:1 | AA |
| `brand.dark` `#9e815d` | 4,46:1 | Texto grande / UI |
| `content.dark.muted` `#807e7b` (`secondary`) | 4,03:1 | Texto grande / UI (no se usa como texto) |

Relleno + texto (`.btn-outline` en hover): texto `#ffffff` sobre `brand.deep` = 5,63:1 (claro) · texto `#202020` sobre `brand.base` = 6,10:1 (oscuro). Ambas cumplen.
Hero (sobre fotografía con velo): `ornament` `#b69a74` sobre el velo (≈ `#2a2420`) ≈ 5,7:1. Por eso en el hero se usa `ornament` y **no** `accent`: en claro `accent` es `#7d6340`, ilegible sobre el velo oscuro.

### 6.2 Reglas

- Texto pequeño (≤ 16 px), enlaces y etiquetas en mayúscula de 11–12 px: **solo** `main`, `title`, `accent` (con los valores v2) o `content.*.secondary`. Nunca `secondary` ni `ornament`.
- Botones de icono (apariencia y menú móvil): `text-main hover:text-accent` en las 5 páginas (corregido en Fase 8).
- Rótulos pequeños secundarios (etiquetas de contacto, fichas y progreso de galería): `text-main/70` (≥ 5,8:1 en ambos modos). Opacidad mínima para texto con `main`: 70 %.
- `:focus-visible` con anillo de acento visible en todo elemento interactivo (ya existe en `styles.css`; no eliminar ni usar `outline: none` sin sustituto).
- `prefers-reduced-motion: reduce` desactiva animaciones y transiciones (ya implementado; todo componente nuevo debe respetarlo).
- Un único `<h1>` por página; jerarquía de encabezados sin saltos; landmarks (`nav`, `main`, `header`, `footer`).
- Iconos de Material Symbols: **todos** los `<span class="material-symbols-outlined">` llevan `aria-hidden="true"` (desde Fase 9). Si el icono es el único contenido de un control (apariencia, menú), el nombre accesible lo da el `aria-label` del `<button>`; si acompaña a texto visible, el texto basta. Así el lector de pantalla no lee la ligadura (`east`, `menu`…). El JS del menú solo cambia el `textContent` del span, por lo que el atributo se conserva.
- El menú móvil mantiene `aria-expanded`, `aria-controls`, cierre con `Escape`, y `visibility: hidden` cuando está cerrado.
- Progressive enhancement: sin JS el contenido `.reveal` y el menú móvil siguen visibles (`<noscript>` en el `<head>`).
- Toda imagen con `alt` descriptivo (o `alt=""` si es decorativa).

---

## 7. Tipografía

| Rol | Token | Fuente | Uso |
|---|---|---|---|
| Título | `font-primary` | Playfair Display, **itálica** | H1/H2/H3 y logotipo |
| Rótulo | `font-secondary` | Cinzel | Nav, eyebrows, botones, etiquetas — MAYÚSCULAS con tracking amplio |
| Cuerpo | `font-body` | Montserrat 300/400 | Texto corrido |
| *v2 · Logotipo* | `font-script` | Pinyon Script | **Solo** el logotipo, si se aprueba (§11) |
| *v2 · Nav* | `font-nav` | Montserrat / Jost / Tenor Sans | Alternativa sans para rótulos, si se aprueba (§11) |

Medidas vigentes (mobile-first):

- Hero H1: `.hero-name font-primary italic leading-[0.95] tracking-tight`, enmarcado por viñetas `•` (`.hero-bullet text-ornament`, `aria-hidden`). Tamaño fluido `clamp(2rem, (100vw − 3rem) / 8.6, 6rem)`: «• Natalia Martínez •» (≈ 8,3 em) cabe siempre en **una** línea (36 px a 360 px, 40 px a 390 px, 84 px a 768 px) y vale 6rem (96 px) desde ~880 px. Las viñetas van pegadas a la palabra (sin espacio) como segunda protección contra viñetas huérfanas.
- Hero, línea 2 (`<p>`, no encabezado): «Jewelry Studio» `font-secondary text-sm md:text-base tracking-luxury-wide uppercase`, con `lang="en"`.
- Hero, línea 3: «Silvestre & Sustentable» `font-secondary text-[11px] md:text-xs tracking-luxury uppercase opacity-80`, con el `&` en `text-ornament`.
- Correo grande (contacto): `.contact-email font-primary italic`, tamaño fluido `clamp(1.5rem, (100vw − 3rem) / 10.9, 5.5rem)` (≈ 10,6 em de ancho): 29 px a 360 px, 66 px a 768 px, 88 px desde ~1000 px; `overflow-wrap: anywhere` como red de seguridad.
- Logotipo (nav): `font-primary italic text-lg md:text-xl tracking-[0.06em] whitespace-nowrap`
- Enlaces de nav: `font-secondary text-[11px] tracking-luxury-wide uppercase`
- Botones: `font-secondary text-[11px] tracking-[0.2em] uppercase`
- Texto corrido: `font-body font-light`

Tracking: preferir los tokens `tracking-luxury` (0.15em), `tracking-luxury-wide` (0.25em) y `tracking-luxury-ultrawide` (0.35em); usar valores arbitrarios (`tracking-[0.3em]`) solo cuando ningún token calce.
Render fino global (ya en `styles.css`): `antialiased`, `optimizeLegibility`.
Fuentes cargadas por Google Fonts en el `<head>` de cada página: Cinzel, Playfair Display, Montserrat, Material Symbols Outlined. **Cualquier fuente nueva se añade a ese `<link>` en las 5 páginas.**

---

## 8. Layout, movimiento y componentes

### 8.1 Layout

- Mobile-first. El breakpoint decisivo es `md` (768 px): enlaces de nav ↔ hamburguesa; tríptico de 1 columna ↔ 3 columnas.
- Grillas de 12 columnas (`md:grid-cols-12`): los 11 huecos suman `11 × gap`, que debe caber holgado en el ancho útil. Escalonar el gap por breakpoint: taller de `index.html` `md:gap-12 lg:gap-16 xl:gap-24`; filas de `taller.html` `md:gap-12 lg:gap-20`. Un `md:gap-24` fijo desbordaba entre 768 y ~1100 px.
- Contenedor de la barra: `max-w-[1440px] mx-auto px-6 md:px-12`. Navbar `fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-hairline`.
- Navegación: los enlaces apuntan a **archivos de página** (`galeria.html`, `taller.html`, `clases.html`, `contacto.html`); el logotipo enlaza a `index.html`. **Nunca** `index.html#seccion` para una página que ya existe. Página activa: `text-accent border-b border-accent` (escritorio) y `text-accent` (móvil).

### 8.2 Movimiento

- Easing único: `--expo-out: cubic-bezier(0.16, 1, 0.3, 1)`. Subrayado de nav: `cubic-bezier(0.86, 0, 0.07, 1)`.
- Duraciones vigentes: reveal 1 s · botón 0.5–0.55 s · nav/enlaces 0.3–0.4 s · hero (paneles) 1.7 s · View Transition de tema 0.7 s · menú móvil 0.4–0.5 s.
- **Regla de separación:** el CSS define *qué se ve* (estado inicial, final, transición); el JS solo alterna **una clase de estado** (`is-visible`, `is-open`, `is-revealed`). Nunca animar desde JS con estilos en línea, salvo valores calculados (p. ej. el ancho de la barra de progreso).

### 8.3 Catálogo de componentes (definidos en `styles.css`)

| Componente | Clases | Comportamiento / regla |
|---|---|---|
| Enlace de nav | `.nav-link` | Subrayado animado con el color de acento |
| Hero tríptico | `.hero`, `.hero-pane`, `.hero-veil`, `.hero-ink`, `.hero-rule` | 3 fotografías (creación · reparación · clases) con duotono cálido, costuras de ornamento entre paneles (≥ md), velo cálido temado por modo, texto en marfil |
| Retardos del hero | `.hero-delay-1` (0.2 s) · `.hero-delay-2` (0.8 s) | Sustituyen el antiguo `style="animation-delay"`; se combinan con `animate-fade-in-up` (van después de las utilidades y ganan a su shorthand) |
| Nombre del hero | `.hero-name` | Tamaño fluido que mantiene «• Natalia Martínez •» en una línea desde 360 px (§7) |
| Correo grande | `.contact-email` | Tamaño fluido + `overflow-wrap: anywhere` para el correo de contacto (§7); conserva el hover-reveal (`#main-email-link`) |
| Viñeta del hero | `.hero-bullet` | `•` decorativo a 0.32 em, centrado verticalmente junto al nombre; el color lo da `text-ornament` y siempre lleva `aria-hidden="true"` |
| Filetes | `.border-hairline`, `.border-hairline-soft`, `.border-hairline-faint`, `.bg-hairline`, `.bg-hairline-soft` | Color de filete con opacidad centralizada por modo (§5.1) |
| Botón contorno | `.btn-outline` | Borde de filete (`--hairline-alpha`), relleno de acento en barrido ascendente al hover |
| Marco del taller | `.frame-craft` | Esquinas de `ornament` arriba-izquierda y abajo-derecha que se abren al hover del `.group` |
| Tarjeta de clase | `.class-card` | Filete superior de `ornament` que crece + elevación de 4 px al hover |
| Enlace de correo | `.link-email` | Subrayado grabado que se despliega |
| Revelado al scroll | `.reveal` + `--up/--left/--right` + `--delay-1/2` + `.is-visible` | Lo activa `RevealOnScroll` (IntersectionObserver) |
| Hover-reveal | `.hover-reveal` + `.is-revealed` | Imagen de fondo que emerge al posar cursor/foco (contacto) |
| Menú móvil | `.mobile-menu` + `.is-open` | Panel desplegable bajo la barra; lo controla `MobileMenu` |
| Progreso de lectura | `#scroll-progress`, `#scroll-percentage` | Solo en galería; lo controla `ScrollProgress` |

Antes de crear un componente nuevo, revisar si uno existente cubre el caso. Los componentes nuevos se añaden a `styles.css` (nunca a un `<style>` en el HTML), consumen solo roles semánticos y se documentan en esta tabla.

---

## 9. Imágenes

- Hoy **no hay fotografías del cliente** en `static/img/` (solo `favicon.svg`); las imágenes actuales son de maqueta y remotas. Cuando lleguen las fotos, van en `./static/img/` con nombres descriptivos (`hero-creacion.jpg`, `hero-reparacion.jpg`, `hero-clases.jpg`) y **rutas relativas** (`./static/img/...`).
- Tríptico: fotos verticales, ~1200×1600, tono cálido. Tratamiento de color unificado por CSS (`.hero-pane img`), **no** editar cada foto por separado.
- `loading="eager"` solo en la imagen sobre el pliegue; `loading="lazy"` en el resto. Siempre `alt`.
- Favicon: `./static/img/favicon.svg` (medallón con monograma "N", se adapta a claro/oscuro). Paleta v2 desde Fase 9 (D-7): medallón `brand.light` `#f5efe8` / `surface.dark` `#202020`, anillo y chispa `brand.base` `#b69a74`, monograma `#202020` / `#f5f5f5`. Verificado legible a 16 px. Sus hex son la única excepción fuera de `styles.css`: un SVG usado como favicon no puede leer las variables del sitio.
- Imágenes de maqueta remotas reemplazadas en Fase 9 (las originales daban 404). Todas de Unsplash, **Unsplash License** (uso comercial gratuito, sin atribución obligatoria):

| Uso | URL base | Autor |
|---|---|---|
| Colgante «Tierra Nómada» (index, galería) | `images.unsplash.com/photo-1746458258667-63bf641e4db3` | Lena Laurentez |
| Brazalete «Erosión» (galería) | `images.unsplash.com/photo-1708221235482-a6e2a807198f` | Oscar Ramirez |
| Orfebre en su banco (clases nivel 02, taller fila 2) | `images.unsplash.com/photo-1772442125267-7640b4b5f2fe` | GN Group |
| Mesa de trabajo con herramientas (clases nivel 03, taller fila 1) | `images.unsplash.com/photo-1659032882718-3e54e7da86ab` | Ruan Richard Rodrigues |

---

## 10. Plan de migración a v2 (incremental)

Cada fase se prueba en **ambos modos y en móvil** antes de pasar a la siguiente. Nada de esto se aplica sin instrucción explícita de la fase.

| Fase | Contenido | Cambio visual |
|---|---|---|
| 8 ✅ | Reemplazar `tailwind.config.js` por la config canónica de §3 (ESM, `content` correcto, alias legacy + tokens v2 + `ornament`). Añadir `--color-ornament` (con el valor actual del acento) a `styles.css`. *Validada: genera exactamente el mismo conjunto de 462 selectores que la config actual.* | Prácticamente ninguno: solo la tipografía base del documento pasa de la pila del sistema a Montserrat (afecta únicamente a texto sin clase `font-*`) |
| 9 ✅ *(aplicada junto con la 8 en el commit «Fase 8»; incluye fondo claro blanco D-6, filetes §5.1 y retardos del hero)* | Re-mapear las variables de `styles.css` a §5 (incluye `brand.deep`). Cambiar ornamentos a `ornament`. Corregir botones de icono (`text-main`). Verificar contrastes. | **Sí** (paleta) |
| 10 — descartada | Tipografía: se decidió **no** migrar (D-3, D-4). No se cargan fuentes nuevas. | — |
| 11 | Limpieza: retirar tokens sin uso (`font-script`, `font-nav`, `brand.light`…), añadir `meta description`/Open Graph. (`README.md` ya se actualizó en la Fase 8.) | Ninguno |

---

## 11. Decisiones

Resueltas en Fase 8:

- **D-1 · Acento — ✅ resuelta.** Claro: `brand.deep` `#7d6340` (5,63:1 sobre blanco). Oscuro: `brand.base` `#b69a74` (6,10:1). `brand.base` es además el color de `ornament`.
- **D-2 · Títulos — ✅ resuelta.** `content.*.primary`: `#202020` en claro, `#f5f5f5` en oscuro.
- **D-3 · Rótulos — ✅ resuelta.** Siguen en Cinzel (`font-secondary`). No se migra a `font-nav`.
- **D-4 · Logotipo — ✅ resuelta.** Sigue en Playfair Display itálica. No se usa `font-script` ni se cargan fuentes nuevas.
- **D-5 · Fondo oscuro — ✅ resuelta.** `surface.dark` `#202020`.
- **D-6 · Fondo claro — ✅ resuelta (pedido de la clienta, correo del 20-09-2026).** Modo claro «más blanco»: fondo de página `surface.light` `#ffffff`. El modo oscuro no se aclara.

Resuelta en Fase 9:

- **D-7 · Favicon — ✅ resuelta (aprobada por el responsable).** Se mantiene el medallón crema (`brand.light`; no blanco, para conservar la silueta en pestañas claras); anillo y chispa en `brand.base`; monograma en `content.light.primary` (claro) y `content.dark.primary` (oscuro); medallón oscuro `surface.dark`. Ver §9.

---

## 12. Do / Don't

**Do**
- Usar roles semánticos y variables; verificar en claro, oscuro, móvil (390 px) y escritorio (1440 px).
- Reutilizar `.reveal`, `.btn-outline`, `.frame-craft`, etc. antes de crear estilos nuevos.
- Mantener el filete de 1 px como motivo decorativo.
- Medir contraste al introducir un color de texto nuevo.

**Don't**
- No usar hex sueltos, `<style>` en HTML ni JS inline (salvo el snippet anti-parpadeo).
- No usar `secondary`, `ornament` ni `brand-*` para texto pequeño ni iconos de control (excepción: el `&` y las viñetas decorativas del hero, sobre fotografía).
- No usar `border-secondary` directo: usar las clases de filete (§5.1).
- No añadir bordes redondeados, sombras pesadas, degradados llamativos ni gradientes de "plantilla": rompen la contención de alta gama.
- No usar fuentes propietarias de otras marcas ni copiar su logotipo.
- No editar a mano `static/css/output/tailwind.css` (se regenera con `pnpm run build`).
- No cambiar textos del cliente sin autorización.