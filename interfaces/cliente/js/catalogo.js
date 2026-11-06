/* NOVA Sneakers · Escaparate (pantalla) · Omar */

// Dibuja el muro entero: las doce piezas del catálogo
function pintarEscaparate(modelos) {
  const contenedor = document.getElementById("cli-rejilla");
  pintarPiezas(contenedor, piezasDelCatalogo(modelos));
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
    activarClicsDePiezas(contenedor);

  } catch (error) {
    contenedor.textContent =
      "No se ha podido cargar el catálogo. Vuelve a intentarlo más tarde.";
    console.error(error);
  }
}

iniciar();
