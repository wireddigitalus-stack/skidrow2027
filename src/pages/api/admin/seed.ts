import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../lib/auth';
import { NEWS_POSTS } from '../../../data/news';
import { logAdminAction, upsertPost } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let seeded = 0;
    for (const post of NEWS_POSTS) {
      await upsertPost({
        slug: post.slug,
        title: post.title,
        date: post.date,
        isoDate: post.isoDate,
        readTime: post.readTime,
        category: post.category,
        image: post.image,
        excerpt: post.excerpt,
        body: post.body,
        ctaLabel: post.ctaLabel,
        ctaUrl: post.ctaUrl,
        tags: post.tags,
        status: 'published',
      });
      seeded++;
    }
    await logAdminAction('SEED_POSTS', `Seeded ${seeded} Skid Row news posts`, getClientIp(request));
    return new Response(JSON.stringify({ ok: true, seeded }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Seed failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
