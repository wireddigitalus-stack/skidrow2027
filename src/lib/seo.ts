import { SITE } from '../data/site';
import { BAND_MEMBERS } from '../data/bio';
import { TOUR_DATES_2027 } from '../data/tour';
import { DISCOGRAPHY, type Album } from '../data/discography';
import { VIDEOS } from '../data/videos';
import type { NewsPost } from '../data/news';

export const CANONICAL_BASE = 'https://www.skidrow.com';

export function absUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return CANONICAL_BASE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`, CANONICAL_BASE).toString();
}

export const SITE_FAQS = [
  {
    q: 'Who is the lead singer of Skid Row in 2026 and 2027?',
    a: 'Justin Sargent is the lead vocalist of Skid Row. Announced on October 29, 2026 for the band\'s 40th anniversary, the New Jersey powerhouse debuted on Skid Row\'s Nick Raskulinecz-produced cover of The Who\'s "Won\'t Get Fooled Again."',
  },
  {
    q: 'Who are the current members of Skid Row?',
    a: 'Skid Row\'s official 2026–2027 lineup consists of founding members Rachel Bolan (bass, backing vocals) and Dave "Snake" Sabo (guitar, backing vocals), longtime guitarist Scotti Hill, drummer Rob Hammersmith, and lead vocalist Justin Sargent.',
  },
  {
    q: 'Is Skid Row touring in 2027 and where can I buy tickets?',
    a: 'Yes. Skid Row returns to the road in spring 2027 with 14+ North American concert and festival dates beginning March 5, 2027 in Rancho Mirage, CA, including Welcome to Rockville (May 9, Daytona Beach, FL), Sonic Temple Art & Music Festival (May 14, Columbus, OH), and Fallsview Casino (May 29, Niagara Falls, ON). Official tickets are linked directly at https://www.skidrow.com/tour and Bandsintown.',
  },
  {
    q: "What is Skid Row's newest single?",
    a: 'Skid Row\'s newest release is "Won\'t Get Fooled Again" (released October 30, 2026), produced by Nick Raskulinecz at Rock Falcon Studio in Nashville, TN, accompanied by an official music video directed by Dale "Rage" Resteghini and a limited-edition autographed 7" vinyl single.',
  },
  {
    q: 'Where can I buy official Skid Row merchandise?',
    a: 'Official Skid Row apparel, vinyl, and tour merchandise are available exclusively through the official merch store at https://shopskidrow.com/.',
  },
];

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${CANONICAL_BASE}/#website`,
    name: 'Skid Row',
    alternateName: 'Skid Row Official Website',
    url: CANONICAL_BASE,
    description:
      'Official website of legendary hard rock band Skid Row. 2027 North American tour dates, new single "Won\'t Get Fooled Again" featuring Justin Sargent, full discography, official videos, band bio, and news.',
    publisher: { '@id': `${CANONICAL_BASE}/#band` },
  };
}

export function buildMusicGroupSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${CANONICAL_BASE}/#band`,
    name: 'Skid Row',
    url: CANONICAL_BASE,
    image: absUrl('/images/og-skidrow-2027.jpg'),
    logo: absUrl('/images/skidrow-logo.avif'),
    foundingDate: '1986',
    foundingLocation: {
      '@type': 'Place',
      name: 'Toms River, New Jersey, USA',
    },
    genre: ['Hard Rock', 'Heavy Metal', 'Glam Metal'],
    description:
      'Formed in 1986 in New Jersey, multi-platinum hard rock legends Skid Row celebrate 40 years of rebellion with founding members Rachel Bolan and Dave "Snake" Sabo, Scotti Hill, Rob Hammersmith, and new lead vocalist Justin Sargent.',
    sameAs: [
      ...SITE.socials.map((s) => s.url),
      SITE.storeUrl,
      SITE.linktreeUrl,
    ],
    member: BAND_MEMBERS.map((m) => ({
      '@type': 'OrganizationRole',
      roleName: m.role,
      member: {
        '@type': 'Person',
        name: m.name,
        ...(m.instagram ? { sameAs: [m.instagram] } : {}),
      },
    })),
    album: DISCOGRAPHY.slice(0, 8).map((a) => ({
      '@type': 'MusicAlbum',
      name: a.title,
      datePublished: String(a.year),
      url: absUrl(`/music/${a.slug}`),
    })),
  };
}

export function buildTourEventsSchema(
  shows: Array<{
    isoDate: string;
    city: string;
    region: string;
    country: string;
    venue: string;
    kind: string;
    status: string;
    ticketUrl: string;
  }> = TOUR_DATES_2027
) {
  return shows.map((show) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name:
      show.kind === 'Festival'
        ? `Skid Row at ${show.venue}`
        : `Skid Row Live in ${show.city}, ${show.region}`,
    startDate: show.isoDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: absUrl('/images/og-skidrow-2027.jpg'),
    url: absUrl('/tour'),
    location: {
      '@type': 'Place',
      name: show.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: show.city,
        addressRegion: show.region,
        addressCountry: show.country,
      },
    },
    performer: {
      '@type': 'MusicGroup',
      '@id': `${CANONICAL_BASE}/#band`,
      name: 'Skid Row',
      url: CANONICAL_BASE,
    },
    offers: {
      '@type': 'Offer',
      url: show.ticketUrl,
      availability:
        show.status === 'Sold Out'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      priceCurrency: show.country === 'CA' ? 'CAD' : 'USD',
    },
  }));
}

export function buildAlbumSchema(album: Album) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: album.title,
    url: absUrl(`/music/${album.slug}`),
    image: absUrl(album.cover),
    datePublished: String(album.year),
    albumReleaseType: album.type === 'Single' ? 'SingleRelease' : album.type === 'EP' ? 'EPRelease' : 'AlbumRelease',
    description: album.description,
    byArtist: {
      '@type': 'MusicGroup',
      '@id': `${CANONICAL_BASE}/#band`,
      name: 'Skid Row',
      url: CANONICAL_BASE,
    },
    ...(album.tracks && album.tracks.length
      ? {
          numTracks: album.tracks.length,
          track: album.tracks.map((t) => ({
            '@type': 'MusicRecording',
            position: t.number,
            name: t.title,
            byArtist: { '@type': 'MusicGroup', name: 'Skid Row' },
          })),
        }
      : {}),
  };
}

export function buildNewsArticleSchema(post: NewsPost) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: post.excerpt,
      image: [absUrl(post.image)],
      datePublished: `${post.isoDate}T12:00:00Z`,
      dateModified: `${post.isoDate}T12:00:00Z`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': absUrl(`/news/${post.slug}`),
      },
      author: {
        '@type': 'MusicGroup',
        '@id': `${CANONICAL_BASE}/#band`,
        name: 'Skid Row',
        url: CANONICAL_BASE,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Skid Row Inc.',
        url: CANONICAL_BASE,
        logo: {
          '@type': 'ImageObject',
          url: absUrl('/images/skidrow-logo.avif'),
        },
      },
      keywords: post.tags.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_BASE },
        { '@type': 'ListItem', position: 2, name: 'News', item: absUrl('/news') },
        { '@type': 'ListItem', position: 3, name: post.title, item: absUrl(`/news/${post.slug}`) },
      ],
    },
  ];
}

export function buildVideosSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Skid Row Official Videos (2022–2026)',
    itemListElement: VIDEOS.map((v, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'VideoObject',
        name: `Skid Row — ${v.title}`,
        description: v.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        uploadDate: `${v.year}-01-01T12:00:00Z`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
        publisher: { '@type': 'MusicGroup', name: 'Skid Row', url: CANONICAL_BASE },
      },
    })),
  };
}

export function buildFaqSchema(faqs = SITE_FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
