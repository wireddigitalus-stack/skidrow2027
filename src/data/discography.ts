export interface TrackLyric {
  number: number;
  title: string;
  writers?: string;
  lyrics?: string;
}

export interface Album {
  slug: string;
  title: string;
  year: number;
  type: 'Single' | 'Studio' | 'Live' | 'Compilation' | 'EP';
  cover: string;
  listenUrl: string;
  badge?: string;
  description: string;
  credits?: string[];
  tracks?: TrackLyric[];
}

export const DISCOGRAPHY: Album[] = [
  {
    slug: 'wont-get-fooled-again',
    title: "Won't Get Fooled Again",
    year: 2026,
    type: 'Single',
    cover: '/images/albums/wont-get-fooled-again.jpg',
    listenUrl: 'https://skidrow.lnk.to/WontGetFooledAgain',
    badge: 'New Single',
    description:
      'Skid Row\'s explosive cover of The Who\'s classic anthem introducing new frontman Justin Sargent — produced by Nick Raskulinecz at Rock Falcon Studio in Nashville, TN.',
    credits: [
      'Justin Sargent – Lead Vocals',
      'Rachel Bolan – Bass, Backing Vocals',
      'Snake Sabo – Guitar, Backing Vocals',
      'Scotti Hill – Guitar, Backing Vocals',
      'Rob Hammersmith – Drums',
      'Produced by Nick Raskulinecz • Engineered by Nick Raskulinecz & Matt Hyde',
      'Mixed & Mastered by John Spiker • Art Design & Concept – Rachel Bolan',
    ],
    tracks: [
      {
        number: 1,
        title: "Won't Get Fooled Again",
        writers: 'Pete Townshend',
        lyrics: `We'll be fighting in the streets
With our children at our feet
And the morals that they worship will be gone
And the men who spurred us on
Sit in judgment of all wrong
They decide, and the shotgun sings the song

I'll tip my hat to the new constitution
Take a bow for the new revolution
Smile and grin at the change all around
Pick up my guitar and play
Just like yesterday
Then I'll get on my knees and pray
We don't get fooled again

The change, it had to come
We knew it all along
We were liberated from the fold, that's all
And the world looks just the same
And history ain't changed
'Cause the banners, they all flown in the last war

I'll tip my hat to the new constitution
Take a bow for the new revolution
Smile and grin at the change all around
Pick up my guitar and play
Just like yesterday
Then I'll get on my knees and pray
We don't get fooled again
No, no (no, no)

I'll move myself and my family aside
If we happen to be left half-alive
I'll get all my papers and smile at the sky
Though I know that the hypnotized never lie
Do you? (Do you?)
Yeah!

There's nothing in the streets
Looks any different to me
And the slogans are replaced, by-the-bye
And the parting on the left
Are now the parting on the right
And the beards have all grown longer overnight

I'll tip my hat to the new constitution
Take a bow for the new revolution
Smile and grin at the change all around
Pick up my guitar and play
Just like yesterday
Then I'll get on my knees and pray
We don't get fooled again

Don't get fooled again, no, no (no, no)
Yeah, yeah
Meet the new boss
Same as the old boss
Yeah, yeah
We won't get fooled again`,
      },
    ],
  },
  {
    slug: 'live-in-london',
    title: 'Live In London',
    year: 2024,
    type: 'Live',
    cover: '/images/albums/live-in-london.webp',
    listenUrl: 'https://skidrow.lnk.to/liveinlondon',
    badge: 'Live Album',
    description:
      'Captured live at London\'s iconic O2 Forum Kentish Town — Skid Row\'s first official live album and concert film, roaring through classics and modern favorites.',
    tracks: [
      { number: 1, title: 'Slave to the Grind (Live)' },
      { number: 2, title: 'The Threat (Live)' },
      { number: 3, title: 'Big Guns (Live)' },
      { number: 4, title: '18 and Life (Live)' },
      { number: 5, title: 'Piece of Me (Live)' },
      { number: 6, title: 'Livin\' on a Chain Gang (Live)' },
      { number: 7, title: 'Psycho Therapy (Live)' },
      { number: 8, title: 'In a Darkened Room (Live)' },
      { number: 9, title: 'Makin\' a Mess (Live)' },
      { number: 10, title: "The Gang's All Here (Live)" },
      { number: 11, title: 'Riot Act (Live)' },
      { number: 12, title: 'Tear It Down (Live)' },
      { number: 13, title: 'Monkey Business (Live)' },
      { number: 14, title: 'I Remember You (Live)' },
      { number: 15, title: 'Time Bomb (Live)' },
      { number: 16, title: 'Youth Gone Wild (Live)' },
    ],
  },
  {
    slug: 'the-gangs-all-here',
    title: "The Gang's All Here",
    year: 2022,
    type: 'Studio',
    cover: '/images/albums/the-gangs-all-here.avif',
    listenUrl: 'https://skidrow.lnk.to/TheGangsAllHereAlbum',
    description:
      'Produced by Nick Raskulinecz (Foo Fighters, Rush, Alice In Chains), Skid Row\'s sixth full-length studio album roared back to global rock charts.',
    tracks: [
      { number: 1, title: 'Hell or High Water' },
      { number: 2, title: "The Gang's All Here" },
      { number: 3, title: 'Not Dead Yet' },
      { number: 4, title: 'Time Bomb' },
      { number: 5, title: 'Resurrected' },
      { number: 6, title: 'Nowhere Fast' },
      { number: 7, title: 'When the Lights Come On' },
      { number: 8, title: 'Tear It Down' },
      { number: 9, title: 'October\'s Song' },
      { number: 10, title: 'World on Fire' },
    ],
  },
  {
    slug: 'united-world-rebellion-chapter-one',
    title: 'United World Rebellion: Chapter One',
    year: 2013,
    type: 'EP',
    cover: '/images/albums/united-world-rebellion-ch1.jpg',
    listenUrl: 'https://ffm.to/unitedworldrebellion',
    description:
      'First installment of the United World Rebellion EP trilogy, spearheaded by "Kings of Demolition" and "Let\'s Go."',
  },
  {
    slug: 'rise-of-the-damnation-army',
    title: 'Rise of the Damnation Army — United World Rebellion: Chapter Two',
    year: 2014,
    type: 'EP',
    cover: '/images/albums/rise-of-the-damnation-army.jpg',
    listenUrl: 'https://ffm.to/unitedworldrebellion2',
    description:
      'Chapter Two of the United World Rebellion series featuring "We Are the Damned" and "Give It the Gun."',
  },
  {
    slug: 'revolutions-per-minute',
    title: 'Revolutions Per Minute',
    year: 2006,
    type: 'Studio',
    cover: '/images/albums/revolutions-per-minute.jpg',
    listenUrl: 'https://ffm.to/revolutionsperminute',
    description:
      'Hard-hitting punk-tinged fifth studio album produced by Michael Wagener — newly remastered and reissued on vinyl, CD, and digital.',
  },
  {
    slug: '40-seasons-best-of',
    title: '40 Seasons: The Best of Skid Row',
    year: 1998,
    type: 'Compilation',
    cover: '/images/albums/40-seasons.jpg',
    listenUrl: 'https://skidrow.lnk.to/40SRPR',
    badge: '2026 Remaster',
    description:
      'The definitive career-spanning anthology featuring "Youth Gone Wild," "18 and Life," "I Remember You," and "Slave to the Grind" — newly remastered and pressed to vinyl for the first time in 2026.',
  },
  {
    slug: 'thickskin',
    title: 'Thickskin',
    year: 2003,
    type: 'Studio',
    cover: '/images/albums/thickskin.jpg',
    listenUrl: 'https://ffm.to/skidrowthickskin',
    description:
      'Raw, stripped-down fourth studio album marking Skid Row\'s fierce return in the new millennium.',
  },
  {
    slug: 'subhuman-race',
    title: 'Subhuman Race',
    year: 1995,
    type: 'Studio',
    cover: '/images/albums/subhuman-race.png',
    listenUrl: 'https://ffm.to/subhumanrace',
    description:
      'Produced by Bob Rock — a heavy, blistering sonic evolution led by "My Enemy," "Breakin\' Down," and "Into Another."',
  },
  {
    slug: 'b-side-ourselves',
    title: 'B-Side Ourselves',
    year: 1992,
    type: 'EP',
    cover: '/images/albums/b-side-ourselves.jpg',
    listenUrl: 'https://ffm.to/bsideourselves',
    description:
      'Gold-certified 5-song covers EP paying tribute to Ramones, Kiss, Judas Priest, Rush, and Jimi Hendrix.',
  },
  {
    slug: 'slave-to-the-grind',
    title: 'Slave to the Grind',
    year: 1991,
    type: 'Studio',
    cover: '/images/albums/slave-to-the-grind.jpg',
    listenUrl: 'https://ffm.to/slavetothegrind',
    badge: '#1 Billboard',
    description:
      'The first heavy metal album in history to debut at #1 on the Billboard 200 — powered by "Monkey Business," "Slave to the Grind," "Quicksand Jesus," and "Wasted Time."',
    tracks: [
      { number: 1, title: 'Monkey Business' },
      { number: 2, title: 'Slave to the Grind' },
      { number: 3, title: 'The Threat' },
      { number: 4, title: 'Quicksand Jesus' },
      { number: 5, title: 'Psycho Love' },
      { number: 6, title: 'Get the Fuck Out' },
      { number: 7, title: 'Livin\' on a Chain Gang' },
      { number: 8, title: 'Creepshow' },
      { number: 9, title: 'In a Darkened Room' },
      { number: 10, title: 'Riot Act' },
      { number: 11, title: 'Mudkicker' },
      { number: 12, title: 'Wasted Time' },
    ],
  },
  {
    slug: 'skid-row-1989',
    title: 'Skid Row',
    year: 1989,
    type: 'Studio',
    cover: '/images/albums/skid-row-1989.png',
    listenUrl: 'https://ffm.to/skidrowalbum',
    badge: '5x Platinum',
    description:
      'Released January 24, 1989 — the multi-platinum self-titled debut that ignited the rebellion with "18 and Life," "Youth Gone Wild," and "I Remember You."',
    tracks: [
      {
        number: 1,
        title: 'Big Guns',
        writers: 'Bolan, Hill, Snake, Affuso',
        lyrics: `She was a ballerina on a subway train
Stiletto heels and a candy cane
Looked like a number on a station wall
Hot on the tail of a social call

I wet my lips I thought I had it made
Like Valentino with a hand grenade
I made my move with my libido on
She circled once and then she dropped the bomb

She got the big guns
Pointed at my heart
Bang bang shooting like a firing squad
Big guns
Blew me away
And I went down in flames

I met a sidewalk preacher on a roller skate
He said he had the key to heaven's gate
I said: "I'll wait for the movie 'cause I been there before"
And learned: life is a battle and love is war

She got the big guns
Pointed at my heart
Bang bang shooting like a firing squad
Big guns
Took me by surprise
She got my lovin' reachin' for the sky`,
      },
      {
        number: 2,
        title: 'Sweet Little Sister',
        writers: 'Bolan, Snake',
        lyrics: `She blew my mind behind the wrecking machine
She was a shitload of trouble called the Subway Queen
Had a hip with bad habits and a shake that was a bit obscene

One night I caught her running out the cellar door
There was about a million people lying flat on the floor
For such a sweet little lady I would swear she's rotten to the core

She got her hands in the cookie jar
Smiling like an alligator
Makin' headlines in the back of her car
Tight-lipped now but sink ships later

I know a thing or two about -- sweet little sister
Her mama kill her if she knew what she do -- sweet little sister
She'll love ya black and blue -- sweet little sister
Mona Lisa with a new tattoo
She's my sweet little -- sweet little sister`,
      },
      {
        number: 3,
        title: "Can't Stand the Heartache",
        writers: 'Bolan',
        lyrics: `Fall in love with a twisted lady
Suicide with a cover girl
Spent all your time then you got stuck paying the price

Uptown, kick it down, into a spin
Face the wall, take it all, you just can't win

Can't stand the heartache
So bleeds the red, red rose
Time heals a broken heart
But that's just the way it goes
Can't stand, can't stand the heartache

You got caught in the line of fire
Bystander innocence
You held your own till it wasn't yours anymore

Waste away another day into the night
You're at home by the phone, it don't seem right`,
      },
      {
        number: 4,
        title: 'Piece of Me',
        writers: 'Bolan',
        lyrics: `Sleazin' in the city
Lookin' for a fight
Got my heels and lookin' pretty
On a Saturday night, night, night

Good God, bless my soul
I need a fix of rock 'n roll
Come on baby you gotta wait and see
You better hurry
To get a piece of me

Caught a lonely lady
Crying on a cigarette
I got nasty, nasty habits
And that's all she's gonna get

One for the money, two for the show
So 'round and 'round and 'round we go
Take a look at what-a you might need
You better hurry
To get a piece of me`,
      },
      {
        number: 5,
        title: '18 and Life',
        writers: 'Bolan, Snake',
        lyrics: `Ricky was a young boy, he had a heart of stone.
Lived 9 to 5 and worked his fingers to the bone.
Just barely got out of school, came from the edge of town.
Fought like a switchblade so no one could take him down.
He had no money, oooh no good at home.
He walked the streets a soldier and he fought the world alone
And now it's

18 and life you got it
18 and life you know
Your crime is time and it's
18 and life to go

Tequila in his heartbeat, his veins burned gasoline.
It kept his motor running but it never kept him clean.
They say he loved adventure, "Ricky's the wild one."
He married trouble and had a courtship with a gun.
Bang Bang shoot 'em up, the party never ends.
You can't think of dying when the bottle's your best friend

"Accidents will happen" they all heard Ricky say
He fired his six-shot to the wind — that child blew a child away.`,
      },
      {
        number: 6,
        title: 'Rattlesnake Shake',
        writers: 'Bolan, Snake',
        lyrics: `Tricky little Vicky walks along South Street
She learned her French from the boys that she'd meet
I gotta laugh when I hear them say
She's a sweet little cheese when the cat's away

I know what you been trying
What you got ain't worth buying
Can't make living working door to door

Shake, shake, shake it like a rattlesnake
Boom, boom baby out go the lights
Shake, shake, shake it like a rattlesnake
Staying up late doing the rattlesnake shake`,
      },
      {
        number: 7,
        title: 'Youth Gone Wild',
        writers: 'Bolan, Snake',
        lyrics: `Since I was born they couldn't hold me down
Another misfit kid, another burned-out town
Never played by the rules I never really cared
My nasty reputation takes me everywhere

I look and see it's not only me
So many others have stood where I stand
We are the young so raise your hands

They call us problem child
We spend our lives on trial
We walk an endless mile
We are the youth gone wild
We stand and we won't fall
We're the one and one for all
The writing's on the wall
We are the youth gone wild

Boss screamin' in my ear about who I'm supposed to be
Getcha a 3-piece Wall Street smile and son you'll look just like me
I said "Hey man, there's something that you oughta know.
I tell ya Park Avenue leads to Skid Row."`,
      },
      {
        number: 8,
        title: 'Here I Am',
        writers: 'Bolan, Snake',
        lyrics: `Six foot one and lonely
Dressed in spaghetti rags
Standing at the bus stop
With her alligator bags

What can you do?
No, no, no, what can I do
I better see a doctor
'Cause I think I'm getting hooked on you

Here I am
Close your eyes and I'll be Superman
Here I am
Come and take my lovin' while you can`,
      },
      {
        number: 9,
        title: "Makin' a Mess",
        writers: 'Bach, Bolan, Snake',
        lyrics: `T-bone Billy just a singin' the blues
Caught his lady with another man
Lit up a smoke and did some talkin'
With the back of his hand

Sing for your supper,
Nobody rides for free
Eat your heart out, I'll send it C.O.D.

One, two baby what you do
Three, four let me show you the door
You're better off dead than makin' a mess of me
Five, six take your last licks
Seven, eight let me give it to you straight
You're better off dead than makin' a mess of me`,
      },
      {
        number: 10,
        title: 'I Remember You',
        writers: 'Bolan, Snake',
        lyrics: `Woke up to the sound of pouring rain
The wind would whisper and I'd think of you
And all the tears you cried, that called my name
And when you needed me I came through

I paint a picture of the days gone by
When love went blind and you would make me see
I'd stare a lifetime into your eyes
So that I knew that you were there for me
Time after time you were there for me

Remember yesterday — walking hand in hand
Love letters in the sand — I remember you
Through the sleepless nights through every endless day
I'd wanna hear you say — I remember you

We spend the summer with the top rolled down
Wished ever after would be like this
You said I love you babe, without a sound
I said I'd give my life for just one kiss
I'd live for your smile and die for your kiss`,
      },
      {
        number: 11,
        title: 'Midnight / Tornado',
        writers: 'Fallon, Snake',
        lyrics: `The night approaches, after dark you have no chance
Ooh, when moonlight takes the sky, you'll feel my dark romance
I'm on your footsteps and I wait behind your back
I spread like fire upon the streets I'm ready to attack

I'm the only thing you need
Upon your love I feed

When the clock strikes midnight
I'm on the prowl of love
When the clock strikes midnight
The time is right to call you out`,
      },
    ],
  },
];
