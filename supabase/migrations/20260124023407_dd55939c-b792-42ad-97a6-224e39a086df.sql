-- ============================================
-- 1. Add new statuses to submission_status enum
-- ============================================
ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'on_hold';
ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'cancelled';

-- ============================================
-- 2. Add hold expiration column to ip_submissions
-- ============================================
ALTER TABLE public.ip_submissions 
ADD COLUMN IF NOT EXISTS hold_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS hold_reason TEXT;

-- ============================================
-- 3. Create submission history table
-- ============================================
CREATE TABLE public.submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.ip_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'document_added', 'on_hold', 'cancelled'
  changes JSONB, -- Store what changed: {field: {old: x, new: y}}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submission_history ENABLE ROW LEVEL SECURITY;

-- Users can view history of their own submissions
CREATE POLICY "Users can view their submission history"
ON public.submission_history FOR SELECT
USING (
  submission_id IN (
    SELECT id FROM public.ip_submissions WHERE user_id = auth.uid()
  )
);

-- Users can insert history for their own submissions
CREATE POLICY "Users can add history to their submissions"
ON public.submission_history FOR INSERT
WITH CHECK (
  submission_id IN (
    SELECT id FROM public.ip_submissions WHERE user_id = auth.uid()
  )
);

-- Admins can view all history
CREATE POLICY "Admins can view all history"
ON public.submission_history FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 4. Create seller reviews table
-- ============================================
CREATE TABLE public.seller_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL, -- user being reviewed
  reviewer_id UUID NOT NULL, -- user leaving review
  submission_id UUID REFERENCES public.ip_submissions(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  deal_completed BOOLEAN NOT NULL DEFAULT false, -- was the deal successful?
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, submission_id) -- one review per submission per reviewer
);

-- Enable RLS
ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON public.seller_reviews FOR SELECT
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON public.seller_reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id AND auth.uid() != seller_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
ON public.seller_reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON public.seller_reviews FOR DELETE
USING (auth.uid() = reviewer_id);

-- ============================================
-- 5. Add RLS policy for users to update their own submissions
-- ============================================
CREATE POLICY "Users can update their own submissions"
ON public.ip_submissions FOR UPDATE
USING (auth.uid() = user_id AND status NOT IN ('published', 'sold'));

-- ============================================
-- 6. Create indexes for performance
-- ============================================
CREATE INDEX idx_submission_history_submission_id ON public.submission_history(submission_id);
CREATE INDEX idx_seller_reviews_seller_id ON public.seller_reviews(seller_id);
CREATE INDEX idx_seller_reviews_submission_id ON public.seller_reviews(submission_id);

-- ============================================
-- 7. Trigger for updating updated_at on reviews
-- ============================================
CREATE TRIGGER update_seller_reviews_updated_at
BEFORE UPDATE ON public.seller_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();