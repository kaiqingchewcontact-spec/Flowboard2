import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // GET — list cards for a board
  if (req.method === 'GET') {
    const { board_id } = req.query;
    if (!board_id) return res.status(400).json({ error: 'board_id required' });

    // Verify board ownership
    const { data: board } = await supabaseAdmin
      .from('boards')
      .select('id')
      .eq('id', board_id)
      .eq('user_id', userId)
      .single();

    if (!board) return res.status(404).json({ error: 'Board not found' });

    const { data, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('board_id', board_id)
      .order('order_index', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  // POST — create card
  if (req.method === 'POST') {
    const { board_id, type, title, content, excerpt, cover_image, link_url, is_premium } = req.body;
    if (!board_id || !title) return res.status(400).json({ error: 'board_id and title required' });

    // Verify board ownership
    const { data: board } = await supabaseAdmin
      .from('boards')
      .select('id')
      .eq('id', board_id)
      .eq('user_id', userId)
      .single();

    if (!board) return res.status(404).json({ error: 'Board not found' });

    // Get next order index
    const { data: lastCard } = await supabaseAdmin
      .from('cards')
      .select('order_index')
      .eq('board_id', board_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (lastCard?.order_index ?? -1) + 1;

    const { data, error } = await supabaseAdmin
      .from('cards')
      .insert({
        board_id,
        type: type || 'article',
        title,
        content: content || null,
        excerpt: excerpt || null,
        cover_image: cover_image || null,
        link_url: link_url || null,
        is_premium: is_premium || false,
        order_index: nextOrder,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
