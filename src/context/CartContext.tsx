'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  notification: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos el estado vacío para evitar desajustes de hidratación SSR
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // 1. Cargar desde localStorage una sola vez al montar el componente en el cliente
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tech_store_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error('Error al leer de localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // 2. Guardar en localStorage solo después de la carga inicial
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tech_store_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) return;

    setCart((prevCart) => {
      const prodId = String(product.id);
      const existing = prevCart.find((item) => String(item.id) === prodId);

      if (existing) {
        return prevCart.map((item) =>
          String(item.id) === prodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            price: Number(product.price) || 0,
            quantity: quantity,
          },
        ];
      }
    });

    // Abrir automáticamente el drawer para mostrar al usuario su compra
    setIsCartOpen(true);
    setNotification(`¡Agregado al carrito: ${product.name}!`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const removeFromCart = (productId: string) => {
    const targetId = String(productId);
    setCart((prev) => prev.filter((item) => String(item.id) !== targetId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const targetId = String(productId);
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === targetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        notification,
      }}
    >
      {children}

      {/* Notificación flotante informativa */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}
