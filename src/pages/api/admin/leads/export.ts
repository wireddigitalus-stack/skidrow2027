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

  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'full';
  const leads = await listLeads();
  const today = new Date().toISOString().slice(0, 10);

  let csv = '';
  let filename = `skidrow-leads-${today}.csv`;

  if (format === 'mailerlite') {
    // Exact MailerLite import column names matching form 73780980377191711
    const activeLeads = leads.filter((l) => l.status !== 'unsubscribed');
    const header = ['email', 'name', 'last_name', 'phone', 'z_i_p'];
    const rows = activeLeads.map((l) =>
      [l.email, l.first_name, l.last_name, l.phone, l.zip_code].map(csvCell).join(',')
    );
    csv = [header.join(','), ...rows].join('\n');
    filename = `skidrow-mailerlite-import-${today}.csv`;
    await logAdminAction(
      'LEADS_EXPORT_ML',
      `Exported ${activeLeads.length} active leads in MailerLite CSV format`,
      getClientIp(request)
    );
  } else {
    const header = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'ZIP',
      'Status',
      'MailerLite Sync',
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
        l.zip_code,
        l.status,
        l.mailerlite_status,
        l.source_page,
        l.utm_source,
        l.utm_campaign,
        l.notes,
        l.created_at,
      ]
        .map(csvCell)
        .join(',')
    );
    csv = [header.join(','), ...rows].join('\n');
    await logAdminAction('LEADS_EXPORT', `Exported ${leads.length} leads to CSV`, getClientIp(request));
  }

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
};
