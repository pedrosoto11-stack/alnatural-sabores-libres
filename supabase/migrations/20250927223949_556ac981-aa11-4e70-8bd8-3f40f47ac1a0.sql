-- Create client management and access code system

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create access_codes table with unique code generation
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_clients table to link authenticated users to clients
CREATE TABLE public.user_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for clients (admin access needed)
CREATE POLICY "Clients are only accessible by admin" 
ON public.clients 
FOR ALL 
USING (false);

-- Create RLS policies for access_codes (function access only)
CREATE POLICY "Access codes are only accessible by functions" 
ON public.access_codes 
FOR ALL 
USING (false);

-- Create RLS policies for user_clients (users can see their own links)
CREATE POLICY "Users can view their own client links" 
ON public.user_clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own client links" 
ON public.user_clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for orders (users can see their own orders)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items (accessible through order relationship)
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create function to validate access codes
CREATE OR REPLACE FUNCTION public.validate_access_code(access_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create function to generate unique access codes
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code in format ALN-XXXX-XXXX
    new_code := 'ALN-' || 
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' ||
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.access_codes WHERE code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('Arepa de Yuca', 'Arepa tradicional de yuca, libre de gluten', 2500.00, 'arepas', '/src/assets/arepa-yuca.png'),
('Arepa de Plátano Verde', 'Arepa de plátano verde, sabor único', 2800.00, 'arepas', '/src/assets/arepa-platano-verde.png'),
('Fajita de Yuca', 'Fajita crujiente de yuca', 3200.00, 'fajitas', '/src/assets/fajita-yuca.png'),
('Tequeños de Plátano', 'Tequeños rellenos de queso, masa de plátano', 4500.00, 'tequenos', '/src/assets/tequenos-platano-verde.png'),
('Patacones Tradicionales', 'Patacones crujientes tradicionales', 3800.00, 'patacones', '/src/assets/patacones.png'),
('Panes Artesanales (4 unidades)', 'Panes sin gluten, pack de 4 unidades', 5500.00, 'panes', '/src/assets/panes-4-unidades.png');