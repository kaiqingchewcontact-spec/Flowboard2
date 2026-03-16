import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Card, CardFormData, CardType } from '../../types';
import { FileText, Zap, MessageSquareQuote, Link2, Image } from 'lucide-react';
import ImageUpload from '../ui/ImageUpload';
import TagInput from '../ui/TagInput';
import ContentEditor from '../ui/ContentEditor';

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CardFormData) => Promise<void>;
  card?: Card | null;
}

const cardTypes: { value: CardType; label: string; icon: typeof FileText; desc: string }[] = [
  { value: 'article', label: 'Article', icon: FileText, desc: 'Long-form essay or deep dive' },
  { value: 'short', label: 'Short', icon: Zap, desc: 'Quick thought or provocation' },
  { value: 'quote', label: 'Quote', icon: MessageSquareQuote, desc: 'A memorable quote' },
  { value: 'link', label: 'Link', icon: Link2, desc: 'External link with preview' },
  { value: 'image', label: 'Image', icon: Image, desc: 'Visual content' },
];

export default function CardEditorModal({ isOpen, onClose, onSave, card }: CardEditorModalProps) {
  const [form, setForm] = useState<CardFormData>({
    type: 'article',
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    link_url: '',
    is_premium: false,
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setForm({
        type: card.type,
        title: card.title,
        content: card.content || '',
        excerpt: card.excerpt || '',
        cover_image: card.cover_image || '',
        link_url: card.link_url || '',
        is_premium: card.is_premium,
        tags: card.tags || [],
      });
    } else {
      setForm({
        type: 'article',
        title: '',
        content: '',
        excerpt: '',
        cover_image: '',
        link_url: '',
        is_premium: false,
        tags: [],
      });
    }
  }, [card, isOpen]);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? 'Edit card' : 'Add a card'}
      size="lg"
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        {/* Type selector */}
        {!card && (
          <div>
            <label className="label-base">Card type</label>
            <div className="grid grid-cols-5 gap-2">
              {cardTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, type: value })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium
                             transition-all duration-200
                             ${form.type === value
                               ? 'border-flow-accent bg-flow-accent/5 text-flow-accent'
                               : 'border-flow-border text-flow-muted hover:border-flow-ink/20 hover:text-flow-ink'
                             }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="label-base">Title</label>
          <input
            type="text"
            className="input-base"
            placeholder="Card title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="label-base">Excerpt / teaser</label>
          <textarea
            className="input-base resize-none"
            rows={2}
            placeholder="Short preview text shown on the card"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        {/* Content with inline image support */}
        {['article', 'short', 'quote'].includes(form.type) && (
          <div>
            <label className="label-base">Content</label>
            <ContentEditor
              value={form.content || ''}
              onChange={(val: string) => setForm({ ...form, content: val })}
              placeholder="Write your content here. You can paste or drag images directly into the editor."
            />
          </div>
        )}

        {/* Link URL */}
        {form.type === 'link' && (
          <div>
            <label className="label-base">URL</label>
            <input
              type="url"
              className="input-base"
              placeholder="https://..."
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            />
          </div>
        )}

        {/* Cover image */}
        <div>
          <label className="label-base">Cover image</label>
          <ImageUpload
            value={form.cover_image || ''}
            onChange={(url: string) => setForm({ ...form, cover_image: url })}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="label-base">Tags</label>
          <TagInput
            value={form.tags || []}
            onChange={(tags: string[]) => setForm({ ...form, tags })}
          />
        </div>

        {/* Premium toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.is_premium}
              onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
            />
            <div className="w-9 h-5 bg-flow-border rounded-full peer-checked:bg-flow-accent transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm 
                            peer-checked:translate-x-4 transition-transform" />
          </div>
          <span className="text-sm text-flow-ink">Premium content (subscribers only)</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-flow-border">
          <button onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            disabled={!form.title.trim() || loading}
          >
            {loading ? 'Saving...' : card ? 'Save changes' : 'Add card'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

