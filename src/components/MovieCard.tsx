import React from 'react';
import { Movie } from '../types';
import { STREAMING_PROVIDERS } from '../data/providers';
import { Star, Bookmark, BookmarkCheck, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  country: string;
  userSubs: number[];
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie, e: React.MouseEvent) => void;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  country,
  userSubs,
  isWatchlisted,
  onToggleWatchlist,
  onClick,
}) => {
  // Check flatrate providers for this movie in current country
  const provs = movie.cachedProviders?.[country]?.flatrate || [];
  
  // Find which of these providers match user's subscriptions
  const matchedUserSubs = provs.filter((p) =>
    STREAMING_PROVIDERS.some((sp) => userSubs.includes(sp.id) && sp.ids.includes(p.provider_id))
  );

  const isIncludedInUserSubs = matchedUserSubs.length > 0;

  return (
    <article
      onClick={() => onClick(movie)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(movie);
        }
      }}
      className="group relative flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl transition-all duration-200 hover:-translate-y-1.5"
      aria-label={`Voir où regarder ${movie.title}`}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#181a29] border border-white/10 shadow-lg shadow-black/40">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`Affiche de ${movie.title}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback to styled card
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.parentElement?.querySelector('.poster-fallback');
              if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback container */}
        <div
          className={`poster-fallback absolute inset-0 bg-gradient-to-br from-[#241c3a] to-[#141724] p-4 flex flex-col items-center justify-center text-center ${
            movie.poster ? 'hidden' : 'flex'
          }`}
        >
          <Film className="w-8 h-8 text-purple-400 mb-2 opacity-60" />
          <span className="font-display font-bold text-sm text-slate-200 line-clamp-3">
            {movie.title}
          </span>
        </div>

        {/* Top Badges: Rating & Watchlist */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {movie.rating > 0 ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold font-mono shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{movie.rating}</span>
            </div>
          ) : <div />}

          <button
            type="button"
            onClick={(e) => onToggleWatchlist(movie, e)}
            aria-label={isWatchlisted ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
            className="pointer-events-auto p-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white transition-transform active:scale-90"
          >
            {isWatchlisted ? (
              <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
            ) : (
              <Bookmark className="w-4 h-4 text-slate-300 hover:text-white" />
            )}
          </button>
        </div>

        {/* Bottom Badge for Subscribed Platforms */}
        {isIncludedInUserSubs && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">Inclus dans vos abonnements</span>
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="mt-3 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {movie.title}
        </h3>

        {/* Metadata: Unboxed clean inline text with separators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
          <span>{movie.year || 'Film'}</span>
          {movie.genres?.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{movie.genres[0]}</span>
            </>
          )}
          {movie.runtime ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{movie.runtime} min</span>
            </>
          ) : null}
        </div>

        {/* Lead actor if available */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="text-[11px] text-slate-400 truncate mt-1">
            <span className="text-slate-500">Avec </span>
            <span className="text-slate-300 font-medium">{movie.cast.slice(0, 2).join(', ')}</span>
          </div>
        )}

        {/* Quick Streaming Available Preview */}
        {provs.length > 0 ? (
          <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Sur :
            </span>
            <div className="flex items-center gap-1 truncate">
              {provs.slice(0, 3).map((p) => {
                const sp = STREAMING_PROVIDERS.find((s) => s.ids.includes(p.provider_id));
                const isMine = sp && userSubs.includes(sp.id);
                return (
                  <span
                    key={p.provider_id}
                    title={p.provider_name}
                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium border ${
                      isMine
                        ? 'bg-purple-950/60 border-purple-500/60 text-purple-200'
                        : 'bg-white/[0.05] border-white/10 text-slate-300'
                    }`}
                  >
                    {p.provider_name.split(' ')[0]}
                  </span>
                );
              })}
              {provs.length > 3 && (
                <span className="text-[10px] text-slate-500">+{provs.length - 3}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-2 text-[11px] text-slate-500 group-hover:text-purple-400/80 transition-colors">
            Voir où regarder →
          </div>
        )}
      </div>
    </article>
  );
};
