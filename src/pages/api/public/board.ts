import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') return res.status(400).json({ error: 'Slug required' });

  // Fetch published board
  const { data: board, error: boardError } = await supabaseAdmin
    .from('boards')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (boardError || !board) return res.status(404).json({ error: 'Board not found' });

  // Fetch cards
  const { data: cards, error: cardsError } = await supabaseAdmin
    .from('cards')
    .select('*')
    .eq('board_id', board.id)
    .order('order_index', { ascending: true });

  if (cardsError) return res.status(500).json({ error: cardsError.message });

  return res.status(200).json({ data: { board, cards } });
}
