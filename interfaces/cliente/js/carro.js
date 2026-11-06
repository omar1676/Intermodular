/*
 * NOVA Sneakers - Carrito de demostración · Omar
 *
 * El carrito se guarda en localStorage, que es almacenamiento del propio
 * navegador. NO es una base de datos: no hay servidor, nadie más lo ve y
 * se borra al limpiar los datos del navegador. En la web se avisa de esto.
 *
 * Decisión importante que podemos defender en clase: en el carrito solo
 * se guardan el SKU y la cantidad. Ni nombres ni precios. Cada vez que se
 * dibuja el carrito, el precio se vuelve a calcular desde el catálogo, así
 * que es imposible que un precio guardado quede desfasado o manipulado.
 */

const CARRO_CLAVE = "nova_carrito_demo";
const CARRO_MAX_POR_LINEA = 5;

// Lee el carrito. Si no hay nada o está corrupto, devuelve lista vacía.
function carroLeer() {
  try {
    const bruto = localStorage.getItem(CARRO_CLAVE);
    const datos = bruto ? JSON.parse(bruto) : [];

    if (!Array.isArray(datos)) {
      return [];
    }

    // Nos quedamos solo con las líneas que tienen la forma correcta
    return datos.filter(function (linea) {
      return linea
        && typeof linea.sku === "string"
        && Number.isInteger(linea.cantidad)
        && linea.cantidad > 0;
    });

  } catch (error) {
    // Modo incógnito o almacenamiento bloqueado: seguimos sin carrito
    return [];
  }
}

function carroGuardar(lineas) {
  try {
    localStorage.setItem(CARRO_CLAVE, JSON.stringify(lineas));
  } catch (error) {
    console.warn("No se ha podido guardar el carrito en este navegador.");
  }

  pintarContadorCarro();
}

/*
 * Máximo que se puede llevar de un SKU: nunca más de lo que queda en el
 * catálogo ficticio y nunca más del tope por línea. Si está agotado
 * devuelve 0, que es la forma de decir "esto no se puede añadir".
 */
function carroTope(sku) {
  const encontrado = buscarSku(sku);

  // Si el SKU no existe, no se puede llevar nada de él
  if (!encontrado) {
    return 0;
  }

  return Math.min(encontrado.talla.stock, CARRO_MAX_POR_LINEA);
}

// Añade unidades de un SKU. Si ya estaba, suma sin pasar del tope.
// Devuelve true si ha añadido algo.
function carroAnadir(sku, cantidad) {
  const tope = carroTope(sku);

  // Agotado o inexistente: no se añade
  if (tope <= 0) {
    return false;
  }

  const lineas = carroLeer();
  const existente = lineas.find(function (l) { return l.sku === sku; });

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, tope);
  } else {
    lineas.push({ sku: sku, cantidad: Math.min(cantidad, tope) });
  }

  carroGuardar(lineas);
  return true;
}

function carroCambiarCantidad(sku, cantidad) {
  const lineas = carroLeer();
  const linea = lineas.find(function (l) { return l.sku === sku; });

  if (!linea) {
    return;
  }

  const tope = carroTope(sku);

  // Si baja de uno, o el producto se ha agotado, la línea desaparece
  if (cantidad <= 0 || tope <= 0) {
    carroQuitar(sku);
    return;
  }

  linea.cantidad = Math.min(cantidad, tope);
  carroGuardar(lineas);
}

function carroQuitar(sku) {
  const lineas = carroLeer().filter(function (l) { return l.sku !== sku; });
  carroGuardar(lineas);
}

function carroVaciar() {
  carroGuardar([]);
}

// Unidades totales, para el contador de la cabecera
function carroUnidades() {
  return carroLeer().reduce(function (suma, linea) {
    return suma + linea.cantidad;
  }, 0);
}

// Importe total, recalculado desde el catálogo
function carroTotal() {
  return carroLeer().reduce(function (suma, linea) {
    const encontrado = buscarSku(linea.sku);

    if (!encontrado) {
      return suma;
    }

    return suma + precioFinal(encontrado.modelo, encontrado.variante) * linea.cantidad;
  }, 0);
}

// Pone el número de unidades en el globo dorado de la cabecera
function pintarContadorCarro() {
  const unidades = carroUnidades();
  const globos = document.querySelectorAll("[data-contador-carro]");

  globos.forEach(function (globo) {
    globo.textContent = unidades;
    globo.classList.toggle("cli-visible", unidades > 0);
  });
}

// Cada página llama a esto al cargar
document.addEventListener("DOMContentLoaded", pintarContadorCarro);
