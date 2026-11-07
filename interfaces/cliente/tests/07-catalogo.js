/* Catálogo comercial: tarjetas, filtros laterales, orden y barra */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js",
  "catalogo.js"
]);

let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK    " : "  FALLO ") + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

const TODAS = piezasDelCatalogo(CATALOGO_DEMO);

// Deja los filtros y el orden como al entrar en la página
function desdeCero() {
  Object.keys(filtros).forEach(function (g) { filtros[g] = []; });
  ordenElegido = "destacadas";
  pintarCatalogo(CATALOGO_DEMO);
  return __nodos["cli-rejilla-catalogo"].innerHTML;
}

function cuantasTarjetas() {
  const html = __nodos["cli-rejilla-catalogo"].innerHTML;
  return (html.match(/class="cli-tarjeta[ "]/g) || []).length;
}

const html = desdeCero();

console.log("=== UNA TARJETA POR ZAPATILLA ===");

comprobar("dibuja una tarjeta por acabado", cuantasTarjetas() === TODAS.length, cuantasTarjetas());

const parejas = [];
html.replace(/data-modelo="(\d+)"\s+data-color="(\d+)"/g, function (m, modelo, color) {
  parejas.push(modelo + "-" + color);
  return m;
});

comprobar("todas llevan modelo y color", parejas.length === TODAS.length, parejas.length);
comprobar("ninguna pareja repetida", new Set(parejas).size === parejas.length);

const esperadas = [];
CATALOGO_DEMO.forEach(function (modelo) {
  modelo.variantes.forEach(function (variante, indice) {
    esperadas.push(modelo.id_modelo + "-" + indice);
  });
});

comprobar("son las mismas que en CATALOGO_DEMO",
  esperadas.sort().join(",") === parejas.slice().sort().join(","),
  parejas.length + " tarjetas");

// La pagina no dibuja nada por su cuenta: usa la funcion compartida
const aparte = document.getElementById("rejilla-de-prueba");
pintarTarjetas(aparte, piezasVisibles(CATALOGO_DEMO));
comprobar("dibuja lo mismo que pintarTarjetas, sin copiar nada",
  aparte.innerHTML === html, aparte.innerHTML.length + " vs " + html.length + " caracteres");

console.log("\n=== LO QUE ENSEÑA LA TARJETA ===");

comprobar("la marca va separada del modelo",
  (html.match(/cli-tarjeta-marca">NOVA</g) || []).length === TODAS.length);

comprobar("y el nombre va sin la marca delante",
  CATALOGO_DEMO.every(function (m) {
    return html.includes('cli-tarjeta-nombre">' + m.nombre.replace("NOVA ", "") + "<");
  }));

comprobar("la línea de debajo lleva colección y acabado",
  TODAS.every(function (p) {
    return html.includes('cli-tarjeta-linea">' +
      nombreDeColeccion(p.modelo.coleccion) + " · " + p.variante.color + "<");
  }));

comprobar("y esa colección es una de las seis",
  CATALOGO_DEMO.every(function (m) {
    return COLECCIONES.some(function (c) { return c.clave === m.coleccion; });
  }));

comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n=== PRECIOS ===");

CATALOGO_DEMO.forEach(function (modelo) {
  const precio = formatearPrecio(precioFinal(modelo, modelo.variantes[0]));
  comprobar("precio de " + modelo.nombre + " (" + precio + ")", html.includes(precio));
});

console.log("\n=== LOS AVISOS SALEN DE LOS DATOS ===");

/* Las cuentas se hacen aquí aparte, a mano, para que una prueba que mira
   el HTML no se apoye en la misma función que lo escribió. */
function conStock(variante) {
  return variante.tallas.filter(function (t) { return t.stock > 0; }).length;
}

const sinNada = TODAS.filter(function (p) { return conStock(p.variante) === 0; });
const ultimas = TODAS.filter(function (p) {
  const q = conStock(p.variante);
  return q > 0 && q <= 3;
});
const novedades = TODAS.filter(function (p) {
  return conStock(p.variante) > 3 && p.modelo.destacado;
});

function cuenta(trozo) {
  return (html.match(new RegExp(trozo, "g")) || []).length;
}

comprobar("tantos 'Agotado' como acabados sin ninguna talla (" + sinNada.length + ")",
  cuenta("cli-aviso-agotado") === sinNada.length, cuenta("cli-aviso-agotado"));
comprobar("tantas 'Últimas tallas' como acabados con 3 o menos (" + ultimas.length + ")",
  cuenta("cli-aviso-ultimas") === ultimas.length, cuenta("cli-aviso-ultimas"));
comprobar("tantas 'Novedad' como destacadas con existencias (" + novedades.length + ")",
  cuenta("cli-aviso-novedad") === novedades.length, cuenta("cli-aviso-novedad"));

comprobar("una zapatilla no lleva dos avisos a la vez",
  cuenta("cli-aviso-agotado") + cuenta("cli-aviso-ultimas") + cuenta("cli-aviso-novedad")
    === cuenta('class="cli-aviso '));

comprobar("la agotada lleva además la clase que la apaga",
  (html.match(/cli-tarjeta cli-sin-stock/g) || []).length === sinNada.length);

comprobar("el aviso y el filtro miran el mismo estado",
  TODAS.every(function (p) {
    const estado = estadoDeExistencias(p.variante);
    const aviso = avisoDePieza(p);
    if (estado === "agotado") return aviso && aviso.texto === "Agotado";
    if (estado === "ultimas") return aviso && aviso.texto === "Últimas tallas";
    return !aviso || aviso.texto === "Novedad";
  }));

console.log("\n=== LA COLUMNA DE FILTROS ===");

pintarFiltros(CATALOGO_DEMO);
const lado = __nodos["cli-filtros"].innerHTML;

comprobar("hay cuatro bloques desplegables",
  (lado.match(/<details/g) || []).length === 4,
  (lado.match(/<details/g) || []).length);

["Colección", "Precio", "Talla", "Disponibilidad"].forEach(function (titulo) {
  comprobar("bloque " + titulo, lado.includes("<summary>" + titulo));
});

comprobar("las colecciones salen de COLECCIONES",
  COLECCIONES.every(function (c) {
    return lado.includes('value="' + c.clave + '"');
  }));

comprobar("las tallas salen del catálogo, no de una lista a mano",
  (function () {
    const delCatalogo = new Set();
    TODAS.forEach(function (p) {
      p.variante.tallas.forEach(function (t) { delCatalogo.add(t.talla); });
    });
    return [...delCatalogo].every(function (t) {
      return lado.includes('data-grupo="talla" value="' + t + '"');
    });
  })());

comprobar("cada opción lleva cuántas zapatillas tiene",
  (lado.match(/cli-opcion-cuantas/g) || []).length ===
  (lado.match(/type="checkbox"/g) || []).length,
  (lado.match(/cli-opcion-cuantas/g) || []).length + " de " +
  (lado.match(/type="checkbox"/g) || []).length);

// Las cuentas de la columna tienen que cuadrar con el catálogo
COLECCIONES.forEach(function (c) {
  const esperado = TODAS.filter(function (p) { return p.modelo.coleccion === c.clave; }).length;
  const trozo = lado.split('value="' + c.clave + '"')[1] || "";
  const m = /cli-opcion-cuantas">(\d+)</.exec(trozo);
  comprobar("la cuenta de " + c.nombre + " dice " + esperado,
    m && Number(m[1]) === esperado, m ? m[1] : "no encontrada");
});

comprobar("el botón de quitar filtros empieza escondido",
  __nodos["cli-limpiar"].hidden === true, __nodos["cli-limpiar"].hidden);

console.log("\n=== FILTRAR POR COLECCIÓN ===");

COLECCIONES.forEach(function (c) {
  desdeCero();
  filtros.coleccion = [c.clave];
  pintarCatalogo(CATALOGO_DEMO);

  const esperado = TODAS.filter(function (p) { return p.modelo.coleccion === c.clave; }).length;

  comprobar(c.nombre + ": " + esperado + " zapatillas", cuantasTarjetas() === esperado, cuantasTarjetas());
  comprobar(c.nombre + ": el recuento lo dice bien",
    __nodos["cli-cuenta-catalogo"].textContent === esperado + " artículos",
    __nodos["cli-cuenta-catalogo"].textContent);
});

desdeCero();
filtros.coleccion = ["hombre", "mujer"];
pintarCatalogo(CATALOGO_DEMO);
comprobar("dos colecciones a la vez suman las dos", cuantasTarjetas() === 40, cuantasTarjetas());

comprobar("y entonces aparece el botón de quitar filtros",
  __nodos["cli-limpiar"].hidden === false, __nodos["cli-limpiar"].hidden);

console.log("\n=== FILTRAR POR PRECIO ===");

RANGOS_PRECIO.forEach(function (r) {
  desdeCero();
  filtros.precio = [r.clave];
  pintarCatalogo(CATALOGO_DEMO);

  const esperado = TODAS.filter(function (p) {
    const precio = precioFinal(p.modelo, p.variante);
    return precio >= r.min && precio < r.max;
  }).length;

  comprobar(r.nombre + ": " + esperado + " zapatillas", cuantasTarjetas() === esperado, cuantasTarjetas());
});

desdeCero();
filtros.precio = RANGOS_PRECIO.map(function (r) { return r.clave; });
pintarCatalogo(CATALOGO_DEMO);
comprobar("los tres tramos juntos son el catálogo entero", cuantasTarjetas() === TODAS.length, cuantasTarjetas());

console.log("\n=== FILTRAR POR TALLA ===");

[40, 42, 44].forEach(function (t) {
  desdeCero();
  filtros.talla = [t];
  pintarCatalogo(CATALOGO_DEMO);

  const esperado = TODAS.filter(function (p) {
    return p.variante.tallas.some(function (x) { return x.talla === t && x.stock > 0; });
  }).length;

  comprobar("talla " + t + ": " + esperado + " zapatillas", cuantasTarjetas() === esperado, cuantasTarjetas());
  comprobar("talla " + t + ": ninguna sin esa talla en stock", esperado < TODAS.length, esperado);
});

console.log("\n=== FILTRAR POR DISPONIBILIDAD ===");

DISPONIBILIDAD.forEach(function (d) {
  desdeCero();
  filtros.disponibilidad = [d.clave];
  pintarCatalogo(CATALOGO_DEMO);

  const esperado = TODAS.filter(function (p) {
    return estadoDeExistencias(p.variante) === d.clave;
  }).length;

  comprobar(d.nombre + ": " + esperado + " zapatillas", cuantasTarjetas() === esperado, cuantasTarjetas());
});

desdeCero();
filtros.disponibilidad = ["agotado"];
pintarCatalogo(CATALOGO_DEMO);
comprobar("las agotadas son solo las que no tienen ninguna talla",
  cuantasTarjetas() === sinNada.length, cuantasTarjetas());

console.log("\n=== VARIOS FILTROS A LA VEZ ===");

desdeCero();
filtros.coleccion = ["mujer"];
filtros.precio = ["alto"];
pintarCatalogo(CATALOGO_DEMO);

const mujerCaras = TODAS.filter(function (p) {
  return p.modelo.coleccion === "mujer" && precioFinal(p.modelo, p.variante) >= 130;
}).length;

comprobar("mujer + más de 130 € = " + mujerCaras, cuantasTarjetas() === mujerCaras, cuantasTarjetas());
comprobar("y es menos que solo mujer", mujerCaras < 20, mujerCaras);

desdeCero();
filtros.coleccion = ["luxe"];
filtros.disponibilidad = ["agotado"];
pintarCatalogo(CATALOGO_DEMO);
comprobar("una combinación sin resultados avisa en vez de quedarse en blanco",
  __nodos["cli-rejilla-catalogo"].textContent.indexOf("Ninguna zapatilla") >= 0,
  __nodos["cli-rejilla-catalogo"].textContent);
comprobar("y el recuento dice cero", __nodos["cli-cuenta-catalogo"].textContent === "0 artículos",
  __nodos["cli-cuenta-catalogo"].textContent);

console.log("\n=== ORDENAR ===");

pintarOrden();
comprobar("el selector tiene las cuatro formas de ordenar",
  (__nodos["cli-orden"].innerHTML.match(/<option/g) || []).length === ORDENES.length,
  (__nodos["cli-orden"].innerHTML.match(/<option/g) || []).length);

function preciosEnPantalla() {
  return piezasVisibles(CATALOGO_DEMO).map(function (p) {
    return precioFinal(p.modelo, p.variante);
  });
}

desdeCero();
ordenElegido = "precio-asc";
const asc = preciosEnPantalla();
comprobar("de menor a mayor",
  asc.every(function (v, i) { return i === 0 || asc[i - 1] <= v; }),
  asc[0] + " … " + asc[asc.length - 1]);

ordenElegido = "precio-desc";
const desc = preciosEnPantalla();
comprobar("de mayor a menor",
  desc.every(function (v, i) { return i === 0 || desc[i - 1] >= v; }),
  desc[0] + " … " + desc[desc.length - 1]);

comprobar("ordenar no pierde ni añade ninguna", asc.length === TODAS.length && desc.length === TODAS.length);

ordenElegido = "nombre";
const nombres = piezasVisibles(CATALOGO_DEMO).map(function (p) { return p.modelo.nombre; });
comprobar("por nombre, de la A a la Z",
  nombres.every(function (v, i) { return i === 0 || nombres[i - 1].localeCompare(v, "es") <= 0; }),
  nombres[0] + " … " + nombres[nombres.length - 1]);

ordenElegido = "destacadas";
const primeras = piezasVisibles(CATALOGO_DEMO).slice(0, 8);
comprobar("las destacadas salen las primeras",
  primeras.every(function (p) { return p.modelo.destacado; }),
  primeras.map(function (p) { return p.modelo.nombre; }).join(", "));

desdeCero();

console.log("\n=== ESTADO DE LA PÁGINA ===");

comprobar("la rejilla deja de estar en 'cargando'",
  __nodos["cli-rejilla-catalogo"].className === "cli-tarjetas",
  __nodos["cli-rejilla-catalogo"].className);

comprobar("el recuento del catálogo entero",
  __nodos["cli-cuenta-catalogo"].textContent === TODAS.length + " artículos",
  __nodos["cli-cuenta-catalogo"].textContent);

// Hoy todas las zapatillas tienen foto, asi que no se dibuja ningun SVG.
// Se vacia FOTOS un momento para comprobar que los dibujos de respaldo
// siguen sin repetir identificadores de degradado.
const fotosGuardadas = Object.assign({}, FOTOS);
Object.keys(FOTOS).forEach(function (k) { FOTOS[k] = ""; });
pintarCatalogo(CATALOGO_DEMO);
const dibujado = __nodos["cli-rejilla-catalogo"].innerHTML;
Object.keys(fotosGuardadas).forEach(function (k) { FOTOS[k] = fotosGuardadas[k]; });

comprobar("sin fotos se dibujan todas",
  (dibujado.match(/<svg/g) || []).length === TODAS.length,
  (dibujado.match(/<svg/g) || []).length);

comprobar("ningun id de degradado repetido",
  (function () {
    const ids = dibujado.match(/id="(cuerpo|suela|media|luz|ocluir|calida|borron|recCuerpo|recMedia)-[^"]+"/g) || [];
    return ids.length > 0 && new Set(ids).size === ids.length;
  })());

comprobar("existe el escuchador de clics reutilizado",
  typeof activarClicsDePiezas === "function");

desdeCero();

console.log("\n=== LAS DOS PÁGINAS ESTÁN BIEN CABLEADAS ===");

/* El catálogo sale en dos sitios: entero en catalogo.html y debajo del
   expositor en la portada. Si a una de las dos le falta un hueco, se
   queda a medias sin que falle nada. Por eso se mira aquí. */
const fs = require("fs");

["catalogo.html", "index.html"].forEach(function (nombre) {
  const pagina = fs.readFileSync(__dirname + "/../" + nombre, "utf8");

  [
    ["css/catalogo.css", "carga su hoja de estilos"],
    ["cli-muro-catalogo", "su muro lleva la clase que la activa"],
    ['id="cli-catalogo-caja"', "tiene la caja de dos columnas"],
    ['id="cli-filtros"', "tiene el hueco de los filtros"],
    ['id="cli-limpiar"', "tiene el botón de quitar filtros"],
    ['id="cli-ocultar-filtros"', "tiene el botón de ocultar filtros"],
    ['id="cli-orden"', "tiene el selector de orden"],
    ['id="cli-cuenta-catalogo"', "tiene el recuento"],
    ['id="cli-rejilla-catalogo"', "tiene el hueco de las tarjetas"],
    ["js/piezas.js", "carga piezas.js, que es lo que dibuja"],
    ["js/catalogo.js", "carga catalogo.js, que es lo que filtra"]
  ].forEach(function (par) {
    comprobar(nombre + ": " + par[1], pagina.includes(par[0]));
  });
});

// La portada carga los dos guiones de pantalla a la vez, asi que no pueden
// llamarse igual los dos: el segundo se comeria al primero.
const portada = fs.readFileSync(__dirname + "/../index.html", "utf8");
comprobar("la portada carga también escaparate.js", portada.includes("js/escaparate.js"));
comprobar("y las dos funciones de arranque tienen nombres distintos",
  fs.readFileSync(__dirname + "/../js/escaparate.js", "utf8").includes("function iniciarPortada(")
  && fs.readFileSync(__dirname + "/../js/catalogo.js", "utf8").includes("function iniciarCatalogo("));

console.log("\n" + (fallos === 0 ? "CATÁLOGO CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
