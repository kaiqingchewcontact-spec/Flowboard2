import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { clerkClient } from '@clerk/nextjs/server';
import { getUserPlan } from '@/lib/plans';

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

  // Fetch creator profile from Clerk
  let creator = null;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(board.user_id);
    creator = {
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      imageUrl: user.imageUrl || null,
    };
  } catch {
    // If Clerk lookup fails, proceed without creator info
  }

  // Check if creator can remove branding
  const plan = await getUserPlan(board.user_id);
  const showBranding = !plan.canRemoveBranding;

  return res.status(200).json({ data: { board, cards, creator, showBranding } });
}
