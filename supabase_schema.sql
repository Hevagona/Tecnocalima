-- SQL PARA SUPABASE (Ejecutar en Supabase SQL Editor)
-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagado', 'enviado', 'completado', 'cancelado')),
  payment_method TEXT DEFAULT 'tarjeta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS) pero permitir operaciones públicas para la tienda
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para products (Lectura pública, Inserción/Modificación pública para demo o vía Service Role)
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON products FOR DELETE USING (true);

-- Políticas para orders (Cualquiera puede crear pedido, y ver pedidos para admin)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON orders FOR DELETE USING (true);

-- 4. Storage Bucket para imágenes de productos
-- En Supabase Dashboard -> Storage -> Crear bucket llamado 'products' y marcar como 'Public bucket'.
-- O ejecutar:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access Products Bucket" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

CREATE POLICY "Public Upload Products Bucket" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'products' );

CREATE POLICY "Public Update Products Bucket" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'products' );

-- 5. Insertar datos de prueba iniciales
INSERT INTO products (name, description, price, category, image_url, stock)
VALUES 
('Laptop Gamer Legion Pro 5', 'Procesador AMD Ryzen 7, 32GB RAM, 1TB SSD NVMe, NVIDIA RTX 4070. Pantalla QHD 165Hz de alta precisión de color.', 1499.99, 'Laptops', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', 8),
('Smartphone Ultra Max 5G', 'Pantalla AMOLED 120Hz 6.7 pulgadas, cámara principal de 200MP con zoom óptico 5x, 512GB almacenamiento y batería de 5000mAh.', 999.00, 'Smartphones', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', 15),
('Auriculares Inalámbricos Pro ANC', 'Cancelación activa de ruido inteligente con transductores de audio espacial, 40 horas de autonomía y estuche con carga rápida.', 199.99, 'Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 25),
('Monitor Curvo 34" UltraWide 144Hz', 'Resolución 3440x1440 WQHD, tiempo de respuesta 1ms, soporte HDR400 y curvatura inmersiva 1500R.', 449.50, 'Monitores', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', 10),
('Teclado Mecánico Custom RGB', 'Switches mecánicos lubricados de fábrica, formato 75%, estructura con espuma insonorizante y conectividad Bluetooth/2.4G/USB-C.', 119.00, 'Periféricos', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', 30),
('Smartwatch Titanium Pro', 'Caja de titanio de grado aeroespacial, cristal de zafiro, sensor ECG, monitor de oxígeno y resistencia al agua 50m.', 289.00, 'Wearables', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 12);
