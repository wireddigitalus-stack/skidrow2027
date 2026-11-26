export interface VideoItem {
  id: string;
  title: string;
  year: string;
  category: 'Official Video' | 'Classic Anthem' | 'Audio / Visualizer';
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
    id: 'm4BwFl3kb5g',
    title: "The Gang's All Here (Official Video)",
    year: '2022',
    category: 'Official Video',
    description:
      'Title track from Skid Row\'s acclaimed studio album The Gang\'s All Here — produced by Nick Raskulinecz.',
  },
  {
    id: 'zFNuuFTBI7c',
    title: 'Time Bomb (Official Music Video)',
    year: '2022',
    category: 'Official Video',
    description:
      'High-octane single from The Gang\'s All Here.',
  },
  {
    id: 'Ghd2bkIadG4',
    title: '18 and Life (Official Music Video)',
    year: '1989',
    category: 'Classic Anthem',
    description:
      'Multi-platinum smash single from Skid Row\'s 1989 self-titled debut album.',
  },
  {
    id: '9RIeycixkK8',
    title: 'Youth Gone Wild (Official Music Video)',
    year: '1989',
    category: 'Classic Anthem',
    description:
      'The rebellious anthem that launched Skid Row onto rock radio and MTV worldwide.',
  },
  {
    id: 'qjuEXKwnkLE',
    title: 'I Remember You (Official Music Video)',
    year: '1989',
    category: 'Classic Anthem',
    description:
      'Top-10 Billboard Hot 100 power ballad from Skid Row (1989).',
  },
  {
    id: 'C3nycoZ-zzw',
    title: 'Slave to the Grind (Official Music Video)',
    year: '1991',
    category: 'Classic Anthem',
    description:
      'Title track from the first heavy metal album in history to debut at #1 on the Billboard 200.',
  },
];
