import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Sparkles, Film } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  onSearchSubmit: (query: string) => void;
  onSelectMovie: (movie: Movie) => void;
  suggestions: Movie[];
  isSearching: boolean;
  onQueryChange: (query: string) => void;
  currentQuery: string;
  onOpenQuiz?: () => void;
  onOpenCamera?: () => void;
  onOpenFriends?: () => void;
  onSelectTheatrical?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  onSelectMovie,
  suggestions,
  isSearching,
  onQueryChange,
  currentQuery,
  onOpenQuiz,
  onOpenCamera,
  onOpenFriends,
  onSelectTheatrical,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      setShowDropdown(false);
      onSearchSubmit(currentQuery.trim());
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d1734] via-[#141724] to-[#241c3a] p-5 sm:p-10 lg:p-14 my-4 sm:my-6 shadow-2xl">
      {/* Decorative Cinema Backdrop Elements */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[32px] border-purple-500/10 pointer-events-none transform -rotate-12" />
      <div className="absolute right-24 -bottom-24 w-64 h-64 rounded-full border-[24px] border-indigo-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-c from-purple-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        {/* Editorial Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-purple-300 mb-2 sm:mb-4">
          <span className="w-4 sm:w-5 h-0.5 bg-purple-400 rounded-full" />
          <span>Guide de streaming universel</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-2.5 sm:mb-4 text-balance">
          Tous vos films.{' '}
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Un seul endroit.
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed mb-5 sm:mb-8 max-w-xl">
          Trouvez un film et découvrez instantanément où le regarder en streaming légal, selon vos plateformes et vos abonnements.
        </p>

        {/* Search Bar Form */}
        <div ref={containerRef} className="relative w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-[#faf9ff] rounded-2xl p-1.5 shadow-xl shadow-black/40 border border-white/20 focus-within:ring-2 focus-within:ring-purple-400 transition-all"
          >
            <div className="pl-3.5 pr-2 text-slate-500">
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>
            <input
              type="text"
              value={currentQuery}
              onChange={(e) => {
                onQueryChange(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (currentQuery.trim().length >= 2) setShowDropdown(true);
              }}
              placeholder="Rechercher un film, un réalisateur, un acteur…"
              className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-500 text-sm sm:text-base font-medium py-2.5 px-1 focus:outline-none"
            />
            {currentQuery && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  setShowDropdown(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors mr-1"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>Chercher</span>
              <span className="hidden sm:inline">→</span>
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#171a29] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-white/5">
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    onSelectMovie(m);
                  }}
                  className="w-full text-left p-3 hover:bg-white/[0.07] flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-14 bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                    {m.poster ? (
                      <img
                        src={m.poster}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Film className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                      {m.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{m.year || 'Année inconnue'}</span>
                      {m.genres?.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="truncate">{m.genres[0]}</span>
                        </>
                      )}
                      {m.rating > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-amber-400 font-medium">★ {m.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity pr-2 shrink-0">
                    Voir disponibilités →
                  </span>
                </button>
              ))}
              <div className="p-2.5 bg-black/20 text-center text-xs text-slate-400">
                Appuyez sur <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-300 font-mono">Entrée</kbd> pour afficher tous les résultats
              </div>
            </div>
          )}
        </div>

        {/* Quick Innovation Buttons (Quiz anzx.fr, Camera Scan, Soirée Amis, UGC Spider-Man) */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {onOpenQuiz && (
            <button
              type="button"
              onClick={onOpenQuiz}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>🎯 Quiz Ciné (anzx.fr)</span>
            </button>
          )}

          {onOpenCamera && (
            <button
              type="button"
              onClick={onOpenCamera}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>📷 Scanner un extrait</span>
            </button>
          )}

          {onOpenFriends && (
            <button
              type="button"
              onClick={onOpenFriends}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>👥 Match de Soirée entre Amis</span>
            </button>
          )}

          {onSelectTheatrical && (
            <button
              type="button"
              onClick={onSelectTheatrical}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>🍿 Spider-Man: Brand New Day (Séances UGC)</span>
            </button>
          )}
        </div>

        {/* Features / Quick Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Disponibilités en direct</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Netflix, Disney+, Prime, Canal+, Max, Apple TV…</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span>Filtre par vos abonnements & séances UGC</span>
        </div>
      </div>
    </div>
  );
};
