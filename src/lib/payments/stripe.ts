import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['10 emails/month', 'Basic classification', '1 user'],
  },
  pro: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: ['Unlimited emails', 'Advanced AI classification', 'Invoice tracking', 'Priority support'],
  },
} as const

export type PlanKey = keyof typeof PLANS

export const createCheckoutSession = async (customerId: string, priceId: string, successUrl: string, cancelUrl: string) => {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

export const createBillingPortalSession = async (customerId: string, returnUrl: string) => {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export const createCustomer = async (email: string, name?: string) => {
  return stripe.customers.create({
    email,
    name,
  })
}

export const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId)
}
