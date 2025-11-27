# Documentación Completa del Proyecto PSG SHOP

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Instalación y Configuración](#instalación-y-configuración)
7. [Funcionalidades por Rol](#funcionalidades-por-rol)
8. [Componentes Principales](#componentes-principales)
9. [Servicios y Contextos](#servicios-y-contextos)
10. [Modelos de Datos](#modelos-de-datos)
11. [Flujos de Trabajo](#flujos-de-trabajo)
12. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
13. [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)
14. [Despliegue](#despliegue)
15. [Pruebas](#pruebas)
16. [Solución de Problemas](#solución-de-problemas)

## Descripción General

PSG SHOP es una aplicación de comercio electrónico completa desarrollada con React para la venta de moños decorativos. La aplicación proporciona capacidades de compra tanto para clientes como un backend administrativo para gestionar productos, cupones, reseñas y análisis.

## Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión con correo electrónico/contraseña y Google OAuth
- **Catálogo de Productos**: Gestión completa de productos con imágenes, categorías y detalles
- **Carrito de Compras**: Sistema de carrito con persistencia en Firestore
- **Panel Administrativo**: Dashboard completo para gestión de productos, cupones y reseñas
- **Sistema de Cupones**: Creación y gestión de códigos de descuento
- **Reseñas de Productos**: Sistema de calificación con estrellas y comentarios
- **Lista de Deseos**: Funcionalidad para guardar productos favoritos
- **Procesamiento de Pagos**: Integración con PayPal y pago contra entrega
- **Control de Acceso**: Sistema basado en roles (cliente/administrador)
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos

## Tecnologías Utilizadas

### Frontend
- **React 19**: Biblioteca principal para la interfaz de usuario
- **React Router DOM v7.9.1**: Manejo de rutas y navegación
- **Tailwind CSS v4.1.13**: Framework de estilos y diseño responsivo
- **React Icons**: Conjunto de iconos para la interfaz

### Backend y Base de Datos
- **Firebase v12.3.0**: 
  - Authentication para gestión de usuarios
  - Firestore para almacenamiento de datos
  - Storage para manejo de archivos (aunque se usa base64 actualmente)

### Estado y Contexto
- **React Context API**: Manejo de estado global para autenticación, carrito y lista de deseos

### Pagos
- **PayPal JavaScript SDK v8.9.2**: Procesamiento de pagos en línea

### Gráficos y Visualización
- **Recharts v3.2.1**: Librería para gráficos en el panel administrativo

### Utilidades
- **SweetAlert2 v11.23.0**: Notificaciones y mensajes al usuario
- **Formspree**: Manejo de formularios de contacto
- **Vite v7.1.2**: Herramienta de construcción y desarrollo

## Arquitectura del Sistema

La aplicación sigue una arquitectura de aplicación de página única (SPA) centrada en el frontend utilizando React con Firebase como backend-as-a-service (BaaS). La arquitectura implementa un diseño modular basado en componentes con separación de preocupaciones entre contextos, servicios y componentes de UI.

### Patrones Arquitectónicos
- **Patrón de Contexto**: `AuthContext`, `CartContext` y `WishlistContext` manejan estados globales
- **Composición de Componentes**: Elementos de UI reutilizables (ej. `StarRating`, `Loader`, `Navbar`)
- **Abstracción de Capa de Servicio**: Servicios en `/services` encapsulan interacciones con Firebase
- **Patrón de Protección de Rutas**: Rutas protegidas y exclusivas para administradores aplican control de acceso
- **Fuente Única de Verdad**: Firebase actúa como almacén central de datos

### Interacción de Componentes
- Los componentes consumen proveedores de contexto (Auth, Cart) para estado compartido
- Los servicios interactúan directamente con Firebase y son llamados desde componentes/páginas
- Las páginas orquestan componentes y llamadas a servicios
- La navegación se gestiona mediante `react-router-dom`

## Estructura del Proyecto

```
src/
├── assets/
│   ├── pages/              # Todos los componentes de página
│   └── routes/             # Configuración de rutas y guards
├── components/             # Elementos de UI reutilizables
│   ├── charts/             # Componentes de gráficos para el dashboard admin
│   └── ...                 # Otros componentes de UI
├── context/                # Proveedores de estado global
├── hooks/                  # Hooks personalizados
├── services/               # Capa de interacción con Firebase
├── utils/                  # Funciones auxiliares
├── App.jsx                 # Componente principal de la aplicación
├── firebase.js             # Inicialización de Firebase
└── main.jsx                # Punto de entrada de la aplicación
```

## Instalación y Configuración

### Requisitos Previos
- Node.js v14 o superior
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalación
1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Navegar al directorio del proyecto:
   ```bash
   cd psg-shop
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Crear un archivo `.env` en el directorio raíz con la configuración de Firebase:
   ```
   VITE_API_KEY=your-api-key
   VITE_AUTH_DOMAIN=your-auth-domain
   VITE_PROJECT_ID=your-project-id
   VITE_STORAGE_BUCKET=your-storage-bucket
   VITE_MESSAGING_SENDER_ID=your-sender-id
   VITE_APP_ID=your-app-id
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Scripts Disponibles
- `npm run dev`: Iniciar servidor de desarrollo
- `npm run build`: Construir para producción
- `npm run preview`: Previsualizar construcción de producción localmente
- `npm run deploy`: Desplegar a GitHub Pages
- `npm run lint`: Ejecutar ESLint

## Funcionalidades por Rol

### Cliente
- Registro e inicio de sesión con correo/contraseña o Google
- Navegación por catálogo de productos
- Vista detallada de productos con galería de imágenes
- Sistema de calificación y reseñas de productos
- Carrito de compras con persistencia
- Lista de deseos
- Aplicación de cupones de descuento
- Proceso de checkout con selección de dirección
- Métodos de pago (PayPal o contra entrega)
- Gestión de perfil de usuario
- Historial de pedidos

### Administrador
- Acceso al panel administrativo protegido
- Gestión completa de productos (CRUD)
- Gestión de categorías de productos
- Creación y gestión de cupones de descuento
- Moderación de reseñas de productos
- Visualización de estadísticas y gráficos
- Gestión de pedidos (actualización de estados)
- Gestión de usuarios (asignación de roles)

## Componentes Principales

### Autenticación
- **Login.jsx**: Inicio de sesión con correo/contraseña y Google
- **Register.jsx**: Registro de nuevos usuarios
- **ResetPassword.jsx**: Recuperación de contraseña
- **AuthContext.jsx**: Gestión del estado de autenticación

### Navegación
- **navbar.jsx**: Barra de navegación principal con menú móvil
- **Footer.jsx**: Pie de página con enlaces y contacto

### Productos
- **Shop.jsx**: Listado de productos con filtros y búsqueda
- **ProductDetail.jsx**: Vista detallada de producto con galería
- **StarRating.jsx**: Componente reutilizable de calificación por estrellas

### Carrito y Checkout
- **Cart.jsx**: Gestión del carrito de compras
- **CartContext.jsx**: Estado y lógica del carrito
- **Checkout.jsx**: Proceso de pago con selección de dirección

### Usuario
- **Profile.jsx**: Gestión de perfil, direcciones y seguridad
- **Orders.jsx**: Historial de pedidos del usuario
- **Wishlist.jsx**: Lista de deseos del usuario

### Administración
- **ModernAdminDashboard.jsx**: Panel administrativo completo
- **CouponManager.jsx**: Gestión de cupones de descuento
- **ProductReviews.jsx**: Moderación de reseñas

### Utilidades
- **Loader.jsx**: Indicador de carga
- **OrderDetailsModal.jsx**: Modal con detalles de pedido

## Servicios y Contextos

### Contextos
- **AuthContext**: Gestiona el estado de autenticación del usuario, incluyendo rol (cliente/admin)
- **CartContext**: Maneja el estado del carrito de compras con persistencia en Firestore
- **WishlistContext**: Gestiona la lista de deseos del usuario

### Servicios
- **productService.js**: Operaciones CRUD para productos
- **orderService.js**: Gestión de pedidos y estados
- **userService.js**: Operaciones relacionadas con usuarios
- **reviewService.js**: Manejo de reseñas de productos
- **categoryService.js**: Gestión de categorías de productos
- **analyticsService.js**: Recopilación de datos para gráficos y estadísticas
- **couponService.js**: Validación y aplicación de cupones

## Modelos de Datos

### Usuario
```javascript
{
  id: string,
  email: string,
  displayName: string,
  profileImage: string,
  role: 'customer' | 'admin',
  createdAt: Date,
  addresses: [
    {
      id: string,
      name: string,
      street: string,
      city: string,
      state: string,
      zipCode: string,
      country: string,
      isDefault: boolean
    }
  ]
}
```

### Producto
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrls: [string], // Imágenes codificadas en base64
  primaryImageIndex: number,
  material: string,
  color: string,
  size: string,
  style: string,
  stock: number,
  rating: number, // Calificación promedio
  createdAt: Date,
  updatedAt: Date
}
```

### Pedido
```javascript
{
  id: string,
  userId: string,
  userEmail: string,
  items: [
    {
      id: string,
      name: string,
      price: number,
      quantity: number,
      imageUrl: string
    }
  ],
  subtotal: number,
  discount: number,
  totalAmount: number,
  totalAmountUSD: number, // Para pagos con PayPal
  address: {
    name: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  paymentMethod: 'PayPal' | 'Cash on Delivery',
  paymentStatus: 'pending' | 'completed',
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  coupon: object,
  createdAt: Date,
  updatedAt: Date
}
```

### Cupón
```javascript
{
  id: string,
  code: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  isActive: boolean,
  expiryDate: Date,
  createdAt: Date
}
```

### Reseña
```javascript
{
  id: string,
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Flujos de Trabajo

### Flujo de Autenticación
1. El usuario se registra/inicia sesión con correo/contraseña o Google OAuth
2. Firebase Authentication maneja las credenciales del usuario
3. Los datos del usuario se almacenan en la colección `users` de Firestore
4. La persistencia de sesión se mantiene usando almacenamiento local del navegador

### Flujo de Compra
1. El usuario navega por productos y agrega items al carrito
2. El carrito se guarda en Firestore para persistencia entre sesiones
3. En el checkout, el usuario selecciona dirección de envío
4. Se calcula costo de envío según ubicación
5. El usuario selecciona método de pago (PayPal o contra entrega)
6. Se crea el pedido en Firestore
7. Para pagos con PayPal, se procesa la transacción
8. El estado del pedido se actualiza a "pending"

### Flujo Administrativo
1. Los administradores acceden al panel protegido
2. Pueden gestionar productos, categorías, cupones y reseñas
3. Visualizan estadísticas de ventas y usuarios
4. Gestionan pedidos actualizando sus estados
5. Los cambios se reflejan en tiempo real en la base de datos

## Consideraciones de Seguridad

### Reglas de Seguridad de Firebase
- Configurar adecuadamente las reglas de seguridad de Firestore para prevenir acceso no autorizado
- Restringir operaciones de escritura a usuarios autenticados
- Implementar controles de acceso basados en roles en las reglas de seguridad

### Validación de Datos
- Validar todas las entradas de usuario tanto en cliente como en servidor
- Sanitizar contenido generado por usuarios para prevenir ataques XSS

### Autenticación
- Usar políticas de contraseñas seguras
- Implementar gestión adecuada de sesiones
- Proteger rutas administrativas con verificaciones de autorización fuertes

## Consideraciones de Rendimiento

### Manejo de Imágenes
- Las imágenes se almacenan actualmente como cadenas codificadas en base64 en Firestore
- Este enfoque tiene limitaciones de tamaño y puede impactar el rendimiento
- Considerar migrar a Firebase Storage para mejor rendimiento

### Carga de Datos
- Implementar paginación para conjuntos de datos grandes
- Usar índices de Firestore para consultas optimizadas
- Implementar estados de carga para mejor experiencia de usuario

## Despliegue

### Despliegue en GitHub Pages
La aplicación está configurada para despliegue en GitHub Pages:
1. Construir la aplicación: `npm run build`
2. Desplegar a GitHub Pages: `npm run deploy`

### Configuración de Firebase
Asegurar que las reglas de seguridad de Firebase estén correctamente configuradas para uso en producción.

## Pruebas

### Pruebas Manuales
La aplicación incluye varias páginas de prueba:
- `StarRatingTest.jsx`: Para probar el componente de calificación por estrellas
- `CouponTest.jsx`: Para probar la funcionalidad de cupones

### Pruebas en Navegador
La aplicación debe probarse en diferentes navegadores y dispositivos para asegurar que el diseño responsivo funcione correctamente.

## Solución de Problemas

### Problemas Comunes

1. **Errores de Configuración de Firebase**
   - Asegurar que todas las variables de entorno estén correctamente configuradas en `.env`
   - Verificar la configuración del proyecto de Firebase y credenciales

2. **Problemas de Autenticación**
   - Verificar que los proveedores de autenticación estén habilitados en Firebase
   - Confirmar que los roles de usuario estén correctamente asignados en Firestore

3. **Problemas de Procesamiento de Pagos**
   - Asegurar que el ID de cliente de PayPal esté correctamente configurado
   - Verificar las tasas de conversión de moneda

4. **Problemas de Rendimiento**
   - Optimizar tamaños y formatos de imágenes
   - Implementar paginación para conjuntos de datos grandes
   - Revisar la eficiencia de consultas de Firestore

### Consejos de Depuración
- Usar herramientas de desarrollador del navegador para inspeccionar solicitudes de red
- Verificar la consola del navegador en busca de errores de JavaScript
- Habilitar depuración de Firebase para registros detallados
- Usar React DevTools para inspeccionar el estado de componentes