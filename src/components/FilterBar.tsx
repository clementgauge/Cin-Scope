import React, { useState } from 'react';
import { CategoryType, CostFilterType } from '../types';
import {
  Sparkles,
  Flame,
  Star,
  Calendar,
  Tv,
  Bookmark,
  X,
  CheckCircle,
  DollarSign,
  Layers,
  Clock,
  SlidersHorizontal,
  User,
  Ticket,
} from 'lucide-react';

interface FilterBarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  costFilter: CostFilterType;
  onSelectCostFilter: (cost: CostFilterType) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  mineCount?: number;
  watchlistCount?: number;
  selectedRuntime: string;
  onSelectRuntime: (rt: string) => void;
  selectedRating: number;
  onSelectRating: (r: number) => void;
  selectedYearRange: string;
  onSelectYearRange: (yr: string) => void;
  selectedActor: string;
  onSelectActor: (actor: string) => void;
}

const CATEGORIES: { id: CategoryType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'trending', label: 'Tendances', icon: Sparkles },
  { id: 'popular', label: 'Populaires', icon: Flame },
  { id: 'top_rated', label: 'Mieux notés', icon: Star },
  { id: 'now_playing', label: 'Récents', icon: Calendar },
  { id: 'upcoming', label: 'Bientôt chez vous 📅', icon: Calendar },
  { id: 'cinemas', label: 'Au Cinéma UGC 🍿', icon: Ticket },
  { id: 'mine', label: 'Mes plateformes', icon: Tv },
  { id: 'watchlist', label: 'Ma liste', icon: Bookmark },
];

const GENRES = [
  'Tous les genres',
  'Action',
  'Aventure',
  'Animation',
  'Comédie',
  'Crime',
  'Drame',
  'Fantastique',
  'Histoire',
  'Horreur',
  'Mystère',
  'Romance',
  'Science-Fiction',
  'Thriller',
];

const RUNTIME_OPTIONS = [
  { id: 'all', label: 'Toutes durées' },
  { id: '<90', label: '< 90 min' },
  { id: '90-120', label: '1h30 - 2h' },
  { id: '>120', label: '> 2h' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'Toutes notes' },
  { value: 7.0, label: '7.0+ ★' },
  { value: 7.5, label: '7.5+ ★' },
  { value: 8.0, label: '8.0+ ★' },
];

const YEAR_OPTIONS = [
  { id: 'all', label: 'Toutes années' },
  { id: '2025-2026', label: '2025 - 2026' },
  { id: '2020-2024', label: '2020 - 2024' },
  { id: '2010-2019', label: 'Années 2010s' },
  { id: '2000-2009', label: 'Années 2000s' },
  { id: 'before-2000', label: 'Avant 2000' },
];

const POPULAR_ACTORS = [
  'Leonardo DiCaprio',
  'Zendaya',
  'Timothée Chalamet',
  'Ryan Gosling',
  'Margot Robbie',
  'Tom Holland',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedGenre,
  onSelectGenre,
  costFilter,
  onSelectCostFilter,
  searchQuery,
  onClearSearch,
  mineCount,
  watchlistCount,
  selectedRuntime,
  onSelectRuntime,
  selectedRating,
  onSelectRating,
  selectedYearRange,
  onSelectYearRange,
  selectedActor,
  onSelectActor,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const hasActiveAdvancedFilters =
    selectedRuntime !== 'all' ||
    selectedRating > 0 ||
    selectedYearRange !== 'all' ||
    Boolean(selectedActor);

  const handleResetFilters = () => {
    onSelectRuntime('all');
    onSelectRating(0);
    onSelectYearRange('all');
    onSelectActor('');
    onSelectGenre('Tous les genres');
    onSelectCostFilter('all');
  };

  return (
    <div className="space-y-4 my-6">
      {/* Search active notice */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3.5 bg-purple-950/40 border border-purple-800/40 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-purple-200">
            <span className="font-semibold">Recherche :</span>
            <span>« {searchQuery} »</span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-800 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#141724] border border-white/10 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = !searchQuery && activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              {cat.id === 'mine' && typeof mineCount === 'number' && mineCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-black/20 text-white' : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {mineCount}
                </span>
              )}
              {cat.id === 'watchlist' && typeof watchlistCount === 'number' && watchlistCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-black/20 text-white' : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {watchlistCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-filters Bar: Free / Included vs Rental/Buy + Genre selector + Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Cost / Formula Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141724] border border-white/10 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          <span className="text-xs font-semibold text-slate-400 px-2 hidden lg:inline">
            Formule :
          </span>
          <button
            type="button"
            onClick={() => onSelectCostFilter('all')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              costFilter === 'all'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Toutes offres</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCostFilter('free')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              costFilter === 'free'
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 shadow-sm'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inclus abonnement</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCostFilter('rent_buy')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              costFilter === 'rent_buy'
                ? 'bg-amber-950/80 border border-amber-500/60 text-amber-200 shadow-sm'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-950/20'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>VOD Payante</span>
          </button>
        </div>

        {/* Right side controls: Genre + Advanced filters toggle */}
        <div className="flex items-center gap-2.5">
          <select
            id="genre-select"
            aria-label="Sélectionner le genre"
            value={selectedGenre}
            onChange={(e) => onSelectGenre(e.target.value)}
            className="bg-[#141724] border border-white/10 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          >
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-[#141724] text-white">
                {g}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              showAdvanced || hasActiveAdvancedFilters
                ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                : 'bg-[#141724] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtres précis</span>
            {hasActiveAdvancedFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel (Durée, Note, Année, Acteurs) */}
      {showAdvanced && (
        <div className="p-4 rounded-2xl bg-[#141724] border border-white/10 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Critères personnalisés (Temps, Note, Année, Acteur)
            </span>
            {hasActiveAdvancedFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-400 hover:text-white underline transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Runtime / Durée */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Durée du film :</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {RUNTIME_OPTIONS.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => onSelectRuntime(rt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selectedRuntime === rt.id
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note minimale */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                <span>Note spectateurs :</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {RATING_OPTIONS.map((ro) => (
                  <button
                    key={ro.value}
                    onClick={() => onSelectRating(ro.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selectedRating === ro.value
                        ? 'bg-amber-500/30 border-amber-500 text-amber-200 font-bold'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ro.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Année / Époque */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>Période de sortie :</span>
              </label>
              <select
                aria-label="Sélectionner l'année"
                value={selectedYearRange}
                onChange={(e) => onSelectYearRange(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {YEAR_OPTIONS.map((yr) => (
                  <option key={yr.id} value={yr.id} className="bg-[#121422]">
                    {yr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actor Quick Chips */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3 h-3 text-purple-400" />
              <span className="text-[11px] font-semibold text-slate-400">
                Choisir selon un acteur :
              </span>
              {selectedActor && (
                <span className="text-xs text-purple-300 font-bold">
                  « {selectedActor} »
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_ACTORS.map((act) => (
                <button
                  key={act}
                  onClick={() => onSelectActor(selectedActor === act ? '' : act)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedActor === act
                      ? 'bg-purple-600 border-purple-500 text-white font-bold'
                      : 'bg-black/20 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {act} {selectedActor === act ? '✓' : ''}
                </button>
              ))}
              {selectedActor && (
                <button
                  onClick={() => onSelectActor('')}
                  className="text-[11px] px-2 py-1 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-800/40"
                >
                  Effacer acteur ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

