/* NOVA Fit: la recomendación, y los límites que se puso a propósito */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "piezas.js",
  "nova-fit.js"
]);

let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK    " : "  FALLO ") + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

const TONO_CLARO = TONOS[0];
const TONO_OSCURO = TONOS[TONOS.length - 1];
const TODAS = piezasDelCatalogo(CATALOGO_DEMO);

console.log("=== LA PROPORCIÓN SALE DE LA FOTO ===");

comprobar("las cien zapatillas tienen el alto de su foto",
  CATALOGO_DEMO.every(function (m) { return typeof m.alto_foto === "number" && m.alto_foto > 0; }));

comprobar("el ancho de la foto es uno solo", ANCHO_FOTO === 440, ANCHO_FOTO);

const proporciones = CATALOGO_DEMO.map(proporcionDe);
comprobar("ninguna proporción absurda",
  proporciones.every(function (p) { return p > 1 && p < 4; }),
  Math.min.apply(null, proporciones).toFixed(2) + " a " + Math.max.apply(null, proporciones).toFixed(2));

comprobar("la más alta del catálogo es la de caña alta",
  proporcionDe(CATALOGO_DEMO.reduce(function (a, b) {
    return proporcionDe(a) < proporcionDe(b) ? a : b;
  })) < 1.7);

console.log("\n=== LA PROPORCIÓN QUE SE PROPONE ===");

comprobar("más altura propone más cuerpo",
  proporcionObjetivo(195, 70) < proporcionObjetivo(160, 70),
  proporcionObjetivo(160, 70).toFixed(2) + " -> " + proporcionObjetivo(195, 70).toFixed(2));

comprobar("más peso propone más amortiguación",
  proporcionObjetivo(175, 100) < proporcionObjetivo(175, 55),
  proporcionObjetivo(175, 55).toFixed(2) + " -> " + proporcionObjetivo(175, 100).toFixed(2));

comprobar("el objetivo nunca se sale del catálogo",
  [[120, 30], [230, 200], [175, 70], [155, 50], [200, 120]].every(function (par) {
    const o = proporcionObjetivo(par[0], par[1]);
    return o >= 1.70 && o <= 2.60;
  }));

comprobar("y pesa más la altura que el peso",
  Math.abs(proporcionObjetivo(185, 70) - proporcionObjetivo(165, 70)) >
  Math.abs(proporcionObjetivo(175, 90) - proporcionObjetivo(175, 70)));

console.log("\n=== LAS RECOMENDACIONES ===");

const r = recomendar(CATALOGO_DEMO, 175, 70, TONO_CLARO);

comprobar("devuelve entre tres y cinco", r.length >= 3 && r.length <= 5, r.length);
comprobar("son cuatro", r.length === CUANTAS_RECOMENDACIONES, r.length);
comprobar("ninguna repetida", new Set(r.map(function (p) { return p.modelo.id_modelo; })).size === r.length);

comprobar("ninguna agotada: recomendar lo que no se puede comprar no vale",
  r.every(function (p) { return !colorSinExistencias(p.variante); }));

/* Comprobarlo solo con el catálogo de hoy no vale: las dos agotadas que
   hay nunca llegan a las cuatro primeras, así que la prueba pasaría
   aunque el filtro no existiera. Se agota a propósito la que sale
   primera y se mira que desaparezca. */
const laPrimera = r[0];
const stockGuardado = laPrimera.variante.tallas.map(function (t) { return t.stock; });
laPrimera.variante.tallas.forEach(function (t) { t.stock = 0; });

const sinEsa = recomendar(CATALOGO_DEMO, 175, 70, TONO_CLARO);

comprobar("si la primera se agota, deja de recomendarse",
  !sinEsa.some(function (p) { return p.modelo.id_modelo === laPrimera.modelo.id_modelo; }),
  laPrimera.modelo.nombre + " -> " + sinEsa.map(function (p) { return p.modelo.nombre; }).join(", "));

comprobar("y entra otra en su sitio, siguen siendo cuatro",
  sinEsa.length === CUANTAS_RECOMENDACIONES, sinEsa.length);

laPrimera.variante.tallas.forEach(function (t, i) { t.stock = stockGuardado[i]; });

comprobar("el catálogo queda como estaba",
  !colorSinExistencias(laPrimera.variante));

// Y en todo el barrido tampoco se cuela ninguna agotada
let coladas = 0;
for (let altura = 150; altura <= 200; altura += 10) {
  for (let peso = 45; peso <= 110; peso += 15) {
    TONOS.forEach(function (t) {
      recomendar(CATALOGO_DEMO, altura, peso, t).forEach(function (p) {
        if (colorSinExistencias(p.variante)) { coladas++; }
      });
    });
  }
}

comprobar("ni en 216 combinaciones de altura, peso y tono", coladas === 0, coladas);

comprobar("todas salen del catálogo de verdad",
  r.every(function (p) {
    return CATALOGO_DEMO.indexOf(p.modelo) >= 0;
  }));

comprobar("el mismo dato da siempre el mismo resultado",
  recomendar(CATALOGO_DEMO, 175, 70, TONO_CLARO).map(function (p) { return p.modelo.id_modelo; }).join()
    === r.map(function (p) { return p.modelo.id_modelo; }).join(),
  r.map(function (p) { return p.modelo.nombre; }).join(", "));

const bajo = recomendar(CATALOGO_DEMO, 158, 52, TONO_CLARO);
const alto = recomendar(CATALOGO_DEMO, 196, 98, TONO_CLARO);

comprobar("cambiar la altura cambia lo que sale",
  bajo.map(function (p) { return p.modelo.id_modelo; }).join()
    !== alto.map(function (p) { return p.modelo.id_modelo; }).join(),
  "158 cm: " + bajo.map(function (p) { return p.modelo.nombre; }).join(", ") +
  "  |  196 cm: " + alto.map(function (p) { return p.modelo.nombre; }).join(", "));

const mediaBaja = bajo.reduce(function (s, p) { return s + proporcionDe(p.modelo); }, 0) / bajo.length;
const mediaAlta = alto.reduce(function (s, p) { return s + proporcionDe(p.modelo); }, 0) / alto.length;

comprobar("y en la dirección correcta: más estatura, zapatilla con más cuerpo",
  mediaAlta < mediaBaja, mediaBaja.toFixed(2) + " frente a " + mediaAlta.toFixed(2));

comprobar("cambiar el tono cambia lo que sale",
  recomendar(CATALOGO_DEMO, 175, 70, TONO_OSCURO).map(function (p) { return p.modelo.id_modelo; }).join()
    !== r.map(function (p) { return p.modelo.id_modelo; }).join());

console.log("\n=== LOS TRES LÍMITES QUE SE PUSO A PROPÓSITO ===");

/* 1. No se deduce la talla */

const fuente = require("fs").readFileSync(__dirname + "/../js/nova-fit.js", "utf8");

comprobar("el motor no mira ninguna talla",
  !/\.tallas/.test(fuente.replace(/colorSinExistencias/g, "")),
  "ninguna lectura de .tallas fuera de la comprobación de existencias");

comprobar("ninguna recomendación menciona una talla",
  r.every(function (p) {
    const texto = motivo(p, 175, 70, TONO_CLARO);
    return !/talla|n[uú]mero \d|\b4[0-9]\b/i.test(texto);
  }),
  r.map(function (p) { return motivo(p, 175, 70, TONO_CLARO); }).join(" / "));

/* 2. No se dice nada del cuerpo de nadie */

const PALABRAS_PROHIBIDAS = /\b(gordo|delgad|obes|sobrepeso|bajito|enano|complexi[oó]n|silueta de tu|tu cuerpo|tu figura|tu peso|tu constituci[oó]n|adelgaz|disimul)\w*/i;

let textos = [];
[[155, 45], [160, 95], [175, 70], [195, 60], [200, 130]].forEach(function (par) {
  TONOS.forEach(function (t) {
    recomendar(CATALOGO_DEMO, par[0], par[1], t).forEach(function (p) {
      textos.push(motivo(p, par[0], par[1], t));
    });
  });
});

comprobar("ningún texto juzga el cuerpo (" + textos.length + " frases revisadas)",
  textos.every(function (x) { return !PALABRAS_PROHIBIDAS.test(x); }),
  (textos.find(function (x) { return PALABRAS_PROHIBIDAS.test(x); }) || "todas limpias"));

comprobar("ningún texto habla en segunda persona del físico",
  textos.every(function (x) { return !/\beres\b|\btienes\b/i.test(x); }));

comprobar("todas las frases acaban en punto y empiezan en mayúscula",
  textos.every(function (x) { return /^[A-ZÁÉÍÓÚÑ]/.test(x) && x.endsWith("."); }));

/* 3. Ningún color queda descartado */

const vistas = new Set();
for (let altura = 150; altura <= 200; altura += 5) {
  for (let peso = 45; peso <= 110; peso += 5) {
    TONOS.forEach(function (t) {
      recomendar(CATALOGO_DEMO, altura, peso, t).forEach(function (p) {
        vistas.add(p.variante.color);
      });
    });
  }
}

comprobar("recorriendo alturas, pesos y tonos salen muchos colores distintos",
  vistas.size >= 12, vistas.size + " acabados distintos");

comprobar("ningún tono deja fuera un color por sistema: todos puntúan",
  TONOS.every(function (t) {
    return TODAS.every(function (p) {
      return puntosContraste(p.variante, t) >= 0 && puntosGama(p.variante, t) >= 0;
    });
  }));

comprobar("la puntuación nunca es negativa, así que nada queda excluido",
  TONOS.every(function (t) {
    return TODAS.every(function (p) { return puntuar(p, 175, 70, t) >= 0; });
  }));

comprobar("la página enlaza al catálogo entero",
  require("fs").readFileSync(__dirname + "/../nova-fit.html", "utf8")
    .includes('href="catalogo.html">las cien zapatillas'));

console.log("\n=== LOS DATOS NO SALEN DEL NAVEGADOR ===");

comprobar("no se guarda nada en localStorage",
  !/localStorage|sessionStorage/.test(fuente));
comprobar("no se envía nada a ningún sitio",
  !/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket/.test(fuente));
comprobar("no hay ninguna dirección de internet",
  !/https?:\/\//.test(fuente));
comprobar("y la página lo dice por escrito",
  require("fs").readFileSync(__dirname + "/../nova-fit.html", "utf8")
    .includes("no sale de este navegador"));

console.log("\n=== LO QUE SE ESCRIBE ===");

comprobar("se rechaza una altura imposible",
  (function () {
    document.getElementById("cli-altura").value = "9";
    return leerNumero("cli-altura", 120, 230) === null;
  })());

comprobar("se rechaza una altura vacía",
  (function () {
    document.getElementById("cli-altura").value = "   ";
    return leerNumero("cli-altura", 120, 230) === null;
  })());

comprobar("se rechaza lo que no es un número",
  (function () {
    document.getElementById("cli-altura").value = "ochenta";
    return leerNumero("cli-altura", 120, 230) === null;
  })());

comprobar("se acepta una altura normal",
  (function () {
    document.getElementById("cli-altura").value = "178";
    return leerNumero("cli-altura", 120, 230) === 178;
  })());

comprobar("y se redondea un decimal", (function () {
  document.getElementById("cli-peso").value = "70.6";
  return leerNumero("cli-peso", 30, 200) === 71;
})());

console.log("\n=== LA PANTALLA ===");

pintarTonos();
const tonos = __nodos["cli-tonos"].innerHTML;
comprobar("hay seis tonos", (tonos.match(/class="cli-tono[ "]/g) || []).length === 6,
  (tonos.match(/class="cli-tono[ "]/g) || []).length);
comprobar("cada uno lleva su color de muestra",
  TONOS.every(function (t) { return tonos.includes("background: " + t.hex); }));
comprobar("y dice cuál está elegido para quien no ve la pantalla",
  tonos.includes('aria-pressed="false"'));

tonoElegido = "t3";
pintarTonos();
comprobar("al elegir uno, se marca solo ese",
  (__nodos["cli-tonos"].innerHTML.match(/aria-pressed="true"/g) || []).length === 1);

pintarResultados(CATALOGO_DEMO, 175, 70, TONO_CLARO);
const salida = __nodos["cli-fit-resultados"].innerHTML;

comprobar("dibuja cuatro tarjetas",
  (salida.match(/class="cli-fit-tarjeta"/g) || []).length === 4,
  (salida.match(/class="cli-fit-tarjeta"/g) || []).length);
comprobar("cada una con su fotografía", (salida.match(/<img class="zap"/g) || []).length === 4);
comprobar("con nombre, precio y porqué",
  (salida.match(/cli-fit-nombre/g) || []).length === 4 &&
  (salida.match(/cli-fit-precio/g) || []).length === 4 &&
  (salida.match(/cli-fit-motivo/g) || []).length === 4);
comprobar("y con enlace a su ficha",
  (salida.match(/href="producto\.html\?modelo=\d+&color=\d+"/g) || []).length === 4);
comprobar("los precios llevan formato español", /\d,\d\d\s?€/.test(salida));
comprobar("sin undefined ni NaN", !/undefined|NaN/.test(salida));
comprobar("la zona de resultados se destapa", __nodos["cli-fit-salida"].hidden === false);
comprobar("y el título dice con qué datos se ha hecho",
  __nodos["cli-fit-titulo-resultados"].textContent.includes("175 cm") &&
  __nodos["cli-fit-titulo-resultados"].textContent.includes("70 kg"),
  __nodos["cli-fit-titulo-resultados"].textContent);

console.log("\n=== LA PÁGINA ESTÁ BIEN CABLEADA ===");

const pagina = require("fs").readFileSync(__dirname + "/../nova-fit.html", "utf8");

[
  ["css/nova-fit.css", "carga su hoja de estilos"],
  ["js/nova-fit.js", "carga su guion"],
  ["js/piezas.js", "carga piezas.js, que es de donde saca las fotos"],
  ["js/datos-demo.js", "y el catálogo, que no duplica"],
  ['id="cli-altura"', "tiene el campo de altura"],
  ['id="cli-peso"', "tiene el campo de peso"],
  ['id="cli-tonos"', "tiene el hueco de la paleta"],
  ['id="cli-fit-buscar"', "tiene el botón"],
  ['id="cli-fit-resultados"', "tiene el hueco de los resultados"],
  ["orientativas", "avisa de que es orientativo"]
].forEach(function (par) {
  comprobar("nova-fit.html " + par[1], pagina.includes(par[0]));
});

const menus = ["index.html", "catalogo.html", "producto.html", "carrito.html",
               "pedidos.html", "cuenta.html"];

comprobar("las seis páginas llevan NOVA Fit en el menú",
  menus.every(function (f) {
    return require("fs").readFileSync(__dirname + "/../" + f, "utf8").includes('href="nova-fit.html"');
  }));

comprobar("NOVA Fit no duplica el catálogo: lo lee de datos-demo.js",
  !/id_modelo:\s*\d|precio_base/.test(fuente));

console.log("\n" + (fallos === 0 ? "NOVA FIT CORRECTO" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
