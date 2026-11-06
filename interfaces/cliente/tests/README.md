# Pruebas de la web de clientes

No hay navegador en el entorno de desarrollo, así que el JavaScript de la
web se prueba con **Node**, sobre un DOM y un `localStorage` de mentira.

Solo hace falta tener Node instalado. **No hay dependencias, ni
`package.json`, ni nada que instalar.**

## Cómo se ejecutan

Todas de golpe, desde esta carpeta:

```
node ejecutar.js
```

Una sola, cuando estás tocando esa parte:

```
node 01-carrito-datos.js
```

Si todo va bien, la última línea dice `170 comprobaciones en 8 archivos, 0
fallidas` y el programa termina con código 0. Si algo falla, sale `FALLO`
en la línea de la comprobación y el código de salida es 1.

## Qué hay aquí

| Archivo | Qué comprueba | Comprobaciones |
|---|---|---|
| `01-carrito-datos.js` | Topes de stock, líneas malformadas, totales, referencias de pedido | 36 |
| `02-carrito-pantalla.js` | Dibujado de las líneas y que un doble clic no cree dos pedidos | 19 |
| `03-pedidos-pantalla.js` | Dibujado, aviso de pedido nuevo y borrado | 21 |
| `04-cuenta.js` | Validaciones y que no se guarde ninguna contraseña | 20 |
| `05-piezas.js` | Marcado de las 12 piezas, la tabla `FOTOS` y la carga del catálogo | 34 |
| `06-claves-svg.js` | Que no se repita ningún identificador de degradado | 5 |
| `07-catalogo.js` | La página del catálogo completo: las 12 variantes, enlaces y precios | 19 |
| `08-portada.js` | La portada: seis destacadas, una por modelo, y el paso al catálogo | 16 |
| `entorno.js` | El DOM y el `localStorage` de mentira, y el cargador | — |
| `ejecutar.js` | Lanza todas y suma | — |

## Cómo funciona `entorno.js`

Tiene dos partes.

La primera inventa lo mínimo del navegador para que el código de la web no
se caiga: `document.getElementById`, `classList`, `localStorage` y poco
más. Los nodos que se van pidiendo quedan guardados en `__nodos`, y así una
prueba puede mirar qué HTML se ha dibujado. Lo guardado queda en
`__almacen`, que es un `Map` normal.

La segunda es la función `cargar`, que lee los archivos de verdad de
`../js/` y los ejecuta, en el mismo orden en que la página los pone en sus
etiquetas `<script>`:

```js
require("./entorno.js").cargar([
  "datos-demo.js", "zapatilla-svg.js", "api.js", "carro.js"
]);
```

Esto es importante: **las pruebas leen el código real de la web, no una
copia.** Si alguien cambia `js/carro.js`, las pruebas prueban lo nuevo. No
hay forma de que se queden desfasadas.

## Qué NO prueban

Nada visual. No comprueban colores, posiciones, animaciones ni que algo se
vea bien en el móvil: eso hay que mirarlo con los ojos en un navegador. Lo
que prueban es el comportamiento del JavaScript.

## Añadir una prueba

Copia un archivo de los que hay, cámbiale el número y el nombre, y pon en
`cargar` los archivos de `js/` que necesites. `ejecutar.js` recoge solo. No
hay que apuntarla en ningún sitio: coge todos los archivos de esta carpeta
que empiecen por dos dígitos.
