/* NOVA Sneakers · Catálogo completo (pantalla) · Omar */

// Las mismas piezas que el escaparate, pero en su propia página
function pintarCatalogo(modelos) {
  const contenedor = document.getElementById("cli-rejilla-catalogo");
  const piezas = piezasDelCatalogo(modelos);

  pintarPiezas(contenedor, piezas);

  // El recuento sale de los datos, para que no se quede desfasado
  const cuenta = document.getElementById("cli-cuenta-catalogo");

  if (cuenta) {
    cuenta.textContent = modelos.length + " modelos · " + piezas.length + " acabados";
  }
}

async function iniciar() {
  const contenedor = document.getElementById("cli-rejilla-catalogo");

  try {
    const modelos = await API.catalogo();

    if (!modelos || modelos.length === 0) {
      contenedor.textContent = "Todavía no hay zapatillas en el catálogo.";
      return;
    }

    pintarCatalogo(modelos);
    activarClicsDePiezas(contenedor);

  } catch (error) {
    contenedor.textContent =
      "No se ha podido cargar el catálogo. Vuelve a intentarlo más tarde.";
    console.error(error);
  }
}

iniciar();
