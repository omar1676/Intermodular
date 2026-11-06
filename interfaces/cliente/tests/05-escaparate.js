/* Escaparate: el marcado de las doce piezas */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js",
  "escaparate.js"
]);

let fallos = 0;
function comprobar(n, c, d) {
  console.log((c ? "  OK   " : "  FALLO") + "  " + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}
const cuenta = (re) => (html.match(re) || []).length;

pintarEscaparate(CATALOGO_DEMO);
const html = __nodos["cli-rejilla"].innerHTML;

// --- Estructura del muro ---
comprobar("12 piezas, una por color", cuenta(/class="cli-pieza[ "]/g) === 12, cuenta(/class="cli-pieza[ "]/g));
comprobar("12 zapatillas dibujadas", cuenta(/<svg/g) === 12, cuenta(/<svg/g));
comprobar("cada pieza lleva su repisa", cuenta(/class="cli-balda"/g) === 12, cuenta(/class="cli-balda"/g));
comprobar("se quita el estado de carga", __nodos["cli-rejilla"].className === "cli-rejilla", __nodos["cli-rejilla"].className);

// --- Identificadores de los degradados ---
// Si dos zapatillas comparten el id de un degradado, la segunda se pinta
// con los colores de la primera. Por eso cada pieza usa su id_variante.
comprobar("IDs de degradado distintos", new Set(html.match(/cuerpo-v\d+/g)).size === 12, new Set(html.match(/cuerpo-v\d+/g)).size);
comprobar("todas las capas de luz tienen sufijo propio", new Set(html.match(/calida-v\d+/g)).size === 12, new Set(html.match(/calida-v\d+/g)).size);
comprobar("los recortes no se pisan entre piezas", new Set(html.match(/recCuerpo-v\d+/g)).size === 12, new Set(html.match(/recCuerpo-v\d+/g)).size);

// --- Contenido ---
comprobar("aparecen los 6 nombres", ["NOVA Origin","NOVA Velocity","NOVA Eclipse","NOVA Archive","NOVA Aura","NOVA Pulse"].every(n => html.includes(n)));
comprobar("aparecen los colores", ["Blanco","Negro","Rojo","Azul","Gris","Beige","Rosa","Crema","Verde"].every(c => html.includes(">" + c + "<")));
comprobar("precios con formato español", html.includes("79,99") && html.includes("129,99"));
comprobar("ningún texto 'undefined' o 'NaN'", !/undefined|NaN/.test(html));

// --- Navegación ---
comprobar("cada pieza lleva su modelo", cuenta(/data-modelo="\d+"/g) === 12, cuenta(/data-modelo="\d+"/g));
comprobar("cada pieza lleva su color", cuenta(/data-color="\d+"/g) === 12, cuenta(/data-color="\d+"/g));
comprobar("retardo escalonado de animación", cuenta(/animation-delay: \d\.\d+s/g) === 12, cuenta(/animation-delay: \d\.\d+s/g));

// --- Stock ---
// NOVA Pulse Negro (variante 12) no tiene ninguna talla con existencias.
comprobar("el color agotado se marca", cuenta(/cli-sin-stock/g) === 1, cuenta(/cli-sin-stock/g));
comprobar("el color agotado lo dice por escrito", cuenta(/>Agotado</g) === 1, cuenta(/>Agotado</g));
comprobar("los 11 colores con stock muestran precio", cuenta(/cli-pieza-precio/g) === 11, cuenta(/cli-pieza-precio/g));

// --- Accesibilidad ---
// Los SVG del escaparate son decorativos: el rótulo de al lado ya dice
// qué zapatilla es, así que el lector de pantalla no debe leerlo dos veces.
comprobar("los SVG del escaparate son decorativos", cuenta(/focusable="false"/g) === 12, cuenta(/focusable="false"/g));
comprobar("ningún SVG repite el nombre", !html.includes('aria-label="Zapatilla'));
comprobar("el rótulo sí nombra la zapatilla", html.includes("NOVA Origin"));

// --- Fotografías ---
// Con la tabla FOTOS vacía se dibuja todo. En cuanto un color tiene
// foto, esa pieza pasa a ser <img> y deja apuntado qué dibujar si falla.
comprobar("sin fotos, se dibujan las 12", cuenta(/<img/g) === 0, cuenta(/<img/g));

FOTOS[1] = "img/origin-blanco.png";
FOTOS[12] = "  img/pulse-negro.png  ";   // con espacios, a ver si los quita
pintarEscaparate(CATALOGO_DEMO);
const conFoto = __nodos["cli-rejilla"].innerHTML;
const cuenta2 = (re) => (conFoto.match(re) || []).length;

comprobar("los colores con foto usan <img>", cuenta2(/<img/g) === 2, cuenta2(/<img/g));
comprobar("se recortan los espacios del nombre", conFoto.includes('src="img/pulse-negro.png"'));
comprobar("los otros 10 se siguen dibujando", cuenta2(/<svg/g) === 10, cuenta2(/<svg/g));
comprobar("cada foto deja apuntado su repuesto", cuenta2(/data-respaldo="(1|12)"/g) === 2, cuenta2(/data-respaldo="(1|12)"/g));
comprobar("la foto del escaparate es decorativa", cuenta2(/<img[^>]*aria-hidden="true"/g) === 2);
comprobar("el repuesto existe y es un dibujo", dibujoPorVariante(1).includes("<svg"));
comprobar("un id inventado no revienta", dibujoPorVariante(999) === "", JSON.stringify(dibujoPorVariante(999)));

FOTOS[1] = "";
FOTOS[12] = "";

console.log("\n" + (fallos === 0 ? "MARCADO CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
