import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import {
  ArrowRight, Layers, Palette, Lock, BarChart3, Type, Tags,
  Maximize2, ChevronDown, ChevronUp, Zap, Globe, Shield,
  Check, X as XIcon
} from 'lucide-react';

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: 'What is Flowboard?',
    a: 'Flowboard is a visual content publication platform for creators. Instead of a blog or a link-in-bio page, you get a beautiful card-based board where you can publish articles, short posts, quotes, links, and images — all from one shareable URL.',
  },
  {
    q: 'How is Flowboard different from Linktree or Substack?',
    a: 'Linktree is just links. Substack is just a newsletter. Flowboard is a visual content board — your articles, thoughts, and media live together in a curated grid that readers can browse, filter by tag, and read in a full-page overlay. Think of it as your own editorial magazine.',
  },
  {
    q: 'Is Flowboard free to use?',
    a: 'Yes. The free plan gives you 1 board with up to 10 cards, all 5 card types, and a public URL. Upgrade to Creator ($9/mo) for unlimited content and analytics, or Pro ($24/mo) for subscriptions and monetization.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Custom domains are available on the Pro plan. You can point your own domain (like undercurrent.xyz) to your Flowboard.',
  },
  {
    q: 'What kind of content can I publish?',
    a: 'Five card types: long-form articles with a rich text editor, short provocative posts, memorable quotes, external links, and images. Each card can have a cover image, tags, and be marked as free or premium.',
  },
  {
    q: 'Can I monetize my content?',
    a: 'On the Pro plan, you can connect Stripe, set a subscription price, and gate premium cards behind a paywall. Readers subscribe directly from your board.',
  },
];

/* ─── Pricing Data ─── */
const plans = [
  {
    name: 'Free',
    price: '0',
    desc: 'Get started and publish your first board.',
    features: [
      '1 board',
      'Up to 10 cards',
      'All 5 card types',
      'Public board URL',
      'Basic customization',
      'Flowboard branding',
    ],
    excluded: ['Analytics', 'Image uploads', 'Custom domain', 'Subscriptions'],
    cta: 'Start free',
    accent: false,
  },
  {
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
    cta: 'Start creating',
    accent: true,
  },
  {
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
    cta: 'Go Pro',
    accent: false,
  },
];

/* ─── Steps Data ─── */
const steps = [
  {
    num: '01',
    title: 'Create your board',
    desc: 'Sign up, name your board, and choose your visual style. Pick your accent color, typography, and layout.',
  },
  {
    num: '02',
    title: 'Add your content',
    desc: 'Write articles with the rich text editor, drop in quotes, link external pieces, upload images. Tag and organize as you go.',
  },
  {
    num: '03',
    title: 'Publish and share',
    desc: 'Hit publish. Your board gets a clean URL you can put anywhere — bio link, email signature, portfolio. Readers click, browse, and read.',
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';

  return (
    <>
      <Head>
        <title>Flowboard — Visual content boards for creators</title>
        <meta
          name="description"
          content="Create beautiful, card-based content boards. Publish articles, thoughts, and links in one curated space. The editorial home for modern creators."
        />
      </Head>

      <div style={{ backgroundColor: 'var(--flow-paper)', color: 'var(--flow-ink)' }}>

        {/* ═══════════ NAV ═══════════ */}
        <header style={{
          padding: '20px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', backgroundColor: 'var(--flow-ink)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '14px', fontWeight: 'bold' }}>F</span>
            </div>
            <span style={{ fontFamily: '"DM Serif Display"', fontSize: '18px' }}>Flowboard</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ fontSize: '14px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '14px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: '14px', color: 'var(--flow-muted)', textDecoration: 'none' }}>FAQ</a>
            <Link href={ctaHref} className="btn-primary" style={{ fontSize: '14px' }}>
              {isSignedIn ? 'Dashboard' : 'Get started'}
              <ArrowRight size={14} />
            </Link>
          </nav>
        </header>

        {/* ═══════════ HERO ═══════════ */}
        <section style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 14px', borderRadius: '9999px', fontSize: '11px',
            fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.05em',
            backgroundColor: 'rgba(232, 93, 58, 0.1)', color: 'var(--flow-accent)',
            marginBottom: '32px',
          }}>
            Now in beta
          </div>

          <h1 style={{
            fontFamily: '"DM Serif Display"',
            fontSize: 'clamp(40px, 7vw, 72px)',
            lineHeight: '1.05',
            marginBottom: '24px',
          }}>
            Your ideas deserve
            <br />
            <span style={{ color: 'var(--flow-accent)', fontStyle: 'italic' }}>a beautiful home.</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--flow-muted)',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: '1.7',
          }}>
            Flowboard turns your writing into a curated, visual publication.
            Articles, quotes, links, and images — one board, one link, infinite depth.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' as const }}>
            <Link href={ctaHref} className="btn-accent" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Create your board
              <ArrowRight size={16} />
            </Link>
            <a href="#how" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '15px' }}>
              See how it works
            </a>
          </div>
        </section>

        {/* ═══════════ BOARD PREVIEW ═══════════ */}
        <section style={{
          maxWidth: '1000px',
          margin: '0 auto 100px',
          padding: '0 24px',
        }}>
          <div style={{
            backgroundColor: 'var(--flow-surface)',
            border: '1px solid var(--flow-border)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '24px', marginBottom: '4px' }}>The Undercurrent</h3>
              <p style={{ fontSize: '13px', color: 'var(--flow-muted)' }}>Psychology-first thinking for intentional creators</p>
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--flow-accent)', margin: '16px auto 0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { type: 'ARTICLE', title: 'Why You Care So Much What People Think', excerpt: "You're not weak for wanting approval. But there's a line between belonging and disappearing." },
                { type: 'SHORT', title: 'The Collision Economy', excerpt: 'Visibility is no longer granted. It is contested.' },
                { type: 'QUOTE', title: '"The hero\'s journey isn\'t about events — it\'s about internal transformation."', excerpt: '— Joseph Campbell' },
              ].map((card, i) => (
                <div key={i} style={{
                  backgroundColor: 'var(--flow-paper)',
                  border: '1px solid var(--flow-border)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <span style={{
                    fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em', color: 'var(--flow-muted)', display: 'block', marginBottom: '8px',
                  }}>
                    {card.type}
                  </span>
                  <h4 style={{ fontFamily: '"DM Serif Display"', fontSize: '15px', lineHeight: '1.3', marginBottom: '6px' }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--flow-muted)', lineHeight: '1.5' }}>{card.excerpt}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--flow-muted)', marginTop: '16px' }}>
              Powered by Flowboard
            </p>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section id="how" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '80px 24px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '36px', marginBottom: '12px' }}>
              How it works
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--flow-muted)' }}>
              From idea to published board in three steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  border: '2px solid var(--flow-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: '"DM Serif Display"', fontSize: '20px', color: 'var(--flow-accent)',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '20px', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--flow-muted)', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section id="features" style={{
          backgroundColor: 'var(--flow-warm)',
          padding: '80px 24px',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '36px', marginBottom: '12px' }}>
                Everything you need to publish
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--flow-muted)' }}>
                No bloat. Just the tools that matter for creators who write and think.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { icon: Layers, title: 'Mixed-format cards', desc: 'Articles, short posts, quotes, links, and images — all on one board with a unified layout.' },
                { icon: Type, title: 'Rich text editor', desc: 'Headings, bold, italic, lists, blockquotes, inline images. Write beautifully, not in markdown.' },
                { icon: Tags, title: 'Tags & filtering', desc: 'Organize cards by topic. Readers filter your board by tag to find exactly what they want.' },
                { icon: Maximize2, title: 'Full-page reading', desc: 'Clicking a card opens it in a Medium-style overlay — immersive, distraction-free reading.' },
                { icon: BarChart3, title: 'Analytics', desc: 'Track board views, card clicks, and top content. Know what resonates with your audience.' },
                { icon: Palette, title: 'Your brand', desc: 'Custom colors, typography, and layout. Your board looks like you, not like a template.' },
                { icon: Lock, title: 'Premium gating', desc: 'Tag cards as premium. Connect Stripe and let readers subscribe to unlock your best work.' },
                { icon: Globe, title: 'One link', desc: 'Your entire publication lives at one URL. Put it in your bio, email signature, or portfolio.' },
                { icon: Shield, title: 'You own it', desc: 'Your content, your audience, your domain. No algorithm deciding who sees your work.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  backgroundColor: 'var(--flow-surface)',
                  border: '1px solid var(--flow-border)',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <Icon size={20} style={{ color: 'var(--flow-accent)', marginBottom: '12px' }} />
                  <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '16px', marginBottom: '6px' }}>{title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--flow-muted)', lineHeight: '1.6' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PRICING ═══════════ */}
        <section id="pricing" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '80px 24px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '36px', marginBottom: '12px' }}>
              Simple, honest pricing
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--flow-muted)' }}>
              Start free. Upgrade when you are ready.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{
                backgroundColor: 'var(--flow-surface)',
                border: plan.accent ? '2px solid var(--flow-accent)' : '1px solid var(--flow-border)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative' as const,
              }}>
                {plan.accent && (
                  <div style={{
                    position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'var(--flow-accent)', color: '#fff',
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '9999px',
                  }}>
                    Most popular
                  </div>
                )}
                <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '22px', marginBottom: '4px' }}>{plan.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--flow-muted)', marginBottom: '16px' }}>{plan.desc}</p>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontFamily: '"DM Serif Display"', fontSize: '40px' }}>${plan.price}</span>
                  <span style={{ fontSize: '13px', color: 'var(--flow-muted)' }}>/month</span>
                </div>

                <Link href={ctaHref} className={plan.accent ? 'btn-accent' : 'btn-secondary'} style={{
                  width: '100%', justifyContent: 'center', marginBottom: '24px', padding: '12px',
                }}>
                  {plan.cta}
                </Link>

                <div style={{ borderTop: '1px solid var(--flow-border)', paddingTop: '16px' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <Check size={14} style={{ color: 'var(--flow-accent)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px' }}>{f}</span>
                    </div>
                  ))}
                  {plan.excluded.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <XIcon size={14} style={{ color: 'var(--flow-border)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'var(--flow-muted)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" style={{
          backgroundColor: 'var(--flow-warm)',
          padding: '80px 24px',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '36px', marginBottom: '12px' }}>
                Frequently asked questions
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--flow-muted)' }}>
                Everything you need to know about Flowboard.
              </p>
            </div>

            <div>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  borderBottom: '1px solid var(--flow-border)',
                  padding: '20px 0',
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                      fontFamily: '"DM Serif Display"', fontSize: '17px', textAlign: 'left' as const,
                      color: 'var(--flow-ink)',
                    }}
                  >
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === i && (
                    <p style={{
                      fontSize: '14px', color: 'var(--flow-muted)', lineHeight: '1.7',
                      marginTop: '12px', paddingRight: '32px',
                    }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '100px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: '"DM Serif Display"',
            fontSize: 'clamp(28px, 5vw, 44px)',
            lineHeight: '1.1',
            marginBottom: '16px',
          }}>
            Your content is worth
            <br />
            <span style={{ color: 'var(--flow-accent)', fontStyle: 'italic' }}>more than a link tree.</span>
          </h2>
          <p style={{
            fontSize: '16px', color: 'var(--flow-muted)', maxWidth: '480px',
            margin: '0 auto 32px', lineHeight: '1.7',
          }}>
            Start publishing on Flowboard today. Free forever on the starter plan — upgrade when your audience grows.
          </p>
          <Link href={ctaHref} className="btn-accent" style={{ padding: '16px 40px', fontSize: '16px' }}>
            Create your board
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer style={{
          borderTop: '1px solid var(--flow-border)',
          padding: '40px 24px',
        }}>
          <div style={{
            maxWidth: '1000px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap' as const, gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px', height: '24px', backgroundColor: 'var(--flow-ink)',
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '10px', fontWeight: 'bold' }}>F</span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--flow-muted)' }}>
                &copy; 2026 Flowboard. Built with intention.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="/terms" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Terms</a>
              <a href="/sign-in" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Sign in</a>
              <a href="/sign-up" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Sign up</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
