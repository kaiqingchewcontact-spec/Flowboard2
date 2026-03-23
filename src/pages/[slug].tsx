import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Board, Card } from '@/types';
import { Lock, ExternalLink, FileText, Zap, MessageSquareQuote, Link2, Image } from 'lucide-react';
import CardOverlay from '@/components/cards/CardOverlay';

const typeIcons: Record<string, typeof FileText> = {
  article: FileText,
  short: Zap,
  quote: MessageSquareQuote,
  link: Link2,
  image: Image,
};

interface Creator {
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export default function PublicBoard() {
  const router = useRouter();
  const { slug } = router.query;

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [showBranding, setShowBranding] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchBoard() {
      try {
        const res = await fetch(`/api/public/board?slug=${slug}`);
        if (!res.ok) { setError(true); setLoading(false); return; }
        const json = await res.json();
        setBoard(json.data.board);
        setCards(json.data.cards);
        if (json.data.creator) setCreator(json.data.creator);
        if (json.data.showBranding !== undefined) setShowBranding(json.data.showBranding);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBoard();
  }, [slug]);

  // Track board view
  useEffect(() => {
    if (!board) return;
    const visitorId = localStorage.getItem('fb_visitor') ||
      Math.random().toString(36).substring(2);
    localStorage.setItem('fb_visitor', visitorId);
    fetch('/api/public/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: board.id,
        event_type: 'board_view',
        visitor_id: visitorId,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [board]);

  if (loading) {
    return (
      <div className="min-h-screen bg-flow-paper flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-flow-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-flow-paper flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-2xl text-flow-ink mb-2">Board not found</h1>
        <p className="text-sm text-flow-muted">This board doesn&apos;t exist or isn&apos;t published yet.</p>
      </div>
    );
  }

  const accentColor = board.settings?.accent_color || '#e85d3a';
  const bgColor = board.settings?.background_color || '#faf9f7';
  const layout = board.settings?.layout || 'grid';
  const columns = board.settings?.columns || 3;
  const fontDisplay = board.settings?.font_display || 'DM Serif Display';

  // CTA settings from board
  const ctaEnabled = (board.settings as any)?.cta_enabled || false;
  const ctaText = (board.settings as any)?.cta_text || '';
  const ctaUrl = (board.settings as any)?.cta_url || '';

  // Collect all tags
  const allTags: string[] = [];
  cards.forEach((card) => {
    ((card as any).tags || []).forEach((tag: string) => {
      if (!allTags.includes(tag)) allTags.push(tag);
    });
  });

  // Filter cards by active tag
  const filteredCards = activeTag
    ? cards.filter((card) => ((card as any).tags || []).includes(activeTag))
    : cards;

  const handleCardClick = (card: Card) => {
    if (card.is_premium) return;
    fetch('/api/public/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: board.id,
        card_id: card.id,
        event_type: 'card_click',
        visitor_id: localStorage.getItem('fb_visitor') || null,
      }),
    }).catch(() => {});
    setSelectedCard(card);
  };

  const creatorName = creator
    ? [creator.firstName, creator.lastName].filter(Boolean).join(' ')
    : null;

  return (
    <>
      <Head>
        <title>{board.title}{creatorName ? ` — ${creatorName}` : ''}</title>
        {board.description && <meta name="description" content={board.description} />}
        <meta property="og:title" content={board.title} />
        {board.description && <meta property="og:description" content={board.description} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://flowboard2.vercel.app/${board.slug}`} />
        {creator?.imageUrl && <meta property="og:image" content={creator.imageUrl} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={board.title} />
        {board.description && <meta name="twitter:description" content={board.description} />}
        <link rel="canonical" href={`https://flowboard2.vercel.app/${board.slug}`} />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        `}</style>
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
        {/* Header with profile */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          {/* Creator profile avatar */}
          {creator?.imageUrl && (
            <div className="mb-5 flex justify-center">
              <img
                src={creator.imageUrl}
                alt={creatorName || 'Creator'}
                className="w-16 h-16 rounded-full border-2 object-cover"
                style={{ borderColor: accentColor }}
              />
            </div>
          )}

          {/* Creator name */}
          {creatorName && (
            <p className="text-sm font-medium text-flow-muted mb-3 tracking-wide uppercase"
               style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
              {creatorName}
            </p>
          )}

          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-3"
            style={{ fontFamily: fontDisplay }}
          >
            {board.title}
          </h1>
          {board.description && (
            <p className="text-base text-flow-muted max-w-lg mx-auto">
              {board.description}
            </p>
          )}
          <div className="w-12 h-0.5 mx-auto mt-8 mb-5" style={{ backgroundColor: accentColor }} />

          {/* Share icons */}
          <div className="flex justify-center gap-3 mb-2">
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).catch(() => {});
              }}
              className="p-2 rounded-full hover:bg-flow-warm transition-colors"
              title="Copy link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--flow-muted, #9c9589)' }}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(board.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-flow-warm transition-colors"
              title="Share on X"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--flow-muted, #9c9589)' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-flow-warm transition-colors"
              title="Share on LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--flow-muted, #9c9589)' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </header>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 pb-6">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                           ${!activeTag
                             ? 'text-white'
                             : 'bg-flow-warm text-flow-muted hover:text-flow-ink'
                           }`}
                style={!activeTag ? { backgroundColor: accentColor } : undefined}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                             ${activeTag === tag
                               ? 'text-white'
                               : 'bg-flow-warm text-flow-muted hover:text-flow-ink'
                             }`}
                  style={activeTag === tag ? { backgroundColor: accentColor } : undefined}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cards grid */}
        <main className="max-w-5xl mx-auto px-6 pb-20">
          <div
            className={
              layout === 'list'
                ? 'space-y-5 max-w-2xl mx-auto'
                : `grid gap-5 ${
                    columns === 1
                      ? 'grid-cols-1 max-w-2xl mx-auto'
                      : columns === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2 lg:grid-cols-3'
                  }`
            }
          >
            {filteredCards.map((card) => {
              const TypeIcon = typeIcons[card.type] || FileText;
              const isHorizontal = columns === 1;

              return (
                <article
                  key={card.id}
                  className={`bg-white border border-flow-border rounded-card shadow-card 
                             hover:shadow-card-hover transition-all duration-300 
                             cursor-pointer overflow-hidden group ${
                               isHorizontal
                                 ? 'flex flex-row h-[180px]'
                                 : 'flex flex-col h-[280px]'
                             }`}
                  onClick={() => handleCardClick(card)}
                >
                  {/* Image */}
                  {card.cover_image ? (
                    <div className={`overflow-hidden flex-shrink-0 ${
                      isHorizontal ? 'w-[40%] h-full' : 'h-[130px] w-full'
                    }`}>
                      <img
                        src={card.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : !isHorizontal ? (
                    <div className="h-2 flex-shrink-0" style={{ backgroundColor: accentColor, opacity: 0.15 }} />
                  ) : null}

                  <div className={`flex flex-col flex-1 min-h-0 min-w-0 ${
                    isHorizontal ? 'p-4 justify-center' : 'p-4'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <TypeIcon size={11} className="text-flow-muted flex-shrink-0" />
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-flow-muted">
                        {card.type}
                      </span>
                      {card.is_premium && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold 
                                     uppercase tracking-wider rounded-full text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Lock size={7} />
                          Premium
                        </span>
                      )}
                    </div>

                    <h2
                      className={`leading-snug mb-1 line-clamp-2 ${
                        isHorizontal ? 'text-lg' : 'text-sm'
                      }`}
                      style={{ fontFamily: fontDisplay }}
                    >
                      {card.title}
                    </h2>

                    {card.is_premium ? (
                      <div className="mt-1 p-2 rounded-lg bg-flow-warm text-center">
                        <p className="text-[10px] text-flow-muted">Subscribe to unlock</p>
                      </div>
                    ) : card.excerpt ? (
                      <p className={`text-flow-muted ${isHorizontal ? 'text-sm line-clamp-2' : 'text-xs line-clamp-2'}`}>
                        {card.excerpt}
                      </p>
                    ) : null}

                    {/* Tags */}
                    {(card as any).tags?.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-auto pt-1.5 flex-wrap">
                        {(card as any).tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[8px] font-medium rounded-full
                                       bg-flow-warm text-flow-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        {/* CTA Bar */}
        {ctaEnabled && ctaText && (
          <div className="sticky bottom-0 z-30">
            <div className="max-w-5xl mx-auto px-6 pb-6">
              <a
                href={ctaUrl || '#'}
                target={ctaUrl?.startsWith('http') ? '_blank' : undefined}
                rel={ctaUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block w-full py-4 px-6 rounded-xl text-center text-white font-medium text-sm
                           shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            </div>
          </div>
        )}

        {/* Powered by footer */}
        {showBranding && (
          <footer className="text-center pb-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-flow-muted hover:text-flow-ink transition-colors"
            >
              <div className="w-4 h-4 bg-flow-ink rounded flex items-center justify-center">
                <span className="text-flow-paper text-[8px] font-bold">F</span>
              </div>
              Powered by Flowboard
            </a>
          </footer>
        )}
      </div>

      {/* Card Overlay */}
      {selectedCard && (
        <CardOverlay
          card={selectedCard}
          accentColor={accentColor}
          fontDisplay={fontDisplay}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}
