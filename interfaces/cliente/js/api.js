/*
 * NOVA Sneakers - Capa de acceso a datos del frontend
 *
 * Todo el frontend pide los datos AQUÍ y en ningún otro sitio. Hoy los
 * saca de datos-demo.js; el día que exista un servidor bastará con
 * cambiar MODO, sin tocar el resto de las páginas.
 *
 * IMPORTANTE para la defensa en clase: esta web es solo frontend. No hay
 * servidor, no hay base de datos y no hay autenticación de verdad.
 */

const API = {
  // "demo" es el único modo que funciona ahora mismo.
  MODO: "demo",

  async catalogo() {
    return CATALOGO_DEMO;
  },

  async modelo(idModelo) {
    const encontrado = CATALOGO_DEMO.find(function (m) {
      return m.id_modelo === idModelo;
    });

    if (!encontrado) {
      throw new Error("Modelo no encontrado");
    }

    return encontrado;
  }
};

/*
 * Utilidades compartidas por todas las páginas
 */

// Precio final = precio_base + suplemento_precio
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
// El carrito guarda solo el SKU y la cantidad, así que el nombre y el
// precio se vuelven a calcular siempre desde el catálogo.
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

/*
 * Transición suave también al pulsar los enlaces del menú, para que
 * moverse por la web no dé saltos bruscos.
 *
 * Se respetan a propósito el ctrl+clic, el clic con el botón central, los
 * enlaces externos y los anclas: esos tienen que seguir funcionando como
 * en cualquier otra web.
 */
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

/*
 * Al volver con el botón "atrás" del navegador, algunos navegadores
 * restauran la página tal y como estaba, es decir, con la clase
 * "saliendo" puesta y por tanto invisible. Esto lo arregla.
 */
window.addEventListener("pageshow", function () {
  document.body.classList.remove("saliendo");
});
