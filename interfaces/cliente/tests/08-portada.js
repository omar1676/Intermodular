/* Portada: ocho destacadas en dos filas de cuatro */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js",
  "escaparate.js"
]);

let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK    " : "  FALLO ") + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

pintarEscaparate(CATALOGO_DEMO);
const html = __nodos["cli-rejilla"].innerHTML;
const cuenta = (re) => (html.match(re) || []).length;
const piezas = destacadas(CATALOGO_DEMO);
const marcados = CATALOGO_DEMO.filter(function (m) { return m.destacado; });

console.log("=== OCHO PIEZAS ===");

comprobar("dibuja 8 piezas", cuenta(/class="cli-pieza[ "]/g) === 8, cuenta(/class="cli-pieza[ "]/g));
comprobar("las ocho caben en dos filas de cuatro", piezas.length % 4 === 0, piezas.length);
comprobar("son menos que el catálogo entero",
  piezas.length < piezasDelCatalogo(CATALOGO_DEMO).length,
  piezas.length + " de " + piezasDelCatalogo(CATALOGO_DEMO).length);

console.log("\n=== LAS QUE EL CATÁLOGO MARCA ===");

comprobar("son exactamente las marcadas como destacado",
  piezas.length === marcados.length, marcados.length + " marcados");
comprobar("y están todas",
  marcados.every(function (m) { return html.includes('data-modelo="' + m.id_modelo + '"'); }));
comprobar("no se cuela ninguna sin marcar",
  CATALOGO_DEMO.filter(function (m) { return !m.destacado; })
    .every(function (m) { return !html.includes('data-modelo="' + m.id_modelo + '"'); }));
comprobar("aparecen sus nombres",
  marcados.every(function (m) { return html.includes(m.nombre); }));

console.log("\n=== NINGUNA AGOTADA ===");

comprobar("no se destaca nada agotado",
  piezas.every(function (p) { return !colorSinExistencias(p.variante); }));
comprobar("no sale la palabra Agotado", cuenta(/>Agotado</g) === 0, cuenta(/>Agotado</g));
comprobar("las ocho llevan precio", cuenta(/cli-pieza-precio/g) === 8, cuenta(/cli-pieza-precio/g));

console.log("\n=== YA NO SE OFRECE EL CATÁLOGO DESDE AQUÍ ===");

const portada = require("fs").readFileSync(__dirname + "/../index.html", "utf8");
comprobar("la portada no lleva el botón al catálogo", !portada.includes("cli-ir-catalogo"));
comprobar("y el catálogo se alcanza por el menú", portada.includes('href="catalogo.html"'));

console.log("\n=== SIGUE SIENDO LA MISMA FUNCIÓN DE DIBUJO ===");

const aparte = document.getElementById("rejilla-de-prueba");
pintarPiezas(aparte, destacadas(CATALOGO_DEMO));
comprobar("la portada no dibuja por su cuenta", aparte.innerHTML === html,
  aparte.innerHTML.length + " vs " + html.length + " caracteres");

console.log("\n=== LO DE SIEMPRE ===");

comprobar("se quita el estado de carga",
  __nodos["cli-rejilla"].className === "cli-rejilla", __nodos["cli-rejilla"].className);
comprobar("cada pieza lleva su repisa", cuenta(/class="cli-balda"/g) === 8);
comprobar("cada pieza lleva modelo y acabado",
  cuenta(/data-modelo="\d+"/g) === 8 && cuenta(/data-color="\d+"/g) === 8);
comprobar("todas se pintan con su fotografía", cuenta(/<img/g) === 8, cuenta(/<img/g));
comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n" + (fallos === 0 ? "PORTADA CORRECTA" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
