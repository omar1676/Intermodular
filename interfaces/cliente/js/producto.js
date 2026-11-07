/* NOVA Sneakers · Detalle (pantalla) · Omar */

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

  return varianteActual().tallas.find(function (talla) {
    return talla.talla === tallaElegida;
  }) || null;
}

// Este color se ha quedado sin ninguna talla disponible
function colorAgotado() {
  return varianteActual().tallas.every(function (talla) {
    return talla.stock <= 0 || !talla.activo;
  });
}

/* Dibujado */

function pintarZapatilla() {
  const variante = varianteActual();
  const escena = document.getElementById("cli-escena");
  const nombre = modeloActual.nombre + " " + variante.color;
  const foto = fotoVariante(variante);

  // Aqui la zapatilla es la imagen principal: lleva texto alternativo.
  // Va dentro de una caja propia porque el visor mueve la caja y no la
  // imagen: la imagen ya tiene su animacion de entrada, que tambien usa
  // transform, y las dos se pisarian.
  const dentro = foto
    ? '<img class="zap" src="' + textoSeguro(foto) + '"' +
      ' alt="Zapatilla ' + textoSeguro(nombre) + '"' +
      ' data-respaldo="' + variante.id_variante + '">'
    : dibujoDetalle(variante.id_variante);

  escena.innerHTML = '<div class="cli-visor-caja" id="cli-visor-caja">' + dentro + "</div>";

  // Cada vez que cambia el color se vuelve a empezar: zoom a 1 y recta
  reiniciarVisor();

  // El nombre del color, debajo del nombre del modelo
  const rotulo = document.getElementById("cli-rotulo-color");

  if (rotulo) {
    rotulo.textContent = variante.color;
  }

  // Reinicia la animación de acercamiento para que al cambiar de color
  // la zapatilla vuelva a entrar en vez de aparecer de golpe. Leer
  // offsetWidth fuerza al navegador a recalcular y reiniciarla.
  const dibujo = escena.querySelector(".zap");

  if (dibujo) {
    dibujo.classList.remove("cli-acercando");
    void dibujo.offsetWidth;
    dibujo.classList.add("cli-acercando");
  }
}

/* El visor

   Lo que hace: acercar la fotografía y moverla un poco con perspectiva,
   para poder mirarla de cerca y desde un lado.

   Lo que NO hace, y conviene decirlo: no es un giro de 360 grados. De
   cada zapatilla tenemos una sola fotografía, de perfil, así que lo que
   se inclina es esa foto. Sirve para verla mejor, no para ver el otro
   lado de la zapatilla, porque el otro lado no existe en el proyecto. */

const VISOR_ZOOM_MIN = 1;
const VISOR_ZOOM_MAX = 2.5;
const VISOR_PASO = 0.5;

// Cuánto se inclina como mucho, en grados
const VISOR_GIRO_LADO = 14;
const VISOR_GIRO_ALTO = 8;

let visorZoom = 1;
let visorX = 0;   // posición del puntero, de -0.5 a 0.5
let visorY = 0;

/* El cálculo, separado del navegador para poder comprobarlo.

   Una sola posición de puntero mueve dos cosas a la vez: la inclinación
   y, si está acercada, el desplazamiento. El desplazamiento se multiplica
   por (zoom - 1), así que a tamaño normal vale cero y la imagen no se
   mueve de su sitio. */
function transformacionVisor(zoom, x, y) {
  const giroY = (x * 2 * VISOR_GIRO_LADO).toFixed(2);
  const giroX = (-y * 2 * VISOR_GIRO_ALTO).toFixed(2);
  const moverX = (-x * (zoom - 1) * 170).toFixed(1);
  const moverY = (-y * (zoom - 1) * 110).toFixed(1);

  return "perspective(1100px)" +
    " rotateX(" + giroX + "deg) rotateY(" + giroY + "deg)" +
    " translate(" + moverX + "px, " + moverY + "px)" +
    " scale(" + zoom + ")";
}

// El zoom no se sale de su rango por mucho que se pulse
function zoomAjustado(valor) {
  return Math.min(VISOR_ZOOM_MAX, Math.max(VISOR_ZOOM_MIN, Number(valor.toFixed(2))));
}

function pintarVisor() {
  const caja = document.getElementById("cli-visor-caja");

  if (caja) {
    caja.style.transform = transformacionVisor(visorZoom, visorX, visorY);
  }

  const nivel = document.getElementById("cli-visor-nivel");

  if (nivel) {
    nivel.textContent = visorZoom.toFixed(1).replace(".", ",") + "×";
  }

  const menos = document.getElementById("cli-visor-menos");
  const mas = document.getElementById("cli-visor-mas");

  if (menos) {
    menos.disabled = visorZoom <= VISOR_ZOOM_MIN;
  }

  if (mas) {
    mas.disabled = visorZoom >= VISOR_ZOOM_MAX;
  }

  // El cursor avisa de que se puede arrastrar solo cuando sirve de algo
  const escena = document.getElementById("cli-escena");

  if (escena) {
    escena.classList.toggle("cli-visor-acercado", visorZoom > VISOR_ZOOM_MIN);
  }
}

function reiniciarVisor() {
  visorZoom = 1;
  visorX = 0;
  visorY = 0;
  pintarVisor();
}

function cambiarZoom(paso) {
  visorZoom = zoomAjustado(visorZoom + paso);
  pintarVisor();
}

// Quien ha pedido menos movimiento no quiere que la foto se tuerza sola
function sinMovimiento() {
  return !!(window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/* Dónde está el puntero dentro de la escena, de -0.5 a 0.5 en cada eje */
function posicionEnEscena(escena, evento) {
  const caja = escena.getBoundingClientRect();

  if (!caja.width || !caja.height) {
    return null;
  }

  return {
    x: Math.min(0.5, Math.max(-0.5, (evento.clientX - caja.left) / caja.width - 0.5)),
    y: Math.min(0.5, Math.max(-0.5, (evento.clientY - caja.top) / caja.height - 0.5))
  };
}

function activarVisor() {
  const escena = document.getElementById("cli-escena");

  if (!escena) {
    return;
  }

  let arrastrando = false;

  escena.addEventListener("pointerdown", function (evento) {
    arrastrando = true;
    escena.setPointerCapture(evento.pointerId);
  });

  escena.addEventListener("pointerup", function () {
    arrastrando = false;
  });

  escena.addEventListener("pointercancel", function () {
    arrastrando = false;
  });

  /* Con ratón basta con pasar por encima; con el dedo hay que arrastrar,
     porque en una pantalla táctil no existe el "pasar por encima". */
  escena.addEventListener("pointermove", function (evento) {
    if (sinMovimiento()) {
      return;
    }

    if (evento.pointerType !== "mouse" && !arrastrando) {
      return;
    }

    const sitio = posicionEnEscena(escena, evento);

    if (!sitio) {
      return;
    }

    // Arrastrando con el dedo no queremos que la página se mueva detrás
    if (arrastrando && evento.cancelable) {
      evento.preventDefault();
    }

    visorX = sitio.x;
    visorY = sitio.y;
    pintarVisor();
  });

  // Al sacar el ratón, la zapatilla se endereza pero sigue acercada
  escena.addEventListener("pointerleave", function () {
    arrastrando = false;
    visorX = 0;
    visorY = 0;
    pintarVisor();
  });

  document.getElementById("cli-visor-mas")
    .addEventListener("click", function () { cambiarZoom(VISOR_PASO); });

  document.getElementById("cli-visor-menos")
    .addEventListener("click", function () { cambiarZoom(-VISOR_PASO); });

  document.getElementById("cli-visor-reiniciar")
    .addEventListener("click", reiniciarVisor);
}

// Dibujo de respaldo del detalle, con su etiqueta accesible
function dibujoDetalle(idVariante) {
  for (const variante of modeloActual.variantes) {
    if (String(variante.id_variante) === String(idVariante)) {
      return svgZapatilla(
        variante.hex, variante.hex2, variante.suela,
        modeloActual.nombre + " " + variante.color,
        "detalle-" + variante.id_variante,
        false
      );
    }
  }

  return "";
}

function pintarPrecio() {
  const importe = precioFinal(modeloActual, varianteActual());
  document.getElementById("cli-precio").textContent = formatearPrecio(importe);
}

function pintarColores() {
  const html = modeloActual.variantes.map(function (variante, indice) {
    const activo = indice === indiceVariante ? " cli-activo" : "";

    return `
      <button class="cli-color${activo}" type="button" data-variante="${indice}"
              aria-pressed="${indice === indiceVariante}">
        <span class="cli-muestra" style="background: ${textoSeguro(variante.hex)}"></span>
        ${textoSeguro(variante.color)}
      </button>`;
  }).join("");

  document.getElementById("cli-colores").innerHTML = html;
}

function pintarTallas() {
  const html = varianteActual().tallas.map(function (talla) {
    const agotada = talla.stock <= 0 || !talla.activo;
    const activa = talla.talla === tallaElegida ? " cli-activo" : "";

    return `
      <button class="cli-talla${activa}" type="button"
              data-talla="${talla.talla}"
              ${agotada ? "disabled" : ""}
              aria-pressed="${talla.talla === tallaElegida}"
              title="${agotada ? "Sin existencias" : talla.stock + " pares disponibles"}">
        ${talla.talla}
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

/* Estructura de la página */

function pintarEstructura() {
  const detalle = document.getElementById("cli-detalle");

  // La zapatilla va arriba del todo, pegada a la cabecera, y todo lo que
  // hay que elegir (color, talla, cantidad y el boton) va debajo.
  detalle.className = "cli-detalle";
  detalle.innerHTML = `
    <div class="cli-escena" id="cli-escena"></div>

    <div class="cli-visor-mandos">
      <div class="cli-visor-zoom" role="group" aria-label="Acercar la fotografía">
        <button type="button" id="cli-visor-menos" aria-label="Alejar">&minus;</button>
        <span class="cli-visor-nivel" id="cli-visor-nivel" aria-live="polite">1,0&times;</span>
        <button type="button" id="cli-visor-mas" aria-label="Acercar">+</button>
      </div>
      <button class="cli-boton-sec cli-visor-reiniciar" type="button" id="cli-visor-reiniciar">
        Restablecer
      </button>
      <p class="cli-visor-nota">
        Arrastra sobre la zapatilla para moverla.
        <strong>No es un giro completo:</strong> de cada modelo tenemos una
        sola fotografía, de perfil.
      </p>
    </div>

    <div class="cli-ficha">
      <div class="cli-rotulo-modelo">
        <h1>${textoSeguro(modeloActual.nombre)}</h1>
        <p id="cli-rotulo-color"></p>
      </div>

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
          <button type="button" id="cli-mas" aria-label="Añadir una unidad">+</button>
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

/* Interacción */

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

    // Al cambiar de color se reinicia la talla: el stock es distinto
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

  // Volver al inicio con la misma transición suave
  document.getElementById("cli-volver").addEventListener("click", function (evento) {
    evento.preventDefault();
    navegarCon("index.html");
  });
}

/* Arranque */

function iniciar() {
  const detalle = document.getElementById("cli-detalle");

  // Leemos el id de la dirección y comprobamos que sea un número
  const parametros = new URLSearchParams(window.location.search);
  const idModelo = Number(parametros.get("modelo"));

  if (!Number.isInteger(idModelo) || idModelo <= 0) {
    const sinParametro = parametros.get("modelo") === null;
    detalle.innerHTML = (sinParametro
      ? "No se ha indicado ninguna zapatilla. "
      : "La zapatilla indicada no es válida. ") +
      '<a href="index.html">Volver al inicio</a>.';
    return;
  }

  try {
    modeloActual = API.modelo(idModelo);

    // El escaparate puede pedir que se abra ya con un color elegido
    const color = Number(parametros.get("color"));

    if (Number.isInteger(color) && color >= 0 &&
        color < modeloActual.variantes.length) {
      indiceVariante = color;
    }

    pintarEstructura();

    // Si la foto no carga, se dibuja la zapatilla en su lugar
    respaldoDeFotos(document.getElementById("cli-escena"), dibujoDetalle);

    pintarZapatilla();
    actualizar();
    activarEventos();
    activarVisor();

    document.title = "NOVA Sneakers · " + modeloActual.nombre;

  } catch (error) {
    detalle.innerHTML = "Esta zapatilla no existe. " +
      '<a href="index.html">Volver al inicio</a>.';
  }
}

iniciar();
