// ============================================
// FLOWBOARD — Core Type Definitions
// ============================================

// --- Board ---
export interface Board {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  settings: BoardSettings;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardSettings {
  accent_color: string;
  background_color: string;
  font_display: string;
  font_body: string;
  layout: 'grid' | 'masonry' | 'list';
  columns: 1 | 2 | 3;
  show_branding: boolean;
  cta_enabled?: boolean;
  cta_text?: string;
  cta_url?: string;
}

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
  accent_color: '#e85d3a',
  background_color: '#faf9f7',
  font_display: 'DM Serif Display',
  font_body: 'DM Sans',
  layout: 'grid',
  columns: 3,
  show_branding: true,
  cta_enabled: false,
  cta_text: '',
  cta_url: '',
};

// --- Card ---
export type CardType = 'article' | 'short' | 'link' | 'image' | 'quote';

export interface Card {
  id: string;
  board_id: string;
  type: CardType;
  title: string;
  content: string | null;
  excerpt: string | null;
  cover_image: string | null;
  link_url: string | null;
  is_premium: boolean;
  order_index: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CardFormData {
  type: CardType;
  title: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  link_url?: string;
  is_premium: boolean;
  tags?: string[];
}

// --- API ---
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

// --- UI ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

