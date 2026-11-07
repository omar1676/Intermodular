/* NOVA Sneakers · Portada (pantalla) · Omar */

// Las de la portada son las que el catalogo marca como destacadas. Si
// alguna se queda sin existencias no se ensena: un escaparate no empieza
// por lo que no se puede comprar.
function destacadas(modelos) {
  return piezasDelCatalogo(modelos).filter(function (pieza) {
    return pieza.modelo.destacado && !colorSinExistencias(pieza.variante);
  });
}

function pintarEscaparate(modelos) {
  const contenedor = document.getElementById("cli-rejilla");
  pintarPiezas(contenedor, destacadas(modelos));
}

/* Tiene nombre propio porque la portada carga tambien catalogo.js, para
   el bloque de abajo, y dos funciones iniciar() en la misma pagina se
   pisarian la una a la otra. */
function iniciarPortada() {
  const contenedor = document.getElementById("cli-rejilla");

  if (!contenedor) {
    return;
  }

  const modelos = catalogoParaPintar(contenedor);

  if (!modelos) {
    return;
  }

  pintarEscaparate(modelos);
  activarClicsDePiezas(contenedor);
}

iniciarPortada();
