# API PSG SHOP - Documentación del Backend con Node.js + Express + Firebase

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Variables de Entorno](#variables-de-entorno)
7. [Colecciones de Firestore](#colecciones-de-firestore)
8. [Autenticación](#autenticación)
9. [Endpoints de la API](#endpoints-de-la-api)
   - [Productos](#productos)
   - [Usuarios](#usuarios)
   - [Pedidos](#pedidos)
   - [Cupones](#cupones)
   - [Reseñas](#reseñas)
   - [Categorías](#categorías)
   - [Carrito](#carrito)
   - [Lista de Deseos](#lista-de-deseos)
   - [Análisis](#análisis)
10. [Reglas de Seguridad](#reglas-de-seguridad)
11. [Índices Requeridos](#índices-requeridos)
12. [Implementación Paso a Paso](#implementación-paso-a-paso)

## Introducción

Este documento proporciona una guía completa para implementar el backend de la aplicación PSG SHOP utilizando Node.js, Express y Firebase. La aplicación es una tienda de comercio electrónico especializada en la venta de moños ("bows") que ofrece funcionalidades tanto para clientes como para administradores.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Express.js**: Framework web para Node.js
- **Firebase**: Base de datos en tiempo real y autenticación
- **Firestore**: Base de datos NoSQL de Firebase
- **Firebase Authentication**: Servicio de autenticación de usuarios
- **JWT**: Para manejo de tokens de autenticación
- **Cors**: Middleware para habilitar CORS
- **Dotenv**: Manejo de variables de entorno

## Arquitectura del Sistema

La arquitectura sigue un patrón MVC (Modelo-Vista-Controlador) adaptado para servicios RESTful:

```
Cliente (Frontend React) 
    ↓↑
API REST (Node.js + Express)
    ↓↑
Servicios de Firebase (Firestore + Authentication)
```

## Estructura del Proyecto

```
api-psg-shop/
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── couponController.js
│   ├── reviewController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   └── analyticsController.js
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── couponRoutes.js
│   ├── reviewRoutes.js
│   ├── categoryRoutes.js
│   ├── cartRoutes.js
│   ├── wishlistRoutes.js
│   └── analyticsRoutes.js
├── services/
│   ├── firebaseService.js
│   └── authService.js
├── utils/
│   ├── validators.js
│   └── helpers.js
├── config/
│   └── firebaseConfig.js
├── .env
├── server.js
└── package.json
```

## Instalación y Configuración

1. Crear un nuevo directorio para el proyecto:
```bash
mkdir api-psg-shop
cd api-psg-shop
```

2. Inicializar el proyecto Node.js:
```bash
npm init -y
```

3. Instalar dependencias:
```bash
npm install express cors dotenv firebase-admin jsonwebtoken bcryptjs
npm install --save-dev nodemon
```

4. Crear archivo principal [server.js](file:///e:/Development/PSG%20SHOP/server.js):

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'API PSG SHOP funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

## Variables de Entorno

Crear archivo [.env](file:///e:/Development/PSG%20SHOP/.env) en la raíz del proyecto:

```env
PORT=3000
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-client-email
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=tu-cert-url
JWT_SECRET=tu-secreto-jwt
```

## Colecciones de Firestore

### Colección: products
Almacena toda la información de los productos disponibles en la tienda.

**Estructura del documento:**
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrls: [string],
  primaryImageIndex: number,
  material: string,
  color: string,
  size: string,
  style: string,
  stock: number,
  rating: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: users
Almacena la información de las cuentas de usuario y perfil.

**Estructura del documento:**
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

### Colección: orders
Almacena la información de los pedidos de los clientes.

**Estructura del documento:**
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
      imageUrl: string,
      productId: string
    }
  ],
  subtotal: number,
  discount: number,
  totalAmount: number,
  totalAmountUSD: number,
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

### Colección: coupons
Almacena la información de los cupones de descuento.

**Estructura del documento:**
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

### Colección: reviews
Almacena las reseñas de los productos de los clientes.

**Estructura del documento:**
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

### Colección: categories
Almacena la información de las categorías de productos.

**Estructura del documento:**
```javascript
{
  id: string,
  name: string,
  description: string,
  imageUrl: string,
  createdAt: Date
}
```

### Colección: carts
Almacena los datos del carrito de compras de los usuarios.

**Estructura del documento:**
```javascript
{
  userId: string,
  items: [
    {
      id: string,
      name: string,
      price: number,
      quantity: number,
      imageUrl: string,
      stock: number,
      productId: string
    }
  ],
  coupon: object,
  updatedAt: Date
}
```

### Colección: wishlists
Almacena los datos de la lista de deseos de los usuarios.

**Estructura del documento:**
```javascript
{
  userId: string,
  items: [
    {
      id: string,
      name: string,
      price: number,
      imageUrl: string,
      productId: string
    }
  ],
  updatedAt: Date
}
```

## Autenticación

El sistema utiliza Firebase Authentication para manejar la autenticación de usuarios. Los tokens JWT se utilizan para autenticar las solicitudes a la API.

### Registro de Usuario
Los nuevos usuarios pueden registrarse proporcionando correo electrónico y contraseña.

### Inicio de Sesión
Los usuarios existentes pueden iniciar sesión con sus credenciales.

### Roles de Usuario
- **customer**: Cliente regular con acceso a funciones de compra
- **admin**: Administrador con acceso a funciones de gestión

## Endpoints de la API

### Productos

#### Obtener todos los productos
- **Método:** GET
- **Ruta:** `/api/products`
- **Descripción:** Obtiene todos los productos disponibles
- **Parámetros de consulta:** 
  - `category` (opcional): Filtrar por categoría
- **Respuesta:**
```json
[
  {
    "id": "producto-id",
    "name": "Nombre del producto",
    "description": "Descripción del producto",
    "price": 10000,
    "category": "Categoría",
    "imageUrls": ["url-imagen1", "url-imagen2"],
    "stock": 10,
    // ... otros campos
  }
]
```

#### Obtener producto por ID
- **Método:** GET
- **Ruta:** `/api/products/:id`
- **Descripción:** Obtiene un producto específico por su ID
- **Parámetros:**
  - `id`: ID del producto
- **Respuesta:**
```json
{
  "id": "producto-id",
  "name": "Nombre del producto",
  "description": "Descripción del producto",
  "price": 10000,
  "category": "Categoría",
  "imageUrls": ["url-imagen1", "url-imagen2"],
  "stock": 10,
  // ... otros campos
}
```

#### Crear producto (solo admin)
- **Método:** POST
- **Ruta:** `/api/products`
- **Descripción:** Crea un nuevo producto
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "name": "Nombre del producto",
  "description": "Descripción del producto",
  "price": 10000,
  "category": "Categoría",
  "imageUrls": ["url-imagen1", "url-imagen2"],
  "stock": 10,
  // ... otros campos requeridos
}
```
- **Respuesta:**
```json
{
  "id": "nuevo-producto-id",
  "name": "Nombre del producto",
  "description": "Descripción del producto",
  "price": 10000,
  "category": "Categoría",
  "imageUrls": ["url-imagen1", "url-imagen2"],
  "stock": 10,
  // ... otros campos
}
```

#### Actualizar producto (solo admin)
- **Método:** PUT
- **Ruta:** `/api/products/:id`
- **Descripción:** Actualiza un producto existente
- **Parámetros:**
  - `id`: ID del producto
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "name": "Nombre actualizado",
  "price": 15000,
  // ... campos a actualizar
}
```
- **Respuesta:**
```json
{
  "id": "producto-id",
  "name": "Nombre actualizado",
  "price": 15000,
  // ... otros campos actualizados
}
```

#### Eliminar producto (solo admin)
- **Método:** DELETE
- **Ruta:** `/api/products/:id`
- **Descripción:** Elimina un producto existente
- **Parámetros:**
  - `id`: ID del producto
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

### Usuarios

#### Obtener perfil de usuario
- **Método:** GET
- **Ruta:** `/api/users/profile`
- **Descripción:** Obtiene la información del perfil del usuario autenticado
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "id": "usuario-id",
  "email": "correo@ejemplo.com",
  "displayName": "Nombre de usuario",
  "role": "customer",
  "addresses": []
}
```

#### Actualizar perfil de usuario
- **Método:** PUT
- **Ruta:** `/api/users/profile`
- **Descripción:** Actualiza la información del perfil del usuario
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "displayName": "Nuevo nombre",
  "profileImage": "url-imagen-perfil"
}
```
- **Respuesta:**
```json
{
  "id": "usuario-id",
  "email": "correo@ejemplo.com",
  "displayName": "Nuevo nombre",
  "profileImage": "url-imagen-perfil",
  "role": "customer"
}
```

#### Obtener todos los usuarios (solo admin)
- **Método:** GET
- **Ruta:** `/api/users`
- **Descripción:** Obtiene todos los usuarios registrados (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "id": "usuario-id",
    "email": "correo@ejemplo.com",
    "displayName": "Nombre de usuario",
    "role": "customer"
  }
]
```

#### Actualizar rol de usuario (solo admin)
- **Método:** PUT
- **Ruta:** `/api/users/:id/role`
- **Descripción:** Actualiza el rol de un usuario (solo para administradores)
- **Parámetros:**
  - `id`: ID del usuario
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "role": "admin"
}
```
- **Respuesta:**
```json
{
  "id": "usuario-id",
  "role": "admin"
}
```

### Pedidos

#### Crear pedido
- **Método:** POST
- **Ruta:** `/api/orders`
- **Descripción:** Crea un nuevo pedido para el usuario autenticado
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "items": [
    {
      "productId": "id-producto",
      "quantity": 2,
      "price": 10000
    }
  ],
  "address": {
    "name": "Nombre del destinatario",
    "street": "Calle 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345",
    "country": "País"
  },
  "paymentMethod": "PayPal"
}
```
- **Respuesta:**
```json
{
  "id": "pedido-id",
  "userId": "usuario-id",
  "items": [...],
  "totalAmount": 20000,
  "orderStatus": "pending",
  "createdAt": "fecha"
}
```

#### Obtener pedidos del usuario
- **Método:** GET
- **Ruta:** `/api/orders`
- **Descripción:** Obtiene todos los pedidos del usuario autenticado
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
[
  {
    "id": "pedido-id",
    "items": [...],
    "totalAmount": 20000,
    "orderStatus": "delivered",
    "createdAt": "fecha"
  }
]
```

#### Obtener pedido por ID
- **Método:** GET
- **Ruta:** `/api/orders/:id`
- **Descripción:** Obtiene un pedido específico por su ID
- **Parámetros:**
  - `id`: ID del pedido
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "id": "pedido-id",
  "items": [...],
  "totalAmount": 20000,
  "orderStatus": "delivered",
  "createdAt": "fecha",
  "address": {...}
}
```

#### Obtener todos los pedidos (solo admin)
- **Método:** GET
- **Ruta:** `/api/orders/admin`
- **Descripción:** Obtiene todos los pedidos (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "id": "pedido-id",
    "userId": "usuario-id",
    "userEmail": "correo@ejemplo.com",
    "items": [...],
    "totalAmount": 20000,
    "orderStatus": "delivered",
    "createdAt": "fecha"
  }
]
```

#### Actualizar estado de pedido (solo admin)
- **Método:** PUT
- **Ruta:** `/api/orders/:id/status`
- **Descripción:** Actualiza el estado de un pedido (solo para administradores)
- **Parámetros:**
  - `id`: ID del pedido
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "orderStatus": "shipped"
}
```
- **Respuesta:**
```json
{
  "id": "pedido-id",
  "orderStatus": "shipped"
}
```

### Cupones

#### Aplicar cupón
- **Método:** POST
- **Ruta:** `/api/coupons/apply`
- **Descripción:** Aplica un cupón de descuento al carrito
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "code": "CODIGO_DESCUENTO"
}
```
- **Respuesta:**
```json
{
  "id": "cupon-id",
  "code": "CODIGO_DESCUENTO",
  "discountType": "percentage",
  "discountValue": 10,
  "isActive": true
}
```

#### Crear cupón (solo admin)
- **Método:** POST
- **Ruta:** `/api/coupons`
- **Descripción:** Crea un nuevo cupón de descuento
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "code": "NUEVO_CODIGO",
  "discountType": "percentage",
  "discountValue": 15,
  "isActive": true,
  "expiryDate": "2025-12-31"
}
```
- **Respuesta:**
```json
{
  "id": "cupon-id",
  "code": "NUEVO_CODIGO",
  "discountType": "percentage",
  "discountValue": 15,
  "isActive": true,
  "expiryDate": "2025-12-31",
  "createdAt": "fecha"
}
```

#### Obtener todos los cupones (solo admin)
- **Método:** GET
- **Ruta:** `/api/coupons`
- **Descripción:** Obtiene todos los cupones (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "id": "cupon-id",
    "code": "CODIGO_DESCUENTO",
    "discountType": "percentage",
    "discountValue": 10,
    "isActive": true,
    "expiryDate": "fecha"
  }
]
```

#### Actualizar cupón (solo admin)
- **Método:** PUT
- **Ruta:** `/api/coupons/:id`
- **Descripción:** Actualiza un cupón existente
- **Parámetros:**
  - `id`: ID del cupón
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "isActive": false
}
```
- **Respuesta:**
```json
{
  "id": "cupon-id",
  "code": "CODIGO_DESCUENTO",
  "isActive": false,
  "discountType": "percentage",
  "discountValue": 10
}
```

#### Eliminar cupón (solo admin)
- **Método:** DELETE
- **Ruta:** `/api/coupons/:id`
- **Descripción:** Elimina un cupón existente
- **Parámetros:**
  - `id`: ID del cupón
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
{
  "message": "Cupón eliminado exitosamente"
}
```

### Reseñas

#### Crear reseña
- **Método:** POST
- **Ruta:** `/api/reviews`
- **Descripción:** Crea una nueva reseña para un producto
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "productId": "id-producto",
  "rating": 5,
  "comment": "Excelente producto"
}
```
- **Respuesta:**
```json
{
  "id": "resena-id",
  "productId": "id-producto",
  "userId": "usuario-id",
  "userName": "Nombre de usuario",
  "rating": 5,
  "comment": "Excelente producto",
  "createdAt": "fecha"
}
```

#### Obtener reseñas por producto
- **Método:** GET
- **Ruta:** `/api/reviews/product/:productId`
- **Descripción:** Obtiene todas las reseñas de un producto específico
- **Parámetros:**
  - `productId`: ID del producto
- **Respuesta:**
```json
[
  {
    "id": "resena-id",
    "userId": "usuario-id",
    "userName": "Nombre de usuario",
    "rating": 5,
    "comment": "Excelente producto",
    "createdAt": "fecha"
  }
]
```

#### Obtener todas las reseñas (solo admin)
- **Método:** GET
- **Ruta:** `/api/reviews`
- **Descripción:** Obtiene todas las reseñas (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "id": "resena-id",
    "productId": "id-producto",
    "userId": "usuario-id",
    "userName": "Nombre de usuario",
    "rating": 5,
    "comment": "Excelente producto",
    "createdAt": "fecha"
  }
]
```

#### Actualizar reseña
- **Método:** PUT
- **Ruta:** `/api/reviews/:id`
- **Descripción:** Actualiza una reseña existente (solo propietario o admin)
- **Parámetros:**
  - `id`: ID de la reseña
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "rating": 4,
  "comment": "Muy buen producto"
}
```
- **Respuesta:**
```json
{
  "id": "resena-id",
  "rating": 4,
  "comment": "Muy buen producto",
  "updatedAt": "fecha"
}
```

#### Eliminar reseña
- **Método:** DELETE
- **Ruta:** `/api/reviews/:id`
- **Descripción:** Elimina una reseña existente (solo propietario o admin)
- **Parámetros:**
  - `id`: ID de la reseña
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "message": "Reseña eliminada exitosamente"
}
```

### Categorías

#### Obtener todas las categorías
- **Método:** GET
- **Ruta:** `/api/categories`
- **Descripción:** Obtiene todas las categorías de productos
- **Respuesta:**
```json
[
  {
    "id": "categoria-id",
    "name": "Nombre de categoría",
    "description": "Descripción de categoría",
    "imageUrl": "url-imagen"
  }
]
```

#### Crear categoría (solo admin)
- **Método:** POST
- **Ruta:** `/api/categories`
- **Descripción:** Crea una nueva categoría de productos
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "name": "Nueva categoría",
  "description": "Descripción de la categoría",
  "imageUrl": "url-imagen"
}
```
- **Respuesta:**
```json
{
  "id": "categoria-id",
  "name": "Nueva categoría",
  "description": "Descripción de la categoría",
  "imageUrl": "url-imagen",
  "createdAt": "fecha"
}
```

#### Actualizar categoría (solo admin)
- **Método:** PUT
- **Ruta:** `/api/categories/:id`
- **Descripción:** Actualiza una categoría existente
- **Parámetros:**
  - `id`: ID de la categoría
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Cuerpo:**
```json
{
  "name": "Categoría actualizada"
}
```
- **Respuesta:**
```json
{
  "id": "categoria-id",
  "name": "Categoría actualizada",
  "description": "Descripción de la categoría",
  "imageUrl": "url-imagen"
}
```

#### Eliminar categoría (solo admin)
- **Método:** DELETE
- **Ruta:** `/api/categories/:id`
- **Descripción:** Elimina una categoría existente
- **Parámetros:**
  - `id`: ID de la categoría
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
{
  "message": "Categoría eliminada exitosamente"
}
```

### Carrito

#### Obtener carrito del usuario
- **Método:** GET
- **Ruta:** `/api/cart`
- **Descripción:** Obtiene el contenido del carrito del usuario autenticado
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "items": [
    {
      "id": "producto-id",
      "name": "Nombre del producto",
      "price": 10000,
      "quantity": 2,
      "imageUrl": "url-imagen"
    }
  ],
  "coupon": null
}
```

#### Agregar producto al carrito
- **Método:** POST
- **Ruta:** `/api/cart/items`
- **Descripción:** Agrega un producto al carrito del usuario
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "productId": "id-producto",
  "quantity": 2
}
```
- **Respuesta:**
```json
{
  "message": "Producto agregado al carrito"
}
```

#### Actualizar cantidad de producto en carrito
- **Método:** PUT
- **Ruta:** `/api/cart/items/:productId`
- **Descripción:** Actualiza la cantidad de un producto en el carrito
- **Parámetros:**
  - `productId`: ID del producto
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "quantity": 3
}
```
- **Respuesta:**
```json
{
  "message": "Cantidad actualizada"
}
```

#### Eliminar producto del carrito
- **Método:** DELETE
- **Ruta:** `/api/cart/items/:productId`
- **Descripción:** Elimina un producto del carrito
- **Parámetros:**
  - `productId`: ID del producto
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "message": "Producto eliminado del carrito"
}
```

#### Limpiar carrito
- **Método:** DELETE
- **Ruta:** `/api/cart`
- **Descripción:** Elimina todos los productos del carrito
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "message": "Carrito vaciado"
}
```

### Lista de Deseos

#### Obtener lista de deseos del usuario
- **Método:** GET
- **Ruta:** `/api/wishlist`
- **Descripción:** Obtiene la lista de deseos del usuario autenticado
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "items": [
    {
      "id": "producto-id",
      "name": "Nombre del producto",
      "price": 10000,
      "imageUrl": "url-imagen"
    }
  ]
}
```

#### Agregar producto a la lista de deseos
- **Método:** POST
- **Ruta:** `/api/wishlist/items`
- **Descripción:** Agrega un producto a la lista de deseos
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Cuerpo:**
```json
{
  "productId": "id-producto"
}
```
- **Respuesta:**
```json
{
  "message": "Producto agregado a la lista de deseos"
}
```

#### Eliminar producto de la lista de deseos
- **Método:** DELETE
- **Ruta:** `/api/wishlist/items/:productId`
- **Descripción:** Elimina un producto de la lista de deseos
- **Parámetros:**
  - `productId`: ID del producto
- **Cabeceras:**
  - Authorization: Bearer [token]
- **Respuesta:**
```json
{
  "message": "Producto eliminado de la lista de deseos"
}
```

### Análisis (solo admin)

#### Obtener datos de ventas
- **Método:** GET
- **Ruta:** `/api/analytics/sales`
- **Descripción:** Obtiene datos de ventas (solo para administradores)
- **Parámetros de consulta:**
  - `startDate`: Fecha de inicio (YYYY-MM-DD)
  - `endDate`: Fecha de fin (YYYY-MM-DD)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
{
  "salesData": [...],
  "totalRevenue": 1000000,
  "totalOrders": 50,
  "averageOrderValue": 20000
}
```

#### Obtener ventas por categoría
- **Método:** GET
- **Ruta:** `/api/analytics/sales-by-category`
- **Descripción:** Obtiene ventas agrupadas por categoría (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "category": "Categoría A",
    "sales": 500000,
    "quantity": 25,
    "revenue": 500000
  }
]
```

#### Obtener distribución de estados de pedidos
- **Método:** GET
- **Ruta:** `/api/analytics/order-status`
- **Descripción:** Obtiene la distribución de estados de pedidos (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "status": "delivered",
    "count": 30
  }
]
```

#### Obtener productos más vendidos
- **Método:** GET
- **Ruta:** `/api/analytics/top-products`
- **Descripción:** Obtiene los productos más vendidos (solo para administradores)
- **Parámetros de consulta:**
  - `limit`: Número máximo de productos (por defecto 10)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "productId": "id-producto",
    "productName": "Nombre del producto",
    "sales": 100000,
    "quantity": 10,
    "revenue": 100000
  }
]
```

#### Obtener datos de registro de usuarios
- **Método:** GET
- **Ruta:** `/api/analytics/user-registrations`
- **Descripción:** Obtiene datos de registro de usuarios (solo para administradores)
- **Parámetros de consulta:**
  - `startDate`: Fecha de inicio (YYYY-MM-DD)
  - `endDate`: Fecha de fin (YYYY-MM-DD)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
{
  "registrationData": [...],
  "totalUsers": 100
}
```

#### Obtener ingresos por método de pago
- **Método:** GET
- **Ruta:** `/api/analytics/payment-methods`
- **Descripción:** Obtiene ingresos agrupados por método de pago (solo para administradores)
- **Cabeceras:**
  - Authorization: Bearer [token-admin]
- **Respuesta:**
```json
[
  {
    "method": "PayPal",
    "revenue": 700000,
    "count": 35
  }
]
```

## Reglas de Seguridad

Las reglas de seguridad deben configurarse en Firebase para cada colección:

| Colección | Permisos de Lectura | Permisos de Escritura |
|-----------|---------------------|-----------------------|
| products | Público | Solo administradores |
| users | Propietario y administradores | Propietario y administradores |
| categories | Público | Solo administradores |
| carts | Solo propietario | Solo propietario |
| wishlists | Solo propietario | Solo propietario |
| orders | Propietario y administradores | Propietario y administradores |
| coupons | Usuarios autenticados | Solo administradores |
| reviews | Público | Usuarios autenticados (propietario) y administradores |

## Índices Requeridos

Para un rendimiento óptimo de las consultas, se requieren los siguientes índices compuestos:

1. **Índice de Colección de Pedidos**:
   - Campos: `userId` (ASC), `createdAt` (DESC)
   - Propósito: Consultar eficientemente pedidos de usuarios ordenados por fecha de creación

2. **Índice de Todos los Pedidos**:
   - Campos: `createdAt` (DESC)
   - Propósito: Consultar eficientemente todos los pedidos para el panel de administración

3. **Índice de Reseñas de Productos**:
   - Campos: `productId` (ASC), `createdAt` (DESC)
   - Propósito: Consultar eficientemente reseñas para un producto específico

Estos índices son necesarios para el funcionamiento adecuado de la aplicación y deben crearse en la Consola de Firebase.

## Implementación Paso a Paso

### 1. Configurar Firebase Admin SDK

1. Crear cuenta de servicio en Firebase Console
2. Generar clave privada JSON
3. Configurar variables de entorno con credenciales
4. Inicializar Firebase Admin SDK en el proyecto

### 2. Crear estructura básica del servidor

1. Configurar servidor Express básico
2. Implementar middlewares (CORS, JSON parser)
3. Crear rutas base para probar el servidor

### 3. Implementar autenticación

1. Crear middleware de autenticación JWT
2. Implementar endpoints de registro e inicio de sesión
3. Validar tokens en solicitudes protegidas

### 4. Desarrollar controladores y servicios

1. Crear servicios para interactuar con Firestore
2. Implementar controladores para cada entidad
3. Agregar validaciones y manejo de errores

### 5. Implementar reglas de seguridad

1. Configurar reglas de lectura/escritura en Firebase
2. Validar roles de usuario en middlewares
3. Proteger endpoints según permisos

### 6. Pruebas y despliegue

1. Probar todos los endpoints con herramientas como Postman
2. Verificar manejo de errores y validaciones
3. Desplegar API en plataforma cloud (Heroku, Vercel, etc.)

Esta documentación proporciona una guía completa para implementar el backend de PSG SHOP con Node.js, Express y Firebase. Sigue estos pasos para construir una API robusta y segura que sirva como backend para la aplicación de comercio electrónico.