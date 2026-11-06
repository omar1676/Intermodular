/* NOVA Sneakers · Acceso a datos y utilidades · Omar */

/* Unica puerta de acceso a los datos. Hoy el catalogo esta en memoria;
   cuando haya servidor, solo cambia lo de dentro de estas dos funciones
   (y quien las llama tendra que esperar la respuesta con await). */
const API = {
  catalogo() {
    return CATALOGO_DEMO;
  },

  modelo(idModelo) {
    const encontrado = CATALOGO_DEMO.find(function (modelo) {
      return modelo.id_modelo === idModelo;
    });

    if (!encontrado) {
      throw new Error("Modelo no encontrado");
    }

    return encontrado;
  }
};

/* Utilidades compartidas por todas las páginas */

function precioFinal(modelo, variante) {
  return Number(modelo.precio_base) + Number(variante.suplemento_precio);
}

// Formato español: 79,99 €
function formatearPrecio(importe) {
  return importe.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR"
  });
}

// Evita inyección de HTML al escribir texto que viene de los datos
function textoSeguro(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Busca un SKU en todo el catálogo y devuelve modelo, variante y talla.
function buscarSku(sku) {
  for (const modelo of CATALOGO_DEMO) {
    for (const variante of modelo.variantes) {
      for (const talla of variante.tallas) {
        if (talla.sku === sku) {
          return { modelo: modelo, variante: variante, talla: talla };
        }
      }
    }
  }

  return null;
}

/* Ruta de la foto de un color, o "" si hay que dibujarla */
function fotoVariante(variante) {
  if (typeof FOTOS === "undefined" || !variante) {
    return "";
  }

  const ruta = FOTOS[variante.id_variante];

  return typeof ruta === "string" ? ruta.trim() : "";
}

/* Si una foto no carga, se dibuja la zapatilla en su lugar */
function respaldoDeFotos(contenedor, dibujar) {
  contenedor.addEventListener("error", function (evento) {
    const imagen = evento.target;

    if (!imagen || imagen.tagName !== "IMG" || !imagen.dataset.respaldo) {
      return;
    }

    const repuesto = dibujar(imagen.dataset.respaldo);

    if (repuesto) {
      imagen.outerHTML = repuesto;
    }
  }, true);
}

// Navega a otra página con una transición suave de salida
function navegarCon(destino) {
  // Quien ha pedido menos movimiento no debe esperar la transición
  const sinMovimiento = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (sinMovimiento) {
    window.location.href = destino;
    return;
  }

  document.body.classList.add("saliendo");

  setTimeout(function () {
    window.location.href = destino;
  }, 260);
}

/* Transicion suave al pulsar los enlaces del menu */
document.addEventListener("click", function (evento) {
  const enlace = evento.target.closest("a");

  if (!enlace || evento.defaultPrevented) {
    return;
  }

  // Abrir en otra pestaña, descargar o usar un boton distinto al izquierdo
  const otraForma = evento.button !== 0 || evento.metaKey || evento.ctrlKey
    || evento.shiftKey || evento.altKey;

  if (otraForma || enlace.target === "_blank" || enlace.hasAttribute("download")) {
    return;
  }

  const destino = enlace.getAttribute("href");

  // Solo las páginas de nuestra propia web
  if (!destino || destino.startsWith("#") || destino.includes(":")) {
    return;
  }

  evento.preventDefault();
  navegarCon(destino);
});

/* Al volver con "atras" hay que quitar la clase de salida */
window.addEventListener("pageshow", function () {
  document.body.classList.remove("saliendo");
});
