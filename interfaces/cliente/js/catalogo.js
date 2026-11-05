/*
 * NOVA Sneakers - Escaparate
 *
 * Pide el catálogo a la capa API y lo coloca en filas de tres, que es lo
 * que forma las dos repisas iluminadas del escritorio. En móvil el CSS se
 * encarga de pasar a una columna.
 */

const ZAPATILLAS_POR_FILA = 3;

// Precio más bajo del modelo, contando el suplemento de cada color
function precioDesde(modelo) {
  const precios = modelo.variantes.map(function (variante) {
    return precioFinal(modelo, variante);
  });

  return Math.min.apply(null, precios);
}

// Construye el botón de una zapatilla del escaparate
function piezaHtml(modelo, posicion) {
  // El primer color es el que se ve en el escaparate
  const variante = modelo.variantes[0];

  // Si algún día hay fotografías con licencia comprobada, se usan antes
  // que el dibujo SVG. Mientras no exista modelo.imagen, va el SVG.
  const imagen = modelo.imagen
    ? `<img class="zap" src="${textoSeguro(modelo.imagen)}"
            alt="Zapatilla ${textoSeguro(modelo.nombre)}" loading="lazy">`
    : svgZapatilla(variante.hex, variante.hex2, variante.suela,
                   modelo.nombre, "m" + modelo.id_modelo);

  const colores = modelo.variantes.length === 1
    ? "1 color"
    : modelo.variantes.length + " colores";

  // El retardo escalonado hace que las zapatillas aparezcan una tras otra
  const retardo = (posicion * 0.07).toFixed(2);

  return `
    <button class="cli-pieza" type="button"
            data-modelo="${modelo.id_modelo}"
            style="animation-delay: ${retardo}s">
      ${imagen}
      <span class="cli-pieza-nombre">${textoSeguro(modelo.nombre)}</span>
      <span class="cli-pieza-precio">Desde ${formatearPrecio(precioDesde(modelo))}</span>
      <span class="cli-pieza-colores">${colores}</span>
    </button>`;
}

// Reparte los modelos en filas de tres y las dibuja
function pintarEscaparate(modelos) {
  const contenedor = document.getElementById("cli-filas");
  let html = "";
  let posicion = 0;

  for (let i = 0; i < modelos.length; i += ZAPATILLAS_POR_FILA) {
    const fila = modelos.slice(i, i + ZAPATILLAS_POR_FILA);

    html += '<div class="cli-fila">';

    fila.forEach(function (modelo) {
      html += piezaHtml(modelo, posicion);
      posicion++;
    });

    html += "</div>";
  }

  contenedor.className = "";
  contenedor.innerHTML = html;
}

// Un solo escuchador para todo el escaparate
function activarClics() {
  const contenedor = document.getElementById("cli-filas");

  contenedor.addEventListener("click", function (evento) {
    const pieza = evento.target.closest(".cli-pieza");

    if (!pieza) {
      return;
    }

    navegarCon("producto.html?modelo=" + pieza.dataset.modelo);
  });
}

// Arranque
async function iniciar() {
  const contenedor = document.getElementById("cli-filas");

  try {
    const modelos = await API.catalogo();

    if (!modelos || modelos.length === 0) {
      contenedor.textContent = "Todavía no hay zapatillas en el catálogo.";
      return;
    }

    pintarEscaparate(modelos);
    activarClics();

  } catch (error) {
    contenedor.textContent =
      "No se ha podido cargar el catálogo. Vuelve a intentarlo más tarde.";
    console.error(error);
  }
}

iniciar();
