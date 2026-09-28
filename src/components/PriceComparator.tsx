import React from 'react';
import { VodPrice } from '../types';
import { getVodPricesForMovie } from '../services/extraFeaturesApi';
import { ExternalLink, Tag, Check, Award } from 'lucide-react';

interface PriceComparatorProps {
  movieTitle: string;
  isRecent?: boolean;
}

export const PriceComparator: React.FC<PriceComparatorProps> = ({ movieTitle, isRecent = false }) => {
  const prices = getVodPricesForMovie(movieTitle, isRecent);

  const cheapestRent = prices.find((p) => p.isCheapestRent);
  const cheapestBuy = prices.find((p) => p.isCheapestBuy);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#171a2d] border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div>
          <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Comparateur de prix VOD (Location & Achat)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparez les tarifs officiels entre plateformes en France
          </p>
        </div>

        {cheapestRent && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold self-start sm:self-auto">
            <Award className="w-3.5 h-3.5" />
            <span>Dès {cheapestRent.rentPrice?.toFixed(2)} € en location</span>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="pb-2.5">Plateforme</th>
              <th className="pb-2.5">Qualité</th>
              <th className="pb-2.5 text-center">Location 48h</th>
              <th className="pb-2.5 text-center">Achat définitif</th>
              <th className="pb-2.5 text-right">Accès direct</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {prices.map((p) => (
              <tr key={p.providerName} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 flex items-center gap-2.5 font-bold text-white">
                  {p.logoUrl && (
                    <img src={p.logoUrl} alt="" className="w-6 h-6 rounded-md object-cover shadow" />
                  )}
                  <span>{p.providerName}</span>
                </td>
                <td className="py-3 text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono font-bold text-slate-300">
                    {p.quality}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-lg font-mono ${
                      p.isCheapestRent
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-200'
                    }`}
                  >
                    {p.rentPrice?.toFixed(2)} €
                    {p.isCheapestRent && <span className="ml-1 text-[9px]">★ TOP</span>}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-lg font-mono ${
                      p.isCheapestBuy
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-200'
                    }`}
                  >
                    {p.buyPrice?.toFixed(2)} €
                    {p.isCheapestBuy && <span className="ml-1 text-[9px]">★ TOP</span>}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-all text-[11px] font-semibold"
                  >
                    <span>Voir l'offre</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
