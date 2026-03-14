import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Board ID required' });

  // GET — single board
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('boards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) return res.status(404).json({ error: 'Board not found' });
    return res.status(200).json({ data });
  }

  // PATCH — update board
  if (req.method === 'PATCH') {
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from('boards')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  // DELETE — delete board
  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('boards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
