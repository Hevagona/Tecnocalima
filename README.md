# TECHNOVA - Tienda de Tecnología

Plataforma de comercio electrónico para venta de productos tecnológicos de última generación, desarrollada con **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** y preparada para desplegar en **Vercel** y **GitHub**.

---

## 🚀 Características Principales

1. **Diseño Moderno y Legible**:
   - Tipografía con tamaños claros, pesos balanceados y alto contraste.
   - Componentes interactivos: cards de producto con etiquetas dinámicas, hero banner y menús responsivos.
   - Notificaciones y animaciones de confeti al completar compras.

2. **Sistema de Carrito de Compras**:
   - Drawer lateral accesible en toda la tienda.
   - Contador en tiempo real en la barra de navegación.
   - Modificación de cantidades, cálculo automático de totales y persistencia de sesión.

3. **Proceso de Checkout Completo**:
   - Formulario de datos de cliente, dirección de despacho y método de pago (Tarjeta, Transferencia, Contraentrega).
   - Generación de código de pedido único.
   - Registro automático en base de datos.

4. **Panel de Administración (`/admin`)**:
   - **Gestión de Productos**: Creación y edición con carga de imágenes (subida directa a Supabase Storage o URL externa), categorización, precio y stock.
   - **Gestión de Pedidos**: Visualización en tiempo real de pedidos de clientes, desglose de ítems comprados, cliente, dirección y cambio de estados (*pendiente*, *pagado*, *enviado*, *completado*, *cancelado*).

5. **Sincronización con Supabase & Modo Fallback**:
   - Totalmente integrado con Supabase (Postgres & Storage).
   - En caso de no configurar claves inmediatamente, la tienda cuenta con un modo de demostración local sin romperse, ideal para pruebas de interfaz.

---

## 🛠️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** de tu proyecto Supabase y copia/pega el contenido de [`supabase_schema.sql`](./supabase_schema.sql).
3. Asegúrate de tener el bucket de Storage llamado `products` configurado como **público** (el script SQL ya incluye la sentencia).
4. Copia tu URL y Llave Anon de Supabase en el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rpeckqqbzglemezntpzj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_huyRUak4aGtUAyw3NvKdjQ_v_vZBnp-
```

---

## 💻 Ejecución en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌐 Subir a GitHub y Desplegar en Vercel

### 1. Subir a GitHub:
```bash
git init
git add .
git commit -m "feat: Tienda de tecnologia TECHNOVA completa con Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2. Desplegar en Vercel:
1. Conéctate a [Vercel](https://vercel.com) e importa tu repositorio de GitHub.
2. En la sección **Environment Variables**, añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Haz clic en **Deploy**. ¡Listo para vender!
