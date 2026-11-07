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
| `index.html` | Portada: el expositor de ocho y, debajo, el catálogo |
| `catalogo.html` | El mismo catálogo, en su propia página |
| `producto.html` | Detalle: colores, tallas con stock, cantidad y añadir al carrito |
| `carrito.html` | Cambiar cantidades, quitar líneas, vaciar y finalizar el pedido |
| `cuenta.html` | Entrar y crear cuenta. **Solo interfaz**: valida, pero no autentica |
| `pedidos.html` | Mis pedidos: dos ejemplos fijos más los creados en la demostración |

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `css/base.css` | Paleta, cabecera, pie, botones y avisos |
| `css/escaparate.css` | Pared, repisas y rejilla de la portada |
| `css/producto.css` | Escena del detalle, colores, tallas y cantidad |
| `css/catalogo.css` | Columna de filtros, barra y tarjetas del catálogo |
| `css/paginas.css` | Carrito, cuenta y Mis pedidos |
| `js/datos-demo.js` | Tabla `FOTOS` y catálogo ficticio: modelos, colores, tallas y stock |
| `js/zapatilla-svg.js` | Dibujo SVG de la zapatilla |
| `js/api.js` | Única puerta de acceso a los datos, más utilidades comunes |
| `js/carro.js` | Carrito: añadir, cambiar, quitar, totales y contador |
| `js/pedidos-datos.js` | Pedidos de ejemplo y creación de pedidos de demostración |
| `js/piezas.js` | Dibuja las zapatillas: pieza de expositor y tarjeta de catálogo |
| `js/escaparate.js` | Dibuja el expositor: elige las marcadas como destacado |
| `js/catalogo.js` | Dibuja el catálogo, lo filtra y lo ordena |
| `js/producto.js` | Dibuja el detalle |
| `js/carrito.js` | Dibuja el carrito |
| `js/cuenta.js` | Pestañas y validación de los formularios |
| `js/pedidos.js` | Dibuja Mis pedidos |

## Qué hace cada pantalla

**Portada.** Tiene dos partes, y se nota a la primera que son distintas.

Arriba, **el expositor**: ocho zapatillas sobre una pared gris, en dos filas
de cuatro y muy separadas. Son las que el catálogo marca con `destacado`. Al
señalar o enfocar una **se enciende su repisa**; las demás se quedan apagadas.

Debajo, **el catálogo**, montado como una tienda de verdad: columna de
filtros a la izquierda, barra de herramientas arriba y rejilla de tarjetas a
la derecha. Arriba se expone de una en una; aquí se compra.

**Catálogo.** Lo mismo que el bloque de abajo de la portada, en su propia
página, para llegar desde el menú. Es el mismo código: las dos páginas cargan
`catalogo.js` y tienen los mismos huecos vacíos.

**Los filtros no están escritos en el HTML.** Los escribe `catalogo.js`
leyendo el catálogo, y cada opción lleva al lado cuántas zapatillas tiene.
Añadir una colección o una talla a los datos la añade aquí sola.

| Bloque | De dónde sale |
|---|---|
| Colección | El campo `coleccion`, que es la palabra del archivo de la foto |
| Precio | `precio_base`, partido en tres tramos |
| Talla | Las tallas del catálogo, contando solo las que tienen existencias |
| Disponibilidad | El mismo estado que decide el aviso de la tarjeta |

No hay bloques de **género** ni de **estilo**: las seis colecciones ya son
esas dos cosas (`hombre`, `mujer` y `unisex` son género; `luxe`, `street` y
`casual` son estilo). Separarlos obligaría a inventarse el género de cuarenta
zapatillas y el estilo de otras sesenta.

La barra de arriba dice cuántos artículos se están viendo, deja ocultar la
columna de filtros y ordenar por destacadas, precio o nombre. Si una
combinación de filtros no deja ninguna, lo dice en vez de quedarse en blanco.

Cada tarjeta puede llevar un aviso en la esquina. **Ninguno está inventado:
los tres salen del stock o del propio catálogo.**

| Aviso | Cuándo |
|---|---|
| Agotado | Ninguna talla con existencias. La foto se apaga y el precio sale tachado |
| Últimas tallas | Quedan tres tallas o menos |
| Novedad | Está marcada con `destacado`, que es lo mismo que la pone en el expositor |

**Detalle.** La zapatilla va arriba del todo, nada más pasar la cabecera, y
debajo, en una sola columna, va todo lo que hay que elegir: color, talla,
cantidad y el botón de añadir. Entra acercándose. Al pulsar un color se redibuja,
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
- **La portada es una selección; el catálogo está entero.** Qué sale en la
  portada lo decide un solo campo del catálogo, `destacado`, y nada más.
  Las dos páginas usan la misma función de dibujo: lo único que cambia es
  qué piezas se le pasan. Al pulsar una, el detalle se abre con ese acabado
  ya elegido (`producto.html?modelo=1&color=0`).
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
modelos -> variantes (color) -> producto_sku (talla + sku) -> existencias
```

### Atención: ahora mismo la web y el SQL **no** coinciden

La base de datos tiene siete modelos; la web tiene cien, uno por cada
fotografía de producto. **Seis de los cien conservan el nombre y el precio
exactos del SQL**: Origin, Velocity, Eclipse, Archive, Aura y Pulse. Los
otros noventa y cuatro son datos de demostración que la base de datos
todavía no tiene.

Las cien están repartidas en seis colecciones —Luxe, Street, Hombre, Mujer,
Unisex y Casual—. La colección
de cada zapatilla sale del nombre de su archivo de foto, así que no hay
forma de que una acabe en la equivocada.

**Pendiente para el equipo:** añadir esos noventa y cuatro modelos a
`acceso-datos/sql/05_datos_prueba.sql` para que las dos partes vuelvan a
cuadrar. Desde la web no se toca ningún `.sql`.

Las descripciones tampoco coinciden: las del SQL dicen cómo es la
zapatilla y las de la web son el reclamo que se lee en el catálogo.

El precio se calcula como `precio_base + suplemento_precio`, igual que en
SQL, porque es un valor derivado que no se almacena.

Los cinco estados de pedido son los mismos que admite el `CHECK` de la
tabla `pedidos`: pendiente, en preparación, enviado, entregado y
cancelado.

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
