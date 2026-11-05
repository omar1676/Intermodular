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
  document.body.classList.add("saliendo");

  setTimeout(function () {
    window.location.href = destino;
  }, 260);
}

/*
 * Al volver con el botón "atrás" del navegador, algunos navegadores
 * restauran la página tal y como estaba, es decir, con la clase
 * "saliendo" puesta y por tanto invisible. Esto lo arregla.
 */
window.addEventListener("pageshow", function () {
  document.body.classList.remove("saliendo");
});
