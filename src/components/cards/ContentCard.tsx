import { Card } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, FileText, MessageSquareQuote, Link2, Image, Zap,
  Pencil, Trash2, Lock
} from 'lucide-react';

interface ContentCardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  article: { icon: FileText, label: 'Article', color: 'bg-blue-50 text-blue-600' },
  short: { icon: Zap, label: 'Short', color: 'bg-amber-50 text-amber-600' },
  quote: { icon: MessageSquareQuote, label: 'Quote', color: 'bg-purple-50 text-purple-600' },
  link: { icon: Link2, label: 'Link', color: 'bg-green-50 text-green-600' },
  image: { icon: Image, label: 'Image', color: 'bg-pink-50 text-pink-600' },
};

export default function ContentCard({ card, onEdit, onDelete }: ContentCardProps) {
  const { icon: TypeIcon, label, color } = typeConfig[card.type] || typeConfig.article;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card-base group h-[260px] flex flex-col ${isDragging ? 'opacity-50 shadow-card-hover scale-[1.02]' : ''}`}
    >
      {/* Cover image */}
      {card.cover_image ? (
        <div className="h-[110px] overflow-hidden rounded-t-card flex-shrink-0">
          <img
            src={card.cover_image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-1.5 rounded-t-card flex-shrink-0 bg-flow-border/50" />
      )}

      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Top row: drag handle + type badge + premium + actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-1 cursor-grab active:cursor-grabbing text-flow-muted 
                         hover:text-flow-ink transition-colors"
            >
              <GripVertical size={14} />
            </button>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] 
                             font-semibold uppercase tracking-wider rounded-full ${color}`}>
              <TypeIcon size={10} />
              {label}
            </span>
            {card.is_premium && (
              <span className="badge-premium">
                <Lock size={8} />
                Premium
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(card)}
              className="p-1.5 text-flow-muted hover:text-flow-ink rounded-md 
                         hover:bg-flow-warm transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-1.5 text-flow-muted hover:text-red-600 rounded-md 
                         hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-sm text-flow-ink leading-snug mb-1 line-clamp-2">
          {card.title}
        </h3>

        {/* Excerpt / content preview */}
        {card.excerpt && (
          <p className="text-xs text-flow-muted line-clamp-2">{card.excerpt}</p>
        )}

        {/* Link URL */}
        {card.link_url && (
          <p className="text-[10px] text-flow-accent mt-auto truncate font-mono">{card.link_url}</p>
        )}
      </div>
    </div>
  );
}
