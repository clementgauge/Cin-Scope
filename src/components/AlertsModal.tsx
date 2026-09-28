import React, { useState } from 'react';
import { AvailabilityAlert, Movie } from '../types';
import { getStoredAlerts, removeAlert, saveAlert } from '../services/extraFeaturesApi';
import { CURATED_MOVIES } from '../data/curatedMovies';
import { STREAMING_PROVIDERS } from '../data/providers';
import {
  Bell,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  Tv,
  Film,
  Sparkles,
  ExternalLink,
  Volume2,
} from 'lucide-react';

interface AlertsModalProps {
  userSubs: number[];
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onTriggerToast: (msg: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  userSubs,
  onClose,
  onSelectMovie,
  onTriggerToast,
}) => {
  const [alerts, setAlerts] = useState<AvailabilityAlert[]>(getStoredAlerts());

  const handleRemove = (alertId: string) => {
    removeAlert(alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    onTriggerToast('Alerte supprimée');
  };

  const handleTestAlert = (alert: AvailabilityAlert) => {
    onTriggerToast(`🔔 Alerte : « ${alert.movieTitle} » est désormais disponible sur vos abonnements !`);
  };

  const handleOpenMovie = (alert: AvailabilityAlert) => {
    const match = CURATED_MOVIES.find(
      (m) => m.id === alert.movieId || m.title.toLowerCase() === alert.movieTitle.toLowerCase()
    );
    if (match) {
      onSelectMovie(match);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121422] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16192c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Alertes de Disponibilité</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {alerts.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Soyez prévenu dès qu'un film très attendu arrive sur l'une de vos plateformes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body list */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain space-y-4">
          {alerts.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Aucune alerte active pour le moment
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Cliquez sur la cloche d'un film pour être prévenu dès qu'il rejoint Netflix, Disney+, Prime Video ou Canal+.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const isTriggered = alert.status === 'triggered';
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      isTriggered
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-[#171a2d] border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    {/* Poster */}
                    <div
                      onClick={() => handleOpenMovie(alert)}
                      className="w-14 aspect-[2/3] rounded-xl bg-slate-800 shrink-0 overflow-hidden cursor-pointer shadow"
                    >
                      {alert.moviePoster ? (
                        <img src={alert.moviePoster} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-bold p-1">
                          Film
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => handleOpenMovie(alert)}
                          className="font-display font-bold text-sm text-white hover:text-purple-300 transition-colors cursor-pointer truncate"
                        >
                          {alert.movieTitle}
                        </h4>
                        {isTriggered ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Arrivé !</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>En surveillance</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 mt-1">
                        {isTriggered ? (
                          <span className="text-emerald-300 font-medium">
                            {alert.triggeredPlatform ? `Disponible sur ${alert.triggeredPlatform} !` : 'Arrivé sur vos plateformes !'}
                          </span>
                        ) : (
                          <span>
                            Surveille vos {userSubs.length} abonnements de streaming actifs
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-2.5">
                        <button
                          onClick={() => handleOpenMovie(alert)}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>Fiche film</span>
                        </button>

                        <button
                          onClick={() => handleTestAlert(alert)}
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                          title="Tester la notification"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Tester notification</span>
                        </button>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemove(alert.id)}
                      aria-label="Supprimer cette alerte"
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#16192c] flex items-center justify-between text-xs text-slate-400">
          <span>Surveillance automatique activée</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
