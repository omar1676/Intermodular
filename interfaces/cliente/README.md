# NOVA Sneakers — Web de clientes

Frontend de la tienda de clientes del proyecto intermodular Sneaker Factory.

Solo **HTML5, CSS3 y JavaScript vanilla**. Sin React, sin Vue, sin Tailwind,
sin Three.js y sin ninguna librería externa ni CDN.

## Cómo verlo

Al abrir `index.html` directamente con doble clic, algunos navegadores
bloquean los scripts por la política de archivos locales. Lo más cómodo es
servir la carpeta por HTTP. Con Node ya instalado:

```
npx --yes serve interfaces/cliente
```

Y abrir la dirección que indique (normalmente `http://localhost:3000`).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Escaparate y catálogo |
| `producto.html` | Detalle de una zapatilla |
| `css/base.css` | Variables de color, cabecera, pie y botones |
| `css/escaparate.css` | Repisas, luz naranja y rejilla del catálogo |
| `css/producto.css` | Vista ampliada, colores, tallas y cantidad |
| `js/datos-demo.js` | Catálogo de demostración (se sustituye por la API en la fase 5) |
| `js/zapatilla-svg.js` | Ilustración SVG propia de la zapatilla |
| `js/api.js` | Única puerta de acceso a los datos, más utilidades comunes |
| `js/catalogo.js` | Dibuja el escaparate |
| `js/producto.js` | Dibuja la vista de detalle |

## Decisiones de diseño

- **Prefijo `cli-` en todas las clases CSS.** El panel de administración de
  Álvaro usa `adm-`, en otra carpeta y con otras hojas de estilo. No hay
  ninguna posibilidad de colisión y su código no se toca.
- **Sin tarjetas.** Las zapatillas se apoyan sobre una repisa con una tira
  de luz naranja debajo, como un escaparate de tienda.
- **Dos filas de tres zapatillas** en escritorio, dos columnas en tableta y
  una columna en móvil, donde cada zapatilla recibe su propia luz.
- **Ilustraciones propias en SVG.** No se usa ninguna marca, logotipo ni
  fotografía de terceros. Si más adelante conseguimos fotos con licencia
  comprobada, basta añadir el campo `imagen` al modelo: el catálogo da
  prioridad a la foto y deja el SVG como respaldo.
- **El navegador nunca habla con PostgreSQL.** Todo pasará por la API de
  `interfaces/cliente-api`, que es la única que tiene las credenciales.

## Relación con la base de datos

`js/datos-demo.js` reproduce la misma forma que tendrá la respuesta del
backend, con la jerarquía real del esquema:

```
modelos -> variantes (color) -> producto_sku (talla + sku) -> existencias
```

Los valores están copiados de `acceso-datos/sql/05_datos_prueba.sql`:
6 modelos, 12 variantes, 60 SKU, tallas 40 a 44 y 20 pares por SKU
(1.200 en total).

El precio se calcula siempre como `precio_base + suplemento_precio`, igual
que en SQL, porque es un atributo derivado que no se almacena.

El modelo **X-NOVA** (12.000 €) queda fuera del escaparate a propósito: en
la base de datos no tiene variantes ni tallas, porque se fabrica a medida
mediante la tabla `configuraciones_xnova`.

## Estado por fases

| Fase | Estado |
|---|---|
| 1. Rama aislada y auditoría | Hecha |
| 2. Escaparate, catálogo y vista de producto | Hecha (pendiente de ajustar al vídeo) |
| 3. Migración de credenciales y diseño del backend | Pendiente |
| 4. Registro, login y sesiones | Pendiente |
| 5. Carrito y pedidos de demostración | Pendiente |
| 6. Resend en modo de pruebas | Pendiente |
| 7. Pruebas funcionales, de seguridad y responsive | Pendiente |

Lo que **todavía no funciona**, porque depende de fases posteriores: el
botón «Añadir al carrito» está desactivado, y «Cuenta» y «Carrito» aparecen
en el menú marcados como pendientes, sin enlazar a ninguna página.

## Aviso académico

Es un proyecto de clase de 2.º DAM. La tienda no cobra, no envía nada y los
pedidos son de demostración. El aviso aparece en todas las páginas.
