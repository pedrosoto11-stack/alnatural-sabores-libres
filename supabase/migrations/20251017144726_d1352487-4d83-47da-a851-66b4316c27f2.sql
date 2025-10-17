-- Hacer user_id nullable en la tabla orders para permitir pedidos con código de acceso
ALTER TABLE public.orders 
ALTER COLUMN user_id DROP NOT NULL;