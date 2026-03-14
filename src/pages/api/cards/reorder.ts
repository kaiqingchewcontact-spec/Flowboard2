import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { board_id, card_ids } = req.body;
  if (!board_id || !Array.isArray(card_ids)) {
    return res.status(400).json({ error: 'board_id and card_ids array required' });
  }

  // Verify board ownership
  const { data: board } = await supabaseAdmin
    .from('boards')
    .select('id')
    .eq('id', board_id)
    .eq('user_id', userId)
    .single();

  if (!board) return res.status(404).json({ error: 'Board not found' });

  // Update each card's order_index
  const updates = card_ids.map((cardId: string, index: number) =>
    supabaseAdmin
      .from('cards')
      .update({ order_index: index })
      .eq('id', cardId)
      .eq('board_id', board_id)
  );

  try {
    await Promise.all(updates);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reorder cards' });
  }
}
