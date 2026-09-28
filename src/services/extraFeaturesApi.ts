import { VodPrice, AvailabilityAlert, Movie, UgcShowtime } from '../types';

const STORAGE_ALERTS = 'cs_availability_alerts';

// Realistic price comparator generator for France VOD
export function getVodPricesForMovie(movieTitle: string, isRecent = false): VodPrice[] {
  // Typical prices in France:
  // Rental: usually 2.99€ or 3.99€ (or 4.99€ for recent)
  // Buy: usually 9.99€ or 11.99€ or 13.99€
  // We provide specific variations to allow comparison:
  const hash = Math.abs(
    movieTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  const baseRent = isRecent ? 3.99 : 2.99;
  const baseBuy = isRecent ? 13.99 : 9.99;

  const providers = [
    {
      providerId: 3,
      providerName: 'Google Play',
      logoUrl: 'https://image.tmdb.org/t/p/original/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg',
      rentPrice: hash % 2 === 0 ? baseRent : baseRent + 1,
      buyPrice: baseBuy,
      quality: 'HD' as const,
      url: `https://play.google.com/store/search?q=${encodeURIComponent(movieTitle)}&c=movies`,
    },
    {
      providerId: 2,
      providerName: 'Apple TV',
      logoUrl: 'https://image.tmdb.org/t/p/original/2E03jvSV7P2m7gTzG1kK929p4e8.jpg',
      rentPrice: baseRent + (hash % 3 === 0 ? 0 : 1),
      buyPrice: baseBuy + 2,
      quality: '4K' as const,
      url: `https://tv.apple.com/fr/search?term=${encodeURIComponent(movieTitle)}`,
    },
    {
      providerId: 119,
      providerName: 'Prime Video',
      logoUrl: 'https://image.tmdb.org/t/p/original/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg',
      rentPrice: baseRent + (hash % 4 === 0 ? 0 : 0.5),
      buyPrice: baseBuy + 1,
      quality: 'HD' as const,
      url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(movieTitle)}`,
    },
    {
      providerId: 58,
      providerName: 'Canal VOD',
      logoUrl: 'https://image.tmdb.org/t/p/original/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg',
      rentPrice: baseRent,
      buyPrice: baseBuy,
      quality: 'HD' as const,
      url: `https://vod.canalplus.com/recherche?q=${encodeURIComponent(movieTitle)}`,
    },
    {
      providerId: 35,
      providerName: 'Rakuten TV',
      logoUrl: 'https://image.tmdb.org/t/p/original/v9981gX4k26Q4c94L7yE013o2Zk.jpg',
      rentPrice: baseRent + 0.5,
      buyPrice: baseBuy - 1 > 0 ? baseBuy - 1 : baseBuy,
      quality: 'HD' as const,
      url: `https://rakuten.tv/fr/search?q=${encodeURIComponent(movieTitle)}`,
    },
  ];

  // Determine lowest rent and buy prices
  const minRent = Math.min(...providers.map((p) => p.rentPrice));
  const minBuy = Math.min(...providers.map((p) => p.buyPrice));

  return providers.map((p) => ({
    ...p,
    isCheapestRent: p.rentPrice === minRent,
    isCheapestBuy: p.buyPrice === minBuy,
  }));
}

// Stored Alerts Management
export function getStoredAlerts(): AvailabilityAlert[] {
  try {
    const val = localStorage.getItem(STORAGE_ALERTS);
    if (val) return JSON.parse(val);

    // Initial default alert for demonstration if empty
    const defaultAlerts: AvailabilityAlert[] = [
      {
        id: 'alert-spiderman',
        movieId: 'spiderman-brand-new-day',
        movieTitle: 'Spider-Man : Brand New Day',
        moviePoster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        targetAllUserSubs: true,
        createdAt: '2026-09-20',
        status: 'active',
      },
      {
        id: 'alert-gladiator',
        movieId: 'up-1',
        movieTitle: 'Gladiator II',
        moviePoster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        platformId: 381,
        platformName: 'Canal+',
        targetAllUserSubs: false,
        createdAt: '2026-09-15',
        status: 'triggered',
        triggeredPlatform: 'Canal+',
        triggeredDate: 'Arrive dans 4 jours',
      },
    ];
    localStorage.setItem(STORAGE_ALERTS, JSON.stringify(defaultAlerts));
    return defaultAlerts;
  } catch {
    return [];
  }
}

export function saveAlert(alert: AvailabilityAlert): void {
  try {
    const current = getStoredAlerts();
    const updated = [alert, ...current.filter((a) => a.id !== alert.id && a.movieId !== alert.movieId)];
    localStorage.setItem(STORAGE_ALERTS, JSON.stringify(updated));
  } catch {}
}

export function removeAlert(alertId: string): void {
  try {
    const current = getStoredAlerts();
    const updated = current.filter((a) => a.id !== alertId);
    localStorage.setItem(STORAGE_ALERTS, JSON.stringify(updated));
  } catch {}
}

export function isAlertActive(movieId: string | number): boolean {
  const alerts = getStoredAlerts();
  return alerts.some((a) => a.movieId === movieId || a.movieId === String(movieId));
}
