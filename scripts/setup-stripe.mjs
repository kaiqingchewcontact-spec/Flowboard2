// Run with: STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe.mjs

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setup() {
  console.log('Creating Flowboard product...');
  const product = await stripe.products.create({
    name: 'Flowboard',
    description: 'Visual content boards for creators',
  });
  console.log('Product ID:', product.id);

  console.log('Creating Creator price ($9/mo)...');
  const creatorPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 900,
    currency: 'usd',
    recurring: { interval: 'month' },
    lookup_key: 'creator_monthly',
  });
  console.log('Creator Price ID:', creatorPrice.id);

  console.log('Creating Pro price ($24/mo)...');
  const proPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 2400,
    currency: 'usd',
    recurring: { interval: 'month' },
    lookup_key: 'pro_monthly',
  });
  console.log('Pro Price ID:', proPrice.id);

  console.log('\n✅ Done! Add these to your .env / Vercel env vars:\n');
  console.log(`STRIPE_CREATOR_PRICE_ID=${creatorPrice.id}`);
  console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
}

setup().catch(console.error);
