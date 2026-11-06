/* Carrito: lo que se dibuja en pantalla */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "pedidos-datos.js",
  "carrito.js"
]);

let fallos = 0;
function ok(n, c, d) {
  console.log((c ? "  OK    " : "  FALLO ") + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}

// Dos productos cualesquiera del catalogo, con existencias
const UNO = CATALOGO_DEMO[0];
const OTRO = CATALOGO_DEMO[3];
const SKU_UNO = UNO.variantes[0].tallas.find(function (t) { return t.stock > 0; }).sku;
const SKU_OTRO = OTRO.variantes[0].tallas.find(function (t) { return t.stock > 0; }).sku;
const TALLA_UNO = buscarSku(SKU_UNO).talla.talla;
const TALLA_OTRO = buscarSku(SKU_OTRO).talla.talla;
const TOTAL = formatearPrecio(2 * precioFinal(UNO, UNO.variantes[0]) + precioFinal(OTRO, OTRO.variantes[0]));

console.log("\n=== DIBUJADO DEL CARRITO ===");

// Carrito vacio
carroVaciar();
pintarCarrito();
let html = __nodos["cli-zona-carrito"].innerHTML;
ok("carrito vacio muestra el aviso", html.includes("Tu carrito está vacío"));
ok("carrito vacio ofrece volver al escaparate", html.includes("index.html"));

// Carrito con dos lineas
carroAnadir(SKU_UNO, 2);
carroAnadir(SKU_OTRO, 1);
pintarCarrito();
html = __nodos["cli-zona-carrito"].innerHTML;

ok("dibuja 2 lineas", (html.match(/class="cli-carro-linea"/g) || []).length === 2, (html.match(/class="cli-carro-linea"/g) || []).length);
ok("miniatura SVG en cada linea", (html.match(/<svg/g) || []).length === 2);
ok("nombres de los modelos", html.includes(UNO.nombre) && html.includes(OTRO.nombre));
ok("color y talla visibles", html.includes("Talla " + TALLA_UNO) && html.includes("Talla " + TALLA_OTRO));
ok("referencia visible", html.includes(SKU_UNO));
ok("boton de quitar por linea", (html.match(/data-quitar=/g) || []).length === 2);
ok("botones de mas y menos", html.includes("data-mas=") && html.includes("data-menos="));
ok("boton de vaciar", html.includes('id="cli-vaciar"'));
ok("boton de finalizar", html.includes('id="cli-finalizar"'));
ok("resumen con 2 articulos distintos", html.includes("Artículos distintos"));
ok("total del carrito", html.includes(TOTAL), "esperado " + TOTAL);
ok("avisa de que no se cobra nada", html.includes("No se cobra nada"));
ok("sin undefined ni NaN", !/undefined|NaN/.test(html));

// Menos deshabilitado cuando la cantidad es 1
// El boton de restar de esa linea tiene que venir con disabled detras
const desdeElMenos = html.slice(html.indexOf("data-menos=\"" + SKU_OTRO));
ok("el menos esta deshabilitado con cantidad 1", desdeElMenos.slice(0, 120).includes("disabled"));

// El contador de la cabecera
pintarContadorCarro();
ok("contador de la cabecera", carroUnidades() === 3, carroUnidades());

console.log("\n=== DOBLE CLIC EN FINALIZAR ===");

__almacen.delete("nova_pedidos_demo");
carroVaciar();
carroAnadir(SKU_UNO, 1);

const antes = pedidosGuardados().length;
finalizarPedido();
finalizarPedido();
finalizarPedido();
const despues = pedidosGuardados().length;

ok("tres clics seguidos crean UN solo pedido", despues - antes === 1, "creados: " + (despues - antes));
ok("el carrito queda vacio tras finalizar", carroUnidades() === 0);

console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS CORRECTAS" : fallos + " PRUEBAS FALLIDAS"));
process.exit(fallos ? 1 : 0);
