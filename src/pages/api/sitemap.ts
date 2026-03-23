import type { NextApiRequest, NextApiResponse } from 'next';
import { blogPosts } from '@/lib/blog';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = 'https://flowboard2.vercel.app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const staticPages = ['', '/blog', '/terms', '/sign-in', '/sign-up'];

  // Fetch all published boards for indexing
  const { data: boards } = await supabaseAdmin
    .from('boards')
    .select('slug, updated_at')
    .eq('is_published', true);

  const urls = [
    ...staticPages.map((path) => `
    <url>
      <loc>${BASE_URL}${path}</loc>
      <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
      <priority>${path === '' ? '1.0' : '0.7'}</priority>
    </url>`),
    ...blogPosts.map((post) => `
    <url>
      <loc>${BASE_URL}/blog/${post.slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`),
    ...(boards || []).map((board) => `
    <url>
      <loc>${BASE_URL}/${board.slug}</loc>
      <lastmod>${new Date(board.updated_at).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(sitemap);
}
