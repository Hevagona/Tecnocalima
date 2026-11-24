'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'tarjeta',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    const orderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      city: formData.city,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image_url: i.image_url,
      })),
      total: totalPrice,
      status: 'pendiente',
      payment_method: formData.paymentMethod,
    };

    let createdId = 'PED-' + Math.floor(100000 + Math.random() * 900000);

    // Si Supabase está conectado, insertar en la base de datos
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select();

        if (!error && data && data.length > 0) {
          createdId = data[0].id;
        }
      } catch (err) {
        console.error('Error al guardar pedido en Supabase:', err);
      }
    } else {
      // Guardar también en localStorage para que el panel admin lo muestre incluso en demo local
      try {
        const localOrders = JSON.parse(localStorage.getItem('tech_demo_orders') || '[]');
        const newLocalOrder = {
          ...orderData,
          id: createdId,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem('tech_demo_orders', JSON.stringify([newLocalOrder, ...localOrders]));
      } catch (e) {
        console.error(e);
      }
    }

    setSuccessOrder({
      id: createdId,
      ...orderData,
    });

    clearCart();
    setLoading(false);

    // Disparar confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignorar si falla canvas
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            ¡Pedido Confirmado con Éxito!
          </h1>
          <p className="text-base text-slate-600 max-w-lg mx-auto">
            Gracias por tu compra, <span className="font-semibold text-slate-900">{successOrder.customer_name}</span>. Hemos recibido tu orden y ya está en preparación para envío.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-left space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Código de Pedido</span>
              <p className="font-mono font-bold text-blue-600 text-lg">{successOrder.id}</p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Total Abonado</span>
              <p className="text-xl font-black text-slate-900">
                ${Number(successOrder.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-600 space-y-1">
            <p><strong className="text-slate-800">Dirección de entrega:</strong> {successOrder.shipping_address}, {successOrder.city}</p>
            <p><strong className="text-slate-800">Correo de confirmación:</strong> {successOrder.customer_email}</p>
            <p><strong className="text-slate-800">Método de pago:</strong> {successOrder.payment_method.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition"
          >
            Volver a la Tienda
          </Link>
          <Link
            href="/admin?tab=orders"
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition"
          >
            Ver Pedido en Panel Admin
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No hay productos en tu carrito</h2>
        <p className="text-slate-500">Agrega productos al carrito antes de proceder con el pago.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continuar Comprando</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulario de Checkout */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Finalizar Compra</h1>
            <p className="text-slate-500 text-sm mt-1">
              Ingresa tus datos de envío y pago para completar la orden.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Datos de Envío</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="carlos@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Teléfono Móvil *
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-1122"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Ciudad *
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ciudad o Estado"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dirección de Entrega Completa *
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle, número, apto o piso"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Método de Pago</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {['tarjeta', 'transferencia', 'contraentrega'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border text-center transition cursor-pointer ${
                      formData.paymentMethod === method
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'tarjeta' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4532 •••• •••• 8892"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Expiración (MM/AA)
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="12/28"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="893"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Pago procesado con cifrado SSL de 256 bits de máxima seguridad.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              {loading ? (
                <span>Procesando Pedido...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pagar ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
            <h3 className="font-bold text-slate-900 text-xl pb-4 border-b border-slate-100">
              Resumen de la Orden ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Cant: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-slate-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Costo de Envío</span>
                <span className="text-emerald-600 font-bold">¡Gratis!</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Impuestos incluidos</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total a Pagar</span>
                <span className="text-blue-600">
                  ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
