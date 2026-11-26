import type { APIRoute } from 'astro';
import { DISCOGRAPHY } from '../data/discography';
import { listPosts } from '../lib/db';
import { CANONICAL_BASE } from '../lib/seo';

export const prerender = false;

function escXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: APIRoute = async () => {
  const posts = await listPosts(false);
  const today = new Date().toISOString().slice(0, 10);

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily', lastmod: today },
    { path: '/tour', priority: '0.95', changefreq: 'daily', lastmod: today },
    { path: '/music', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: '/videos', priority: '0.85', changefreq: 'weekly', lastmod: today },
    { path: '/news', priority: '0.9', changefreq: 'daily', lastmod: posts[0]?.isoDate || today },
    { path: '/bio', priority: '0.85', changefreq: 'monthly', lastmod: today },
    { path: '/mailing-list', priority: '0.75', changefreq: 'monthly', lastmod: today },
    { path: '/legal', priority: '0.3', changefreq: 'yearly', lastmod: today },
  ];

  const albumRoutes = DISCOGRAPHY.map((a) => ({
    path: `/music/${a.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: today,
  }));

  const postRoutes = posts.map((p) => ({
    path: `/news/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: p.isoDate || today,
  }));

  const urls = [...staticRoutes, ...albumRoutes, ...postRoutes]
    .map(
      (u) => `  <url>
    <loc>${escXml(`${CANONICAL_BASE}${u.path === '/' ? '' : u.path}`)}</loc>
    <lastmod>${escXml(u.lastmod)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
};
