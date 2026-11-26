import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../../lib/auth';
import { logAdminAction, syncPendingLeadsToMailerLite } from '../../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await syncPendingLeadsToMailerLite();
    await logAdminAction(
      'MAILERLITE_SYNC',
      `Synced ${result.synced}/${result.attempted} pending leads (${result.failed} failed)`,
      getClientIp(request)
    );
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Sync failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
