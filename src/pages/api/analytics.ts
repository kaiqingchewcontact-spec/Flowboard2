import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { board_id, days = '30' } = req.query;
  if (!board_id) return res.status(400).json({ error: 'board_id required' });

  // Verify board ownership
  const { data: board } = await supabaseAdmin
    .from('boards')
    .select('id')
    .eq('id', board_id)
    .eq('user_id', userId)
    .single();

  if (!board) return res.status(404).json({ error: 'Board not found' });

  const daysNum = parseInt(days as string, 10);
  const since = new Date();
  since.setDate(since.getDate() - daysNum);

  // Total views
  const { count: totalViews } = await supabaseAdmin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', board_id)
    .eq('event_type', 'board_view')
    .gte('created_at', since.toISOString());

  // Total card clicks
  const { count: totalClicks } = await supabaseAdmin
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', board_id)
    .eq('event_type', 'card_click')
    .gte('created_at', since.toISOString());

  // Views per day (for chart)
  const { data: viewsByDay } = await supabaseAdmin
    .from('analytics_events')
    .select('created_at')
    .eq('board_id', board_id)
    .eq('event_type', 'board_view')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  // Group by day
  const dailyViews: Record<string, number> = {};
  viewsByDay?.forEach((event) => {
    const day = event.created_at.split('T')[0];
    dailyViews[day] = (dailyViews[day] || 0) + 1;
  });

  // Top cards by clicks
  const { data: cardClicks } = await supabaseAdmin
    .from('analytics_events')
    .select('card_id')
    .eq('board_id', board_id)
    .eq('event_type', 'card_click')
    .gte('created_at', since.toISOString());

  const clicksByCard: Record<string, number> = {};
  cardClicks?.forEach((event) => {
    if (event.card_id) {
      clicksByCard[event.card_id] = (clicksByCard[event.card_id] || 0) + 1;
    }
  });

  // Get card titles for top cards
  const topCardIds = Object.entries(clicksByCard)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);

  let topCards: { id: string; title: string; clicks: number }[] = [];
  if (topCardIds.length > 0) {
    const { data: cards } = await supabaseAdmin
      .from('cards')
      .select('id, title')
      .in('id', topCardIds);

    topCards = (cards || []).map((card) => ({
      id: card.id,
      title: card.title,
      clicks: clicksByCard[card.id] || 0,
    })).sort((a, b) => b.clicks - a.clicks);
  }

  return res.status(200).json({
    data: {
      totalViews: totalViews || 0,
      totalClicks: totalClicks || 0,
      dailyViews,
      topCards,
    },
  });
}

