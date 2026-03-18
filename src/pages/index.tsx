import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import {
  ArrowRight, FileText, MessageSquare, Quote, Link2, ImageIcon,
  Sparkles,
} from 'lucide-react';

/* ─── Demo Card Data ─── */
const DEMO_CARDS = [
  {
    type: 'article' as const,
    title: 'Why I left my job to build in public',
    excerpt: 'A raw, unfiltered look at the first 90 days of going independent.',
    tags: ['personal', 'building'],
  },
  {
    type: 'quote' as const,
    title: '"Ship something small every week. Momentum compounds."',
    excerpt: null,
    tags: ['wisdom'],
  },
  {
    type: 'link' as const,
    title: 'The best tools for solo creators in 2026',
    excerpt: 'creativeboom.com',
    tags: ['tools', 'curation'],
  },
  {
    type: 'short' as const,
    title: 'Hot take: your portfolio site is not your brand. Your ideas are.',
    excerpt: null,
    tags: ['thoughts'],
  },
  {
    type: 'image' as const,
    title: 'Studio snapshot — new workspace setup',
    excerpt: null,
    tags: ['behind-the-scenes'],
  },
  {
    type: 'article' as const,
    title: 'How to price creative work without undercharging',
    excerpt: 'A framework I wish someone gave me five years ago.',
    tags: ['business', 'freelance'],
  },
];

const CARD_ICONS: Record<string, typeof FileText> = {
  article: FileText,
  short: MessageSquare,
  quote: Quote,
  link: Link2,
  image: ImageIcon,
};

const ACCENT_PRESETS = ['#e85d3a', '#2563eb', '#059669', '#7c3aed', '#d946ef', '#0a0a0a'];

export default function Home() {
  const { isSignedIn } = useAuth();
  const ctaHref = isSignedIn ? '/dashboard' : '/sign-up';

  const [boardName, setBoardName] = useState('');
  const [accent, setAccent] = useState('#e85d3a');
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  useEffect(() => {
    DEMO_CARDS.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, i]);
      }, 300 + i * 120);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Flowboard — Visual content boards for creators</title>
        <meta
          name="description"
          content="Create beautiful, card-based content boards. Publish articles, thoughts, and links in one curated space."
        />
      </Head>

      <div style={{ backgroundColor: 'var(--flow-paper)', color: 'var(--flow-ink)', minHeight: '100vh' }}>

        {/* ═══ NAV ═══ */}
        <header style={{
          padding: '16px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', backgroundColor: 'var(--flow-ink)',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '12px', fontWeight: 'bold' }}>F</span>
            </div>
            <span style={{ fontFamily: '"DM Serif Display"', fontSize: '16px' }}>Flowboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/sign-in" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href={ctaHref} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              {isSignedIn ? 'Dashboard' : 'Get started'}
              <ArrowRight size={13} />
            </Link>
          </div>
        </header>

        {/* ═══ HERO — THE TOOL ═══ */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 20px',
        }}>
          {/* Tagline */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontFamily: '"DM Serif Display"',
              fontSize: 'clamp(28px, 5vw, 48px)',
              lineHeight: '1.1',
              marginBottom: '12px',
            }}>
              Name your board.{' '}
              <span style={{ color: accent, fontStyle: 'italic', transition: 'color 0.3s' }}>
                See it come alive.
              </span>
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'var(--flow-muted)',
              maxWidth: '440px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}>
              A visual content board for your articles, thoughts, and links — all from one URL.
            </p>
          </div>

          {/* ─── Board Builder ─── */}
          <div style={{
            backgroundColor: 'var(--flow-surface)',
            border: '1px solid var(--flow-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 12px 48px rgba(0,0,0,0.04)',
          }}>
            {/* Toolbar */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--flow-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              {/* Board name input */}
              <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
                <label style={{
                  fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '4px',
                }}>
                  Board name
                </label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="e.g. Undercurrent"
                  style={{
                    width: '100%',
                    fontFamily: '"DM Serif Display"',
                    fontSize: '20px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--flow-ink)',
                    padding: '0',
                  }}
                />
              </div>

              {/* Accent picker */}
              <div>
                <label style={{
                  fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '6px',
                }}>
                  Accent
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {ACCENT_PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccent(c)}
                      style={{
                        width: '22px', height: '22px', borderRadius: '6px',
                        backgroundColor: c,
                        border: accent === c ? '2px solid var(--flow-ink)' : '2px solid transparent',
                        cursor: 'pointer', transition: 'border-color 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* URL preview */}
              <div style={{ flex: '0 0 auto' }}>
                <label style={{
                  fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em', color: 'var(--flow-muted)', display: 'block', marginBottom: '6px',
                }}>
                  Your URL
                </label>
                <div style={{
                  fontSize: '12px',
                  fontFamily: '"JetBrains Mono"',
                  color: 'var(--flow-muted)',
                  backgroundColor: 'var(--flow-warm)',
                  padding: '5px 10px',
                  borderRadius: '6px',
                }}>
                  flowboard.pub/<span style={{ color: accent, transition: 'color 0.3s' }}>
                    {boardName ? boardName.toLowerCase().replace(/\s+/g, '-') : '...'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Live Board Preview ─── */}
            <div style={{
              padding: '24px 20px',
              backgroundColor: 'var(--flow-warm)',
              minHeight: '380px',
            }}>
              {/* Board header preview */}
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{
                  fontFamily: '"DM Serif Display"',
                  fontSize: '24px',
                  color: 'var(--flow-ink)',
                  opacity: boardName ? 1 : 0.3,
                  transition: 'opacity 0.2s',
                }}>
                  {boardName || 'Your Board Name'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--flow-muted)', marginTop: '2px' }}>
                  5 card types · articles, shorts, quotes, links, images
                </p>
              </div>

              {/* Card grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px',
              }}>
                {DEMO_CARDS.map((card, i) => {
                  const Icon = CARD_ICONS[card.type] || FileText;
                  const isRevealed = revealedCards.includes(i);
                  const isActive = activeCard === i;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveCard(i)}
                      onMouseLeave={() => setActiveCard(null)}
                      style={{
                        backgroundColor: 'var(--flow-surface)',
                        border: isActive ? `1px solid ${accent}` : '1px solid var(--flow-border)',
                        borderRadius: '10px',
                        padding: '16px',
                        cursor: 'default',
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        gap: '8px',
                      }}
                    >
                      {/* Card type badge */}
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' as const,
                        letterSpacing: '0.06em', color: accent, transition: 'color 0.3s',
                        alignSelf: 'flex-start',
                      }}>
                        <Icon size={11} />
                        {card.type}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: card.type === 'quote' ? '"DM Serif Display"' : '"DM Sans"',
                        fontSize: card.type === 'quote' ? '15px' : '14px',
                        fontStyle: card.type === 'quote' ? 'italic' : 'normal',
                        fontWeight: card.type === 'quote' ? '400' : '500',
                        lineHeight: '1.35',
                        color: 'var(--flow-ink)',
                      }}>
                        {card.title}
                      </h3>

                      {/* Excerpt */}
                      {card.excerpt && (
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--flow-muted)',
                          lineHeight: '1.5',
                        }}>
                          {card.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const, marginTop: 'auto' }}>
                        {card.tags.map((tag) => (
                          <span key={tag} style={{
                            fontSize: '9px',
                            fontWeight: '500',
                            color: 'var(--flow-muted)',
                            backgroundColor: 'var(--flow-warm)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--flow-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--flow-muted)' }}>
                  {DEMO_CARDS.length} cards · grid view
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {['article', 'short', 'quote', 'link', 'image'].map((type) => {
                    const Icon = CARD_ICONS[type] || FileText;
                    return (
                      <div
                        key={type}
                        style={{
                          width: '26px', height: '26px', borderRadius: '6px',
                          border: '1px solid var(--flow-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--flow-muted)',
                        }}
                      >
                        <Icon size={12} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href={ctaHref}
                className="btn-accent"
                style={{
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: '600',
                  gap: '8px',
                  borderRadius: '8px',
                  backgroundColor: accent,
                  transition: 'background-color 0.3s',
                }}
              >
                <Sparkles size={14} />
                Create this board
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF LINE ═══ */}
        <div style={{
          textAlign: 'center',
          padding: '32px 24px 24px',
          fontSize: '12px',
          color: 'var(--flow-muted)',
          letterSpacing: '0.02em',
        }}>
          Free forever on the starter plan · Upgrade when your audience grows
        </div>

        {/* ═══ MINIMAL — THREE STEPS ═══ */}
        <section style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            backgroundColor: 'var(--flow-border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {[
              { num: '01', label: 'Create', desc: 'Name your board, pick your style, start adding cards.' },
              { num: '02', label: 'Publish', desc: 'One click. Your board gets a clean, shareable URL.' },
              { num: '03', label: 'Grow', desc: 'Analytics, custom domain, subscriptions when you\'re ready.' },
            ].map((step) => (
              <div key={step.num} style={{
                backgroundColor: 'var(--flow-surface)',
                padding: '28px 24px',
              }}>
                <span style={{
                  fontFamily: '"JetBrains Mono"',
                  fontSize: '10px',
                  color: accent,
                  fontWeight: '500',
                  transition: 'color 0.3s',
                }}>
                  {step.num}
                </span>
                <h3 style={{
                  fontFamily: '"DM Serif Display"',
                  fontSize: '18px',
                  margin: '6px 0 4px',
                }}>
                  {step.label}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--flow-muted)',
                  lineHeight: '1.6',
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          borderTop: '1px solid var(--flow-border)',
          padding: '28px 24px',
        }}>
          <div style={{
            maxWidth: '1000px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap' as const, gap: '12px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>
              &copy; 2026 Flowboard
            </span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/terms" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Terms</a>
              <a href="/sign-in" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Sign in</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
