'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingCart, 
  Cpu, 
  Menu, 
  X, 
  LayoutDashboard, 
  ShoppingBag,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                TECH<span className="text-blue-600">NOVA</span>
              </span>
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Tienda de Tecnología
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-slate-700 dark:text-slate-200">
            <Link 
              href="/" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Catálogo
            </Link>
            <Link 
              href="/#categorias" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Categorías
            </Link>
            <Link 
              href="/#garantia" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Garantía Oficial
            </Link>
            <Link 
              href="/admin" 
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Admin Panel</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito"
              className="relative p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3 font-medium text-lg">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Catálogo de Productos
            </Link>
            <Link 
              href="/#categorias" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Categorías
            </Link>
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold dark:bg-slate-800 dark:text-blue-400"
            >
              Panel de Administración
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
