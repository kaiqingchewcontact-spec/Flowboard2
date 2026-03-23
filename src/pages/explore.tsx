import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, FileText, MessageSquare, Quote, Link2, ImageIcon, Sparkles } from 'lucide-react';

const CARD_ICONS: Record<string, typeof FileText> = {
  article: FileText, short: MessageSquare, quote: Quote, link: Link2, image: ImageIcon,
};

interface ExploreBoard {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  accentColor: string;
  cardCount: number;
  previewCards: { title: string; type: string }[];
  creator: { firstName: string | null; lastName: string | null; imageUrl: string | null } | null;
  updatedAt: string;
}

export default function Explore() {
  const [boards, setBoards] = useState<ExploreBoard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore')
      .then((r) => r.json())
      .then((json) => { if (json.data) setBoards(json.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Explore — Discover creator boards on Flowboard</title>
        <meta name="description" content="Browse visual content boards created by writers, makers, and independent thinkers on Flowboard. Get inspired and create your own." />
        <meta property="og:title" content="Explore — Flowboard" />
        <meta property="og:description" content="Discover beautiful content boards from creators around the world." />
      </Head>

      <div style={{ backgroundColor: 'var(--flow-paper)', color: 'var(--flow-ink)', minHeight: '100vh' }}>
        {/* Nav */}
        <header style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--flow-ink)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '12px', fontWeight: 'bold' }}>F</span>
            </div>
            <span style={{ fontFamily: '"DM Serif Display"', fontSize: '16px' }}>Flowboard</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/blog" style={{ fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Blog</Link>
            <Link href="/sign-up" className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              Create yours <ArrowRight size={13} />
            </Link>
          </div>
        </header>

        {/* Header */}
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 40px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
            borderRadius: '9999px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' as const,
            letterSpacing: '0.06em', backgroundColor: 'rgba(232, 93, 58, 0.1)', color: 'var(--flow-accent)',
            marginBottom: '20px',
          }}>
            <Sparkles size={11} /> Community
          </div>
          <h1 style={{ fontFamily: '"DM Serif Display"', fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: '1.1', marginBottom: '12px' }}>
            Explore what creators are building
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--flow-muted)', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6' }}>
            Browse boards from writers, thinkers, and makers. Get inspired, then create your own.
          </p>
        </section>

        {/* Board grid */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 48px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="w-6 h-6 border-2 border-flow-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : boards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <p style={{ fontSize: '16px', color: 'var(--flow-muted)', marginBottom: '8px' }}>
                No boards featured yet.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--flow-muted)', marginBottom: '24px' }}>
                Be the first to share your board with the community.
              </p>
              <Link href="/sign-up" className="btn-accent" style={{ padding: '12px 28px', fontSize: '14px' }}>
                Create your board <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {boards.map((board) => {
                const creatorName = board.creator
                  ? [board.creator.firstName, board.creator.lastName].filter(Boolean).join(' ')
                  : null;

                return (
                  <Link
                    key={board.id}
                    href={`/${board.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      backgroundColor: 'var(--flow-surface)', border: '1px solid var(--flow-border)',
                      borderRadius: '12px', overflow: 'hidden',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {/* Accent bar */}
                      <div style={{ height: '4px', backgroundColor: board.accentColor }} />

                      <div style={{ padding: '20px' }}>
                        {/* Creator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          {board.creator?.imageUrl ? (
                            <img src={board.creator.imageUrl} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: board.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: '700' }}>
                              {creatorName ? creatorName[0] : '?'}
                            </div>
                          )}
                          <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>{creatorName || 'Creator'}</span>
                        </div>

                        {/* Title + description */}
                        <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '18px', lineHeight: '1.3', marginBottom: '4px' }}>
                          {board.title}
                        </h3>
                        {board.description && (
                          <p style={{ fontSize: '12px', color: 'var(--flow-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                            {board.description.length > 80 ? board.description.slice(0, 80) + '...' : board.description}
                          </p>
                        )}

                        {/* Preview cards */}
                        {board.previewCards.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                            {board.previewCards.map((card, i) => {
                              const Icon = CARD_ICONS[card.type] || FileText;
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', backgroundColor: 'var(--flow-warm)', borderRadius: '6px' }}>
                                  <Icon size={10} style={{ color: board.accentColor, flexShrink: 0 }} />
                                  <span style={{ fontSize: '11px', color: 'var(--flow-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                                    {card.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '10px', color: 'var(--flow-muted)', fontFamily: '"JetBrains Mono"' }}>
                            {board.cardCount} card{board.cardCount !== 1 ? 's' : ''}
                          </span>
                          <span style={{ fontSize: '10px', color: board.accentColor, fontWeight: '500' }}>
                            View board →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section style={{ maxWidth: '500px', margin: '0 auto', padding: '32px 24px 80px', textAlign: 'center' }}>
          <div style={{ padding: '32px', backgroundColor: 'var(--flow-warm)', borderRadius: '12px' }}>
            <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '20px', marginBottom: '8px' }}>
              Want your board here?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--flow-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Create a board, publish it, and toggle &ldquo;List on Explore&rdquo; in your settings.
            </p>
            <Link href="/sign-up" className="btn-accent" style={{ padding: '10px 24px', fontSize: '13px' }}>
              Create your board — Free <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--flow-border)', padding: '28px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>&copy; 2026 Flowboard</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Home</Link>
              <Link href="/blog" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Blog</Link>
              <Link href="/terms" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
