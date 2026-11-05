# NOVA Sneakers — Web de clientes

Frontend de la tienda de clientes del proyecto intermodular Sneaker Factory.

Solo **HTML5, CSS3 y JavaScript vanilla**. Sin React, sin Next.js, sin Vue,
sin Tailwind, sin Three.js y sin ninguna librería externa ni CDN.

> **Es una demostración académica.** No hay servidor, no hay base de datos,
> no hay autenticación y no se cobra ni se envía nada. Todas las pantallas
> lo avisan por escrito.

## Cómo abrirla

Al abrir `index.html` con doble clic, el navegador puede bloquear los
scripts por la política de archivos locales. Lo más cómodo es servir la
carpeta por HTTP. Desde la raíz del repositorio:

```
npx --yes serve interfaces/cliente
```

Y abrir la dirección que indique (normalmente `http://localhost:3000`).

## Páginas

| Página | Qué hace |
|---|---|
| `index.html` | Escaparate oscuro con las seis zapatillas sobre repisas iluminadas |
| `producto.html` | Detalle ampliado: colores, tallas con stock, cantidad y añadir al carrito |
| `carrito.html` | Cambiar cantidades, quitar líneas, vaciar y finalizar el pedido |
| `cuenta.html` | Entrar y crear cuenta. **Solo interfaz**: valida, pero no autentica |
| `pedidos.html` | Mis pedidos: ejemplos fijos más los creados en la demostración |

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `css/base.css` | Variables de color, cabecera, pie, botones y avisos |
| `css/escaparate.css` | Repisas, luz naranja y rejilla del catálogo |
| `css/producto.css` | Vista ampliada, colores, tallas y cantidad |
| `css/paginas.css` | Carrito, cuenta y Mis pedidos |
| `js/datos-demo.js` | Catálogo ficticio: modelos, colores, tallas y stock |
| `js/zapatilla-svg.js` | Ilustración SVG propia de la zapatilla |
| `js/api.js` | Única puerta de acceso a los datos, más utilidades comunes |
| `js/carro.js` | Carrito: añadir, cambiar, quitar, totales y contador |
| `js/pedidos-datos.js` | Pedidos de ejemplo y creación de pedidos de demostración |
| `js/catalogo.js` | Dibuja el escaparate |
| `js/producto.js` | Dibuja la vista de detalle |
| `js/carrito.js` | Dibuja el carrito |
| `js/cuenta.js` | Pestañas y validación de los formularios |
| `js/pedidos.js` | Dibuja Mis pedidos |

## Decisiones que podemos defender en clase

- **Prefijo `cli-` en todas las clases CSS.** El panel de administración de
  Álvaro usa `adm-`, en otra carpeta y con otras hojas de estilo. Colisión
  imposible, y su código no se toca.
- **Sin tarjetas blancas.** Las zapatillas se apoyan sobre una repisa con
  una tira de luz naranja debajo, como un escaparate de tienda.
- **El carrito no guarda precios.** Guarda solo el SKU y la cantidad; el
  precio se recalcula del catálogo cada vez que se dibuja, así que no puede
  quedar desfasado ni manipulado desde el almacenamiento del navegador.
- **Un pedido sí guarda el precio unitario**, porque un pedido es la foto de
  lo que valía en ese momento. Es la diferencia entre un carrito y un pedido.
- **Un carrito con varias líneas produce un solo pedido**, y el botón de
  finalizar se bloquea al primer clic para que un doble clic no cree dos.
- **Ninguna contraseña se guarda en ningún sitio.** Ni en localStorage, ni en
  sessionStorage, ni en cookies. Al enviar el formulario los campos de
  contraseña se vacían. Tampoco se crea ninguna sesión falsa.
- **Ilustraciones propias en SVG.** No se usa ninguna marca, logotipo ni
  fotografía de terceros. Si conseguimos fotos con licencia comprobada,
  basta añadir el campo `imagen` al modelo: el catálogo da prioridad a la
  foto y deja el SVG como respaldo.
- **La animación de entrada usa `translate` y el hover usa `transform`.**
  A propósito: una animación con `forwards` gana al hover en la cascada, así
  que si las dos usaran `transform` la zapatilla no se levantaría.

## Responsive

| Ancho | Escaparate | Carrito |
|---|---|---|
| Más de 1000 px | 2 filas de 3 zapatillas, repisa compartida | Líneas y resumen al lado |
| 681 a 1000 px | 2 columnas | Resumen debajo |
| Hasta 680 px | 1 columna, cada zapatilla con su propia luz | Línea en dos filas |

Los botones y las tallas miden 48 px o más de alto, para poder pulsarlos con
el dedo. Se respeta `prefers-reduced-motion` para quien no quiera animaciones.

## Dónde se guardan las cosas

En `localStorage`, que es almacenamiento del **propio navegador**. No es una
base de datos: nadie más lo ve, no sale del ordenador y desaparece al borrar
los datos de navegación.

| Clave | Contenido |
|---|---|
| `nova_carrito_demo` | Líneas del carrito: solo SKU y cantidad |
| `nova_pedidos_demo` | Pedidos creados en la demostración |

Los pedidos de ejemplo (`WEB-DEMO-000001` y `WEB-DEMO-000002`) **no** están
ahí: están escritos a mano en `js/pedidos-datos.js`.

## Relación con la base de datos del proyecto

El catálogo ficticio usa la misma jerarquía que el esquema real:

```
modelos -> variantes (color) -> producto_sku (talla + sku) -> stock
```

Los nombres, descripciones y precios coinciden con los del proyecto, y el
precio se calcula como `precio_base + suplemento_precio`, igual que en SQL,
porque es un valor derivado que no se almacena.

El modelo **X-NOVA** queda fuera del escaparate a propósito: es el concepto
de fabricación a medida y no tiene colores ni tallas de catálogo.

Algunas tallas están sin stock a propósito (por ejemplo la 44 de NOVA Origin
Blanco, y el NOVA Pulse Negro entero) para que se vea cómo la web avisa de
que algo está agotado.

## Pendiente

Nada de esto está hecho todavía, y se hará solo si se decide hacerlo:
backend, base de datos, autenticación real y correos de confirmación.
