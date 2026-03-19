import { supabaseAdmin } from './supabase';
import { PLANS, PlanKey } from './stripe';

export async function getUserPlan(userId: string): Promise<{
  plan: PlanKey;
  maxBoards: number;
  maxCardsPerBoard: number;
  canRemoveBranding: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasSubscriptions: boolean;
}> {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();

  const plan: PlanKey =
    data && data.status === 'active' && (data.plan === 'creator' || data.plan === 'pro')
      ? data.plan
      : 'free';

  const config = PLANS[plan];

  return {
    plan,
    maxBoards: config.maxBoards,
    maxCardsPerBoard: config.maxCardsPerBoard,
    canRemoveBranding: plan !== 'free',
    hasAnalytics: plan !== 'free',
    hasCustomDomain: plan === 'pro',
    hasSubscriptions: plan === 'pro',
  };
}
