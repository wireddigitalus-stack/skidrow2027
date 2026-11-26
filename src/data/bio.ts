export interface BandMember {
  name: string;
  role: string;
  badge: string;
  instagram?: string;
  bio: string;
}

export const BIO_LEAD =
  'The first rebellion started in 1986. Forty years later, SKID ROW is still bringing the fire.';

export const BIO_PARAGRAPHS = [
  'From the streets of New Jersey to the world\'s biggest stages, SKID ROW has built a legacy defined by uncompromising rock \'n\' roll, multi-platinum albums, chart-topping hits, and anthems that have transcended generations. With classics like "18 and Life," "I Remember You," "Youth Gone Wild," and "Slave to the Grind," the band helped define an era while remaining true to the rebellious spirit that started it all.',
  'Now, a new chapter begins.',
  'Celebrating four decades of uncompromising rock \'n\' roll, founding members Rachel Bolan and Snake Sabo, alongside Scotti Hill and Rob Hammersmith, welcome powerhouse vocalist Justin Sargent to the lineup. Armed with an extraordinary voice, commanding stage presence, and undeniable chemistry with the band, Sargent brings a renewed intensity to the SKID ROW live experience.',
  'Known for their explosive performances, blistering guitar riffs, and arena-sized anthems, SKID ROW delivers the kind of high-energy rock show that made them one of the most electrifying bands of their generation.',
  'With a legendary catalog, a powerful new frontman, and their sights firmly set on the future, SKID ROW proves that some rebellions never die.',
  'The songs are timeless. The energy is undeniable. And the rebellion continues.',
];

export const BAND_MEMBERS: BandMember[] = [
  {
    name: 'Justin Sargent',
    role: 'Lead Vocals',
    badge: 'New Era • 2026',
    instagram: 'https://www.instagram.com/justinmsargent/?hl=en',
    bio: 'New Jersey powerhouse vocalist introduced in October 2026 on "Won\'t Get Fooled Again" — bringing explosive range, conviction, and raw stage command to Skid Row\'s 40th-anniversary chapter.',
  },
  {
    name: 'Rachel Bolan',
    role: 'Bass & Backing Vocals',
    badge: 'Founding Member',
    instagram: 'https://www.instagram.com/officialrachelbolan/?hl=en',
    bio: 'Co-founder, primary songwriter, and punk-infused backbone behind Skid Row\'s unmistakable grit since 1986 — also unveiling his 2026 solo debut, Gargoyle of the Garden State.',
  },
  {
    name: 'Dave "Snake" Sabo',
    role: 'Guitar & Backing Vocals',
    badge: 'Founding Member',
    instagram: 'https://www.instagram.com/snakesabo16/?hl=en',
    bio: 'Co-founder and riff architect whose razor-sharp songwriting and unmistakable guitar fire forged multi-platinum rock history from New Jersey to arenas worldwide.',
  },
  {
    name: 'Scotti Hill',
    role: 'Guitar & Backing Vocals',
    badge: 'Classic Lineup',
    instagram: 'https://www.instagram.com/scottihill/?hl=en',
    bio: 'Virtuoso guitarist whose twin-lead chemistry with Snake Sabo has defined Skid Row\'s blistering sonic signature for nearly four decades.',
  },
  {
    name: 'Rob Hammersmith',
    role: 'Drums',
    badge: 'Rhythm Powerhouse',
    bio: 'Thunderous powerhouse behind the kit since 2010, anchoring Skid Row\'s high-octane live shows and modern studio assaults with relentless precision.',
  },
];

export const TIMELINE = [
  {
    year: '1986',
    title: 'Formed in New Jersey',
    text: 'Rachel Bolan and Dave "Snake" Sabo spark the first rebellion in Toms River, NJ.',
  },
  {
    year: '1989',
    title: 'Multi-Platinum Debut',
    text: 'Skid Row unleashes "18 and Life," "Youth Gone Wild," and "I Remember You" — going 5x Platinum.',
  },
  {
    year: '1991',
    title: 'Slave to the Grind Hits #1',
    text: 'Becomes the first heavy metal album in history to debut at #1 on the Billboard 200.',
  },
  {
    year: '2022',
    title: "The Gang's All Here",
    text: 'Teams with Grammy-winning producer Nick Raskulinecz for a roaring global chart comeback.',
  },
  {
    year: '2026–27',
    title: '40 Years & Justin Sargent Era',
    text: 'New frontman Justin Sargent debuts with "Won\'t Get Fooled Again" ahead of a massive 2027 North American tour.',
  },
];

export const ARCHIVE_PHOTOS = [
  '/images/gallery/photo-1.jpg',
  '/images/gallery/photo-2.jpg',
  '/images/gallery/photo-3.jpg',
  '/images/gallery/photo-4.jpg',
];
