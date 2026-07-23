## Objetivo

Asegurar que solo el administrador **pedrosoto11@gmail.com** pueda ver y usar la opción de editar precios en la página de Productos. Los clientes que ingresen con código de acceso (o cualquier otro usuario autenticado) no deben ver el ícono de lápiz ni poder invocar la actualización de precio.

## Estado actual verificado

- En la base de datos, la tabla `user_roles` tiene un único registro con rol `admin` para `pedrosoto11@gmail.com`.
- `AdminContext` calcula `isAdmin` consultando `user_roles`, así que en teoría solo ese correo obtiene `isAdmin = true`.
- En `Productos.tsx` los botones/inputs de edición ya están envueltos en `isAdmin && ...`.
- Aun así, el usuario reporta que clientes ven la opción. Esto puede ocurrir si:
  1. El cliente inició sesión en el mismo navegador con la cuenta admin previamente (sesión persistida) y luego usó un código de acceso.
  2. En el futuro se agrega otro rol `admin` en `user_roles` por error.
  3. Alguien manipula el estado del cliente para forzar `isAdmin = true`.

Para eliminar los tres riesgos añadimos una verificación explícita por correo (defensa en profundidad) en frontend y backend.

## Cambios propuestos

### 1. `src/contexts/AdminContext.tsx`
- Añadir constante `ADMIN_EMAIL = "pedrosoto11@gmail.com"`.
- Cambiar `setIsAdmin(adminStatus)` por `setIsAdmin(adminStatus && session.user.email?.toLowerCase() === ADMIN_EMAIL)` en las dos ramas donde se calcula (getSession inicial y onAuthStateChange).
- Resultado: aunque exista otro admin en `user_roles` o alguien manipule la respuesta, el frontend solo activa la UI de admin para ese correo.

### 2. `supabase/functions/update-product-price/index.ts`
- Después de obtener `user` con `supabase.auth.getUser(token)` y antes/además de verificar el rol, comprobar `user.email?.toLowerCase() === "pedrosoto11@gmail.com"`.
- Si no coincide, devolver `403` con `"No tienes permisos para modificar precios"`.
- Mantener también la verificación de `user_roles` como capa adicional.

### 3. Verificación
- Con la sesión de Lovable Cloud activa (si es la del admin), probar `supabase--curl_edge_functions` a `/update-product-price` con un `productId` real y un `newPrice` inválido para confirmar validación 400/403 según corresponda.
- Confirmar visualmente en la vista Productos que:
  - Sin sesión / con código de acceso: sin ícono de lápiz.
  - Con sesión admin (pedrosoto11): ícono de lápiz visible y edición funcional.

## Fuera de alcance

- No se tocan otros permisos (gestión de clientes, códigos de acceso).
- No se modifica el esquema de `user_roles` ni sus políticas RLS.
- No se cambia la visibilidad de precios para clientes con código (siguen viendo precios, solo no pueden editarlos).
