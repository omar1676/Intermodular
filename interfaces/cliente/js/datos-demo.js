/* NOVA Sneakers · Catalogo de demostracion · Omar */

// Genera las cinco tallas (40 a 44) de una variante, con 20 pares cada una.
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

/* FOTOS: la fotografía de cada modelo. Si una casilla se queda vacía, esa
   zapatilla se dibuja con el SVG. Instrucciones en img/LEEME.md */
const FOTOS = {
  1:  "img/nova-luxe-01.png",    2:  "img/nova-luxe-02.png",
  3:  "img/nova-luxe-03.png",    4:  "img/nova-luxe-04.png",
  5:  "img/nova-luxe-05.png",    6:  "img/nova-luxe-06.png",
  7:  "img/nova-luxe-07.png",    8:  "img/nova-luxe-08.png",
  9:  "img/nova-luxe-09.png",    10: "img/nova-luxe-10.png",
  11: "img/nova-street-01.png",  12: "img/nova-street-02.png",
  13: "img/nova-street-03.png",  14: "img/nova-street-04.png",
  15: "img/nova-street-05.png",  16: "img/nova-street-06.png",
  17: "img/nova-street-07.png",  18: "img/nova-street-08.png",
  19: "img/nova-street-09.png",  20: "img/nova-street-10.png"
};

/* Veinte modelos, uno por fotografía. Cada uno tiene un solo acabado.

   Seis conservan el nombre y el precio exactos de 05_datos_prueba.sql:
   Origin, Velocity, Eclipse, Archive, Aura y Pulse. Los otros catorce son
   datos de demostración de esta web y la base de datos todavía no los
   tiene. Está explicado en el README.

   Los colores hex no están inventados: salen de medir el color dominante
   de cada fotografía, para que la muestra del detalle y el dibujo de
   respaldo se parezcan a la foto.

   "destacado" es lo único que decide qué sale en la portada. */
const CATALOGO_DEMO = [
  {
    id_modelo: 1, nombre: "NOVA Onyx", precio_base: 139.90, activo: true, destacado: false,
    descripcion: "Negro. No hay mucho más que explicar.",
    variantes: [{
      id_variante: 1, color: "Negro", suplemento_precio: 0,
      hex: "#232220", hex2: "#12110f", suela: "#1b1b1b",
      tallas: tallasDemo(1, 1, [40])
    }]
  },
  {
    id_modelo: 2, nombre: "NOVA Origin", precio_base: 79.99, activo: true, destacado: true,
    descripcion: "La primera que te pones. La última de la que te cansas.",
    variantes: [{
      id_variante: 2, color: "Hueso", suplemento_precio: 0,
      hex: "#ded3c5", hex2: "#c3b6a4", suela: "#efe9df",
      tallas: tallasDemo(2, 6)
    }]
  },
  {
    id_modelo: 3, nombre: "NOVA Field", precio_base: 124.90, activo: true, destacado: true,
    descripcion: "Para los sábados que empiezan sin plan.",
    variantes: [{
      id_variante: 3, color: "Oliva", suplemento_precio: 0,
      hex: "#3c3623", hex2: "#272316", suela: "#b5804a",
      tallas: tallasDemo(3, 11, [44])
    }]
  },
  {
    id_modelo: 4, nombre: "NOVA Harbor", precio_base: 149.90, activo: true, destacado: true,
    descripcion: "Sube el tobillo. Baja el ruido.",
    variantes: [{
      id_variante: 4, color: "Marino", suplemento_precio: 0,
      hex: "#36363e", hex2: "#202129", suela: "#1d1d22",
      tallas: tallasDemo(4, 16)
    }]
  },
  {
    id_modelo: 5, nombre: "NOVA Dune", precio_base: 119.90, activo: true, destacado: false,
    descripcion: "El color de las cosas que duran.",
    variantes: [{
      id_variante: 5, color: "Arena", suplemento_precio: 0,
      hex: "#9c816b", hex2: "#715947", suela: "#efe7da",
      tallas: tallasDemo(5, 21, [40, 41])
    }]
  },
  {
    id_modelo: 6, nombre: "NOVA Drift", precio_base: 109.90, activo: true, destacado: false,
    descripcion: "Sin cordones y sin prisa.",
    variantes: [{
      id_variante: 6, color: "Perla", suplemento_precio: 0,
      hex: "#cfc9c6", hex2: "#a9a29e", suela: "#e9e6e2",
      tallas: tallasDemo(6, 26)
    }]
  },
  {
    id_modelo: 7, nombre: "NOVA Ember", precio_base: 134.90, activo: true, destacado: true,
    descripcion: "Un color que no pasa desapercibido, y lo sabe.",
    variantes: [{
      id_variante: 7, color: "Burdeos", suplemento_precio: 0,
      hex: "#5b2b2b", hex2: "#361013", suela: "#2e1a17",
      tallas: tallasDemo(7, 31)
    }]
  },
  {
    id_modelo: 8, nombre: "NOVA Court", precio_base: 112.90, activo: true, destacado: false,
    descripcion: "Hecha para que te pregunten dónde la compraste.",
    variantes: [{
      id_variante: 8, color: "Marfil", suplemento_precio: 0,
      hex: "#ded2c5", hex2: "#2f4a39", suela: "#efe9df",
      tallas: tallasDemo(8, 36, [43])
    }]
  },
  {
    id_modelo: 9, nombre: "NOVA Slate", precio_base: 142.90, activo: true, destacado: false,
    descripcion: "Gris, pero nunca discreta.",
    variantes: [{
      id_variante: 9, color: "Grafito", suplemento_precio: 0,
      hex: "#3a3939", hex2: "#242323", suela: "#1f1f1f",
      tallas: tallasDemo(9, 41)
    }]
  },
  {
    id_modelo: 10, nombre: "NOVA Linen", precio_base: 117.90, activo: true, destacado: false,
    descripcion: "La que te pones cuando quieres acertar seguro.",
    variantes: [{
      id_variante: 10, color: "Camel", suplemento_precio: 0,
      hex: "#af9985", hex2: "#8c7765", suela: "#efe7da",
      tallas: tallasDemo(10, 46)
    }]
  },
  {
    id_modelo: 11, nombre: "NOVA Velocity", precio_base: 119.90, activo: true, destacado: false,
    descripcion: "Si la miras parada, no la estás entendiendo.",
    variantes: [{
      id_variante: 11, color: "Coral", suplemento_precio: 0,
      hex: "#e4dfe0", hex2: "#b9b4b5", suela: "#f1efe9",
      tallas: tallasDemo(11, 51)
    }]
  },
  {
    id_modelo: 12, nombre: "NOVA Archive", precio_base: 109.90, activo: true, destacado: true,
    descripcion: "Del dos mil, pero sin nostalgia.",
    variantes: [{
      id_variante: 12, color: "Blanco", suplemento_precio: 0,
      hex: "#e5e2df", hex2: "#bdbab5", suela: "#f1efe9",
      tallas: tallasDemo(12, 56, [40])
    }]
  },
  {
    id_modelo: 13, nombre: "NOVA Vector", precio_base: 127.90, activo: true, destacado: false,
    descripcion: "Los que llegan tarde no la llevan.",
    variantes: [{
      id_variante: 13, color: "Lima", suplemento_precio: 0,
      hex: "#232325", hex2: "#111113", suela: "#3a3a3c",
      tallas: tallasDemo(13, 61)
    }]
  },
  {
    id_modelo: 14, nombre: "NOVA Marina", precio_base: 104.90, activo: true, destacado: false,
    descripcion: "Para los días que no piden nada especial.",
    variantes: [{
      id_variante: 14, color: "Crema", suplemento_precio: 0,
      hex: "#d2c5b7", hex2: "#243a52", suela: "#ece4d8",
      tallas: tallasDemo(14, 66, [44])
    }]
  },
  {
    id_modelo: 15, nombre: "NOVA Pulse", precio_base: 114.90, activo: true, destacado: true,
    descripcion: "Enciende la calle y se va.",
    variantes: [{
      id_variante: 15, color: "Violeta", suplemento_precio: 0,
      hex: "#2a1540", hex2: "#0a090c", suela: "#2f2f37",
      tallas: tallasDemo(15, 71)
    }]
  },
  {
    id_modelo: 16, nombre: "NOVA Aura", precio_base: 99.99, activo: true, destacado: false,
    descripcion: "Pesa tan poco que se te olvida.",
    variantes: [{
      id_variante: 16, color: "Salvia", suplemento_precio: 0,
      hex: "#b9b7ad", hex2: "#94928a", suela: "#eceae4",
      tallas: tallasDemo(16, 76)
    }]
  },
  {
    // Agotada entera, a proposito, para que se vea como lo avisa la web
    id_modelo: 17, nombre: "NOVA Ridge", precio_base: 121.90, activo: true, destacado: false,
    descripcion: "Unos centímetros más. Nadie tiene por qué saberlo.",
    variantes: [{
      id_variante: 17, color: "Negro", suplemento_precio: 0,
      hex: "#232322", hex2: "#111110", suela: "#cfc4b7",
      tallas: tallasDemo(17, 81, [40, 41, 42, 43, 44])
    }]
  },
  {
    id_modelo: 18, nombre: "NOVA Cobalt", precio_base: 118.90, activo: true, destacado: true,
    descripcion: "Azul de los que se ven desde el otro lado de la acera.",
    variantes: [{
      id_variante: 18, color: "Azul", suplemento_precio: 0,
      hex: "#2a4fb5", hex2: "#16307a", suela: "#e8e7ea",
      tallas: tallasDemo(18, 86)
    }]
  },
  {
    id_modelo: 19, nombre: "NOVA Terrace", precio_base: 106.90, activo: true, destacado: false,
    descripcion: "La que acaba en todas las fotos del grupo.",
    variantes: [{
      id_variante: 19, color: "Niebla", suplemento_precio: 0,
      hex: "#d2c5b6", hex2: "#3f5a42", suela: "#ece4d8",
      tallas: tallasDemo(19, 91, [42])
    }]
  },
  {
    id_modelo: 20, nombre: "NOVA Eclipse", precio_base: 129.99, activo: true, destacado: true,
    descripcion: "Oscura por fuera. Lo demás es cosa tuya.",
    variantes: [{
      id_variante: 20, color: "Ciruela", suplemento_precio: 0,
      hex: "#3a1b2c", hex2: "#0c080b", suela: "#2a2024",
      tallas: tallasDemo(20, 96)
    }]
  }
];
