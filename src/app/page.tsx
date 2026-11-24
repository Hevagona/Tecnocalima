'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { supabase, INITIAL_PRODUCTS, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Monitor, 
  Keyboard, 
  Watch,
  ArrowRight,
  Database
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      // 1. Verificamos si hay productos creados localmente en el admin
      let fallbackList = INITIAL_PRODUCTS;
      if (typeof window !== 'undefined') {
        try {
          const savedLocal = localStorage.getItem('tech_demo_products');
          if (savedLocal) {
            const parsed = JSON.parse(savedLocal);
            if (Array.isArray(parsed) && parsed.length > 0) {
              fallbackList = parsed;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Si Supabase está configurado, intentamos consultar con un timeout de 4 segundos
      if (isSupabaseConfigured() && supabase) {
        try {
          // Timeout para evitar que se quede en blanco o colgado si la tabla no existe aún
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout Supabase')), 4000)
          );

          const queryPromise = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          const res: any = await Promise.race([queryPromise, timeoutPromise]);
          const { data, error } = res || {};

          if (!error && Array.isArray(data) && data.length > 0) {
            if (isMounted) {
              setProducts(data as Product[]);
              setSupabaseConnected(true);
            }
            return;
          }
        } catch (e) {
          console.warn('No se pudo obtener de Supabase (o tabla aún no creada en el editor SQL), usando catálogo local:', e);
        }
      }

      // Si Supabase no responde o la tabla está vacía, aseguramos mostrar el catálogo de productos
      if (isMounted) {
        setProducts(fallbackList);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { name: 'Todos', icon: Layers },
    { name: 'Laptops', icon: Laptop },
    { name: 'Smartphones', icon: Smartphone },
    { name: 'Audio', icon: Headphones },
    { name: 'Monitores', icon: Monitor },
    { name: 'Periféricos', icon: Keyboard },
    { name: 'Wearables', icon: Watch },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Todos' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Indicador de estado */}
      {!supabaseConnected && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-blue-900 flex items-center justify-center gap-2">
          <Database className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Catálogo Activo:</strong> Mostrando productos disponibles en inventario. Para sincronizar tu base de datos de Supabase ejecuta el script <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono text-xs">supabase_schema.sql</code> en tu Supabase SQL Editor.
          </span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Nuevos Lanzamientos Tecnológicos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Potencia Tu Estilo de Vida con{' '}
            <span className="text-blue-400">
              Tecnología de Élite
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Descubre los dispositivos y herramientas digitales con mejor rendimiento, diseño y garantía oficial.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#catalogo"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 transition-all text-base flex items-center gap-2"
            >
              <span>Ver Catálogo</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/admin"
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold rounded-2xl backdrop-blur-md transition-all text-base"
            >
              Panel Administrador
            </a>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Filtros y Buscador */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          {/* Buscador */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, procesador, modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-base transition"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Mostrando {filteredProducts.length} producto(s)</span>
          </div>
        </div>

        {/* Categorías Pills */}
        <div id="categorias" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-slate-200 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-xl font-bold text-slate-800">No se encontraron productos</p>
            <p className="text-sm text-slate-500 mt-2">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
