-- Add logo columns to invoices table
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS logo_position text DEFAULT 'right';
