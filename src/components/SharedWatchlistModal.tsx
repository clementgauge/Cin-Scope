import React, { useState } from 'react';
import { FriendPreference, Movie } from '../types';
import { CURATED_MOVIES } from '../data/curatedMovies';
import {
  Users,
  X,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Tv,
  Star,
  Film,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface SharedWatchlistModalProps {
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

const AVAILABLE_GENRES = [
  'Action',
  'Aventure',
  'Comédie',
  'Science-Fiction',
  'Thriller',
  'Drame',
  'Horreur',
  'Animation',
  'Romance',
  'Mystère',
  'Fantastique',
];

const COMMON_DISLIKES = [
  'Films lents',
  'Horreur & gore',
  'Comédies lourdes',
  'Histoires d\'amour',
  'Violence excessive',
  'Films de plus de 2h30',
];

const AVATAR_COLORS = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-indigo-600',
];

export const SharedWatchlistModal: React.FC<SharedWatchlistModalProps> = ({
  onClose,
  onSelectMovie,
}) => {
  const [friends, setFriends] = useState<FriendPreference[]>([
    {
      id: 'f1',
      name: 'Augustin',
      avatarColor: AVATAR_COLORS[0],
      favoriteGenres: ['Science-Fiction', 'Action', 'Aventure'],
      dislikes: ['Films lents'],
      favoriteActor: 'Tom Holland',
    },
    {
      id: 'f2',
      name: 'Sarah',
      avatarColor: AVATAR_COLORS[1],
      favoriteGenres: ['Comédie', 'Thriller', 'Mystère'],
      dislikes: ['Horreur & gore'],
      favoriteActor: 'Zendaya',
    },
    {
      id: 'f3',
      name: 'Lucas',
      avatarColor: AVATAR_COLORS[2],
      favoriteGenres: ['Animation', 'Action', 'Fantastique'],
      dislikes: ['Histoires d\'amour'],
    },
  ]);

  const [activeFriendId, setActiveFriendId] = useState<string>('f1');
  const [newFriendName, setNewFriendName] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consensusResult, setConsensusResult] = useState<any | null>(null);

  const currentFriend = friends.find((f) => f.id === activeFriendId) || friends[0];

  // Add friend
  const handleAddFriend = () => {
    if (!newFriendName.trim()) return;
    const newFriend: FriendPreference = {
      id: `f-${Date.now()}`,
      name: newFriendName.trim(),
      avatarColor: AVATAR_COLORS[friends.length % AVATAR_COLORS.length],
      favoriteGenres: ['Comédie', 'Action'],
      dislikes: [],
    };
    setFriends([...friends, newFriend]);
    setActiveFriendId(newFriend.id);
    setNewFriendName('');
    setIsAdding(false);
  };

  // Remove friend
  const handleRemoveFriend = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (friends.length <= 2) {
      alert('Vous devez garder au moins 2 amis pour faire un consensus.');
      return;
    }
    const remaining = friends.filter((f) => f.id !== id);
    setFriends(remaining);
    if (activeFriendId === id) {
      setActiveFriendId(remaining[0].id);
    }
  };

  // Toggle genre for current friend
  const handleToggleGenre = (genre: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== currentFriend.id) return f;
        const exists = f.favoriteGenres.includes(genre);
        return {
          ...f,
          favoriteGenres: exists
            ? f.favoriteGenres.filter((g) => g !== genre)
            : [...f.favoriteGenres, genre],
        };
      })
    );
  };

  // Toggle dislike for current friend
  const handleToggleDislike = (dislike: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== currentFriend.id) return f;
        const exists = f.dislikes.includes(dislike);
        return {
          ...f,
          dislikes: exists ? f.dislikes.filter((d) => d !== dislike) : [...f.dislikes, dislike],
        };
      })
    );
  };

  // Submit to AI
  const handleFindMatch = async () => {
    setIsLoading(true);
    setConsensusResult(null);

    try {
      const res = await fetch('/api/ai/shared-watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friends }),
      });

      const data = await res.json();
      setConsensusResult(data);
    } catch (err) {
      console.error('Shared watchlist error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMovie = (movieTitle: string) => {
    const match = CURATED_MOVIES.find((m) =>
      m.title.toLowerCase().includes(movieTitle.toLowerCase()) ||
      movieTitle.toLowerCase().includes(m.title.toLowerCase())
    );

    if (match) {
      onSelectMovie(match);
      onClose();
    } else {
      const syntheticMovie: Movie = {
        id: `shared-${movieTitle}`,
        title: movieTitle,
        year: '2024',
        overview: 'Sélectionné par consensus IA pour réconcilier tous vos amis ce soir.',
        poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx12N.jpg',
        backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
        rating: 8.2,
        genres: ['Action', 'Aventure'],
        source: 'curated',
      };
      onSelectMovie(syntheticMovie);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121422] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16192c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Watchlist Partagée · Match IA entre Amis</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                L'IA analyse les goûts et aversions de chacun pour trouver le film qui plaira à tout le groupe
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 overscroll-contain space-y-6">
          {isLoading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 animate-spin [animation-duration:1.5s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-300 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">
                  L'IA arbitre les goûts du groupe…
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Résolution des conflits de genres, calcul du compromis idéal et sélection du film de consensus.
                </p>
              </div>
            </div>
          ) : consensusResult ? (
            /* Results Screen */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Consensus trouvé · {consensusResult.consensusScore}% d'accord</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white">
                  Le film qui réconcilie tous vos amis 🎬
                </h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  {consensusResult.summary || 'Un compromis parfait sans compromettre le plaisir de chacun.'}
                </p>
              </div>

              <div className="space-y-4">
                {consensusResult.recommendations?.map((rec: any, idx: number) => {
                  const match = CURATED_MOVIES.find((m) =>
                    m.title.toLowerCase().includes(rec.title.toLowerCase())
                  );
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#171a2d] border border-white/10 hover:border-purple-500/40 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {match?.poster && (
                            <img
                              src={match.poster}
                              alt=""
                              className="w-14 aspect-[2/3] rounded-lg object-cover shadow border border-white/10 shrink-0"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-lg text-white">
                                {rec.title} ({rec.year})
                              </h4>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {rec.consensusScore}% Consensus
                              </span>
                            </div>
                            <div className="text-xs text-purple-300 font-medium mt-0.5">
                              {rec.suggestedPlatform} · {rec.runtime ? `${rec.runtime} min` : 'Format film'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenMovie(rec.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>Voir sur CinéScope</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 leading-relaxed">
                        <span className="font-semibold text-purple-200">L'avis de l'arbitre IA : </span>
                        {rec.generalReason}
                      </p>

                      {/* Individual Friend Breakdown */}
                      <div className="space-y-2 pt-1 border-t border-white/5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Pourquoi chaque ami va aimer :
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rec.friendBreakdown?.map((fb: any, fIdx: number) => {
                            const friendObj = friends.find((f) => f.name.toLowerCase() === fb.friendName.toLowerCase());
                            return (
                              <div
                                key={fIdx}
                                className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                              >
                                <div
                                  className={`w-5 h-5 rounded-full ${friendObj?.avatarColor || 'bg-purple-600'} text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5`}
                                >
                                  {fb.friendName.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-semibold text-white">{fb.friendName} : </span>
                                  <span className="text-slate-400">{fb.whyTheyLoveIt}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={() => setConsensusResult(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Modifier les amis & relancer</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* Friends Setup View */
            <div className="space-y-6">
              {/* Friends Pills List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Membres du groupe ({friends.length})
                  </span>
                  {!isAdding && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un ami</span>
                    </button>
                  )}
                </div>

                {/* Add Friend Input inline */}
                {isAdding && (
                  <div className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-[#171a2d] border border-purple-500/40">
                    <input
                      type="text"
                      placeholder="Prénom de votre ami(e)..."
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                      className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddFriend}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {friends.map((friend) => {
                    const isActive = friend.id === currentFriend.id;
                    return (
                      <button
                        key={friend.id}
                        type="button"
                        onClick={() => setActiveFriendId(friend.id)}
                        className={`px-3 py-2 rounded-2xl border text-xs font-medium flex items-center gap-2 transition-all ${
                          isActive
                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                            : 'bg-[#171a2d] border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${friend.avatarColor} text-white font-bold text-xs flex items-center justify-center`}
                        >
                          {friend.name.charAt(0)}
                        </div>
                        <span>{friend.name}</span>
                        {friends.length > 2 && (
                          <div
                            onClick={(e) => handleRemoveFriend(friend.id, e)}
                            className="p-0.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editing active friend's preferences */}
              <div className="p-5 rounded-2xl bg-[#171a2d] border border-white/10 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div
                    className={`w-9 h-9 rounded-xl ${currentFriend.avatarColor} text-white font-bold text-base flex items-center justify-center shadow`}
                  >
                    {currentFriend.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">
                      Goûts de {currentFriend.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Personnalisez ce que {currentFriend.name} aime et refuse absolument de voir
                    </p>
                  </div>
                </div>

                {/* Favorite genres */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Genres adorés de {currentFriend.name} :</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_GENRES.map((g) => {
                      const isLoved = currentFriend.favoriteGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleToggleGenre(g)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                            isLoved
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                              : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {g} {isLoved ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dislikes / dealbreakers */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>À éviter absolument pour {currentFriend.name} :</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_DISLIKES.map((d) => {
                      const isDisliked = currentFriend.dislikes.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleToggleDislike(d)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                            isDisliked
                              ? 'bg-rose-600/20 border-rose-500 text-rose-200'
                              : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d} {isDisliked ? '✕' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  onClick={handleFindMatch}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Trouver le film parfait pour tous les amis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
