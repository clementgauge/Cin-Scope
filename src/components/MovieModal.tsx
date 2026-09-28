import React, { useEffect, useState } from 'react';
import { Movie, WatchAvailability } from '../types';
import { STREAMING_PROVIDERS } from '../data/providers';
import { getWatchProviders, getMovieDetails } from '../services/movieApi';
import { isAlertActive, saveAlert, removeAlert } from '../services/extraFeaturesApi';
import { PriceComparator } from './PriceComparator';
import { UgcCinemasFinder } from './UgcCinemasFinder';
import {
  X,
  Star,
  Clock,
  Calendar,
  ExternalLink,
  Play,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Tv,
  Film,
  Loader2,
  Info,
  Bell,
  Ticket,
  Search,
} from 'lucide-react';

interface MovieModalProps {
  movie: Movie;
  country: string;
  userSubs: number[];
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onClose: () => void;
  onOpenSettings: () => void;
  onSearchActor?: (actor: string) => void;
  onTriggerToast?: (msg: string) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie: initialMovie,
  country,
  userSubs,
  isWatchlisted,
  onToggleWatchlist,
  onClose,
  onOpenSettings,
  onSearchActor,
  onTriggerToast,
}) => {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [availability, setAvailability] = useState<WatchAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [hasAlert, setHasAlert] = useState<boolean>(isAlertActive(initialMovie.id));
  const [activeTab, setActiveTab] = useState<'streaming' | 'cinema' | 'comparator'>('streaming');

  // Check if movie is currently in theaters (Spider-Man Brand New Day, or recent 2026/2025 release without streaming)
  const isTheatrical =
    movie.title.toLowerCase().includes('spider') ||
    movie.title.toLowerCase().includes('brand new day') ||
    movie.year === '2026' ||
    (movie.year === '2025' && !availability?.flatrate?.length);

  // Toggle alert
  const handleToggleAlert = () => {
    if (hasAlert) {
      removeAlert(String(movie.id));
      if (movie.tmdbId) removeAlert(String(movie.tmdbId));
      setHasAlert(false);
      onTriggerToast?.(`Alerte désactivée pour « ${movie.title} »`);
    } else {
      saveAlert({
        id: `alert-${movie.id}`,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        targetAllUserSubs: true,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      });
      setHasAlert(true);
      onTriggerToast?.(`🔔 Alerte activée ! Vous serez prévenu dès que « ${movie.title} » arrive sur vos plateformes`);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTrailer) setShowTrailer(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showTrailer]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch full details and providers
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setIsLoading(true);
      try {
        const [fullMovie, watchData] = await Promise.all([
          getMovieDetails(initialMovie),
          getWatchProviders(initialMovie, country),
        ]);
        if (!isCancelled) {
          setMovie(fullMovie);
          setAvailability(watchData);
        }
      } catch (err) {
        console.error('Failed to load movie modal data:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [initialMovie, country]);

  // Extract subscribed matches
  const flatrateList = availability?.flatrate || [];
  const freeList = [...(availability?.free || []), ...(availability?.ads || [])];
  const rentList = availability?.rent || [];
  const buyList = availability?.buy || [];

  const matchedSubscribed = flatrateList.filter((p) =>
    STREAMING_PROVIDERS.some((sp) => userSubs.includes(sp.id) && sp.ids.includes(p.provider_id))
  );

  const justWatchUrl =
    availability?.link ||
    `https://www.justwatch.com/${country.toLowerCase()}/recherche?q=${encodeURIComponent(movie.title)}`;

  // Extract YouTube ID for embed
  let youtubeEmbedUrl = '';
  if (movie.trailerUrl) {
    const match = movie.trailerUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match?.[1]) {
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`;
    }
  }

  const renderProviderPills = (providers: any[], priceType?: 'included' | 'free' | 'rent' | 'buy') => {
    if (!providers || providers.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2.5">
        {providers.map((p, idx) => {
          const sp = STREAMING_PROVIDERS.find((s) => s.ids.includes(p.provider_id));
          const isMine = sp && userSubs.includes(sp.id);
          const logo = p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : sp?.logoUrl;

          return (
            <div
              key={`${p.provider_id}-${idx}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
                isMine && priceType === 'included'
                  ? 'bg-purple-950/70 border-purple-500/70 shadow-sm shadow-purple-500/20 text-white'
                  : 'bg-[#1a1d2e] border-white/10 text-slate-200'
              }`}
            >
              {logo ? (
                <img
                  src={logo}
                  alt={p.provider_name}
                  className="w-6 h-6 rounded-lg object-cover bg-slate-800 shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: sp?.color || '#4f46e5' }}
                >
                  {sp?.short || p.provider_name.slice(0, 2)}
                </div>
              )}
              <span className="text-xs font-semibold">{p.provider_name}</span>

              {/* Distinction Gratuit / Inclus avec abonnement vs Payant à l'acte */}
              {priceType === 'included' && isMine && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pl-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Inclus avec votre abonnement</span>
                </span>
              )}
              {priceType === 'free' && (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                  Gratuit (AVOD)
                </span>
              )}
              {priceType === 'rent' && (
                <span className="text-[10px] font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Location payante
                </span>
              )}
              {priceType === 'buy' && (
                <span className="text-[10px] font-medium text-blue-300 bg-blue-950/40 border border-blue-500/30 px-1.5 py-0.5 rounded">
                  Achat payant
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Fiche de ${movie.title}`}
        className="relative w-full max-w-4xl bg-[#141724] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto text-left max-h-[94vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer la fiche"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Backdrop Header */}
          <div className="relative h-48 sm:h-72 md:h-80 w-full bg-[#1c1f33] overflow-hidden">
            {movie.backdrop ? (
              <img
                src={movie.backdrop}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : movie.poster ? (
              <img
                src={movie.poster}
                alt=""
                className="w-full h-full object-cover blur-md opacity-40 scale-110"
              />
            ) : null}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141724] via-[#141724]/60 to-transparent" />

            {/* Trailer button floating on backdrop */}
            {movie.trailerUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowTrailer(true)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                  <span>Voir la bande-annonce</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Content Info */}
          <div className="px-4 sm:px-8 md:px-10 pb-8 sm:pb-10 -mt-16 sm:-mt-24 md:-mt-28 relative z-10">
            {/* Header Lockup: Poster + Title */}
            <div className="flex flex-row gap-4 sm:gap-6 items-end">
              {/* Poster */}
              <div className="w-24 sm:w-36 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/20 shadow-2xl shrink-0">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-3 text-center text-xs font-bold text-slate-400">
                    {movie.title}
                  </div>
                )}
              </div>

              {/* Title & Quick Info */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-purple-400 mb-0.5 sm:mb-1">
                  Fiche Film
                </div>
                <h2 className="font-display text-lg sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
                  {movie.title}
                </h2>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                    Titre original : {movie.originalTitle}
                  </p>
                )}

                {/* Inline clean metadata */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 mt-1.5 sm:mt-2.5">
                  {movie.year && (
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      <span>{movie.year}</span>
                    </span>
                  )}
                  {movie.runtime ? (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                        <span>{movie.runtime} min</span>
                      </span>
                    </>
                  ) : null}
                  {movie.rating > 0 ? (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-300">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-300 text-amber-300" />
                        <span>{movie.rating}</span>
                      </span>
                    </>
                  ) : null}
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                    {movie.genres.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.06] text-slate-300 border border-white/10"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div className="mt-8">
              <h3 className="font-display text-base font-bold text-white mb-2">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {movie.overview || 'Aucun synopsis disponible pour ce titre.'}
              </p>
            </div>

            {/* Director & Cast */}
            {(movie.director || (movie.cast && movie.cast.length > 0)) && (
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {movie.director && (
                  <div>
                    <span className="text-slate-500 font-medium">Réalisation : </span>
                    <span className="text-white font-semibold">{movie.director}</span>
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium">Casting : </span>
                    <span className="text-slate-200">
                      {movie.cast.map((actor, idx) => (
                        <span key={actor}>
                          <button
                            type="button"
                            onClick={() => {
                              if (onSearchActor) {
                                onSearchActor(actor);
                                onClose();
                              }
                            }}
                            className="hover:text-purple-300 underline underline-offset-2 decoration-purple-500/40 hover:decoration-purple-400 font-medium transition-colors cursor-pointer"
                            title={`Rechercher les films avec ${actor}`}
                          >
                            {actor}
                          </button>
                          {idx < (movie.cast?.length || 0) - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* WHERE TO WATCH SECTION (PRIMARY PURPOSE OF THE APP) */}
            {/* ============================================================== */}
            <div className="mt-8 pt-8 border-t border-white/15 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-purple-400" />
                    <span>Disponibilités & Séances</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Streaming ({country}), séances UGC cinéma et comparateur de prix
                  </p>
                </div>

                {/* Sub-tabs selector */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('streaming')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'streaming'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Streaming
                  </button>
                  <button
                    onClick={() => setActiveTab('cinema')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'cinema'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Séances UGC</span>
                    {isTheatrical && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('comparator')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'comparator'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Comparateur VOD
                  </button>
                </div>
              </div>

              {/* TAB 1: STREAMING PROVIDERS */}
              {activeTab === 'streaming' && (
                <>
                  {isLoading ? (
                    <div className="p-8 rounded-2xl bg-[#1a1d2e] border border-white/10 flex items-center justify-center gap-3 text-slate-300">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                      <span className="text-sm font-medium">Recherche des plateformes de streaming…</span>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Highlight Banner if movie is on user's subscription! */}
                      {matchedSubscribed.length > 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-start gap-3 text-emerald-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-emerald-300">
                              Bonne nouvelle ! Ce film est inclus dans vos abonnements :
                            </p>
                            <p className="text-xs text-emerald-200 mt-1">
                              Disponible sur{' '}
                              <span className="font-bold underline">
                                {[...new Set(matchedSubscribed.map((s) => s.provider_name))].join(', ')}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 1. Flatrate / Subscription Streaming */}
                      {flatrateList.length > 0 ? (
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-purple-400 mb-2.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Inclus avec un abonnement streaming</span>
                          </h4>
                          {renderProviderPills(flatrateList, 'included')}
                        </div>
                      ) : null}

                      {/* 2. Free / AVOD */}
                      {freeList.length > 0 ? (
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Gratuit (100% sans frais / publicitaire)</span>
                          </h4>
                          {renderProviderPills(freeList, 'free')}
                        </div>
                      ) : null}

                      {/* 3. Rent (Location) */}
                      {rentList.length > 0 ? (
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                            <span>En location payante (VOD à l'acte)</span>
                          </h4>
                          {renderProviderPills(rentList, 'rent')}
                        </div>
                      ) : null}

                      {/* 4. Buy (Achat) */}
                      {buyList.length > 0 ? (
                        <div>
                          <h4 className="text-xs uppercase font-bold tracking-wider text-blue-400 mb-2.5 flex items-center gap-1.5">
                            <span>À l'achat définitif (Digital)</span>
                          </h4>
                          {renderProviderPills(buyList, 'buy')}
                        </div>
                      ) : null}

                      {/* If no offers recorded for this specific country */}
                      {flatrateList.length === 0 &&
                        freeList.length === 0 &&
                        rentList.length === 0 &&
                        buyList.length === 0 && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#171a29] border border-white/10 text-slate-300 text-xs sm:text-sm">
                            <p className="font-semibold text-white">
                              Aucune offre de streaming direct répertoriée pour ce film en {country} pour le moment.
                            </p>
                            <p className="text-slate-400 mt-1">
                              {isTheatrical
                                ? 'Ce film est actuellement en exclusivité au cinéma ! Consultez l\'onglet Séances UGC.'
                                : 'Activez une alerte pour être prévenu dès qu\'il sera disponible sur vos plateformes.'}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: UGC CINEMAS */}
              {activeTab === 'cinema' && (
                <UgcCinemasFinder movieTitle={movie.title} />
              )}

              {/* TAB 3: PRICE COMPARATOR */}
              {activeTab === 'comparator' && (
                <PriceComparator movieTitle={movie.title} isRecent={movie.year === '2024' || movie.year === '2025'} />
              )}

              {/* Action buttons (Watchlist + Alert + Apple) */}
              <div className="pt-2 flex flex-wrap gap-2.5 border-t border-white/10">
                {movie.storeUrl && (
                  <a
                    href={movie.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#202438] hover:bg-[#282d47] text-white text-xs sm:text-sm font-semibold border border-white/10 flex items-center gap-2 transition-all"
                  >
                    <span>Ouvrir sur Apple TV</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onToggleWatchlist(movie)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all ${
                    isWatchlisted
                      ? 'bg-purple-900/50 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-600/20'
                      : 'bg-[#202438] hover:bg-[#282d47] border-white/10 text-white'
                  }`}
                >
                  {isWatchlisted ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
                      <span>Dans ma liste personnelle</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>Ajouter à ma liste</span>
                    </>
                  )}
                </button>

                {/* Availability Alert Button */}
                <button
                  type="button"
                  onClick={handleToggleAlert}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all ${
                    hasAlert
                      ? 'bg-purple-900/50 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-600/20'
                      : 'bg-[#202438] hover:bg-[#282d47] border-white/10 text-white'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${hasAlert ? 'fill-purple-400 text-purple-400' : 'text-slate-400'}`} />
                  <span>{hasAlert ? 'Alerte active sur mes abonnements' : 'M\'alerter dès qu\'il arrive en streaming'}</span>
                </button>
              </div>

              {/* Footnote */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Disponibilités et offres streaming synchronisées en temps réel. Les catalogues évoluent régulièrement.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Trailer Modal Overlay */}
        {showTrailer && youtubeEmbedUrl && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col p-4 sm:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-white text-base">
                Bande-annonce : {movie.title}
              </span>
              <button
                onClick={() => setShowTrailer(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Fermer la vidéo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full h-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={youtubeEmbedUrl}
                title={`Bande-annonce ${movie.title}`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
