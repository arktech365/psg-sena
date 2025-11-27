```
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    // Allow anyone to read the products collection

    match /products/{document=**} {

      allow read: if true;

      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

    }
    
    // Allow authenticated users to read and write their own user document
    // Allow admins to read all user documents

    match /users/{userId} {

      // Users can read and write their own document
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all user documents
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Admins can update user roles
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

    }
    
    // Allow anyone to read the categories collection

    match /categories/{document=**} {

      allow read: if true;

      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

    }
    
    // Allow users to read and write their own cart
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own wishlist
    match /wishlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own orders
    // Allow admins to read all orders
    match /orders/{orderId} {
      // Users can read and write their own orders
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         // Admins can read all orders
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Allow creating orders
      allow create: if request.auth != null;
    }
    
    // Allow users to read coupons but only admins to manage them
    match /coupons/{couponId} {
      // Authenticated users can read coupons (to validate them)
      allow read: if request.auth != null;
      
      // Only admins can create, update, and delete coupons
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow users to read reviews
    // Allow users to create and update their own reviews
    // Allow admins to manage all reviews
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      
      // Users can create reviews
      allow create: if request.auth != null;
      
      // Users can update their own reviews
      // Admins can update any review
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Users can delete their own reviews
      // Admins can delete any review
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

  }

}
```