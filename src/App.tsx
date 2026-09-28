import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Movie, CategoryType, CostFilterType } from './types';
import {
  getStoredCountry,
  setStoredCountry,
  getStoredSubs,
  setStoredSubs,
  getStoredWatchlist,
  setStoredWatchlist,
  getStoredWatchlistMovies,
  saveMovieToStoredWatchlist,
  removeMovieFromStoredWatchlist,
  getMovies,
  searchMovies,
} from './services/movieApi';
import { CURATED_MOVIES } from './data/curatedMovies';
import { UPCOMING_MOVIES } from './data/upcomingData';
import { getStoredAlerts } from './services/extraFeaturesApi';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { SettingsModal } from './components/SettingsModal';
import { PlatformBanner } from './components/PlatformBanner';
import { Toast } from './components/Toast';
import { QuizModal } from './components/QuizModal';
import { CameraIdentificationModal } from './components/CameraIdentificationModal';
import { SharedWatchlistModal } from './components/SharedWatchlistModal';
import { AlertsModal } from './components/AlertsModal';
import { Film, Loader2, Sparkles, AlertCircle, Ticket, Calendar } from 'lucide-react';

export default function App() {
  const [country, setCountry] = useState<string>(getStoredCountry);
  const [userSubs, setUserSubs] = useState<number[]>(getStoredSubs);
  const [watchlist, setWatchlist] = useState<(string | number)[]>(getStoredWatchlist);

  const [activeCategory, setActiveCategory] = useState<CategoryType>('trending');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tous les genres');
  const [costFilter, setCostFilter] = useState<CostFilterType>('all');
  const [selectedRuntime, setSelectedRuntime] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedYearRange, setSelectedYearRange] = useState<string>('all');
  const [selectedActor, setSelectedActor] = useState<string>('');

  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittedSearch, setSubmittedSearch] = useState<string>('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState<boolean>(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load Movies based on active category / country / subs / costFilter
  const loadCategoryMovies = useCallback(async () => {
    if (activeCategory === 'watchlist') {
      // Load saved watchlist movies from local storage combined with curated
      const storedMovies = getStoredWatchlistMovies();
      const curatedMatches = CURATED_MOVIES.filter((m) =>
        watchlist.includes(m.id) || (m.tmdbId && watchlist.includes(m.tmdbId))
      );

      // Merge and deduplicate by id / tmdbId
      const map = new Map<string | number, Movie>();
      for (const m of storedMovies) map.set(m.id, m);
      for (const m of curatedMatches) {
        if (!map.has(m.id)) map.set(m.id, m);
      }

      setMovies(Array.from(map.values()));
      setIsLoading(false);
      return;
    }

    if (activeCategory === 'upcoming') {
      // "Bientôt disponible chez vous" - filtered by user subscriptions
      const userUpcomings = UPCOMING_MOVIES.filter((m) =>
        !userSubs.length || userSubs.includes(m.platformId)
      );
      const mapped: Movie[] = userUpcomings.map((u) => ({
        id: u.id,
        title: u.title,
        year: u.releaseDate.split('-')[0] || '2026',
        overview: `📅 Arrive le ${u.releaseDate} sur ${u.platformName} (dans ${u.daysLeft} jours) · ${u.synopsis}`,
        poster: u.poster,
        backdrop: u.backdrop || '',
        rating: u.rating,
        genres: u.genres,
        source: 'curated',
        runtime: 125,
        cachedProviders: {
          FR: {
            flatrate: [{ provider_id: u.platformId, provider_name: u.platformName, logo_path: u.platformLogo }],
          },
        },
      }));
      setMovies(mapped.length > 0 ? mapped : UPCOMING_MOVIES.map((u) => ({
        id: u.id,
        title: u.title,
        year: u.releaseDate.split('-')[0] || '2026',
        overview: `📅 Arrive le ${u.releaseDate} sur ${u.platformName} · ${u.synopsis}`,
        poster: u.poster,
        backdrop: u.backdrop || '',
        rating: u.rating,
        genres: u.genres,
        source: 'curated',
      })));
      setIsLoading(false);
      return;
    }

    if (activeCategory === 'cinemas') {
      // Actuellement en salle UGC
      const theatrical = CURATED_MOVIES.filter(
        (m) =>
          m.id === 'spiderman-brand-new-day' ||
          m.title.toLowerCase().includes('spider') ||
          m.year === '2026' ||
          m.year === '2025' ||
          m.title.includes('Dune')
      );
      setMovies(theatrical);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getMovies(activeCategory, country, userSubs, costFilter);
      setMovies(data);
    } catch (err: any) {
      console.error('Error loading movies:', err);
      setErrorMsg(err?.message || 'Erreur de chargement des films.');
      setMovies(CURATED_MOVIES);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, country, userSubs, watchlist, costFilter]);

  // Load category films when category, country, subs or costFilter change (if not in search mode)
  useEffect(() => {
    if (!submittedSearch) {
      loadCategoryMovies();
    }
  }, [loadCategoryMovies, submittedSearch]);

  // Debounced search suggestions for Hero input
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchMovies(q, country);
        setSuggestions(results.slice(0, 6));
      } catch (err) {
        console.error('Search suggestion error:', err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, country]);

  // Full Search submission
  const handleSearchSubmit = async (query: string) => {
    const q = query.trim();
    if (!q) return;

    setSubmittedSearch(q);
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const results = await searchMovies(q, country);
      setMovies(results);
    } catch (err: any) {
      console.error('Full search error:', err);
      setErrorMsg(`Recherche indisponible : ${err?.message || 'Erreur'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedSearch('');
    setSuggestions([]);
    loadCategoryMovies();
  };

  // Watchlist Toggle
  const handleToggleWatchlist = (movie: Movie, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const id = movie.id;
    setWatchlist((prev) => {
      let updated: (string | number)[];
      if (prev.includes(id) || (movie.tmdbId && prev.includes(movie.tmdbId))) {
        updated = prev.filter((item) => item !== id && (!movie.tmdbId || item !== movie.tmdbId));
        removeMovieFromStoredWatchlist(id);
        if (movie.tmdbId) removeMovieFromStoredWatchlist(movie.tmdbId);
        showToast(`« ${movie.title} » retiré de votre liste`);
      } else {
        updated = [...prev, id];
        saveMovieToStoredWatchlist(movie);
        showToast(`« ${movie.title} » ajouté à votre liste`);
      }
      setStoredWatchlist(updated);
      return updated;
    });

    // If currently on watchlist page, update list view immediately
    if (activeCategory === 'watchlist') {
      setTimeout(() => {
        loadCategoryMovies();
      }, 50);
    }
  };

  // Quick toggle from banner
  const handleToggleSub = (providerId: number) => {
    setUserSubs((prev) => {
      const next = prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId];
      setStoredSubs(next);
      return next;
    });
  };

  // Country Change
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setStoredCountry(newCountry);
    showToast(`Pays changé : ${newCountry}`);
  };

  // Save Settings from modal
  const handleSaveSettings = (newSubs: number[], newCountry: string) => {
    setUserSubs(newSubs);
    setStoredSubs(newSubs);

    setCountry(newCountry);
    setStoredCountry(newCountry);

    showToast('Vos préférences sont enregistrées');
  };

  // Comprehensive multi-criteria filtering: Genre, Runtime, Rating, Year, Actor
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // 1. Genre filter
      if (
        selectedGenre !== 'Tous les genres' &&
        !m.genres?.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()))
      ) {
        return false;
      }

      // 2. Runtime filter (<90, 90-120, >120)
      if (selectedRuntime === '<90' && m.runtime && m.runtime >= 90) return false;
      if (selectedRuntime === '90-120' && m.runtime && (m.runtime < 90 || m.runtime > 120)) return false;
      if (selectedRuntime === '>120' && m.runtime && m.runtime <= 120) return false;

      // 3. Minimum rating filter
      if (selectedRating > 0 && m.rating < selectedRating) return false;

      // 4. Release Year range filter
      if (selectedYearRange === '2025-2026' && m.year < '2025') return false;
      if (selectedYearRange === '2020-2024' && (m.year < '2020' || m.year > '2024')) return false;
      if (selectedYearRange === '2010-2019' && (m.year < '2010' || m.year > '2019')) return false;
      if (selectedYearRange === '2000-2009' && (m.year < '2000' || m.year > '2009')) return false;
      if (selectedYearRange === 'before-2000' && m.year >= '2000') return false;

      // 5. Actor filter
      if (selectedActor) {
        const actorLower = selectedActor.toLowerCase();
        const hasActorInCast = m.cast?.some((c) => c.toLowerCase().includes(actorLower));
        const hasActorInOverview = m.overview?.toLowerCase().includes(actorLower);
        const hasActorInTitle = m.title.toLowerCase().includes(actorLower);
        if (!hasActorInCast && !hasActorInOverview && !hasActorInTitle) return false;
      }

      return true;
    });
  }, [movies, selectedGenre, selectedRuntime, selectedRating, selectedYearRange, selectedActor]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d15] text-[#f7f7fc]">
      {/* Top Header */}
      <Header
        country={country}
        onCountryChange={handleCountryChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setSubmittedSearch('');
          setSearchQuery('');
          setActiveCategory(cat);
        }}
        watchlistCount={watchlist.length}
        subsCount={userSubs.length}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenCamera={() => setIsCameraOpen(true)}
        onOpenFriends={() => setIsFriendsOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        alertsCount={getStoredAlerts().length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Hero Section */}
        <Hero
          onSearchSubmit={handleSearchSubmit}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          suggestions={suggestions}
          isSearching={isSearchingSuggestions}
          onQueryChange={setSearchQuery}
          currentQuery={searchQuery}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenCamera={() => setIsCameraOpen(true)}
          onOpenFriends={() => setIsFriendsOpen(true)}
          onSelectTheatrical={() => {
            const sm = CURATED_MOVIES.find((m) => m.id === 'spiderman-brand-new-day');
            if (sm) setSelectedMovie(sm);
          }}
        />

        {/* Interactive Platform Configuration Banner */}
        <PlatformBanner
          userSubs={userSubs}
          onToggleSub={handleToggleSub}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Category, Cost & Genre Navigation Bar */}
        <FilterBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setSubmittedSearch('');
            setSearchQuery('');
            setActiveCategory(cat);
          }}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          costFilter={costFilter}
          onSelectCostFilter={setCostFilter}
          searchQuery={submittedSearch}
          onClearSearch={handleClearSearch}
          mineCount={userSubs.length}
          watchlistCount={watchlist.length}
          selectedRuntime={selectedRuntime}
          onSelectRuntime={setSelectedRuntime}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          selectedYearRange={selectedYearRange}
          onSelectYearRange={setSelectedYearRange}
          selectedActor={selectedActor}
          onSelectActor={setSelectedActor}
        />

        {/* Section Heading */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-1">
              {submittedSearch
                ? 'Résultats de recherche'
                : activeCategory === 'mine'
                ? 'Inclus dans vos abonnements'
                : activeCategory === 'watchlist'
                ? 'Votre sélection personnelle'
                : activeCategory === 'upcoming'
                ? 'Arrivées prochaines sur vos plateformes'
                : activeCategory === 'cinemas'
                ? 'Films à l’affiche dans les cinémas UGC'
                : 'Sélection CinéScope'}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {submittedSearch
                ? `Films pour « ${submittedSearch} »`
                : activeCategory === 'trending'
                ? 'À découvrir aujourd’hui ✦'
                : activeCategory === 'popular'
                ? 'Les films populaires du moment'
                : activeCategory === 'top_rated'
                ? 'Les chefs-d’œuvre les mieux notés'
                : activeCategory === 'now_playing'
                ? 'Dernières sorties en streaming'
                : activeCategory === 'mine'
                ? 'Disponibles sur vos plateformes'
                : activeCategory === 'upcoming'
                ? 'Bientôt disponible chez vous 📅'
                : activeCategory === 'cinemas'
                ? 'Actuellement au Cinéma UGC 🍿'
                : 'Ma liste à voir'}
            </h2>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredMovies.length} film{filteredMovies.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Error Callout if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-red-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-3">
                <div className="aspect-[2/3] bg-white/[0.04] rounded-2xl border border-white/5" />
                <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="py-20 px-6 rounded-3xl border border-dashed border-white/15 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Film className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              {activeCategory === 'watchlist'
                ? 'Votre liste est vide'
                : activeCategory === 'mine'
                ? 'Aucun film trouvé sur vos plateformes'
                : activeCategory === 'upcoming'
                ? 'Aucune sortie prochaine trouvée sur vos abonnements'
                : 'Aucun film ne correspond à vos critères'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              {activeCategory === 'watchlist'
                ? 'Cliquez sur l’icône de marque-page d’un film pour le sauvegarder et le retrouver facilement ici.'
                : activeCategory === 'mine'
                ? 'Essayez d’activer d’autres plateformes de streaming dans les paramètres.'
                : 'Modifiez vos filtres de durée, d’année ou de note pour élargir les résultats.'}
            </p>
            {activeCategory === 'mine' ? (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-purple-600/30"
              >
                Gérer mes plateformes
              </button>
            ) : submittedSearch ? (
              <button
                onClick={handleClearSearch}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Voir les tendances
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedGenre('Tous les genres');
                  setSelectedRuntime('all');
                  setSelectedRating(0);
                  setSelectedYearRange('all');
                  setSelectedActor('');
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                country={country}
                userSubs={userSubs}
                isWatchlisted={watchlist.includes(movie.id) || (!!movie.tmdbId && watchlist.includes(movie.tmdbId))}
                onToggleWatchlist={handleToggleWatchlist}
                onClick={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#0d0f1a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs text-slate-400">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-base text-white">
                Ciné<span className="text-purple-400">Scope</span>
              </span>
            </div>
            <p className="leading-relaxed">
              Ce produit utilise les données de l'API TMDB mais n’est ni approuvé ni certifié par TMDB. Données de disponibilité fournies par JustWatch. Séances de cinéma certifiées UGC France. Les catalogues et les droits de diffusion varient régulièrement selon les pays.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-9a23c794f84e8f99d0c7b0ea96c4ff5d27d2c3e1491dcf86f11fbc6a279130f7.svg"
                alt="TMDB Logo"
                className="h-4 w-auto opacity-75 hover:opacity-100 transition-opacity"
              />
            </a>
            <span className="text-slate-500">
              Conçu pour les passionnés de cinéma 🍿
            </span>
          </div>
        </div>
      </footer>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          country={country}
          userSubs={userSubs}
          isWatchlisted={watchlist.includes(selectedMovie.id) || (!!selectedMovie.tmdbId && watchlist.includes(selectedMovie.tmdbId))}
          onToggleWatchlist={(m) => handleToggleWatchlist(m)}
          onClose={() => setSelectedMovie(null)}
          onOpenSettings={() => {
            setSelectedMovie(null);
            setIsSettingsOpen(true);
          }}
          onSearchActor={(actor) => {
            setSelectedActor(actor);
            showToast(`Filtre activé pour : ${actor}`);
          }}
          onTriggerToast={showToast}
        />
      )}

      {/* Quiz Modal (anzx.fr style + AI recommendations) */}
      {isQuizOpen && (
        <QuizModal
          userSubs={userSubs}
          country={country}
          onClose={() => setIsQuizOpen(false)}
          onSelectMovie={(m) => {
            setIsQuizOpen(false);
            setSelectedMovie(m);
          }}
          onToggleWatchlist={handleToggleWatchlist}
          watchlist={watchlist}
        />
      )}

      {/* Camera Identification Modal (Logo Caméra) */}
      {isCameraOpen && (
        <CameraIdentificationModal
          onClose={() => setIsCameraOpen(false)}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* Shared Watchlist Modal (Match entre amis) */}
      {isFriendsOpen && (
        <SharedWatchlistModal
          onClose={() => setIsFriendsOpen(false)}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* Availability Alerts Modal */}
      {isAlertsOpen && (
        <AlertsModal
          userSubs={userSubs}
          onClose={() => setIsAlertsOpen(false)}
          onSelectMovie={(m) => setSelectedMovie(m)}
          onTriggerToast={showToast}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          currentCountry={country}
          currentSubs={userSubs}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
