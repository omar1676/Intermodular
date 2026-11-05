/*
 * NOVA Sneakers - Capa de acceso a datos del frontend
 *
 * Todo el frontend pide los datos AQUÍ y en ningún otro sitio. Así, cuando
 * en la fase 5 exista el backend, solo hay que cambiar MODO a "servidor":
 * ni el catálogo ni la vista de producto se enteran.
 *
 * El navegador NUNCA habla con PostgreSQL. No puede: Postgres no usa HTTP.
 * Siempre irá contra la API de interfaces/cliente-api, que es la única que
 * tiene las credenciales y la clave de Resend.
 */

const API = {
  // "demo"     -> usa CATALOGO_DEMO (fase 2, sin backend todavía)
  // "servidor" -> usa fetch contra la API (a partir de la fase 5)
  MODO: "demo",

  BASE: "http://localhost:3000/api",

  // Devuelve todos los modelos activos con sus variantes y tallas
  async catalogo() {
    if (this.MODO === "demo") {
      return CATALOGO_DEMO;
    }

    const respuesta = await fetch(this.BASE + "/catalogo");

    if (!respuesta.ok) {
      throw new Error("No se ha podido cargar el catálogo");
    }

    return respuesta.json();
  },

  // Devuelve un modelo concreto por su id
  async modelo(idModelo) {
    if (this.MODO === "demo") {
      const encontrado = CATALOGO_DEMO.find(function (m) {
        return m.id_modelo === idModelo;
      });

      // Simulamos el 404 del servidor para que la vista lo trate igual
      if (!encontrado) {
        throw new Error("Modelo no encontrado");
      }

      return encontrado;
    }

    const respuesta = await fetch(this.BASE + "/modelos/" + idModelo);

    if (!respuesta.ok) {
      throw new Error("Modelo no encontrado");
    }

    return respuesta.json();
  }
};

/*
 * Utilidades compartidas
 */

// Precio final = precio_base + suplemento_precio, igual que en SQL
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

// Navega a otra página con una transición suave de salida
function navegarCon(destino) {
  document.body.classList.add("saliendo");

  setTimeout(function () {
    window.location.href = destino;
  }, 260);
}
