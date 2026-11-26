import type { APIRoute } from 'astro';
import { listPosts } from '../lib/db';
import { CANONICAL_BASE } from '../lib/seo';

export const prerender = false;

function escXml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = async () => {
  const posts = await listPosts(false);

  const items = posts
    .slice(0, 30)
    .map(
      (p) => `    <item>
      <title>${escXml(p.title)}</title>
      <link>${CANONICAL_BASE}/news/${escXml(p.slug)}</link>
      <guid isPermaLink="true">${CANONICAL_BASE}/news/${escXml(p.slug)}</guid>
      <pubDate>${new Date(`${p.isoDate}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${escXml(p.category)}</category>
      <description>${escXml(p.excerpt)}</description>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Skid Row — Official News</title>
    <link>${CANONICAL_BASE}/news</link>
    <description>Official news, 2027 tour announcements, new music releases, and vinyl drops from Skid Row.</description>
    <language>en-us</language>
    <atom:link href="${CANONICAL_BASE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
};
