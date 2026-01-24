-- Create listings table for published IP objects
CREATE TABLE public.ip_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.ip_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  registration_number TEXT,
  price NUMERIC(12, 2),
  price_negotiable BOOLEAN DEFAULT false,
  documents TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  cart_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ip_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active listings
CREATE POLICY "Anyone can view active listings"
ON public.ip_listings FOR SELECT
USING (status = 'active');

-- Users can view their own listings regardless of status
CREATE POLICY "Users can view their own listings"
ON public.ip_listings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage all listings
CREATE POLICY "Admins can manage listings"
ON public.ip_listings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.ip_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
ON public.favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.ip_listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart"
ON public.cart_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own cart"
ON public.cart_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own cart"
ON public.cart_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Purchase orders table
CREATE TYPE public.order_status AS ENUM ('pending', 'manager_review', 'payment_ready', 'payment_expired', 'paid', 'completed', 'cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.ip_listings(id) ON DELETE SET NULL,
  listing_snapshot JSONB NOT NULL, -- Store listing details at time of order
  status order_status NOT NULL DEFAULT 'pending',
  price NUMERIC(12, 2) NOT NULL,
  payment_url TEXT,
  payment_expires_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Listing views tracking
CREATE TABLE public.listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.ip_listings(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (for tracking)
CREATE POLICY "Anyone can log views"
ON public.listing_views FOR INSERT
TO authenticated
WITH CHECK (true);

-- Listing owners can view their analytics
CREATE POLICY "Owners can view their listing analytics"
ON public.listing_views FOR SELECT
TO authenticated
USING (
  listing_id IN (SELECT id FROM public.ip_listings WHERE user_id = auth.uid())
);

-- Admins can view all
CREATE POLICY "Admins can view all analytics"
ON public.listing_views FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_ip_listings_updated_at
BEFORE UPDATE ON public.ip_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update listing counters
CREATE OR REPLACE FUNCTION public.update_listing_favorites_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ip_listings SET favorites_count = favorites_count + 1 WHERE id = NEW.listing_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ip_listings SET favorites_count = GREATEST(favorites_count - 1, 0) WHERE id = OLD.listing_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_favorites_count
AFTER INSERT OR DELETE ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION public.update_listing_favorites_count();

CREATE OR REPLACE FUNCTION public.update_listing_cart_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ip_listings SET cart_count = cart_count + 1 WHERE id = NEW.listing_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ip_listings SET cart_count = GREATEST(cart_count - 1, 0) WHERE id = OLD.listing_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_cart_count
AFTER INSERT OR DELETE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_listing_cart_count();

CREATE OR REPLACE FUNCTION public.increment_listing_views()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE ip_listings SET views_count = views_count + 1 WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER increment_views_count
AFTER INSERT ON public.listing_views
FOR EACH ROW
EXECUTE FUNCTION public.increment_listing_views();