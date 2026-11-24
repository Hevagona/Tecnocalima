'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured, INITIAL_PRODUCTS } from '@/lib/supabase';
import { Product, Order } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Upload, 
  ArrowLeft, 
  Database, 
  Search, 
  Save, 
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Formulario Producto Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Laptops',
    image_url: '',
    stock: '10',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const configured = isSupabaseConfigured();
    setIsSupabaseLive(configured);

    if (configured && supabase) {
      // 1. Cargar productos desde Supabase
      try {
        const { data: prodData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodData && prodData.length > 0) {
          setProducts(prodData as Product[]);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (err) {
        console.error('Error al cargar productos de Supabase:', err);
      }

      // 2. Cargar pedidos desde Supabase
      try {
        const { data: ordData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordData) {
          setOrders(ordData as Order[]);
        }
      } catch (err) {
        console.error('Error al cargar pedidos de Supabase:', err);
      }
    } else {
      // Cargar productos y pedidos de LocalStorage en modo Demo
      try {
        const savedLocalProducts = localStorage.getItem('tech_demo_products');
        if (savedLocalProducts) {
          setProducts(JSON.parse(savedLocalProducts));
        } else {
          setProducts(INITIAL_PRODUCTS);
        }

        const savedLocalOrders = localStorage.getItem('tech_demo_orders');
        if (savedLocalOrders) {
          setOrders(JSON.parse(savedLocalOrders));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  // Subir imagen a Supabase Storage o convertir a DataURL / URL pública
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    if (isSupabaseLive && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        setProductForm((prev) => ({ ...prev, image_url: data.publicUrl }));
      } catch (err: any) {
        alert('Error al subir al bucket de Supabase: ' + (err.message || 'Verifica que el bucket "products" sea público. Usando preview local.'));
        // Fallback a lectura de archivo base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm((prev) => ({ ...prev, image_url: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      // En modo demo convertimos a Base64 data url
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
    setUploadingImage(false);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      stock: '15',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProductData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price) || 0,
      category: productForm.category,
      image_url: productForm.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      stock: parseInt(productForm.stock) || 0,
    };

    if (isSupabaseLive && supabase) {
      try {
        if (editingProduct) {
          const { error } = await supabase
            .from('products')
            .update(newProductData)
            .eq('id', editingProduct.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([newProductData]);

          if (error) throw error;
        }
        await loadData();
      } catch (err: any) {
        alert('Error al guardar en Supabase: ' + err.message);
      }
    } else {
      // Manejo LocalStorage
      let updated: Product[];
      if (editingProduct) {
        updated = products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...newProductData } : p
        );
      } else {
        const created: Product = {
          ...newProductData,
          id: 'PROD-' + Date.now(),
          created_at: new Date().toISOString(),
        };
        updated = [created, ...products];
      }
      setProducts(updated);
      localStorage.setItem('tech_demo_products', JSON.stringify(updated));
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    if (isSupabaseLive && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await loadData();
      } catch (err: any) {
        alert('Error al eliminar de Supabase: ' + err.message);
      }
    } else {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('tech_demo_products', JSON.stringify(updated));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (isSupabaseLive && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);

        if (error) throw error;
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } catch (err: any) {
        alert('Error al actualizar estado: ' + err.message);
      }
    } else {
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      setOrders(updated);
      localStorage.setItem('tech_demo_orders', JSON.stringify(updated));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión de catálogo con imágenes, inventario en tiempo real y seguimiento de órdenes.
          </p>
        </div>

        {/* Badge Estado Supabase */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold border ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isSupabaseLive ? 'Sincronizado con Supabase' : 'Modo Demo (Local)'}</span>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-200/70 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos ({orders.length})</span>
          </button>
        </div>

        {/* Buscador dentro del admin */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'products' ? 'Buscar producto...' : 'Buscar pedido o cliente...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* CONTENIDO TAB PRODUCTOS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No se encontraron productos registrados.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-base">{product.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-sm">
                            {product.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-base">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold px-2.5 py-1 rounded-md text-xs ${
                            product.stock > 5
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition inline-flex"
                          title="Editar producto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition inline-flex"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENIDO TAB PEDIDOS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No hay pedidos registrados aún</h3>
              <p className="text-slate-500 text-sm mt-1">
                Cuando los clientes completen sus compras en el checkout, aparecerán aquí.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-blue-600 text-base">
                        #{order.id.slice(0, 12)}
                      </span>
                      <span
                        className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
                          order.status === 'completado' || order.status === 'pagado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'enviado'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Fecha: {new Date(order.created_at || Date.now()).toLocaleString()}
                    </p>
                  </div>

                  {/* Selector de Estado */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Cambiar estado:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="enviado">Enviado</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1">Cliente</h5>
                    <p className="text-slate-600 font-medium">{order.customer_name}</p>
                    <p className="text-slate-500 text-xs">{order.customer_email}</p>
                    <p className="text-slate-500 text-xs">{order.customer_phone}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1">Dirección de Entrega</h5>
                    <p className="text-slate-600 text-xs">{order.shipping_address}</p>
                    <p className="text-slate-500 text-xs">Ciudad: {order.city}</p>
                    <p className="text-slate-500 text-xs">Método: {order.payment_method}</p>
                  </div>
                  <div className="md:text-right">
                    <h5 className="font-bold text-slate-800 mb-1">Total del Pedido</h5>
                    <p className="text-2xl font-black text-slate-900">
                      ${Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block truncate max-w-xs">{item.name}</span>
                        <span className="text-slate-500 font-medium">
                          {item.quantity} x ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL CREAR / EDITAR PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej. Laptop ASUS Zenbook 14 OLED"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Precio ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="799.99"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Stock Disponible *
                  </label>
                  <input
                    required
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Categoría
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Audio">Audio</option>
                  <option value="Monitores">Monitores</option>
                  <option value="Periféricos">Periféricos</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>

              {/* Subida o URL de Imagen */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Imagen del Producto *
                </label>
                <div className="flex gap-4 items-center">
                  {productForm.image_url ? (
                    <img
                      src={productForm.image_url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-slate-50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Subiendo imagen...' : 'Subir Imagen desde equipo'}</span>
                    </button>
                    <input
                      type="text"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      placeholder="O pega una URL directa de imagen (https://...)"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Especificaciones técnicas, memoria, procesador, etc."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold text-sm hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Producto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
