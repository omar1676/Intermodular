/*
 * NOVA Sneakers - Vista de detalle · Omar
 *
 * Muestra la zapatilla elegida mucho más grande, con sus colores, sus
 * tallas y su descripción, y permite añadirla al carrito.
 *
 * Todo es ficticio: no hay servidor ni base de datos. El carrito se
 * guarda solo en este navegador.
 */

// Estado de la pantalla
let modeloActual = null;
let indiceVariante = 0;
let tallaElegida = null;
let cantidad = 1;

function varianteActual() {
  return modeloActual.variantes[indiceVariante];
}

// Datos de la talla seleccionada, o null si no hay ninguna
function tallaActual() {
  if (tallaElegida === null) {
    return null;
  }

  return varianteActual().tallas.find(function (t) {
    return t.talla === tallaElegida;
  }) || null;
}

// Este color se ha quedado sin ninguna talla disponible
function colorAgotado() {
  return varianteActual().tallas.every(function (t) {
    return t.stock <= 0 || !t.activo;
  });
}

/* ===== Dibujado ===== */

function pintarZapatilla() {
  const variante = varianteActual();

  // Aquí el SVG sí es la imagen principal, así que lleva su etiqueta
  document.getElementById("cli-escena").innerHTML = svgZapatilla(
    variante.hex, variante.hex2, variante.suela,
    modeloActual.nombre + " " + variante.color,
    "detalle-" + variante.id_variante,
    false
  );
}

function pintarPrecio() {
  const importe = precioFinal(modeloActual, varianteActual());
  document.getElementById("cli-precio").textContent = formatearPrecio(importe);
}

function pintarColores() {
  const html = modeloActual.variantes.map(function (variante, i) {
    const activo = i === indiceVariante ? " cli-activo" : "";

    return `
      <button class="cli-color${activo}" type="button" data-variante="${i}"
              aria-pressed="${i === indiceVariante}">
        <span class="cli-muestra" style="background: ${textoSeguro(variante.hex)}"></span>
        ${textoSeguro(variante.color)}
      </button>`;
  }).join("");

  document.getElementById("cli-colores").innerHTML = html;
}

function pintarTallas() {
  const html = varianteActual().tallas.map(function (t) {
    const agotada = t.stock <= 0 || !t.activo;
    const activa = t.talla === tallaElegida ? " cli-activo" : "";

    return `
      <button class="cli-talla${activa}" type="button"
              data-talla="${t.talla}"
              ${agotada ? "disabled" : ""}
              aria-pressed="${t.talla === tallaElegida}"
              title="${agotada ? "Sin existencias" : t.stock + " pares disponibles"}">
        ${t.talla}
      </button>`;
  }).join("");

  document.getElementById("cli-tallas").innerHTML = html;
}

function pintarNota() {
  const nota = document.getElementById("cli-nota");
  const talla = tallaActual();

  if (colorAgotado()) {
    nota.textContent = "Este color está agotado. Prueba con otro.";
    return;
  }

  if (!talla) {
    nota.textContent = "Elige tu talla para continuar.";
    return;
  }

  nota.textContent = "Talla " + talla.talla + " · " +
    talla.stock + " pares disponibles · referencia " + talla.sku;
}

function pintarCantidad() {
  const talla = tallaActual();
  const maximo = talla ? Math.min(talla.stock, CARRO_MAX_POR_LINEA) : 1;

  // Si cambiamos de talla y la cantidad ya no cabe, se ajusta
  if (cantidad > maximo) {
    cantidad = maximo;
  }

  document.getElementById("cli-valor-cantidad").textContent = cantidad;
  document.getElementById("cli-menos").disabled = !talla || cantidad <= 1;
  document.getElementById("cli-mas").disabled = !talla || cantidad >= maximo;
}

function pintarAcciones() {
  // Solo se puede añadir cuando hay una talla elegida con existencias
  document.getElementById("cli-anadir").disabled = tallaActual() === null;
}

// Vuelve a dibujar todo lo que depende de la talla o del color
function actualizar() {
  pintarPrecio();
  pintarColores();
  pintarTallas();
  pintarNota();
  pintarCantidad();
  pintarAcciones();
}

/* ===== Estructura de la página ===== */

function pintarEstructura() {
  const detalle = document.getElementById("cli-detalle");

  detalle.className = "cli-detalle";
  detalle.innerHTML = `
    <div class="cli-escena" id="cli-escena"></div>

    <div class="cli-ficha">
      <h1>${textoSeguro(modeloActual.nombre)}</h1>
      <p class="cli-ficha-precio" id="cli-precio"></p>
      <p class="cli-ficha-desc">${textoSeguro(modeloActual.descripcion)}</p>

      <div class="cli-bloque">
        <h2>Color</h2>
        <div class="cli-colores" id="cli-colores"></div>
      </div>

      <div class="cli-bloque">
        <h2>Talla</h2>
        <div class="cli-tallas" id="cli-tallas"></div>
        <p class="cli-nota-talla" id="cli-nota"></p>
      </div>

      <div class="cli-bloque">
        <h2>Cantidad</h2>
        <div class="cli-cantidad">
          <button type="button" id="cli-menos" aria-label="Quitar una unidad">-</button>
          <output id="cli-valor-cantidad">1</output>
          <button type="button" id="cli-mas" aria-label="Anadir una unidad">+</button>
        </div>
      </div>

      <div class="cli-acciones">
        <button class="cli-boton" type="button" id="cli-anadir" disabled>
          Añadir al carrito
        </button>
        <a class="cli-boton-sec" href="carrito.html">Ver carrito</a>
        <p class="cli-pendiente" id="cli-mensaje" role="status"></p>
      </div>
    </div>`;
}

/* ===== Interacción ===== */

function anadirAlCarrito() {
  const talla = tallaActual();

  if (!talla) {
    return;
  }

  carroAnadir(talla.sku, cantidad);

  const mensaje = document.getElementById("cli-mensaje");
  const unidades = cantidad === 1 ? "1 par" : cantidad + " pares";

  mensaje.innerHTML = "Añadido al carrito: " + unidades + " de " +
    textoSeguro(modeloActual.nombre) + " " + textoSeguro(varianteActual().color) +
    ", talla " + talla.talla + ". <strong>Carrito de demostración, " +
    "guardado solo en este navegador.</strong>";

  // Pequeño aviso visual de que algo ha pasado
  const boton = document.getElementById("cli-anadir");
  boton.classList.remove("cli-latido");
  // Forzamos el reinicio de la animación antes de volver a ponerla
  void boton.offsetWidth;
  boton.classList.add("cli-latido");
}

function activarEventos() {
  const detalle = document.getElementById("cli-detalle");

  detalle.addEventListener("click", function (evento) {
    const color = evento.target.closest(".cli-color");
    const talla = evento.target.closest(".cli-talla");

    // Cambio de color: se redibuja la zapatilla y se reinicia la talla,
    // porque el stock es distinto en cada variante
    if (color) {
      indiceVariante = Number(color.dataset.variante);
      tallaElegida = null;
      cantidad = 1;
      document.getElementById("cli-mensaje").textContent = "";
      pintarZapatilla();
      actualizar();
      return;
    }

    if (talla && !talla.disabled) {
      tallaElegida = Number(talla.dataset.talla);
      cantidad = 1;
      actualizar();
      return;
    }

    const boton = evento.target.closest("button");

    if (!boton) {
      return;
    }

    if (boton.id === "cli-menos") {
      cantidad--;
      pintarCantidad();
    } else if (boton.id === "cli-mas") {
      cantidad++;
      pintarCantidad();
    } else if (boton.id === "cli-anadir") {
      anadirAlCarrito();
    }
  });

  // Volver al escaparate con la misma transición suave
  document.getElementById("cli-volver").addEventListener("click", function (e) {
    e.preventDefault();
    navegarCon("index.html");
  });
}

/* ===== Arranque ===== */

async function iniciar() {
  const detalle = document.getElementById("cli-detalle");

  // Leemos el id de la dirección y comprobamos que sea un número
  const parametros = new URLSearchParams(window.location.search);
  const idModelo = Number(parametros.get("modelo"));

  if (!Number.isInteger(idModelo) || idModelo <= 0) {
    const sinParametro = parametros.get("modelo") === null;
    detalle.innerHTML = (sinParametro
      ? "No se ha indicado ninguna zapatilla. "
      : "La zapatilla indicada no es válida. ") +
      '<a href="index.html">Volver al escaparate</a>.';
    return;
  }

  try {
    modeloActual = await API.modelo(idModelo);

    // El escaparate enseña cada color por separado, así que puede pedir
    // que el detalle se abra ya con ese color elegido
    const color = Number(parametros.get("color"));

    if (Number.isInteger(color) && color >= 0 &&
        color < modeloActual.variantes.length) {
      indiceVariante = color;
    }

    pintarEstructura();
    pintarZapatilla();
    actualizar();
    activarEventos();

    document.title = "NOVA Sneakers · " + modeloActual.nombre;

  } catch (error) {
    detalle.innerHTML = "Esta zapatilla no existe. " +
      '<a href="index.html">Volver al escaparate</a>.';
  }
}

iniciar();
