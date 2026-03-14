import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Board, Card } from '@/types';
import { Lock, ExternalLink, FileText, Zap, MessageSquareQuote, Link2, Image } from 'lucide-react';

const typeIcons: Record<string, typeof FileText> = {
  article: FileText,
  short: Zap,
  quote: MessageSquareQuote,
  link: Link2,
  image: Image,
};

export default function PublicBoard() {
  const router = useRouter();
  const { slug } = router.query;

  const [board, setBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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
        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-3"
            style={{ fontFamily: board.settings?.font_display || 'DM Serif Display' }}
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

        {/* Cards */}
        <main className="max-w-5xl mx-auto px-6 pb-20">
          <div
            className={
              layout === 'list'
                ? 'space-y-5 max-w-2xl mx-auto'
                : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {cards.map((card) => {
              const TypeIcon = typeIcons[card.type] || FileText;
              const isExpanded = expandedCard === card.id;

              return (
                <article
                  key={card.id}
                  className="bg-white border border-flow-border rounded-card shadow-card 
                             hover:shadow-card-hover transition-all duration-300 
                             cursor-pointer overflow-hidden group"
onClick={() => {
  if (card.is_premium) return;
  fetch('/api/public/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      board_id: board!.id,
      card_id: card.id,
      event_type: 'card_click',
      visitor_id: localStorage.getItem('fb_visitor') || null,
    }),
  }).catch(() => {});
  setExpandedCard(isExpanded ? null : card.id);
}}
                >
                  {/* Cover image */}
                  {card.cover_image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={card.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Type + premium badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon size={13} className="text-flow-muted" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted">
                        {card.type}
                      </span>
                      {card.is_premium && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold 
                                     uppercase tracking-wider rounded-full text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Lock size={8} />
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="text-lg leading-snug mb-2"
                      style={{ fontFamily: board.settings?.font_display || 'DM Serif Display' }}
                    >
                      {card.title}
                    </h2>

                    {/* Excerpt or content */}
                    {card.is_premium ? (
                      <div className="mt-3 p-3 rounded-lg bg-flow-warm text-center">
                        <Lock size={16} className="mx-auto mb-1.5 text-flow-muted" />
                        <p className="text-xs text-flow-muted">
                          Subscribe to unlock this content
                        </p>
                      </div>
                    ) : isExpanded && card.content ? (
                      <div className="text-sm text-flow-ink/80 leading-relaxed mt-3 whitespace-pre-wrap">
                        {card.content}
                      </div>
                    ) : card.excerpt ? (
                      <p className="text-sm text-flow-muted line-clamp-3">{card.excerpt}</p>
                    ) : null}

                    {/* Link */}
                    {card.link_url && !card.is_premium && (
                      <a
                        href={card.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium mt-3 
                                   transition-colors hover:opacity-80"
                        style={{ color: accentColor }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        Read more
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        {/* Footer */}
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
    </>
  );
}
