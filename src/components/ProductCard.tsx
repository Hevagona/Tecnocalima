'use client';

import React from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart, setIsCartOpen } = useCart();
  const cartItem = cart.find((item) => String(item.id) === String(product.id));
  const inCart = Boolean(cartItem);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Imagen */}
      <div 
        onClick={() => setIsCartOpen(true)}
        className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-slate-800 dark:text-slate-200 rounded-full shadow-xs uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-4">
            <span className="px-2.5 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-md shadow-xs">
              ¡Solo quedan {product.stock}!
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs text-slate-400 ml-1 font-semibold">5.0</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              Precio Oferta
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className={`px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer select-none ${
              inCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-105 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Agregado ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
