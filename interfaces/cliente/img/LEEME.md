# Fotografías de las zapatillas

Cien fotografías, una por zapatilla. Cada archivo es un modelo del
catálogo y el nombre del archivo dice también a qué colección pertenece.

| Archivos | Colección | Cuántas |
|---|---|---|
| `nova-luxe-01` … `-10` | Luxe | 10 |
| `nova-street-01` … `-10` | Street | 10 |
| `nova-hombre-01` … `-20` | Hombre | 20 |
| `nova-mujer-01` … `-20` | Mujer | 20 |
| `nova-unisex-01` … `-20` | Unisex | 20 |
| `nova-casual-01` … `-20` | Casual | 20 |

Peso total: **14,5 MB**, a 440 px de ancho y con transparencia.

## Cómo se preparan

Llegan en PNG **ya recortadas**, con el fondo transparente, a unos 2000 px
de ancho y 2 MB cada una. Aquí solo se hacen dos cosas:

1. **Recortar a la zapatilla.** Se busca la caja que contiene todo lo que
   no es transparente, se deja un margen de 4 px y se tira el resto. Así
   todas quedan encuadradas igual aunque en el original la zapatilla
   estuviera más a un lado.
2. **Reducir a 440 px de ancho**, con interpolación bicúbica. Al reescalar
   hay que decirle a GDI+ que repita el borde en espejo; si no, deja media
   fila de píxeles oscuros alrededor de la silueta.

No hace falta quitar ningún fondo: **ya vienen sin él**. Antes sí hacía
falta y el método está contado al final de este archivo, por si vuelven a
llegar fotos con el recuadro blanco.

### Por qué 440 px y no más

PNG con canal alfa comprime mucho peor que JPEG. A 560 px las cien pesaban
23 MB; a 440 px pesan 14,5 MB y en pantalla casi no se nota, porque en la
rejilla se ven a unos 300 px.

En la ficha del producto sí se estiran: ahí la foto llega a 560 px, un
27 % más de lo que mide el archivo. En una fotografía de degradados
suaves no se aprecia, y la alternativa era guardar 8 MB más en el
repositorio para una sola página.

### El alto también está en los datos

Cada zapatilla lleva en `datos-demo.js` el campo `alto`, que es el alto en
píxeles de su fotografía ya reducida. No es decoración: **NOVA Fit saca de
ahí la proporción de la zapatilla**, que es lo que distingue una de caña
alta o suela gruesa de una de perfil bajo. Sale de medir el archivo, no de
clasificar las cien a mano.

### Los colores de cada zapatilla

En `datos-demo.js` cada zapatilla lleva tres colores (`hex`, `hex2`,
`suela`). **No están puestos a ojo: se miden sobre la propia fotografía.**
Se cuentan los píxeles opacos en cubos de color y se coge el cubo más
repetido de la parte de arriba (el cuerpo), el siguiente que se distinga
de él (la sombra) y el más repetido de la franja de abajo (la suela).
Luego se promedian de verdad los píxeles de ese cubo, para que no salga
el color del centro del cubo sino el real.

Sirven para dos cosas: la muestra de color de la ficha y el dibujo SVG de
respaldo. Si se parecen a la foto, los dos quedan bien.

El **nombre** del acabado («Arena y burdeos») sale de clasificar esos
mismos colores por tono, luminosidad y saturación, y luego se revisa a
ojo sobre una hoja de contactos. Las veinte primeras conservan el nombre
de color que ya tenían.

## Cómo deben ser las fotos nuevas

| | |
|---|---|
| Formato | PNG **con el fondo recortado** (transparente) |
| Encuadre | De perfil, todas mirando al mismo lado |
| Tamaño | 1200 px de ancho o más; aquí se reducen solas |
| Escala | Parecida entre ellas, para que no salga una gigante y otra diminuta |
| Apoyo | La suela abajo del todo: así se apoya en la repisa |

El fondo transparente es lo más importante. Una foto con fondo blanco
sobre la pared gris se ve como un recuadro pegado y estropea el
escaparate entero.

Las proporciones pueden variar: van de 1,64 a 2,59 de ancho entre alto. El
CSS las mete en una caja fija de 8/5 con `object-fit: contain` y
`object-position: center bottom`. Como la caja es más alta que la foto más
estrecha, **todas llenan el ancho y apoyan a la misma altura**: las de caña
alta salen más altas, que es justo lo que pasa con las zapatillas de
verdad.

## Cómo añadir una zapatilla

1. Deja la foto aquí, con el nombre `nova-<coleccion>-NN.png`.
2. Añade su fila a la tabla `FICHAS` de `js/datos-demo.js`. El `id`, el
   `id_variante`, los SKU y la ruta de la foto **se calculan solos** a
   partir de la posición en la tabla.

No hay que tocar el CSS ni ningún otro archivo. Si el archivo no está o
el nombre está mal escrito, la web lo detecta y dibuja la zapatilla en
SVG, así que nunca aparece el icono de imagen rota.

## Derechos

Las cien fotografías llevan únicamente la marca **NOVA**, que es la del
proyecto. No hay ningún logotipo ni elemento de marcas reales.

**Cuidado con los bancos de imágenes gratuitos.** Casi todas las fotos de
zapatillas que hay en Pexels, Unsplash o Pixabay son de marcas
reconocibles, con el logotipo a la vista. El enunciado del proyecto
prohíbe usar marcas ajenas, así que no valen aunque la licencia de la
foto sea libre.

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

## El dibujo SVG no sobra

Si una foto se borra o no carga, esa zapatilla vuelve a dibujarse sola.
Hay pruebas que lo comprueban vaciando `FOTOS` a propósito.

## Apéndice: quitar un fondo blanco

Esto **ya no se usa**, porque las fotos llegan recortadas. Queda escrito
por si vuelven a llegar con el recuadro.

Un umbral de claridad a secas no vale: agujerea las zapatillas color
crema, porque su color es casi tan claro como el fondo. Hay que **rellenar
desde los bordes de la imagen hacia dentro** y parar al tocar la
zapatilla, borrando un píxel solo cuando es claro (luminosidad 228 o más)
**y** neutro (menos de 12 puntos entre el canal más alto y el más bajo).
Lo de la contigüidad evita agujerear la crema, porque su blanco no toca el
borde; lo de neutro también, porque el crema es cálido y el relleno se
para en él.

Después, el borde se suaviza con la media del vecindario y a los píxeles a
medias se les descuenta el blanco que traían mezclado. Sin eso queda un
halo claro alrededor de la silueta.
