# Firebase API Documentation - PSG SHOP

## Table of Contents
1. [Overview](#overview)
2. [Firebase Configuration](#firebase-configuration)
3. [Database Collections](#database-collections)
4. [Authentication API](#authentication-api)
5. [Product API](#product-api)
6. [Order API](#order-api)
7. [User API](#user-api)
8. [Coupon API](#coupon-api)
9. [Review API](#review-api)
10. [Category API](#category-api)
11. [Cart API](#cart-api)
12. [Wishlist API](#wishlist-api)
13. [Analytics API](#analytics-api)
14. [Security Rules](#security-rules)
15. [Required Indexes](#required-indexes)

## Overview

PSG SHOP uses Firebase as its Backend-as-a-Service (BaaS) solution, leveraging Firestore for data storage, Firebase Authentication for user management, and Firebase Storage for file handling. This document details the API structure and data models used throughout the application.

## Firebase Configuration

The application initializes Firebase with the following configuration:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};
```

Environment variables must be set in a `.env` file:
```
VITE_API_KEY=your-api-key
VITE_AUTH_DOMAIN=your-auth-domain
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-storage-bucket
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id
```

## Database Collections

### Products Collection
Stores all product information available in the store.

**Document Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrls: [string], // Base64 encoded images
  primaryImageIndex: number,
  material: string,
  color: string,
  size: string,
  style: string,
  stock: number,
  rating: number, // Average rating
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
Stores user account information and profile data.

**Document Structure:**
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

### Orders Collection
Stores customer order information.

**Document Structure:**
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
  totalAmountUSD: number, // For PayPal payments
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

### Coupons Collection
Stores discount coupon information.

**Document Structure:**
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

### Reviews Collection
Stores product reviews from customers.

**Document Structure:**
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

### Categories Collection
Stores product category information.

**Document Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  imageUrl: string,
  createdAt: Date
}
```

### Carts Collection
Stores user shopping cart data.

**Document Structure:**
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

### Wishlists Collection
Stores user wishlist data.

**Document Structure:**
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

## Authentication API

### Email/Password Authentication
```javascript
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Register a new user
const userCredential = await createUserWithEmailAndPassword(auth, email, password);

// Sign in existing user
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

### Google OAuth Authentication
```javascript
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
```

### Sign Out
```javascript
import { getAuth, signOut } from 'firebase/auth';

await signOut(auth);
```

### Password Reset
```javascript
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, email);
```

## Product API

### Get All Products
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getProducts = async () => {
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
  return productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Get Product by ID
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getProductById = async (id) => {
  const productDoc = doc(db, 'products', id);
  const productSnapshot = await getDoc(productDoc);
  if (productSnapshot.exists()) {
    return {
      id: productSnapshot.id,
      ...productSnapshot.data()
    };
  } else {
    throw new Error('Product not found');
  }
};
```

### Get Products by Category
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getProductsByCategory = async (category) => {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, where('category', '==', category));
  const productSnapshot = await getDocs(q);
  return productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Create Product (Admin Only)
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createProduct = async (productData) => {
  const productsCollection = collection(db, 'products');
  const docRef = await addDoc(productsCollection, productData);
  return {
    id: docRef.id,
    ...productData
  };
};
```

### Update Product (Admin Only)
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateProduct = async (id, productData) => {
  const productDoc = doc(db, 'products', id);
  await updateDoc(productDoc, productData);
  return {
    id,
    ...productData
  };
};
```

### Delete Product (Admin Only)
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteProduct = async (id) => {
  const productDoc = doc(db, 'products', id);
  await deleteDoc(productDoc);
  return id;
};
```

## Order API

### Create Order
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createOrder = async (orderData) => {
  const ordersCollection = collection(db, 'orders');
  const docRef = await addDoc(ordersCollection, {
    ...orderData,
    createdAt: new Date(),
    status: 'pending'
  });
  return {
    id: docRef.id,
    ...orderData,
    createdAt: new Date(),
    status: 'pending'
  };
};
```

### Get Orders by User ID
```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getOrdersByUserId = async (userId) => {
  const ordersCollection = collection(db, 'orders');
  const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const orderSnapshot = await getDocs(q);
  return orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Get Order by ID
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getOrderById = async (id) => {
  const orderDoc = doc(db, 'orders', id);
  const orderSnapshot = await getDoc(orderDoc);
  if (orderSnapshot.exists()) {
    return {
      id: orderSnapshot.id,
      ...orderSnapshot.data()
    };
  } else {
    throw new Error('Order not found');
  }
};
```

### Update Order Status (Admin Only)
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateOrderStatus = async (id, status) => {
  const orderDoc = doc(db, 'orders', id);
  await updateDoc(orderDoc, { orderStatus: status, updatedAt: new Date() });
  return { id, status };
};
```

## User API

### Get User by ID
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getUserById = async (id) => {
  const userDoc = doc(db, 'users', id);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    return {
      id: userSnapshot.id,
      ...userSnapshot.data()
    };
  } else {
    throw new Error('User not found');
  }
};
```

### Update User Profile
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateUserProfile = async (id, userData) => {
  const userDoc = doc(db, 'users', id);
  await updateDoc(userDoc, userData);
  return {
    id,
    ...userData
  };
};
```

### Get All Users (Admin Only)
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getAllUsers = async () => {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  return userSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Update User Role (Admin Only)
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateUserRole = async (id, role) => {
  const userDoc = doc(db, 'users', id);
  await updateDoc(userDoc, { role });
  return { id, role };
};
```

## Coupon API

### Get All Coupons (Admin Only)
```javascript
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getAllCoupons = async () => {
  const couponsCollection = collection(db, 'coupons');
  const couponsQuery = query(couponsCollection, orderBy("createdAt", "desc"));
  const data = await getDocs(couponsQuery);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};
```

### Create Coupon (Admin Only)
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createCoupon = async (couponData) => {
  const couponsCollection = collection(db, 'coupons');
  const docRef = await addDoc(couponsCollection, {
    ...couponData,
    createdAt: new Date()
  });
  return {
    id: docRef.id,
    ...couponData,
    createdAt: new Date()
  };
};
```

### Update Coupon (Admin Only)
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateCoupon = async (id, couponData) => {
  const couponDoc = doc(db, 'coupons', id);
  const updateData = { 
    ...couponData, 
    updatedAt: new Date() 
  };
  await updateDoc(couponDoc, updateData);
  return { 
    id, 
    ...updateData 
  };
};
```

### Delete Coupon (Admin Only)
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteCoupon = async (id) => {
  const couponDoc = doc(db, 'coupons', id);
  await deleteDoc(couponDoc);
  return id;
};
```

### Apply Coupon
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const applyCoupon = async (couponCode) => {
  const couponsRef = collection(db, 'coupons');
  const q = query(couponsRef, where('code', '==', couponCode));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error('Invalid coupon');
  }
  
  const couponDoc = querySnapshot.docs[0];
  const couponData = { id: couponDoc.id, ...couponDoc.data() };
  
  // Check if coupon is active
  if (!couponData.isActive) {
    throw new Error('This coupon is not active');
  }
  
  // Check if coupon has expired
  const currentDate = new Date();
  if (couponData.expiryDate && currentDate > couponData.expiryDate.toDate()) {
    throw new Error('This coupon has expired');
  }
  
  return couponData;
};
```

## Review API

### Create Review
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createReview = async (reviewData) => {
  const reviewsCollection = collection(db, 'reviews');
  const docRef = await addDoc(reviewsCollection, {
    ...reviewData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return {
    id: docRef.id,
    ...reviewData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
```

### Get Reviews by Product ID
```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getReviewsByProductId = async (productId) => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const reviewSnapshot = await getDocs(q);
  return reviewSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Get User Review for Product
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getUserReviewForProduct = async (userId, productId) => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(
    reviewsCollection,
    where('userId', '==', userId),
    where('productId', '==', productId)
  );
  const reviewSnapshot = await getDocs(q);
  
  if (reviewSnapshot.empty) {
    return null;
  }
  
  const reviewDoc = reviewSnapshot.docs[0];
  return {
    id: reviewDoc.id,
    ...reviewDoc.data()
  };
};
```

### Get All Reviews (Admin Only)
```javascript
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getAllReviews = async () => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, orderBy('createdAt', 'desc'));
  const reviewSnapshot = await getDocs(q);
  return reviewSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Update Review
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateReview = async (id, reviewData) => {
  const reviewDoc = doc(db, 'reviews', id);
  await updateDoc(reviewDoc, {
    ...reviewData,
    updatedAt: new Date()
  });
  return {
    id,
    ...reviewData,
    updatedAt: new Date()
  };
};
```

### Delete Review
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteReview = async (id) => {
  const reviewDoc = doc(db, 'reviews', id);
  await deleteDoc(reviewDoc);
  return id;
};
```

## Category API

### Get All Categories
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getCategories = async () => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Create Category (Admin Only)
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createCategory = async (categoryData) => {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...categoryData,
    createdAt: new Date()
  });
  return { 
    id: docRef.id, 
    ...categoryData, 
    createdAt: new Date() 
  };
};
```

### Update Category (Admin Only)
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateCategory = async (categoryId, categoryData) => {
  const categoryDoc = doc(db, 'categories', categoryId);
  const updatedData = { 
    ...categoryData, 
    updatedAt: new Date() 
  };
  await updateDoc(categoryDoc, updatedData);
  return { 
    id: categoryId, 
    ...updatedData 
  };
};
```

### Delete Category (Admin Only)
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteCategory = async (categoryId) => {
  const categoryDoc = doc(db, 'categories', categoryId);
  await deleteDoc(categoryDoc);
  return categoryId;
};
```

## Cart API

### Load Cart from Firestore
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const loadCartFromFirestore = async (userId) => {
  const userCartRef = doc(db, 'carts', userId);
  const docSnap = await getDoc(userCartRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return { items: [], coupon: null };
  }
};
```

### Save Cart to Firestore
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const saveCartToFirestore = async (userId, cartData) => {
  const userCartRef = doc(db, 'carts', userId);
  const dataToSave = {
    userId: userId,
    items: cartData.items,
    coupon: cartData.coupon,
    updatedAt: new Date().toISOString()
  };
  
  await setDoc(userCartRef, dataToSave, { merge: true });
  return dataToSave;
};
```

### Clear Cart in Firestore
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const clearCartInFirestore = async (userId) => {
  const userCartRef = doc(db, 'carts', userId);
  await setDoc(userCartRef, {
    userId: userId,
    items: [],
    coupon: null,
    updatedAt: new Date()
  });
};
```

## Wishlist API

### Load Wishlist from Firestore
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const loadWishlistFromFirestore = async (userId) => {
  const userWishlistRef = doc(db, 'wishlists', userId);
  const docSnap = await getDoc(userWishlistRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return { items: [] };
  }
};
```

### Save Wishlist to Firestore
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const saveWishlistToFirestore = async (userId, wishlistData) => {
  const userWishlistRef = doc(db, 'wishlists', userId);
  const dataToSave = {
    userId: userId,
    items: wishlistData.items,
    updatedAt: new Date().toISOString()
  };
  
  await setDoc(userWishlistRef, dataToSave, { merge: true });
  return dataToSave;
};
```

## Analytics API

### Get Sales Data by Date Range
```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getSalesData = async (startDate, endDate) => {
  const ordersCollection = collection(db, 'orders');
  const q = query(
    ordersCollection, 
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );
  const orderSnapshot = await getDocs(q);
  const orders = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Process data for analytics
  const salesByDate = {};
  let totalRevenue = 0;
  let totalOrders = 0;
  
  orders.forEach(order => {
    const date = order.createdAt.toDate().toISOString().split('T')[0];
    if (!salesByDate[date]) {
      salesByDate[date] = {
        date,
        totalSales: 0,
        orderCount: 0,
        revenue: 0
      };
    }
    
    const orderTotal = order.totalAmount || 0;
    salesByDate[date].totalSales += orderTotal;
    salesByDate[date].orderCount += 1;
    salesByDate[date].revenue += orderTotal;
    totalRevenue += orderTotal;
    totalOrders += 1;
  });
  
  const salesData = Object.values(salesByDate).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  return {
    salesData,
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
  };
};
```

### Get Sales by Category
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getSalesByCategory = async () => {
  // Get all products with their categories
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
  const products = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Get all orders
  const ordersCollection = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCollection);
  const orders = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Create a product ID to category mapping
  const productCategoryMap = {};
  products.forEach(product => {
    productCategoryMap[product.id] = product.category || 'Sin categoría';
  });
  
  // Calculate sales by category
  const categorySales = {};
  
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const category = productCategoryMap[item.productId] || 'Sin categoría';
        if (!categorySales[category]) {
          categorySales[category] = {
            category,
            sales: 0,
            quantity: 0,
            revenue: 0
          };
        }
        
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        categorySales[category].sales += itemTotal;
        categorySales[category].quantity += item.quantity || 0;
        categorySales[category].revenue += itemTotal;
      });
    }
  });
  
  // Convert to array and sort by revenue
  return Object.values(categorySales).sort((a, b) => b.revenue - a.revenue);
};
```

### Get Order Status Distribution
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getOrderStatusDistribution = async () => {
  const ordersCollection = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCollection);
  const orders = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  const statusDistribution = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  
  orders.forEach(order => {
    const status = order.orderStatus || 'pending';
    if (status in statusDistribution) {
      statusDistribution[status]++;
    }
  });
  
  // Convert to array format for charts
  return Object.entries(statusDistribution).map(([status, count]) => ({
    status,
    count
  }));
};
```

### Get Top Selling Products
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getTopSellingProducts = async (limit = 10) => {
  // Get all products
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
  const products = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Get all orders
  const ordersCollection = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCollection);
  const orders = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Create a product ID to name mapping
  const productNameMap = {};
  products.forEach(product => {
    productNameMap[product.id] = product.name || 'Producto sin nombre';
  });
  
  // Calculate sales by product
  const productSales = {};
  
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productId = item.productId;
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            productName: productNameMap[productId] || 'Producto desconocido',
            sales: 0,
            quantity: 0,
            revenue: 0
          };
        }
        
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        productSales[productId].sales += itemTotal;
        productSales[productId].quantity += item.quantity || 0;
        productSales[productId].revenue += itemTotal;
      });
    }
  });
  
  // Convert to array and sort by revenue
  const topSellingProducts = Object.values(productSales).sort((a, b) => 
    b.revenue - a.revenue
  );
  
  return topSellingProducts.slice(0, limit);
};
```

## Security Rules

The application uses the following Firestore security rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Public read, admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users - Self read/write, admin read
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories - Public read, admin write
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Carts - User-specific access
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wishlists - User-specific access
    match /wishlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - User read/write, admin read
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
    }
    
    // Coupons - Authenticated read, admin write
    match /coupons/{couponId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reviews - Public read, authenticated create, user/admin update/delete
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Required Indexes

For optimal performance, the following composite indexes are required:

1. **Orders Collection Index for User Orders**:
   - Collection: `orders`
   - Fields:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - Query Scope: Collection

2. **Orders Collection Index for Admin Orders**:
   - Collection: `orders`
   - Fields:
     - `createdAt` (Descending)
   - Query Scope: Collection

3. **Reviews Collection Index for Product Reviews**:
   - Collection: `reviews`
   - Fields:
     - `productId` (Ascending)
     - `createdAt` (Descending)
   - Query Scope: Collection

These indexes are required for:
- Querying user orders sorted by creation date (newest first)
- Querying all orders for admins sorted by creation date (newest first)
- Querying reviews for a specific product sorted by creation date (newest first)