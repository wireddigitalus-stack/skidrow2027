import type { APIRoute } from 'astro';
import { getClientIp, isAuthenticated } from '../../../../lib/auth';
import { listLeads, logAdminAction } from '../../../../lib/db';

export const prerender = false;

function csvCell(val: string): string {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const leads = await listLeads();
  const header = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Status',
    'Source Page',
    'UTM Source',
    'UTM Campaign',
    'Notes',
    'Created At',
  ];

  const rows = leads.map((l) =>
    [
      l.first_name,
      l.last_name,
      l.email,
      l.phone,
      l.status,
      l.source_page,
      l.utm_source,
      l.utm_campaign,
      l.notes,
      l.created_at,
    ]
      .map(csvCell)
      .join(',')
  );

  const csv = [header.join(','), ...rows].join('\n');
  const today = new Date().toISOString().slice(0, 10);
  await logAdminAction('LEADS_EXPORT', `Exported ${leads.length} leads to CSV`, getClientIp(request));

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="skidrow-leads-${today}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
