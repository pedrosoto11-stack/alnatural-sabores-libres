# Agregar "Arepa de Yuca rellena con queso"

Nuevo producto en la categoría Arepas, con el mismo formato visual y funcional que los demás (imagen, descripción, beneficios, precio y carrito).

## Contenido del producto

- Nombre: Arepa de Yuca rellena con queso
- Descripción: Arepa de yuca rellena con queso blanco, lista para calentar y disfrutar. 6 unidades de 140 g c/u, empacadas al vacío.
- Beneficios: Elaboradas con yuca fresca · Rellenas con queso blanco · Libres de gluten · Empacadas al vacío
- Precio: $5.70
- Imagen: la foto que enviaste, ajustada al mismo tamaño y encuadre que las demás arepas (864x990)

Nota: las fichas actuales no muestran tabla nutricional, así que la información nutricional no se agregará para mantener el mismo formato. Si la quieres visible, puedo añadirla como sección para todos los productos en un paso aparte.

## Pasos

1. Subir la imagen como asset del proyecto, redimensionada a 864x990 igual que el resto.
2. Agregar el producto al listado de la página de Productos, al final de la categoría Arepas.
3. Crear el producto en la base de datos (categoría arepas, precio 5.70, activo) y enlazar su ID en el mapa de productos para que funcionen precios, edición de precio por admin y pedidos.
4. Verificar en móvil y escritorio que la tarjeta se vea igual a las demás.

## Detalles técnicos

- `src/assets/arepa-yuca-rellena-queso.png` vía `lovable-assets` o archivo local, siguiendo el patrón de las otras arepas.
- Nuevo objeto en el array de productos de `src/pages/Productos.tsx` con `id: "arepa-yuca-rellena-queso"`.
- Insert en la tabla `products` y nueva entrada en `PRODUCT_ID_MAP` con el UUID generado.
