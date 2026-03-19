import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

// Plan definitions
export const PLANS = {
  free: {
    name: 'Free',
    maxBoards: 1,
    maxCardsPerBoard: 10,
    features: ['1 board', 'Up to 10 cards', 'All 5 card types', 'Public board URL', 'Flowboard branding'],
  },
  creator: {
    name: 'Creator',
    price: 900, // cents
    priceId: process.env.STRIPE_CREATOR_PRICE_ID!,
    maxBoards: 999,
    maxCardsPerBoard: 999,
    features: [
      'Unlimited boards & cards',
      'Remove Flowboard branding',
      'Full design customization',
      'Image uploads',
      'Analytics dashboard',
      'Email collection',
      'SEO meta tags',
    ],
  },
  pro: {
    name: 'Pro',
    price: 2400, // cents
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    maxBoards: 999,
    maxCardsPerBoard: 999,
    features: [
      'Everything in Creator',
      'Stripe subscriptions',
      'Content gating (paywall)',
      'Subscriber management',
      'Custom domain',
      'Newsletter broadcasts',
      'Earnings dashboard',
      'Priority support',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string): PlanKey {
  if (priceId === PLANS.creator.priceId) return 'creator';
  if (priceId === PLANS.pro.priceId) return 'pro';
  return 'free';
}
