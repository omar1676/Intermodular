/* El marcado de las piezas, tal y como lo dibuja piezas.js */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js"
]);

let fallos = 0;
function comprobar(n, c, d) {
  console.log((c ? "  OK   " : "  FALLO") + "  " + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}

const PIEZAS = piezasDelCatalogo(CATALOGO_DEMO);
const AGOTADAS = PIEZAS.filter(function (p) { return colorSinExistencias(p.variante); }).length;

pintarPiezas(document.getElementById("cli-rejilla"), PIEZAS);
const html = __nodos["cli-rejilla"].innerHTML;
const cuenta = (re) => (html.match(re) || []).length;

console.log("=== ESTRUCTURA ===");

comprobar("una pieza por variante", cuenta(/class="cli-pieza[ "]/g) === PIEZAS.length, PIEZAS.length);
comprobar("cada pieza lleva su repisa", cuenta(/class="cli-balda"/g) === PIEZAS.length);
comprobar("se quita el estado de carga", __nodos["cli-rejilla"].className === "cli-rejilla");

console.log("\n=== CONTENIDO ===");

comprobar("aparecen todos los nombres",
  CATALOGO_DEMO.every(function (m) { return html.includes(m.nombre); }));
comprobar("aparecen todos los acabados",
  PIEZAS.every(function (p) { return html.includes(">" + p.variante.color + "<"); }));
comprobar("cada pieza lleva su reclamo",
  CATALOGO_DEMO.every(function (m) { return html.includes(m.descripcion); }));
comprobar("precios con formato español", html.includes(",") && /\d,\d\d/.test(html));
comprobar("ningún texto 'undefined' o 'NaN'", !/undefined|NaN/.test(html));

console.log("\n=== NAVEGACIÓN ===");

comprobar("cada pieza lleva su modelo", cuenta(/data-modelo="\d+"/g) === PIEZAS.length);
comprobar("cada pieza lleva su acabado", cuenta(/data-color="\d+"/g) === PIEZAS.length);
comprobar("retardo escalonado de animación", cuenta(/animation-delay: \d\.\d+s/g) === PIEZAS.length);

console.log("\n=== STOCK ===");

comprobar("los agotados se marcan", cuenta(/cli-sin-stock/g) === AGOTADAS, AGOTADAS);
comprobar("y lo dicen por escrito", cuenta(/>Agotado</g) === AGOTADAS);
comprobar("los demás muestran precio",
  cuenta(/cli-pieza-precio/g) === PIEZAS.length - AGOTADAS, PIEZAS.length - AGOTADAS);

console.log("\n=== FOTOGRAFÍAS ===");

// Hoy todas las variantes tienen foto
comprobar("todas se pintan con <img>", cuenta(/<img/g) === PIEZAS.length, cuenta(/<img/g));
comprobar("ningún SVG dibujado", cuenta(/<svg/g) === 0, cuenta(/<svg/g));
comprobar("cada foto deja apuntado su repuesto",
  cuenta(/data-respaldo="\d+"/g) === PIEZAS.length);
comprobar("la foto es decorativa: el rótulo ya la nombra",
  cuenta(/<img[^>]*aria-hidden="true"/g) === PIEZAS.length);
comprobar("se cargan con pereza", cuenta(/loading="lazy"/g) === PIEZAS.length);

console.log("\n=== SIN FOTOS, SE DIBUJA ===");

// Si mañana se quita una foto, su zapatilla tiene que volver a dibujarse
const guardadas = Object.assign({}, FOTOS);
FOTOS[PIEZAS[0].variante.id_variante] = "";
FOTOS[PIEZAS[1].variante.id_variante] = "   " + guardadas[PIEZAS[1].variante.id_variante] + "   ";
pintarPiezas(document.getElementById("cli-rejilla"), PIEZAS);
const mixto = __nodos["cli-rejilla"].innerHTML;
const cuenta2 = (re) => (mixto.match(re) || []).length;

comprobar("la que se queda sin foto se dibuja", cuenta2(/<svg/g) === 1, cuenta2(/<svg/g));
comprobar("las demás siguen con foto", cuenta2(/<img/g) === PIEZAS.length - 1);
comprobar("se recortan los espacios del nombre",
  mixto.includes('src="' + guardadas[PIEZAS[1].variante.id_variante] + '"'));
comprobar("los SVG del escaparate son decorativos", cuenta2(/focusable="false"/g) === 1);
comprobar("ningún SVG repite el nombre", !mixto.includes('aria-label="Zapatilla'));

Object.keys(guardadas).forEach(function (k) { FOTOS[k] = guardadas[k]; });

comprobar("el respaldo existe y es un dibujo",
  dibujoPorVariante(PIEZAS[0].variante.id_variante).includes("<svg"));
comprobar("un id inventado no revienta", dibujoPorVariante(9999) === "");
comprobar("FOTOS queda como estaba",
  Object.keys(FOTOS).every(function (k) { return FOTOS[k] === guardadas[k]; }));

console.log("\n" + (fallos === 0 ? "MARCADO CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
