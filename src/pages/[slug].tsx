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
        <title>{board.title}</title>
        {board.description && <meta name="description" content={board.description} />}
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
          <div className="w-12 h-0.5 mx-auto mt-8" style={{ backgroundColor: accentColor }} />
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

              return (
                <article
                  key={card.id}
                  className="bg-white border border-flow-border rounded-card shadow-card 
                             hover:shadow-card-hover transition-all duration-300 
                             cursor-pointer overflow-hidden group h-[280px] flex flex-col"
                  onClick={() => handleCardClick(card)}
                >
                  {card.cover_image ? (
                    <div className="h-[130px] overflow-hidden flex-shrink-0">
                      <img
                        src={card.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-2 flex-shrink-0" style={{ backgroundColor: accentColor, opacity: 0.15 }} />
                  )}

                  <div className="p-4 flex flex-col flex-1 min-h-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <TypeIcon size={12} className="text-flow-muted flex-shrink-0" />
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
                      className="text-base leading-snug mb-1.5 line-clamp-2"
                      style={{ fontFamily: fontDisplay }}
                    >
                      {card.title}
                    </h2>

                    {card.is_premium ? (
                      <div className="mt-auto p-2 rounded-lg bg-flow-warm text-center">
                        <Lock size={14} className="mx-auto mb-1 text-flow-muted" />
                        <p className="text-[10px] text-flow-muted">Subscribe to unlock</p>
                      </div>
                    ) : card.excerpt ? (
                      <p className="text-xs text-flow-muted line-clamp-2">{card.excerpt}</p>
                    ) : null}

                    {/* Tags pinned to bottom */}
                    {(card as any).tags?.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-auto pt-2 flex-wrap">
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
        {board.settings?.show_branding && (
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
