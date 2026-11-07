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
  const imagen = imagenDePieza(variante);
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

/* El catálogo comercial: la misma zapatilla, pero en tarjeta.

   El escaparate expone de una en una y el catálogo sirve para comparar,
   así que la tarjeta enseña lo que hace falta para decidir: foto, marca,
   modelo, acabado, precio y, si procede, un aviso. */

// La imagen de una pieza: la foto si la hay, y si no el dibujo
function imagenDePieza(variante) {
  const foto = fotoVariante(variante);

  if (!foto) {
    return dibujoPorVariante(variante.id_variante);
  }

  return `<img class="zap" src="${textoSeguro(foto)}" alt="" aria-hidden="true"
            loading="lazy" decoding="async"
            data-respaldo="${variante.id_variante}">`;
}

/* El aviso de la esquina. No hay ninguno inventado: los tres salen de
   datos que ya existen. Si no toca ninguno, la tarjeta va limpia. */
function avisoDePieza(pieza) {
  if (colorSinExistencias(pieza.variante)) {
    return { texto: "Agotado", clase: "cli-aviso-agotado" };
  }

  const disponibles = pieza.variante.tallas.filter(function (talla) {
    return talla.stock > 0;
  }).length;

  if (disponibles <= 3) {
    return { texto: "Últimas tallas", clase: "cli-aviso-ultimas" };
  }

  if (pieza.modelo.destacado) {
    return { texto: "Novedad", clase: "cli-aviso-novedad" };
  }

  return null;
}

// "NOVA Origin" se parte en marca y modelo, como en cualquier tienda
function marcaYModelo(nombre) {
  const partes = String(nombre).split(" ");

  if (partes.length > 1 && partes[0] === "NOVA") {
    return { marca: "NOVA", modelo: partes.slice(1).join(" ") };
  }

  return { marca: "NOVA", modelo: String(nombre) };
}

function tarjetaHtml(pieza, posicion) {
  const modelo = pieza.modelo;
  const variante = pieza.variante;
  const nombre = marcaYModelo(modelo.nombre);
  const aviso = avisoDePieza(pieza);
  const agotado = colorSinExistencias(variante);

  const etiqueta = aviso
    ? `<span class="cli-aviso ${aviso.clase}">${aviso.texto}</span>`
    : "";

  // El retardo escalonado hace que las tarjetas aparezcan una tras otra.
  // Se corta a la novena para que al filtrar no haya que esperar.
  const retardo = (Math.min(posicion, 8) * 0.04).toFixed(2);

  return `
    <button class="cli-tarjeta${agotado ? " cli-sin-stock" : ""}" type="button"
            data-modelo="${modelo.id_modelo}"
            data-color="${pieza.indice}"
            style="animation-delay: ${retardo}s">
      <span class="cli-tarjeta-foto">
        ${imagenDePieza(variante)}
        ${etiqueta}
      </span>
      <span class="cli-tarjeta-marca">${textoSeguro(nombre.marca)}</span>
      <span class="cli-tarjeta-nombre">${textoSeguro(nombre.modelo)}</span>
      <span class="cli-tarjeta-color">${textoSeguro(variante.color)}</span>
      <span class="cli-tarjeta-precio">${formatearPrecio(precioFinal(modelo, variante))}</span>
    </button>`;
}

// Dibuja una lista de piezas como tarjetas de catálogo
function pintarTarjetas(contenedor, piezas) {
  let html = "";

  piezas.forEach(function (pieza, posicion) {
    html += tarjetaHtml(pieza, posicion);
  });

  contenedor.className = "cli-tarjetas";
  contenedor.innerHTML = html;

  respaldoDeFotos(contenedor, dibujoPorVariante);
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

// Un solo escuchador para todas las piezas del contenedor. Busca por el
// dato y no por la clase, para que sirva igual a la zapatilla del
// escaparate y a la tarjeta del catálogo.
function activarClicsDePiezas(contenedor) {
  contenedor.addEventListener("click", function (evento) {
    const pieza = evento.target.closest("[data-modelo]");

    if (!pieza) {
      return;
    }

    navegarCon("producto.html?modelo=" + pieza.dataset.modelo +
               "&color=" + pieza.dataset.color);
  });
}

// Pide el catálogo y escribe el aviso en el contenedor si algo va mal.
// Devuelve los modelos, o null si no hay nada que dibujar.
function catalogoParaPintar(contenedor) {
  try {
    const modelos = API.catalogo();

    if (!modelos || modelos.length === 0) {
      contenedor.textContent = "Todavía no hay zapatillas en el catálogo.";
      return null;
    }

    return modelos;

  } catch (error) {
    contenedor.textContent =
      "No se ha podido cargar el catálogo. Vuelve a intentarlo más tarde.";
    console.error(error);
    return null;
  }
}
