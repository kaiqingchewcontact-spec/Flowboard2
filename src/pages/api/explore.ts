import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { clerkClient } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Fetch published boards that opted into explore
  const { data: boards, error } = await supabaseAdmin
    .from('boards')
    .select('id, title, slug, description, settings, user_id, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });

  // Filter to boards with show_on_explore enabled
  const exploreBoards = (boards || []).filter(
    (b: any) => b.settings?.show_on_explore === true
  );

  // Fetch card counts for each board
  const boardsWithMeta = await Promise.all(
    exploreBoards.map(async (board: any) => {
      // Get card count
      const { count } = await supabaseAdmin
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .eq('board_id', board.id);

      // Get a few card titles for preview
      const { data: previewCards } = await supabaseAdmin
        .from('cards')
        .select('title, type')
        .eq('board_id', board.id)
        .order('order_index', { ascending: true })
        .limit(3);

      // Get creator profile from Clerk
      let creator = null;
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(board.user_id);
        creator = {
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          imageUrl: user.imageUrl || null,
        };
      } catch {}

      return {
        id: board.id,
        title: board.title,
        slug: board.slug,
        description: board.description,
        accentColor: board.settings?.accent_color || '#e85d3a',
        cardCount: count || 0,
        previewCards: previewCards || [],
        creator,
        updatedAt: board.updated_at,
      };
    })
  );

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
  return res.status(200).json({ data: boardsWithMeta });
}
