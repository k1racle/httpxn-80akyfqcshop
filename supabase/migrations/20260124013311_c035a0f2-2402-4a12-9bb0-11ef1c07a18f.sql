-- Ensure admins can insert listings (they already have ALL via existing policy, but let's be explicit)
-- Also add policy for admins to insert into ip_listings if not covered by ALL

-- Check and update the existing admin policy to ensure INSERT is covered
-- The existing "Admins can manage listings" with ALL command should handle this,
-- but we need to make sure it has a WITH CHECK clause for inserts

DROP POLICY IF EXISTS "Admins can manage listings" ON public.ip_listings;

CREATE POLICY "Admins can manage listings" 
ON public.ip_listings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));