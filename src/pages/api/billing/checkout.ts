import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { stripe, PLANS } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { plan } = req.body;
  if (plan !== 'creator' && plan !== 'pro') {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const priceId = PLANS[plan].priceId;
  if (!priceId) return res.status(500).json({ error: 'Price not configured' });

  // Check if user already has a Stripe customer ID
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  let customerId = sub?.stripe_customer_id;

  // Create customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { user_id: userId },
    });
    customerId = customer.id;

    // Upsert subscription record
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      plan: 'free',
      status: 'active',
    }, { onConflict: 'user_id' });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.headers.origin}/dashboard?upgraded=true`,
    cancel_url: `${req.headers.origin}/billing`,
    metadata: { user_id: userId, plan },
  });

  return res.status(200).json({ url: session.url });
}
