/*
 * NOVA Sneakers - Carrito
 *
 * Permite cambiar cantidades, quitar líneas, vaciar el carrito y crear un
 * pedido de demostración.
 *
 * El carrito guarda solo el SKU y la cantidad. El nombre, el color, la
 * talla y el precio se vuelven a leer del catálogo cada vez que se dibuja,
 * así que no puede haber precios desfasados ni manipulados.
 */

// Evita que un doble clic en "Finalizar pedido" cree dos pedidos
let creandoPedido = false;

// Miniatura de la zapatilla para una línea del carrito
function miniatura(modelo, variante, clave) {
  return svgZapatilla(
    variante.hex, variante.hex2, variante.suela,
    modelo.nombre, clave, true
  );
}

function lineaHtml(linea) {
  const encontrado = buscarSku(linea.sku);

  // El SKU ya no está en el catálogo: lo avisamos en vez de fallar
  if (!encontrado) {
    return `
      <div class="cli-carro-linea">
        <div class="cli-carro-foto"></div>
        <div class="cli-carro-info">
          <h3>Referencia no disponible</h3>
          <p>La referencia ${textoSeguro(linea.sku)} ya no está en el catálogo.</p>
        </div>
        <div></div>
        <div></div>
        <button class="cli-quitar" type="button" data-quitar="${textoSeguro(linea.sku)}"
                aria-label="Quitar esta línea">×</button>
      </div>`;
  }

  const modelo = encontrado.modelo;
  const variante = encontrado.variante;
  const talla = encontrado.talla;

  const precio = precioFinal(modelo, variante);
  const importe = precio * linea.cantidad;
  const tope = carroTope(linea.sku);

  // Puede pasar si la zapatilla se agota con el carrito ya montado
  const agotado = tope <= 0;

  const aviso = agotado
    ? '<p class="cli-carro-ref">Esta talla se ha agotado: quítala para seguir.</p>'
    : '<p class="cli-carro-ref">Referencia ' + textoSeguro(talla.sku) + "</p>";

  return `
    <div class="cli-carro-linea" data-linea="${textoSeguro(linea.sku)}">

      <div class="cli-carro-foto">
        ${miniatura(modelo, variante, "carro-" + variante.id_variante)}
      </div>

      <div class="cli-carro-info">
        <h3>${textoSeguro(modelo.nombre)}</h3>
        <p>Color ${textoSeguro(variante.color)} · Talla ${talla.talla}</p>
        ${aviso}
      </div>

      <div class="cli-cantidad cli-carro-cant">
        <button type="button" data-menos="${textoSeguro(linea.sku)}"
                aria-label="Quitar una unidad"
                ${linea.cantidad <= 1 || agotado ? "disabled" : ""}>-</button>
        <output>${linea.cantidad}</output>
        <button type="button" data-mas="${textoSeguro(linea.sku)}"
                aria-label="Añadir una unidad"
                ${linea.cantidad >= tope || agotado ? "disabled" : ""}>+</button>
      </div>

      <div class="cli-carro-importe">
        ${formatearPrecio(importe)}
        <span class="cli-carro-unidad">${formatearPrecio(precio)} la unidad</span>
      </div>

      <button class="cli-quitar" type="button" data-quitar="${textoSeguro(linea.sku)}"
              aria-label="Quitar ${textoSeguro(modelo.nombre)} talla ${talla.talla}">×</button>

    </div>`;
}

function pintarCarrito() {
  const zona = document.getElementById("cli-zona-carrito");
  const lineas = carroLeer();

  if (lineas.length === 0) {
    zona.innerHTML = `
      <div class="cli-vacio">
        <p>Tu carrito está vacío.</p>
        <a class="cli-boton" href="index.html">Ir al escaparate</a>
      </div>`;
    return;
  }

  const unidades = carroUnidades();
  const total = carroTotal();

  zona.innerHTML = `
    <div class="cli-carro">

      <div>
        <div class="cli-carro-lista">
          ${lineas.map(lineaHtml).join("")}
        </div>

        <div class="cli-acciones-carro">
          <button class="cli-boton-sec cli-boton-peligro" type="button" id="cli-vaciar">
            Vaciar el carrito
          </button>
        </div>
      </div>

      <aside class="cli-resumen">
        <h2>Resumen</h2>

        <div class="cli-resumen-fila">
          <span>Artículos distintos</span>
          <span>${lineas.length}</span>
        </div>
        <div class="cli-resumen-fila">
          <span>Pares en total</span>
          <span>${unidades}</span>
        </div>
        <div class="cli-resumen-fila">
          <span>Envío</span>
          <span>Gratis (demostración)</span>
        </div>

        <div class="cli-resumen-total">
          <span>Total</span>
          <strong>${formatearPrecio(total)}</strong>
        </div>

        <button class="cli-boton" type="button" id="cli-finalizar">
          Finalizar pedido de demostración
        </button>

        <p class="cli-resumen-nota">
          No se cobra nada, no se envía nada y no se pide ningún dato de
          pago. El pedido se guarda solo en este navegador.
        </p>
      </aside>

    </div>`;
}

/* ===== Acciones ===== */

// Quita una línea con una pequeña animación de salida
function quitarLinea(sku) {
  const fila = document.querySelector('[data-linea="' + sku + '"]');

  if (!fila) {
    carroQuitar(sku);
    pintarCarrito();
    return;
  }

  fila.classList.add("cli-quitando");

  setTimeout(function () {
    carroQuitar(sku);
    pintarCarrito();
  }, 250);
}

function vaciarCarrito() {
  // Preguntamos antes, porque se pierde todo
  if (!window.confirm("¿Vaciar el carrito entero?")) {
    return;
  }

  carroVaciar();
  pintarCarrito();
}

function finalizarPedido() {
  // Protección contra el doble clic: si ya estamos creando uno, no se
  // crea otro. El botón además se desactiva en el acto.
  if (creandoPedido) {
    return;
  }

  creandoPedido = true;

  const boton = document.getElementById("cli-finalizar");

  if (boton) {
    boton.disabled = true;
    boton.textContent = "Creando el pedido…";
  }

  const pedido = crearPedidoDemo(carroLeer());

  if (!pedido) {
    creandoPedido = false;

    if (boton) {
      boton.disabled = false;
      boton.textContent = "Finalizar pedido de demostración";
    }

    return;
  }

  // El carrito se vacía porque sus líneas ya han pasado al pedido
  carroVaciar();

  navegarCon("pedidos.html?nuevo=" + encodeURIComponent(pedido.referencia));
}

function activarEventos() {
  const zona = document.getElementById("cli-zona-carrito");

  zona.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button");

    if (!boton) {
      return;
    }

    if (boton.dataset.mas) {
      const linea = carroLeer().find(function (l) { return l.sku === boton.dataset.mas; });
      if (linea) {
        carroCambiarCantidad(boton.dataset.mas, linea.cantidad + 1);
        pintarCarrito();
      }

    } else if (boton.dataset.menos) {
      const linea = carroLeer().find(function (l) { return l.sku === boton.dataset.menos; });
      if (linea) {
        carroCambiarCantidad(boton.dataset.menos, linea.cantidad - 1);
        pintarCarrito();
      }

    } else if (boton.dataset.quitar) {
      quitarLinea(boton.dataset.quitar);

    } else if (boton.id === "cli-vaciar") {
      vaciarCarrito();

    } else if (boton.id === "cli-finalizar") {
      finalizarPedido();
    }
  });
}

pintarCarrito();
activarEventos();
