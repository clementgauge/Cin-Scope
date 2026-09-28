import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed, hide prompt button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Chrome / Edge / Android install prompt
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Installer l'application CinéScope sur votre appareil"
        className={`group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/25 border border-purple-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
        }`}
      >
        <img
          src="/pwa-192x192.png"
          alt="CinéScope Logo"
          className="w-5 h-5 rounded-md shadow-sm object-cover border border-white/20"
        />
        <span className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Installer l'app</span>
          <span className="sm:hidden">Installer</span>
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Installer sur iPhone / iPad"
          className={`group flex items-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 border border-white/15 transition-all text-xs font-semibold ${
            compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
          }`}
        >
          <img
            src="/pwa-192x192.png"
            alt="CinéScope Logo"
            className="w-4 h-4 rounded-md object-cover"
          />
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl bg-[#141724] border border-white/15 p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/pwa-192x192.png"
                  alt="CinéScope Logo"
                  className="w-12 h-12 rounded-2xl shadow-md border border-white/20"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Installer CinéScope
                  </h3>
                  <p className="text-xs text-slate-400">Application Web pour Safari iOS</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                  <Share className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>1. Appuyez sur le bouton <strong>Partager</strong> dans la barre inférieure de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                  <PlusSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>2. Faites défiler et sélectionnez <strong>Sur l'écran d'accueil</strong>.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showChromeHelp, setShowChromeHelp] = useState(false);

  // Fallback Chrome desktop / mobile generic button
  return (
    <>
      <button
        type="button"
        onClick={() => setShowChromeHelp(true)}
        title="Installer l'application sur Chrome"
        className={`group flex items-center gap-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30 transition-all font-semibold active:scale-95 ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
      >
        <img
          src="/pwa-192x192.png"
          alt="CinéScope"
          className="w-4 h-4 rounded object-cover shadow-sm"
        />
        <span className="flex items-center gap-1">
          <Download className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Installer l'app</span>
          <span className="sm:hidden">Installer</span>
        </span>
      </button>

      {showChromeHelp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowChromeHelp(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-[#141724] border border-white/15 p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowChromeHelp(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="CinéScope Logo"
                className="w-12 h-12 rounded-2xl shadow-md border border-white/20"
              />
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Installer CinéScope
                </h3>
                <p className="text-xs text-slate-400">Application Chrome & Android</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-5">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-2">
                <p>
                  <strong>Sur Google Chrome ordinateur :</strong> Cliquez sur l'icône d'installation 📥 située à droite dans la barre d'adresse, ou dans le menu ⋮ &gt; <em>« Installer CinéScope »</em>.
                </p>
                <p className="pt-1 border-t border-white/5">
                  <strong>Sur Chrome mobile Android :</strong> Ouvrez le menu ⋮ (trois points) en haut à droite, puis touchez <em>« Ajouter à l'écran d'accueil »</em> ou <em>« Installer l'application »</em>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowChromeHelp(false)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
