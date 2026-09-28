import { Movie, WatchAvailability, ProviderItem } from '../types';
import { CURATED_MOVIES } from '../data/curatedMovies';
import { STREAMING_PROVIDERS } from '../data/providers';

const STORAGE_KEY = 'cs_key';
const STORAGE_COUNTRY = 'cs_country';
const STORAGE_SUBS = 'cs_subs';
const STORAGE_WATCHLIST = 'cs_watchlist';
const STORAGE_WATCHLIST_MOVIES = 'cs_watchlist_movies';

const DEFAULT_TMDB_KEY = '33b0a2f1ffcb643f18bf519d886207d8';

export function getStoredKey(): string {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val ? JSON.parse(val) : DEFAULT_TMDB_KEY;
  } catch {
    return DEFAULT_TMDB_KEY;
  }
}

export function setStoredKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(key.trim()));
  } catch {}
}

export function getStoredCountry(): string {
  try {
    const val = localStorage.getItem(STORAGE_COUNTRY);
    return val ? JSON.parse(val) : 'FR';
  } catch {
    return 'FR';
  }
}

export function setStoredCountry(country: string): void {
  try {
    localStorage.setItem(STORAGE_COUNTRY, JSON.stringify(country));
  } catch {}
}

export function getStoredSubs(): number[] {
  try {
    const val = localStorage.getItem(STORAGE_SUBS);
    return val ? JSON.parse(val) : [8, 337, 119, 381];
  } catch {
    return [8, 337, 119, 381];
  }
}

export function setStoredSubs(subs: number[]): void {
  try {
    localStorage.setItem(STORAGE_SUBS, JSON.stringify(subs));
  } catch {}
}

export function getStoredWatchlist(): (string | number)[] {
  try {
    const val = localStorage.getItem(STORAGE_WATCHLIST);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function setStoredWatchlist(list: (string | number)[]): void {
  try {
    localStorage.setItem(STORAGE_WATCHLIST, JSON.stringify(list));
  } catch {}
}

export function getStoredWatchlistMovies(): Movie[] {
  try {
    const val = localStorage.getItem(STORAGE_WATCHLIST_MOVIES);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveMovieToStoredWatchlist(movie: Movie): void {
  try {
    const current = getStoredWatchlistMovies();
    if (!current.some((m) => m.id === movie.id || (movie.tmdbId && m.tmdbId === movie.tmdbId))) {
      current.unshift(movie);
      localStorage.setItem(STORAGE_WATCHLIST_MOVIES, JSON.stringify(current));
    }
  } catch {}
}

export function removeMovieFromStoredWatchlist(movieId: string | number): void {
  try {
    const current = getStoredWatchlistMovies();
    const filtered = current.filter((m) => m.id !== movieId && m.tmdbId !== movieId);
    localStorage.setItem(STORAGE_WATCHLIST_MOVIES, JSON.stringify(filtered));
  } catch {}
}

const tmdbImg = (path: string | null | undefined, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

// Standard TMDB movie genre id map to French names
const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Famille',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western',
};

// Helper to normalize TMDB API responses
function mapTmdbMovie(m: any): Movie {
  const genres: string[] = m.genres
    ? m.genres.map((g: any) => g.name)
    : (m.genre_ids || []).map((id: number) => TMDB_GENRES[id]).filter(Boolean);

  return {
    id: `tmdb-${m.id}`,
    tmdbId: m.id,
    imdbId: m.imdb_id,
    title: m.title || m.name || 'Sans titre',
    originalTitle: m.original_title || m.original_name,
    year: (m.release_date || m.first_air_date || '').slice(0, 4) || '2024',
    overview: m.overview || 'Aucun résumé disponible pour ce film.',
    poster: tmdbImg(m.poster_path, 'w500'),
    backdrop: tmdbImg(m.backdrop_path, 'w1280'),
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
    voteCount: m.vote_count || 0,
    genres,
    runtime: m.runtime || 0,
    source: 'tmdb',
  };
}

// Helper to normalize Cinemeta items
function mapCinemetaMovie(m: any): Movie {
  const imdb = m.imdb_id || (String(m.id).startsWith('tt') ? m.id : undefined);
  return {
    id: `cine-${m.id}`,
    tmdbId: undefined,
    imdbId: imdb,
    title: m.name || m.title || 'Sans titre',
    originalTitle: m.name,
    year: String(m.year || m.releaseInfo || '').slice(0, 4) || '2024',
    overview: m.description || 'Résumé non disponible.',
    poster: m.poster || '',
    backdrop: m.background || '',
    rating: m.imdbRating ? Number(Number(m.imdbRating).toFixed(1)) : 0,
    genres: Array.isArray(m.genres) ? m.genres : [],
    runtime: m.runtime ? parseInt(m.runtime, 10) : 0,
    source: 'cinemeta',
  };
}

// Helper to normalize Apple Search items
function mapAppleMovie(a: any): Movie {
  const poster = (a.artworkUrl100 || '').replace('100x100bb', '600x900bb');
  return {
    id: `apple-${a.trackId}`,
    title: a.trackName || a.collectionName || 'Sans titre',
    year: (a.releaseDate || '').slice(0, 4) || '',
    overview: a.longDescription || a.shortDescription || '',
    poster,
    backdrop: '',
    rating: 0,
    genres: [a.primaryGenreName].filter(Boolean),
    runtime: a.trackTimeMillis ? Math.round(a.trackTimeMillis / 60000) : 0,
    storeUrl: a.trackViewUrl,
    source: 'apple',
  };
}

export async function fetchTmdbRaw(endpoint: string, params: Record<string, string | undefined> = {}): Promise<any> {
  const apiKey = getStoredKey().trim();
  if (!apiKey) throw new Error('Clé TMDB non renseignée');

  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) {
      q.set(k, v);
    }
  }
  const isBearer = apiKey.includes('.') || apiKey.length > 70;
  const headers: HeadersInit = { accept: 'application/json' };

  if (isBearer) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    q.set('api_key', apiKey);
  }

  const res = await fetch(`https://api.themoviedb.org/3${endpoint}?${q.toString()}`, { headers });
  if (!res.ok) {
    throw new Error(`Erreur TMDB ${res.status} (${res.status === 401 ? 'Clé invalide' : 'Échec requête'})`);
  }
  return res.json();
}

export async function testTmdbKey(key: string): Promise<boolean> {
  if (!key.trim()) return false;
  try {
    const isBearer = key.includes('.') || key.length > 70;
    const headers: HeadersInit = { accept: 'application/json' };
    const q = new URLSearchParams();
    if (isBearer) headers.Authorization = `Bearer ${key.trim()}`;
    else q.set('api_key', key.trim());

    const res = await fetch(`https://api.themoviedb.org/3/authentication?${q.toString()}`, { headers });
    if (res.ok) return true;
    // Alternative test with /configuration
    const res2 = await fetch(`https://api.themoviedb.org/3/configuration?${q.toString()}`, { headers });
    return res2.ok;
  } catch {
    return false;
  }
}

// Fetch list of movies by category
export async function getMovies(
  category: 'trending' | 'popular' | 'top_rated' | 'now_playing' | 'mine',
  country = 'FR',
  subs: number[] = [],
  costFilter: 'all' | 'free' | 'rent_buy' = 'all'
): Promise<Movie[]> {
  const apiKey = getStoredKey().trim();

  // If TMDB key configured, query TMDB live
  if (apiKey) {
    try {
      const common = { language: 'fr-FR', region: country, include_adult: 'false' };
      let json: any;

      if (category === 'mine') {
        if (!subs.length) return [];
        // Map user subs to all relevant TMDB provider IDs (e.g., Netflix: 8, 1796; Prime: 119, 9, etc.)
        const expandedIds = Array.from(
          new Set(
            subs.flatMap((subId) => {
              const sp = STREAMING_PROVIDERS.find((p) => p.id === subId);
              return sp ? sp.ids : [subId];
            })
          )
        );
        json = await fetchTmdbRaw('/discover/movie', {
          ...common,
          watch_region: country,
          with_watch_providers: expandedIds.join('|'),
          with_watch_monetization_types: costFilter === 'rent_buy' ? 'rent|buy' : 'flatrate|free|ads',
          sort_by: 'popularity.desc',
          page: '1',
        });
      } else if (category === 'trending') {
        json = await fetchTmdbRaw('/trending/movie/week', { language: 'fr-FR', page: '1' });
      } else if (category === 'now_playing') {
        json = await fetchTmdbRaw('/movie/now_playing', { ...common, page: '1' });
      } else {
        json = await fetchTmdbRaw(`/movie/${category}`, { ...common, page: '1' });
      }

      if (json?.results?.length) {
        return json.results.map(mapTmdbMovie);
      }
    } catch (err) {
      console.warn('TMDB list fetch failed, falling back:', err);
    }
  }

  // Fallback: Use rich Curated catalog + Cinemeta top catalog
  if (category === 'mine') {
    // Filter curated movies by user's subscriptions in target country
    return CURATED_MOVIES.filter((m) => {
      const provs = m.cachedProviders?.[country]?.flatrate || [];
      return provs.some((p) => {
        return STREAMING_PROVIDERS.some(
          (sp) => subs.includes(sp.id) && sp.ids.includes(p.provider_id)
        );
      });
    });
  }

  // Mix curated movies matching category
  try {
    let cinePath = 'catalog/movie/top.json';
    if (category === 'top_rated') cinePath = 'catalog/movie/imdbRating.json';

    const cinemetaRes = await fetch(`https://v3-cinemeta.strem.io/${cinePath}`, { signal: AbortSignal.timeout(4000) });
    if (cinemetaRes.ok) {
      const data = await cinemetaRes.json();
      const cinemetaFilms = (data.metas || []).filter((f: any) => f.type === 'movie' || !f.type).map(mapCinemetaMovie);
      
      // Combine curated movies and Cinemeta
      const merged = [...CURATED_MOVIES, ...cinemetaFilms];
      return deduplicateMovies(merged);
    }
  } catch (err) {
    console.warn('Cinemeta fetch error, using curated:', err);
  }

  return CURATED_MOVIES;
}

// Live Search with suggestions & actor support
export async function searchMovies(query: string, country = 'FR'): Promise<Movie[]> {
  const cleanQ = query.trim();
  if (cleanQ.length < 2) return [];

  const apiKey = getStoredKey().trim();

  if (apiKey) {
    try {
      // 1. Parallel search: standard movie title search AND search person (actors/directors)
      const [movieSearchRes, personSearchRes] = await Promise.allSettled([
        fetchTmdbRaw('/search/movie', {
          query: cleanQ,
          language: 'fr-FR',
          include_adult: 'false',
          page: '1',
        }),
        fetchTmdbRaw('/search/person', {
          query: cleanQ,
          language: 'fr-FR',
          include_adult: 'false',
          page: '1',
        }),
      ]);

      const titleMovies: Movie[] =
        movieSearchRes.status === 'fulfilled' && movieSearchRes.value?.results?.length
          ? movieSearchRes.value.results.map(mapTmdbMovie)
          : [];

      // If person found (actor or director), fetch top movies starring or created by this person
      let actorMovies: Movie[] = [];
      if (personSearchRes.status === 'fulfilled' && personSearchRes.value?.results?.length) {
        const topPerson = personSearchRes.value.results[0];
        // If the query strongly matches the actor's name or known works
        if (topPerson?.id) {
          try {
            // Fetch movies with this actor
            const castDiscover = await fetchTmdbRaw('/discover/movie', {
              with_cast: String(topPerson.id),
              language: 'fr-FR',
              sort_by: 'popularity.desc',
              include_adult: 'false',
              page: '1',
            });
            if (castDiscover?.results?.length) {
              actorMovies = castDiscover.results.map(mapTmdbMovie);
            }
          } catch (e) {
            console.warn('Actor discover error:', e);
          }
        }
      }

      const combinedTmdb = [...actorMovies, ...titleMovies];
      if (combinedTmdb.length > 0) {
        return deduplicateMovies(combinedTmdb);
      }
    } catch (err) {
      console.warn('TMDB search error:', err);
    }
  }

  // Fast local search in curated by title, director AND cast actors!
  const lowerQ = cleanQ.toLowerCase();
  const localMatches = CURATED_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerQ) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(lowerQ)) ||
      (m.director && m.director.toLowerCase().includes(lowerQ)) ||
      (m.cast && m.cast.some((actor) => actor.toLowerCase().includes(lowerQ)))
  );

  // Parallel fetch: Cinemeta + Apple iTunes Search
  const results = await Promise.allSettled([
    (async () => {
      const res = await fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(cleanQ)}.json`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.metas || []).filter((f: any) => f.type === 'movie' || !f.type).map(mapCinemetaMovie);
    })(),
    (async () => {
      const url = `https://itunes.apple.com/search?${new URLSearchParams({
        term: cleanQ,
        media: 'movie',
        entity: 'movie',
        country,
        limit: '10',
      })}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).filter((x: any) => x.kind === 'feature-movie' || x.wrapperType === 'track').map(mapAppleMovie);
    })(),
  ]);

  const cinemetaList = results[0].status === 'fulfilled' ? results[0].value : [];
  const appleList = results[1].status === 'fulfilled' ? results[1].value : [];

  const combined = [...localMatches, ...cinemetaList, ...appleList];
  return deduplicateMovies(combined);
}

// Watch Providers Resolution
export async function getWatchProviders(movie: Movie, country = 'FR'): Promise<WatchAvailability | null> {
  const apiKey = getStoredKey().trim();

  // 1. Check curated cached availability first
  if (movie.cachedProviders?.[country]) {
    return movie.cachedProviders[country];
  }

  // 2. If TMDB key available, query TMDB watch/providers
  if (apiKey) {
    try {
      let tmdbId = movie.tmdbId;

      // If we don't have TMDB ID yet, resolve it via IMDb ID or search
      if (!tmdbId) {
        if (movie.imdbId && /^tt\d+$/.test(movie.imdbId)) {
          const findData = await fetchTmdbRaw(`/find/${movie.imdbId}`, {
            external_source: 'imdb_id',
            language: 'fr-FR',
          });
          if (findData.movie_results?.[0]?.id) {
            tmdbId = findData.movie_results[0].id;
          }
        }
        if (!tmdbId) {
          const searchData = await fetchTmdbRaw('/search/movie', {
            query: movie.title,
            year: movie.year || undefined,
            language: 'fr-FR',
          });
          if (searchData.results?.[0]?.id) {
            tmdbId = searchData.results[0].id;
          }
        }
      }

      if (tmdbId) {
        const provData = await fetchTmdbRaw(`/movie/${tmdbId}/watch/providers`);
        const countryData = provData?.results?.[country];
        if (countryData) {
          return {
            link: countryData.link,
            flatrate: countryData.flatrate || [],
            free: countryData.free || [],
            ads: countryData.ads || [],
            rent: countryData.rent || [],
            buy: countryData.buy || [],
          };
        }
      }
    } catch (err) {
      console.warn('Watch providers TMDB error:', err);
    }
  }

  // 3. Fallback: check matching curated movie by title
  const matchedCurated = CURATED_MOVIES.find((m) =>
    normalizeTitle(m.title) === normalizeTitle(movie.title)
  );
  if (matchedCurated?.cachedProviders?.[country]) {
    return matchedCurated.cachedProviders[country];
  }

  // 4. Default fallback with JustWatch link
  const justWatchLink = `https://www.justwatch.com/${country.toLowerCase()}/recherche?q=${encodeURIComponent(movie.title)}`;
  return {
    link: justWatchLink,
    flatrate: [],
    rent: movie.storeUrl ? [{ provider_id: 2, provider_name: 'Apple TV', logo_path: null }] : [],
    buy: movie.storeUrl ? [{ provider_id: 2, provider_name: 'Apple TV', logo_path: null }] : [],
  };
}

// Fetch complete movie details including cast, director, and trailer
export async function getMovieDetails(movie: Movie): Promise<Movie> {
  const apiKey = getStoredKey().trim();

  // If curated, return as is
  const matchedCurated = CURATED_MOVIES.find(
    (m) => normalizeTitle(m.title) === normalizeTitle(movie.title)
  );
  if (matchedCurated) {
    return { ...movie, ...matchedCurated };
  }

  if (apiKey) {
    try {
      let tmdbId = movie.tmdbId;
      if (!tmdbId) {
        if (movie.imdbId) {
          const find = await fetchTmdbRaw(`/find/${movie.imdbId}`, {
            external_source: 'imdb_id',
            language: 'fr-FR',
          });
          tmdbId = find.movie_results?.[0]?.id;
        }
        if (!tmdbId) {
          const search = await fetchTmdbRaw('/search/movie', {
            query: movie.title,
            year: movie.year || undefined,
            language: 'fr-FR',
          });
          tmdbId = search.results?.[0]?.id;
        }
      }

      if (tmdbId) {
        const details = await fetchTmdbRaw(`/movie/${tmdbId}`, {
          language: 'fr-FR',
          append_to_response: 'credits,videos',
        });

        const trailer = details.videos?.results?.find(
          (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );

        const director = details.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
        const cast = details.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];

        return {
          ...movie,
          ...mapTmdbMovie(details),
          director,
          cast,
          trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined,
        };
      }
    } catch (e) {
      console.warn('Error fetching TMDB details:', e);
    }
  }

  return movie;
}

function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function deduplicateMovies(movies: Movie[]): Movie[] {
  const seen = new Set<string>();
  return movies.filter((m) => {
    const key = `${normalizeTitle(m.title)}_${m.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
