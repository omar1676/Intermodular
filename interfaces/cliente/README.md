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
| `index.html` | Portada: seis modelos destacados y el paso al catálogo |
| `catalogo.html` | Catálogo completo: las mismas doce piezas en su propia página |
| `producto.html` | Detalle: colores, tallas con stock, cantidad y añadir al carrito |
| `carrito.html` | Cambiar cantidades, quitar líneas, vaciar y finalizar el pedido |
| `cuenta.html` | Entrar y crear cuenta. **Solo interfaz**: valida, pero no autentica |
| `pedidos.html` | Mis pedidos: dos ejemplos fijos más los creados en la demostración |

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `css/base.css` | Paleta, cabecera, pie, botones y avisos |
| `css/escaparate.css` | Pared, repisas y rejilla del catálogo |
| `css/producto.css` | Escena del detalle, colores, tallas y cantidad |
| `css/paginas.css` | Carrito, cuenta y Mis pedidos |
| `js/datos-demo.js` | Tabla `FOTOS` y catálogo ficticio: modelos, colores, tallas y stock |
| `js/zapatilla-svg.js` | Dibujo SVG de la zapatilla |
| `js/api.js` | Única puerta de acceso a los datos, más utilidades comunes |
| `js/carro.js` | Carrito: añadir, cambiar, quitar, totales y contador |
| `js/pedidos-datos.js` | Pedidos de ejemplo y creación de pedidos de demostración |
| `js/piezas.js` | Dibuja las zapatillas del catálogo, para quien las necesite |
| `js/escaparate.js` | Dibuja la portada: elige las seis destacadas |
| `js/catalogo.js` | Dibuja el catálogo completo |
| `js/producto.js` | Dibuja el detalle |
| `js/carrito.js` | Dibuja el carrito |
| `js/cuenta.js` | Pestañas y validación de los formularios |
| `js/pedidos.js` | Dibuja Mis pedidos |

## Qué hace cada pantalla

**Portada.** Seis piezas sobre una pared gris, una por modelo, y debajo el
paso al catálogo completo. Al señalar o enfocar una zapatilla **se enciende
su repisa** y la luz le sube por la suela; las demás se quedan apagadas.

**Catálogo.** Las doce piezas, los dos acabados de cada modelo. Los colores
sin ninguna talla disponible salen atenuados y con la palabra «Agotado».

**Detalle.** La zapatilla entra acercándose. Al pulsar un color se redibuja,
se reinicia la talla y vuelve a acercarse. Las tallas sin existencias salen
tachadas y no se pueden pulsar. El botón de añadir está bloqueado hasta que
hay una talla elegida.

**Carrito.** Cambiar cantidades, quitar una línea (con animación de salida),
vaciar y finalizar. El máximo por línea es el stock de esa talla, con tope
de cinco pares.

**Cuenta.** Dos pestañas con validación de los campos. No autentica nada.

**Mis pedidos.** Los dos ejemplos y los creados en la demostración, cada uno
diciendo por escrito de dónde sale. El botón de borrar solo quita los
creados.

## Decisiones que podemos defender en clase

- **Prefijo `cli-` en todas las clases CSS.** El panel de administración de
  Álvaro usa `adm-`, en otra carpeta y con otras hojas de estilo. Colisión
  imposible, y su código no se toca.
- **La paleta sale de la suya.** Los mismos papeles, el mismo dorado
  `#c9a24b`, la misma tipografía y los mismos colores de estado, copiados
  como `--cli-*`. Lo único distinto son los grises: el administrador es una
  herramienta y usa casi negro; la tienda es un escaparate y usa gris
  espacial.
- **Sin tarjetas blancas.** Es una pared de tienda: gris neutro, cada
  zapatilla sobre su repisa, y la luz solo en la pieza que estás mirando.
- **La portada enseña modelos; el catálogo, colores.** La portada pone uno
  de cada modelo para que se vea la gama de un vistazo; el catálogo abre
  los dos acabados de cada uno, que son las doce piezas. Las dos páginas
  usan la misma función de dibujo: lo único que cambia es qué piezas se le
  pasan. Al pulsar una, el detalle se abre con ese color ya elegido
  (`producto.html?modelo=1&color=0`).
- **La zapatilla es un SVG por capas, no un icono plano.** Luz cenital,
  oclusión en el apoyo, brillo especular en el empeine, sombra proyectada
  desenfocada y el rebote cálido de la repisa en la mediasuela. Todas las
  capas van recortadas con `clipPath` contra la silueta.
- **Cada SVG lleva una clave única** en los identificadores de sus
  degradados (`cuerpo-v3`, `cuerpo-carro-NOVA-3-42`…). Dos SVG con el mismo
  identificador en la misma página harían que el segundo se pintase con el
  degradado del primero.
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
- **La animación de entrada usa `translate` y el hover usa `transform`.**
  A propósito: una animación con `forwards` gana al hover en la cascada, así
  que si las dos usaran `transform` la zapatilla no se levantaría.
- **Ilustraciones propias.** No se usa ninguna marca, logotipo ni
  fotografía de terceros.

## Poner fotografías reales

El escaparate ya está preparado: si una pieza tiene foto, usa la foto; si
no, dibuja el SVG. No hay que tocar ni el CSS ni el JavaScript.

1. Deja el archivo en `interfaces/cliente/img/`, recortado y con fondo
   transparente (PNG o WebP), de perfil y mirando a la izquierda, que es
   como está dibujado el SVG.
2. Escribe su nombre en la tabla `FOTOS`, arriba de `js/datos-demo.js`.
   Hay una línea por color, etiquetada con el nombre de su zapatilla:

```js
const FOTOS = {
  1:  "img/origin-blanco.png",   // NOVA Origin · Blanco
  2:  "",                        // NOVA Origin · Negro
  ...
};
```

Lo que quede en blanco se sigue dibujando, así que se pueden ir añadiendo de
una en una. Si el nombre está mal escrito o el archivo no existe, la web lo
detecta y dibuja la zapatilla en su lugar: nunca aparece el icono de imagen
rota. Instrucciones completas en `img/LEEME.md`.

**Cuidado con los derechos.** Las fotos de zapatillas de los bancos
gratuitos suelen ser de marcas reconocibles, con el logotipo a la vista, y
el enunciado prohíbe usar marcas. Hay que buscar fotos sin logotipo, o
hacerlas nosotros.

## Responsive

| Ancho | Escaparate | Carrito | Detalle |
|---|---|---|---|
| Más de 1180 px | 6 columnas | Líneas y resumen al lado | Escena y ficha al lado |
| 901 a 1180 px | 4 columnas | Resumen debajo | Escena y ficha al lado |
| 861 a 900 px | 4 columnas | Resumen debajo | Ficha debajo |
| 581 a 860 px | 3 columnas | Línea en dos filas | Ficha debajo |
| Hasta 580 px | 2 columnas | Línea en dos filas | Ficha debajo |

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

## Pruebas

No hay navegador en el entorno de desarrollo, así que el JavaScript se
prueba con Node sobre un DOM y un `localStorage` simulados. Están en
`tests/`, y se ejecutan con `node ejecutar.js` desde esa carpeta. No hacen
falta dependencias. Hay más detalle en `tests/README.md`.

| Batería | Qué comprueba |
|---|---|
| Sintaxis | `node --check` sobre los 10 archivos JS |
| Carrito y pedidos (datos) | Topes de stock, líneas malformadas, totales, referencias |
| Carrito (pantalla) | Dibujado de líneas y que un doble clic no cree dos pedidos |
| Mis pedidos (pantalla) | Dibujado, aviso de pedido nuevo y borrado |
| Cuenta | Validaciones y que no se guarde ninguna contraseña |
| Escaparate | Marcado de las 12 piezas, claves únicas de los SVG y tabla `FOTOS` |

Además se comprueba a mano que no haya referencias rotas en las cinco
páginas, que las llaves de los CSS cuadren y que no se use ninguna variable
CSS sin definir.

## Pendiente

Nada de esto está hecho todavía, y se hará solo si se decide hacerlo:
fotografías reales de producto, backend, base de datos, autenticación real
y correos de confirmación.
