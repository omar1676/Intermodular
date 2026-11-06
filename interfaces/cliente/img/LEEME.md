# Fotografías de las zapatillas

Aquí van las fotos. La web ya está montada: **solo hay que dejar el
archivo en esta carpeta y escribir su nombre en un sitio.**

## Qué hacer

1. Deja la foto aquí, en `interfaces/cliente/img/`.
2. Abre `interfaces/cliente/js/datos-demo.js` y busca la tabla `FOTOS`,
   que está arriba del todo. Escribe el nombre del archivo en la línea
   del color que corresponda:

```js
const FOTOS = {
  1:  "img/origin-blanco.png",   // NOVA Origin · Blanco
  2:  "",                        // NOVA Origin · Negro
  ...
};
```

Nada más. No hay que tocar el CSS ni ningún otro archivo.

Se pueden ir poniendo de una en una: lo que quede en blanco se sigue
dibujando en SVG. Y si un nombre está mal escrito o el archivo no está,
la web lo detecta y dibuja la zapatilla en su lugar, así que nunca
aparece el icono de imagen rota.

## Cómo deben ser las fotos

| | |
|---|---|
| Formato | PNG o WebP **con el fondo recortado** (transparente) |
| Encuadre | De perfil, todas mirando al mismo lado |
| Tamaño | Alrededor de 1200 × 600 px |
| Escala | Parecida entre ellas, para que no salga una gigante y otra diminuta |
| Apoyo | La suela, pegada al borde de abajo de la imagen: así se apoya en la repisa |

El fondo transparente es lo más importante. Una foto con fondo blanco
sobre la pared gris se ve como un recuadro pegado y estropea el
escaparate entero.

## De dónde sacarlas

**Lo mejor: hacerlas nosotros.** Con el móvil, la zapatilla de perfil
contra una pared lisa y buena luz. Luego se le quita el fondo (Paint de
Windows tiene «Quitar fondo», y también vale una web de recorte). Así no
hay ningún problema de derechos y son fotos de verdad.

**Cuidado con los bancos de imágenes gratuitos.** Casi todas las fotos
de zapatillas que hay en Pexels, Unsplash o Pixabay son de marcas
reconocibles, con el logotipo a la vista. El enunciado del proyecto
prohíbe usar marcas y logotipos ajenos, así que no valen aunque la
licencia de la foto sea libre.

## Las doce fotos que faltan

| id | Zapatilla | Archivo sugerido |
|---|---|---|
| 1 | NOVA Origin · Blanco | `origin-blanco.png` |
| 2 | NOVA Origin · Negro | `origin-negro.png` |
| 3 | NOVA Velocity · Rojo | `velocity-rojo.png` |
| 4 | NOVA Velocity · Azul | `velocity-azul.png` |
| 5 | NOVA Eclipse · Negro | `eclipse-negro.png` |
| 6 | NOVA Eclipse · Gris | `eclipse-gris.png` |
| 7 | NOVA Archive · Blanco | `archive-blanco.png` |
| 8 | NOVA Archive · Beige | `archive-beige.png` |
| 9 | NOVA Aura · Rosa | `aura-rosa.png` |
| 10 | NOVA Aura · Crema | `aura-crema.png` |
| 11 | NOVA Pulse · Verde | `pulse-verde.png` |
| 12 | NOVA Pulse · Negro | `pulse-negro.png` |

No hacen falta las doce para empezar. Con seis, una por modelo, el
escaparate ya cambia por completo.

## nova-logo.png

El logotipo de la cabecera. **No es un archivo nuevo del proyecto**: es una
copia reducida del original `interfaces/admin/img/Nova Logo.png`, que hizo
Álvaro y que está en su rama. El original no se ha tocado.

| | Original | Copia de aquí |
|---|---|---|
| Tamaño | 2172 × 724 | 480 × 160 |
| Peso | 624 KB | 21 KB |

Se redujo manteniendo la proporción 3:1 y la transparencia. El logotipo es
blanco al cien por cien, así que antes de reducirlo se fijó todo el color a
blanco: así los bordes no se ensucian de gris al interpolar.

Está duplicado a propósito, para que la web de clientes funcione sola sin
depender de la carpeta del panel de administración. Cuando se junten las
ramas habrá que decidir si las dos usan la misma copia.

## Qué parte de esto está hoy sin usar

La tabla `FOTOS` tiene **las doce casillas vacías**, así que ahora mismo se
dibujan las doce zapatillas y no se carga ni una imagen. Todo el montaje
está escrito y probado, esperando a las fotos. Esto es lo que hay montado
y no se ejecuta:

| Dónde | Qué | Estado |
|---|---|---|
| `js/datos-demo.js` | La tabla `FOTOS`, 12 líneas | las 12 vacías |
| `js/api.js` | `fotoVariante()` | devuelve siempre `""` |
| `js/api.js` | `respaldoDeFotos()` | nunca salta, porque no hay `<img>` |
| `js/piezas.js` | La rama de `<img>` de `piezaHtml` | nunca se toma |
| `js/producto.js` | La rama de `<img>` de `pintarZapatilla` | nunca se toma |
| `css/escaparate.css` | `.cli-pieza img.zap` | sin elementos a los que aplicarse |
| `css/producto.css` | `.cli-escena img.zap` | igual |

Son unas 50 líneas en total. **No es código muerto: es código a la espera**,
y las pruebas lo recorren rellenando `FOTOS` a mano. Pero si al final no
entran fotografías, esto sobra y hay que quitarlo antes de entregar.

Un detalle que conviene saber: `respaldoDeFotos` escucha el evento en fase
de captura (`addEventListener("error", ..., true)`) porque **el evento
`error` de una imagen no burbujea**. Sin ese `true` no se enteraría de
nada.
