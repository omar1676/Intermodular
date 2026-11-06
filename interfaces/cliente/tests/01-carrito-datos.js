/* Carrito y pedidos: los datos */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "pedidos-datos.js"
]);

let fallos = 0;
function ok(n, c, d) {
  console.log((c ? "  OK    " : "  FALLO ") + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}

console.log("\n=== CARRITO ===");

carroVaciar();
ok("empieza vacio", carroUnidades() === 0 && carroTotal() === 0);

ok("anade 2 pares", carroAnadir("NOVA-1-42", 2) === true && carroUnidades() === 2, carroUnidades());

carroAnadir("NOVA-1-42", 2);
ok("suma sobre la linea existente (no duplica)", carroLeer().length === 1 && carroUnidades() === 4, carroUnidades());

carroAnadir("NOVA-1-42", 10);
ok("respeta el tope de 5 por linea", carroUnidades() === 5, carroUnidades());

ok("NO anade una talla agotada", carroAnadir("NOVA-1-44", 1) === false, "stock de NOVA-1-44 = " + buscarSku("NOVA-1-44").talla.stock);
ok("el carrito sigue con una sola linea", carroLeer().length === 1);

ok("NO anade un SKU inventado", carroAnadir("NOVA-999-99", 1) === false);

carroAnadir("NOVA-4-41", 1);
ok("dos lineas distintas", carroLeer().length === 2 && carroUnidades() === 6, carroUnidades());

// 5 x 79.99 (Origin) + 1 x 119.90 (Velocity) = 399.95 + 119.90
const esperado = 5 * 79.99 + 1 * 119.90;
ok("total correcto", Math.abs(carroTotal() - esperado) < 0.001, carroTotal().toFixed(2) + " vs " + esperado.toFixed(2));

carroCambiarCantidad("NOVA-4-41", 3);
ok("cambia la cantidad", carroUnidades() === 8, carroUnidades());

carroCambiarCantidad("NOVA-4-41", 99);
ok("al cambiar tambien respeta el tope", carroUnidades() === 10, carroUnidades());

carroCambiarCantidad("NOVA-4-41", 0);
ok("cantidad 0 quita la linea", carroLeer().length === 1, carroLeer().length);

carroQuitar("NOVA-1-42");
ok("quitar deja el carrito vacio", carroUnidades() === 0);

// Precios: el carrito no guarda importes
carroAnadir("NOVA-2-40", 1);
const guardado = JSON.parse(__almacen.get("nova_carrito_demo"));
ok("solo guarda sku y cantidad", Object.keys(guardado[0]).sort().join(",") === "cantidad,sku", Object.keys(guardado[0]).join(","));
ok("no guarda ningun precio", !JSON.stringify(guardado).includes("precio"));

// Resistencia a datos corruptos
__almacen.set("nova_carrito_demo", "{esto no es json");
ok("aguanta un localStorage corrupto", Array.isArray(carroLeer()) && carroLeer().length === 0);

__almacen.set("nova_carrito_demo", JSON.stringify([{ sku: "NOVA-1-42", cantidad: -5 }, { sku: 123 }, null]));
ok("descarta lineas con forma invalida", carroLeer().length === 0);

console.log("\n=== PEDIDOS ===");

__almacen.clear();

// Las cuentas salen de PEDIDOS_EJEMPLO, para que no haya que tocarlas al anadir uno
const EJEMPLOS = PEDIDOS_EJEMPLO.length;
function refNumero(i) { return "WEB-DEMO-" + String(i).padStart(6, "0"); }

ok("los pedidos de ejemplo se cargan", pedidosTodos().length === EJEMPLOS, pedidosTodos().length + " de " + EJEMPLOS);
ok("los ejemplos van marcados como ejemplo", pedidosTodos().every(p => p.origen === "ejemplo"));
ok("todas las referencias llevan WEB-DEMO-", pedidosTodos().every(p => p.referencia.startsWith("WEB-DEMO-")));
ok("ordenados del mas nuevo al mas viejo", new Date(pedidosTodos()[0].fecha) > new Date(pedidosTodos()[1].fecha));

// Total del ejemplo 1: 1 x 79.99 + 2 x 129.99 = 339.97
const ej = pedidosTodos().find(p => p.referencia === "WEB-DEMO-000001");
ok("total del pedido de ejemplo", Math.abs(pedidoTotal(ej) - 339.97) < 0.001, pedidoTotal(ej).toFixed(2));
ok("unidades del pedido de ejemplo", pedidoUnidades(ej) === 3, pedidoUnidades(ej));
ok("todos los SKU de los ejemplos existen", pedidosTodos().every(p => p.lineas.every(l => buscarSku(l.sku) !== null)));

ok("siguiente referencia libre", referenciaNueva() === refNumero(EJEMPLOS + 1), referenciaNueva());

// Crear un pedido desde el carrito
carroVaciar();
carroAnadir("NOVA-1-42", 2);
carroAnadir("NOVA-6-40", 1);
const nuevo = crearPedidoDemo(carroLeer());

ok("crea el pedido", nuevo !== null && nuevo.referencia === refNumero(EJEMPLOS + 1), nuevo && nuevo.referencia);
ok("un carrito de 2 lineas da UN solo pedido", nuevo.lineas.length === 2, nuevo.lineas.length);
ok("el pedido nace pendiente", nuevo.estado === "pendiente");
ok("marcado como creado en la demostracion", nuevo.origen === "demostracion");
ok("el pedido SI guarda el precio unitario", nuevo.lineas.every(l => typeof l.precio_unitario === "number"));
ok("total del pedido nuevo", Math.abs(pedidoTotal(nuevo) - (2 * 79.99 + 129.99)) < 0.001, pedidoTotal(nuevo).toFixed(2));
ok("ahora hay uno mas", pedidosTodos().length === EJEMPLOS + 1, pedidosTodos().length);
ok("la siguiente referencia avanza", referenciaNueva() === refNumero(EJEMPLOS + 2), referenciaNueva());

ok("un carrito vacio no crea pedido", crearPedidoDemo([]) === null);
ok("un carrito con SKU inexistente no crea pedido", crearPedidoDemo([{ sku: "NOVA-999-99", cantidad: 1 }]) === null);

pedidosBorrarCreados();
ok("borrar deja solo los ejemplos", pedidosTodos().length === EJEMPLOS, pedidosTodos().length);

console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS CORRECTAS" : fallos + " PRUEBAS FALLIDAS"));
process.exit(fallos ? 1 : 0);
