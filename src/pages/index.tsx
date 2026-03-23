import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import {
  ArrowRight, FileText, MessageSquare, Quote, Link2, ImageIcon,
  Sparkles, Check, X as XIcon, ChevronDown, ChevronUp,
} from 'lucide-react';

/* ─── Demo Card Data ─── */
const DEMO_CARDS = [
  { type: 'article' as const, title: 'Why I left my job to build in public', excerpt: 'A raw, unfiltered look at the first 90 days of going independent.', tags: ['personal', 'building'] },
  { type: 'quote' as const, title: '"Ship something small every week. Momentum compounds."', excerpt: null, tags: ['wisdom'] },
  { type: 'link' as const, title: 'The best tools for solo creators in 2026', excerpt: 'creativeboom.com', tags: ['tools', 'curation'] },
  { type: 'short' as const, title: 'Hot take: your portfolio site is not your brand. Your ideas are.', excerpt: null, tags: ['thoughts'] },
  { type: 'image' as const, title: 'Studio snapshot — new workspace setup', excerpt: null, tags: ['behind-the-scenes'] },
  { type: 'article' as const, title: 'How to price creative work without undercharging', excerpt: 'A framework I wish someone gave me five years ago.', tags: ['business', 'freelance'] },
];

const CARD_ICONS: Record<string, typeof FileText> = {
  article: FileText, short: MessageSquare, quote: Quote, link: Link2, image: ImageIcon,
};

const ACCENT_PRESETS = ['#e85d3a', '#2563eb', '#059669', '#7c3aed', '#d946ef', '#0a0a0a'];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { quote: 'I replaced my portfolio, newsletter archive, and reading list with one Flowboard. It feels like a personal magazine.', name: 'Sarah C.', role: 'Essayist, 14k subscribers', initials: 'SC' },
  { quote: 'Finally, a link-in-bio that doesn\'t look like everyone else\'s. The card layout actually makes people click more.', name: 'Marcus O.', role: 'Indie hacker, Product Hunt maker', initials: 'MO' },
  { quote: 'Took 3 minutes to set up. My audience keeps asking what designer I hired.', name: 'Elena R.', role: 'YouTube creator, 200k followers', initials: 'ER' },
];

/* ─── FAQ ─── */
const FAQS = [
  { q: 'Is Flowboard a website builder or a link-in-bio tool?', a: 'Both, but simpler. You get the visual impact of a personal website with the instant setup of a link-in-bio. No coding, no templates to configure — just your content, beautifully arranged.' },
  { q: 'Can I use my own domain?', a: 'Yes. Free users get flowboard.pub/yourname. Pro users can connect yourdomain.com with automatic SSL.' },
  { q: 'How is this different from Linktree or Carrd?', a: 'Linktree organizes links. Carrd builds sites. Flowboard organizes content — articles automatically get previews, quotes get typography treatment, and links show rich metadata. It\'s Pinterest meets personal site.' },
  { q: 'What can I add to my board?', a: 'Five card types: Articles (with auto-preview), Short posts, Quote highlights, External links (with rich metadata), and Images. Mix and match to tell your story.' },
  { q: 'Is it really free?', a: 'The starter plan is free forever — unlimited cards, basic analytics, and standard themes. Upgrade to Creator ($9/month) for custom branding, or Pro ($24/month) for custom domains and monetization.' },
  { q: 'How do I share my Flowboard?', a: 'One URL works everywhere — Instagram bio, Twitter profile, email signature, or QR code on business cards. Updates publish instantly.' },
  { q: 'Can I see who\'s visiting?', a: 'Built-in analytics show views, clicks, and which content resonates most. Creator and Pro users get referrer data and top content rankings.' },
  { q: 'What happens if I cancel?', a: 'Your board stays live on the free tier. We never hold your content hostage — you can export everything anytime.' },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';

  const [boardName, setBoardName] = useState('');
  const [accent, setAccent] = useState('#e85d3a');
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    DEMO_CARDS.forEach((_, i) => {
      setTimeout(() => setRevealedCards((prev) => [...prev, i]), 300 + i * 120);
    });
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <Head>
        <title>Flowboard — One link. Everything you create.</title>
        <meta name="description" content="The visual content board for writers, makers, and independent thinkers. Turn scattered links into a stunning personal site — instantly." />
        <meta property="og:title" content="Flowboard — One link. Everything you create." />
        <meta property="og:description" content="Visual content boards for creators. Articles, thoughts, and links in one curated space." />
      </Head>

      <div style={{ backgroundColor: 'var(--flow-paper)', color: 'var(--flow-ink)', minHeight: '100vh' }}>

        {/* ═══ NAV ═══ */}
        <header style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--flow-ink)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '12px', fontWeight: 'bold' }}>F</span>
            </div>
            <span style={{ fontFamily: '"DM Serif Display"', fontSize: '16px' }}>Flowboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/explore" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Explore</Link>
            <Link href="/blog" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Blog</Link>
            <Link href="/sign-in" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Sign in</Link>
            <Link href={ctaHref} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              {isSignedIn ? 'Dashboard' : 'Get started'} <ArrowRight size={13} />
            </Link>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: '"DM Serif Display"', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.1', marginBottom: '12px' }}>
              One link.{' '}
              <span style={{ color: accent, fontStyle: 'italic', transition: 'color 0.3s' }}>Everything you create.</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--flow-muted)', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              The visual content board for writers, makers, and independent thinkers. Turn scattered links into a stunning personal site — instantly.
            </p>
            {/* Trust bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '12px', color: 'var(--flow-muted)' }}>
              <div style={{ display: 'flex' }}>
                {['SC', 'MO', 'ER'].map((init, i) => (
                  <div key={init} style={{
                    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--flow-accent)',
                    color: '#fff', fontSize: '8px', fontWeight: '700', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginLeft: i > 0 ? '-6px' : '0', border: '2px solid var(--flow-paper)',
                  }}>{init}</div>
                ))}
              </div>
              <span>Loved by creators · No credit card required</span>
            </div>
          </div>

          {/* ═══ BOARD BUILDER DEMO ═══ */}
          <div style={{ backgroundColor: 'var(--flow-surface)', border: '1px solid var(--flow-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 12px 48px rgba(0,0,0,0.04)' }}>
            {/* Toolbar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--flow-border)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
                <label style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '4px' }}>Board name</label>
                <input type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} placeholder="e.g. Undercurrent"
                  style={{ width: '100%', fontFamily: '"DM Serif Display"', fontSize: '20px', border: 'none', outline: 'none', backgroundColor: 'transparent', color: 'var(--flow-ink)', padding: '0' }} />
              </div>
              <div>
                <label style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '6px' }}>Accent</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {ACCENT_PRESETS.map((c) => (
                    <button key={c} onClick={() => setAccent(c)} style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: c, border: accent === c ? '2px solid var(--flow-ink)' : '2px solid transparent', cursor: 'pointer', transition: 'border-color 0.15s' }} />
                  ))}
                </div>
              </div>
              <div style={{ flex: '0 0 auto' }}>
                <label style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '6px' }}>Your URL</label>
                <div style={{ fontSize: '12px', fontFamily: '"JetBrains Mono"', color: 'var(--flow-muted)', backgroundColor: 'var(--flow-warm)', padding: '5px 10px', borderRadius: '6px' }}>
                  flowboard.pub/<span style={{ color: accent, transition: 'color 0.3s' }}>{boardName ? boardName.toLowerCase().replace(/\s+/g, '-') : '...'}</span>
                </div>
              </div>
            </div>

            {/* Live Board Preview */}
            <div style={{ padding: '24px 20px', backgroundColor: 'var(--flow-warm)', minHeight: '340px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '24px', color: 'var(--flow-ink)', opacity: boardName ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                  {boardName || 'Your Board Name'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--flow-muted)', marginTop: '2px' }}>5 ways to showcase your work · articles, shorts, quotes, links, images</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {DEMO_CARDS.map((card, i) => {
                  const Icon = CARD_ICONS[card.type] || FileText;
                  const isRevealed = revealedCards.includes(i);
                  return (
                    <div key={i} onMouseEnter={() => setActiveCard(i)} onMouseLeave={() => setActiveCard(null)}
                      style={{
                        backgroundColor: 'var(--flow-surface)', border: activeCard === i ? `1px solid ${accent}` : '1px solid var(--flow-border)',
                        borderRadius: '10px', padding: '16px', cursor: 'default',
                        opacity: isRevealed ? 1 : 0, transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s',
                        display: 'flex', flexDirection: 'column' as const, gap: '8px',
                      }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: accent, transition: 'color 0.3s', alignSelf: 'flex-start' }}>
                        <Icon size={11} /> {card.type}
                      </div>
                      <h3 style={{ fontFamily: card.type === 'quote' ? '"DM Serif Display"' : '"DM Sans"', fontSize: card.type === 'quote' ? '15px' : '14px', fontStyle: card.type === 'quote' ? 'italic' : 'normal', fontWeight: card.type === 'quote' ? '400' : '500', lineHeight: '1.35', color: 'var(--flow-ink)' }}>{card.title}</h3>
                      {card.excerpt && <p style={{ fontSize: '12px', color: 'var(--flow-muted)', lineHeight: '1.5' }}>{card.excerpt}</p>}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const, marginTop: 'auto' }}>
                        {card.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: '9px', fontWeight: '500', color: 'var(--flow-muted)', backgroundColor: 'var(--flow-warm)', padding: '2px 7px', borderRadius: '4px' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--flow-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--flow-muted)' }}>{DEMO_CARDS.length} cards · grid view</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {['article', 'short', 'quote', 'link', 'image'].map((type) => {
                    const Icon = CARD_ICONS[type] || FileText;
                    return <div key={type} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--flow-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--flow-muted)' }}><Icon size={12} /></div>;
                  })}
                </div>
              </div>
              <Link href={ctaHref} className="btn-accent" style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '600', gap: '8px', borderRadius: '8px', backgroundColor: accent, transition: 'background-color 0.3s' }}>
                <Sparkles size={14} /> Create your board — Free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ TRUST LINE ═══ */}
        <div style={{ textAlign: 'center', padding: '28px 24px 16px', fontSize: '12px', color: 'var(--flow-muted)' }}>
          Free forever on starter · No credit card · Set up in 2 minutes
        </div>

        {/* ═══ HOW IT WORKS ═══ */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'var(--flow-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { num: '01', label: 'Create', desc: 'Name your board, pick your style, add your first card. Takes 2 minutes.' },
              { num: '02', label: 'Publish', desc: 'One click. Your board gets a clean URL you can share anywhere.' },
              { num: '03', label: 'Grow', desc: 'Track views, add content, upgrade for analytics and custom domains.' },
            ].map((step) => (
              <div key={step.num} style={{ backgroundColor: 'var(--flow-surface)', padding: '28px 24px' }}>
                <span style={{ fontFamily: '"JetBrains Mono"', fontSize: '10px', color: accent, fontWeight: '500', transition: 'color 0.3s' }}>{step.num}</span>
                <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '18px', margin: '6px 0 4px' }}>{step.label}</h3>
                <p style={{ fontSize: '12px', color: 'var(--flow-muted)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ VS LINKTREE ═══ */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '28px', marginBottom: '8px' }}>
              Your ideas deserve better than a list of links
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--flow-muted)' }}>
              Link-in-bio tools show <em>where</em> to go. Flowboard shows <em>why they should care</em>.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid var(--flow-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Header row */}
            <div style={{ padding: '14px 20px', backgroundColor: 'var(--flow-warm)', borderBottom: '1px solid var(--flow-border)', borderRight: '1px solid var(--flow-border)', fontSize: '11px', fontWeight: '600', color: 'var(--flow-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              Linktree / Beacons
            </div>
            <div style={{ padding: '14px 20px', backgroundColor: 'var(--flow-ink)', borderBottom: '1px solid var(--flow-border)', fontSize: '11px', fontWeight: '600', color: 'var(--flow-paper)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              Flowboard
            </div>
            {/* Rows */}
            {[
              ['Text-only links', 'Visual cards with previews'],
              ['One long scroll', 'Organized by tags & categories'],
              ['"Powered by" branding', 'Clean, white-label boards'],
              ['Basic link tracking', 'Content performance analytics'],
              ['Same look as everyone', 'Unique, magazine-style layout'],
            ].map(([left, right], i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--flow-muted)', borderBottom: i < 4 ? '1px solid var(--flow-border)' : 'none', borderRight: '1px solid var(--flow-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <XIcon size={12} style={{ color: 'var(--flow-border)', flexShrink: 0 }} /> {left}
                </div>
                <div style={{ padding: '12px 20px', fontSize: '13px', borderBottom: i < 4 ? '1px solid var(--flow-border)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={12} style={{ color: 'var(--flow-accent)', flexShrink: 0 }} /> {right}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section style={{ backgroundColor: 'var(--flow-warm)', padding: '64px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '28px', textAlign: 'center', marginBottom: '40px' }}>
              Built for creators who think in collections
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ backgroundColor: 'var(--flow-surface)', border: '1px solid var(--flow-border)', borderRadius: '12px', padding: '24px' }}>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--flow-ink)', marginBottom: '16px', fontStyle: 'italic' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--flow-accent)', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {t.initials}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600' }}>{t.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--flow-muted)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '28px', marginBottom: '8px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '14px', color: 'var(--flow-muted)' }}>Start free. Upgrade when your audience grows.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { name: 'Starter', price: '0', desc: 'Perfect for getting started.', features: ['1 board, up to 10 cards', 'All 5 card types', 'Public board URL', 'Basic analytics'], accent: false },
              { name: 'Creator', price: '9', desc: 'For creators building an audience.', features: ['Unlimited boards & cards', 'Remove Flowboard branding', 'Image uploads', 'Full analytics dashboard'], accent: true },
              { name: 'Pro', price: '24', desc: 'For creators who monetize.', features: ['Everything in Creator', 'Custom domain', 'Stripe subscriptions', 'Content gating (paywall)'], accent: false },
            ].map((plan) => (
              <div key={plan.name} style={{
                backgroundColor: 'var(--flow-surface)', border: plan.accent ? '2px solid var(--flow-accent)' : '1px solid var(--flow-border)',
                borderRadius: '12px', padding: '24px', position: 'relative' as const,
              }}>
                {plan.accent && (
                  <div style={{ position: 'absolute' as const, top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--flow-accent)', color: '#fff', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '3px 10px', borderRadius: '9999px' }}>
                    Popular
                  </div>
                )}
                <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '18px', marginBottom: '2px' }}>{plan.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--flow-muted)', marginBottom: '12px' }}>{plan.desc}</p>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontFamily: '"DM Serif Display"', fontSize: '32px' }}>${plan.price}</span>
                  <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>/mo</span>
                </div>
                <Link href={ctaHref} className={plan.accent ? 'btn-accent' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '12px', marginBottom: '16px' }}>
                  {plan.price === '0' ? 'Start free' : `Get ${plan.name}`}
                </Link>
                <div style={{ borderTop: '1px solid var(--flow-border)', paddingTop: '12px' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Check size={12} style={{ color: 'var(--flow-accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section style={{ backgroundColor: 'var(--flow-warm)', padding: '64px 24px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: '28px', textAlign: 'center', marginBottom: '32px' }}>
              Frequently asked questions
            </h2>
            <div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--flow-border)', padding: '16px 0' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                    fontFamily: '"DM Serif Display"', fontSize: '16px', textAlign: 'left' as const, color: 'var(--flow-ink)',
                  }}>
                    {faq.q}
                    {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === i && (
                    <p style={{ fontSize: '13px', color: 'var(--flow-muted)', lineHeight: '1.7', marginTop: '10px', paddingRight: '24px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"DM Serif Display"', fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: '1.15', marginBottom: '12px' }}>
            Your content is worth more<br /><span style={{ color: 'var(--flow-accent)', fontStyle: 'italic' }}>than a link tree.</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--flow-muted)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Start publishing on Flowboard today. Free forever — upgrade when your audience grows.
          </p>
          <Link href={ctaHref} className="btn-accent" style={{ padding: '14px 36px', fontSize: '15px' }}>
            Create your board — Free <ArrowRight size={15} />
          </Link>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ borderTop: '1px solid var(--flow-border)', padding: '28px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>&copy; 2026 Flowboard</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/explore" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Explore</a>
              <a href="/blog" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Blog</a>
              <a href="/terms" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Terms</a>
              <a href="/sign-in" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Sign in</a>
            </div>
          </div>
        </footer>

        {/* ═══ STICKY MOBILE CTA ═══ */}
        {scrolled && (
          <div style={{
            position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: 50,
            padding: '10px 16px', backgroundColor: 'rgba(250,249,247,0.95)',
            backdropFilter: 'blur(12px)', borderTop: '1px solid var(--flow-border)',
          }}>
            <Link href={ctaHref} className="btn-accent" style={{
              width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: '600', borderRadius: '10px',
            }}>
              Create your board — Free <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
