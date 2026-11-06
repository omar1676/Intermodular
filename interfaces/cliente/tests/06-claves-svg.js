/* Claves unicas de los SVG */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "pedidos-datos.js",
  "carrito.js",
  "pedidos.js",
  "piezas.js",
  "catalogo.js"
]);

/*
 * Claves únicas de los SVG.
 *
 * Dos SVG con el mismo id de degradado en la misma página hacen que el
 * segundo se pinte con los colores del primero. Pasó de verdad: el
 * carrito usaba el color como clave, así que dos tallas del mismo color
 * compartían id.
 */
let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK   " : "  FALLO") + "  " + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

function idsDe(html) {
  return (html.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || []);
}

function todosDistintos(html) {
  const ids = idsDe(html);
  return { total: ids.length, distintos: new Set(ids).size };
}

console.log("CARRITO: dos tallas del mismo color");
carroVaciar();
carroAnadir("NOVA-3-42", 1);
carroAnadir("NOVA-3-43", 1);
pintarCarrito();
let r = todosDistintos(__nodos["cli-zona-carrito"].innerHTML);
comprobar("ningun id repetido", r.distintos === r.total, r.distintos + " de " + r.total);
comprobar("hay dos zapatillas dibujadas", r.total > 0, r.total + " ids");

console.log("\nMIS PEDIDOS: el mismo SKU en dos pedidos distintos");
carroVaciar();
carroAnadir("NOVA-1-42", 1);   // ya sale en el pedido de ejemplo WEB-DEMO-000001
const pedido = crearPedidoDemo(carroLeer());
comprobar("se ha creado el pedido", pedido !== null, pedido && pedido.referencia);
pintarPedidos();
r = todosDistintos(__nodos["cli-zona-pedidos"].innerHTML);
comprobar("ningun id repetido", r.distintos === r.total, r.distintos + " de " + r.total);

console.log("\nESCAPARATE: las doce piezas");
pintarEscaparate(CATALOGO_DEMO);
r = todosDistintos(__nodos["cli-rejilla"].innerHTML);
comprobar("ningun id repetido", r.distintos === r.total, r.distintos + " de " + r.total);

console.log("\n" + (fallos === 0 ? "CLAVES CORRECTAS" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
