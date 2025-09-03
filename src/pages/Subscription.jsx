import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userFunctions } from '../lib/db';
import { 
  CreditCard, 
  Check, 
  AlertCircle,
  Loader,
  Shield,
  Clock,
  Image,
  Globe
} from 'lucide-react';

function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await userFunctions.getUserProfile(user.id);
        if (error) throw error;
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'An error occurred while loading your profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const plans = [
    {
      id: 'free',
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
      cta: 'Current Plan',
      highlighted: false,
    },
    {
      id: 'premium',
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
      cta: 'Upgrade to Premium',
      highlighted: true,
    },
  ];

  const handleSelectPlan = (plan) => {
    if (plan.id === profile?.subscriptionTier) {
      return; // Already on this plan
    }
    
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckout = async () => {
    // In a real implementation, this would redirect to Stripe Checkout
    // For this demo, we'll just update the subscription tier directly
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await userFunctions.updateSubscriptionTier(user.id, selectedPlan.id);
      if (error) throw error;
      
      setProfile(data);
      setShowCheckout(false);
      setSelectedPlan(null);
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError(err.message || 'An error occurred while updating your subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Subscription</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-text-primary font-medium">
              You are currently on the{' '}
              <span className="font-bold capitalize">{profile?.subscriptionTier || 'Free'}</span> plan.
            </p>
            <p className="text-text-secondary mt-1">
              {profile?.subscriptionTier === 'premium' 
                ? 'Enjoy all premium features and unlimited storage.'
                : 'Upgrade to Premium for unlimited galleries and advanced features.'}
            </p>
          </div>
          {profile?.subscriptionTier !== 'premium' && (
            <button
              onClick={() => handleSelectPlan(plans[1])}
              className="btn-primary mt-4 md:mt-0"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Plan comparison */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Available Plans</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg overflow-hidden ${
                plan.highlighted
                  ? 'border-2 border-primary shadow-lg'
                  : 'border border-gray-200'
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
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={plan.id === profile?.subscriptionTier}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-md font-medium text-center transition-colors duration-200 ${
                    plan.id === profile?.subscriptionTier
                      ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                      : plan.highlighted
                        ? 'bg-primary text-white hover:bg-accent'
                        : 'bg-white text-primary border border-primary hover:bg-gray-50'
                  }`}
                >
                  {plan.id === profile?.subscriptionTier ? 'Current Plan' : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-text-primary font-medium">Feature</th>
                <th className="py-3 px-4 text-center text-text-primary font-medium">Basic</th>
                <th className="py-3 px-4 text-center text-text-primary font-medium">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-text-secondary flex items-center">
                  <Image className="h-5 w-5 mr-2 text-primary" />
                  Galleries
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">Up to 3</td>
                <td className="py-3 px-4 text-center text-text-secondary">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-text-secondary flex items-center">
                  <Image className="h-5 w-5 mr-2 text-primary" />
                  Photo Storage
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">100 photos</td>
                <td className="py-3 px-4 text-center text-text-secondary">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-text-secondary flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Custom Domain
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-text-secondary flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Priority Support
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-text-secondary flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Analytics Dashboard
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-red-500">✕</span>
                </td>
                <td className="py-3 px-4 text-center text-text-secondary">
                  <span className="text-green-500">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Upgrade to {selectedPlan.name}
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">{selectedPlan.name} Plan</span>
                  <span className="text-text-primary font-medium">{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-text-secondary">Billing</span>
                  <span className="text-text-primary font-medium">Monthly</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-text-primary font-medium">Total</span>
                  <span className="text-text-primary font-bold">{selectedPlan.price}/month</span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="card-number" className="block text-sm font-medium text-text-secondary mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-text-secondary mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-text-secondary mb-1">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setSelectedPlan(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Processing...' : `Pay ${selectedPlan.price}/month`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;

