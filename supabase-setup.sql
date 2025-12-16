-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'resolved')),
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table (for future use)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  code VARCHAR(100) UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_inquiries
-- Allow public to insert (for contact form)
CREATE POLICY "Allow public insert on contact_inquiries" ON contact_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all (for admin)
CREATE POLICY "Allow authenticated read on contact_inquiries" ON contact_inquiries
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update (for admin)
CREATE POLICY "Allow authenticated update on contact_inquiries" ON contact_inquiries
  FOR UPDATE TO authenticated
  USING (true);

-- Create policies for products
-- Allow public to read products
CREATE POLICY "Allow public read on products" ON products
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert/update products (for admin)
CREATE POLICY "Allow authenticated insert on products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on products" ON products
  FOR UPDATE TO authenticated
  USING (true);

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for product images
CREATE POLICY "Allow public read on product images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated upload on product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated update on product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated delete on product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_contact_inquiries_updated_at 
  BEFORE UPDATE ON contact_inquiries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO contact_inquiries (name, email, subject, message) VALUES
-- ('Test User', 'test@example.com', 'Test Inquiry', 'This is a test message from the setup script.');

COMMENT ON TABLE contact_inquiries IS 'Stores contact form submissions from the website';
COMMENT ON TABLE products IS 'Stores product information with images stored in Supabase storage';