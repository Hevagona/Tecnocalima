import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock products catálogo base
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop Gamer Legion Pro 5',
    description: 'Procesador AMD Ryzen 7, 32GB RAM, 1TB SSD NVMe, NVIDIA RTX 4070. Pantalla QHD 165Hz con excelente tasa de refresco.',
    price: 1499.99,
    category: 'Laptops',
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    stock: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Smartphone Ultra Max 5G',
    description: 'Pantalla AMOLED 120Hz 6.7", cámara de 200MP con zoom óptico, 512GB de almacenamiento y batería de larga duración.',
    price: 999.00,
    category: 'Smartphones',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Auriculares Inalámbricos Pro ANC',
    description: 'Cancelación activa de ruido de nivel profesional, audio espacial 360°, 40h de batería y carga rápida USB-C.',
    price: 199.99,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Monitor Curvo 34" UltraWide 144Hz',
    description: 'Resolución WQHD 3440x1440, tiempo de respuesta 1ms, HDR400, con curvatura envolvente ideal para productividad y juegos.',
    price: 449.50,
    category: 'Monitores',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    stock: 10,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Teclado Mecánico Custom RGB',
    description: 'Switches táctiles mecánicos pre-lubricados, formato compacto 75%, hot-swap y conexión inalámbrica triple modo.',
    price: 119.00,
    category: 'Periféricos',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Smartwatch Titanium Pro',
    description: 'Cuerpo de titanio y cristal de zafiro, medición de salud 24/7, GPS dual de alta precisión y batería para 14 días.',
    price: 289.00,
    category: 'Wearables',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    created_at: new Date().toISOString()
  }
];

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') && 
    supabaseUrl.startsWith('http')
  );
};

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Error al instanciar Supabase Client:', err);
    return null;
  }
};

export const supabase = getSupabaseClient();
