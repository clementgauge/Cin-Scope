import React, { useState, useEffect } from 'react';
import { UgcShowtime } from '../types';
import { getUgcShowtimesForMovie } from '../data/ugcData';
import {
  MapPin,
  Compass,
  Clock,
  Ticket,
  ExternalLink,
  Sparkles,
  Navigation,
  Loader2,
} from 'lucide-react';

interface UgcCinemasFinderProps {
  movieTitle: string;
}

const POPULAR_CITIES = ['Paris', 'Lyon', 'Bordeaux', 'Strasbourg', 'Lille', 'Toulouse', 'Nantes'];

export const UgcCinemasFinder: React.FC<UgcCinemasFinderProps> = ({ movieTitle }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Paris');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Get showtimes based on location
  const showtimes = getUgcShowtimesForMovie(
    movieTitle,
    userCoords?.lat,
    userCoords?.lng,
    userCoords ? undefined : selectedCity
  );

  // Request browser geolocation
  const handleRequestGeo = () => {
    if (!navigator.geolocation) {
      setGeoError('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError('Localisation refusée ou indisponible. Vous pouvez choisir votre ville.');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16192c] to-[#121422] border border-purple-500/30 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-3 h-3" />
            <span>Actuellement en salle de cinéma</span>
          </div>
          <h4 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <span>Séances UGC pour « {movieTitle} »</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Trouvez les cinémas UGC les plus proches de votre position en France
          </p>
        </div>

        {/* Location toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestGeo}
            disabled={isLocating}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              userCoords
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>{userCoords ? 'GPS Actif (Cinés proches)' : 'Autour de moi'}</span>
          </button>

          {!userCoords && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#171a2d] border border-white/15 text-white text-xs font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c} className="bg-[#121422]">
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {geoError && (
        <p className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
          {geoError}
        </p>
      )}

      {/* UGC Cinemas List */}
      <div className="space-y-3">
        {showtimes.map((cinema, idx) => (
          <div
            key={cinema.cinemaName}
            className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-purple-500/30 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{cinema.cinemaName}</span>
                  </h5>
                  {cinema.distanceKm !== undefined && (
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.2 rounded border border-purple-500/20">
                      {cinema.distanceKm} km
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {cinema.address}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  UGC Illimité 🎟️
                </span>
                <a
                  href={cinema.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-md"
                >
                  <span>Réserver sur UGC.fr</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Room Format & Showtimes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-medium text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{cinema.format}</span>
              </span>

              {/* Times badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {cinema.times.map((time, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-white/5 hover:bg-purple-600/30 text-white border border-white/10 transition-colors cursor-pointer"
                    title={`Séance de ${time} au ${cinema.cinemaName}`}
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
