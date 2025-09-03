import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Check, ArrowRight } from 'lucide-react';

function Home() {
  const features = [
    {
      title: 'Remix-based Photo Gallery Template',
      description: 'Launch a professional-looking photography website in minutes, not days.',
      icon: <Camera className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Managed Hosting & Deployment',
      description: 'Focus on your photography, not server management; all technical complexities are handled.',
      icon: <Camera className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Simple Photo Uploader & Gallery Editor',
      description: 'Effortlessly manage your growing portfolio without any technical expertise.',
      icon: <Camera className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Theme & Branding Customization',
      description: 'Create a unique online identity that reflects your artistic style.',
      icon: <Camera className="h-6 w-6 text-primary" />,
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: '$10',
      period: 'per month',
      description: 'Perfect for beginners and hobbyists',
      features: [
        'Up to 3 galleries',
        '100 photos storage',
        'Basic customization options',
        'Petfolio subdomain',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '$25',
      period: 'per month',
      description: 'For professional photographers',
      features: [
        'Unlimited galleries',
        'Unlimited photos storage',
        'Advanced customization options',
        'Custom domain support',
        'Priority support',
        'Analytics dashboard',
        'SEO optimization tools',
      ],
      cta: 'Go Premium',
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="gradient-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Camera className="h-8 w-8" />
                <span className="text-xl font-bold">Petfolio</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your animal photography website, effortlessly built and hosted.
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                A simple, customizable website builder for animal photographers to showcase their work online.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center transition-colors duration-200"
                >
                  Get Started Free
                </Link>
                <a
                  href="#features"
                  className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 px-6 py-3 rounded-md font-medium text-center transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=600&fit=crop"
                  alt="Dog photography"
                  className="rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Everything you need to showcase your animal photography
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Petfolio provides all the tools you need to create a beautiful online portfolio for your animal photography.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-card">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Choose the plan that's right for you and start building your animal photography portfolio today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden ${
                  plan.highlighted
                    ? 'border-2 border-primary shadow-lg'
                    : 'border border-gray-200 shadow-card'
                }`}
              >
                <div
                  className={`p-6 ${
                    plan.highlighted ? 'gradient-bg text-white' : 'bg-white text-text-primary'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="ml-2 text-sm opacity-80">{plan.period}</span>
                  </div>
                  <p className={`mt-4 ${plan.highlighted ? 'text-gray-100' : 'text-text-secondary'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="bg-white p-6">
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-md font-medium text-center transition-colors duration-200 ${
                      plan.highlighted
                        ? 'bg-primary text-white hover:bg-accent'
                        : 'bg-white text-primary border border-primary hover:bg-gray-50'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to showcase your animal photography?
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-3xl mx-auto">
            Join thousands of animal photographers who use Petfolio to share their work with the world.
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-md font-medium text-lg inline-block transition-colors duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Camera className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-text-primary">Petfolio</span>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-text-secondary">
              <a href="#features" className="hover:text-primary transition-colors duration-200">
                Features
              </a>
              <a href="#pricing" className="hover:text-primary transition-colors duration-200">
                Pricing
              </a>
              <Link to="/signin" className="hover:text-primary transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/signup" className="hover:text-primary transition-colors duration-200">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Petfolio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

