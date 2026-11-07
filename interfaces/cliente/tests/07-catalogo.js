/* Catálogo completo: la página nueva */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js",
  "catalogo.js"
]);

let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK    " : "  FALLO ") + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

pintarCatalogo(CATALOGO_DEMO);
const html = __nodos["cli-rejilla-catalogo"].innerHTML;

console.log("=== LAS DOCE VARIANTES ===");

const piezas = (html.match(/class="cli-pieza[ "]/g) || []).length;
comprobar("dibuja una pieza por variante", piezas === piezasDelCatalogo(CATALOGO_DEMO).length, piezas);

// Cada pieza lleva el modelo y el indice de color que la ficha necesita
const parejas = [];
html.replace(/data-modelo="(\d+)"\s+data-color="(\d+)"/g, function (m, modelo, color) {
  parejas.push(modelo + "-" + color);
  return m;
});

comprobar("todas llevan modelo y color", parejas.length === piezas, parejas.length);
comprobar("ninguna pareja repetida", new Set(parejas).size === piezas, new Set(parejas).size);

// Las parejas tienen que ser exactamente las del catálogo
const esperadas = [];
CATALOGO_DEMO.forEach(function (modelo) {
  modelo.variantes.forEach(function (variante, indice) {
    esperadas.push(modelo.id_modelo + "-" + indice);
  });
});

comprobar("son las mismas que en CATALOGO_DEMO",
  esperadas.sort().join(",") === parejas.slice().sort().join(","),
  parejas.length + " piezas");

comprobar("cada modelo sale una sola vez",
  CATALOGO_DEMO.every(function (modelo) {
    return parejas.filter(function (p) {
      return p.startsWith(modelo.id_modelo + "-");
    }).length === modelo.variantes.length;
  }));

comprobar("no se pierde el acabado: cada modelo lleva el suyo",
  CATALOGO_DEMO.every(function (modelo) {
    return modelo.variantes.every(function (v, i) {
      return parejas.includes(modelo.id_modelo + "-" + i);
    });
  }));

// La pagina no dibuja nada por su cuenta: usa la funcion compartida
const aparte = document.getElementById("rejilla-de-prueba");
pintarPiezas(aparte, piezasDelCatalogo(CATALOGO_DEMO));
comprobar("dibuja lo mismo que pintarPiezas, sin copiar nada",
  aparte.innerHTML === html, aparte.innerHTML.length + " vs " + html.length + " caracteres");

console.log("\n=== PRECIOS ===");

CATALOGO_DEMO.forEach(function (modelo) {
  const precio = formatearPrecio(precioFinal(modelo, modelo.variantes[0]));
  const agotados = modelo.variantes.filter(colorSinExistencias).length;

  // Un acabado agotado entero enseña "Agotado" en lugar del precio
  comprobar("precio de " + modelo.nombre + " (" + precio + ")",
    html.includes(precio) || agotados === modelo.variantes.length);
});

// Cuantas piezas van con el aviso lo dice el catálogo, no un número a mano
const sinNada = CATALOGO_DEMO.filter(function (modelo) {
  return modelo.variantes.every(colorSinExistencias);
}).length;

const agotadas = (html.match(/cli-pieza-agotado/g) || []).length;
comprobar("tantos avisos de agotado como acabados sin existencias (" + sinNada + ")",
  agotadas === sinNada, agotadas);

console.log("\n=== ESTADO DE LA PÁGINA ===");

comprobar("la rejilla deja de estar en 'cargando'",
  __nodos["cli-rejilla-catalogo"].className === "cli-rejilla",
  __nodos["cli-rejilla-catalogo"].className);

comprobar("el recuento sale de los datos",
  __nodos["cli-cuenta-catalogo"].textContent === piezas + " modelos, uno por fotografía",
  __nodos["cli-cuenta-catalogo"].textContent);

// Hoy todas las zapatillas tienen foto, asi que no se dibuja ningun SVG.
// Se vacia FOTOS un momento para comprobar que los dibujos de respaldo
// siguen sin repetir identificadores de degradado.
const fotosGuardadas = Object.assign({}, FOTOS);
Object.keys(FOTOS).forEach(function (k) { FOTOS[k] = ""; });
pintarCatalogo(CATALOGO_DEMO);
const dibujado = __nodos["cli-rejilla-catalogo"].innerHTML;
Object.keys(fotosGuardadas).forEach(function (k) { FOTOS[k] = fotosGuardadas[k]; });

comprobar("sin fotos se dibujan todas", (dibujado.match(/<svg/g) || []).length === piezas,
  (dibujado.match(/<svg/g) || []).length);
comprobar("ningun id de degradado repetido",
  (function () {
    const ids = dibujado.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || [];
    return ids.length > 0 && new Set(ids).size === ids.length;
  })());

comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

comprobar("existe el escuchador de clics reutilizado",
  typeof activarClicsDePiezas === "function");


console.log("\n=== LA PAGINA ESTA BIEN CABLEADA ===");

// Si alguien quita la hoja o la clase, el catalogo se queda con el
// aspecto del escaparate sin que falle nada. Por eso se comprueba aqui.
const paginaCatalogo = require("fs").readFileSync(__dirname + "/../catalogo.html", "utf8");

comprobar("catalogo.html carga su propia hoja de estilos",
  paginaCatalogo.includes("css/catalogo.css"));
comprobar("y su muro lleva la clase que la activa",
  paginaCatalogo.includes("cli-muro-catalogo"));
comprobar("sigue cargando piezas.js, que es lo que dibuja",
  paginaCatalogo.includes("js/piezas.js"));

console.log("\n" + (fallos === 0 ? "CATÁLOGO CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
