/*
 * NOVA Sneakers - Catálogo de demostración · Omar
 *
 * Datos ficticios, inventados para la práctica. Están escritos con la
 * misma jerarquía que usamos en el proyecto:
 *
 *   modelos -> variantes (color) -> producto_sku (talla + sku) -> stock
 *
 * Los nombres, descripciones y precios coinciden con los del catálogo del
 * proyecto intermodular para que la demostración sea coherente.
 *
 * El precio final es precio_base + suplemento_precio: es un valor
 * calculado, nunca guardado, igual que en el modelo relacional.
 *
 * Los campos hex, hex2 y suela solo sirven para colorear la ilustración
 * SVG del escaparate.
 *
 * El modelo X-NOVA no aparece a propósito: es el concepto de fabricación
 * a medida y no tiene colores ni tallas de catálogo.
 */

// Genera las cinco tallas (40 a 44) de una variante, con 20 pares cada una.
// En "agotadas" se indican las tallas que queremos dejar sin stock, para
// que se vea en la web cómo aparece una talla no disponible.
function tallasDemo(idVariante, primerSku, agotadas) {
  const sinStock = agotadas || [];
  const tallas = [];

  for (let talla = 40; talla <= 44; talla++) {
    tallas.push({
      id_producto_sku: primerSku + (talla - 40),
      talla: talla,
      sku: "NOVA-" + idVariante + "-" + talla,
      activo: true,
      stock: sinStock.includes(talla) ? 0 : 20
    });
  }

  return tallas;
}

/*
 * FOTOGRAFÍAS
 *
 * Este es el ÚNICO sitio donde hay que tocar para poner fotos reales.
 *
 * Deja el archivo en interfaces/cliente/img/ y escribe aquí su nombre.
 * Lo que quede en blanco se dibuja en SVG, así que se pueden ir
 * añadiendo de una en una. Si el nombre está mal escrito o el archivo
 * no existe, la web lo detecta y dibuja la zapatilla en su lugar: no
 * aparece nunca el icono de imagen rota.
 *
 * Las fotos deberían ir todas de perfil y mirando al mismo lado, con el
 * fondo recortado (PNG o WebP con transparencia), para que se apoyen
 * bien sobre la repisa.
 */
const FOTOS = {
  1:  "",   // NOVA Origin · Blanco
  2:  "",   // NOVA Origin · Negro
  3:  "",   // NOVA Velocity · Rojo
  4:  "",   // NOVA Velocity · Azul
  5:  "",   // NOVA Eclipse · Negro
  6:  "",   // NOVA Eclipse · Gris
  7:  "",   // NOVA Archive · Blanco
  8:  "",   // NOVA Archive · Beige
  9:  "",   // NOVA Aura · Rosa
  10: "",   // NOVA Aura · Crema
  11: "",   // NOVA Pulse · Verde
  12: ""    // NOVA Pulse · Negro
};

const CATALOGO_DEMO = [
  {
    id_modelo: 1,
    nombre: "NOVA Origin",
    descripcion: "Estilo clásico y minimalista. La silueta más limpia de la casa, pensada para llevar todos los días sin pensar en combinarla.",
    precio_base: 79.99,
    activo: true,
    variantes: [
      {
        id_variante: 1, color: "Blanco", suplemento_precio: 0,
        hex: "#f2efe9", hex2: "#cdc7bb", suela: "#ffffff",
        tallas: tallasDemo(1, 1, [44])
      },
      {
        id_variante: 2, color: "Negro", suplemento_precio: 0,
        hex: "#2a2a30", hex2: "#15151a", suela: "#f1efe9",
        tallas: tallasDemo(2, 6)
      }
    ]
  },
  {
    id_modelo: 2,
    nombre: "NOVA Velocity",
    descripcion: "Diseñada para el movimiento. Mediasuela alta y ligera, con un panel lateral que sujeta el pie en los apoyos rápidos.",
    precio_base: 119.90,
    activo: true,
    variantes: [
      {
        id_variante: 3, color: "Rojo", suplemento_precio: 0,
        hex: "#d93b2b", hex2: "#8e1f16", suela: "#f1efe9",
        tallas: tallasDemo(3, 11, [40, 41])
      },
      {
        id_variante: 4, color: "Azul", suplemento_precio: 0,
        hex: "#2a66d6", hex2: "#153f88", suela: "#f1efe9",
        tallas: tallasDemo(4, 16)
      }
    ]
  },
  {
    id_modelo: 3,
    nombre: "NOVA Eclipse",
    descripcion: "Estilo urbano con contrastes. Acabado mate en el cuerpo y suela a tono, para que destaque la silueta y no el color.",
    precio_base: 129.99,
    activo: true,
    variantes: [
      {
        id_variante: 5, color: "Negro", suplemento_precio: 0,
        hex: "#23232a", hex2: "#0e0e12", suela: "#3a3a44",
        tallas: tallasDemo(5, 21, [42])
      },
      {
        id_variante: 6, color: "Gris", suplemento_precio: 0,
        hex: "#93939e", hex2: "#5d5d68", suela: "#e9e7e1",
        tallas: tallasDemo(6, 26)
      }
    ]
  },
  {
    id_modelo: 4,
    nombre: "NOVA Archive",
    descripcion: "Inspirada en la estética retro Y2K. Proporciones anchas, puntera reforzada y materiales con aire de principios de los dos mil.",
    precio_base: 109.90,
    activo: true,
    variantes: [
      {
        id_variante: 7, color: "Blanco", suplemento_precio: 0,
        hex: "#f5f2eb", hex2: "#d2ccbf", suela: "#e2dbc9",
        tallas: tallasDemo(7, 31)
      },
      {
        id_variante: 8, color: "Beige", suplemento_precio: 0,
        hex: "#dbc7a6", hex2: "#b09a75", suela: "#f1e9d8",
        tallas: tallasDemo(8, 36, [40])
      }
    ]
  },
  {
    id_modelo: 5,
    nombre: "NOVA Aura",
    descripcion: "Diseño ligero y contemporáneo. La más cómoda del catálogo: poco peso, mucho acolchado en el cuello y colores suaves.",
    precio_base: 99.99,
    activo: true,
    variantes: [
      {
        id_variante: 9, color: "Rosa", suplemento_precio: 0,
        hex: "#eaa3b7", hex2: "#c0758c", suela: "#ffffff",
        tallas: tallasDemo(9, 41)
      },
      {
        id_variante: 10, color: "Crema", suplemento_precio: 0,
        hex: "#f0e4d0", hex2: "#cdbb9e", suela: "#ffffff",
        tallas: tallasDemo(10, 46)
      }
    ]
  },
  {
    id_modelo: 6,
    nombre: "NOVA Pulse",
    descripcion: "Estilo técnico y futurista. Líneas marcadas y acabado brillante: es la que mejor recoge la luz cálida del escaparate.",
    precio_base: 114.90,
    activo: true,
    variantes: [
      {
        id_variante: 11, color: "Verde", suplemento_precio: 0,
        hex: "#44b074", hex2: "#23724a", suela: "#eceae4",
        tallas: tallasDemo(11, 51, [43, 44])
      },
      {
        // Este color está agotado entero, para que se vea cómo lo avisa la web
        id_variante: 12, color: "Negro", suplemento_precio: 0,
        hex: "#26262c", hex2: "#111115", suela: "#2f2f37",
        tallas: tallasDemo(12, 56, [40, 41, 42, 43, 44])
      }
    ]
  }
];
