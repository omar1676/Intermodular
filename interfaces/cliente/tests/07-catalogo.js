/* Catálogo comercial: las tarjetas y el filtro por colección */

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

coleccionElegida = "";
pintarCatalogo(CATALOGO_DEMO);
const html = __nodos["cli-rejilla-catalogo"].innerHTML;

console.log("=== UNA TARJETA POR ZAPATILLA ===");

const tarjetas = (html.match(/class="cli-tarjeta[ "]/g) || []).length;
comprobar("dibuja una tarjeta por acabado", tarjetas === TODAS.length, tarjetas);

// Cada tarjeta lleva el modelo y el indice de color que la ficha necesita
const parejas = [];
html.replace(/data-modelo="(\d+)"\s+data-color="(\d+)"/g, function (m, modelo, color) {
  parejas.push(modelo + "-" + color);
  return m;
});

comprobar("todas llevan modelo y color", parejas.length === tarjetas, parejas.length);
comprobar("ninguna pareja repetida", new Set(parejas).size === tarjetas, new Set(parejas).size);

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
pintarTarjetas(aparte, TODAS);
comprobar("dibuja lo mismo que pintarTarjetas, sin copiar nada",
  aparte.innerHTML === html, aparte.innerHTML.length + " vs " + html.length + " caracteres");

console.log("\n=== LO QUE ENSEÑA LA TARJETA ===");

comprobar("la marca va separada del modelo",
  (html.match(/cli-tarjeta-marca">NOVA</g) || []).length === tarjetas);

comprobar("y el nombre va sin la marca delante",
  CATALOGO_DEMO.every(function (m) {
    return html.includes('cli-tarjeta-nombre">' + m.nombre.replace("NOVA ", "") + "<");
  }));

comprobar("aparecen todos los acabados",
  TODAS.every(function (p) {
    return html.includes('cli-tarjeta-color">' + p.variante.color + "<");
  }));

comprobar("sin undefined ni NaN", !/undefined|NaN/.test(html));

console.log("\n=== PRECIOS ===");

CATALOGO_DEMO.forEach(function (modelo) {
  const precio = formatearPrecio(precioFinal(modelo, modelo.variantes[0]));
  comprobar("precio de " + modelo.nombre + " (" + precio + ")", html.includes(precio));
});

console.log("\n=== LOS AVISOS SALEN DE LOS DATOS ===");

/* Los tres avisos tienen que cuadrar con lo que dice el catálogo. Las
   cuentas se hacen aquí aparte, a mano, para que una prueba que mira el
   HTML no se apoye en la misma función que lo escribió. */
function tallasConStock(variante) {
  return variante.tallas.filter(function (t) { return t.stock > 0; }).length;
}

const sinNada = TODAS.filter(function (p) { return tallasConStock(p.variante) === 0; });
const ultimas = TODAS.filter(function (p) {
  const q = tallasConStock(p.variante);
  return q > 0 && q <= 3;
});
const novedades = TODAS.filter(function (p) {
  return tallasConStock(p.variante) > 3 && p.modelo.destacado;
});

function cuenta(clase) {
  return (html.match(new RegExp(clase, "g")) || []).length;
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

console.log("\n=== EL FILTRO POR COLECCIÓN ===");

comprobar("hay un botón por colección y uno de 'Todas'",
  (function () {
    pintarFiltros();
    const barra = __nodos["cli-filtros"].innerHTML;
    return (barra.match(/class="cli-filtro"/g) || []).length === COLECCIONES.length + 1;
  })());

COLECCIONES.forEach(function (coleccion) {
  coleccionElegida = coleccion.clave;
  pintarCatalogo(CATALOGO_DEMO);

  const parcial = __nodos["cli-rejilla-catalogo"].innerHTML;
  const dibujadas = (parcial.match(/class="cli-tarjeta[ "]/g) || []).length;
  const deEsaColeccion = TODAS.filter(function (p) {
    return p.modelo.coleccion === coleccion.clave;
  });

  comprobar(coleccion.nombre + ": " + deEsaColeccion.length + " zapatillas",
    dibujadas === deEsaColeccion.length && deEsaColeccion.length > 0, dibujadas);

  comprobar(coleccion.nombre + ": ninguna de otra colección",
    deEsaColeccion.every(function (p) {
      return parcial.includes('data-modelo="' + p.modelo.id_modelo + '"');
    }) && dibujadas === deEsaColeccion.length);

  comprobar(coleccion.nombre + ": el recuento lo dice bien",
    __nodos["cli-cuenta-catalogo"].textContent ===
      deEsaColeccion.length + " zapatillas · " + coleccion.nombre,
    __nodos["cli-cuenta-catalogo"].textContent);

  comprobar(coleccion.nombre + ": su botón queda marcado",
    (function () {
      pintarFiltros();
      return __nodos["cli-filtros"].innerHTML.includes(
        'data-coleccion="' + coleccion.clave + '" aria-pressed="true"');
    })());
});

comprobar("las colecciones suman el catálogo entero",
  COLECCIONES.reduce(function (total, c) {
    return total + TODAS.filter(function (p) { return p.modelo.coleccion === c.clave; }).length;
  }, 0) === TODAS.length);

coleccionElegida = "";
pintarCatalogo(CATALOGO_DEMO);

comprobar("'Todas' devuelve el catálogo completo",
  (__nodos["cli-rejilla-catalogo"].innerHTML.match(/class="cli-tarjeta[ "]/g) || []).length
    === TODAS.length);

comprobar("y el recuento vuelve a ser el total",
  __nodos["cli-cuenta-catalogo"].textContent === TODAS.length + " zapatillas",
  __nodos["cli-cuenta-catalogo"].textContent);

console.log("\n=== ESTADO DE LA PÁGINA ===");

comprobar("la rejilla deja de estar en 'cargando'",
  __nodos["cli-rejilla-catalogo"].className === "cli-tarjetas",
  __nodos["cli-rejilla-catalogo"].className);

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

console.log("\n=== LAS DOS PÁGINAS ESTÁN BIEN CABLEADAS ===");

/* El catálogo sale en dos sitios: entero en catalogo.html y debajo del
   expositor en la portada. Si a una de las dos le falta la hoja, la clase
   o el script, se queda a medias sin que falle nada. Por eso se mira aquí. */
const fs = require("fs");

[["catalogo.html", "h1"], ["index.html", "h2"]].forEach(function (par) {
  const pagina = fs.readFileSync(__dirname + "/../" + par[0], "utf8");

  comprobar(par[0] + ": carga css/catalogo.css", pagina.includes("css/catalogo.css"));
  comprobar(par[0] + ": su muro lleva cli-muro-catalogo", pagina.includes("cli-muro-catalogo"));
  comprobar(par[0] + ": tiene el hueco de las tarjetas", pagina.includes('id="cli-rejilla-catalogo"'));
  comprobar(par[0] + ": tiene la barra de filtros", pagina.includes('id="cli-filtros"'));
  comprobar(par[0] + ": carga piezas.js, que es lo que dibuja", pagina.includes("js/piezas.js"));
  comprobar(par[0] + ": carga catalogo.js, que es lo que filtra", pagina.includes("js/catalogo.js"));
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
