-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Makanan', 'Minuman', 'Lainnya')),
  stock_status TEXT NOT NULL DEFAULT 'Tersedia' CHECK (stock_status IN ('Tersedia', 'Habis')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create header_images table for slider
CREATE TABLE public.header_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(position)
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.header_images ENABLE ROW LEVEL SECURITY;

-- Public read access for menu items
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items
  FOR SELECT
  USING (true);

-- Public read access for header images
CREATE POLICY "Anyone can view header images"
  ON public.header_images
  FOR SELECT
  USING (true);

-- Admin access for menu items (authenticated users can manage)
CREATE POLICY "Authenticated users can insert menu items"
  ON public.menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON public.menu_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete menu items"
  ON public.menu_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Admin access for header images
CREATE POLICY "Authenticated users can insert header images"
  ON public.header_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update header images"
  ON public.header_images
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete header images"
  ON public.header_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default header images (placeholders)
INSERT INTO public.header_images (position, image_url) VALUES
  (1, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200'),
  (2, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200'),
  (3, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200'),
  (4, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200'),
  (5, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200');

-- Insert sample menu items
INSERT INTO public.menu_items (name, price, image_url, category, stock_status) VALUES
  ('Nasi Goreng Spesial', 25000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'Makanan', 'Tersedia'),
  ('Ayam Bakar', 30000, 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400', 'Makanan', 'Tersedia'),
  ('Soto Ayam', 20000, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 'Makanan', 'Tersedia'),
  ('Es Teh Manis', 5000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Minuman', 'Tersedia'),
  ('Jus Alpukat', 15000, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', 'Minuman', 'Tersedia'),
  ('Kopi Susu', 10000, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', 'Minuman', 'Tersedia'),
  ('Sampoerna Mild', 25000, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', 'Lainnya', 'Tersedia'),
  ('Kerupuk Udang', 8000, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', 'Lainnya', 'Tersedia');