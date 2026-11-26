import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../lib/auth';
import { deleteLead, listLeads, logAdminAction, updateLead } from '../../../lib/db';

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();
  const leads = await listLeads();
  return new Response(JSON.stringify({ leads }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();
  try {
    const body = await request.json();
    if (!body.id) throw new Error('Missing lead ID');
    const patch: { status?: 'active' | 'vip' | 'unsubscribed'; notes?: string } = {};
    if (body.status && ['active', 'vip', 'unsubscribed'].includes(body.status)) {
      patch.status = body.status;
    }
    if (typeof body.notes === 'string') {
      patch.notes = body.notes.slice(0, 500);
    }
    const lead = await updateLead(String(body.id), patch);
    await logAdminAction('LEAD_UPDATE', `Updated lead ${lead.email}`, getClientIp(request));
    return new Response(JSON.stringify({ ok: true, lead }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'Update failed' }), {
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
    if (!id) throw new Error('Missing lead ID');
    await deleteLead(id);
    await logAdminAction('LEAD_DELETE', `Deleted lead ${id}`, getClientIp(request));
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
