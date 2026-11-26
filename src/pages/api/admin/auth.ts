import type { APIRoute } from 'astro';
import {
  checkRateLimit,
  clearRateLimit,
  clearSessionCookie,
  getClientIp,
  isAuthenticated,
  recordFailedPin,
  setSessionCookie,
  verifyPin,
} from '../../../lib/auth';
import { logAdminAction } from '../../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  return new Response(JSON.stringify({ authenticated: isAuthenticated(cookies) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: `Too many failed attempts. Try again in ${Math.ceil((limit.retryAfterSec || 60) / 60)} min.`,
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const pin = String(body.pin || '');

    if (!verifyPin(pin)) {
      const fail = recordFailedPin(ip);
      await logAdminAction('PIN_FAILED', `Invalid 6-digit PIN attempt (${fail.remaining} left)`, ip);
      return new Response(
        JSON.stringify({
          ok: false,
          error: fail.locked
            ? 'Access temporarily locked after 5 failed attempts.'
            : `Invalid PIN. ${fail.remaining} attempt${fail.remaining === 1 ? '' : 's'} remaining.`,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    clearRateLimit(ip);
    setSessionCookie(cookies);
    await logAdminAction('PIN_LOGIN', 'Backstage unlocked via 6-digit PIN', ip);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  clearSessionCookie(cookies);
  await logAdminAction('PIN_LOGOUT', 'Backstage session locked', getClientIp(request));
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
