export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const SITE = {
  name: 'Skid Row',
  tagline: '40 Years of Rebellion — 1986–2027',
  url: 'https://www.skidrow.com',
  storeUrl: 'https://shopskidrow.com/',
  linktreeUrl: 'https://linktr.ee/skidrowofficial',
  ticketmasterUrl: 'https://www.ticketmaster.com/skid-row-tickets/artist/736127',
  contactEmail: 'info@primarywave.com',
  mailerLiteUrl: 'https://dashboard.mailerlite.com/forms/245622/73780980377191711/share',
  bandsintownArtistId: '1473',
  bandsintownUrl: 'https://www.bandsintown.com/a/1473-skid-row',
  socials: [
    {
      name: 'Instagram',
      id: 'instagram',
      url: 'https://www.instagram.com/officialskidrow/',
    },
    {
      name: 'YouTube',
      id: 'youtube',
      url: 'https://www.youtube.com/channel/UCKf3ql762O9-Mhp0-l23AqQ',
    },
    {
      name: 'TikTok',
      id: 'tiktok',
      url: 'https://www.tiktok.com/@skidrowofficial',
    },
    {
      name: 'Facebook',
      id: 'facebook',
      url: 'https://www.facebook.com/OfficialSkidRow',
    },
    {
      name: 'X',
      id: 'x',
      url: 'https://x.com/OfficialSkidRow',
    },
    {
      name: 'Apple Music',
      id: 'apple-music',
      url: 'https://music.apple.com/us/artist/skid-row/163805',
    },
    {
      name: 'Spotify',
      id: 'spotify',
      url: 'https://open.spotify.com/artist/4opTS86dN9uO313J9CE8xg',
    },
    {
      name: 'Bandsintown',
      id: 'bandsintown',
      url: 'https://www.bandsintown.com/a/1473-skid-row',
    },
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Tour', href: '/tour' },
    { label: 'Music', href: '/music' },
    { label: 'Videos', href: '/videos' },
    { label: 'News', href: '/news' },
    { label: 'Bio', href: '/bio' },
    { label: 'Store', href: 'https://shopskidrow.com/', external: true },
    { label: 'Mailing List', href: '/mailing-list' },
  ] as NavItem[],
} as const;
