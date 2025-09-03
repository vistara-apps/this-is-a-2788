# Data Model Documentation

This document provides detailed information about the data model used in Petfolio.

## Overview

Petfolio uses a relational database model with the following main entities:

- User
- Gallery
- Photo
- Website Settings
- Subscription History

The database is hosted on Supabase, which uses PostgreSQL as its underlying database engine.

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Gallery   │       │    Photo    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ userId (PK) │──1─┬─┐│ galleryId(PK)│──1─┬─┐│ photoId (PK)│
│ email       │    │ └┤ userId (FK)  │    │ └┤ galleryId(FK)│
│ subscription │    │  │ name        │    │  │ imageUrl    │
│ createdAt   │    │  │ description  │    │  │ filePath    │
│ updatedAt   │    │  │ createdAt    │    │  │ caption     │
└─────────────┘    │  │ updatedAt    │    │  │ order       │
                   │  └─────────────┘    │  │ uploadedAt   │
                   │                     │  │ updatedAt    │
                   │                     │  └─────────────┘
                   │                     │
                   │  ┌──────────────┐   │
                   │  │Website Settings│  │
                   │  ├──────────────┤   │
                   └─┐│ userId (PK,FK)│  │
                     └┤ theme         │  │
                      │ customDomain  │  │
                      │ isPublished   │  │
                      │ publishedUrl  │  │
                      │ createdAt     │  │
                      │ updatedAt     │  │
                      └──────────────┘  │
                                        │
                      ┌───────────────┐ │
                      │Subscription   │ │
                      │History        │ │
                      ├───────────────┤ │
                      │ id (PK)       │ │
                      │ userId (FK)   │◄┘
                      │ stripeCustomer│
                      │ stripeSubscrip│
                      │ plan          │
                      │ status        │
                      │ startDate     │
                      │ endDate       │
                      │ createdAt     │
                      │ updatedAt     │
                      └───────────────┘
```

## Entities

### User

The `User` entity represents a registered user of the application.

#### Schema

```sql
CREATE TABLE users (
  userId UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  subscriptionTier TEXT NOT NULL DEFAULT 'free',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fields

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| userId          | UUID      | Primary key, references auth.users(id)     |
| email           | TEXT      | User's email address                       |
| subscriptionTier| TEXT      | Subscription tier (free, premium)          |
| createdAt       | TIMESTAMP | When the user was created                  |
| updatedAt       | TIMESTAMP | When the user was last updated             |

#### Relationships

- One-to-many relationship with `Gallery`
- One-to-one relationship with `Website Settings`
- One-to-many relationship with `Subscription History`

### Gallery

The `Gallery` entity represents a collection of photos created by a user.

#### Schema

```sql
CREATE TABLE galleries (
  galleryId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fields

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| galleryId       | UUID      | Primary key                                |
| userId          | UUID      | Foreign key to users(userId)               |
| name            | TEXT      | Gallery name                               |
| description     | TEXT      | Gallery description (optional)             |
| createdAt       | TIMESTAMP | When the gallery was created               |
| updatedAt       | TIMESTAMP | When the gallery was last updated          |

#### Relationships

- Many-to-one relationship with `User`
- One-to-many relationship with `Photo`

### Photo

The `Photo` entity represents an image uploaded by a user to a gallery.

#### Schema

```sql
CREATE TABLE photos (
  photoId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  galleryId UUID NOT NULL REFERENCES galleries(galleryId) ON DELETE CASCADE,
  imageUrl TEXT NOT NULL,
  filePath TEXT,
  caption TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fields

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

#### Relationships

- Many-to-one relationship with `Gallery`

### Website Settings

The `Website Settings` entity represents the settings for a user's website.

#### Schema

```sql
CREATE TABLE website_settings (
  userId UUID PRIMARY KEY REFERENCES users(userId) ON DELETE CASCADE,
  theme JSONB NOT NULL DEFAULT '{"layout": "3col", "primaryColor": "#667eea", "accentColor": "#764ba2", "backgroundColor": "#f8fafc"}',
  customDomain TEXT,
  isPublished BOOLEAN NOT NULL DEFAULT FALSE,
  publishedUrl TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fields

| Field           | Type      | Description                                |
|-----------------|-----------|-------------------------------------------|
| userId          | UUID      | Primary key, references users(userId)      |
| theme           | JSONB     | Theme settings (layout, colors, etc.)      |
| customDomain    | TEXT      | Custom domain (premium feature)            |
| isPublished     | BOOLEAN   | Whether the website is published           |
| publishedUrl    | TEXT      | URL to the published website               |
| createdAt       | TIMESTAMP | When the settings were created             |
| updatedAt       | TIMESTAMP | When the settings were last updated        |

#### Relationships

- One-to-one relationship with `User`

#### Theme JSON Structure

```json
{
  "layout": "3col",
  "primaryColor": "#667eea",
  "accentColor": "#764ba2",
  "backgroundColor": "#f8fafc"
}
```

### Subscription History

The `Subscription History` entity represents the history of a user's subscription.

#### Schema

```sql
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  stripeCustomerId TEXT,
  stripeSubscriptionId TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  startDate TIMESTAMP WITH TIME ZONE,
  endDate TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fields

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

#### Relationships

- Many-to-one relationship with `User`

## Indexes

To optimize query performance, the following indexes are created:

```sql
-- Galleries table
CREATE INDEX idx_galleries_userId ON galleries(userId);

-- Photos table
CREATE INDEX idx_photos_galleryId ON photos(galleryId);
CREATE INDEX idx_photos_order ON photos(order);

-- Subscription History table
CREATE INDEX idx_subscription_history_userId ON subscription_history(userId);
CREATE INDEX idx_subscription_history_status ON subscription_history(status);
```

## Row-Level Security (RLS)

Supabase uses PostgreSQL's Row-Level Security (RLS) to enforce access control at the database level. RLS policies ensure that users can only access their own data.

For detailed information about RLS policies, see the [Authentication Documentation](authentication.md).

## Data Validation

Data validation is performed at multiple levels:

1. **Database constraints**: Primary keys, foreign keys, NOT NULL constraints, etc.
2. **Application validation**: Input validation in the client application
3. **API validation**: Validation in the API endpoints

## Data Migration

For data migration, we use Supabase's migration tools. Migration scripts are stored in the `supabase/migrations` directory.

## Storage

File storage is handled by Supabase Storage. Files are organized in the following structure:

```
photos/
  ├── <userId>/
  │   ├── <galleryId>/
  │   │   ├── <filename>
  │   │   └── ...
  │   └── ...
  └── ...
```

## Best Practices

1. **Use UUIDs for primary keys**: UUIDs provide better security and scalability than sequential IDs.

2. **Include timestamps**: All tables include `createdAt` and `updatedAt` timestamps for auditing purposes.

3. **Use foreign keys**: Foreign keys ensure referential integrity between tables.

4. **Implement cascading deletes**: When a parent record is deleted, all related child records are automatically deleted.

5. **Use Row-Level Security**: RLS policies ensure that users can only access their own data.

6. **Normalize data**: The database schema follows normalization principles to reduce redundancy and improve data integrity.

7. **Use indexes**: Indexes improve query performance for frequently accessed fields.

8. **Use JSON for flexible data**: The `theme` field in the `Website Settings` table uses JSONB to store flexible theme settings.

