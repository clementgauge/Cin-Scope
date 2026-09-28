import React, { useState } from 'react';
import { Movie, QuizAnswers, AiMovieRecommendation } from '../types';
import { STREAMING_PROVIDERS } from '../data/providers';
import { CURATED_MOVIES } from '../data/curatedMovies';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Clock,
  Star,
  Film,
  Calendar,
  User,
  Tv,
  Loader2,
  Bookmark,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

interface QuizModalProps {
  userSubs: number[];
  country: string;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  watchlist: (string | number)[];
}

const MOOD_OPTIONS = [
  { id: 'detente', label: 'Détente & Rire', desc: 'Rire sans prise de tête, comédie lumineuse', emoji: '😄' },
  { id: 'frissons', label: 'Frissons & Tension', desc: 'Suspense suffocant, thriller ou épouvante', emoji: '😱' },
  { id: 'evasion', label: 'Évasion & Aventure', desc: 'Voyage lointain, paysages grandioses, odyssée', emoji: '🚀' },
  { id: 'emotion', label: 'Émotion & Larmes', desc: 'Drame poignant, histoire humaine bouleversante', emoji: '🥺' },
  { id: 'reflexion', label: 'Réflexion & Mindfuck', desc: 'Scénario à tiroirs, intrigues philosophiques', emoji: '🧠' },
  { id: 'action', label: 'Adrénaline & Action', desc: 'Rythme d\'enfer, courses-poursuites, grand spectacle', emoji: '💥' },
  { id: 'romance', label: 'Romance & Douceur', desc: 'Papillons dans le ventre, coup de foudre, poésie', emoji: '✨' },
  { id: 'mystere', label: 'Mystère & Enquête', desc: 'Cluedo géant, secrets de famille, détectives', emoji: '🕵️‍♂️' },
];

const CONTEXT_OPTIONS = [
  { id: 'solo', label: 'Seul·e au calme', desc: 'Immersion totale dans votre bulle', icon: '👤' },
  { id: 'couple', label: 'En amoureux / couple', desc: 'Film complice qui plaît aux deux', icon: '💑' },
  { id: 'famille', label: 'En famille / enfants', desc: 'Accessible à toutes les générations', icon: '👨‍👩‍👧' },
  { id: 'amis', label: 'Soirée entre potes', desc: 'Fun, rythmé, idéal avec une pizza', icon: '🍕' },
];

const RUNTIME_OPTIONS = [
  { id: 'any', label: 'Peu importe la durée', desc: 'Laissez libre cours à l\'inspiration' },
  { id: '<90', label: 'Court (< 1h30)', desc: 'Rapide, sans temps mort, parfait s\'il est tard' },
  { id: '90-120', label: 'Standard (1h30 - 2h)', desc: 'Le format classique idéal' },
  { id: '120-150', label: 'Long métrage (2h - 2h30)', desc: 'Pour les intrigues développées' },
  { id: '>150', label: 'Fresque épique (> 2h30)', desc: 'Grand spectacle fleuve et grandiose' },
];

const ERA_OPTIONS = [
  { id: 'any', label: 'Peu importe l\'époque', desc: 'Toutes les décennies' },
  { id: 'recent', label: 'Ultra Récent (2022 - 2026)', desc: 'Nouveautés cinéma et streaming' },
  { id: '2010s', label: 'Années 2010s (2010 - 2021)', desc: 'Les grands blockbusters modernes' },
  { id: '2000s', label: 'Années 2000s (2000 - 2009)', desc: 'L\'âge d\'or du cinéma culte moderne' },
  { id: 'classic', label: 'Classiques (Avant 2000)', desc: 'Chefs-d\'œuvre intemporels' },
];

const SUGGESTED_ACTORS = [
  'Leonardo DiCaprio',
  'Zendaya',
  'Timothée Chalamet',
  'Ryan Gosling',
  'Margot Robbie',
  'Tom Holland',
  'Brad Pitt',
  'Cillian Murphy',
  'François Civil',
  'Emma Stone',
];

export const QuizModal: React.FC<QuizModalProps> = ({
  userSubs,
  country,
  onClose,
  onSelectMovie,
  onToggleWatchlist,
  watchlist,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<string>('evasion');
  const [selectedContext, setSelectedContext] = useState<string>('solo');
  const [selectedRuntime, setSelectedRuntime] = useState<string>('90-120');
  const [selectedEra, setSelectedEra] = useState<string>('recent');
  const [minRating, setMinRating] = useState<number>(7.2);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(userSubs);
  const [actorInput, setActorInput] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AiMovieRecommendation[]>([]);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const totalSteps = 6;

  // Toggle platform selection in quiz
  const togglePlatform = (id: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Submit quiz to server-side AI endpoint
  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    setHasCompleted(true);
    try {
      const platformNames = selectedPlatforms
        .map((pid) => STREAMING_PROVIDERS.find((p) => p.id === pid)?.name)
        .filter(Boolean);

      const moodObj = MOOD_OPTIONS.find((m) => m.id === selectedMood);
      const contextObj = CONTEXT_OPTIONS.find((c) => c.id === selectedContext);
      const runtimeObj = RUNTIME_OPTIONS.find((r) => r.id === selectedRuntime);
      const eraObj = ERA_OPTIONS.find((e) => e.id === selectedEra);

      const res = await fetch('/api/ai/quiz-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: `${moodObj?.label} (${moodObj?.desc})`,
          context: `${contextObj?.label} (${contextObj?.desc})`,
          runtime: runtimeObj?.label,
          era: eraObj?.label,
          minRating,
          platforms: platformNames,
          actors: actorInput.trim(),
        }),
      });

      const data = await res.json();
      if (data?.recommendations && Array.isArray(data.recommendations)) {
        // Enrich recommendations with matching posters from CURATED_MOVIES if available
        const enriched = data.recommendations.map((rec: AiMovieRecommendation) => {
          const matchInCurated = CURATED_MOVIES.find(
            (c) => c.title.toLowerCase() === rec.title.toLowerCase() ||
                   c.originalTitle?.toLowerCase() === rec.title.toLowerCase()
          );
          return {
            ...rec,
            movieId: matchInCurated ? matchInCurated.id : `ai-${rec.title.replace(/\s+/g, '-').toLowerCase()}`,
            poster: matchInCurated?.poster || rec.poster,
            rating: matchInCurated?.rating || rec.rating || 7.8,
            runtime: matchInCurated?.runtime || rec.runtime || 120,
            overview: matchInCurated?.overview,
          };
        });
        setRecommendations(enriched);
      }
    } catch (err) {
      console.error('Quiz AI Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setStep(1);
    setHasCompleted(false);
    setRecommendations([]);
  };

  // Find movie object to open modal
  const handleOpenMovie = (rec: AiMovieRecommendation) => {
    const match = CURATED_MOVIES.find(
      (c) => c.title.toLowerCase() === rec.title.toLowerCase() ||
             c.originalTitle?.toLowerCase() === rec.title.toLowerCase()
    );

    if (match) {
      onSelectMovie(match);
    } else {
      const syntheticMovie: Movie = {
        id: rec.movieId || `ai-${rec.title}`,
        title: rec.title,
        year: rec.year,
        overview: rec.reason,
        poster: rec.poster || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx12N.jpg',
        backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
        rating: rec.rating || 8.0,
        genres: rec.genres || ['Cinéma'],
        runtime: rec.runtime || 120,
        director: rec.director,
        cast: rec.cast,
        source: 'curated',
      };
      onSelectMovie(syntheticMovie);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121422] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16192c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Quiz Ciné</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Style anzx.fr + IA
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Trouvez le film parfait en quelques questions selon vos goûts et vos abonnements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer le quiz"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (if not completed) */}
        {!hasCompleted && (
          <div className="w-full bg-white/5 h-1.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
          {isLoading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin [animation-duration:1.5s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-6 h-6 text-purple-300 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">
                  L'IA personnelle consulte votre profil…
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Croisement de votre humeur, durée souhaitée, note minimale et catalogues streaming disponibles en France.
                </p>
              </div>
            </div>
          ) : hasCompleted ? (
            /* Results Screen */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Analyse IA terminée avec succès !</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white">
                  Voici vos films recommandés pour ce soir 🍿
                </h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Sélection sur-mesure basée sur votre humeur ({MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label}) et vos critères.
                </p>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#171a2d] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row gap-4 group"
                  >
                    {/* Poster preview */}
                    <div
                      onClick={() => handleOpenMovie(rec)}
                      className="w-20 sm:w-24 aspect-[2/3] rounded-xl bg-slate-800 shrink-0 overflow-hidden cursor-pointer relative shadow-md"
                    >
                      {rec.poster ? (
                        <img src={rec.poster} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-slate-400">
                          {rec.title}
                        </div>
                      )}
                    </div>

                    {/* Movie Info & Reason */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            onClick={() => handleOpenMovie(rec)}
                            className="font-display font-bold text-base text-white hover:text-purple-300 transition-colors cursor-pointer truncate"
                          >
                            {rec.title}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                            {rec.matchScore}% Match
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                          <span>{rec.year}</span>
                          {rec.runtime && (
                            <>
                              <span>·</span>
                              <span>{rec.runtime} min</span>
                            </>
                          )}
                          {rec.rating && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                                <Star className="w-3 h-3 fill-amber-300" />
                                <span>{rec.rating}</span>
                              </span>
                            </>
                          )}
                          {rec.suggestedPlatform && (
                            <>
                              <span>·</span>
                              <span className="text-purple-300 font-medium">
                                {rec.suggestedPlatform}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mt-2.5 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                          💡 <span className="font-semibold text-purple-200">Pourquoi l'IA vous le conseille :</span> {rec.reason}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleOpenMovie(rec)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>Voir les disponibilités</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Footer button */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommencer le quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Question View */
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Étape {step} sur {totalSteps}</span>
                <span className="text-purple-400 font-medium">
                  {step === 1 && 'Humeur & Ambiance'}
                  {step === 2 && 'Contexte de visionnage'}
                  {step === 3 && 'Durée & Temps souhaité'}
                  {step === 4 && 'Époque & Année'}
                  {step === 5 && 'Note minimale & Acteurs'}
                  {step === 6 && 'Vos abonnements streaming'}
                </span>
              </div>

              {/* STEP 1: MOOD */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">
                    Quelle est votre humeur ce soir ?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                          selectedMood === mood.id
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/10'
                            : 'bg-[#171a2d] border-white/10 text-slate-300 hover:border-white/20 hover:bg-[#1a1e34]'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{mood.emoji}</span>
                        <div>
                          <div className="font-semibold text-sm text-white">{mood.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5 leading-snug">{mood.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: CONTEXT */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">
                    Avec qui regardez-vous le film ?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONTEXT_OPTIONS.map((ctx) => (
                      <button
                        key={ctx.id}
                        type="button"
                        onClick={() => setSelectedContext(ctx.id)}
                        className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                          selectedContext === ctx.id
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/10'
                            : 'bg-[#171a2d] border-white/10 text-slate-300 hover:border-white/20 hover:bg-[#1a1e34]'
                        }`}
                      >
                        <span className="text-3xl shrink-0">{ctx.icon}</span>
                        <div>
                          <div className="font-semibold text-sm text-white">{ctx.label}</div>
                          <div className="text-xs text-slate-400 mt-1">{ctx.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: RUNTIME / DURÉE */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-white">
                      Combien de temps avez-vous ?
                    </h3>
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-2.5">
                    {RUNTIME_OPTIONS.map((rt) => (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => setSelectedRuntime(rt.id)}
                        className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          selectedRuntime === rt.id
                            ? 'bg-purple-600/20 border-purple-500 text-white'
                            : 'bg-[#171a2d] border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-sm text-white">{rt.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{rt.desc}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedRuntime === rt.id ? 'border-purple-400 bg-purple-500' : 'border-slate-500'
                          }`}
                        >
                          {selectedRuntime === rt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: ERA / ANNÉE */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-white">
                      Quelle époque / année préférez-vous ?
                    </h3>
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-2.5">
                    {ERA_OPTIONS.map((era) => (
                      <button
                        key={era.id}
                        type="button"
                        onClick={() => setSelectedEra(era.id)}
                        className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                          selectedEra === era.id
                            ? 'bg-purple-600/20 border-purple-500 text-white'
                            : 'bg-[#171a2d] border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-sm text-white">{era.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{era.desc}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedEra === era.id ? 'border-purple-400 bg-purple-500' : 'border-slate-500'
                          }`}
                        >
                          {selectedEra === era.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: MIN RATING & ACTORS */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-1">
                      Note minimale & Acteurs souhaités
                    </h3>
                    <p className="text-xs text-slate-400">
                      Affinez la qualité exigée et mentionnez vos acteurs préférés.
                    </p>
                  </div>

                  {/* Rating Slider */}
                  <div className="p-4 rounded-2xl bg-[#171a2d] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Note minimale spectateurs</span>
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        {minRating} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="8.8"
                      step="0.2"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>6.0 (Accessible)</span>
                      <span>7.5 (Très bon film)</span>
                      <span>8.5+ (Chef-d'œuvre)</span>
                    </div>
                  </div>

                  {/* Actors input & suggestions */}
                  <div className="p-4 rounded-2xl bg-[#171a2d] border border-white/10 space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Acteur(s) ou Réalisateur(s) spécifique(s) (facultatif)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Zendaya, Christopher Nolan, Ryan Gosling..."
                      value={actorInput}
                      onChange={(e) => setActorInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e101a] border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    {/* Fast chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {SUGGESTED_ACTORS.map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setActorInput((prev) => prev ? `${prev}, ${act}` : act)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white border border-white/10 transition-colors"
                        >
                          + {act}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: STREAMING PLATFORMS */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        Vos plateformes de streaming
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        L'IA privilégiera les films disponibles sur vos abonnements actuels.
                      </p>
                    </div>
                    <Tv className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {STREAMING_PROVIDERS.map((provider) => {
                      const isSelected = selectedPlatforms.includes(provider.id);
                      return (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => togglePlatform(provider.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                              : 'bg-[#171a2d] border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {provider.logoUrl ? (
                            <img
                              src={provider.logoUrl}
                              alt={provider.name}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">
                              {provider.short}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-xs truncate text-white">
                              {provider.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isSelected ? 'Inclus' : 'Désactivé'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Lancer la recommandation IA</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
