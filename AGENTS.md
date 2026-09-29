# AGENTS.md — Natalia Martínez · Orfebrería Sustentable

Instrucciones para agentes de IA (y personas) que trabajen en este repositorio. Es el **único** archivo de instrucciones
del proyecto (no se usa `CLAUDE.md`).

## 0. Lectura obligatoria

1. **Antes de tocar cualquier HTML, CSS, configuración de Tailwind o elemento visual, lee `DESIGN.md` completo.** Es la
   fuente de verdad del diseño (tokens, paleta, tipografía, componentes, accesibilidad, plan de migración). No trabajes
   de memoria ni con supuestos sobre la paleta o las fuentes.
2. Si una instrucción del usuario contradice `DESIGN.md`, señálalo y pregunta antes de aplicar. Si `DESIGN.md` y el
   código discrepan, **no adivines**: pregunta.
3. Si cambias algo que `DESIGN.md` documenta (un componente, un token, una regla), **actualiza `DESIGN.md` en la misma
   tarea**.

## 1. Contexto del proyecto

- Sitio web **estático** de portafolio y clases de la orfebre **Natalia Martínez** (joyería sustentable, Chile).
  Desarrollador: Felipe Cuevas. IDE: WebStorm.
- Repositorio: `github.com/ffelipecuevasc/nati-martinez-joyeria` (rama `main`).
- Despliegue: **GitHub Pages ahora**; **Netlify más adelante** bajo `www.nataliamartinez.cl`. Todo lo que hagas debe
  funcionar en ambos.
- Páginas: `index.html`, `galeria.html`, `taller.html`, `clases.html`, `contacto.html`. Idioma del contenido:
  **español (Chile)**, `<html lang="es">`.
- Objetivo estético: minimalismo de alta gama, cálido y artesanal. Modo claro y oscuro.

## 2. Stack (no cambiar sin aprobación)

- HTML5 semántico · **Tailwind CSS v3.4** (⚠ **no actualizar a v4**) · JavaScript vanilla ES6+ con **ES Modules** ·
  Node.js + **pnpm 11.5** (`devEngines` lo exige; no usar npm/yarn) · PostCSS + Autoprefixer.
- `package.json` es `"type": "module"`.
- Sin frameworks ni bundler de JS. No añadir dependencias (npm, CDN o scripts de terceros) sin preguntar.

## 3. Comandos

```bash
pnpm install        # instalar dependencias
pnpm run dev        # Tailwind en modo watch
pnpm run build      # compila y minifica el CSS → static/css/output/tailwind.css
```

- **Sirve siempre por HTTP** (Live Server de WebStorm, o `python -m http.server`). Abrir los `.html` con `file://`
  **bloquea los ES Modules** por CORS: el JS no corre y el contenido `.reveal` queda invisible. No es un bug del código.
- Tras añadir/cambiar clases de Tailwind o editar `styles.css`, **ejecuta `pnpm run build`**. El CSS compilado **se
  versiona** (no está en `.gitignore`) porque GitHub Pages lo sirve tal cual.

## 4. Estructura

```
/
├── AGENTS.md · DESIGN.md · README.md
├── index.html · galeria.html · taller.html · clases.html · contacto.html
├── tailwind.config.js          # ESM (export default)
├── postcss.config.js           # ESM (export default)
├── package.json · pnpm-lock.yaml
└── static/
    ├── css/input/styles.css    # ÚNICO lugar para CSS propio (tokens, componentes)
    ├── css/output/tailwind.css # GENERADO: no editar a mano
    ├── img/                    # imágenes y favicon.svg
    └── js/
        ├── index.js            # punto de entrada único de todas las páginas
        ├── modules/{theme,reveal,gallery,contact,menu}/
        └── utils/viewTransition.js
```

## 5. Reglas críticas de configuración (errores ya ocurridos)

1. **Configs en ESM:** `tailwind.config.js` y `postcss.config.js` usan `export default`. **Nunca** `module.exports` ni
   extensión `.cjs`: con `"type": "module"` el archivo no carga y Tailwind compila sin error pero **sin utilidades**
   (síntoma: `warn - No utility classes were detected`).
2. **`content` de Tailwind:** debe ser `["./*.html", "./static/**/*.js"]`. Toda página nueva en la raíz queda cubierta;
   si creas HTML en otra carpeta, amplía el glob. Nunca copiar globs de Next.js (`./pages`, `./app`, `./components`).
3. **Un build "exitoso" no basta:** verifica que el CSS resultante contiene las utilidades esperadas (p. ej.
   `.bg-background`, `.flex`).
4. **Rutas relativas siempre** (`./static/...`, `galeria.html`). **Nunca** rutas absolutas desde la raíz
   (`/static/...`): se rompen en GitHub Pages (`usuario.github.io/repo/`).

## 6. Reglas de código

**HTML**

- Semántico y accesible: `header`, `nav`, `main`, `section`, `footer`; un solo `<h1>` por página; `alt` en imágenes;
  `lang="es"`.
- **Cero CSS y cero JS en línea.** Única excepción: el snippet anti-parpadeo del tema en el `<head>` (tiene que ser
  síncrono; no modificar la clave `"theme"`).
- Enlaces a **archivos de página** (`galeria.html`), nunca `index.html#seccion` para páginas que existen. El logotipo
  enlaza a `index.html`.
- Cada página incluye: snippet anti-parpadeo, fuentes, favicon `./static/img/favicon.svg`, hoja
  `./static/css/output/tailwind.css`, `<noscript>` de fallback, `<script type="module" src="./static/js/index.js">` al
  final del `<body>`.
- Página nueva: añadir su enlace en el nav de **todas** las páginas (lista de escritorio **y** menú móvil) y marcar el
  estado activo en ella.

**CSS / Tailwind**

- Consumir roles semánticos (`bg-background`, `text-main`, `text-accent`…). Sin hex sueltos. Componentes propios en
  `styles.css`, documentados en `DESIGN.md` §8.3.
- Utilidades de Tailwind en el HTML para composición y espaciado; estilos repetidos, estados y animaciones → clases
  semánticas en `styles.css` (patrón `.reveal`, `.btn-outline`).
- Mobile-first. Verificar 390 px, 768 px y 1440 px, en claro y oscuro.
- Respetar `prefers-reduced-motion` en todo lo animado.

**JavaScript (ES Modules)**

- Punto de entrada único: `static/js/index.js`. Cada módulo exporta un `init*()` que **se auto-protege** (no hace nada
  si su HTML no está en la página) y se registra en `bootstrap()`.
- Imports **con extensión `.js`** y rutas relativas.
- Principios: **SOLID** (una responsabilidad por módulo; dependencias inyectadas por constructor; configurable sin
  modificar), DRY, degradación elegante ante APIs no soportadas.
- El JS alterna **una clase de estado** (`is-visible`, `is-open`, `is-revealed`); la presentación vive en CSS.
- Sin librerías innecesarias; sin `eval`; sin manejadores `onclick=""`.
- `localStorage` solo para la clave `"theme"`, siempre dentro de `try/catch`.

## 7. Flujo de trabajo

- **Incremental:** un módulo/sección/componente por vez, probado antes de avanzar.
- Al terminar una tarea:
    1. `pnpm run build` sin errores ni warnings de "No utility classes".
    2. Servir por HTTP y revisar las páginas afectadas en **claro y oscuro**, **móvil y escritorio**.
    3. Comprobar enlaces (ninguno roto) y consola sin errores.
    4. Actualizar `DESIGN.md`/`README.md` si corresponde.
- **Commits** en español con el formato del historial: `Fase N - Descripción de lo realizado.` (p. ej.
  `Fase 7 - Mejoramiento de la barra de navegación e incorporación del menú móvil.`).
- Al entregar cambios, indicar **qué archivos son nuevos y cuáles reemplazan a otros**.

## 8. Requiere aprobación previa (preguntar antes)

- Cambiar paleta, tipografías o cualquier decisión abierta de `DESIGN.md` §11.
- Añadir o actualizar dependencias, o cambiar de gestor de paquetes.
- Modificar textos del cliente, precios o datos de contacto.
- Borrar archivos, reescribir el historial de git o hacer push forzado.
- Cambiar la estructura de carpetas o el flujo de despliegue.
- Cambiar, modificar, editar el contenido de los archivos `AGENTS.md`, `DESIGN.md` y/o `README.md`.

## 9. Prohibido

- Editar `static/css/output/tailwind.css` a mano.
- `.cjs`, `module.exports`, `<style>` o `<script>` con lógica en el HTML, rutas absolutas desde `/`.
- Fuentes propietarias de terceros (p. ej. `Shelley Script`, `Brilliant Cut Pro`) e imitar la identidad de otras marcas.
- Introducir imágenes con derechos de terceros sin confirmar licencia.

## 10. Despliegue

- **GitHub Pages (actual):** se sirve desde la rama/origen configurado en Settings → Pages (o vía GitHub Actions), con
  el CSS compilado versionado. Rutas relativas obligatorias.
- **Netlify (futuro, `www.nataliamartinez.cl`):** sitio estático; comando de build `pnpm run build`, directorio de
  publicación la raíz del repo (`.`). Al migrar: añadir `netlify.toml`, configurar el dominio y HTTPS, y añadir
  `<link rel="canonical">`.

## 11. Pendientes conocidos

- Enlaces `href="#"` en el footer de las 4 páginas que lo tienen (index, taller, clases, contacto; `galeria.html` no tiene
  footer): Instagram, Pinterest y Términos (faltan las URLs reales y la página de términos). También `@nataliamartinez.cl`
  en `contacto.html` apunta a `#`, y el WhatsApp `+56 9 0000 0000` es un marcador.
- Fotografías reales del cliente (tríptico del hero, taller, galería): hoy hay imágenes de maqueta remotas de Unsplash
  (las rotas se reemplazaron en la Fase 9; ver `DESIGN.md` §9). Cuando lleguen las fotos reales, van en `./static/img/`.
  Al depender de URLs remotas, pueden volver a romperse: comprobar con una petición HTTP antes de publicar.
- Ninguna página tiene `meta description` ni Open Graph.
- Limpieza de tokens v2 sin uso (`font-script`, `font-nav`, `brand.light`…) y comentario «PROPUESTA» de `brand.deep` en
  `tailwind.config.js` (ya aprobado como D-1). Ver `DESIGN.md` §10.
- Por confirmar con la clienta: «Brazalete / Bronce Texturizado» en `galeria.html` (es una pieza del portafolio, no una
  clase; no se cambió); los `<title>` de las 5 páginas y el título de `README.md` siguen con «Orfebrería Sustentable»
  (el footer ya dice «Joyería Sustentable»); el año «© 2024» del footer.
- «Taller Libre & Mentoría» (`clases.html`) y «Forjando la Identidad» (`taller.html`) usan la misma foto de maqueta
  (mesa de trabajo); y «Iniciación» (clases), «La Enseñanza» (taller) y el hero comparten otra. Se resolverá con las
  fotos reales.

## 12. Definición de "terminado"

Una tarea está terminada cuando: compila sin warnings, se ve correcta en claro/oscuro y móvil/escritorio, cumple
`DESIGN.md` (contraste y reduced-motion incluidos), no hay enlaces rotos ni errores de consola, no hay código en línea
ni hex sueltos, y la documentación afectada está actualizada.