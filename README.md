# Petfolio

Your animal photography website, effortlessly built and hosted.

## Overview

Petfolio is a simple, customizable website builder for animal photographers to showcase their work online. It provides a pre-built, customizable website template using React, specifically designed for showcasing animal photography. Features include responsive design, optimized image loading, managed hosting & deployment, simple photo uploader & gallery editor, and theme & branding customization.

## Features

- **Remix-based Photo Gallery Template**: Launch a professional-looking photography website in minutes, not days.
- **Managed Hosting & Deployment**: Focus on your photography, not server management; all technical complexities are handled.
- **Simple Photo Uploader & Gallery Editor**: Effortlessly manage your growing portfolio without any technical expertise.
- **Theme & Branding Customization**: Create a unique online identity that reflects your artistic style.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payment Processing**: Stripe
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Stripe account (for payment processing)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/petfolio.git
cd petfolio
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and fill in your Supabase and Stripe credentials.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

1. Create a new Supabase project.
2. Run the database migration scripts in `src/lib/schema.sql` to create the required tables and RLS policies.
3. Set up storage buckets for photo uploads.

## Project Structure

```
petfolio/
├── docs/                  # Documentation
│   ├── api.md             # API documentation
│   ├── authentication.md  # Authentication documentation
│   ├── data-model.md      # Data model documentation
│   └── deployment.md      # Deployment documentation
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── gallery/       # Gallery components
│   │   ├── layouts/       # Layout components
│   │   ├── photo/         # Photo components
│   │   └── subscription/  # Subscription components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API clients
│   ├── pages/             # Page components
│   ├── routes/            # Route definitions
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore file
├── package.json           # Package configuration
├── README.md              # Project documentation
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## API Documentation

See [docs/api.md](docs/api.md) for detailed API documentation.

## Authentication

See [docs/authentication.md](docs/authentication.md) for detailed authentication documentation.

## Data Model

See [docs/data-model.md](docs/data-model.md) for detailed data model documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [Vercel](https://vercel.com/)

