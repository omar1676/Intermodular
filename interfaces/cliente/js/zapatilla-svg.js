/*
 * NOVA Sneakers - Zapatilla renderizada en SVG · Omar
 *
 * Dibujo propio hecho para este proyecto: no se usa ninguna marca,
 * logotipo ni fotografía de terceros, así que no hay problema de derechos.
 *
 * No es un icono plano. La silueta se monta por capas, como una foto de
 * producto en estudio:
 *
 *   1. sombra proyectada sobre la repisa (desenfocada de verdad)
 *   2. cuerpo con degradado de volumen
 *   3. luz cenital, oclusión en el apoyo y brillo especular en el empeine
 *   4. rebote cálido que sube desde la tira LED del escaparate
 *   5. mediasuela con brillo superior y canto cálido
 *   6. suela exterior con tacos y reflejo del LED
 *
 * Todas las capas van recortadas con clipPath contra la propia silueta,
 * que es lo que hace que la luz parezca envolver la zapatilla en vez de
 * quedar pegada encima.
 *
 * Si algún día conseguimos fotografías con licencia comprobada, basta con
 * añadir el campo "imagen" al modelo: el catálogo da prioridad a la foto y
 * usa este SVG solo como respaldo (ver catalogo.js).
 */

// Contornos compartidos por todas las zapatillas. Se recolorean, no se
// vuelven a dibujar.
const ZAPA_CUERPO =
  "M 36 148 C 52 116 98 96 152 93 C 198 90 240 96 272 86 " +
  "C 292 80 300 62 310 52 C 320 42 342 42 352 53 " +
  "C 361 62 363 78 361 95 C 359 114 365 130 374 140 L 36 148 Z";

const ZAPA_MEDIASUELA =
  "M 52 140 C 34 144 24 158 24 176 L 402 176 " +
  "C 404 154 394 138 372 135 L 52 140 Z";

const ZAPA_SUELA =
  "M 40 170 L 382 168 C 398 168 406 177 402 186 " +
  "C 399 193 391 196 382 196 L 46 196 " +
  "C 30 196 22 187 26 178 C 29 172 34 170 40 170 Z";

// principal: color del cuerpo | sombra: color inferior del degradado
// suela: color de la mediasuela | nombre: texto alternativo accesible
// clave: sufijo único para los IDs internos del SVG (si se repiten, los
//        degradados de unas zapatillas se pisan con los de otras)
// decorativa: true cuando el texto de al lado ya dice qué zapatilla es,
//        para que el lector de pantalla no lo repita dos veces
function svgZapatilla(principal, sombra, suela, nombre, clave, decorativa) {
  // Un identificador por cada recurso interno, con el sufijo de la pieza
  const id = function (parte) {
    return parte + "-" + clave;
  };

  const accesibilidad = decorativa
    ? 'aria-hidden="true" focusable="false"'
    : 'role="img" aria-label="Zapatilla ' + nombre + '"';

  return `
<svg class="zap" viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg"
     ${accesibilidad}>
  <defs>
    <!-- Volumen del cuerpo: iluminado arriba, apagado abajo -->
    <linearGradient id="${id("cuerpo")}" x1=".1" y1="0" x2=".3" y2="1">
      <stop offset="0" stop-color="${principal}"/>
      <stop offset=".42" stop-color="${principal}"/>
      <stop offset="1" stop-color="${sombra}"/>
    </linearGradient>

    <!-- Mediasuela: espuma clara que se apaga hacia el suelo -->
    <linearGradient id="${id("media")}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${suela}"/>
      <stop offset=".5" stop-color="${suela}"/>
      <stop offset="1" stop-color="${sombra}" stop-opacity=".45"/>
    </linearGradient>

    <!-- Luz cenital del escaparate -->
    <radialGradient id="${id("luz")}" cx=".34" cy=".1" r=".9">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".46"/>
      <stop offset=".5" stop-color="#ffffff" stop-opacity=".1"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Oclusión: la zapatilla se oscurece donde apoya -->
    <linearGradient id="${id("ocluir")}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".55"/>
    </linearGradient>

    <!-- Rebote cálido que sube desde la tira LED de la repisa -->
    <linearGradient id="${id("calida")}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#cfa958" stop-opacity="0"/>
      <stop offset="1" stop-color="#e3c27e" stop-opacity=".5"/>
    </linearGradient>

    <!-- Desenfoque de la sombra proyectada -->
    <filter id="${id("borron")}" x="-30%" y="-500%" width="160%" height="1100%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>

    <clipPath id="${id("recCuerpo")}"><path d="${ZAPA_CUERPO}"/></clipPath>
    <clipPath id="${id("recMedia")}"><path d="${ZAPA_MEDIASUELA}"/></clipPath>
  </defs>

  <!-- ===== Sombra sobre la repisa ===== -->
  <ellipse cx="212" cy="210" rx="152" ry="9" fill="#000000" opacity=".5"
           filter="url(#${id("borron")})"/>
  <ellipse cx="206" cy="205" rx="92" ry="6" fill="#000000" opacity=".5"
           filter="url(#${id("borron")})"/>

  <!-- ===== Cuerpo ===== -->
  <path d="${ZAPA_CUERPO}" fill="url(#${id("cuerpo")})"/>

  <g clip-path="url(#${id("recCuerpo")})">
    <!-- Luz cenital -->
    <ellipse cx="170" cy="58" rx="205" ry="98" fill="url(#${id("luz")})"/>

    <!-- Puntera: la curva se va de la luz -->
    <path d="M 36 148 C 50 120 72 103 100 97 L 118 150 Z"
          fill="#000000" opacity=".17"/>

    <!-- Panel lateral geométrico (diseño propio, no es ninguna marca) -->
    <path d="M 148 150 L 200 97 L 232 99 L 180 151 Z"
          fill="#000000" opacity=".22"/>
    <path d="M 196 151 L 246 98 L 258 99 L 208 152 Z"
          fill="#ffffff" opacity=".16"/>

    <!-- Costura de la puntera -->
    <path d="M 104 99 C 130 112 150 130 158 150" fill="none"
          stroke="#000000" stroke-opacity=".2" stroke-width="2.5"/>

    <!-- Brillo especular del empeine -->
    <path d="M 74 130 C 100 107 136 96 178 94" fill="none"
          stroke="#ffffff" stroke-opacity=".28" stroke-width="8"
          stroke-linecap="round"/>

    <!-- Oclusión en el apoyo -->
    <rect x="0" y="110" width="420" height="44" fill="url(#${id("ocluir")})"/>

    <!-- Rebote cálido del LED -->
    <rect x="0" y="122" width="420" height="30" fill="url(#${id("calida")})"
          opacity=".6"/>
  </g>

  <!-- ===== Cordones ===== -->
  <g stroke="#000000" stroke-opacity=".22" stroke-width="6"
     stroke-linecap="round">
    <path d="M 222 100 L 244 113"/>
    <path d="M 238 97 L 260 109"/>
    <path d="M 254 94 L 276 105"/>
    <path d="M 270 91 L 290 101"/>
  </g>
  <g stroke="#f3f1ec" stroke-opacity=".8" stroke-width="5"
     stroke-linecap="round">
    <path d="M 222 97 L 244 110"/>
    <path d="M 238 94 L 260 106"/>
    <path d="M 254 91 L 276 102"/>
    <path d="M 270 88 L 290 98"/>
  </g>

  <!-- ===== Boca del tobillo ===== -->
  <path d="M 278 86 C 296 74 318 62 338 60 C 350 59 358 63 360 72"
        fill="none" stroke="#000000" stroke-opacity=".34" stroke-width="8"
        stroke-linecap="round"/>
  <path d="M 281 82 C 298 70 318 58 338 56"
        fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="3"
        stroke-linecap="round"/>

  <!-- Tirador del talón -->
  <rect x="330" y="42" width="27" height="13" rx="6.5"
        fill="#000000" opacity=".3"/>

  <!-- ===== Mediasuela ===== -->
  <path d="${ZAPA_MEDIASUELA}" fill="url(#${id("media")})"/>

  <g clip-path="url(#${id("recMedia")})">
    <!-- Brillo del borde superior de la espuma -->
    <rect x="0" y="133" width="420" height="9" fill="#ffffff" opacity=".4"/>
    <!-- Sombra intermedia, para que la espuma tenga grosor -->
    <rect x="0" y="152" width="420" height="12" fill="#000000" opacity=".1"/>
    <!-- Canto inferior encendido por la tira LED -->
    <rect x="0" y="158" width="420" height="22" fill="url(#${id("calida")})"/>
  </g>

  <!-- ===== Suela exterior ===== -->
  <path d="${ZAPA_SUELA}" fill="#141418"/>

  <g stroke="#000000" stroke-opacity=".45" stroke-width="3">
    <path d="M 120 172 L 120 194"/>
    <path d="M 170 171 L 170 194"/>
    <path d="M 220 171 L 220 194"/>
    <path d="M 270 170 L 270 194"/>
    <path d="M 320 170 L 320 194"/>
  </g>

  <!-- Reflejo del LED en el canto de la suela -->
  <path d="M 46 196 L 382 196 C 391 196 399 193 402 186
           L 24 188 C 28 193 36 196 46 196 Z"
        fill="#cfa958" opacity=".42"/>
</svg>`;
}
