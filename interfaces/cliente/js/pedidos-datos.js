/* NOVA Sneakers · Pedidos (datos) · Omar */

const PEDIDOS_CLAVE = "nova_pedidos_demo";
const PEDIDOS_PREFIJO = "WEB-DEMO-";

// Pedidos de ejemplo, fijos y escritos a mano
const PEDIDOS_EJEMPLO = [
  {
    referencia: "WEB-DEMO-000001",
    fecha: "2026-10-18T17:24:00",
    estado: "entregado",
    origen: "ejemplo",
    lineas: [
      { sku: "NOVA-1-42", cantidad: 1, precio_unitario: 79.99 },
      { sku: "NOVA-6-43", cantidad: 2, precio_unitario: 129.99 }
    ]
  },
  {
    referencia: "WEB-DEMO-000002",
    fecha: "2026-11-02T11:05:00",
    estado: "en_preparacion",
    origen: "ejemplo",
    lineas: [
      { sku: "NOVA-4-41", cantidad: 1, precio_unitario: 119.90 }
    ]
  }
];

// Lee los pedidos creados en esta demostración
function pedidosGuardados() {
  try {
    const bruto = localStorage.getItem(PEDIDOS_CLAVE);
    const datos = bruto ? JSON.parse(bruto) : [];

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.filter(function (p) {
      return p && typeof p.referencia === "string" && Array.isArray(p.lineas);
    });

  } catch (error) {
    return [];
  }
}

function pedidosEscribir(pedidos) {
  try {
    localStorage.setItem(PEDIDOS_CLAVE, JSON.stringify(pedidos));
  } catch (error) {
    console.warn("No se han podido guardar los pedidos en este navegador.");
  }
}

// Ejemplos y pedidos creados, los más nuevos primero
function pedidosTodos() {
  const todos = PEDIDOS_EJEMPLO.concat(pedidosGuardados());

  return todos.sort(function (a, b) {
    return new Date(b.fecha) - new Date(a.fecha);
  });
}

// Siguiente referencia libre: WEB-DEMO-000003, 000004...
function referenciaNueva() {
  const numero = PEDIDOS_EJEMPLO.length + pedidosGuardados().length + 1;
  return PEDIDOS_PREFIJO + String(numero).padStart(6, "0");
}

// Crea un pedido de demostración a partir de las líneas del carrito.
function crearPedidoDemo(lineasCarro) {
  if (!lineasCarro || lineasCarro.length === 0) {
    return null;
  }

  const lineas = [];

  lineasCarro.forEach(function (linea) {
    const encontrado = buscarSku(linea.sku);

    // Si el SKU ya no existe en el catálogo, se ignora esa línea
    if (!encontrado) {
      return;
    }

    lineas.push({
      sku: linea.sku,
      cantidad: linea.cantidad,
      precio_unitario: precioFinal(encontrado.modelo, encontrado.variante)
    });
  });

  if (lineas.length === 0) {
    return null;
  }

  const pedido = {
    referencia: referenciaNueva(),
    fecha: new Date().toISOString(),
    estado: "pendiente",
    origen: "demostracion",
    lineas: lineas
  };

  const guardados = pedidosGuardados();
  guardados.push(pedido);
  pedidosEscribir(guardados);

  return pedido;
}

// Borra solo los pedidos creados en la demostración; los ejemplos se quedan
function pedidosBorrarCreados() {
  pedidosEscribir([]);
}

// Importe total de un pedido
function pedidoTotal(pedido) {
  return pedido.lineas.reduce(function (suma, linea) {
    return suma + linea.precio_unitario * linea.cantidad;
  }, 0);
}

// Unidades totales de un pedido
function pedidoUnidades(pedido) {
  return pedido.lineas.reduce(function (suma, linea) {
    return suma + linea.cantidad;
  }, 0);
}

// Nombre bonito y color del estado
const ESTADOS_PEDIDO = {
  pendiente: { texto: "Pendiente", clase: "cli-chip-pendiente" },
  en_preparacion: { texto: "En preparación", clase: "cli-chip-preparacion" },
  enviado: { texto: "Enviado", clase: "cli-chip-enviado" },
  entregado: { texto: "Entregado", clase: "cli-chip-entregado" }
};

function estadoPedido(estado) {
  return ESTADOS_PEDIDO[estado] || { texto: estado, clase: "" };
}

// 18 de octubre de 2026, 17:24
function formatearFecha(iso) {
  const fecha = new Date(iso);

  if (isNaN(fecha)) {
    return "Fecha desconocida";
  }

  return fecha.toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric"
  }) + ", " + fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit", minute: "2-digit"
  });
}
