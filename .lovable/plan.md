# Arreglar el pedido de la Arepa de Yuca Rellena con Queso

## Problema

Al enviar el pedido, el dashboard responde con error porque recibe el texto `arepa-yuca-rellena-queso` en lugar de un identificador válido de producto.

Causa confirmada: el carrito (en `src/components/Header.tsx`) usa su propia tabla de equivalencias de productos hacia el dashboard, y el producto nuevo no está en esa tabla, así que se envía el nombre corto en texto plano.

## Solución

Agregar la equivalencia del producto nuevo en la tabla del carrito:

- `arepa-yuca-rellena-queso` -> `f25ef3f1-afb9-4be2-9a4f-ce6c1441f06e` (ID del producto en al-natural-dash)

## Detalle técnico

- Archivo: `src/components/Header.tsx`, constante `PRODUCT_UUID_MAP` (bloque "Arepas", ~línea 155-164).
- Sin cambios de base de datos ni de funciones del backend.

## Verificación

Agregar el producto al carrito y enviar el pedido; confirmar en los registros de la función `place-order` que el envío al dashboard responde correctamente.

## Nota aparte (no incluida en este cambio)

En los registros aparece también un aviso secundario y no bloqueante: al guardar el detalle del pedido en la base local se usan los IDs del dashboard, que no existen en la tabla de productos de esta web, por lo que ese guardado interno falla sin afectar el pedido. Se puede corregir después si lo deseas.
