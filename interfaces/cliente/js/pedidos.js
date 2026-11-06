/*
 * NOVA Sneakers - Mis pedidos · Omar
 *
 * Lista los pedidos de ejemplo y los que se hayan creado en esta
 * demostración. Cada pedido dice de dónde sale, para que no haya ninguna
 * duda de que nada de esto viene de una base de datos.
 */

function lineaPedidoHtml(linea) {
  const encontrado = buscarSku(linea.sku);
  const importe = linea.precio_unitario * linea.cantidad;

  const nombre = encontrado
    ? textoSeguro(encontrado.modelo.nombre)
    : "Referencia " + textoSeguro(linea.sku);

  const detalle = encontrado
    ? "Color " + textoSeguro(encontrado.variante.color) +
      " · Talla " + encontrado.talla.talla
    : "Ya no está en el catálogo";

  const foto = encontrado
    ? svgZapatilla(
        encontrado.variante.hex, encontrado.variante.hex2,
        encontrado.variante.suela, encontrado.modelo.nombre,
        "pedido-" + linea.sku, true
      )
    : "";

  return `
    <div class="cli-pedido-linea">
      <div class="cli-pedido-foto">${foto}</div>
      <div class="cli-pedido-nombre">
        <strong>${nombre}</strong>
        <span>${detalle}</span>
      </div>
      <div class="cli-pedido-cant">
        ${linea.cantidad} × ${formatearPrecio(linea.precio_unitario)}
      </div>
      <div class="cli-pedido-importe">${formatearPrecio(importe)}</div>
    </div>`;
}

function pedidoHtml(pedido, posicion, referenciaNueva) {
  const estado = estadoPedido(pedido.estado);
  const unidades = pedidoUnidades(pedido);

  // De dónde sale este pedido
  const procedencia = pedido.origen === "ejemplo"
    ? "Pedido de <strong>ejemplo</strong>, escrito a mano en el código de la " +
      "web para que esta pantalla no esté vacía. No existe en ninguna base de datos."
    : "Pedido creado por ti en <strong>esta demostración</strong>. Está " +
      "guardado solo en este navegador: no se ha enviado a ningún servidor " +
      "ni se ha cobrado nada.";

  // Si acabamos de crearlo, lo destacamos
  const recien = pedido.referencia === referenciaNueva
    ? '<span class="cli-etiqueta-demo">Nuevo</span>'
    : "";

  const retardo = (posicion * 0.08).toFixed(2);

  return `
    <article class="cli-fila-pedido" style="animation-delay: ${retardo}s">

      <header class="cli-pedido-cab">
        <span class="cli-pedido-ref">${textoSeguro(pedido.referencia)}</span>
        ${recien}
        <span class="cli-chip ${estado.clase}">${estado.texto}</span>
        <span class="cli-pedido-fecha">${formatearFecha(pedido.fecha)}</span>
        <span class="cli-pedido-total">${formatearPrecio(pedidoTotal(pedido))}</span>
      </header>

      <div class="cli-pedido-lineas">
        ${pedido.lineas.map(lineaPedidoHtml).join("")}
      </div>

      <footer class="cli-pedido-pie">
        ${unidades === 1 ? "1 par" : unidades + " pares"} · ${procedencia}
      </footer>

    </article>`;
}

function pintarPedidos() {
  const zona = document.getElementById("cli-zona-pedidos");
  const pedidos = pedidosTodos();

  // La referencia que acabamos de crear llega por la dirección
  const parametros = new URLSearchParams(window.location.search);
  const nueva = parametros.get("nuevo");

  // Aviso de pedido recién creado. Se oculta siempre primero para que
  // volver a dibujar deje la pantalla en el mismo estado que al cargarla.
  const aviso = document.getElementById("cli-aviso-nuevo");
  aviso.hidden = true;

  if (nueva && pedidos.some(function (p) { return p.referencia === nueva; })) {
    aviso.innerHTML =
      "<div>Pedido <strong>" + textoSeguro(nueva) + "</strong> creado " +
      "correctamente. Es un pedido de demostración: no se ha cobrado nada, " +
      "no se enviará nada y solo existe en este navegador.</div>";
    aviso.hidden = false;
  }

  if (pedidos.length === 0) {
    zona.innerHTML = `
      <div class="cli-vacio">
        <p>Todavía no tienes ningún pedido.</p>
        <a class="cli-boton" href="index.html">Ir al escaparate</a>
      </div>`;
    return;
  }

  zona.innerHTML = '<div class="cli-pedidos">' +
    pedidos.map(function (pedido, i) {
      return pedidoHtml(pedido, i, nueva);
    }).join("") +
    "</div>";

  // El botón de borrar solo tiene sentido si hay pedidos creados
  const creados = pedidosGuardados().length;
  const borrar = document.getElementById("cli-borrar-pedidos");

  if (creados > 0) {
    borrar.hidden = false;
    borrar.textContent = creados === 1
      ? "Borrar el pedido de la demostración"
      : "Borrar los " + creados + " pedidos de la demostración";
  } else {
    borrar.hidden = true;
  }
}

function activarEventos() {
  document.getElementById("cli-borrar-pedidos")
    .addEventListener("click", function () {
      if (!window.confirm("¿Borrar los pedidos creados en esta demostración? Los de ejemplo se quedan.")) {
        return;
      }

      pedidosBorrarCreados();

      // Quitamos el "nuevo" de la dirección para que no reaparezca el aviso
      window.history.replaceState({}, "", "pedidos.html");
      document.getElementById("cli-aviso-nuevo").hidden = true;

      pintarPedidos();
    });
}

pintarPedidos();
activarEventos();
