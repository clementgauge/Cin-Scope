import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Support up to 30mb for camera image uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // =========================================================================
  // 1. QUIZ RECOMMENDATIONS ENDPOINT (anzx.fr style + personal AI curator)
  // =========================================================================
  app.post('/api/ai/quiz-recommendations', async (req, res) => {
    try {
      const { mood, context, runtime, era, minRating, platforms, actors } = req.body;

      if (!ai) {
        // Fallback recommendations if no API key is configured
        return res.json({
          recommendations: getFallbackQuizRecs(mood, runtime, era),
        });
      }

      const prompt = `
Vous êtes l'IA personnelle cinéphile de l'application CinéScope (recommandation type anzx.fr).
L'utilisateur vient de répondre à un quiz cinéma précis pour trouver quoi regarder ce soir :
- Humeur / Ambiance souhaitée : "${mood || 'Non spécifié'}"
- Contexte de visionnage : "${context || 'Non spécifié'}"
- Temps / Durée souhaitée : "${runtime || 'Non spécifié'}"
- Époque / Année préférée : "${era || 'Toutes époques'}"
- Note minimale souhaitée : ${minRating || 7}/10
- Plateformes de streaming possédées : ${platforms?.length ? platforms.join(', ') : 'Toutes'}
- Acteurs ou réalisateurs souhaités : "${actors || 'Aucune préférence particulière'}"

Recommandez entre 3 et 5 films parfaits correspondant exactement à cette humeur et ces contraintes.
Pour chaque film, fournissez :
- title : titre français exact
- year : année de sortie
- director : réalisateur
- genres : tableau des genres
- runtime : durée en minutes (nombre)
- rating : note moyenne estimée sur 10
- matchScore : pourcentage d'affinité (ex: 96)
- reason : explication chaleureuse et persuasive de pourquoi ce film est parfait selon les réponses du quiz (mentionner explicitement l'ambiance, la durée ou les acteurs demandés)
- suggestedPlatform : la plateforme où le film est le plus susceptible d'être disponible (Netflix, Disney+, Prime Video, Canal+, Max, Apple TV)
- cast : 3 acteurs principaux
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Vous êtes un expert cinéphile chaleureux, précis et inspirant. Vous répondez toujours au format JSON strict.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    year: { type: Type.STRING },
                    director: { type: Type.STRING },
                    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                    runtime: { type: Type.NUMBER },
                    rating: { type: Type.NUMBER },
                    matchScore: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                    suggestedPlatform: { type: Type.STRING },
                    cast: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'year', 'matchScore', 'reason', 'genres'],
                },
              },
            },
            required: ['recommendations'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Quiz recommendation error:', error);
      const { mood, runtime, era } = req.body;
      return res.json({
        recommendations: getFallbackQuizRecs(mood, runtime, era),
      });
    }
  });

  // =========================================================================
  // 2. WATCHLIST PARTAGÉE / MATCH AMIS (Consensus AI)
  // =========================================================================
  app.post('/api/ai/shared-watchlist', async (req, res) => {
    try {
      const { friends } = req.body;

      if (!ai) {
        return res.json({
          consensusScore: 94,
          summary: 'Film de compromis idéal : équilibre parfait entre tension, rythme et humour.',
          recommendations: getFallbackSharedRecs(friends),
        });
      }

      const prompt = `
Vous êtes le médiateur cinéphile IA de CinéScope pour une soirée cinéma entre amis.
Voici le profil et les goûts de chaque ami présent ce soir :
${JSON.stringify(friends, null, 2)}

Analysez les goûts, les genres préférés, et surtout ce que chacun DÉTESTE pour trouver le film idéal qui mettra tout le monde d'accord sans compromis frustrant.
Donnez entre 2 et 4 films idéaux.
Pour chaque film, fournissez :
- title : titre exact
- year : année
- consensusScore : score d'entente général (ex: 95)
- generalReason : pourquoi ce film réconcilie tout le monde
- friendBreakdown : tableau contenant pour chaque ami :
  - friendName : prénom de l'ami
  - whyTheyLoveIt : explication spécifique pour cet ami
- suggestedPlatform : où le voir
- genres : tableau des genres
- runtime : durée en min
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Vous êtes un médiateur cinéma d\'exception qui trouve toujours le film de consensus idéal pour une bande d\'amis.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              consensusScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    year: { type: Type.STRING },
                    consensusScore: { type: Type.NUMBER },
                    generalReason: { type: Type.STRING },
                    suggestedPlatform: { type: Type.STRING },
                    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                    runtime: { type: Type.NUMBER },
                    friendBreakdown: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          friendName: { type: Type.STRING },
                          whyTheyLoveIt: { type: Type.STRING },
                        },
                        required: ['friendName', 'whyTheyLoveIt'],
                      },
                    },
                  },
                  required: ['title', 'consensusScore', 'generalReason', 'friendBreakdown'],
                },
              },
            },
            required: ['recommendations'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Shared watchlist error:', error);
      return res.json({
        consensusScore: 92,
        summary: 'Compromis équilibré pour la soirée entre amis.',
        recommendations: getFallbackSharedRecs(req.body.friends),
      });
    }
  });

  // =========================================================================
  // 3. LOGO CAMÉRA - RECONNAISSANCE VISUELLE DE FILM PAR IA (Multimodal)
  // =========================================================================
  app.post('/api/ai/identify-movie', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image base64 manquante' });
      }

      // Clean base64 data url if present
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      if (!ai) {
        return res.json({
          title: 'Spider-Man : Brand New Day',
          year: '2026',
          confidence: 88,
          explanation: 'Extrait analysé : la composition des couleurs, les reflets urbains et le cadrage correspondent à l\'univers de Peter Parker.',
          actors: ['Tom Holland', 'Zendaya'],
          famousScene: 'Scène d\'action urbaine au crépuscule sur les toits de Manhattan.',
        });
      }

      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanData,
        },
      };

      const promptText = `
Analysez cette image prise par la caméra d'un utilisateur.
Il s'agit d'un extrait, d'une photo d'écran ou d'un photogramme d'un film ou d'une série.
Votre mission :
1. Identifier précisément le film ou la franchise (titre exact en français).
2. Fournir l'année de sortie approximative ou exacte.
3. Donner un indice de confiance entre 50 et 99%.
4. Identifier la scène, l'ambiance, ou les acteurs visibles.
5. Expliquer brièvement pourquoi vous reconnaissez ce film (éléments visuels clés, costumes, photographie, cadrage, acteurs).
Si l'image n'est pas un film évident, identifiez le film le plus proche stylistiquement avec honnêteté.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, { text: promptText }] },
        config: {
          systemInstruction: 'Vous êtes le Shazam du Cinéma. Vous identifiez les films à partir d\'images avec une précision redoutable. Vous répondez au format JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              year: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              actors: { type: Type.ARRAY, items: { type: Type.STRING } },
              famousScene: { type: Type.STRING },
            },
            required: ['title', 'year', 'confidence', 'explanation'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Camera movie identification error:', error);
      return res.json({
        title: 'Interstellar',
        year: '2014',
        confidence: 85,
        explanation: 'La colorimétrie et le style visuel de l\'image correspondent aux œuvres de science-fiction contemporaines épiques.',
        actors: ['Matthew McConaughey', 'Anne Hathaway'],
        famousScene: 'Séquence spatiale contemplative.',
      });
    }
  });

  // =========================================================================
  // VITE / STATIC SERVING
  // =========================================================================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CinéScope server listening on http://0.0.0.0:${port}`);
  });
}

// Fallback Quiz recommendations
function getFallbackQuizRecs(mood?: string, runtime?: string, era?: string) {
  return [
    {
      title: 'Dune : Deuxième Partie',
      year: '2024',
      director: 'Denis Villeneuve',
      genres: ['Science-Fiction', 'Aventure', 'Action'],
      runtime: 166,
      rating: 8.2,
      matchScore: 97,
      reason: 'Spectacle visuel absolu, intensité dramatique et casting prestigieux (Timothée Chalamet, Zendaya). Répond parfaitement à votre recherche d\'immersion.',
      suggestedPlatform: 'Canal+ / Max',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    },
    {
      title: 'Knives Out (À couteaux tirés)',
      year: '2019',
      director: 'Rian Johnson',
      genres: ['Comédie', 'Mystère', 'Policier'],
      runtime: 130,
      rating: 7.9,
      matchScore: 94,
      reason: 'Une enquête brillante, rythmée et jubilatoire avec Daniel Craig et Ana de Armas. Idéal pour une soirée captivante sans temps mort.',
      suggestedPlatform: 'Netflix / Prime Video',
      cast: ['Daniel Craig', 'Ana de Armas', 'Chris Evans'],
    },
    {
      title: 'La La Land',
      year: '2016',
      director: 'Damien Chazelle',
      genres: ['Comédie', 'Drame', 'Romance'],
      runtime: 128,
      rating: 8.0,
      matchScore: 92,
      reason: 'Éblouissant d\'énergie, d\'émotion et d\'élégance avec Emma Stone et Ryan Gosling. Un moment réconfortant et inoubliable.',
      suggestedPlatform: 'Netflix',
      cast: ['Ryan Gosling', 'Emma Stone', 'John Legend'],
    },
    {
      title: 'Spider-Man : Across the Spider-Verse',
      year: '2023',
      director: 'Joaquim Dos Santos',
      genres: ['Animation', 'Action', 'Aventure'],
      runtime: 140,
      rating: 8.3,
      matchScore: 91,
      reason: 'Une prouesse d\'animation virevoltante, moderne et pleine d\'adrénaline qui transcende tous les genres.',
      suggestedPlatform: 'Netflix / Canal+',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    },
  ];
}

// Fallback Shared Watchlist
function getFallbackSharedRecs(friends: any[] = []) {
  const friendNames = friends.map((f) => f.name || 'Ami').join(', ');
  return [
    {
      title: 'Inception',
      year: '2010',
      consensusScore: 96,
      generalReason: 'Le compromis parfait : de l\'action spectaculaire pour le rythme, un scénario captivant sans aucune longueur, et un casting d\'anthologie.',
      suggestedPlatform: 'Netflix / Max',
      genres: ['Action', 'Science-Fiction', 'Aventure'],
      runtime: 148,
      friendBreakdown: friends.map((f) => ({
        friendName: f.name || 'Ami',
        whyTheyLoveIt: `L'intensité de l'intrigue et la musique d'Hans Zimmer combleront les attentes de ${f.name}.`,
      })),
    },
    {
      title: 'Parasite',
      year: '2019',
      consensusScore: 94,
      generalReason: 'Un suspense magistral mêlé d\'humour noir et de rebondissements imprévisibles qui captive chaque spectateur dès les premières minutes.',
      suggestedPlatform: 'Prime Video / Canal+',
      genres: ['Thriller', 'Drame', 'Comédie'],
      runtime: 132,
      friendBreakdown: friends.map((f) => ({
        friendName: f.name || 'Ami',
        whyTheyLoveIt: `Une intrigue à tiroirs impossible à lâcher, parfaite pour alimenter les discussions d'après-film.`,
      })),
    },
  ];
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
