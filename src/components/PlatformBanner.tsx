import React from 'react';
import { STREAMING_PROVIDERS } from '../data/providers';
import { SlidersHorizontal, Check } from 'lucide-react';

interface PlatformBannerProps {
  userSubs: number[];
  onToggleSub: (providerId: number) => void;
  onOpenSettings: () => void;
}

export const PlatformBanner: React.FC<PlatformBannerProps> = ({
  userSubs,
  onToggleSub,
  onOpenSettings,
}) => {
  const topProviders = STREAMING_PROVIDERS.filter((p) => [8, 337, 119, 381, 1899, 350].includes(p.id));

  return (
    <div className="my-6 sm:my-10 p-5 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#1e1735] via-[#151725] to-[#251e3c] flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 shadow-xl">
      <div className="max-w-xl">
        <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
          Vos abonnements, vos films.
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Activez vos plateformes ci-dessous pour filtrer instantanément le catalogue et voir les films inclus dans vos forfaits.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Quick Click Toggles for Top Platforms */}
        <div className="flex flex-wrap items-center gap-2">
          {topProviders.map((p) => {
            const isChecked = userSubs.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => onToggleSub(p.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  isChecked
                    ? 'bg-purple-950/70 border-purple-500/70 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-[#181a29] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.short}
                </span>
                <span>{p.name}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* More Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="self-start sm:self-auto px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/15 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Toutes les options</span>
        </button>
      </div>
    </div>
  );
};
