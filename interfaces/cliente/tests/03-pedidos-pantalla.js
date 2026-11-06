/* Mis pedidos: lo que se dibuja en pantalla */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "pedidos-datos.js",
  "pedidos.js"
]);

let fallos = 0;
function ok(n, c, d) {
  console.log((c ? "  OK    " : "  FALLO ") + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}

console.log("\n=== DIBUJADO DE MIS PEDIDOS ===");

__almacen.clear();
pintarPedidos();
let html = __nodos["cli-zona-pedidos"].innerHTML;

ok("dibuja los 2 pedidos de ejemplo", (html.match(/class="cli-fila-pedido"/g) || []).length === 2, (html.match(/class="cli-fila-pedido"/g) || []).length);
ok("referencias visibles", html.includes("WEB-DEMO-000001") && html.includes("WEB-DEMO-000002"));
ok("avisa de que son de ejemplo", html.includes("<strong>ejemplo</strong>"));
ok("avisa de que no estan en ninguna base de datos", html.includes("No existe en ninguna base de datos"));
ok("estados con nombre legible", html.includes("Entregado") && html.includes("En preparación"));
ok("fecha en espanol", html.includes("octubre") || html.includes("noviembre"), "se esperaba un mes en espanol");
ok("totales de los pedidos", html.includes("339,97"));
ok("miniaturas de las zapatillas", (html.match(/<svg/g) || []).length === 3, (html.match(/<svg/g) || []).length);
ok("boton de borrar oculto sin pedidos creados", __nodos["cli-borrar-pedidos"].hidden === true);
ok("sin aviso de pedido nuevo", __nodos["cli-aviso-nuevo"].hidden === true);
ok("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n=== PEDIDO RECIEN CREADO ===");

carroVaciar();
carroAnadir("NOVA-2-41", 2);
const nuevo = crearPedidoDemo(carroLeer());
window.location.search = "?nuevo=" + nuevo.referencia;

pintarPedidos();
html = __nodos["cli-zona-pedidos"].innerHTML;

ok("ahora hay 3 pedidos", (html.match(/class="cli-fila-pedido"/g) || []).length === 3);
ok("el nuevo lleva la etiqueta Nuevo", html.includes("cli-etiqueta-demo"));
ok("marcado como creado en esta demostracion", html.includes("<strong>esta demostración</strong>"));
ok("avisa de que solo esta en este navegador", html.includes("guardado solo en este navegador"));
ok("se muestra el aviso de confirmacion", __nodos["cli-aviso-nuevo"].hidden === false);
ok("el aviso nombra la referencia", __nodos["cli-aviso-nuevo"].innerHTML.includes(nuevo.referencia));
ok("el aviso dice que no se ha cobrado", __nodos["cli-aviso-nuevo"].innerHTML.includes("no se ha cobrado nada"));
ok("boton de borrar visible", __nodos["cli-borrar-pedidos"].hidden === false);
ok("el boton dice cuantos borra", __nodos["cli-borrar-pedidos"].textContent.includes("Borrar el pedido"), __nodos["cli-borrar-pedidos"].textContent);

console.log("\n=== UNA REFERENCIA QUE NO EXISTE ===");

window.location.search = "?nuevo=INVENTADA-123";
__nodos["cli-aviso-nuevo"].hidden = true;
pintarPedidos();
ok("no muestra aviso por una referencia falsa", __nodos["cli-aviso-nuevo"].hidden === true);

console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS CORRECTAS" : fallos + " PRUEBAS FALLIDAS"));
process.exit(fallos ? 1 : 0);
