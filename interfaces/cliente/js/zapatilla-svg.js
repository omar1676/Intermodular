/*
 * NOVA Sneakers - Ilustración de zapatilla en SVG
 *
 * Dibujo propio hecho para este proyecto: no se usa ninguna marca,
 * logotipo ni fotografía de terceros, así que no hay problema de derechos.
 *
 * La misma silueta se recolorea con los colores de cada variante, así que
 * seis modelos y doce colores pesan prácticamente nada.
 *
 * Si algún día conseguimos fotografías con licencia comprobada, basta con
 * añadir el campo "imagen" al modelo: el catálogo da prioridad a la foto y
 * usa este SVG solo como respaldo (ver catalogo.js).
 */

// principal: color del cuerpo | sombra: color inferior del degradado
// suela: color de la mediasuela | nombre: texto alternativo accesible
// clave: sufijo único para los IDs internos del SVG (si se repiten, los
//        degradados de unas zapatillas se pisan con los de otras)
// decorativa: true cuando el texto de al lado ya dice qué zapatilla es,
//        para que el lector de pantalla no lo repita dos veces
function svgZapatilla(principal, sombra, suela, nombre, clave, decorativa) {
  const idCuerpo = "cuerpo-" + clave;
  const idSuela = "suela-" + clave;

  const accesibilidad = decorativa
    ? 'aria-hidden="true" focusable="false"'
    : 'role="img" aria-label="Zapatilla ' + nombre + '"';

  return `
<svg class="zap" viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg"
     ${accesibilidad}>
  <defs>
    <linearGradient id="${idCuerpo}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${principal}"/>
      <stop offset="1" stop-color="${sombra}"/>
    </linearGradient>
    <linearGradient id="${idSuela}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${suela}"/>
      <stop offset="1" stop-color="${sombra}" stop-opacity=".55"/>
    </linearGradient>
  </defs>

  <!-- Sombra de contacto con la repisa -->
  <ellipse cx="214" cy="206" rx="158" ry="11" fill="#000" opacity=".45"/>

  <!-- Cuerpo de la zapatilla -->
  <path d="M 36 148
           C 52 116 98 96 152 93
           C 198 90 240 96 272 86
           C 292 80 300 62 310 52
           C 320 42 342 42 352 53
           C 361 62 363 78 361 95
           C 359 114 365 130 374 140
           L 36 148 Z"
        fill="url(#${idCuerpo})"/>

  <!-- Puntera reforzada -->
  <path d="M 36 148 C 50 120 72 103 100 97 L 112 146 Z"
        fill="#000" opacity=".16"/>

  <!-- Panel lateral geométrico (diseño propio, no es ninguna marca) -->
  <path d="M 150 147 L 200 99 L 230 101 L 180 148 Z"
        fill="#000" opacity=".2"/>
  <path d="M 196 148 L 244 100 L 254 101 L 206 149 Z"
        fill="#fff" opacity=".14"/>

  <!-- Cordones -->
  <g stroke="#fff" stroke-opacity=".75" stroke-width="5" stroke-linecap="round">
    <path d="M 222 97 L 244 110"/>
    <path d="M 238 94 L 260 106"/>
    <path d="M 254 91 L 276 102"/>
    <path d="M 270 88 L 290 98"/>
  </g>

  <!-- Boca del tobillo -->
  <path d="M 278 86 C 296 74 318 62 338 60 C 350 59 358 63 360 72"
        fill="none" stroke="#000" stroke-opacity=".3" stroke-width="7"
        stroke-linecap="round"/>

  <!-- Tirador del talón -->
  <rect x="330" y="43" width="26" height="13" rx="6.5"
        fill="#000" opacity=".28"/>

  <!-- Mediasuela -->
  <path d="M 52 140
           C 34 144 24 158 24 176
           L 402 176
           C 404 154 394 138 372 135
           L 52 140 Z"
        fill="url(#${idSuela})"/>

  <!-- Suela exterior -->
  <path d="M 40 170
           L 382 168
           C 398 168 406 177 402 186
           C 399 193 391 196 382 196
           L 46 196
           C 30 196 22 187 26 178
           C 29 172 34 170 40 170 Z"
        fill="#17171b"/>

  <!-- Dibujo del tacón -->
  <g stroke="#000" stroke-opacity=".35" stroke-width="3">
    <path d="M 120 172 L 120 194"/>
    <path d="M 170 171 L 170 194"/>
    <path d="M 220 171 L 220 194"/>
    <path d="M 270 170 L 270 194"/>
    <path d="M 320 170 L 320 194"/>
  </g>

  <!-- Reflejo naranja del escaparate sobre la suela -->
  <path d="M 46 196 L 382 196 C 391 196 399 193 402 186
           L 24 188 C 28 193 36 196 46 196 Z"
        fill="#ff7a1a" opacity=".5"/>
</svg>`;
}
