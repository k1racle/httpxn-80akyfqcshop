-- Allow users to cancel their own pending orders
CREATE POLICY "Users can cancel their own pending orders"
ON public.orders
FOR UPDATE
USING (
  auth.uid() = user_id 
  AND status IN ('pending', 'manager_review')
)
WITH CHECK (
  auth.uid() = user_id 
  AND status = 'cancelled'
);