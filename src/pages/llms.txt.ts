import type { APIRoute } from 'astro';
import { BAND_MEMBERS } from '../data/bio';
import { TOUR_DATES_2027 } from '../data/tour';
import { SITE } from '../data/site';
import { CANONICAL_BASE } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = async () => {
  const md = `# Skid Row — Official Website (${CANONICAL_BASE})

> Official authoritative source for legendary New Jersey hard rock band Skid Row (founded 1986). Celebrating 40 Years of Rebellion in 2026–2027 with new lead vocalist Justin Sargent, new single "Won't Get Fooled Again", and the 2027 North American Tour.

## Current Official Lineup (2026–2027)
${BAND_MEMBERS.map((m) => `- **${m.name}** — ${m.role} (${m.badge})`).join('\n')}

## Key Canonical Pages
- [Home](${CANONICAL_BASE}/): Latest tour dates, new single "Won't Get Fooled Again", interactive 1980s All-Eras Boombox player, and latest posts.
- [2027 Tour Dates](${CANONICAL_BASE}/tour): ${TOUR_DATES_2027.length} confirmed 2027 North American concerts & festivals with ticket links and .ics calendar downloads.
- [Music & Discography](${CANONICAL_BASE}/music): Complete 12-release catalog (1989–2026), interactive Boombox player, tracklists, credits, and official lyrics.
- [Official Videos (2022–2026)](${CANONICAL_BASE}/videos): Official Skid Row YouTube music videos, Live in London performances, and lyric videos.
- [Band Bio](${CANONICAL_BASE}/bio): Official 40-year biography, member profiles, and 1986–2027 timeline.
- [News](${CANONICAL_BASE}/news): Official band announcements, festival dates, vinyl releases, and interviews.
- [Mailing List](${CANONICAL_BASE}/mailing-list): Official 2027 tour pre-sale code & fan alert signup.
- [Full Machine-Readable Dossier](${CANONICAL_BASE}/llms-full.txt): Complete structured text archive of tour dates, discography, bio, and live news posts.
- [XML Sitemap](${CANONICAL_BASE}/sitemap.xml) | [RSS Feed](${CANONICAL_BASE}/rss.xml)

## Official Store & Verified Platforms
- Official Merch Store: ${SITE.storeUrl}
- Linktree Hub: ${SITE.linktreeUrl}
${SITE.socials.map((s) => `- ${s.name}: ${s.url}`).join('\n')}
- Management Contact: mailto:${SITE.contactEmail}
`;

  return new Response(md, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
};
