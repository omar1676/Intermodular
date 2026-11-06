/* NOVA Sneakers · Catálogo completo (pantalla) · Omar */

// Las mismas piezas que la portada, pero todas
function pintarCatalogo(modelos) {
  const contenedor = document.getElementById("cli-rejilla-catalogo");
  const piezas = piezasDelCatalogo(modelos);

  pintarPiezas(contenedor, piezas);

  // El recuento sale de los datos, para que no se quede desfasado
  const cuenta = document.getElementById("cli-cuenta-catalogo");

  if (cuenta) {
    cuenta.textContent = piezas.length + " modelos, uno por fotografía";
  }
}

function iniciar() {
  const contenedor = document.getElementById("cli-rejilla-catalogo");
  const modelos = catalogoParaPintar(contenedor);

  if (!modelos) {
    return;
  }

  pintarCatalogo(modelos);
  activarClicsDePiezas(contenedor);
}

iniciar();
