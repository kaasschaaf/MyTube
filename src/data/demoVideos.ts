import { Channel, Video } from '../types';
import { formatDuration, formatRelativeTime } from '../utils/duration';

export const DEMO_CHANNELS: Channel[] = [
  {
    id: 'UC6nSFpj9HTCZ5t-N3Rm3-HA',
    title: 'Veritasium',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    customUrl: '@veritasium',
    isFavorite: true,
    isMuted: false,
    subscriberCount: '15.8M',
    tags: ['Science', 'Education'],
  },
  {
    id: 'UCBJycsmduvYEL83R_U4JriQ',
    title: 'MKBHD',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    customUrl: '@mkbhd',
    isFavorite: true,
    isMuted: false,
    subscriberCount: '18.9M',
    tags: ['Tech', 'Reviews'],
  },
  {
    id: 'UCsXVk37bltHxD1rDPwtNM8Q',
    title: 'Kurzgesagt – In a Nutshell',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80',
    customUrl: '@kurzgesagt',
    isFavorite: true,
    isMuted: false,
    subscriberCount: '22.4M',
    tags: ['Animation', 'Science'],
  },
  {
    id: 'UCsBjURrPoezykLs9EqgamOA',
    title: 'Fireship',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    customUrl: '@fireship',
    isFavorite: true,
    isMuted: false,
    subscriberCount: '3.2M',
    tags: ['Code', 'Tech'],
  },
  {
    id: 'UCtweakers',
    title: 'Tweakers',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    customUrl: '@tweakers',
    isFavorite: false,
    isMuted: false,
    subscriberCount: '155K',
    tags: ['Tech', 'Dutch'],
  },
  {
    id: 'UCnosop3',
    title: 'NOS op 3',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80',
    customUrl: '@nosop3',
    isFavorite: true,
    isMuted: false,
    subscriberCount: '890K',
    tags: ['News', 'Dutch'],
  },
  {
    id: 'UCcleoabram',
    title: 'Cleo Abram',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    customUrl: '@cleoabram',
    isFavorite: false,
    isMuted: false,
    subscriberCount: '2.1M',
    tags: ['Innovation', 'Tech'],
  },
  {
    id: 'UCcoldfusion',
    title: 'ColdFusion',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    customUrl: '@coldfusion',
    isFavorite: false,
    isMuted: false,
    subscriberCount: '4.8M',
    tags: ['Documentaries', 'Business'],
  },
];

// Helper to generate a date N hours ago
const hoursAgo = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const DEMO_VIDEOS_RAW: Omit<Video, 'durationFormatted' | 'publishedRelative'>[] = [
  {
    id: 'bHIhgxav9LY',
    title: 'How Fusion Energy Actually Works (And Why It Matters)',
    channelId: 'UCcleoabram',
    channelTitle: 'Cleo Abram',
    channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 885, // 14:45 (perfect for <= 15 min!)
    publishedAt: hoursAgo(2),
    viewCount: '480K views',
    isWatched: false,
    isFavoriteChannel: false,
  },
  {
    id: 'cuijBqLz_cE',
    title: '10 Code Smells That Immediately Disqualify You as a Junior Dev',
    channelId: 'UCsBjURrPoezykLs9EqgamOA',
    channelTitle: 'Fireship',
    channelAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 275, // 4:35 (fits <= 5 min!)
    publishedAt: hoursAgo(4),
    viewCount: '920K views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: 'oxXpB9pSETo',
    title: 'Why The Universe is Not Locally Real (Nobel Prize in Physics)',
    channelId: 'UC6nSFpj9HTCZ5t-N3Rm3-HA',
    channelTitle: 'Veritasium',
    channelAvatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 852, // 14:12 (fits <= 15 min!)
    publishedAt: hoursAgo(7),
    viewCount: '3.4M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: '9lB61gPzKzs',
    title: 'What Really Happens When AI Takes All Our Jobs',
    channelId: 'UCnosop3',
    channelTitle: 'NOS op 3',
    channelAvatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 580, // 9:40 (fits <= 10 min & <= 15 min)
    publishedAt: hoursAgo(10),
    viewCount: '210K views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: '7Pq-S557XQU',
    title: 'What If We Detonated Every Single Nuclear Weapon At Once?',
    channelId: 'UCsXVk37bltHxD1rDPwtNM8Q',
    channelTitle: 'Kurzgesagt – In a Nutshell',
    channelAvatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 615, // 10:15
    publishedAt: hoursAgo(14),
    viewCount: '8.1M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: '3YgO8hF6b7Q',
    title: 'De Beste Smart-TV van 2026: OLED vs Mini-LED Shootout',
    channelId: 'UCtweakers',
    channelTitle: 'Tweakers',
    channelAvatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 785, // 13:05 (fits <= 15 min!)
    publishedAt: hoursAgo(18),
    viewCount: '95K views',
    isWatched: false,
    isFavoriteChannel: false,
  },
  {
    id: 'YRhUZmszVvU',
    title: 'M3 Ultra Mac Studio: The Review We Waited 18 Months For',
    channelId: 'UCBJycsmduvYEL83R_U4JriQ',
    channelTitle: 'MKBHD',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 1125, // 18:45 (> 15 min, <= 30 min)
    publishedAt: hoursAgo(22),
    viewCount: '2.8M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: 'r_jNpHX1U5M',
    title: 'How NVIDIA Actually Built an AI Monopoly',
    channelId: 'UCcoldfusion',
    channelTitle: 'ColdFusion',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 1695, // 28:15 (<= 30 min)
    publishedAt: hoursAgo(28),
    viewCount: '1.4M views',
    isWatched: false,
    isFavoriteChannel: false,
  },
  {
    id: 'd955n3gH9mQ',
    title: 'The Unbearable Mystery of Quantum Superposition',
    channelId: 'UC6nSFpj9HTCZ5t-N3Rm3-HA',
    channelTitle: 'Veritasium',
    channelAvatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 890, // 14:50 (fits <= 15 min!)
    publishedAt: hoursAgo(36),
    viewCount: '2.1M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: 'k62f9K6_w1E',
    title: 'Git in 100 Seconds: Every Developer Should Watch This',
    channelId: 'UCsBjURrPoezykLs9EqgamOA',
    channelTitle: 'Fireship',
    channelAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 135, // 2:15 (fits <= 5 min!)
    publishedAt: hoursAgo(42),
    viewCount: '1.9M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: 'P9tD_6l4L_s',
    title: 'The Immune System Explained: Bacterial War Inside Your Body',
    channelId: 'UCsXVk37bltHxD1rDPwtNM8Q',
    channelTitle: 'Kurzgesagt – In a Nutshell',
    channelAvatar: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 710, // 11:50 (fits <= 15 min!)
    publishedAt: hoursAgo(48),
    viewCount: '6.7M views',
    isWatched: false,
    isFavoriteChannel: true,
  },
  {
    id: 'f87N_m_8yE4',
    title: 'The Future of Home Batteries in the Netherlands (Are They Worth It?)',
    channelId: 'UCtweakers',
    channelTitle: 'Tweakers',
    channelAvatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 830, // 13:50 (fits <= 15 min!)
    publishedAt: hoursAgo(54),
    viewCount: '140K views',
    isWatched: false,
    isFavoriteChannel: false,
  },
  {
    id: 'Qj_1y8oU2Fk',
    title: 'Why The World Still Runs On Cobol (45 Minute Deep Dive)',
    channelId: 'UCcoldfusion',
    channelTitle: 'ColdFusion',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&auto=format&fit=crop&q=80',
    durationSeconds: 2740, // 45:40 (> 45 min)
    publishedAt: hoursAgo(72),
    viewCount: '980K views',
    isWatched: false,
    isFavoriteChannel: false,
  }
];

export function getDemoVideos(): Video[] {
  return DEMO_VIDEOS_RAW.map(v => ({
    ...v,
    durationFormatted: formatDuration(v.durationSeconds),
    publishedRelative: formatRelativeTime(v.publishedAt),
  }));
}
