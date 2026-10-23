# Contrato de datos - Sneaker Factory

## 1. Datos generales del pedido

- **id_pedido:** para identificar cada pedido y no confundirlo con otros.
- **id_cliente:** para saber qué cliente ha realizado el pedido.
- **fecha_pedido:** para saber cuándo se ha realizado la compra.
- **tipo_pedido:** para distinguir si el pedido es normal o personalizado (Custom).
- **estado_pedido:** para saber si el pedido está pendiente, confirmado, enviado, entregado o cancelado.
- **estado_pago:** para saber si el cliente ha pagado o todavía tiene el pago pendiente.

## 2. Datos del cliente

- **id_cliente:** para identificar al cliente y relacionarlo con sus pedidos.
- **nombre:** para saber quién realiza la compra.
- **correo:** para contactar con el cliente y enviarle información de su pedido.
- **telefono:** para contactar con él si ocurre algún problema.
- **direccion_entrega:** para saber dónde hay que enviar las zapatillas cuando el pedido sea a domicilio.

## 3. Productos, variantes y SKU

- **id_modelo:** para identificar el modelo de zapatilla en la base de datos.
- **nombre_modelo:** para saber qué modelo de zapatilla ha seleccionado el cliente.
- **id_variante:** para identificar una versión concreta de un modelo.
- **color:** para diferenciar las zapatillas según su color.
- **sku:** para identificar una referencia concreta del inventario, teniendo en cuenta el modelo, el color y la talla.

## 4. Tallas y cantidades

- **id_linea:** para identificar cada línea dentro de un pedido.
- **id_pedido:** para relacionar cada línea con su pedido.
- **sku:** para saber qué referencia concreta se está comprando.
- **talla:** para saber qué talla ha solicitado el cliente.
- **cantidad:** para saber cuántos pares ha pedido de esa talla.
- **precio_unitario:** para conocer el precio de cada par.
- **importe_linea:** para calcular el precio total de esa línea multiplicando la cantidad por el precio unitario.

Si un cliente compra el mismo modelo en varias tallas, cada talla aparecerá en una línea diferente.

## 5. Personalización Custom

- **tipo_personalizacion:** para saber qué clase de personalización quiere el cliente.
- **texto_personalizado:** para guardar el texto que quiere añadir a las zapatillas, si lo solicita.
- **logo_personalizado:** para guardar una referencia al diseño o logotipo que quiere utilizar.
- **color_personalizado:** para indicar algún color especial solicitado por el cliente.
- **observaciones:** para guardar instrucciones adicionales relacionadas con la personalización.

Estos datos serán opcionales cuando el pedido sea de zapatillas normales.

## 6. Estados y validaciones

Para evitar errores al registrar pedidos, tendremos que comprobar varias cosas:

- Que el pedido tenga un identificador válido.
- Que el cliente exista en la base de datos.
- Que el modelo y la talla solicitados sean válidos.
- Que la cantidad de pares sea mayor que cero.
- Que el precio no sea negativo.
- Que el estado del pedido sea uno de los estados permitidos.
- Que no se confirme una venta sin comprobar las reglas de disponibilidad de stock.
- Que los pedidos cancelados no se contabilicen como ventas válidas.
- Que los datos de personalización estén completos cuando sean necesarios.

También debemos distinguir entre un pedido pendiente de pago y uno pendiente de entrega, porque son situaciones diferentes.

## 7. Exportación CSV

Para utilizar los datos en la asignatura de Python, exportaremos información de la base de datos en archivos CSV.

- **clientes.csv:** información necesaria para identificar a los clientes.
- **modelos.csv:** modelos de zapatillas y sus características.
- **pedidos.csv:** identificador, fecha, cliente, estado y tipo de pedido.
- **lineas_pedido.csv:** productos solicitados, tallas, cantidades y precios de cada línea.
- **stock.csv:** cantidades disponibles de cada referencia, modelo y talla.

Los archivos tendrán que mantener los mismos identificadores que utilizamos en la base de datos para poder relacionarlos.

Acordaremos el formato de las fechas, los números, el separador y la codificación de los archivos con Acceso a Datos.

Python utilizará estas exportaciones para calcular ventas, analizar los pedidos, estudiar las tallas más solicitadas y comprobar las existencias.

Los archivos originales no se modificarán durante los análisis.

## 8. Aspectos pendientes de acordar

- Comprobar los nombres definitivos de las entidades y columnas con el modelo ER.
- Decidir cómo representamos las variantes personalizadas.
- Acordar los estados definitivos de los pedidos y los pagos.
- Determinar cómo se registran las entregas parciales.
- Confirmar qué columnas estarán presentes en los cinco CSV.
- Preparar el diccionario de datos con tipos, formatos y valores permitidos.