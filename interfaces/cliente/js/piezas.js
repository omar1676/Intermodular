/* NOVA Sneakers · Piezas del catalogo · Omar */

// Aplana modelos -> variantes en una lista de piezas
function piezasDelCatalogo(modelos) {
  const piezas = [];

  modelos.forEach(function (modelo) {
    modelo.variantes.forEach(function (variante, indice) {
      piezas.push({ modelo: modelo, variante: variante, indice: indice });
    });
  });

  return piezas;
}

function dibujoPorVariante(idVariante) {
  for (const modelo of CATALOGO_DEMO) {
    for (const variante of modelo.variantes) {
      if (String(variante.id_variante) === String(idVariante)) {
        return svgZapatilla(variante.hex, variante.hex2, variante.suela,
                            modelo.nombre, "v" + variante.id_variante, true);
      }
    }
  }

  return "";
}

// Un color está agotado cuando ninguna de sus tallas tiene existencias
function colorSinExistencias(variante) {
  return variante.tallas.every(function (talla) {
    return talla.stock <= 0;
  });
}

// Construye el botón de una zapatilla
function piezaHtml(pieza, posicion) {
  const modelo = pieza.modelo;
  const variante = pieza.variante;

  // Si el color tiene foto en la tabla FOTOS, manda la foto.
  const foto = fotoVariante(variante);

  const imagen = foto
    ? `<img class="zap" src="${textoSeguro(foto)}" alt="" aria-hidden="true"
            loading="lazy" decoding="async"
            data-respaldo="${variante.id_variante}">`
    : dibujoPorVariante(variante.id_variante);

  const agotado = colorSinExistencias(variante);

  const pie = agotado
    ? '<span class="cli-pieza-agotado">Agotado</span>'
    : `<span class="cli-pieza-precio">${formatearPrecio(precioFinal(modelo, variante))}</span>`;

  // Rótulo discreto: nombre a la izquierda, precio a la derecha, y el color debajo.
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

// Dibuja una lista de piezas dentro del contenedor que se le pase
function pintarPiezas(contenedor, piezas) {
  let html = "";

  piezas.forEach(function (pieza, posicion) {
    html += piezaHtml(pieza, posicion);
  });

  contenedor.className = "cli-rejilla";
  contenedor.innerHTML = html;

  // Si alguna foto no carga, se dibuja esa zapatilla en su lugar
  respaldoDeFotos(contenedor, dibujoPorVariante);
}

// Un solo escuchador para todas las piezas del contenedor
function activarClicsDePiezas(contenedor) {
  contenedor.addEventListener("click", function (evento) {
    const pieza = evento.target.closest(".cli-pieza");

    if (!pieza) {
      return;
    }

    navegarCon("producto.html?modelo=" + pieza.dataset.modelo +
               "&color=" + pieza.dataset.color);
  });
}
