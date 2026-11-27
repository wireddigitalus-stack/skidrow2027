import type { APIRoute } from 'astro';
import { getAuthEnvStatus, getClientIp, isAuthenticated } from '../../../lib/auth';
import {
  getAnalyticsSummary,
  getDatabaseHealth,
  isSupabaseConfigured,
  listAuditLogs,
  logAdminAction,
} from '../../../lib/db';
import { getLiveTourSync, toTourStopsGeo } from '../../../lib/tourSync';

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
  const forceSyncTour = url.searchParams.get('syncTour') === '1';

  const tourSync = await getLiveTourSync({ forceRefresh: forceSyncTour });
  if (forceSyncTour) {
    await logAdminAction(
      'TOUR_SYNC',
      `Manual Bandsintown tour sync (${tourSync.source}, ${tourSync.shows.length} shows${tourSync.error ? `, note: ${tourSync.error}` : ''})`,
      getClientIp(request)
    );
  }

  const [analytics, auditLogs, health] = await Promise.all([
    getAnalyticsSummary(days, toTourStopsGeo(tourSync.shows)),
    listAuditLogs(),
    getDatabaseHealth(),
  ]);

  return new Response(
    JSON.stringify({
      analytics,
      auditLogs,
      health,
      tourSync: {
        source: tourSync.source,
        configured: tourSync.configured,
        count: tourSync.shows.length,
        lastSyncedAt: tourSync.lastSyncedAt,
        error: tourSync.error,
      },
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
