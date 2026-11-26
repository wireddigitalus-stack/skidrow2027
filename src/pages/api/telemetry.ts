import type { APIRoute } from 'astro';
import { recordTelemetry } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const path = String(body.path || '/').slice(0, 200);

    // Never pollute fan analytics with Backstage admin views
    if (path.startsWith('/backstage')) {
      return new Response(null, { status: 204 });
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

    await recordTelemetry({
      session_id: String(body.sessionId || 'anon').slice(0, 64),
      event_type: eventType,
      path,
      target_label: String(body.targetLabel || '').slice(0, 140),
      target_url: String(body.targetUrl || '').slice(0, 300),
      referrer: referrerHost,
      utm_source: String(body.utmSource || '').slice(0, 80),
      device_type: deviceType,
      country: request.headers.get('x-vercel-ip-country') || 'LOCAL',
      city: decodeURIComponent(request.headers.get('x-vercel-ip-city') || ''),
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
};
