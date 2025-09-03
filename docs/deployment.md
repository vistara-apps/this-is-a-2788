# Deployment Documentation

This document provides detailed information about deploying the Petfolio application to production.

## Overview

Petfolio is a web application built with React and Vite, using Supabase for backend services. The application is deployed to Vercel for hosting.

## Prerequisites

Before deploying the application, you need to have the following:

1. A Supabase account and project
2. A Stripe account and API keys
3. A Vercel account
4. The Petfolio codebase

## Environment Variables

The following environment variables are required for the application to function properly:

### Supabase Configuration

- `VITE_SUPABASE_URL`: The URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project

### Stripe Configuration

- `VITE_STRIPE_PUBLIC_KEY`: The publishable key for your Stripe account
- `STRIPE_SECRET_KEY`: The secret key for your Stripe account (server-side only)
- `STRIPE_WEBHOOK_SECRET`: The webhook secret for your Stripe account (server-side only)

### Application Configuration

- `VITE_APP_URL`: The URL of your application
- `VITE_APP_NAME`: The name of your application (default: "Petfolio")
- `VITE_APP_DESCRIPTION`: The description of your application

## Deployment Steps

### 1. Set Up Supabase

1. Create a new Supabase project
2. Run the database migration scripts to create the required tables and RLS policies
3. Set up storage buckets for photo uploads
4. Configure authentication settings (email templates, redirect URLs, etc.)

#### Database Migration

The database migration scripts are located in the `src/lib/schema.sql` file. You can run these scripts in the Supabase SQL editor.

#### Storage Configuration

Create a storage bucket named `photos` with the following settings:

- Public access: Enabled
- File size limit: 10MB
- Allowed file extensions: `.jpg`, `.jpeg`, `.png`, `.webp`

### 2. Set Up Stripe

1. Create a Stripe account
2. Set up products and prices for the subscription plans
3. Configure webhooks to notify your application of subscription events

#### Subscription Plans

Create the following subscription plans in Stripe:

1. **Basic Plan**
   - Price: $10/month
   - Features: Up to 3 galleries, 100 photos storage, basic customization options

2. **Premium Plan**
   - Price: $25/month
   - Features: Unlimited galleries, unlimited photos storage, advanced customization options, custom domain support

#### Webhook Configuration

Configure a webhook endpoint in Stripe to receive subscription events. The webhook endpoint should be:

```
https://your-app-url.com/api/stripe-webhook
```

The webhook should listen for the following events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 3. Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy the application

#### Vercel Configuration

Create a `vercel.json` file in the root of your project with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Environment Variables

Configure the environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to the "Environment Variables" tab
3. Add all the required environment variables

### 4. Set Up Custom Domain (Optional)

If you want to use a custom domain for your application:

1. Purchase a domain from a domain registrar
2. Add the domain to your Vercel project
3. Configure the DNS settings as instructed by Vercel

## Continuous Integration/Continuous Deployment (CI/CD)

Vercel automatically deploys your application when you push changes to your repository. You can configure the following CI/CD settings:

1. **Production Branch**: The branch that will be deployed to production (default: `main`)
2. **Preview Deployments**: Automatically create preview deployments for pull requests
3. **Automatic Deployments**: Automatically deploy changes when pushed to the production branch

## Monitoring and Logging

### Application Monitoring

Use Vercel Analytics to monitor your application's performance and usage:

1. Go to your Vercel project dashboard
2. Navigate to the "Analytics" tab
3. View performance metrics, usage statistics, and error reports

### Error Tracking

Integrate an error tracking service like Sentry to monitor and track errors in your application:

1. Create a Sentry account and project
2. Add the Sentry SDK to your application
3. Configure the Sentry environment variables

```javascript
// src/lib/errorLogging.js
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENV || 'development',
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
  });
};
```

### Database Monitoring

Use Supabase's built-in monitoring tools to track database performance and usage:

1. Go to your Supabase project dashboard
2. Navigate to the "Monitoring" tab
3. View database metrics, query performance, and storage usage

## Backup and Recovery

### Database Backups

Supabase automatically creates daily backups of your database. You can also manually create backups:

1. Go to your Supabase project dashboard
2. Navigate to the "Database" tab
3. Click on "Backups"
4. Create a manual backup or restore from an existing backup

### Storage Backups

Supabase Storage does not provide automatic backups. You should implement a backup strategy for your storage buckets:

1. Use the Supabase Storage API to list all files
2. Download the files to a secure location
3. Schedule regular backups using a cron job or similar mechanism

## Security Considerations

### SSL/TLS

Ensure that your application is served over HTTPS to encrypt data in transit. Vercel automatically provisions SSL certificates for your domains.

### Authentication

Use Supabase Auth for secure authentication. Configure the following security settings:

1. Minimum password length: 8 characters
2. Email confirmation: Required
3. Rate limiting: Enabled

### Data Protection

Implement the following data protection measures:

1. Use Row-Level Security (RLS) policies to restrict access to data
2. Encrypt sensitive data in the database
3. Implement proper input validation to prevent SQL injection and XSS attacks

### API Security

Secure your API endpoints with the following measures:

1. Use JWT tokens for authentication
2. Implement rate limiting to prevent abuse
3. Validate and sanitize all input data

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Use dynamic imports to split your code into smaller chunks
2. **Image Optimization**: Use responsive images and lazy loading
3. **Caching**: Implement proper caching strategies for static assets

### Backend Optimization

1. **Database Indexes**: Create indexes for frequently queried fields
2. **Query Optimization**: Optimize database queries to reduce execution time
3. **Connection Pooling**: Use connection pooling to reduce database connection overhead

## Scaling Considerations

### Horizontal Scaling

Vercel automatically scales your application horizontally based on traffic. No additional configuration is required.

### Database Scaling

Supabase provides several options for scaling your database:

1. **Compute Size**: Upgrade your database compute size for better performance
2. **Read Replicas**: Add read replicas to distribute read queries
3. **Connection Pooling**: Enable connection pooling to handle more concurrent connections

## Troubleshooting

### Common Deployment Issues

1. **Environment Variables**: Ensure that all required environment variables are set correctly
2. **Build Errors**: Check the build logs for errors and warnings
3. **API Connectivity**: Verify that your application can connect to Supabase and Stripe

### Debugging Tools

1. **Vercel Logs**: View deployment and runtime logs in the Vercel dashboard
2. **Supabase Logs**: View database and API logs in the Supabase dashboard
3. **Browser DevTools**: Use browser developer tools to debug frontend issues

## Maintenance

### Regular Updates

1. **Dependency Updates**: Regularly update dependencies to fix security vulnerabilities and bugs
2. **Feature Updates**: Deploy new features and improvements based on user feedback
3. **Security Updates**: Apply security patches and updates as needed

### Monitoring and Alerts

1. **Uptime Monitoring**: Set up uptime monitoring to detect downtime
2. **Error Alerts**: Configure alerts for critical errors and exceptions
3. **Performance Alerts**: Set up alerts for performance degradation

## Conclusion

Following these deployment guidelines will help you successfully deploy and maintain the Petfolio application in production. Remember to regularly monitor the application's performance and security, and apply updates as needed.

