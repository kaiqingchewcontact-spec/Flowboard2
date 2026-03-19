import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { DEFAULT_BOARD_SETTINGS } from '@/types';
import { getUserPlan } from '@/lib/plans';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // GET — list user's boards
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('boards')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  // POST — create board
  if (req.method === 'POST') {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    // Check board limit
    const plan = await getUserPlan(userId);
    const { count } = await supabaseAdmin
      .from('boards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if ((count || 0) >= plan.maxBoards) {
      return res.status(403).json({
        error: `You've reached the ${plan.maxBoards} board limit on the ${plan.plan} plan. Upgrade to create more.`,
        upgrade: true,
      });
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const { data, error } = await supabaseAdmin
      .from('boards')
      .insert({
        user_id: userId,
        title,
        description: description || null,
        slug,
        settings: DEFAULT_BOARD_SETTINGS,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
