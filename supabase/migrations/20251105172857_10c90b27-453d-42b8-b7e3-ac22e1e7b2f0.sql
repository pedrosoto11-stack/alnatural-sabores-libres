-- Allow admins to update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));