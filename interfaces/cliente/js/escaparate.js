/* NOVA Sneakers · Portada (pantalla) · Omar */

const PIEZAS_PORTADA = 8;

// Las ocho de la portada: primero un color de cada modelo y despues los
// colores que sobren, hasta llegar a ocho. Los colores agotados se quedan
// fuera: un escaparate no empieza por lo que no se puede comprar.
function destacadas(modelos) {
  const disponibles = piezasDelCatalogo(modelos).filter(function (pieza) {
    return !colorSinExistencias(pieza.variante);
  });

  const unaPorModelo = disponibles.filter(function (pieza) {
    return pieza.indice === 0;
  });

  const losDemasColores = disponibles.filter(function (pieza) {
    return pieza.indice > 0;
  });

  return unaPorModelo.concat(losDemasColores).slice(0, PIEZAS_PORTADA);
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
