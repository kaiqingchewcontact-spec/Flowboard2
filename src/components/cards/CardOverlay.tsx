import { useEffect } from 'react';
import { Card } from '@/types';
import { X, Lock, FileText, Zap, MessageSquareQuote, Link2, Image, ExternalLink } from 'lucide-react';

const typeIcons: Record<string, typeof FileText> = {
  article: FileText,
  short: Zap,
  quote: MessageSquareQuote,
  link: Link2,
  image: Image,
};

interface CardOverlayProps {
  card: Card;
  accentColor: string;
  fontDisplay: string;
  onClose: () => void;
}

export default function CardOverlay({ card, accentColor, fontDisplay, onClose }: CardOverlayProps) {
  const TypeIcon = typeIcons[card.type] || FileText;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Render content with inline images (markdown-style ![alt](url))
  const renderContent = (content: string) => {
    const parts = content.split(/(!\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <figure key={i} className="my-6">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="w-full rounded-lg shadow-card"
            />
            {imgMatch[1] && (
              <figcaption className="text-xs text-flow-muted text-center mt-2 italic">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>
        );
      }
      if (!part.trim()) return null;
      return (
        <div key={i} className="whitespace-pre-wrap">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-3xl mx-4 my-8 sm:my-16 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full 
                     shadow-md hover:bg-white transition-colors"
        >
          <X size={20} className="text-flow-ink" />
        </button>

        {/* Cover image */}
        {card.cover_image && (
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={card.cover_image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article content */}
        <div className="px-8 sm:px-12 py-10">
          {/* Type + tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-flow-muted">
              <TypeIcon size={11} />
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
            {(card as any).tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full
                           bg-flow-warm text-flow-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl leading-tight mb-4"
            style={{ fontFamily: fontDisplay }}
          >
            {card.title}
          </h1>

          {/* Excerpt as subtitle */}
          {card.excerpt && (
            <p className="text-lg text-flow-muted leading-relaxed mb-8 border-l-2 pl-4"
               style={{ borderColor: accentColor }}>
              {card.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-8 h-0.5 mb-8" style={{ backgroundColor: accentColor }} />

          {/* Content */}
          {card.is_premium ? (
            <div className="py-12 text-center">
              <Lock size={32} className="mx-auto mb-4 text-flow-muted" />
              <h3 className="font-display text-xl text-flow-ink mb-2">Premium Content</h3>
              <p className="text-sm text-flow-muted mb-6 max-w-sm mx-auto">
                Subscribe to unlock this article and all premium content on this board.
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm
                           transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Subscribe to read
              </button>
            </div>
          ) : card.content ? (
            <div className="prose-flow text-base text-flow-ink/85 leading-[1.8] space-y-4">
              {renderContent(card.content)}
            </div>
          ) : (
            <p className="text-flow-muted italic">No content yet.</p>
          )}

          {/* Link */}
          {card.link_url && !card.is_premium && (
            <a
              href={card.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-lg 
                         text-white font-medium text-sm transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              <ExternalLink size={14} />
              Read more
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

