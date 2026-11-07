/* NOVA Sneakers · Catálogo comercial (pantalla) · Omar */

/* Esta pantalla la usan dos páginas: el bloque de abajo de la portada y
   catalogo.html entera. Las dos tienen los mismos huecos, así que el
   código es el mismo y no hay nada duplicado.

   Los filtros no están escritos en el HTML: se construyen a partir del
   catálogo, así que añadir una colección o una talla a los datos los
   añade aquí sola. */

/* Los tramos de precio son lo único de esta pantalla que no sale de los
   datos: hay que partir por algún sitio. Los precios del catálogo van de
   79,99 a 159,90, así que se parten en tres. */
const RANGOS_PRECIO = [
  { clave: "bajo",  nombre: "Menos de 110 €", min: 0,   max: 110 },
  { clave: "medio", nombre: "110 € – 130 €",  min: 110, max: 130 },
  { clave: "alto",  nombre: "Más de 130 €",   min: 130, max: Infinity }
];

const DISPONIBILIDAD = [
  { clave: "disponible", nombre: "Disponible" },
  { clave: "ultimas",    nombre: "Últimas tallas" },
  { clave: "agotado",    nombre: "Agotado" }
];

const ORDENES = [
  { clave: "destacadas", nombre: "Destacadas" },
  { clave: "precio-asc", nombre: "Precio: de menor a mayor" },
  { clave: "precio-desc", nombre: "Precio: de mayor a menor" },
  { clave: "nombre", nombre: "Nombre (A–Z)" }
];

/* Lo elegido ahora mismo. Una lista vacía quiere decir "todo vale", que
   es lo que espera cualquiera al entrar en una tienda. */
const filtros = {
  coleccion: [],
  precio: [],
  talla: [],
  disponibilidad: []
};

let ordenElegido = "destacadas";

/* Qué pasa el filtro */

function pasaColeccion(pieza) {
  return filtros.coleccion.length === 0
    || filtros.coleccion.indexOf(pieza.modelo.coleccion) >= 0;
}

function pasaPrecio(pieza) {
  if (filtros.precio.length === 0) {
    return true;
  }

  const precio = precioFinal(pieza.modelo, pieza.variante);

  return RANGOS_PRECIO.some(function (rango) {
    return filtros.precio.indexOf(rango.clave) >= 0
      && precio >= rango.min && precio < rango.max;
  });
}

// Una talla cuenta solo si se puede comprar: si no, el filtro mentiría
function pasaTalla(pieza) {
  if (filtros.talla.length === 0) {
    return true;
  }

  return pieza.variante.tallas.some(function (talla) {
    return talla.stock > 0 && filtros.talla.indexOf(talla.talla) >= 0;
  });
}

function pasaDisponibilidad(pieza) {
  return filtros.disponibilidad.length === 0
    || filtros.disponibilidad.indexOf(estadoDeExistencias(pieza.variante)) >= 0;
}

function piezaPasaLosFiltros(pieza) {
  return pasaColeccion(pieza) && pasaPrecio(pieza)
    && pasaTalla(pieza) && pasaDisponibilidad(pieza);
}

function hayAlgunFiltro() {
  return filtros.coleccion.length + filtros.precio.length
    + filtros.talla.length + filtros.disponibilidad.length > 0;
}

/* El orden */

function ordenar(piezas) {
  const lista = piezas.slice();

  if (ordenElegido === "precio-asc" || ordenElegido === "precio-desc") {
    const signo = ordenElegido === "precio-asc" ? 1 : -1;

    return lista.sort(function (a, b) {
      return signo * (precioFinal(a.modelo, a.variante) - precioFinal(b.modelo, b.variante));
    });
  }

  if (ordenElegido === "nombre") {
    return lista.sort(function (a, b) {
      return a.modelo.nombre.localeCompare(b.modelo.nombre, "es");
    });
  }

  // Destacadas primero y, dentro de cada grupo, el orden del catálogo
  return lista.sort(function (a, b) {
    if (a.modelo.destacado !== b.modelo.destacado) {
      return a.modelo.destacado ? -1 : 1;
    }

    return a.modelo.id_modelo - b.modelo.id_modelo;
  });
}

function piezasVisibles(modelos) {
  return ordenar(piezasDelCatalogo(modelos).filter(piezaPasaLosFiltros));
}

/* Dibujado */

function pintarCatalogo(modelos) {
  const contenedor = document.getElementById("cli-rejilla-catalogo");
  const piezas = piezasVisibles(modelos);

  if (piezas.length === 0) {
    contenedor.className = "cli-estado";
    contenedor.textContent = "Ninguna zapatilla cumple lo que has pedido.";
  } else {
    pintarTarjetas(contenedor, piezas);
  }

  const cuenta = document.getElementById("cli-cuenta-catalogo");

  if (cuenta) {
    cuenta.textContent = piezas.length === 1
      ? "1 artículo"
      : piezas.length + " artículos";
  }

  const limpiar = document.getElementById("cli-limpiar");

  if (limpiar) {
    limpiar.hidden = !hayAlgunFiltro();
  }
}

/* Los bloques del lateral. Cada opción lleva cuántas zapatillas tiene,
   contadas sobre el catálogo entero. */
function opcionesDe(grupo, modelos) {
  const piezas = piezasDelCatalogo(modelos);

  function cuantas(prueba) {
    return piezas.filter(prueba).length;
  }

  if (grupo === "coleccion") {
    return COLECCIONES.map(function (c) {
      return { valor: c.clave, nombre: c.nombre,
               cuantas: cuantas(function (p) { return p.modelo.coleccion === c.clave; }) };
    });
  }

  if (grupo === "precio") {
    return RANGOS_PRECIO.map(function (r) {
      return { valor: r.clave, nombre: r.nombre,
               cuantas: cuantas(function (p) {
                 const precio = precioFinal(p.modelo, p.variante);
                 return precio >= r.min && precio < r.max;
               }) };
    });
  }

  if (grupo === "talla") {
    // Las tallas salen del catálogo, no de una lista escrita a mano
    const tallas = [];

    piezas.forEach(function (p) {
      p.variante.tallas.forEach(function (t) {
        if (tallas.indexOf(t.talla) < 0) { tallas.push(t.talla); }
      });
    });

    return tallas.sort(function (a, b) { return a - b; }).map(function (t) {
      return { valor: t, nombre: String(t),
               cuantas: cuantas(function (p) {
                 return p.variante.tallas.some(function (x) {
                   return x.talla === t && x.stock > 0;
                 });
               }) };
    });
  }

  return DISPONIBILIDAD.map(function (d) {
    return { valor: d.clave, nombre: d.nombre,
             cuantas: cuantas(function (p) {
               return estadoDeExistencias(p.variante) === d.clave;
             }) };
  });
}

const BLOQUES = [
  { grupo: "coleccion", titulo: "Colección" },
  { grupo: "precio", titulo: "Precio" },
  { grupo: "talla", titulo: "Talla" },
  { grupo: "disponibilidad", titulo: "Disponibilidad" }
];

function bloqueHtml(bloque, modelos) {
  const opciones = opcionesDe(bloque.grupo, modelos).map(function (o) {
    const marcado = filtros[bloque.grupo].indexOf(o.valor) >= 0;

    return '<label class="cli-opcion">' +
      '<input type="checkbox" data-grupo="' + bloque.grupo + '"' +
      ' value="' + textoSeguro(o.valor) + '"' + (marcado ? " checked" : "") + ">" +
      '<span class="cli-opcion-nombre">' + textoSeguro(o.nombre) + "</span>" +
      '<span class="cli-opcion-cuantas">' + o.cuantas + "</span></label>";
  }).join("");

  const puestos = filtros[bloque.grupo].length;

  return '<details class="cli-bloque" open>' +
    "<summary>" + textoSeguro(bloque.titulo) +
    (puestos ? '<span class="cli-bloque-puestos">' + puestos + "</span>" : "") +
    "</summary>" +
    '<div class="cli-opciones">' + opciones + "</div></details>";
}

function pintarFiltros(modelos) {
  const barra = document.getElementById("cli-filtros");

  if (!barra) {
    return;
  }

  barra.innerHTML = BLOQUES.map(function (b) { return bloqueHtml(b, modelos); }).join("");
}

function pintarOrden() {
  const selector = document.getElementById("cli-orden");

  if (!selector) {
    return;
  }

  selector.innerHTML = ORDENES.map(function (o) {
    return '<option value="' + o.clave + '"' +
      (o.clave === ordenElegido ? " selected" : "") + ">" +
      textoSeguro(o.nombre) + "</option>";
  }).join("");
}

/* Escuchadores */

function activarFiltros(modelos) {
  const barra = document.getElementById("cli-filtros");

  if (!barra) {
    return;
  }

  barra.addEventListener("change", function (evento) {
    const casilla = evento.target;

    if (!casilla || !casilla.dataset || !casilla.dataset.grupo) {
      return;
    }

    const grupo = casilla.dataset.grupo;
    // Las tallas son números en los datos; el HTML siempre da texto
    const valor = grupo === "talla" ? Number(casilla.value) : casilla.value;
    const puesto = filtros[grupo].indexOf(valor);

    if (puesto >= 0) {
      filtros[grupo].splice(puesto, 1);
    } else {
      filtros[grupo].push(valor);
    }

    pintarFiltros(modelos);
    pintarCatalogo(modelos);
  });
}

function activarLimpiar(modelos) {
  const boton = document.getElementById("cli-limpiar");

  if (!boton) {
    return;
  }

  boton.addEventListener("click", function () {
    Object.keys(filtros).forEach(function (grupo) { filtros[grupo] = []; });
    pintarFiltros(modelos);
    pintarCatalogo(modelos);
  });
}

function activarOrden(modelos) {
  const selector = document.getElementById("cli-orden");

  if (!selector) {
    return;
  }

  selector.addEventListener("change", function () {
    ordenElegido = selector.value;
    pintarCatalogo(modelos);
  });
}

/* El botón de ocultar los filtros. En pantalla estrecha empiezan
   plegados, como en cualquier tienda del móvil; en escritorio, a la
   vista. Todo lo hace una clase en el contenedor. */
function pantallaEstrecha() {
  return !!(window.matchMedia && window.matchMedia("(max-width: 860px)").matches);
}

function activarOcultarFiltros() {
  const boton = document.getElementById("cli-ocultar-filtros");
  const caja = document.getElementById("cli-catalogo-caja");

  if (!boton || !caja) {
    return;
  }

  function aplicar(ocultos) {
    caja.classList.toggle("cli-sin-filtros", ocultos);
    boton.textContent = ocultos ? "Mostrar filtros" : "Ocultar filtros";
    boton.setAttribute("aria-expanded", ocultos ? "false" : "true");
  }

  let ocultos = pantallaEstrecha();
  aplicar(ocultos);

  boton.addEventListener("click", function () {
    ocultos = !ocultos;
    aplicar(ocultos);
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

  pintarFiltros(modelos);
  pintarOrden();
  activarFiltros(modelos);
  activarLimpiar(modelos);
  activarOrden(modelos);
  activarOcultarFiltros();
  pintarCatalogo(modelos);
  activarClicsDePiezas(contenedor);
}

iniciarCatalogo();
