export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  readTime: string;
  category: 'Tour' | 'Music' | 'Band News' | 'Solo / Press';
  image: string;
  excerpt: string;
  body: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  tags: string[];
}

export const NEWS_POSTS: NewsPost[] = [
  {
    slug: 'skid-row-2027-concerts-on-sale-now',
    title: 'Skid Row 2027 Concerts — On Sale Now',
    date: 'Nov 20, 2026',
    isoDate: '2026-11-20',
    readTime: '1 min read',
    category: 'Tour',
    image: '/images/news/2027-onsale.jpg',
    excerpt:
      'The Wait is Over! Skid Row are back on the road with these initial 2027 North American concerts. Tickets are on sale now — more dates announcing soon!',
    body: [
      'The Wait is Over! Skid Row are back on the road with these initial 2027 concerts. Tickets are on sale now at SkidRow.com — with more dates announcing soon!',
      'March 5 — Rancho Mirage, CA (The Show at Agua Caliente)\nMarch 20 — New Buffalo, MI (Silver Creek Event Center)\nApril 2 — Kansas City, MO (VooDoo Lounge at Harrah\'s)\nApril 3 — Welch, MN (Island Event Center)\nApril 9 — Mashantucket, CT (Foxwoods)\nApril 10 — Atlantic City, NJ (Borgata)\nApril 16 — Wheatland, CA (Hard Rock Live)\nApril 17 — Reno, NV (Silver Legacy Casino)\nApril 18 — Shelton, WA (Little Creek Casino)\nApril 23 — Quapaw, OK (Downstream Casino)\nApril 24 — Grant, OK (Choctaw Casino)\nMay 9 — Daytona Beach, FL (Welcome to Rockville Festival)\nMay 14 — Columbus, OH (Sonic Temple Festival)\nMay 29 — Niagara Falls, ON (Fallsview Casino)',
    ],
    ctaLabel: 'View All 2027 Dates & Tickets',
    ctaUrl: '/tour',
    tags: ['Skid Row', '2027', 'Tour', 'Tickets'],
  },
  {
    slug: 'attn-skid-row-2027-tour-pre-sale-has-begun',
    title: 'Attn: Skid Row 2027 Tour Pre-Sale Has Begun!',
    date: 'Nov 18, 2026',
    isoDate: '2026-11-18',
    readTime: '1 min read',
    category: 'Tour',
    image: '/images/news/2027-onsale.jpg',
    excerpt:
      'The 2027 initial concerts ticket pre-sale has kicked off! Subscribers can check their inbox for the code — or join now for exclusive access to all things Skid Row.',
    body: [
      'Attn: Skid Row 2027 initial concerts ticket pre-sale has kicked off!',
      'If you\'re subscribed to our newsletter, check your inbox for your pre-sale access code. If you haven\'t signed up yet, now is the perfect time to join the official Skid Row mailing list for early ticket drops and exclusive band updates.',
    ],
    ctaLabel: 'Join Official Mailing List',
    ctaUrl: 'https://dashboard.mailerlite.com/forms/245622/73780980377191711/share',
    tags: ['Tour', 'Pre-Sale', '2027', 'Mailing List'],
  },
  {
    slug: 'just-announced-skid-row-is-back-on-stage-in-2027',
    title: 'JUST ANNOUNCED: Skid Row Is Back on Stage in 2027!',
    date: 'Nov 17, 2026',
    isoDate: '2026-11-17',
    readTime: '1 min read',
    category: 'Tour',
    image: '/images/news/2027-announced.jpg',
    excerpt:
      'The first round of 2027 concert dates is here, marking Skid Row\'s explosive return to stages across the US and Canada.',
    body: [
      'The first round of concert dates is here, with more shows to be announced soon! Tickets went on sale Friday, Nov 20th at 10am local time.',
      'From California and Nevada to the Midwest, East Coast, Welcome to Rockville, Sonic Temple, and Niagara Falls — Skid Row are bringing the 40th-anniversary rebellion back to the stage with new frontman Justin Sargent.',
    ],
    ctaLabel: 'See Full 2027 Schedule',
    ctaUrl: '/tour',
    tags: ['Skid Row', '2027', 'Tour'],
  },
  {
    slug: 'skid-row-set-to-perform-at-welcome-to-rockville-festival-may-2027',
    title: 'Skid Row Set To Perform at Welcome To Rockville Festival May 2027!',
    date: 'Nov 4, 2026',
    isoDate: '2026-11-04',
    readTime: '1 min read',
    category: 'Tour',
    image: '/images/news/rockville-2027.png',
    excerpt:
      'Another day, another festival! Daytona Beach, FL — Skid Row will storm the Welcome To Rockville stage on May 9th, 2027.',
    body: [
      'Another day, another festival! Daytona Beach, FL — Skid Row will be performing at The Welcome To Rockville Festival.',
      'Mark your calendars for May 9th, 2027 and grab your festival passes now. Don\'t miss out!',
    ],
    ctaLabel: 'Get Rockville Passes',
    ctaUrl: 'https://welcometorockville.com',
    tags: ['Welcome To Rockville', 'Daytona Beach', 'Festival', '2027'],
  },
  {
    slug: 'skid-row-to-perform-at-sonic-temple-festival-2027',
    title: 'Skid Row to Perform at Sonic Temple Festival 2027',
    date: 'Nov 3, 2026',
    isoDate: '2026-11-03',
    readTime: '1 min read',
    category: 'Tour',
    image: '/images/news/sonic-temple-2027.png',
    excerpt:
      'Skid Row is heading to Columbus, Ohio for Sonic Temple Art & Music Festival on Friday, May 14, 2027.',
    body: [
      'Skid Row is heading to Columbus, Ohio, for Sonic Temple Art & Music Festival 2027!',
      'Catch the band live on Friday, May 14, 2027, as part of one of America\'s biggest rock and metal festivals, bringing together some of the biggest names in rock music for an unforgettable weekend.',
      'Date: May 14, 2027 • Location: Columbus, Ohio. Get your passes now and we\'ll see you at Sonic Temple!',
    ],
    ctaLabel: 'Get Sonic Temple Passes',
    ctaUrl: 'https://sonictemplefestival.com',
    tags: ['Sonic Temple', 'Columbus', 'Festival', '2027'],
  },
  {
    slug: 'skid-row-won-t-get-fooled-again-credits-and-lyrics',
    title: "Skid Row — 'Won't Get Fooled Again' Credits & Lyrics",
    date: 'Nov 3, 2026',
    isoDate: '2026-11-03',
    readTime: '2 min read',
    category: 'Music',
    image: '/images/albums/wont-get-fooled-again.jpg',
    excerpt:
      'Full recording credits, Nashville Rock Falcon Studio personnel, and official lyrics for Skid Row\'s powerhouse rendition of "Won\'t Get Fooled Again."',
    body: [
      'Side A: Won\'t Get Fooled Again — Performed by SKID ROW: Justin Sargent (Lead Vocals), Rachel Bolan (Bass, Backing Vocals), Snake Sabo (Guitar, Backing Vocals), Scotti Hill (Guitar, Backing Vocals), and Rob Hammersmith (Drums).',
      'Produced by Nick Raskulinecz. Engineered by Nick Raskulinecz and Matt Hyde. Recorded at Rock Falcon Studio, Nashville TN. Mixed and Mastered by John Spiker. Art Design and Concept by Rachel Bolan.',
      'Written by Pete Townshend (GMR). Published by Spirit One Music Crescendo on behalf of Towser Tunes, Fabulous Music Ltd, ABKO Music Inc. Full song lyrics are available right inside our Music Vault.',
    ],
    ctaLabel: 'Read Full Lyrics & Stream',
    ctaUrl: '/music/wont-get-fooled-again',
    tags: ['Credits', 'Lyrics', "Won't Get Fooled Again", 'Justin Sargent'],
  },
  {
    slug: 'music-radar-first-interview-w-justin-sargent',
    title: 'MusicRadar Exclusive: First Interview with Justin Sargent & Rachel Bolan',
    date: 'Oct 30, 2026',
    isoDate: '2026-10-30',
    readTime: '1 min read',
    category: 'Solo / Press',
    image: '/images/hero-band.jpg',
    excerpt:
      'To celebrate this new milestone in Skid Row\'s career, Justin Sargent speaks first to MusicRadar before bassist and founder Rachel Bolan tells the band\'s side.',
    body: [
      'To celebrate this new milestone in Skid Row\'s career, new lead vocalist Justin Sargent speaks first to MusicRadar — before bassist and founding member Rachel Bolan shares how the band knew instantly they had found their guy.',
      'Read the full exclusive interview on MusicRadar now.',
    ],
    ctaLabel: 'Read Interview on MusicRadar',
    ctaUrl:
      'https://www.musicradar.com/artists/rachel-said-ive-got-one-question-how-would-you-like-to-be-the-next-singer-of-skid-row-i-was-like-oh-my-god-yeah-exclusive-hard-rock-legends-skid-row-reveal-their-new-frontman-with-a-version-of-the-whos-most-explosive-anthem',
    tags: ['Press', 'MusicRadar', 'Justin Sargent', 'Rachel Bolan'],
  },
  {
    slug: 'won-t-get-fooled-again-is-out-now',
    title: '“WON’T GET FOOLED AGAIN” IS OUT NOW',
    date: 'Oct 30, 2026',
    isoDate: '2026-10-30',
    readTime: '1 min read',
    category: 'Music',
    image: '/images/news/wgfa-vinyl.jpg',
    excerpt:
      'Skid Row\'s take on The Who\'s classic anthem featuring Justin Sargent is streaming everywhere — plus a limited-edition autographed 7" vinyl + poster.',
    body: [
      'SKID ROW\'s take on THE WHO\'s classic anthem featuring new frontman Justin Sargent is officially available on all streaming platforms.',
      'The track marks the beginning of a new chapter for SKID ROW, 40 years after it all began. And for vinyl collectors, a limited-edition band-autographed 7" single + poster is available to order now.',
    ],
    ctaLabel: 'Stream & Order 7" Vinyl',
    ctaUrl: 'https://skidrow.lnk.to/WontGetFooledAgain',
    tags: ['New Music', "Won't Get Fooled Again", 'Vinyl', '2026'],
  },
  {
    slug: 'skid-row-announces-new-lead-singer-justin-sargent',
    title: 'SKID ROW ANNOUNCES NEW LEAD SINGER JUSTIN SARGENT',
    date: 'Oct 29, 2026',
    isoDate: '2026-10-29',
    readTime: '4 min read',
    category: 'Band News',
    image: '/images/hero-band.jpg',
    excerpt:
      'Celebrating 40 years with a new frontman, new music, and a return to the stage — Skid Row welcomes New Jersey powerhouse Justin Sargent.',
    body: [
      'October 29, 2026 — A new chapter begins for SKID ROW. After more than two years away from the stage and an extensive global search, legendary hard rock band SKID ROW has officially announced JUSTIN SARGENT as its new lead singer, ushering in an exciting new era as the band celebrates its 40th anniversary. In a fitting twist of fate, after searching around the world, Skid Row found its new voice right where it all began — in their home state of New Jersey.',
      '“Honestly, for me, it felt like he had been here from the beginning as soon as he walked in the room. He was one of us. A lifer. Then he sang with so much power and conviction, it blew me away. It was amazing.” — Rachel Bolan',
      '“The moment Justin walked in the door we all kind of knew he was the guy. Everything about him; his voice, his attitude, his demeanor, it all just fit. We can\'t wait to hit the ground running and get back to doing what we love to do.” — Snake Sabo',
      '“I\'ve been singing Skid Row songs for years, but never imagined I\'d actually be joining the band! It\'s an incredible honor to be part of something with such a legendary history. I can\'t wait to get out there, connect with the fans, and give them everything I\'ve got. Let\'s go!” — Justin Sargent',
      'To celebrate the announcement, Skid Row unleashed a powerhouse rendition of The Who\'s "Won\'t Get Fooled Again," produced by Grammy Award-winning producer Nick Raskulinecz with an electrifying music video directed by Dale "Rage" Resteghini.',
    ],
    ctaLabel: 'Watch Official Music Video',
    ctaUrl: '/videos',
    tags: ['Justin Sargent', '40th Anniversary', 'Band News'],
  },
  {
    slug: 'special-skid-row-release-coming-for-record-store-day-november-27',
    title: 'Record Store Day Exclusive: Moscow Music Peace Festival Picture Disc',
    date: 'Oct 21, 2026',
    isoDate: '2026-10-21',
    readTime: '1 min read',
    category: 'Music',
    image: '/images/news/rsd-moscow.jpg',
    excerpt:
      'For the first time ever, songs from Skid Row\'s iconic 1989 Moscow Music Peace Festival live set arrive on limited-edition picture disc vinyl on November 27.',
    body: [
      'We\'re psyched to have a special Skid Row release coming for Record Store Day Black Friday on November 27!',
      'For the first time ever, songs from our live set at the iconic Moscow Music Peace Festival will be released on special-edition picture disc vinyl — marking Skid Row\'s first-ever Record Store Day release in support of independent record stores.',
    ],
    ctaLabel: 'Find a Participating Record Store',
    ctaUrl: 'https://recordstoreday.com/',
    tags: ['Record Store Day', 'Vinyl', 'Moscow Music Peace Festival'],
  },
  {
    slug: '40-seasons-the-best-of-skid-row-remastered-vinyl',
    title: '“40 Seasons: The Best of Skid Row” Returns Remastered + First Time on Vinyl',
    date: 'Sep 29, 2026',
    isoDate: '2026-09-29',
    readTime: '2 min read',
    category: 'Music',
    image: '/images/news/40-seasons-vinyl.png',
    excerpt:
      'Celebrating 40 years of Skid Row — BMG and Rhino Entertainment release 40 Seasons newly remastered on vinyl for the very first time and on CD.',
    body: [
      'Skid Row celebrates the 40th anniversary of the band\'s formation with 40 Seasons: The Best of Skid Row — newly remastered and available on vinyl for the very first time, as well as on CD via BMG in partnership with Rhino Entertainment.',
      'Featuring definitive anthems including "Youth Gone Wild," "18 and Life," "I Remember You," and "Slave to the Grind."',
    ],
    ctaLabel: 'Pre-Order / Stream 40 Seasons',
    ctaUrl: 'https://skidrow.lnk.to/40SRPR',
    tags: ['40 Seasons', 'Vinyl', 'Remaster', 'BMG'],
  },
  {
    slug: 'rachel-bolan-debut-solo-album-gargoyle-of-the-garden-state-out-now',
    title: 'Rachel Bolan Unleashes Solo Debut “Gargoyle of the Garden State”',
    date: 'Jun 12, 2026',
    isoDate: '2026-06-12',
    readTime: '2 min read',
    category: 'Solo / Press',
    image: '/images/news/bolan-solo.jpg',
    excerpt:
      'After four decades as a driving force behind Skid Row, Rachel Bolan steps forward under the name BOLAN with his deeply personal solo debut.',
    body: [
      'Skid Row\'s Rachel Bolan unleashes his solo debut album, "Gargoyle of the Garden State," out now everywhere under the name BOLAN.',
      'Produced by Nick Raskulinecz, the album is Bolan at his most honest — rooted in the grit, attitude, and storytelling spirit of his New Jersey upbringing.',
    ],
    ctaLabel: 'Stream & Order Vinyl / CD',
    ctaUrl: 'https://bolan.lnk.to/GargoyleoftheGardenState',
    tags: ['Rachel Bolan', 'Solo Album', 'BOLAN'],
  },
  {
    slug: 'rachel-bolan-releases-single-video-memory',
    title: 'Rachel Bolan Releases New Single & Video “Memory”',
    date: 'May 20, 2026',
    isoDate: '2026-05-20',
    readTime: '1 min read',
    category: 'Solo / Press',
    image: '/images/news/bolan-solo.jpg',
    excerpt:
      'Another powerful preview of Gargoyle of the Garden State — written by Rachel Bolan and produced by Nick Raskulinecz.',
    body: [
      'Rachel Bolan returns with the release of his single "Memory," offering another powerful preview of Gargoyle of the Garden State.',
      'Written by Bolan and produced by Nick Raskulinecz, the track showcases Bolan\'s raw songwriting approach and multi-instrumental firepower.',
    ],
    tags: ['Rachel Bolan', 'Memory', 'New Music'],
  },
  {
    slug: 'rachel-bolan-live-on-talkshoplive',
    title: 'Rachel Bolan Live on TalkShopLive Talking Skid Row & Solo Debut',
    date: 'May 15, 2026',
    isoDate: '2026-05-15',
    readTime: '1 min read',
    category: 'Solo / Press',
    image: '/images/news/talkshoplive.jpg',
    excerpt:
      'Rachel goes live on TalkShopLive to discuss Skid Row\'s legacy, signed editions, and his debut solo record.',
    body: [
      'Tune in as Rachel Bolan goes live on TalkShopLive talking all things Skid Row and his debut solo album Gargoyle of the Garden State.',
    ],
    ctaLabel: 'Watch on TalkShopLive',
    ctaUrl: 'https://talkshop.live/watch/44be3EcE8W0Y',
    tags: ['Rachel Bolan', 'TalkShopLive', 'Livestream'],
  },
  {
    slug: 'rachel-bolan-second-single-anything-but-you',
    title: 'Rachel Bolan Unleashes Second Single & Video “Anything But You”',
    date: 'Apr 22, 2026',
    isoDate: '2026-04-22',
    readTime: '2 min read',
    category: 'Solo / Press',
    image: '/images/news/bolan-anything.jpg',
    excerpt:
      'Following "At War With Myself," Rachel Bolan drops his hard-charging second solo single and official video.',
    body: [
      'Rachel Bolan is back with the release of his second solo single and official video, "Anything But You," taken from Gargoyle of the Garden State.',
      'Produced by Nick Raskulinecz, the single continues showcasing Bolan\'s unfiltered rock storytelling.',
    ],
    tags: ['Rachel Bolan', 'Anything But You'],
  },
  {
    slug: 'rachel-bolan-101-wrif-detroit-interview',
    title: 'New Interview: Rachel Bolan x 101 WRIF (Detroit)',
    date: 'Apr 13, 2026',
    isoDate: '2026-04-13',
    readTime: '1 min read',
    category: 'Solo / Press',
    image: 'https://i.ytimg.com/vi/uqt66kZ28cc/hqdefault.jpg',
    excerpt:
      'Rachel talks Gargoyle of the Garden State, Skid Row, Black Sabbath, and KISS with Detroit\'s 101 WRIF.',
    body: [
      'Rachel Bolan sits down with 101 WRIF Detroit to talk about his debut solo album Gargoyle of the Garden State, Skid Row\'s 40th anniversary, Black Sabbath, and KISS.',
    ],
    ctaLabel: 'Watch Interview on YouTube',
    ctaUrl: 'https://www.youtube.com/watch?v=uqt66kZ28cc',
    tags: ['Interview', 'Rachel Bolan', '101 WRIF'],
  },
  {
    slug: 'rachel-bolan-announces-solo-album-at-war-with-myself',
    title: 'Rachel Bolan Announces Solo Album + Single “At War With Myself” Feat. Danko Jones',
    date: 'Mar 25, 2026',
    isoDate: '2026-03-25',
    readTime: '2 min read',
    category: 'Solo / Press',
    image: '/images/news/bolan-war.jpg',
    excerpt:
      'Skid Row bassist Rachel Bolan announces his solo debut as BOLAN alongside lead single "At War With Myself" featuring Danko Jones.',
    body: [
      'After four decades as the driving force behind Skid Row, Rachel Bolan announces his first-ever solo album under the name BOLAN — Gargoyle of the Garden State — kicked off by lead single "At War With Myself" featuring Danko Jones.',
    ],
    tags: ['Rachel Bolan', 'Danko Jones', 'BOLAN'],
  },
  {
    slug: 'skid-row-partners-with-sweetwater-worldwide-vocalist-search',
    title: 'Skid Row Partners With Sweetwater for Worldwide Lead Vocalist Search',
    date: 'Feb 5, 2026',
    isoDate: '2026-02-05',
    readTime: '2 min read',
    category: 'Band News',
    image: '/images/hero-band.jpg',
    excerpt:
      'Marking 40 years of rebellion, Skid Row teams up with Sweetwater to invite vocalists worldwide to audition for the next chapter.',
    body: [
      'Legendary hard rock band Skid Row announced a first-of-its-kind partnership with Sweetwater, the world\'s leading online retailer of musical instruments and pro-audio equipment, inviting singers across the globe to audition for the next chapter of Skid Row.',
      'The global search drew overwhelming submissions from around the world — ultimately leading Skid Row right back to New Jersey and new frontman Justin Sargent.',
    ],
    tags: ['Sweetwater', 'Vocalist Search', '40th Anniversary'],
  },
  {
    slug: 'rachel-bolan-nashville-on-the-rocks-podcast',
    title: 'Rachel Bolan Talks Skid Row & Songwriting on Nashville On The Rocks',
    date: 'Sep 23, 2025',
    isoDate: '2025-09-23',
    readTime: '1 min read',
    category: 'Solo / Press',
    image: 'https://i.ytimg.com/vi/O958vCxVboo/hqdefault.jpg',
    excerpt:
      'An in-depth conversation covering songwriting craft, Skid Row history, and road stories on the Nashville On The Rocks Podcast.',
    body: [
      'Rachel Bolan sat down for an in-depth conversation on the Nashville On The Rocks Podcast covering songwriting, studio stories, and four decades of Skid Row.',
    ],
    ctaLabel: 'Watch Podcast on YouTube',
    ctaUrl: 'https://www.youtube.com/watch?v=O958vCxVboo',
    tags: ['Podcast', 'Rachel Bolan', 'Interview'],
  },
  {
    slug: 'revolutions-per-minute-remastered-reissue',
    title: 'Skid Row’s ‘Revolutions Per Minute’ Returns: Remastered Vinyl, CD & Digital',
    date: 'Jun 20, 2025',
    isoDate: '2025-06-20',
    readTime: '2 min read',
    category: 'Music',
    image: '/images/news/rpm-reissue.jpg',
    excerpt:
      'Skid Row\'s hard-hitting 2006 album Revolutions Per Minute returns newly remastered on vinyl, CD, and streaming platforms.',
    body: [
      'Crank it up and relive the chaos — Skid Row\'s hard-hitting 2006 album Revolutions Per Minute returns newly remastered across vinyl, CD, and digital platforms.',
    ],
    ctaLabel: 'Stream Revolutions Per Minute',
    ctaUrl: 'https://ffm.to/revolutionsperminute',
    tags: ['Revolutions Per Minute', 'Reissue', 'Vinyl'],
  },
];
