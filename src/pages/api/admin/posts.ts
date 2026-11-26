import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../lib/auth';
import { deletePost, listPosts, logAdminAction, upsertPost } from '../../../lib/db';

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();
  const posts = await listPosts(true);
  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    if (!title) throw new Error('Post title is required.');

    const isoDate = String(body.isoDate || new Date().toISOString().slice(0, 10));
    const dateLabel =
      String(body.date || '').trim() ||
      new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    const slug =
      String(body.slug || '').trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const paragraphs = Array.isArray(body.body)
      ? body.body.map((p: unknown) => String(p).trim()).filter(Boolean)
      : String(body.body || '')
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean);

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

    const category = ['Tour', 'Music', 'Band News', 'Solo / Press'].includes(body.category)
      ? body.category
      : 'Band News';

    const status = body.status === 'draft' ? 'draft' : 'published';

    const saved = await upsertPost({
      id: body.id ? String(body.id) : undefined,
      slug,
      title,
      date: dateLabel,
      isoDate,
      readTime: body.readTime ? String(body.readTime) : undefined,
      category,
      image: String(body.image || '/images/hero-band.jpg').trim(),
      excerpt: String(body.excerpt || paragraphs[0] || '').trim(),
      body: paragraphs.length ? paragraphs : [title],
      ctaLabel: String(body.ctaLabel || '').trim() || undefined,
      ctaUrl: String(body.ctaUrl || '').trim() || undefined,
      tags,
      status,
    });

    await logAdminAction(
      body.id ? 'POST_UPDATE' : 'POST_CREATE',
      `${status.toUpperCase()}: "${saved.title}" (/news/${saved.slug})`,
      getClientIp(request)
    );

    return new Response(JSON.stringify({ ok: true, post: saved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Save failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('Missing post ID');
    await deletePost(id);
    await logAdminAction('POST_DELETE', `Deleted post ${id}`, getClientIp(request));
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Delete failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
