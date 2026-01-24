-- Fix overly permissive RLS policy for listing_views
-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can log views" ON public.listing_views;

-- Create more restrictive policy - users can only log their own views
CREATE POLICY "Authenticated users can log views"
ON public.listing_views FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = viewer_id OR viewer_id IS NULL);