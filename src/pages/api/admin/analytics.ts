import type { APIRoute } from 'astro';
import { getAuthEnvStatus, isAuthenticated } from '../../../lib/auth';
import { getAnalyticsSummary, isSupabaseConfigured, listAuditLogs } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get('days') || '7')));
  const [analytics, auditLogs] = await Promise.all([
    getAnalyticsSummary(days),
    listAuditLogs(),
  ]);

  return new Response(
    JSON.stringify({
      analytics,
      auditLogs,
      system: {
        backend: isSupabaseConfigured() ? 'Supabase Postgres' : 'Local Dev Store (.data/store.json)',
        isSupabase: isSupabaseConfigured(),
        env: getAuthEnvStatus(),
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    }
  );
};
