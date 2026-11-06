/* Portada: seis destacadas, una por modelo */

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

console.log("=== SEIS DESTACADAS ===");

comprobar("dibuja 6 piezas, no 12", cuenta(/class="cli-pieza[ "]/g) === 6, cuenta(/class="cli-pieza[ "]/g));
comprobar("hay tantas piezas como modelos", cuenta(/class="cli-pieza[ "]/g) === CATALOGO_DEMO.length, CATALOGO_DEMO.length + " modelos");

const modelos = [];
html.replace(/data-modelo="(\d+)"/g, function (m, id) { modelos.push(id); return m; });

comprobar("un modelo distinto en cada pieza", new Set(modelos).size === 6, new Set(modelos).size);
comprobar("están los seis modelos del catálogo",
  CATALOGO_DEMO.every(function (modelo) {
    return modelos.includes(String(modelo.id_modelo));
  }));
comprobar("aparecen los seis nombres",
  CATALOGO_DEMO.every(function (modelo) { return html.includes(modelo.nombre); }));

comprobar("todas enseñan el primer color", cuenta(/data-color="0"/g) === 6, cuenta(/data-color="0"/g));
comprobar("ninguna enseña el segundo", cuenta(/data-color="[1-9]"/g) === 0, cuenta(/data-color="[1-9]"/g));

comprobar("el color que se enseña es el primero de cada modelo",
  CATALOGO_DEMO.every(function (modelo) {
    return html.includes(">" + modelo.variantes[0].color + "<");
  }));

console.log("\n=== SIGUE SIENDO LA MISMA FUNCIÓN DE SIEMPRE ===");

// destacadas() solo filtra; el dibujo lo sigue haciendo pintarPiezas
const aparte = document.getElementById("rejilla-de-prueba");
pintarPiezas(aparte, destacadas(CATALOGO_DEMO));
comprobar("la portada no dibuja por su cuenta", aparte.innerHTML === html,
  aparte.innerHTML.length + " vs " + html.length + " caracteres");

comprobar("destacadas() saca 6 de las 12",
  destacadas(CATALOGO_DEMO).length === 6 &&
  piezasDelCatalogo(CATALOGO_DEMO).length === 12,
  destacadas(CATALOGO_DEMO).length + " de " + piezasDelCatalogo(CATALOGO_DEMO).length);

console.log("\n=== EL PASO AL CATÁLOGO COMPLETO ===");

comprobar("el enlace dice cuántos acabados hay, sacado de los datos",
  __nodos["cli-ir-catalogo"].textContent === "Ver los 12 acabados del catálogo",
  __nodos["cli-ir-catalogo"].textContent);

console.log("\n=== LO DE SIEMPRE ===");

comprobar("se quita el estado de carga",
  __nodos["cli-rejilla"].className === "cli-rejilla", __nodos["cli-rejilla"].className);
comprobar("cada pieza lleva su repisa", cuenta(/class="cli-balda"/g) === 6, cuenta(/class="cli-balda"/g));
comprobar("precios con formato español", html.includes("79,99") && html.includes("129,99"));
comprobar("ningún id de degradado repetido", (function () {
  const ids = html.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || [];
  return ids.length > 0 && new Set(ids).size === ids.length;
})());
comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n" + (fallos === 0 ? "PORTADA CORRECTA" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
