import React from 'react';
import { Film, Settings, Bookmark, Globe, Sparkles, Camera, Users, Bell } from 'lucide-react';
import { COUNTRIES } from '../data/providers';
import { CategoryType } from '../types';

interface HeaderProps {
  country: string;
  onCountryChange: (country: string) => void;
  onOpenSettings: () => void;
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  watchlistCount: number;
  subsCount: number;
  onOpenQuiz: () => void;
  onOpenCamera: () => void;
  onOpenFriends: () => void;
  onOpenAlerts: () => void;
  alertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  country,
  onCountryChange,
  onOpenSettings,
  activeCategory,
  onSelectCategory,
  watchlistCount,
  subsCount,
  onOpenQuiz,
  onOpenCamera,
  onOpenFriends,
  onOpenAlerts,
  alertsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0d15]/90 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectCategory('trending')}
            className="flex items-center gap-2.5 text-left group transition-transform focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Ciné<span className="text-purple-400">Scope</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('trending')}
            className={`transition-colors hover:text-white py-1 ${
              activeCategory === 'trending' ? 'text-white font-semibold border-b-2 border-purple-500' : ''
            }`}
          >
            Découvrir
          </button>
          <button
            onClick={() => onSelectCategory('popular')}
            className={`transition-colors hover:text-white py-1 ${
              activeCategory === 'popular' ? 'text-white font-semibold border-b-2 border-purple-500' : ''
            }`}
          >
            Populaires
          </button>
          <button
            onClick={() => onSelectCategory('mine')}
            className={`transition-colors hover:text-white py-1 flex items-center gap-1.5 ${
              activeCategory === 'mine' ? 'text-white font-semibold border-b-2 border-purple-500' : ''
            }`}
          >
            <span>Mes plateformes</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 font-mono">
              {subsCount}
            </span>
          </button>
          <button
            onClick={() => onSelectCategory('watchlist')}
            className={`transition-colors hover:text-white py-1 flex items-center gap-1.5 ${
              activeCategory === 'watchlist' ? 'text-white font-semibold border-b-2 border-purple-500' : ''
            }`}
          >
            <span>À voir</span>
            {watchlistCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 font-mono">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Quiz, Camera, Friends, Alerts, Settings) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* QUIZ BOUTON (anzx.fr style) */}
          <button
            onClick={onOpenQuiz}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Lancer le Quiz Ciné anzx.fr avec recommandation IA"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quiz Ciné</span>
          </button>

          {/* LOGO CAMERA (Visual Movie Identifier) */}
          <button
            onClick={onOpenCamera}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#141724] border border-white/10 hover:border-purple-500/50 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 group shrink-0"
            title="Scanner un extrait de film avec la caméra"
          >
            <Camera className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-medium">Scanner</span>
          </button>

          {/* WATCHLIST PARTAGÉE / AMIS */}
          <button
            onClick={onOpenFriends}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#141724] border border-white/10 hover:border-purple-500/50 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 group shrink-0"
            title="Watchlist partagée · Match entre amis"
          >
            <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline text-xs font-medium">Match Amis</span>
          </button>

          {/* ALERTES DE DISPONIBILITÉ */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl bg-[#141724] border border-white/10 hover:border-purple-500/50 text-slate-200 hover:text-white transition-all shrink-0"
            title="Alertes de disponibilité"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </button>

          {/* Country Selector */}
          <div className="relative hidden lg:flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              aria-label="Sélectionner le pays"
              className="pl-8 pr-2.5 py-1.5 bg-[#141724] border border-white/10 rounded-xl text-xs font-medium text-slate-200 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer appearance-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#141724] text-white">
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Ouvrir les paramètres"
            className="p-2 sm:px-2.5 sm:py-2 bg-[#141724] border border-white/10 rounded-xl text-slate-200 hover:text-white hover:border-purple-500/50 transition-all flex items-center gap-1.5 group shrink-0"
          >
            <Settings className="w-4 h-4 text-slate-300 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

