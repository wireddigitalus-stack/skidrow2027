import type { APIRoute } from 'astro';
import { recordTelemetry } from '../../lib/db';

export const prerender = false;

export async function handlePulsePost(request: Request): Promise<Response> {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const path = String(body.path || '/').slice(0, 200);

    // Never pollute fan analytics with Backstage admin views
    if (path.startsWith('/backstage')) {
      return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    }

    const eventType = ['pageview', 'click', 'video_play', 'signup'].includes(body.eventType)
      ? body.eventType
      : 'pageview';

    const ua = request.headers.get('user-agent') || '';
    const deviceType =
      body.deviceType && ['mobile', 'tablet', 'desktop'].includes(body.deviceType)
        ? body.deviceType
        : /ipad|tablet/i.test(ua)
          ? 'tablet'
          : /mobile|iphone|android/i.test(ua)
            ? 'mobile'
            : 'desktop';

    let referrerHost = 'direct';
    if (body.referrer) {
      try {
        const refUrl = new URL(String(body.referrer));
        const reqHost = new URL(request.url).hostname;
        if (refUrl.hostname && refUrl.hostname !== reqHost) {
          referrerHost = refUrl.hostname.replace(/^www\./, '');
        }
      } catch {}
    }

    const rawCountry = (request.headers.get('x-vercel-ip-country') || 'LOCAL')
      .trim()
      .toUpperCase()
      .slice(0, 8);
    // Normalize both "NJ" and "US-NJ" formats cleanly to "NJ"
    const rawRegion = (request.headers.get('x-vercel-ip-country-region') || '')
      .trim()
      .toUpperCase()
      .replace(/^[A-Z]{2}-/, '')
      .slice(0, 16);

    let rawCity = '';
    try {
      rawCity = decodeURIComponent(request.headers.get('x-vercel-ip-city') || '').trim().slice(0, 100);
    } catch {
      rawCity = (request.headers.get('x-vercel-ip-city') || '').trim().slice(0, 100);
    }

    const latHeader = request.headers.get('x-vercel-ip-latitude');
    const lngHeader = request.headers.get('x-vercel-ip-longitude');
    const rawLat = latHeader ? Number(latHeader) : NaN;
    const rawLng = lngHeader ? Number(lngHeader) : NaN;
    const latitude = Number.isFinite(rawLat) ? rawLat : null;
    const longitude = Number.isFinite(rawLng) ? rawLng : null;
    const postalCode = (request.headers.get('x-vercel-ip-postal-code') || '').trim().slice(0, 20);

    await recordTelemetry({
      session_id: String(body.sessionId || 'anon').slice(0, 64),
      event_type: eventType,
      path,
      target_label: String(body.targetLabel || '').slice(0, 140),
      target_url: String(body.targetUrl || '').slice(0, 300),
      referrer: referrerHost,
      utm_source: String(body.utmSource || '').slice(0, 80),
      device_type: deviceType,
      country: rawCountry,
      region: rawRegion,
      city: rawCity,
      latitude,
      longitude,
      postal_code: postalCode,
    });

    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('Pulse telemetry error:', err);
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }
}

export const POST: APIRoute = async ({ request }) => handlePulsePost(request);
