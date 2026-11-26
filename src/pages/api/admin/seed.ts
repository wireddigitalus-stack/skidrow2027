import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../lib/auth';
import { logAdminAction, seedInitialPosts } from '../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized — please unlock Backstage again.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const posts = await seedInitialPosts();
    await logAdminAction('SEED_POSTS', `Seeded ${posts.length} Skid Row news posts`, getClientIp(request));
    return new Response(JSON.stringify({ ok: true, seeded: posts.length, posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || 'Seed failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
