import { Movie } from '../types';

export const CURATED_MOVIES: Movie[] = [
  {
    id: 'spiderman-brand-new-day',
    tmdbId: 1000001,
    imdbId: 'tt1111111',
    title: 'Spider-Man : Brand New Day',
    originalTitle: 'Spider-Man: Brand New Day',
    year: '2026',
    overview: 'Peter Parker entame un nouveau chapitre de sa vie à New York, isolé de ses proches mais plus déterminé que jamais à défendre la ville contre de nouvelles menaces émergentes. Un retour aux sources urbain spectaculaire.',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1jv8M9l.jpg',
    rating: 8.5,
    voteCount: 1200,
    genres: ['Action', 'Aventure', 'Science-Fiction'],
    runtime: 148,
    director: 'Destin Daniel Cretton',
    cast: ['Tom Holland', 'Zendaya', 'Mark Ruffalo', 'Sadie Sink'],
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [],
        rent: [],
        buy: [],
        link: 'https://www.ugc.fr'
      }
    }
  },
  {
    id: 'dune-2',
    tmdbId: 693134,
    imdbId: 'tt15239678',
    title: 'Dune : Deuxième Partie',
    originalTitle: 'Dune: Part Two',
    year: '2024',
    overview: 'Paul Atréides s\'unit à Chani et aux Fremen tout en préparant sa revanche contre les conspirateurs qui ont détruit sa famille. Devant choisir entre l\'amour de sa vie et le destin de l\'univers, il doit empêcher un futur terrible que lui seul peut prédire.',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx12N.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
    rating: 8.2,
    voteCount: 5400,
    genres: ['Science-Fiction', 'Aventure', 'Action'],
    runtime: 166,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' },
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 3, provider_name: 'Google Play', logo_path: '/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg' },
          { provider_id: 58, provider_name: 'Canal VOD', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        buy: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/dune-deuxieme-partie'
      },
      US: {
        flatrate: [
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ]
      }
    }
  },
  {
    id: 'oppenheimer',
    tmdbId: 872585,
    imdbId: 'tt15398776',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    year: '2023',
    overview: 'L\'histoire du physicien J. Robert Oppenheimer et de son rôle déterminant dans le Projet Manhattan ayant conduit à la conception de la première bombe atomique.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    rating: 8.1,
    voteCount: 8900,
    genres: ['Drame', 'Histoire', 'Biopic'],
    runtime: 180,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 3, provider_name: 'Google Play', logo_path: '/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg' }
        ],
        buy: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/oppenheimer'
      }
    }
  },
  {
    id: 'anatomie-dune-chute',
    tmdbId: 915935,
    imdbId: 'tt17009710',
    title: 'Anatomie d\'une chute',
    originalTitle: 'Anatomie d\'une chute',
    year: '2023',
    overview: 'Samuel est retrouvé mort dans la neige au pied du chalet isolé où il vit avec sa femme Sandra et leur fils malvoyant de 11 ans, Daniel. Une enquête pour mort suspecte est ouverte. Sandra est bientôt inculpée malgré le doute.',
    poster: 'https://image.tmdb.org/t/p/w500/kQs6s9tL4XQ9Wf5E1r92E2w0vI9.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8Z8Gz5x2Uj1R5n0vF8Vqj5w1y7M.jpg',
    rating: 7.7,
    voteCount: 2200,
    genres: ['Drame', 'Thriller', 'Mystère'],
    runtime: 151,
    director: 'Justine Triet',
    cast: ['Sandra Hüller', 'Swann Arlaud', 'Milo Machado Graner', 'Antoine Reinartz'],
    trailerUrl: 'https://www.youtube.com/watch?v=mD3O51yL5tA',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 58, provider_name: 'Canal VOD', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/anatomie-d-une-chute'
      }
    }
  },
  {
    id: 'inception',
    tmdbId: 27205,
    imdbId: 'tt1375666',
    title: 'Inception',
    originalTitle: 'Inception',
    year: '2010',
    overview: 'Dom Cobb est un voleur expérimenté dans l\'art périlleux de l\'extraction : sa spécialité consiste à s\'approprier les secrets les plus précieux d\'un individu, enfouis au plus profond de son subconscient, pendant la phase de sommeil.',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8Z8Gz5x2Uj1R5n0vF8Vqj5w1y7M.jpg',
    rating: 8.4,
    voteCount: 35000,
    genres: ['Action', 'Science-Fiction', 'Aventure'],
    runtime: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 3, provider_name: 'Google Play', logo_path: '/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/inception'
      }
    }
  },
  {
    id: 'interstellar',
    tmdbId: 157336,
    imdbId: 'tt0816692',
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    year: '2014',
    overview: 'Alors que la vie sur Terre est menacée par le réchauffement climatique et la faim, un groupe d\'explorateurs utilise une faille spatio-temporelle récemment découverte pour repousser les limites humaines et parcourir des distances astronomiques.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.4,
    voteCount: 34000,
    genres: ['Aventure', 'Drame', 'Science-Fiction'],
    runtime: 169,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    trailerUrl: 'https://www.youtube.com/watch?v=VaOijhK3CRU',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' },
          { provider_id: 531, provider_name: 'Paramount+', logo_path: '/h5DcR0J2EWBFA7GQi6E394HcjMv.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/interstellar'
      }
    }
  },
  {
    id: 'spider-man-across-spider-verse',
    tmdbId: 569094,
    imdbId: 'tt9362722',
    title: 'Spider-Man : Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    year: '2023',
    overview: 'Après avoir retrouvé Gwen Stacy, Spider-Man est catapulté à travers le Multivers, où il rencontre une équipe de Spider-Héros chargée de protéger son existence même.',
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 8.3,
    voteCount: 6800,
    genres: ['Animation', 'Action', 'Aventure', 'Science-Fiction'],
    runtime: 140,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/spider-man-across-the-spider-verse'
      }
    }
  },
  {
    id: 'the-batman',
    tmdbId: 414906,
    imdbId: 'tt1877830',
    title: 'The Batman',
    originalTitle: 'The Batman',
    year: '2022',
    overview: 'Lorsqu\'un tueur en série s\'attaque à l\'élite de Gotham City en laissant de mystérieuses énigmes, Batman s\'aventure dans les bas-fonds de la ville pour démasquer le coupable et rendre justice.',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    rating: 7.7,
    voteCount: 9600,
    genres: ['Crime', 'Mystère', 'Thriller', 'Action'],
    runtime: 176,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Jeffrey Wright'],
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' },
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/the-batman'
      }
    }
  },
  {
    id: 'le-voyage-de-chihiro',
    tmdbId: 129,
    imdbId: 'tt0245429',
    title: 'Le Voyage de Chihiro',
    originalTitle: '千と千尋の神隠し',
    year: '2001',
    overview: 'Chihiro, une fillette de dix ans, est en route avec ses parents vers leur nouvelle demeure quand ils font une halte dans un parc d\'attractions désaffecté. Ses parents se transforment en cochons et Chihiro s\'engage dans un monde peuplé d\'esprits.',
    poster: 'https://image.tmdb.org/t/p/w500/393mh3Zu5oFfQk1lW5P2Q5n9PjP.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/Ab8mkHmkYADjU7wQiOkia99GQI.jpg',
    rating: 8.5,
    voteCount: 16000,
    genres: ['Animation', 'Famille', 'Fantastique'],
    runtime: 125,
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naito'],
    trailerUrl: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/le-voyage-de-chihiro'
      }
    }
  },
  {
    id: 'avatar-way-of-water',
    tmdbId: 76600,
    imdbId: 'tt1630029',
    title: 'Avatar : La Voie de l\'eau',
    originalTitle: 'Avatar: The Way of Water',
    year: '2022',
    overview: 'Jake Sully et Neytiri ont formé une famille et font tout pour rester aussi soudés que possible. Ils sont cependant contraints de quitter leur foyer et d\'explorer les différentes régions encore mystérieuses de Pandora.',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
    rating: 7.6,
    voteCount: 11000,
    genres: ['Science-Fiction', 'Aventure', 'Action'],
    runtime: 192,
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    trailerUrl: 'https://www.youtube.com/watch?v=o5F88c8xVb0',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 337, provider_name: 'Disney+', logo_path: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg' },
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/avatar-2'
      }
    }
  },
  {
    id: 'amelie-poulain',
    tmdbId: 194,
    imdbId: 'tt0211915',
    title: 'Le Fabuleux Destin d\'Amélie Poulain',
    originalTitle: 'Le Fabuleux Destin d\'Amélie Poulain',
    year: '2001',
    overview: 'Amélie, une jeune serveuse dans un bar de Montmartre, passe son temps à observer les gens et à laisser son imagination vagabonder. Elle s\'est fixé un but : faire le bien de ceux qui l\'entourent.',
    poster: 'https://image.tmdb.org/t/p/w500/sl7XQ7s1R88Q1K9ZqO25XvjI23H.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/5mzr6An4Q3b97bWkK3Qk3ZqO25X.jpg',
    rating: 7.9,
    voteCount: 11500,
    genres: ['Comédie', 'Romance'],
    runtime: 122,
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus', 'Jamel Debbouze'],
    trailerUrl: 'https://www.youtube.com/watch?v=HUECWi5pX7o',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 58, provider_name: 'Canal VOD', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/le-fabuleux-destin-d-amelie-poulain'
      }
    }
  },
  {
    id: 'parasite',
    tmdbId: 496243,
    imdbId: 'tt6751668',
    title: 'Parasite',
    originalTitle: '기생충',
    year: '2019',
    overview: 'Toute la famille de Ki-taek est au chômage et s\'intéresse fortement au train de vie de la richissime famille Park. Un jour, le fils réussit à se faire embaucher pour donner des cours particuliers d\'anglais chez les Park.',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    rating: 8.5,
    voteCount: 17500,
    genres: ['Comédie', 'Thriller', 'Drame'],
    runtime: 132,
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    trailerUrl: 'https://www.youtube.com/watch?v=5xH0hhJ98Xg',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 1899, provider_name: 'Max', logo_path: '/fksCUZ9QDWZMUwL2LgMtL9qm4wh.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 58, provider_name: 'Canal VOD', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/parasite-2019'
      }
    }
  },
  {
    id: 'pulp-fiction',
    tmdbId: 680,
    imdbId: 'tt0110912',
    title: 'Pulp Fiction',
    originalTitle: 'Pulp Fiction',
    year: '1994',
    overview: 'L\'odyssée sanglante, burlesque et philosophique de deux tueurs à gages, d\'un boxeur, de la femme d\'un gangster et de deux braqueurs à Los Angeles.',
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    rating: 8.5,
    voteCount: 27000,
    genres: ['Thriller', 'Crime'],
    runtime: 154,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman', 'Bruce Willis'],
    trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 531, provider_name: 'Paramount+', logo_path: '/h5DcR0J2EWBFA7GQi6E394HcjMv.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 3, provider_name: 'Google Play', logo_path: '/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/pulp-fiction'
      }
    }
  },
  {
    id: 'gladiator-2',
    tmdbId: 558449,
    imdbId: 'tt9218128',
    title: 'Gladiator II',
    originalTitle: 'Gladiator II',
    year: '2024',
    overview: 'Des années après la mort du héros Maximus, Lucius est forcé d\'entrer dans le Colisée après que sa patrie ait été conquise par les empereurs tyranniques qui dirigent désormais Rome d\'une main de fer.',
    poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnExHgufVtu5252.jpg',
    rating: 6.8,
    voteCount: 2100,
    genres: ['Action', 'Aventure', 'Drame'],
    runtime: 148,
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/gladiator-2'
      }
    }
  },
  {
    id: 'le-comte-de-monte-cristo',
    tmdbId: 1005331,
    imdbId: 'tt26443598',
    title: 'Le Comte de Monte-Cristo',
    originalTitle: 'Le Comte de Monte-Cristo',
    year: '2024',
    overview: 'Victime d’un complot, le jeune Edmond Dantès est arrêté le jour de son mariage pour un crime qu’il n’a pas commis. Après quatorze ans de détention au château d’If, il parvient à s’évader. Devenu immensément riche, il revient sous l’identité du comte de Monte-Cristo pour se venger.',
    poster: 'https://image.tmdb.org/t/p/w500/5W9gQ3s202cxhvwyEwRlysAmRH4.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/p9n2G91F9zX0h1M5n0vF8Vqj5w1.jpg',
    rating: 8.0,
    voteCount: 1500,
    genres: ['Aventure', 'Drame', 'Action', 'Histoire'],
    runtime: 178,
    director: 'Matthieu Delaporte, Alexandre De La Patellière',
    cast: ['Pierre Niney', 'Anaïs Demoustier', 'Laurent Lafitte', 'Bastien Bouillon'],
    trailerUrl: 'https://www.youtube.com/watch?v=D-CjT1_s3wY',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 381, provider_name: 'Canal+', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' },
          { provider_id: 58, provider_name: 'Canal VOD', logo_path: '/pA5469nZ0O7bQy6Xb7Nn8gN1Ghy.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/le-comte-de-monte-cristo-2024'
      }
    }
  },
  {
    id: 'la-la-land',
    tmdbId: 313369,
    imdbId: 'tt3783958',
    title: 'La La Land',
    originalTitle: 'La La Land',
    year: '2016',
    overview: 'Au cœur de Los Angeles, une actrice en devenir prénommée Mia sert des cafés entre deux auditions. De son côté, Sebastian, passionné de jazz, joue du piano dans des clubs miteux pour assurer sa subsistance.',
    poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkVJt0Rf0.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/qJeU7KM4pR7G8tYq4M6k8L7Vw9.jpg',
    rating: 7.9,
    voteCount: 16500,
    genres: ['Comédie', 'Drame', 'Romance', 'Musique'],
    runtime: 128,
    director: 'Damien Chazelle',
    cast: ['Ryan Gosling', 'Emma Stone', 'John Legend', 'J.K. Simmons'],
    trailerUrl: 'https://www.youtube.com/watch?v=0pdqf4P9MB8',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 8, provider_name: 'Netflix', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
          { provider_id: 119, provider_name: 'Prime Video', logo_path: '/emthp39XA2zhRMTv2xfZiPwQ7oZ.jpg' }
        ],
        rent: [
          { provider_id: 2, provider_name: 'Apple TV', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' },
          { provider_id: 3, provider_name: 'Google Play', logo_path: '/tbEdVknR5i8QdE6bRIuG5g8yDqL.jpg' }
        ],
        link: 'https://www.justwatch.com/fr/film/la-la-land'
      }
    }
  },
  {
    id: 'ted-lasso-movie',
    tmdbId: 106272,
    imdbId: 'tt10986410',
    title: 'CODA',
    originalTitle: 'CODA',
    year: '2021',
    overview: 'Ruby, 17 ans, est la seule personne entendante de sa famille. Quand le commerce familial de pêche est menacé, Ruby est déchirée entre son amour pour la musique et sa peur d’abandonner ses parents.',
    poster: 'https://image.tmdb.org/t/p/w500/BzVjmm8l23rPsIgWTaNJRvy4nK.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7k8H9L6K7Vw9qJeU7KM4pR7G8t.jpg',
    rating: 8.0,
    voteCount: 2400,
    genres: ['Drame', 'Musique', 'Comédie'],
    runtime: 111,
    director: 'Siân Heder',
    cast: ['Emilia Jones', 'Marlee Matlin', 'Troy Kotsur', 'Daniel Durant'],
    trailerUrl: 'https://www.youtube.com/watch?v=0pmfrE1YL4I',
    source: 'curated',
    cachedProviders: {
      FR: {
        flatrate: [
          { provider_id: 350, provider_name: 'Apple TV+', logo_path: '/2E03jvSV7P2m7gTzG1kK929p4e8.jpg' }
        ],
        rent: [],
        link: 'https://www.justwatch.com/fr/film/coda-2021'
      }
    }
  }
];
