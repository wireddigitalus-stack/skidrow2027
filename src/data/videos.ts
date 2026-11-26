export interface VideoItem {
  id: string;
  title: string;
  year: string;
  category: 'Official Video' | 'Live in London' | 'Lyric Video' | 'Feature';
  description: string;
  featured?: boolean;
}

export const VIDEOS: VideoItem[] = [
  {
    id: 'psns6haPLVY',
    title: "Won't Get Fooled Again (Official Music Video)",
    year: '2026',
    category: 'Official Video',
    description:
      'Featuring new lead vocalist Justin Sargent. Produced by Nick Raskulinecz and directed by Dale "Rage" Resteghini for Skid Row\'s 40th-anniversary era.',
    featured: true,
  },
  {
    id: 'ie9DFOo36vw',
    title: 'Introducing Justin Sargent — New Blood. Same Attitude.',
    year: '2026',
    category: 'Feature',
    description:
      'Inside the studio and rehearsal room as Skid Row welcomes New Jersey powerhouse vocalist Justin Sargent for the band\'s next chapter.',
  },
  {
    id: '4m8ZiZ6DupA',
    title: 'Disease (Official Lyric Video)',
    year: '2025',
    category: 'Lyric Video',
    description:
      'Official lyric video celebrating the newly remastered vinyl, CD, and digital reissue of Revolutions Per Minute.',
  },
  {
    id: '1GOQefrF60s',
    title: 'Youth Gone Wild (Live in London)',
    year: '2024',
    category: 'Live in London',
    description:
      'Filmed live at London\'s O2 Forum Kentish Town from Skid Row\'s first official live album and concert film, Live in London.',
  },
  {
    id: 'lkT9wWZAopk',
    title: 'Slave to the Grind (Live in London)',
    year: '2024',
    category: 'Live in London',
    description:
      'Explosive opening assault captured live at the O2 Forum Kentish Town from Live in London.',
  },
  {
    id: '-li-_GwpBiM',
    title: 'Piece of Me (Live in London)',
    year: '2024',
    category: 'Live in London',
    description:
      'High-voltage performance of the classic anthem from Live in London.',
  },
  {
    id: 'nbecB3A0fnc',
    title: 'Resurrected (Official Video)',
    year: '2023',
    category: 'Official Video',
    description:
      'Official animated sci-fi music video for "Resurrected" from The Gang\'s All Here.',
  },
  {
    id: 'ijgweLI96mo',
    title: "October's Song (Official Lyric Video)",
    year: '2022',
    category: 'Lyric Video',
    description:
      'Official lyric video for the epic closing track from The Gang\'s All Here.',
  },
  {
    id: 'zAv1EQLGSLE',
    title: 'Time Bomb (Official Video)',
    year: '2022',
    category: 'Official Video',
    description:
      'High-octane official music video from The Gang\'s All Here.',
  },
  {
    id: 'SS7oj-l1HOc',
    title: 'Tear It Down (Official Video)',
    year: '2022',
    category: 'Official Video',
    description:
      'Official music video for "Tear It Down" from The Gang\'s All Here.',
  },
  {
    id: '37TYb0Dcln0',
    title: "The Gang's All Here (Official Video)",
    year: '2022',
    category: 'Official Video',
    description:
      'Title track and official music video from Skid Row\'s Nick Raskulinecz-produced studio album The Gang\'s All Here.',
  },
];
