import React, { useState } from 'react';
import { CreditCard, X, Loader } from 'lucide-react';
import { createCheckoutSession } from '../../lib/stripe';

function CheckoutForm({ plan, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would use the actual Stripe price ID
      const priceId = plan.id === 'premium' ? 'price_premium' : 'price_basic';
      
      const { error } = await createCheckoutSession(userId, priceId);
      
      if (error) throw error;
      
      // If successful, the user will be redirected to Stripe Checkout
      // If we reach here, something went wrong with the redirect
      onSuccess();
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'An error occurred while processing your payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary">
            Upgrade to {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">{plan.name} Plan</span>
              <span className="text-text-primary font-medium">{plan.price}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-text-secondary">Billing</span>
              <span className="text-text-primary font-medium">Monthly</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-text-primary font-medium">Total</span>
              <span className="text-text-primary font-bold">{plan.price}/month</span>
            </div>
          </div>

          <p className="text-text-secondary mb-6">
            You will be redirected to Stripe to complete your payment securely.
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;

