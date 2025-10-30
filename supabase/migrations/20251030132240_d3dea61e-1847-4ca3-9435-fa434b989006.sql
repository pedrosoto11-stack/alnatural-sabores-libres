-- Make email column nullable in clients table
ALTER TABLE public.clients ALTER COLUMN email DROP NOT NULL;