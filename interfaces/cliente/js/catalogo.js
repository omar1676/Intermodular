/* NOVA Sneakers · Catálogo comercial (pantalla) · Omar */

/* Esta pantalla la usan dos páginas: el bloque de abajo de la portada y
   catalogo.html entera. Las dos tienen los mismos tres huecos, así que
   el código es el mismo y no hay nada duplicado. */

// Colección elegida. Vacío quiere decir todas.
let coleccionElegida = "";

function piezasVisibles(modelos) {
  const piezas = piezasDelCatalogo(modelos);

  if (!coleccionElegida) {
    return piezas;
  }

  return piezas.filter(function (pieza) {
    return pieza.modelo.coleccion === coleccionElegida;
  });
}

// Cuántas hay y de qué colección. El número sale de contar, no de una
// constante, para que no se quede desfasado al cambiar el catálogo.
function textoDelRecuento(piezas) {
  const cuantas = piezas.length + (piezas.length === 1 ? " zapatilla" : " zapatillas");

  const coleccion = COLECCIONES.find(function (c) {
    return c.clave === coleccionElegida;
  });

  return coleccion ? cuantas + " · " + coleccion.nombre : cuantas;
}

function pintarCatalogo(modelos) {
  const contenedor = document.getElementById("cli-rejilla-catalogo");
  const piezas = piezasVisibles(modelos);

  pintarTarjetas(contenedor, piezas);

  const cuenta = document.getElementById("cli-cuenta-catalogo");

  if (cuenta) {
    cuenta.textContent = textoDelRecuento(piezas);
  }
}

/* Los botones del filtro salen de COLECCIONES, así que añadir una
   colección a los datos la añade aquí sola. */
function pintarFiltros() {
  const barra = document.getElementById("cli-filtros");

  if (!barra) {
    return;
  }

  const botones = [{ clave: "", nombre: "Todas" }].concat(COLECCIONES);

  barra.innerHTML = botones.map(function (opcion) {
    const activo = opcion.clave === coleccionElegida;

    return '<button class="cli-filtro" type="button"' +
           ' data-coleccion="' + textoSeguro(opcion.clave) + '"' +
           ' aria-pressed="' + activo + '">' +
           textoSeguro(opcion.nombre) + "</button>";
  }).join("");
}

function activarFiltros(modelos) {
  const barra = document.getElementById("cli-filtros");

  if (!barra) {
    return;
  }

  barra.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".cli-filtro");

    if (!boton || boton.dataset.coleccion === coleccionElegida) {
      return;
    }

    coleccionElegida = boton.dataset.coleccion;
    pintarFiltros();
    pintarCatalogo(modelos);
  });
}

function iniciarCatalogo() {
  const contenedor = document.getElementById("cli-rejilla-catalogo");

  if (!contenedor) {
    return;
  }

  const modelos = catalogoParaPintar(contenedor);

  if (!modelos) {
    return;
  }

  pintarFiltros();
  activarFiltros(modelos);
  pintarCatalogo(modelos);
  activarClicsDePiezas(contenedor);
}

iniciarCatalogo();
