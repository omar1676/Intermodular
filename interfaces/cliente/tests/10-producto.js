/* La ficha de la zapatilla y su visor */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "producto.js"
]);

let fallos = 0;
function comprobar(nombre, condicion, detalle) {
  console.log((condicion ? "  OK    " : "  FALLO ") + nombre +
    (detalle !== undefined ? "  -> " + detalle : ""));
  if (!condicion) fallos++;
}

/* producto.js se arranca solo al cargarse y, sin "?modelo=" en la
   dirección, deja la página en el aviso de que no hay zapatilla. Para
   probar el resto hay que ponerle un modelo a mano. */
modeloActual = API.modelo(2);
indiceVariante = 0;
pintarEstructura();
pintarZapatilla();

console.log("=== LA FICHA SE MONTA ENTERA ===");

const detalle = __nodos["cli-detalle"].innerHTML;

[
  ['id="cli-escena"', "el hueco de la zapatilla"],
  ['id="cli-visor-menos"', "el botón de alejar"],
  ['id="cli-visor-mas"', "el botón de acercar"],
  ['id="cli-visor-nivel"', "el nivel de zoom"],
  ['id="cli-visor-reiniciar"', "el botón de restablecer"],
  ['id="cli-colores"', "los colores"],
  ['id="cli-tallas"', "las tallas"],
  ['id="cli-anadir"', "el botón de añadir al carrito"]
].forEach(function (par) {
  comprobar("tiene " + par[1], detalle.includes(par[0]));
});

comprobar("la zapatilla va antes que lo que hay que elegir",
  detalle.indexOf('id="cli-escena"') < detalle.indexOf('id="cli-tallas"'));

comprobar("y los mandos del visor van entre medias",
  detalle.indexOf('id="cli-escena"') < detalle.indexOf('id="cli-visor-mas"') &&
  detalle.indexOf('id="cli-visor-mas"') < detalle.indexOf('id="cli-tallas"'));

console.log("\n=== LA FOTO VA EN SU PROPIA CAJA ===");

const escena = __nodos["cli-escena"].innerHTML;

comprobar("la imagen está envuelta en la caja del visor",
  escena.includes('id="cli-visor-caja"') && escena.includes('class="zap"'));

comprobar("y la caja envuelve a la imagen, no al revés",
  escena.indexOf("cli-visor-caja") < escena.indexOf('class="zap"'));

comprobar("la imagen lleva texto alternativo de verdad",
  /alt="Zapatilla NOVA Origin Hueso"/.test(escena), escena.slice(0, 120));

console.log("\n=== EL CÁLCULO DEL VISOR ===");

const quieto = transformacionVisor(1, 0, 0);

comprobar("en reposo no gira nada", /rotateX\(-?0\.00deg\) rotateY\(0\.00deg\)/.test(quieto), quieto);
comprobar("en reposo no se desplaza", /translate\(-?0\.0px, -?0\.0px\)/.test(quieto), quieto);
comprobar("en reposo la escala es 1", /scale\(1\)/.test(quieto));
comprobar("siempre lleva perspectiva", quieto.indexOf("perspective(1100px)") === 0);

const derecha = transformacionVisor(1, 0.5, 0);
const izquierda = transformacionVisor(1, -0.5, 0);

comprobar("el puntero a la derecha gira hacia un lado",
  derecha.includes("rotateY(14.00deg)"), derecha);
comprobar("y a la izquierda, hacia el otro",
  izquierda.includes("rotateY(-14.00deg)"), izquierda);

comprobar("arriba y abajo giran lo suyo, y menos",
  transformacionVisor(1, 0, 0.5).includes("rotateX(-8.00deg)") &&
  transformacionVisor(1, 0, -0.5).includes("rotateX(8.00deg)"));

comprobar("el giro nunca pasa de 14 y 8 grados",
  (function () {
    for (let x = -0.5; x <= 0.5; x += 0.05) {
      for (let y = -0.5; y <= 0.5; y += 0.05) {
        const t = transformacionVisor(2, x, y);
        const gy = Number(/rotateY\((-?[\d.]+)deg\)/.exec(t)[1]);
        const gx = Number(/rotateX\((-?[\d.]+)deg\)/.exec(t)[1]);
        if (Math.abs(gy) > VISOR_GIRO_LADO + 0.01) return false;
        if (Math.abs(gx) > VISOR_GIRO_ALTO + 0.01) return false;
      }
    }
    return true;
  })());

console.log("\n=== EL DESPLAZAMIENTO SOLO EXISTE AL ACERCAR ===");

comprobar("a tamaño normal no se mueve, esté donde esté el puntero",
  [-0.5, -0.2, 0, 0.3, 0.5].every(function (x) {
    return /translate\(-?0\.0px, -?0\.0px\)/.test(transformacionVisor(1, x, x));
  }));

comprobar("acercada sí se mueve", !/translate\(-?0\.0px, -?0\.0px\)/.test(
  transformacionVisor(2, 0.4, 0.4)), transformacionVisor(2, 0.4, 0.4));

comprobar("y cuanto más acercada, más se mueve",
  (function () {
    const dos = Math.abs(Number(/translate\((-?[\d.]+)px/.exec(transformacionVisor(2, 0.5, 0))[1]));
    const dosMedio = Math.abs(Number(/translate\((-?[\d.]+)px/.exec(transformacionVisor(2.5, 0.5, 0))[1]));
    return dosMedio > dos;
  })());

comprobar("se mueve al contrario que el puntero, como una lupa",
  Number(/translate\((-?[\d.]+)px/.exec(transformacionVisor(2, 0.5, 0))[1]) < 0);

console.log("\n=== EL ZOOM NO SE SALE DE SU RANGO ===");

comprobar("no baja de 1", zoomAjustado(0.2) === VISOR_ZOOM_MIN, zoomAjustado(0.2));
comprobar("no sube de 2,5", zoomAjustado(9) === VISOR_ZOOM_MAX, zoomAjustado(9));
comprobar("deja los valores de en medio", zoomAjustado(1.5) === 1.5);

reiniciarVisor();
comprobar("empieza en 1", visorZoom === 1, visorZoom);

let topes = 0;
for (let i = 0; i < 20; i++) { cambiarZoom(VISOR_PASO); }
if (visorZoom !== VISOR_ZOOM_MAX) { topes++; }
for (let i = 0; i < 20; i++) { cambiarZoom(-VISOR_PASO); }
if (visorZoom !== VISOR_ZOOM_MIN) { topes++; }

comprobar("pulsar veinte veces no lo rompe por ningún lado", topes === 0, visorZoom);

cambiarZoom(VISOR_PASO);
comprobar("un paso lo deja en 1,5", visorZoom === 1.5, visorZoom);
comprobar("y el rótulo lo dice en castellano",
  __nodos["cli-visor-nivel"].textContent === "1,5×",
  __nodos["cli-visor-nivel"].textContent);

comprobar("al llegar al tope se apaga el botón de acercar",
  (function () {
    reiniciarVisor();
    for (let i = 0; i < 5; i++) { cambiarZoom(VISOR_PASO); }
    return __nodos["cli-visor-mas"].disabled === true &&
           __nodos["cli-visor-menos"].disabled === false;
  })());

comprobar("y abajo del todo, el de alejar",
  (function () {
    reiniciarVisor();
    return __nodos["cli-visor-menos"].disabled === true &&
           __nodos["cli-visor-mas"].disabled === false;
  })());

console.log("\n=== RESTABLECER ===");

visorZoom = 2.5;
visorX = 0.4;
visorY = -0.3;
pintarVisor();
const torcida = __nodos["cli-visor-caja"].style.transform;

reiniciarVisor();
comprobar("deja el zoom en 1", visorZoom === 1, visorZoom);
comprobar("y la zapatilla recta", visorX === 0 && visorY === 0);
comprobar("la caja vuelve a la posición de reposo",
  __nodos["cli-visor-caja"].style.transform === transformacionVisor(1, 0, 0));
comprobar("que no es donde estaba", torcida !== __nodos["cli-visor-caja"].style.transform);

console.log("\n=== CAMBIAR DE COLOR REINICIA EL VISOR ===");

visorZoom = 2;
visorX = 0.5;
pintarZapatilla();
comprobar("al redibujar la zapatilla el zoom vuelve a 1", visorZoom === 1, visorZoom);
comprobar("y la inclinación se endereza", visorX === 0 && visorY === 0);

console.log("\n=== NO SE VENDE COMO UN GIRO DE 360 ===");

const fuente = require("fs").readFileSync(__dirname + "/../js/producto.js", "utf8");

comprobar("el aviso está en la propia página, no escondido",
  __nodos["cli-detalle"].innerHTML.includes("No es un giro completo"));

comprobar("y dice por qué: solo hay una fotografía",
  __nodos["cli-detalle"].innerHTML.includes("una") &&
  __nodos["cli-detalle"].innerHTML.includes("sola fotografía"));

/* Lo que importa es lo que lee el usuario, no los comentarios del
   código: ahí la palabra "360" aparece justo para decir que esto no lo
   es. Así que se mira la página dibujada. */
const loQueSeLee = __nodos["cli-detalle"].innerHTML;

comprobar("la página no promete un giro de 360", !/360/.test(loQueSeLee));
comprobar("ni lo llama 3D", !/\b3D\b/i.test(loQueSeLee));
comprobar("ni dice 'girar' ni 'rotar', que harían pensar en eso",
  !/\bgira\w*|\brota\w*/i.test(loQueSeLee.replace(/No es un giro completo/g, "")),
  loQueSeLee.length + " caracteres revisados");

// Y en el código, que se mencione 360 solo para negarlo
const menciones = (fuente.match(/[^\n]*360[^\n]*/g) || []);
comprobar("en el código, 360 solo sale para decir que no lo es",
  menciones.every(function (linea) { return /\bno es\b/i.test(linea); }),
  menciones.join(" | ") || "ninguna mención");

console.log("\n=== SIGUE FUNCIONANDO LO DE ANTES ===");

modeloActual = API.modelo(2);
indiceVariante = 0;
tallaElegida = null;
cantidad = 1;
pintarEstructura();
pintarZapatilla();
actualizar();

comprobar("sin talla elegida no se puede añadir",
  __nodos["cli-anadir"].disabled === true);

const conStock = varianteActual().tallas.find(function (t) { return t.stock > 0; });
tallaElegida = conStock.talla;
actualizar();

comprobar("con una talla con existencias sí",
  __nodos["cli-anadir"].disabled === false, conStock.talla);

comprobar("el precio es el del catálogo",
  __nodos["cli-precio"].textContent ===
    formatearPrecio(precioFinal(modeloActual, varianteActual())),
  __nodos["cli-precio"].textContent);

comprobar("las tallas dibujadas son las cinco del catálogo",
  (__nodos["cli-tallas"].innerHTML.match(/data-talla="\d+"/g) || []).length ===
    varianteActual().tallas.length);

comprobar("el nombre del color sale debajo del modelo",
  __nodos["cli-rotulo-color"].textContent === varianteActual().color,
  __nodos["cli-rotulo-color"].textContent);

console.log("\n" + (fallos === 0 ? "FICHA Y VISOR CORRECTOS" : fallos + " FALLOS"));
process.exit(fallos ? 1 : 0);
