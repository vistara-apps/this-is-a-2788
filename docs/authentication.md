# Authentication Documentation

This document provides detailed information about the authentication system used in Petfolio.

## Overview

Petfolio uses Supabase Auth for authentication, which provides a secure and scalable authentication system with support for email/password authentication, social logins, and more.

## Authentication Flow

### Sign Up Flow

1. User enters email and password on the sign-up form
2. Client sends a sign-up request to Supabase Auth
3. Supabase creates a new user in the `auth.users` table
4. A confirmation email is sent to the user's email address
5. User clicks the confirmation link in the email
6. User is redirected to the application and automatically signed in
7. A new record is created in the `users` table with the user's information

### Sign In Flow

1. User enters email and password on the sign-in form
2. Client sends a sign-in request to Supabase Auth
3. Supabase validates the credentials and returns a JWT token
4. Client stores the token in local storage
5. Client includes the token in all subsequent API requests

### Password Reset Flow

1. User enters email on the password reset form
2. Client sends a password reset request to Supabase Auth
3. Supabase sends a password reset email to the user's email address
4. User clicks the password reset link in the email
5. User is redirected to the application's password reset page
6. User enters a new password
7. Client sends a password update request to Supabase Auth
8. User is redirected to the sign-in page

## JWT Tokens

Supabase Auth uses JWT (JSON Web Tokens) for authentication. The JWT token contains the following information:

- User ID
- Email
- Role
- Expiration time

The token is signed with a secret key to ensure its integrity. The token is included in the `Authorization` header of all API requests:

```
Authorization: Bearer <token>
```

## Row-Level Security (RLS)

Supabase uses PostgreSQL's Row-Level Security (RLS) to enforce access control at the database level. RLS policies ensure that users can only access their own data.

### Example RLS Policies

#### Users Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = userId);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = userId);
```

#### Galleries Table

```sql
-- Users can view their own galleries
CREATE POLICY "Users can view their own galleries"
  ON galleries FOR SELECT
  USING (auth.uid() = userId);

-- Users can create their own galleries
CREATE POLICY "Users can create their own galleries"
  ON galleries FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Users can update their own galleries
CREATE POLICY "Users can update their own galleries"
  ON galleries FOR UPDATE
  USING (auth.uid() = userId);

-- Users can delete their own galleries
CREATE POLICY "Users can delete their own galleries"
  ON galleries FOR DELETE
  USING (auth.uid() = userId);
```

#### Photos Table

```sql
-- Users can view photos in their galleries
CREATE POLICY "Users can view photos in their galleries"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

-- Users can insert photos in their galleries
CREATE POLICY "Users can insert photos in their galleries"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

-- Users can update photos in their galleries
CREATE POLICY "Users can update photos in their galleries"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

-- Users can delete photos in their galleries
CREATE POLICY "Users can delete photos in their galleries"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );
```

## Security Considerations

### Password Requirements

- Minimum length: 8 characters
- Should contain at least one uppercase letter, one lowercase letter, and one number
- Should not contain common words or patterns

### Rate Limiting

To prevent brute force attacks, Supabase Auth implements rate limiting on authentication endpoints:

- 10 sign-in attempts per minute per IP address
- 3 sign-up attempts per minute per IP address
- 3 password reset attempts per hour per email address

### Session Management

- JWT tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Sessions can be revoked by the user or by an administrator

## Implementation Details

### AuthContext

The `AuthContext` provides authentication state and methods to the entire application:

```jsx
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { userFunctions } from '../lib/db';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication methods: signUp, signIn, signOut, resetPassword, etc.
  
  return (
    <AuthContext.Provider value={{ user, session, loading, error, signUp, signIn, signOut, resetPassword, ... }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Protected Routes

Protected routes ensure that only authenticated users can access certain pages:

```jsx
// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
```

## Troubleshooting

### Common Issues

1. **JWT token expired**: If the JWT token expires, the user will be automatically signed out. They need to sign in again to get a new token.

2. **Invalid credentials**: If the user enters incorrect credentials, they will receive an error message. After 10 failed attempts, their IP address will be temporarily blocked.

3. **Email not confirmed**: If the user hasn't confirmed their email address, they won't be able to sign in. They need to click the confirmation link in the email.

4. **Password reset link expired**: Password reset links expire after 24 hours. If the link expires, the user needs to request a new password reset.

### Error Messages

- `Invalid login credentials`: The email or password is incorrect.
- `Email not confirmed`: The user hasn't confirmed their email address.
- `Password reset link expired`: The password reset link has expired.
- `Too many requests`: The user has exceeded the rate limit for authentication requests.

## Best Practices

1. **Always use HTTPS**: All communication with the authentication server should be encrypted using HTTPS.

2. **Implement proper error handling**: Display user-friendly error messages when authentication fails.

3. **Use refresh tokens**: Implement token refresh to provide a seamless user experience.

4. **Secure storage**: Store tokens securely in memory or in secure storage mechanisms.

5. **Implement logout functionality**: Allow users to sign out and clear their session.

6. **Validate user input**: Validate email and password inputs on the client side before sending them to the server.

7. **Implement account recovery**: Provide a way for users to recover their account if they forget their password.

