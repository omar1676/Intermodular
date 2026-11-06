/*
 * NOVA Sneakers - Escaparate · Omar
 *
 * Pide el catálogo a la capa API y llena el muro.
 *
 * El escaparate enseña COLORES, no modelos: cada variante ocupa su propia
 * repisa, igual que en una pared de tienda, donde el mismo modelo aparece
 * varias veces en acabados distintos. Seis modelos con dos colores cada
 * uno dan doce piezas, que es lo que llena el muro.
 *
 * Al pulsar una pieza se abre el detalle con ese color ya elegido.
 */

// Devuelve una lista plana de { modelo, variante, indice } a partir de la
// jerarquía modelos -> variantes
function piezasDelCatalogo(modelos) {
  const piezas = [];

  modelos.forEach(function (modelo) {
    modelo.variantes.forEach(function (variante, indice) {
      piezas.push({ modelo: modelo, variante: variante, indice: indice });
    });
  });

  return piezas;
}

// Un color está agotado cuando ninguna de sus tallas tiene existencias
function colorSinExistencias(variante) {
  return variante.tallas.every(function (talla) {
    return talla.stock <= 0;
  });
}

// Construye el botón de una zapatilla del escaparate
function piezaHtml(pieza, posicion) {
  const modelo = pieza.modelo;
  const variante = pieza.variante;

  // Si algún día hay fotografías con licencia comprobada, se usan antes
  // que el dibujo SVG. Se admite una foto por color y otra por modelo.
  const foto = variante.imagen || modelo.imagen;

  const imagen = foto
    ? `<img class="zap" src="${textoSeguro(foto)}" alt="" aria-hidden="true"
            loading="lazy" decoding="async">`
    : svgZapatilla(variante.hex, variante.hex2, variante.suela,
                   modelo.nombre, "v" + variante.id_variante, true);

  const agotado = colorSinExistencias(variante);

  const pie = agotado
    ? '<span class="cli-pieza-agotado">Agotado</span>'
    : `<span class="cli-pieza-precio">${formatearPrecio(precioFinal(modelo, variante))}</span>`;

  // Rótulo discreto: nombre a la izquierda, precio a la derecha, y el
  // color debajo. Pequeño a propósito, para que no compita con la
  // zapatilla, que es lo que hay que mirar.
  const rotulo = `
      <span class="cli-pieza-rotulo">
        <span class="cli-pieza-nombre">${textoSeguro(modelo.nombre)}</span>
        ${pie}
      </span>
      <span class="cli-pieza-color">${textoSeguro(variante.color)}</span>`;

  // El retardo escalonado hace que las zapatillas aparezcan una tras otra
  const retardo = (posicion * 0.05).toFixed(2);

  return `
    <button class="cli-pieza${agotado ? " cli-sin-stock" : ""}" type="button"
            data-modelo="${modelo.id_modelo}"
            data-color="${pieza.indice}"
            style="animation-delay: ${retardo}s">
      <span class="cli-hueco">
        ${imagen}
        <span class="cli-balda" aria-hidden="true"></span>
      </span>${rotulo}
    </button>`;
}

// Dibuja el muro entero
function pintarEscaparate(modelos) {
  const contenedor = document.getElementById("cli-rejilla");
  const piezas = piezasDelCatalogo(modelos);
  let html = "";

  piezas.forEach(function (pieza, posicion) {
    html += piezaHtml(pieza, posicion);
  });

  contenedor.className = "cli-rejilla";
  contenedor.innerHTML = html;
}

// Un solo escuchador para todo el escaparate
function activarClics() {
  const contenedor = document.getElementById("cli-rejilla");

  contenedor.addEventListener("click", function (evento) {
    const pieza = evento.target.closest(".cli-pieza");

    if (!pieza) {
      return;
    }

    navegarCon("producto.html?modelo=" + pieza.dataset.modelo +
               "&color=" + pieza.dataset.color);
  });
}

// Arranque
async function iniciar() {
  const contenedor = document.getElementById("cli-rejilla");

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
