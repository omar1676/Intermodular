/* Portada: ocho piezas en dos filas de cuatro */

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

console.log("=== OCHO PIEZAS ===");

comprobar("dibuja 8 piezas", cuenta(/class="cli-pieza[ "]/g) === 8, cuenta(/class="cli-pieza[ "]/g));
comprobar("las que dice la constante", piezas.length === PIEZAS_PORTADA, PIEZAS_PORTADA);
comprobar("ocho, no las doce del catalogo",
  piezas.length < piezasDelCatalogo(CATALOGO_DEMO).length,
  piezas.length + " de " + piezasDelCatalogo(CATALOGO_DEMO).length);

console.log("\n=== ESTAN LOS SEIS MODELOS ===");

const modelos = [];
html.replace(/data-modelo="(\d+)"/g, function (m, id) { modelos.push(id); return m; });

comprobar("los seis modelos salen", new Set(modelos).size === 6, new Set(modelos).size);
comprobar("ninguno sale mas de dos veces",
  CATALOGO_DEMO.every(function (modelo) {
    return modelos.filter(function (id) { return id === String(modelo.id_modelo); }).length <= 2;
  }));
comprobar("aparecen los seis nombres",
  CATALOGO_DEMO.every(function (modelo) { return html.includes(modelo.nombre); }));

console.log("\n=== Y DOS COLORES MAS ===");

const segundos = piezas.filter(function (pieza) { return pieza.indice > 0; });
comprobar("hay dos piezas de segundo color", segundos.length === 2, segundos.length);
comprobar("seis son el primer color de su modelo",
  piezas.filter(function (pieza) { return pieza.indice === 0; }).length === 6);

console.log("\n=== NINGUNA AGOTADA ===");

comprobar("no se destaca ningun color agotado",
  piezas.every(function (pieza) { return !colorSinExistencias(pieza.variante); }));
comprobar("y por eso NOVA Pulse Negro se queda fuera",
  !piezas.some(function (pieza) { return pieza.variante.id_variante === 12; }));
comprobar("no sale la palabra Agotado", cuenta(/>Agotado</g) === 0, cuenta(/>Agotado</g));
comprobar("las ocho llevan precio", cuenta(/cli-pieza-precio/g) === 8, cuenta(/cli-pieza-precio/g));

console.log("\n=== SIGUE SIENDO LA MISMA FUNCION DE DIBUJO ===");

const aparte = document.getElementById("rejilla-de-prueba");
pintarPiezas(aparte, destacadas(CATALOGO_DEMO));
comprobar("la portada no dibuja por su cuenta", aparte.innerHTML === html,
  aparte.innerHTML.length + " vs " + html.length + " caracteres");

console.log("\n=== EL PASO AL CATALOGO COMPLETO ===");

comprobar("el enlace cuenta los acabados de los datos",
  __nodos["cli-ir-catalogo"].textContent === "Ver los 12 acabados del catálogo",
  __nodos["cli-ir-catalogo"].textContent);

console.log("\n=== LO DE SIEMPRE ===");

comprobar("se quita el estado de carga",
  __nodos["cli-rejilla"].className === "cli-rejilla", __nodos["cli-rejilla"].className);
comprobar("cada pieza lleva su repisa", cuenta(/class="cli-balda"/g) === 8, cuenta(/class="cli-balda"/g));
comprobar("cada pieza lleva modelo y color", cuenta(/data-modelo="\d+"/g) === 8 && cuenta(/data-color="\d+"/g) === 8);
comprobar("precios con formato español", html.includes("79,99") && html.includes("129,99"));
comprobar("ningun id de degradado repetido", (function () {
  const ids = html.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || [];
  return ids.length > 0 && new Set(ids).size === ids.length;
})());
comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n" + (fallos === 0 ? "PORTADA CORRECTA" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
