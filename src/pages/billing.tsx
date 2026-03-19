import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Check, X as XIcon, Sparkles, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

interface PlanInfo {
  plan: string;
  maxBoards: number;
  maxCardsPerBoard: number;
  canRemoveBranding: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasSubscriptions: boolean;
}

const plans = [
  {
    key: 'free',
    name: 'Free',
    price: '0',
    desc: 'Get started and publish your first board.',
    features: [
      '1 board',
      'Up to 10 cards',
      'All 5 card types',
      'Public board URL',
      'Flowboard branding',
    ],
    excluded: ['Analytics', 'Image uploads', 'Custom domain', 'Subscriptions'],
  },
  {
    key: 'creator',
    name: 'Creator',
    price: '9',
    desc: 'For creators building an audience.',
    features: [
      'Unlimited boards & cards',
      'Remove Flowboard branding',
      'Full design customization',
      'Image uploads',
      'Analytics dashboard',
      'Email collection',
      'SEO meta tags',
    ],
    excluded: ['Custom domain', 'Subscriptions'],
    popular: true,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '24',
    desc: 'For creators who monetize their work.',
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
    excluded: [],
  },
];

export default function Billing() {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch('/api/billing/plan')
      .then((r) => r.json())
      .then((json) => { if (json.data) setPlanInfo(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Billing">
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-flow-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const currentPlan = planInfo?.plan || 'free';

  return (
    <>
      <Head>
        <title>Billing — Flowboard</title>
      </Head>

      <DashboardLayout title="Billing">
        <div className="max-w-4xl">
          {/* Current plan banner */}
          <div className="card-base p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-flow-accent" />
                <h2 className="font-display text-lg text-flow-ink">
                  {plans.find((p) => p.key === currentPlan)?.name} plan
                </h2>
              </div>
              <p className="text-sm text-flow-muted">
                {currentPlan === 'free'
                  ? 'Upgrade to unlock unlimited boards, analytics, and more.'
                  : 'Thank you for supporting Flowboard!'}
              </p>
            </div>
            {currentPlan !== 'free' && (
              <button
                onClick={handleManage}
                disabled={portalLoading}
                className="btn-secondary text-xs gap-1.5"
              >
                {portalLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CreditCard size={13} />
                )}
                Manage subscription
              </button>
            )}
          </div>

          {/* Pricing cards */}
          <div className="grid sm:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.key;
              const isUpgrade =
                (currentPlan === 'free' && plan.key !== 'free') ||
                (currentPlan === 'creator' && plan.key === 'pro');
              const isDowngrade =
                (currentPlan === 'pro' && plan.key === 'creator') ||
                (currentPlan !== 'free' && plan.key === 'free');

              return (
                <div
                  key={plan.key}
                  className={`card-base p-6 relative ${
                    plan.popular ? 'border-2 border-flow-accent' : ''
                  } ${isCurrent ? 'ring-2 ring-flow-ink/10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-flow-accent text-white
                                    text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                      Most popular
                    </div>
                  )}

                  <h3 className="font-display text-xl mb-1">{plan.name}</h3>
                  <p className="text-xs text-flow-muted mb-4">{plan.desc}</p>

                  <div className="mb-5">
                    <span className="font-display text-3xl">${plan.price}</span>
                    <span className="text-sm text-flow-muted">/month</span>
                  </div>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="w-full py-2.5 text-center text-xs font-medium text-flow-muted
                                    border border-flow-border rounded-lg mb-5">
                      Current plan
                    </div>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plan.key)}
                      disabled={checkoutLoading === plan.key}
                      className="btn-accent w-full text-xs justify-center gap-1.5 mb-5"
                    >
                      {checkoutLoading === plan.key ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <>
                          Upgrade <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  ) : isDowngrade ? (
                    <button
                      onClick={handleManage}
                      className="btn-secondary w-full text-xs justify-center mb-5"
                    >
                      Downgrade
                    </button>
                  ) : (
                    <div className="mb-5" />
                  )}

                  {/* Features */}
                  <div className="border-t border-flow-border pt-4 space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-flow-accent mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                    {plan.excluded.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <XIcon size={13} className="text-flow-border mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-flow-muted">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
