-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.validate_access_code(access_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result JSON;
  client_data RECORD;
BEGIN
  -- Find the access code and client
  SELECT ac.id, ac.code, ac.is_active, ac.expires_at, c.id as client_id, c.name, c.email, c.company
  INTO client_data
  FROM public.access_codes ac
  JOIN public.clients c ON ac.client_id = c.id
  WHERE ac.code = UPPER(TRIM(access_code))
  AND ac.is_active = true
  AND c.is_active = true
  AND (ac.expires_at IS NULL OR ac.expires_at > now());

  IF client_data.id IS NULL THEN
    result := json_build_object(
      'valid', false,
      'message', 'Código de acceso inválido o expirado'
    );
  ELSE
    result := json_build_object(
      'valid', true,
      'client_id', client_data.client_id,
      'client_name', client_data.name,
      'client_email', client_data.email,
      'client_company', client_data.company,
      'message', 'Código válido'
    );
  END IF;

  RETURN result;
END;
$$;