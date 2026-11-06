/* NOVA Sneakers · Portada (pantalla) · Omar */

// Una zapatilla por modelo: nos quedamos con su primer color
function destacadas(modelos) {
  return piezasDelCatalogo(modelos).filter(function (pieza) {
    return pieza.indice === 0;
  });
}

function pintarEscaparate(modelos) {
  const contenedor = document.getElementById("cli-rejilla");
  pintarPiezas(contenedor, destacadas(modelos));

  // Cuántos acabados hay en total lo dicen los datos, no el HTML
  const enlace = document.getElementById("cli-ir-catalogo");

  if (enlace) {
    enlace.textContent = "Ver los " + piezasDelCatalogo(modelos).length +
      " acabados del catálogo";
  }
}

function iniciar() {
  const contenedor = document.getElementById("cli-rejilla");
  const modelos = catalogoParaPintar(contenedor);

  if (!modelos) {
    return;
  }

  pintarEscaparate(modelos);
  activarClicsDePiezas(contenedor);
}

iniciar();
