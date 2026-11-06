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

// Las cuentas salen de los datos, no escritas a mano
const EJEMPLOS = PEDIDOS_EJEMPLO.length;
const LINEAS_EJEMPLO = PEDIDOS_EJEMPLO.reduce(function (suma, p) { return suma + p.lineas.length; }, 0);

ok("dibuja los pedidos de ejemplo", (html.match(/class="cli-fila-pedido"/g) || []).length === EJEMPLOS, (html.match(/class="cli-fila-pedido"/g) || []).length + " de " + EJEMPLOS);
ok("referencias visibles", html.includes("WEB-DEMO-000001") && html.includes("WEB-DEMO-000002"));
ok("avisa de que son de ejemplo", html.includes("<strong>ejemplo</strong>"));
ok("avisa de que no estan en ninguna base de datos", html.includes("No existe en ninguna base de datos"));
ok("estados con nombre legible", html.includes("Entregado") && html.includes("En preparación"));
ok("fecha en espanol", html.includes("octubre") || html.includes("noviembre"), "se esperaba un mes en espanol");
ok("totales de los pedidos", html.includes("339,97"));
ok("una miniatura por linea", (html.match(/<svg/g) || []).length === LINEAS_EJEMPLO, (html.match(/<svg/g) || []).length + " de " + LINEAS_EJEMPLO);
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

ok("ahora hay uno mas", (html.match(/class="cli-fila-pedido"/g) || []).length === EJEMPLOS + 1);
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


console.log("\n=== LOS CINCO ESTADOS DEL ESQUEMA SQL ===");

// El CHECK de la tabla pedidos admite exactamente estos cinco
const ESTADOS_SQL = ["pendiente", "en_preparacion", "enviado", "entregado", "cancelado"];

ok("la web conoce los cinco estados del esquema",
  ESTADOS_SQL.every(function (estado) { return ESTADOS_PEDIDO[estado] !== undefined; }),
  Object.keys(ESTADOS_PEDIDO).join(", "));

ok("y ninguno de mas", Object.keys(ESTADOS_PEDIDO).length === 5, Object.keys(ESTADOS_PEDIDO).length);

ok("cada estado tiene su texto y su clase",
  ESTADOS_SQL.every(function (estado) {
    return estadoPedido(estado).texto !== "" && estadoPedido(estado).clase.startsWith("cli-chip-");
  }));

ok("las cinco clases son distintas",
  new Set(ESTADOS_SQL.map(function (estado) { return estadoPedido(estado).clase; })).size === 5);

ok("cancelado se llama Cancelado", estadoPedido("cancelado").texto === "Cancelado", estadoPedido("cancelado").texto);
ok("cancelado tiene su chip", estadoPedido("cancelado").clase === "cli-chip-cancelado", estadoPedido("cancelado").clase);

// Un estado que no exista sigue sin romper nada
ok("un estado desconocido no revienta",
  estadoPedido("inventado").texto === "inventado" && estadoPedido("inventado").clase === "");

console.log("\n=== UN PEDIDO CANCELADO SE DIBUJA BIEN ===");

// pedidosTodos() reconstruye la lista cada vez, asi que para probar un
// estado concreto se dibuja una copia del pedido con pedidoHtml.
const original = pedidosTodos()[0];
const cancelado = Object.assign({}, original, { estado: "cancelado" });
const htmlCancelado = pedidoHtml(cancelado, 0, null);

ok("sale la palabra Cancelado", htmlCancelado.includes(">Cancelado<"));
ok("lleva la clase del chip", htmlCancelado.includes("cli-chip cli-chip-cancelado"));
ok("el pedido se dibuja entero igual", htmlCancelado.includes(cancelado.referencia));
ok("sin undefined ni NaN", !/undefined|NaN/.test(htmlCancelado));

// Y el mismo pedido con su estado de verdad no lleva el chip de cancelado
ok("el original no se ha tocado", original.estado !== "cancelado", original.estado);
ok("y no sale como cancelado", !pedidoHtml(original, 0, null).includes("cli-chip-cancelado"));
ok("los otros cuatro estados no se han contagiado",
  ESTADOS_SQL.slice(0, 4).every(function (estado) {
    return estadoPedido(estado).clase !== "cli-chip-cancelado";
  }));


console.log("\n=== LOS CUATRO PEDIDOS DE EJEMPLO ===");

ok("hay cuatro", PEDIDOS_EJEMPLO.length === 4, PEDIDOS_EJEMPLO.length);

ok("todas las referencias son distintas",
  new Set(PEDIDOS_EJEMPLO.map(function (p) { return p.referencia; })).size === 4);

ok("todas llevan el prefijo WEB-DEMO-",
  PEDIDOS_EJEMPLO.every(function (p) { return p.referencia.startsWith(PEDIDOS_PREFIJO); }));

ok("los cuatro van marcados como ejemplo",
  PEDIDOS_EJEMPLO.every(function (p) { return p.origen === "ejemplo"; }));

ok("todos los SKU existen en el catalogo",
  PEDIDOS_EJEMPLO.every(function (p) {
    return p.lineas.every(function (l) { return buscarSku(l.sku) !== null; });
  }));

ok("los precios guardados son los del catalogo",
  PEDIDOS_EJEMPLO.every(function (p) {
    return p.lineas.every(function (l) {
      const encontrado = buscarSku(l.sku);
      return Math.abs(precioFinal(encontrado.modelo, encontrado.variante) - l.precio_unitario) < 0.001;
    });
  }));

ok("los ejemplos cubren cuatro de los cinco estados",
  new Set(PEDIDOS_EJEMPLO.map(function (p) { return p.estado; })).size === 4);

ok("el que falta es pendiente, que sale al crear un pedido",
  !PEDIDOS_EJEMPLO.some(function (p) { return p.estado === "pendiente"; }));

ok("todos sus estados son de los que admite el esquema",
  PEDIDOS_EJEMPLO.every(function (p) { return ESTADOS_SQL.includes(p.estado); }));

console.log("\n=== LOS CINCO CHIPS, DIBUJADOS DE VERDAD ===");

// Partimos de los ejemplos solos: esta prueba ya ha creado pedidos antes
pedidosBorrarCreados();

// Un pedido creado por el usuario da el quinto estado: pendiente
carroVaciar();
carroAnadir("NOVA-1-42", 1);
crearPedidoDemo(carroLeer());
window.location.search = "";
pintarPedidos();
const htmlCinco = __nodos["cli-zona-pedidos"].innerHTML;

ESTADOS_SQL.forEach(function (estado) {
  const clase = ESTADOS_PEDIDO[estado].clase;
  ok("se dibuja el chip de " + estado,
    htmlCinco.includes("cli-chip " + clase), clase);
});

ok("y su texto se lee",
  ESTADOS_SQL.every(function (estado) {
    return htmlCinco.includes(">" + ESTADOS_PEDIDO[estado].texto + "<");
  }));

ok("se dibujan los cinco pedidos",
  (htmlCinco.match(/class="cli-fila-pedido"/g) || []).length === 5,
  (htmlCinco.match(/class="cli-fila-pedido"/g) || []).length);

console.log("\n=== EL PEDIDO GUARDADO CONVIVE CON LOS EJEMPLOS ===");

ok("sigue habiendo un pedido guardado", pedidosGuardados().length === 1, pedidosGuardados().length);
ok("y cuatro de ejemplo", pedidosTodos().length - pedidosGuardados().length === 4);
ok("el guardado va el primero, por fecha", pedidosTodos()[0].origen === "demostracion");

pedidosBorrarCreados();
ok("al borrar quedan solo los cuatro ejemplos", pedidosTodos().length === 4, pedidosTodos().length);
ok("y los ejemplos no se han tocado",
  pedidosTodos().every(function (p) { return p.origen === "ejemplo"; }));

console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS CORRECTAS" : fallos + " PRUEBAS FALLIDAS"));
process.exit(fallos ? 1 : 0);
