import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Truck, Clock, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Garantías y Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-14 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50">
            <Truck className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-base">Envío Exprés</h4>
              <p className="text-xs text-slate-400">Entregas rápidas y seguras a todo el país</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-base">Garantía Oficial</h4>
              <p className="text-xs text-slate-400">12 meses de garantía directa de fábrica</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50">
            <RefreshCw className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-base">Devolución Fácil</h4>
              <p className="text-xs text-slate-400">Hasta 30 días para cambios sin costo</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50">
            <Clock className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-base">Soporte 24/7</h4>
              <p className="text-xs text-slate-400">Asistencia técnica especializada</p>
            </div>
          </div>
        </div>

        {/* Enlaces principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                TECH<span className="text-blue-500">NOVA</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tu destino definitivo para dispositivos, computadores y accesorios tecnológicos de última generación.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold text-base mb-4">Categorías Populares</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#catalogo" className="hover:text-blue-400 transition">Laptops & Computadores</Link></li>
              <li><Link href="/#catalogo" className="hover:text-blue-400 transition">Smartphones & Móviles</Link></li>
              <li><Link href="/#catalogo" className="hover:text-blue-400 transition">Audio & Auriculares</Link></li>
              <li><Link href="/#catalogo" className="hover:text-blue-400 transition">Monitores & Pantallas</Link></li>
              <li><Link href="/#catalogo" className="hover:text-blue-400 transition">Periféricos & Teclados</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-base mb-4">Administración</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="hover:text-blue-400 transition">Panel de Control</Link></li>
              <li><Link href="/admin?tab=products" className="hover:text-blue-400 transition">Gestionar Productos</Link></li>
              <li><Link href="/admin?tab=orders" className="hover:text-blue-400 transition">Historial de Pedidos</Link></li>
              <li><Link href="/checkout" className="hover:text-blue-400 transition">Proceso de Checkout</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-base mb-4">Contacto</h5>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contacto@technova.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (800) 555-TECH</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Av. Tecnológica 1024, Silicon Valley</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TECHNOVA. Todos los derechos reservados. Diseñado para alta velocidad y sincronización con Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
