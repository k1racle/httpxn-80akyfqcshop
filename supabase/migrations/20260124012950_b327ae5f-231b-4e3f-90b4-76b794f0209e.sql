-- Update RLS policy to allow viewing published listings
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.ip_listings;

CREATE POLICY "Anyone can view published listings" 
ON public.ip_listings 
FOR SELECT 
USING (status IN ('active', 'published'));