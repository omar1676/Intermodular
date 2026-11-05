/*
 * NOVA Sneakers - Catálogo de demostración (solo fase 2)
 *
 * Estos datos reproducen la MISMA FORMA que devolverá el backend
 * (interfaces/cliente-api) cuando lea PostgreSQL en la fase 5.
 * Los valores están copiados de acceso-datos/sql/05_datos_prueba.sql
 * para que el escaparate se vea con el catálogo real del proyecto.
 *
 * Jerarquía, igual que en la base de datos:
 *   modelos -> variantes (color) -> producto_sku (talla + sku) -> existencias
 *
 * Precio final = precio_base + suplemento_precio  (atributo derivado,
 * nunca almacenado; ver acceso-datos/documentacion/modelo_relacional.md)
 *
 * El modelo X-NOVA (12.000 €) NO aparece aquí a propósito: en la base de
 * datos no tiene variantes ni tallas, porque se fabrica a medida mediante
 * la tabla configuraciones_xnova.
 *
 * Los campos hex, hex2 y suela NO existen en la base de datos: solo sirven
 * para colorear la ilustración SVG del escaparate.
 */

// Genera las cinco tallas de una variante, igual que hace el CROSS JOIN
// generate_series(40, 44) de 05_datos_prueba.sql, con 20 pares de stock.
function tallasDemo(idVariante, primerSku) {
  const tallas = [];

  for (let talla = 40; talla <= 44; talla++) {
    tallas.push({
      id_producto_sku: primerSku + (talla - 40),
      talla: talla,
      sku: "NOVA-" + idVariante + "-" + talla,
      activo: true,
      // 20 pares por SKU, como el inventario inicial de la semilla.
      // Para probar el estilo de "talla agotada", pon aquí un 0.
      stock: 20
    });
  }

  return tallas;
}

const CATALOGO_DEMO = [
  {
    id_modelo: 1,
    nombre: "NOVA Origin",
    descripcion: "Estilo clasico y minimalista",
    precio_base: 79.99,
    activo: true,
    variantes: [
      {
        id_variante: 1, color: "Blanco", suplemento_precio: 0,
        hex: "#f2efe9", hex2: "#cdc7bb", suela: "#ffffff",
        tallas: tallasDemo(1, 1)
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
    descripcion: "Disenada para el movimiento",
    precio_base: 119.90,
    activo: true,
    variantes: [
      {
        id_variante: 3, color: "Rojo", suplemento_precio: 0,
        hex: "#d93b2b", hex2: "#8e1f16", suela: "#f1efe9",
        tallas: tallasDemo(3, 11)
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
    descripcion: "Estilo urbano con contrastes",
    precio_base: 129.99,
    activo: true,
    variantes: [
      {
        id_variante: 5, color: "Negro", suplemento_precio: 0,
        hex: "#23232a", hex2: "#0e0e12", suela: "#3a3a44",
        tallas: tallasDemo(5, 21)
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
    descripcion: "Inspirada en la estetica retro Y2K",
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
        tallas: tallasDemo(8, 36)
      }
    ]
  },
  {
    id_modelo: 5,
    nombre: "NOVA Aura",
    descripcion: "Diseno ligero y contemporaneo",
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
    descripcion: "Estilo tecnico y futurista",
    precio_base: 114.90,
    activo: true,
    variantes: [
      {
        id_variante: 11, color: "Verde", suplemento_precio: 0,
        hex: "#44b074", hex2: "#23724a", suela: "#eceae4",
        tallas: tallasDemo(11, 51)
      },
      {
        id_variante: 12, color: "Negro", suplemento_precio: 0,
        hex: "#26262c", hex2: "#111115", suela: "#2f2f37",
        tallas: tallasDemo(12, 56)
      }
    ]
  }
];
