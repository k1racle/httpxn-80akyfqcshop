-- Add contact_email to orders table for notifications
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS contact_email TEXT;