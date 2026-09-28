import React, { useState } from 'react';
import { STREAMING_PROVIDERS, COUNTRIES } from '../data/providers';
import { X, Check, Globe, Tv } from 'lucide-react';

interface SettingsModalProps {
  currentCountry: string;
  currentSubs: number[];
  onSave: (subs: number[], country: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentCountry,
  currentSubs,
  onSave,
  onClose,
}) => {
  const [selectedSubs, setSelectedSubs] = useState<number[]>(currentSubs);
  const [selectedCountry, setSelectedCountry] = useState<string>(currentCountry);

  const toggleSub = (providerId: number) => {
    setSelectedSubs((prev) =>
      prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId]
    );
  };

  const handleSave = () => {
    onSave(selectedSubs, selectedCountry);
    onClose();
  };

  const subscriptionProviders = STREAMING_PROVIDERS.filter((p) => !p.rentOnly);

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="relative w-full max-w-2xl bg-[#141724] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto p-5 sm:p-8 text-left max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer les paramètres"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 sm:mb-6 pr-8">
          <div className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-purple-400 mb-1">
            Personnalisation
          </div>
          <h2 id="settings-title" className="font-display text-xl sm:text-3xl font-extrabold text-white">
            Mes abonnements & Préférences ⚙️
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Activez vos plateformes favorites pour identifier instantanément les films inclus dans vos forfaits.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 pr-0.5 space-y-5">
          {/* 1. Subscriptions Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Mes plateformes de streaming actives</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-60 sm:max-h-56 overflow-y-auto pr-1">
              {subscriptionProviders.map((p) => {
                const checked = selectedSubs.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => toggleSub(p.id)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                      checked
                        ? 'bg-purple-950/70 border-purple-500/70 shadow-sm shadow-purple-500/20 text-white ring-1 ring-purple-500/40'
                        : 'bg-[#1a1d2e] border-white/10 text-slate-300 hover:border-white/20 hover:bg-[#202438]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.short}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">{p.name}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        checked
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-white/20 bg-black/20'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Country Selector */}
          <div>
            <label htmlFor="settings-country-select" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Mon pays (pour les disponibilités de diffusion)</span>
            </label>
            <select
              id="settings-country-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-[#1a1d2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#141724]">
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            Enregistrer mes choix
          </button>
        </div>
      </div>
    </div>
  );
};
