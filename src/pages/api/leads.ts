import type { APIRoute } from 'astro';
import { createOrUpdateLead, recordTelemetry } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const lead = await createOrUpdateLead({
      first_name: body.firstName || body.first_name || '',
      last_name: body.lastName || body.last_name || '',
      email: String(body.email || ''),
      phone: body.phone || '',
      source_page: body.sourcePage || body.source_page || '/',
      utm_source: body.utmSource || body.utm_source || '',
      utm_campaign: body.utmCampaign || body.utm_campaign || '',
    });

    await recordTelemetry({
      session_id: String(body.sessionId || 'signup'),
      event_type: 'signup',
      path: String(body.sourcePage || '/'),
      target_label: 'Mailing List Signup',
      target_url: '',
      referrer: request.headers.get('referer') || '',
      utm_source: String(body.utmSource || ''),
      device_type: /mobile|iphone|android/i.test(request.headers.get('user-agent') || '')
        ? 'mobile'
        : 'desktop',
      country: request.headers.get('x-vercel-ip-country') || '',
      city: decodeURIComponent(request.headers.get('x-vercel-ip-city') || ''),
    });

    return new Response(JSON.stringify({ ok: true, lead }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || 'Unable to save signup.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
