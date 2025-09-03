# Petfolio API Documentation

This document provides comprehensive documentation for the Petfolio API, including authentication flows, data models, and error handling.

## Base URL

All API endpoints are relative to the Supabase project URL:

```
https://your-supabase-project.supabase.co
```

## Authentication

Petfolio uses Supabase Auth for authentication. All authenticated requests must include a valid JWT token in the `Authorization` header.

### Authentication Endpoints

#### Sign Up

```
POST /auth/v1/signup
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "app_metadata": {
      "provider": "email"
    },
    "user_metadata": {},
    "aud": "authenticated",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Sign In

```
POST /auth/v1/token?grant_type=password
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "app_metadata": {
      "provider": "email"
    },
    "user_metadata": {},
    "aud": "authenticated",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Sign Out

```
POST /auth/v1/logout
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{}
```

#### Reset Password

```
POST /auth/v1/recover
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{}
```

## Data Models

### User

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| userId          | UUID      | Primary key, references auth.users(id)     |
| email           | TEXT      | User's email address                       |
| subscriptionTier| TEXT      | Subscription tier (free, premium)          |
| createdAt       | TIMESTAMP | When the user was created                  |
| updatedAt       | TIMESTAMP | When the user was last updated             |

### Gallery

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| galleryId       | UUID      | Primary key                                |
| userId          | UUID      | Foreign key to users(userId)               |
| name            | TEXT      | Gallery name                               |
| description     | TEXT      | Gallery description (optional)             |
| createdAt       | TIMESTAMP | When the gallery was created               |
| updatedAt       | TIMESTAMP | When the gallery was last updated          |

### Photo

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| photoId         | UUID      | Primary key                                |
| galleryId       | UUID      | Foreign key to galleries(galleryId)        |
| imageUrl        | TEXT      | URL to the photo                           |
| filePath        | TEXT      | Path to the file in storage                |
| caption         | TEXT      | Photo caption (optional)                   |
| order           | INTEGER   | Display order in the gallery               |
| uploadedAt      | TIMESTAMP | When the photo was uploaded                |
| updatedAt       | TIMESTAMP | When the photo was last updated            |

### Website Settings

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| userId          | UUID      | Primary key, references users(userId)      |
| theme           | JSONB     | Theme settings (layout, colors, etc.)      |
| customDomain    | TEXT      | Custom domain (premium feature)            |
| isPublished     | BOOLEAN   | Whether the website is published           |
| publishedUrl    | TEXT      | URL to the published website               |
| createdAt       | TIMESTAMP | When the settings were created             |
| updatedAt       | TIMESTAMP | When the settings were last updated        |

### Subscription History

| Field              | Type      | Description                                |
|--------------------|-----------|-------------------------------------------|
| id                 | UUID      | Primary key                                |
| userId             | UUID      | Foreign key to users(userId)               |
| stripeCustomerId   | TEXT      | Stripe customer ID                         |
| stripeSubscriptionId| TEXT     | Stripe subscription ID                     |
| plan               | TEXT      | Subscription plan (free, premium)          |
| status             | TEXT      | Subscription status                        |
| startDate          | TIMESTAMP | When the subscription started              |
| endDate            | TIMESTAMP | When the subscription ends/ended           |
| createdAt          | TIMESTAMP | When the record was created                |
| updatedAt          | TIMESTAMP | When the record was last updated           |

## API Endpoints

### User Endpoints

#### Get Current User

```
GET /rest/v1/users?userId=eq.<userId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "subscriptionTier": "free",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Update User Profile

```
PATCH /rest/v1/users?userId=eq.<userId>
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "newemail@example.com"
}
```

**Response:**

```json
[
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "newemail@example.com",
    "subscriptionTier": "free",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Gallery Endpoints

#### Get User Galleries

```
GET /rest/v1/galleries?userId=eq.<userId>&order=createdAt.desc
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dogs",
    "description": "My dog photos",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Gallery

```
GET /rest/v1/galleries?galleryId=eq.<galleryId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Dogs",
    "description": "My dog photos",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Create Gallery

```
POST /rest/v1/galleries
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Cats",
  "description": "My cat photos"
}
```

**Response:**

```json
[
  {
    "galleryId": "123e4567-e89b-12d3-a456-426614174001",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Cats",
    "description": "My cat photos",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Update Gallery

```
PATCH /rest/v1/galleries?galleryId=eq.<galleryId>
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Gallery Name",
  "description": "Updated description"
}
```

**Response:**

```json
[
  {
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Updated Gallery Name",
    "description": "Updated description",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Delete Gallery

```
DELETE /rest/v1/galleries?galleryId=eq.<galleryId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[]
```

### Photo Endpoints

#### Get Gallery Photos

```
GET /rest/v1/photos?galleryId=eq.<galleryId>&order=order.asc
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "photoId": "123e4567-e89b-12d3-a456-426614174000",
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://example.com/photos/123.jpg",
    "filePath": "123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000/123.jpg",
    "caption": "My dog",
    "order": 1,
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Photo

```
GET /rest/v1/photos?photoId=eq.<photoId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "photoId": "123e4567-e89b-12d3-a456-426614174000",
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://example.com/photos/123.jpg",
    "filePath": "123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000/123.jpg",
    "caption": "My dog",
    "order": 1,
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Create Photo

```
POST /rest/v1/photos
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "galleryId": "123e4567-e89b-12d3-a456-426614174000",
  "imageUrl": "https://example.com/photos/123.jpg",
  "filePath": "123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000/123.jpg",
  "caption": "My dog",
  "order": 1
}
```

**Response:**

```json
[
  {
    "photoId": "123e4567-e89b-12d3-a456-426614174000",
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://example.com/photos/123.jpg",
    "filePath": "123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000/123.jpg",
    "caption": "My dog",
    "order": 1,
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Update Photo

```
PATCH /rest/v1/photos?photoId=eq.<photoId>
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "caption": "Updated caption",
  "order": 2
}
```

**Response:**

```json
[
  {
    "photoId": "123e4567-e89b-12d3-a456-426614174000",
    "galleryId": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://example.com/photos/123.jpg",
    "filePath": "123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174000/123.jpg",
    "caption": "Updated caption",
    "order": 2,
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Delete Photo

```
DELETE /rest/v1/photos?photoId=eq.<photoId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[]
```

### Website Settings Endpoints

#### Get Website Settings

```
GET /rest/v1/website_settings?userId=eq.<userId>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "theme": {
      "layout": "3col",
      "primaryColor": "#667eea",
      "accentColor": "#764ba2",
      "backgroundColor": "#f8fafc"
    },
    "customDomain": null,
    "isPublished": false,
    "publishedUrl": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Update Website Settings

```
PATCH /rest/v1/website_settings?userId=eq.<userId>
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "theme": {
    "layout": "2col",
    "primaryColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "backgroundColor": "#f8fafc"
  },
  "isPublished": true
}
```

**Response:**

```json
[
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "theme": {
      "layout": "2col",
      "primaryColor": "#1e3a8a",
      "accentColor": "#3b82f6",
      "backgroundColor": "#f8fafc"
    },
    "customDomain": null,
    "isPublished": true,
    "publishedUrl": "https://petfolio.app/123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Storage API

### Upload File

```
POST /storage/v1/object/photos/<userId>/<galleryId>/<filename>
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**

```
file: <binary data>
```

**Response:**

```json
{
  "Key": "<userId>/<galleryId>/<filename>",
  "Bucket": "photos",
  "ETag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
  "ContentType": "image/jpeg",
  "Size": 12345
}
```

### Get File URL

```
GET /storage/v1/object/public/photos/<userId>/<galleryId>/<filename>
```

**Response:**

```
https://your-supabase-project.supabase.co/storage/v1/object/public/photos/<userId>/<galleryId>/<filename>
```

### Delete File

```
DELETE /storage/v1/object/photos/<userId>/<galleryId>/<filename>
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{}
```

## Stripe Integration

### Create Checkout Session

```
POST /functions/v1/create-checkout-session
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "priceId": "price_premium"
}
```

**Response:**

```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

### Create Customer Portal Session

```
POST /functions/v1/create-customer-portal-session
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**

```json
{
  "url": "https://billing.stripe.com/p/session/cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

### Get Subscription Details

```
POST /functions/v1/get-subscription-details
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**

```json
{
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "current_period_end": 1672531200,
    "cancel_at_period_end": false,
    "plan": {
      "id": "price_premium",
      "nickname": "Premium",
      "amount": 2500,
      "currency": "usd",
      "interval": "month"
    }
  },
  "customer": {
    "id": "cus_1234567890",
    "email": "user@example.com",
    "name": null,
    "default_payment_method": "pm_1234567890"
  }
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication is required
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses have the following format:

```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per IP address

When a rate limit is exceeded, the API will return a `429 Too Many Requests` status code.

