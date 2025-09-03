import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Helper function to handle Stripe errors
const handleStripeError = (error) => {
  console.error('Stripe error:', error);
  return {
    error: {
      message: error.message || 'An unexpected error occurred with payment processing',
      status: error.status || 500,
    }
  };
};

// Create a checkout session
export const createCheckoutSession = async (userId, priceId) => {
  try {
    // Call the Supabase function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { userId, priceId }
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (stripeError) throw stripeError;

    return { success: true };
  } catch (error) {
    return handleStripeError(error);
  }
};

// Create a customer portal session
export const createCustomerPortalSession = async (userId) => {
  try {
    // Call the Supabase function to create a customer portal session
    const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
      body: { userId }
    });

    if (error) throw error;

    // Redirect to the customer portal
    window.location.href = data.url;

    return { success: true };
  } catch (error) {
    return handleStripeError(error);
  }
};

// Get subscription details
export const getSubscriptionDetails = async (userId) => {
  try {
    // Call the Supabase function to get subscription details
    const { data, error } = await supabase.functions.invoke('get-subscription-details', {
      body: { userId }
    });

    if (error) throw error;

    return { data };
  } catch (error) {
    return handleStripeError(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    // Call the Supabase function to cancel a subscription
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;

    return { data };
  } catch (error) {
    return handleStripeError(error);
  }
};

// Resume subscription
export const resumeSubscription = async (subscriptionId) => {
  try {
    // Call the Supabase function to resume a subscription
    const { data, error } = await supabase.functions.invoke('resume-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;

    return { data };
  } catch (error) {
    return handleStripeError(error);
  }
};

// Update subscription
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    // Call the Supabase function to update a subscription
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { subscriptionId, newPriceId }
    });

    if (error) throw error;

    return { data };
  } catch (error) {
    return handleStripeError(error);
  }
};

