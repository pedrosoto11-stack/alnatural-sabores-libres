-- Add RLS policy for users to view their linked clients
CREATE POLICY "Users can view their linked clients"
ON public.clients FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_clients
    WHERE user_clients.client_id = clients.id
    AND user_clients.user_id = auth.uid()
  )
);

-- Add UPDATE policies for orders table
-- Users can cancel their own pending orders
CREATE POLICY "Users can cancel pending orders"
ON public.orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  AND status = 'pending'
)
WITH CHECK (
  status IN ('pending', 'cancelled')
);

-- Admins can update any order status
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (true);