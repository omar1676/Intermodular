/* NOVA Sneakers · NOVA Fit · Omar */

/* NOVA Fit ordena el catálogo según tres cosas que dice el usuario:
   altura, peso y tono de piel. No es inteligencia artificial ni hay
   ninguna llamada a internet: son cuatro reglas de aritmética escritas
   aquí abajo, y se pueden leer enteras en dos minutos.

   Tres límites que el código respeta a propósito:

   1. NO se deduce la talla de calzado. La altura y el peso solo mueven
      la proporción de zapatilla que se propone, que es una sugerencia
      de estilo.
   2. NO se dice nada del cuerpo de nadie. Los textos hablan de la
      zapatilla, no de quien la mira.
   3. NO se descarta ninguna zapatilla por el tono de piel. El tono
      solo ORDENA; las cien siguen estando en el catálogo y hay un
      enlace para verlas todas.

   Los datos no se guardan ni se envían: viven en estas tres variables
   mientras la pestaña está abierta y se van al cerrarla. */

const TONOS = [
  { clave: "t1", nombre: "Tono 1", hex: "#f3dcc8" },
  { clave: "t2", nombre: "Tono 2", hex: "#e8c4a0" },
  { clave: "t3", nombre: "Tono 3", hex: "#cfa17a" },
  { clave: "t4", nombre: "Tono 4", hex: "#a9734e" },
  { clave: "t5", nombre: "Tono 5", hex: "#73482f" },
  { clave: "t6", nombre: "Tono 6", hex: "#432a1e" }
];

const CUANTAS_RECOMENDACIONES = 4;

/* Lo que ha dicho el usuario. Solo vive aquí, en memoria. */
let tonoElegido = "";

/* Utilidades de color */

function canales(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

// Lo clara que es una color, de 0 a 1. Los pesos son los de siempre:
// el ojo ve mucho más el verde que el azul.
function claridad(hex) {
  const c = canales(hex);
  return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) / 255;
}

// Si tira a cálido (positivo) o a frío (negativo), de -1 a 1
function calidez(hex) {
  const c = canales(hex);
  return (c.r - c.b) / 255;
}

/* La proporción: el ancho de la foto entre su alto. Cuanto más baja, más
   alta es la zapatilla (caña alta o suela gruesa). Sale de medir el
   archivo, no de clasificar las cien a mano. */
function proporcionDe(modelo) {
  return ANCHO_FOTO / modelo.alto_foto;
}

/* La proporción que se le propone a quien ha escrito su altura y su peso.

   Es una sugerencia de estilo, no una medida de nada: con más estatura
   una zapatilla con cuerpo se ve proporcionada, y con menos un perfil
   bajo alarga la línea. El peso mueve un poco el objetivo hacia las de
   suela más gruesa, que son las que llevan más amortiguación.

   Los números de abajo son los que hacen que 155 cm caiga en la
   zapatilla más plana del catálogo (2,59) y 200 cm en la más alta
   (1,64). No salen de ningún estudio: son el reparto del catálogo. */
function proporcionObjetivo(altura, peso) {
  const objetivo = 2.45 - (altura - 155) * 0.012 - (peso - 50) * 0.004;

  return Math.min(2.60, Math.max(1.70, objetivo));
}

/* La puntuación de una zapatilla. Tres sumandos, ninguno puede restar
   hasta sacar a nadie de la lista. */

// Hasta 40 puntos: cuanto más se acerque a la proporción propuesta
function puntosProporcion(modelo, objetivo) {
  const distancia = Math.abs(proporcionDe(modelo) - objetivo);

  return Math.max(0, 40 - distancia * 55);
}

// Hasta 30 puntos: cuanto más se distinga del tono de piel elegido
function puntosContraste(variante, tono) {
  const diferencia = Math.abs(claridad(variante.hex) - claridad(tono.hex));

  return Math.min(30, diferencia * 38);
}

// Hasta 20 puntos: si la zapatilla va en la misma gama, cálida o fría
function puntosGama(variante, tono) {
  const diferencia = Math.abs(calidez(variante.hex) - calidez(tono.hex));

  return Math.max(0, 20 - diferencia * 70);
}

function puntuar(pieza, altura, peso, tono) {
  const objetivo = proporcionObjetivo(altura, peso);

  return puntosProporcion(pieza.modelo, objetivo)
    + puntosContraste(pieza.variante, tono)
    + puntosGama(pieza.variante, tono)
    + (pieza.modelo.destacado ? 5 : 0);
}

/* Por qué sale esta zapatilla. Una frase, hecha de los dos motivos que
   más han pesado. Habla de la zapatilla, nunca de quien la lleva. */
function motivo(pieza, altura, peso, tono) {
  const objetivo = proporcionObjetivo(altura, peso);
  const proporcion = proporcionDe(pieza.modelo);
  const partes = [];

  if (proporcion < objetivo - 0.12) {
    partes.push("tiene más cuerpo del que buscabas, y aun así encaja");
  } else if (proporcion > objetivo + 0.12) {
    partes.push("es más plana de lo que buscabas, y aun así encaja");
  } else if (objetivo < 2.05) {
    partes.push("suela con cuerpo, la proporción que te proponemos");
  } else {
    partes.push("perfil bajo y línea larga, la proporción que te proponemos");
  }

  if (puntosContraste(pieza.variante, tono) > 20) {
    partes.push("y su color se distingue bien del tono que has elegido");
  } else if (puntosGama(pieza.variante, tono) > 13) {
    partes.push("y va en la misma gama de color que el tono que has elegido");
  } else {
    partes.push("y es un color tranquilo, que combina con casi todo");
  }

  const frase = partes.join(", ");

  return frase.charAt(0).toUpperCase() + frase.slice(1) + ".";
}

/* La recomendación */

function recomendar(modelos, altura, peso, tono) {
  // Fuera las que no se pueden comprar: recomendar algo agotado es
  // hacerle perder el tiempo a quien lo lee
  const posibles = piezasDelCatalogo(modelos).filter(function (pieza) {
    return !colorSinExistencias(pieza.variante);
  });

  const puntuadas = posibles.map(function (pieza) {
    return { pieza: pieza, puntos: puntuar(pieza, altura, peso, tono) };
  });

  puntuadas.sort(function (a, b) {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }

    // Empate: manda el orden del catálogo, para que no salga al azar
    return a.pieza.modelo.id_modelo - b.pieza.modelo.id_modelo;
  });

  return puntuadas.slice(0, CUANTAS_RECOMENDACIONES).map(function (x) {
    return x.pieza;
  });
}

/* Dibujado */

function pintarTonos() {
  const caja = document.getElementById("cli-tonos");

  if (!caja) {
    return;
  }

  caja.innerHTML = TONOS.map(function (tono) {
    const activo = tono.clave === tonoElegido;

    return '<button class="cli-tono' + (activo ? " cli-activo" : "") + '" type="button"' +
      ' data-tono="' + tono.clave + '"' +
      ' aria-pressed="' + activo + '"' +
      ' title="' + textoSeguro(tono.nombre) + '">' +
      '<span class="cli-tono-muestra" style="background: ' + tono.hex + '"></span>' +
      '<span class="cli-tono-nombre">' + textoSeguro(tono.nombre) + "</span></button>";
  }).join("");
}

function tarjetaFitHtml(pieza, altura, peso, tono, posicion) {
  const modelo = pieza.modelo;
  const variante = pieza.variante;
  const foto = fotoVariante(variante);

  const imagen = foto
    ? '<img class="zap" src="' + textoSeguro(foto) + '" alt="" aria-hidden="true"' +
      ' loading="lazy" decoding="async" data-respaldo="' + variante.id_variante + '">'
    : dibujoPorVariante(variante.id_variante);

  return '<li class="cli-fit-tarjeta" style="animation-delay: ' +
    (posicion * 0.07).toFixed(2) + 's">' +
    '<span class="cli-fit-foto">' + imagen + "</span>" +
    '<h3 class="cli-fit-nombre">' + textoSeguro(modelo.nombre) + "</h3>" +
    '<p class="cli-fit-color">' + textoSeguro(nombreDeColeccion(modelo.coleccion)) +
      " · " + textoSeguro(variante.color) + "</p>" +
    '<p class="cli-fit-precio">' + formatearPrecio(precioFinal(modelo, variante)) + "</p>" +
    '<p class="cli-fit-motivo">' + textoSeguro(motivo(pieza, altura, peso, tono)) + "</p>" +
    '<a class="cli-boton-sec" href="producto.html?modelo=' + modelo.id_modelo +
      "&color=" + pieza.indice + '">Ver la ficha</a></li>';
}

function pintarResultados(modelos, altura, peso, tono) {
  const caja = document.getElementById("cli-fit-resultados");
  const piezas = recomendar(modelos, altura, peso, tono);

  caja.innerHTML = piezas.map(function (pieza, i) {
    return tarjetaFitHtml(pieza, altura, peso, tono, i);
  }).join("");

  caja.className = "cli-fit-lista";
  respaldoDeFotos(caja, dibujoPorVariante);

  const titulo = document.getElementById("cli-fit-titulo-resultados");

  if (titulo) {
    titulo.textContent = piezas.length + " modelos para " + altura + " cm y " +
      peso + " kg, con el " + tono.nombre.toLowerCase();
  }

  const zona = document.getElementById("cli-fit-salida");

  if (zona) {
    zona.hidden = false;
  }
}

/* Lo que escribe el usuario, comprobado antes de usarlo */

function leerNumero(id, minimo, maximo) {
  const campo = document.getElementById(id);
  const valor = Number(campo.value);

  if (!campo.value.trim() || !isFinite(valor) || valor < minimo || valor > maximo) {
    return null;
  }

  return Math.round(valor);
}

function avisar(texto) {
  const aviso = document.getElementById("cli-fit-aviso");

  if (aviso) {
    aviso.textContent = texto;
  }
}

function buscarModelo(modelos) {
  const altura = leerNumero("cli-altura", 120, 230);
  const peso = leerNumero("cli-peso", 30, 200);
  const tono = TONOS.find(function (t) { return t.clave === tonoElegido; });

  if (altura === null) {
    avisar("Escribe tu altura en centímetros, entre 120 y 230.");
    return;
  }

  if (peso === null) {
    avisar("Escribe tu peso en kilogramos, entre 30 y 200.");
    return;
  }

  if (!tono) {
    avisar("Elige uno de los seis tonos.");
    return;
  }

  avisar("");
  pintarResultados(modelos, altura, peso, tono);
}

/* Arranque */

function iniciarNovaFit() {
  const caja = document.getElementById("cli-fit-resultados");

  if (!caja) {
    return;
  }

  const modelos = catalogoParaPintar(caja);

  if (!modelos) {
    return;
  }

  caja.innerHTML = "";
  pintarTonos();

  document.getElementById("cli-tonos").addEventListener("click", function (evento) {
    const boton = evento.target.closest(".cli-tono");

    if (!boton) {
      return;
    }

    tonoElegido = boton.dataset.tono;
    pintarTonos();
    avisar("");
  });

  document.getElementById("cli-fit-buscar").addEventListener("click", function () {
    buscarModelo(modelos);
  });

  // Enter en cualquiera de los dos campos hace lo mismo que el botón
  document.getElementById("cli-fit-formulario").addEventListener("submit", function (evento) {
    evento.preventDefault();
    buscarModelo(modelos);
  });
}

iniciarNovaFit();
