import type { APIRoute } from 'astro';
import { BAND_MEMBERS, BIO_LEAD, BIO_PARAGRAPHS } from '../data/bio';
import { DISCOGRAPHY } from '../data/discography';
import { VIDEOS } from '../data/videos';
import { SITE } from '../data/site';
import { listPosts } from '../lib/db';
import { getLiveTourDates } from '../lib/tourSync';
import { CANONICAL_BASE, SITE_FAQS } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = async () => {
  const [posts, shows] = await Promise.all([listPosts(false), getLiveTourDates()]);

  const md = `# Skid Row — Full Authoritative Fact Sheet (${CANONICAL_BASE})

## Summary
${BIO_LEAD}

${BIO_PARAGRAPHS.join('\n\n')}

## Official 2026–2027 Lineup
${BAND_MEMBERS.map((m) => `- **${m.name}** (${m.role} — ${m.badge}): ${m.bio}${m.instagram ? ` Instagram: ${m.instagram}` : ''}`).join('\n')}

## Frequently Asked Questions (Official Answers)
${SITE_FAQS.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Confirmed Upcoming Tour Dates (${shows.length} Shows)
${shows.map((s) => `- ${s.isoDate} (${s.weekday}) — ${s.city}, ${s.region}, ${s.country} @ ${s.venue} [${s.kind}] — Tickets: ${s.ticketUrl}`).join('\n')}

## Official Discography (1989–2026)
${DISCOGRAPHY.map((a) => `- **${a.title}** (${a.year}, ${a.type}) — ${a.description} | Listen: ${a.listenUrl} | Page: ${CANONICAL_BASE}/music/${a.slug}`).join('\n')}

## Official Videos (2022–2026)
${VIDEOS.map((v) => `- **${v.title}** (${v.year}, ${v.category}): https://www.youtube.com/watch?v=${v.id} — ${v.description}`).join('\n')}

## Latest Official News Posts (${posts.length} Published)
${posts.slice(0, 20).map((p) => `- **${p.date}** — [${p.title}](${CANONICAL_BASE}/news/${p.slug}): ${p.excerpt}`).join('\n')}

## Official Links & Merch Store
- Website: ${CANONICAL_BASE}
- Official Merch Store: ${SITE.storeUrl}
- Linktree: ${SITE.linktreeUrl}
${SITE.socials.map((s) => `- ${s.name}: ${s.url}`).join('\n')}
- Management Contact: ${SITE.contactEmail}
`;

  return new Response(md, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
};
