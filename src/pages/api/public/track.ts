import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { board_id, card_id, event_type, visitor_id, referrer } = req.body;

  if (!board_id || !event_type) {
    return res.status(400).json({ error: 'board_id and event_type required' });
  }

  if (!['board_view', 'card_click'].includes(event_type)) {
    return res.status(400).json({ error: 'Invalid event_type' });
  }

  const { error } = await supabaseAdmin
    .from('analytics_events')
    .insert({
      board_id,
      card_id: card_id || null,
      event_type,
      visitor_id: visitor_id || null,
      referrer: referrer || null,
    });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ success: true });
}