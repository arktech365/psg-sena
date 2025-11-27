# Firebase API Documentation for PSG SHOP

## Overview

This document provides a comprehensive guide to the Firebase API implementation used in the PSG SHOP e-commerce application. It details all Firestore collections, authentication methods, and API endpoints used throughout the application.

## Table of Contents

1. [Firebase Services Used](#firebase-services-used)
2. [Firestore Collections](#firestore-collections)
3. [Authentication API](#authentication-api)
4. [Firestore CRUD Operations](#firestore-crud-operations)
5. [Security Rules Summary](#security-rules-summary)
6. [Required Indexes](#required-indexes)

## Firebase Services Used

The PSG SHOP application utilizes the following Firebase services:

- **Cloud Firestore**: Primary database for storing products, users, orders, and other application data
- **Firebase Authentication**: User authentication and management
- **Firebase Storage**: (Not heavily used in current implementation) File storage for images
- **Firebase Cloud Functions**: (Not implemented in current version) Server-side logic

## Firestore Collections

### Products Collection

**Description**: Stores all product information available in the store.

**Document Structure**:
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

### Users Collection

**Description**: Stores user account information and profile data.

**Document Structure**:
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

**Description**: Stores customer order information.

**Document Structure**:
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

### Coupons Collection

**Description**: Stores discount coupon information.

**Document Structure**:
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

**Description**: Stores product reviews from customers.

**Document Structure**:
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

**Description**: Stores product category information.

**Document Structure**:
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

**Description**: Stores user shopping cart data.

**Document Structure**:
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

**Description**: Stores user wishlist data.

**Document Structure**:
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

**Register a New User**
```javascript
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
```

**Sign In Existing User**
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
```

### Google OAuth Authentication

```javascript
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};
```

### Sign Out

```javascript
import { getAuth, signOut } from 'firebase/auth';

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
```

### Password Reset

```javascript
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};
```

## Firestore CRUD Operations

### Products Service

**Get All Products**
```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getProducts = async () => {
  try {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return productList;
  } catch (error) {
    throw error;
  }
};
```

**Get Product by ID**
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getProductById = async (id) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
```

**Create Product (Admin Only)**
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createProduct = async (productData) => {
  try {
    const productsCollection = collection(db, 'products');
    const docRef = await addDoc(productsCollection, productData);
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    throw error;
  }
};
```

**Update Product (Admin Only)**
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateProduct = async (id, productData) => {
  try {
    const productDoc = doc(db, 'products', id);
    await updateDoc(productDoc, productData);
    return {
      id,
      ...productData
    };
  } catch (error) {
    throw error;
  }
};
```

**Delete Product (Admin Only)**
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const deleteProduct = async (id) => {
  try {
    const productDoc = doc(db, 'products', id);
    await deleteDoc(productDoc);
    return id;
  } catch (error) {
    throw error;
  }
};
```

### Orders Service

**Create Order**
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createOrder = async (orderData) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
```

**Get Orders by User ID**
```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const getOrdersByUserId = async (userId) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const orderSnapshot = await getDocs(q);
    const orderList = orderSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return orderList;
  } catch (error) {
    throw error;
  }
};
```

### Users Service

**Get User by ID**
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getUserById = async (id) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
```

**Update User Profile**
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const updateUserProfile = async (id, userData) => {
  try {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, userData);
    return {
      id,
      ...userData
    };
  } catch (error) {
    throw error;
  }
};
```

### Coupons Service

**Apply Coupon**
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const applyCoupon = async (couponCode) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
```

### Reviews Service

**Create Review**
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const createReview = async (reviewData) => {
  try {
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
  } catch (error) {
    throw error;
  }
};
```

### Cart Service

**Load Cart from Firestore**
```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const loadCartFromFirestore = async (userId) => {
  try {
    const userCartRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(userCartRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { items: [], coupon: null };
    }
  } catch (error) {
    throw error;
  }
};
```

**Save Cart to Firestore**
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const saveCartToFirestore = async (userId, cartData) => {
  try {
    const userCartRef = doc(db, 'carts', userId);
    const dataToSave = {
      userId: userId,
      items: cartData.items,
      coupon: cartData.coupon,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userCartRef, dataToSave, { merge: true });
    return dataToSave;
  } catch (error) {
    throw error;
  }
};
```

## Security Rules Summary

The application implements the following security rules for each collection:

| Collection | Read Permissions | Write Permissions |
|------------|------------------|-------------------|
| products | Public | Admin only |
| users | Owner & Admin | Owner & Admin |
| categories | Public | Admin only |
| carts | Owner only | Owner only |
| wishlists | Owner only | Owner only |
| orders | Owner & Admin | Owner & Admin |
| coupons | Authenticated users | Admin only |
| reviews | Public | Authenticated users (own) & Admin |

## Required Indexes

For optimal query performance, the following composite indexes are required:

1. **Orders Collection Index**:
   - Fields: `userId` (ASC), `createdAt` (DESC)
   - Purpose: Efficiently query user orders sorted by creation date

2. **All Orders Index**:
   - Fields: `createdAt` (DESC)
   - Purpose: Efficiently query all orders for admin dashboard

3. **Product Reviews Index**:
   - Fields: `productId` (ASC), `createdAt` (DESC)
   - Purpose: Efficiently query reviews for a specific product

These indexes are required for proper functioning of the application and should be created in the Firebase Console.