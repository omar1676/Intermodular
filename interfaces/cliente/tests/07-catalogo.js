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
comprobar("dibuja 12 piezas", piezas === 12, piezas);

// Cada pieza lleva el modelo y el indice de color que la ficha necesita
const parejas = [];
html.replace(/data-modelo="(\d+)"\s+data-color="(\d+)"/g, function (m, modelo, color) {
  parejas.push(modelo + "-" + color);
  return m;
});

comprobar("las 12 llevan modelo y color", parejas.length === 12, parejas.length);
comprobar("ninguna pareja repetida", new Set(parejas).size === 12, new Set(parejas).size);

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

comprobar("los seis modelos salen dos veces",
  CATALOGO_DEMO.every(function (modelo) {
    return parejas.filter(function (p) {
      return p.startsWith(modelo.id_modelo + "-");
    }).length === 2;
  }));

comprobar("no se pierde el color: cada modelo tiene su 0 y su 1",
  CATALOGO_DEMO.every(function (modelo) {
    return parejas.includes(modelo.id_modelo + "-0") &&
           parejas.includes(modelo.id_modelo + "-1");
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

  // NOVA Pulse Negro está agotado entero: esa pieza enseña "Agotado", no precio
  comprobar("precio de " + modelo.nombre + " (" + precio + ")",
    html.includes(precio) || agotados === modelo.variantes.length);
});

const agotadas = (html.match(/cli-pieza-agotado/g) || []).length;
comprobar("una sola pieza agotada", agotadas === 1, agotadas);

console.log("\n=== ESTADO DE LA PÁGINA ===");

comprobar("la rejilla deja de estar en 'cargando'",
  __nodos["cli-rejilla-catalogo"].className === "cli-rejilla",
  __nodos["cli-rejilla-catalogo"].className);

comprobar("el recuento sale de los datos",
  __nodos["cli-cuenta-catalogo"].textContent === "6 modelos · 12 acabados",
  __nodos["cli-cuenta-catalogo"].textContent);

comprobar("ningun id de degradado repetido",
  (function () {
    const ids = html.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || [];
    return ids.length > 0 && new Set(ids).size === ids.length;
  })());

comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

comprobar("existe el escuchador de clics reutilizado",
  typeof activarClicsDePiezas === "function");

console.log("\n" + (fallos === 0 ? "CATÁLOGO CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
