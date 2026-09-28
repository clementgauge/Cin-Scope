import { CountryOption, WatchProvider } from '../types';

export const COUNTRIES: CountryOption[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
];

export const STREAMING_PROVIDERS: WatchProvider[] = [
  {
    id: 8,
    name: 'Netflix',
    short: 'N',
    color: '#E50914',
    bgColor: '#e5091420',
    textColor: '#ffffff',
    ids: [8, 1796],
    logoUrl: 'https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg'
  },
  {
    id: 337,
    name: 'Disney+',
    short: 'D+',
    color: '#113CCF',
    bgColor: '#113ccf25',
    textColor: '#709dff',
    ids: [337],
    logoUrl: 'https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg'
  },
  {
    id: 119,
    name: 'Prime Video',
    short: 'Prime',
    color: '#00A8E1',
    bgColor: '#00a8e120',
    textColor: '#38bdf8',
    ids: [119, 2100, 9, 10],
    logoUrl: 'https://image.tmdb.org/t/p/original/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg'
  },
  {
    id: 381,
    name: 'Canal+',
    short: 'C+',
    color: '#000000',
    bgColor: '#ffffff15',
    textColor: '#f8fafc',
    ids: [381, 382, 383],
    logoUrl: 'https://image.tmdb.org/t/p/original/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg'
  },
  {
    id: 1899,
    name: 'Max',
    short: 'Max',
    color: '#002BE7',
    bgColor: '#002be720',
    textColor: '#818cf8',
    ids: [1899, 1825, 384],
    logoUrl: 'https://image.tmdb.org/t/p/original/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg'
  },
  {
    id: 350,
    name: 'Apple TV+',
    short: 'tv+',
    color: '#A2AAAD',
    bgColor: '#ffffff15',
    textColor: '#e2e8f0',
    ids: [350],
    logoUrl: 'https://image.tmdb.org/t/p/original/2E03jvSV7P2m7gTzG1kK929p4e8.jpg'
  },
  {
    id: 531,
    name: 'Paramount+',
    short: 'P+',
    color: '#0064FF',
    bgColor: '#0064ff20',
    textColor: '#60a5fa',
    ids: [531, 582],
    logoUrl: 'https://image.tmdb.org/t/p/original/h5DcR0J2EWBFA7GQi6E394HcjMv.jpg'
  },
  {
    id: 283,
    name: 'Crunchyroll',
    short: 'CR',
    color: '#F47521',
    bgColor: '#f4752120',
    textColor: '#fb923c',
    ids: [283],
    logoUrl: 'https://image.tmdb.org/t/p/original/fzN5JlhPB95xknk96RAkwhOye5b.jpg'
  },
  {
    id: 56,
    name: 'OCS',
    short: 'OCS',
    color: '#FF6400',
    bgColor: '#ff640020',
    textColor: '#fb923c',
    ids: [56, 57],
    logoUrl: 'https://image.tmdb.org/t/p/original/4Z9wYJtGvQZJ43R1bFp7k1G9Y0O.jpg'
  },
  {
    id: 236,
    name: 'France TV / Slash',
    short: 'FTV',
    color: '#0070D2',
    bgColor: '#0070d220',
    textColor: '#38bdf8',
    ids: [236, 429],
  },
  {
    id: 234,
    name: 'Arte',
    short: 'Arte',
    color: '#FA4616',
    bgColor: '#fa461620',
    textColor: '#f87171',
    ids: [234],
  },
  {
    id: 2,
    name: 'Apple TV (Location / Achat)',
    short: '',
    color: '#9E9E9E',
    bgColor: '#9e9e9e20',
    textColor: '#cbd5e1',
    ids: [2],
    rentOnly: true
  },
  {
    id: 3,
    name: 'Google TV / Play',
    short: 'GPlay',
    color: '#4285F4',
    bgColor: '#4285f420',
    textColor: '#93c5fd',
    ids: [3],
    rentOnly: true
  },
  {
    id: 58,
    name: 'Canal VOD',
    short: 'C-VOD',
    color: '#E10600',
    bgColor: '#e1060020',
    textColor: '#fca5a5',
    ids: [58],
    rentOnly: true
  },
  {
    id: 35,
    name: 'Rakuten TV',
    short: 'Rakuten',
    color: '#BF0000',
    bgColor: '#bf000020',
    textColor: '#f87171',
    ids: [35],
    rentOnly: true
  }
];

export const DEFAULT_USER_SUBSCRIPTIONS = [8, 337, 119, 381]; // Netflix, Disney+, Prime Video, Canal+
